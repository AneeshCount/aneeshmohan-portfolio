import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Contact, buildSubmission } from '../src/sections/contact.jsx';
import { LangProvider } from '../src/i18n.jsx';
import { WEB3FORMS_KEY } from '../src/config.js';

/* The contact form is the site's only conversion path. A regression here is
   not a cosmetic bug, it is a lost enquiry that nobody ever finds out about. */

const mount = () => render(<LangProvider><Contact /></LangProvider>);

/* Queried by id rather than by label so the test reads the same in any of
   the four languages the provider might default to. */
const fill = async (user, container) => {
  await user.type(container.querySelector('#cf-name'), 'Dana Fischer');
  await user.type(container.querySelector('#cf-email'), 'dana@example.com');
  await user.type(container.querySelector('#cf-msg'), 'We need a voice agent.');
};

const submit = (user) => user.click(screen.getByRole('button', { name: /send/i }));

describe('buildSubmission', () => {
  it('attaches the relay key and a named subject', () => {
    const data = new FormData();
    data.append('name', 'Dana Fischer');
    const out = buildSubmission(data);
    expect(out.get('access_key')).toBe(WEB3FORMS_KEY);
    expect(out.get('subject')).toBe('a-niche New Enquiry from Dana Fischer');
  });

  it('falls back to a generic subject when no name is given', () => {
    expect(buildSubmission(new FormData()).get('subject')).toBe('a-niche New Enquiry');
  });
});

describe('contact form', () => {
  it('posts to the relay and confirms', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ success: true }) });
    vi.stubGlobal('fetch', fetchMock);

    const { container } = mount();
    await fill(user, container);
    await submit(user);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/^https:\/\/api\.web3forms\.com/);
    expect(options.body.get('email')).toBe('dana@example.com');
    expect(screen.queryByRole('button', { name: /send/i })).not.toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it('surfaces a failure instead of pretending it sent', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    const { container } = mount();
    await fill(user, container);
    await submit(user);

    expect(await screen.findByRole('status')).toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it('drops a submission that filled the honeypot', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const { container } = mount();
    await fill(user, container);
    container.querySelector('input[name="botcheck"]').checked = true;
    await submit(user);

    expect(fetchMock).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('opens every social link safely in a new tab', () => {
    const { container } = mount();
    const externals = [...container.querySelectorAll('a[target="_blank"]')];
    expect(externals.length).toBeGreaterThan(0);
    for (const a of externals) expect(a.getAttribute('rel')).toContain('noreferrer');
  });
});
