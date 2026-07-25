import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App.jsx';
import { LangProvider, LANGS, STR } from '../src/i18n.jsx';
import { NAV_IDS } from '../src/config.js';
import { PROJECTS } from '../src/data.js';
import { insightsHref } from '../src/sections/insights.jsx';

/* A smoke test over the whole page. It will not catch a design regression,
   but it does catch the class of breakage that ships silently: a section
   losing its anchor so the nav scrolls nowhere, a language rendering
   `undefined`, or the insights link dropping the reader's language. */

const mount = () => render(<LangProvider><App /></LangProvider>);

describe('homepage', () => {
  it('renders every section the nav points at', () => {
    const { container } = mount();
    for (const id of NAV_IDS) {
      expect(container.querySelector(`#${id}`), `#${id}`).not.toBeNull();
    }
  });

  it('renders without leaking undefined into the copy', () => {
    const { container } = mount();
    expect(container.textContent).not.toMatch(/undefined|\[object Object\]/);
  });

  it('shows a preview of the work, not the whole list', () => {
    mount();
    expect(screen.getByText(PROJECTS[0].name)).toBeInTheDocument();
    expect(screen.queryByText(PROJECTS.at(-1).name)).not.toBeInTheDocument();
  });

  it('expands to the full project list on request', async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole('button', { name: new RegExp(STR.EN.work.showAll, 'i') }));
    expect(screen.getByText(PROJECTS.at(-1).name)).toBeInTheDocument();
  });

  it('links to insights with the current language attached', () => {
    const { container } = mount();
    const links = [...container.querySelectorAll('a[href^="insights/"]')];
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) expect(link.getAttribute('href')).toMatch(/^insights\/\?lang=EN(#|$)/);
    expect(links.map((l) => l.getAttribute('href'))).toContain(insightsHref('EN'));
  });

  it('sends every external link out safely', () => {
    const { container } = mount();
    for (const a of container.querySelectorAll('a[target="_blank"]')) {
      expect(a.getAttribute('rel'), a.getAttribute('href')).toContain('noreferrer');
    }
  });

  it('gives every in-page nav link a section to land on', () => {
    const { container } = mount();
    for (const a of container.querySelectorAll('a[href^="#"]')) {
      const id = a.getAttribute('href').slice(1);
      if (!id) continue;
      expect(container.querySelector(`#${id}`), `#${id}`).not.toBeNull();
    }
  });
});

describe('language switching', () => {
  it.each(LANGS)('renders the whole page in %s', (lang) => {
    localStorage.setItem('lang', lang);
    const { container } = mount();
    expect(container.textContent).toContain(STR[lang].hero.view);
    expect(container.textContent).not.toMatch(/undefined/);
  });

  it('swaps the copy when a visitor picks another language', async () => {
    const user = userEvent.setup();
    const { container } = mount();
    expect(container.textContent).toContain(STR.EN.hero.view);
    await user.click(screen.getAllByRole('button', { name: 'DE' })[0]);
    expect(container.textContent).toContain(STR.DE.hero.view);
  });

  it('records the choice so the next visit keeps it', async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getAllByRole('button', { name: 'ES' })[0]);
    expect(localStorage.getItem('lang')).toBe('ES');
  });

  it('marks the document language for screen readers and search engines', async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getAllByRole('button', { name: 'FR' })[0]);
    expect(document.documentElement.lang).toBe('fr');
  });
});
