import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LANGS, useLang } from './i18n.jsx';
import { applyTier, detectTier, persistTier, resolveTier } from './motion.js';

/* ════════════════════════════════════════════════════════════════════════
   Shared UI primitives and hooks, used by both the homepage sections and the
   /insights reader. Nothing here knows about page structure.
   ════════════════════════════════════════════════════════════════════════ */

export const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

/* Resolves a palette token to a canvas-usable colour string.

   Canvas has no stylesheet, so a `ctx.fillStyle` cannot be a class and cannot
   read a CSS variable directly. Reading the variable off the element itself
   keeps the waveform on the same palette as everything around it: change
   --c-accent in one place and the canvas follows, rather than drifting to
   whatever hex was hardcoded when it was written.

   `el` must be inside the regime whose colour is wanted, since the variable is
   scoped to the zone wrapper rather than to :root. */
export function tokenColor(el, name, alpha = 1) {
  const fallback = '167 163 188';
  let triple = fallback;
  try {
    triple = getComputedStyle(el).getPropertyValue(name).trim() || fallback;
  } catch { /* detached node: the fallback is a neutral that reads on both halves */ }
  return `rgb(${triple} / ${alpha})`;
}

/* ── Motion ─────────────────────────────────────────────────────────────
   The tier is applied to <html> on mount and exposed to components that
   should skip mounting work rather than merely hide it: the particle canvas
   never starts a rAF loop at `calm`, and the orbit never starts a timer.
   ──────────────────────────────────────────────────────────────────────── */
export function useMotion() {
  const [tier, setTier] = useState(resolveTier);

  useEffect(() => { applyTier(tier); }, [tier]);

  /* A visitor who changes their OS setting mid-visit should not have to
     reload, and should not have an explicit on-page choice overridden. */
  useEffect(() => {
    const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mql?.addEventListener) return;
    const onChange = () => setTier(resolveTier());
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  /* The toggle is deliberately binary. Three named tiers are the right model
     internally, but a visitor only ever wants "yes, animate" or "stop". */
  const setMotion = useCallback((on) => {
    const next = on ? 'full' : 'still';
    persistTier(next);
    setTier(next);
  }, []);

  const clearMotion = useCallback(() => {
    persistTier(null);
    setTier(detectTier());
  }, []);

  return { tier, moving: tier !== 'still', full: tier === 'full', setMotion, clearMotion };
}

export function MotionToggle({ className = '' }) {
  const { s } = useLang();
  const { moving, setMotion } = useMotion();
  return (
    <button
      onClick={() => setMotion(!moving)}
      aria-pressed={moving}
      className={`inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted hover:text-ivory transition ${className}`}
    >
      <span
        className={`inline-block w-6 h-3 rounded-full border transition-colors ${
          moving ? 'border-accent/60 bg-accent/25' : 'border-hair/25'
        }`}
      >
        <span
          className={`block w-1.5 h-1.5 rounded-full mt-[3px] transition-transform ${
            moving ? 'translate-x-[15px] bg-accent' : 'translate-x-[3px] bg-muted'
          }`}
        />
      </span>
      {s.motion.label}
    </button>
  );
}

/* A media query as state, for the cases where the two layouts genuinely differ
   in structure rather than in styling. Tailwind's `hidden md:block` is the
   right tool when both layouts can coexist in the DOM; it is the wrong tool
   when that would duplicate content, ids and refs, which is what the orbit
   would do if it rendered its arc and its fallback strip at the same time. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    try { return window.matchMedia?.(query).matches ?? false; } catch { return false; }
  });
  useEffect(() => {
    const mql = window.matchMedia?.(query);
    if (!mql) return;
    /* Read on mount as well as on change: the query can already have flipped
       between the initial render and this effect. */
    const sync = () => setMatches(mql.matches);
    sync();
    mql.addEventListener?.('change', sync);
    /* A resize listener as well, not instead. `change` is the precise signal,
       but it is the only signal, and a layout that silently keeps the wrong
       structure when it does not arrive is a bad failure mode for something
       deciding between two different component trees. */
    window.addEventListener('resize', sync);
    return () => {
      mql.removeEventListener?.('change', sync);
      window.removeEventListener('resize', sync);
    };
  }, [query]);
  return matches;
}

