import React, { useEffect, useRef, useState } from 'react';
import { LANGS, useLang } from './i18n.jsx';

/* ════════════════════════════════════════════════════════════════════════
   Shared UI primitives and hooks, used by both the homepage sections and
   the /insights reader. Nothing here knows about page structure.
   ════════════════════════════════════════════════════════════════════════ */

export const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

/* Reveal-on-scroll. Elements marked `.reveal` fade in once and are then
   unobserved. Pass deps when the section can add elements after mount. */
export function useReveal(deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal:not(.in)') ?? [];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.14 }
    );
    els.forEach((el, i) => { el.style.animationDelay = `${(i % 4) * 0.1}s`; io.observe(el); });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/* Cursor spotlight for `.spot` surfaces. One delegated listener for the whole
   page rather than one per card, and it never runs on touch devices, where
   there is no cursor to follow and the work would be pure battery cost. */
export function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return;
    let frame = 0;
    const onMove = (e) => {
      const card = e.target.closest?.('.spot');
      if (!card || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(frame); };
  }, []);
}

/* Tracks which section is currently in view so the nav can say where the
   visitor is. Returns the id of the section nearest the top of the viewport. */
export function useActiveSection(ids) {
  /* Null until a section is genuinely in view, so the hero does not arrive
     with the first nav item already marked as where you are. */
  const [active, setActive] = useState(null);
  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          setActive(visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0].target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

export const Arrow = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

/* The mark: an alcove/niche, the recessed space where one considered piece
   is set. Literalizes the brand name; the dot is the work on display. */
export const Logomark = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6.5 19V11.5A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 5.5 5.5V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="12.5" r="1.6" fill="#2FE3BE" />
  </svg>
);

export const Wordmark = ({ className = '' }) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <Logomark className="w-5 h-5 text-ivory/80" />
    <span className="font-display tracking-tight">a<span className="text-accent">-</span>niche</span>
  </span>
);

export function LangSwitch({ className = '' }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`flex items-center font-mono text-[10px] tracking-[0.08em] ${className}`}>
      {LANGS.map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 && <span className="text-white/15 px-1">·</span>}
          <button onClick={() => setLang(l)} aria-pressed={l === lang}
            className={`transition ${l === lang ? 'text-accent' : 'text-muted/60 hover:text-ivory'}`}>{l}</button>
        </React.Fragment>
      ))}
    </div>
  );
}
