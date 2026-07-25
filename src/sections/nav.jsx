import { useEffect, useState } from 'react';
import { useLang } from '../i18n.jsx';
import { Arrow, LangSwitch, Wordmark, scrollTo, useActiveSection } from '../ui.jsx';
import { NAV_IDS } from '../config.js';

/* ════════════════════════════════════════════════════════════════════════
   The header is transparent over the hero and resolves into a blurred bar
   with a hairline once the page moves, so the top of the site is the work
   rather than the chrome.

   On a phone the six nav items do not fit, and a cramped dropdown is worse
   than no menu at all. They get a full sheet instead: large targets, the
   language switch, and the same call to action as the desktop bar.
   ════════════════════════════════════════════════════════════════════════ */

export function Nav() {
  const { s } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* An open sheet owns the screen: the page behind it must not scroll, and
     Escape has to close it for anyone not using a touchscreen. */
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = overflow; window.removeEventListener('keydown', onKey); };
  }, [open]);

  const go = (id) => { setOpen(false); scrollTo(id); };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? 'bg-ink/80 backdrop-blur-xl border-b border-white/[0.06]'
            : 'border-b border-transparent'
        }`}
      >
        <nav className="shell flex items-center justify-between h-16 sm:h-20">
        <a href="#top" onClick={() => setOpen(false)} className="text-ivory text-base sm:text-lg shrink-0">
          <Wordmark />
        </a>

        <div className="hidden md:flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.16em]">
          {NAV_IDS.map((id, i) => (
            <button
              key={id}
              onClick={() => go(id)}
              aria-current={active === id ? 'true' : undefined}
              className={`relative px-3 py-2 rounded-md transition-colors duration-300 ${
                active === id ? 'text-ivory' : 'text-muted/80 hover:text-ivory'
              }`}
            >
              {s.nav[i]}
              <span
                className={`absolute inset-x-3 -bottom-px h-px bg-accent transition-transform duration-300 origin-left ${
                  active === id ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <LangSwitch className="hidden md:flex" />
          <button
            onClick={() => scrollTo('contact')}
            className="hidden sm:inline-flex items-center font-mono text-[11px] uppercase tracking-[0.16em] text-ink bg-accent rounded-full px-5 h-10 hover:bg-ivory transition"
          >
            {s.cta}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="md:hidden flex flex-col items-center justify-center gap-[6px] w-11 h-11 -mr-2"
          >
            <span className={`block h-px w-6 bg-ivory transition-transform duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
            <span className={`block h-px w-6 bg-ivory transition-transform duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
          </button>
        </div>
        </nav>
      </header>

      {/* Outside the header on purpose. `backdrop-filter` makes an element a
          containing block for its fixed descendants, so a sheet nested in the
          blurred header would be trapped inside a 64px tall box. */}
      {open && (
        <div
          className="md:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-ink/95 backdrop-blur-xl border-t border-white/[0.06] overflow-y-auto"
          style={{ animation: 'fadeIn .25s ease both' }}
        >
          <div className="shell py-8 flex flex-col min-h-full">
            <div className="flex flex-col">
              {NAV_IDS.map((id, i) => (
                <button
                  key={id}
                  onClick={() => go(id)}
                  className="group flex items-center justify-between border-b border-white/[0.05] py-4 text-left"
                >
                  <span className={`font-display text-2xl ${active === id ? 'text-accent' : 'text-ivory'}`}>{s.nav[i]}</span>
                  <Arrow className="w-4 h-4 text-muted/40 group-hover:text-accent transition" />
                </button>
              ))}
            </div>

            <button onClick={() => go('contact')} className="btn-primary mt-8 w-full">
              {s.cta} <Arrow className="w-4 h-4" />
            </button>

            <div className="mt-auto pt-8 flex items-center justify-between">
              <LangSwitch className="text-[11px]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted/50">
                © {new Date().getFullYear()} a-niche
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.05]">
      <div className="shell py-8 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted/70">
        <span className="text-ivory text-sm normal-case"><Wordmark /></span>
        <span>© {new Date().getFullYear()} a-niche</span>
      </div>
    </footer>
  );
}
