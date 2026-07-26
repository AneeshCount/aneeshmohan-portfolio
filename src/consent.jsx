import { useEffect, useState } from 'react';
import { useLang } from './i18n.jsx';
import { CONSENT_KEY } from './config.js';

/* ════════════════════════════════════════════════════════════════════════
   Cookie consent. index.html sets Consent Mode v2 to denied before GTM
   loads; this component is the only place that ever moves it to granted.
   ════════════════════════════════════════════════════════════════════════ */

/* localStorage throws in private mode and in some embedded webviews, so
   every access is guarded: a failed read just re-shows the banner. */
function readChoice() {
  try {
    const saved = localStorage.getItem(CONSENT_KEY);
    return saved === 'granted' || saved === 'denied' ? saved : null;
  } catch {
    return null;
  }
}

function writeChoice(value) {
  try { localStorage.setItem(CONSENT_KEY, value); } catch { /* private mode */ }
}

export function pushConsent(granted) {
  const state = granted ? 'granted' : 'denied';
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'update', {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  });
  /* Clarity does not read Consent Mode, it has its own API. Without this
     call it would keep recording after a visitor declines. No-op until
     Clarity has loaded through GTM, which is why the saved choice is
     replayed on every mount rather than only on the click. */
  try { window.clarity?.('consent', granted); } catch { /* not loaded */ }
}

export default function ConsentBanner() {
  const { s } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = readChoice();
    if (saved) pushConsent(saved === 'granted');
    else setVisible(true);
  }, []);

  const choose = (granted) => {
    writeChoice(granted ? 'granted' : 'denied');
    pushConsent(granted);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    /* Dusk regardless of where the page is scrolled to: the banner is an
       overlay on top of everything, so it needs one fixed identity rather than
       inheriting whichever half happens to be behind it. */
    <div data-regime="dusk" className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-hair/10 bg-panel/95 backdrop-blur-md p-5 sm:p-6 shadow-2xl">
        <p className="text-[13px] text-muted leading-relaxed">{s.consent.p}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => choose(true)} className="rounded-full bg-accent text-ink font-mono text-[11px] uppercase tracking-[0.14em] px-5 py-2.5 hover:brightness-110 transition tactile">{s.consent.accept}</button>
          <button onClick={() => choose(false)} className="rounded-full border border-hair/20 text-muted font-mono text-[11px] uppercase tracking-[0.14em] px-5 py-2.5 hover:text-ivory hover:border-hair/40 transition">{s.consent.decline}</button>
        </div>
      </div>
    </div>
  );
}