/* Reveal-on-scroll. Elements marked `.reveal` start hidden, fade in once, and
   are then unobserved. Pass deps when the section can add elements after mount.

   `.reveal` starts at opacity 0, so anything that stops it from being revealed
   does not degrade the page, it deletes the content. That makes this the one
   place where relying on the cascade or on an observer firing is not good
   enough: a stylesheet rule that loses a specificity argument, a browser with
   no IntersectionObserver, or an observer being throttled all end the same way,
   with a blank section. So when there is no animation to run, the elements are
   shown immediately and inline, which nothing can override. */
export function useReveal(deps = []) {
  const ref = useRef(null);
  const { moving } = useMotion();
  useEffect(() => {
    const els = [...(ref.current?.querySelectorAll('.reveal:not(.in)') ?? [])];
    if (!els.length) return;

    const showNow = () => els.forEach((el) => {
      el.classList.add('in');
      el.style.opacity = '1';
      el.style.animation = 'none';
    });

    if (!moving || typeof IntersectionObserver !== 'function') { showNow(); return; }

    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.14 }
    );
    els.forEach((el, i) => { el.style.animationDelay = `${(i % 4) * 0.1}s`; io.observe(el); });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moving, ...deps]);
  return ref;
}

/* Cursor spotlight for `.spot` surfaces. One delegated listener for the whole
   page rather than one per card. It never runs on touch devices, where there
   is no cursor to follow and the work would be pure battery cost, and never
   below motion tier `full`. */
export function useSpotlight() {
  const { full } = useMotion();
  useEffect(() => {
    if (!full) return;
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
  }, [full]);
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

/* Which theme regime is under the header right now, so the fixed nav can invert
   as it crosses the dawn/dusk horizon instead of going light-on-light.

   Answered from scroll position against the zones' measured offsets rather than
   from an IntersectionObserver. The question is literally "which zone contains
   the point `offset` below the top of the viewport", which is arithmetic; an
   observer answers it indirectly, only when it decides to fire, and not at all
   for the programmatic jump that a `#hash` landing performs.

   Reads `[data-zone]`, not `[data-regime]`: the latter is also on the header
   itself and on the consent banner, both of which are fixed, so their offsets
   are meaningless and one of them is the element asking the question. */
/* The decision itself, kept pure so it can be tested without a layout engine.
   `zones` are document-space spans, in document order. */
export function regimeForProbe(probe, zones, fallback = 'dawn') {
  if (!zones.length) return fallback;
  const hit = zones.find((z) => probe >= z.top && probe < z.bottom);
  /* Above the first zone, or past the last: take the nearest one. */
  if (!hit) return probe < zones[0].top ? zones[0].zone : zones.at(-1).zone;
  /* The horizon band is neither regime. It starts periwinkle and ends
     indigo-black, so the bar switches partway down it, at the point where the
     ground behind it stops being light. */
  if (hit.zone === 'seam') {
    return (probe - hit.top) / (hit.bottom - hit.top) < 0.4 ? 'dawn' : 'dusk';
  }
  return hit.zone;
}

export function useRegimeAtTop(offset = 72, fallback = 'dawn') {
  const [regime, setRegime] = useState(fallback);
  useEffect(() => {
    let zones = [];
    const measure = () => {
      zones = [...document.querySelectorAll('[data-zone]')].map((el) => {
        const r = el.getBoundingClientRect();
        return {
          zone: el.dataset.zone,
          top: r.top + window.scrollY,
          bottom: r.bottom + window.scrollY,
        };
      });
    };

    const update = () => setRegime(regimeForProbe(window.scrollY + offset, zones, fallback));

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; update(); });
    };
    const onResize = () => { measure(); update(); };

    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [offset, fallback]);
  return regime;
}

