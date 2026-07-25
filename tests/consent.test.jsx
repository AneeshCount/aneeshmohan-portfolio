import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConsentBanner, { pushConsent } from '../src/consent.jsx';
import { LangProvider } from '../src/i18n.jsx';
import { CONSENT_KEY } from '../src/config.js';

/* Consent is the one piece of this site with a legal consequence attached.
   The failure mode that matters is silent: analytics keeps recording after
   a visitor declines, and nothing on screen looks wrong. */

const mount = () => render(<LangProvider><ConsentBanner /></LangProvider>);

describe('consent banner', () => {
  it('asks on a first visit', async () => {
    mount();
    expect(await screen.findByRole('button', { name: /accept/i })).toBeInTheDocument();
  });

  it('stays hidden once a choice is stored', () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    mount();
    expect(screen.queryByRole('button', { name: /accept/i })).not.toBeInTheDocument();
  });

  it('records the choice and dismisses itself', async () => {
    const user = userEvent.setup();
    mount();
    await user.click(await screen.findByRole('button', { name: /accept/i }));
    expect(localStorage.getItem(CONSENT_KEY)).toBe('granted');
    expect(screen.queryByRole('button', { name: /accept/i })).not.toBeInTheDocument();
  });

  it('replays a stored denial to Clarity on mount, not just on the click', () => {
    /* Clarity loads through GTM after this component mounts, so the choice
       has to be pushed again on every page view or it never reaches it. */
    const clarity = vi.fn();
    window.clarity = clarity;
    localStorage.setItem(CONSENT_KEY, 'denied');
    mount();
    expect(clarity).toHaveBeenCalledWith('consent', false);
    delete window.clarity;
  });
});

describe('pushConsent', () => {
  it('updates all four Consent Mode v2 signals', () => {
    window.dataLayer = [];
    pushConsent(true);
    const [type, action, payload] = window.dataLayer.at(-1);
    expect([type, action]).toEqual(['consent', 'update']);
    expect(payload).toEqual({
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
  });

  it('denies every signal when the visitor declines', () => {
    window.dataLayer = [];
    pushConsent(false);
    const payload = window.dataLayer.at(-1)[2];
    expect(Object.values(payload).every((v) => v === 'denied')).toBe(true);
  });

  it('survives Clarity not being loaded yet', () => {
    delete window.clarity;
    expect(() => pushConsent(true)).not.toThrow();
  });
});
