import React, { useEffect, useState } from 'react';
import { useLang } from './i18n.jsx';

const KEY = 'a-niche-consent';

function pushConsent(granted) {
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'update', {
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
  });
}

export default function ConsentBanner() {
  const { s } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === 'granted' || saved === 'denied') {
      pushConsent(saved === 'granted');
    } else {
      setVisible(true);
    }
  }, []);

  const choose = (granted) => {
    localStorage.setItem(KEY, granted ? 'granted' : 'denied');
    pushConsent(granted);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6">
      <div className="mx-auto max-w-2xl rounded-xl border border-white/[0.08] bg-panel/95 backdrop-blur-md p-5 sm:p-6 shadow-2xl">
        <p className="text-[13px] text-muted leading-relaxed">{s.consent.p}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => choose(true)} className="rounded-full bg-accent text-ink font-mono text-[11px] uppercase tracking-[0.14em] px-5 py-2.5 hover:bg-ivory transition">{s.consent.accept}</button>
          <button onClick={() => choose(false)} className="rounded-full border border-white/15 text-muted font-mono text-[11px] uppercase tracking-[0.14em] px-5 py-2.5 hover:text-ivory hover:border-white/30 transition">{s.consent.decline}</button>
        </div>
      </div>
    </div>
  );
}