/* ── Tabs ───────────────────────────────────────────────────────────────
   The accessible half of a tab strip, with no opinion about layout: the
   linear Services strip and the radial Work orbit share this and render the
   nodes themselves. Roving tabindex, so the strip is one tab stop and the
   arrow keys move within it, which is what the ARIA pattern asks for.
   ──────────────────────────────────────────────────────────────────────── */
export function useTabs({ count, active, onSelect, orientation = 'horizontal' }) {
  const refs = useRef([]);

  const move = useCallback((next) => {
    const i = (next + count) % count;
    onSelect(i);
    /* Focus follows selection so the next arrow press continues from where the
       visitor just landed rather than from the old node. */
    refs.current[i]?.focus();
  }, [count, onSelect]);

  const onKeyDown = useCallback((e) => {
    const [prev, nextKey] = orientation === 'vertical'
      ? ['ArrowUp', 'ArrowDown']
      : ['ArrowLeft', 'ArrowRight'];
    if (e.key === nextKey) { e.preventDefault(); move(active + 1); }
    else if (e.key === prev) { e.preventDefault(); move(active - 1); }
    else if (e.key === 'Home') { e.preventDefault(); move(0); }
    else if (e.key === 'End') { e.preventDefault(); move(count - 1); }
  }, [active, count, move, orientation]);

  /* Spread onto each node. `panelId` ties the strip to the one panel both
     layouts render, which is what makes a screen reader announce the change. */
  const tabProps = useCallback((i, panelId) => ({
    ref: (el) => { refs.current[i] = el; },
    role: 'tab',
    id: `${panelId}-tab-${i}`,
    'aria-selected': i === active,
    'aria-controls': panelId,
    tabIndex: i === active ? 0 : -1,
    onClick: () => onSelect(i),
    onKeyDown,
  }), [active, onSelect, onKeyDown]);

  const listProps = useMemo(() => ({
    role: 'tablist',
    'aria-orientation': orientation,
  }), [orientation]);

  const panelProps = useCallback((panelId) => ({
    role: 'tabpanel',
    id: panelId,
    'aria-labelledby': `${panelId}-tab-${active}`,
    tabIndex: 0,
  }), [active]);

  return { tabProps, listProps, panelProps };
}

/* A label that swaps for a copy of itself on hover, sliding up through a clipped
   box. The styling is in `.rollup`; this exists to guarantee the second copy is
   hidden from assistive tech, because a footer of links that each read their own
   name twice is a worse outcome than no animation at all. */
export const Rollup = ({ children, className = '' }) => (
  <span className={`rollup ${className}`}>
    <span>{children}</span>
    <span aria-hidden="true">{children}</span>
  </span>
);

export const Arrow = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

/* The mark: an alcove/niche, the recessed space where one considered piece is
   set. Literalizes the brand name; the dot is the work on display. */
export const Logomark = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6.5 19V11.5A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 5.5 5.5V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="12.5" r="1.6" className="fill-accent" />
  </svg>
);

export const Wordmark = ({ className = '' }) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <Logomark className="w-5 h-5 text-ivory/80" />
    <span className="font-display tracking-tight text-ivory">a<span className="text-accent">-</span>niche</span>
  </span>
);

export function LangSwitch({ className = '' }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`flex items-center font-mono text-[10px] tracking-[0.08em] ${className}`}>
      {LANGS.map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 && <span className="text-hair/20 px-1">·</span>}
          <button onClick={() => setLang(l)} aria-pressed={l === lang}
            className={`transition ${l === lang ? 'text-accent' : 'text-muted/70 hover:text-ivory'}`}>{l}</button>
        </React.Fragment>
      ))}
    </div>
  );
}
