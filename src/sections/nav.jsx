import { useEffect, useState } from 'react';
import { useLang } from '../i18n.jsx';
import { Arrow, LangSwitch, MotionToggle, Rollup, Wordmark, scrollTo, useActiveSection, useRegimeAtTop } from '../ui.jsx';
import { Lattice } from '../ornament.jsx';
import { SOCIALS } from '../data.js';
import { NAV_IDS } from '../config.js';

/* ════════════════════════════════════════════════════════════════════════
   The header is a floating pill rather than a full-width bar: it sits inside
   the page's own gutters, so the top of the site reads as content with
   chrome on it rather than as an app frame.

   It is transparent over the first screen and resolves into glass once the
   page moves. Because the page runs light at the top and dark below, the bar
   also has to change side: `useRegimeAtTop` reports whichever zone is under
   the header right now, and the bar inherits that zone's tokens so it never
   goes light-on-light or dark-on-dark across the horizon.

   On a phone the six nav items do not fit, and a cramped dropdown is worse
   than no menu at all. They get a full sheet instead: large targets, the
   language switch, and the same call to action as the desktop bar.
   ════════════════════════════════════════════════════════════════════════ */

export function Nav() {
  const { s } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV_IDS);
  const regime = useRegimeAtTop();

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
      {/* data-regime here is what makes every token below resolve to the half
          of the page the bar is currently over. */}
      <header data-regime={regime} className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
        <div className="shell">
          {/* The bar always carries its own surface, never sits directly on the
              gradient. Mono nav labels at 11px over full-strength saffron do not
              come close to AA; over the bar's own light glass they clear it
              easily. It deepens on scroll rather than appearing from nothing. */}
          <nav
            className={`flex items-center justify-between gap-4 rounded-full pl-5 pr-2 sm:pl-7 sm:pr-2.5 h-14 sm:h-16 border border-hair/10 backdrop-blur-xl transition-all duration-500 ${
              scrolled || open ? 'bg-ink/80 shadow-paper' : 'bg-ink/55'
            }`}
          >
            <a href="#top" onClick={() => setOpen(false)} className="text-base sm:text-lg shrink-0">
              <Wordmark />
            </a>

            <div className="hidden md:flex items-center gap-0.5 font-mono text-[11px] uppercase tracking-[0.14em]">
              {NAV_IDS.map((id, i) => (
                <button
                  key={id}
                  onClick={() => go(id)}
                  aria-current={active === id ? 'true' : undefined}
                  className={`relative px-3 py-2 rounded-full transition-colors duration-300 ${
                    active === id ? 'text-ivory' : 'text-muted hover:text-ivory'
                  }`}
                >
                  {s.nav[i]}
                  <span
                    className={`absolute inset-x-3 bottom-1 h-px bg-accent transition-transform duration-300 origin-left ${
                      active === id ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <LangSwitch className="hidden md:flex" />
              <button
                onClick={() => scrollTo('contact')}
                className="hidden sm:inline-flex items-center font-mono text-[11px] uppercase tracking-[0.14em] rounded-full px-5 h-10 tactile"
                style={{ color: 'rgb(var(--btn-fg))', background: 'rgb(var(--btn-bg))' }}
              >
                {s.cta}
              </button>
              <button
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="md:hidden flex flex-col items-center justify-center gap-[6px] w-11 h-11"
              >
                <span className={`block h-px w-6 bg-ivory transition-transform duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
                <span className={`block h-px w-6 bg-ivory transition-transform duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Outside the header on purpose. `backdrop-filter` makes an element a
          containing block for its fixed descendants, so a sheet nested in the
          blurred bar would be trapped inside a 64px tall box. */}
      {open && (
        <div
          data-regime={regime}
          className="md:hidden fixed inset-0 z-40 bg-ink/95 backdrop-blur-xl overflow-y-auto pt-20"
          style={{ animation: 'fadeIn .25s ease both' }}
        >
          <div className="shell py-8 flex flex-col min-h-full">
            <div className="flex flex-col">
              {NAV_IDS.map((id, i) => (
                <button
                  key={id}
                  onClick={() => go(id)}
                  className="group flex items-center justify-between border-b border-hair/8 py-4 text-left"
                >
                  <span className={`font-display text-2xl ${active === id ? 'text-accent' : 'text-ivory'}`}>{s.nav[i]}</span>
                  <Arrow className="w-4 h-4 text-muted/50 group-hover:text-accent transition" />
                </button>
              ))}
            </div>

            <button onClick={() => go('contact')} className="btn-primary mt-8 w-full">
              {s.cta} <Arrow className="w-4 h-4" />
            </button>

            <div className="mt-auto pt-8 flex items-center justify-between">
              <LangSwitch className="text-[11px]" />
              <MotionToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   The close.

   A footer worth scrolling to: the mark set large, a two-line statement of what
   this is, and every link a roll-up, so the last screen has the same care as the
   first. Small links respond to the cursor by moving rather than by changing
   colour, which is the one place a page can afford that much motion because
   there is nothing left to read.
   ════════════════════════════════════════════════════════════════════════ */
export function Footer() {
  const { s } = useLang();
  return (
    <footer className="relative border-t border-hair/8">
      <Lattice />
      <div className="relative shell section-y">
        <div className="grid gap-12 md:grid-cols-[1.15fr_.85fr]">
          <div>
            <a href="#top" className="inline-block text-2xl sm:text-3xl">
              <Wordmark />
            </a>
            <p className="display-3 mt-7 max-w-md">
              {s.footer.line1}<br />
              <span className="text-muted">{s.footer.line2}</span>
            </p>
            <button onClick={() => scrollTo('contact')} className="btn-primary mt-9">
              <Rollup>{s.cta}</Rollup> <Arrow className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <nav aria-label={s.footer.sections}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">{s.footer.sections}</p>
              <ul className="mt-5 space-y-2.5">
                {NAV_IDS.map((id, i) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollTo(id)}
                      className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted hover:text-ivory transition-colors"
                    >
                      <Rollup>{s.nav[i]}</Rollup>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label={s.footer.elsewhere}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">{s.footer.elsewhere}</p>
              <ul className="mt-5 space-y-2.5">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href} target="_blank" rel="noreferrer"
                      className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted hover:text-ivory transition-colors"
                    >
                      <Rollup>{social.label}</Rollup>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="rule mt-14" />
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-between gap-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            © {new Date().getFullYear()} a-niche
          </span>
          <div className="flex items-center gap-8">
            <MotionToggle />
            <LangSwitch />
          </div>
        </div>
      </div>
    </footer>
  );
}
