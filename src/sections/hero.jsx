import { useLang } from '../i18n.jsx';
import { Arrow, scrollTo, useMotion, useReveal } from '../ui.jsx';
import { Aperture, Lattice } from '../ornament.jsx';
import { ParticleField } from '../interactive.jsx';
import { METRICS } from '../data.js';
import { insightsHref } from './insights.jsx';
import { getPreviews, uiFor } from '../insights/meta.js';

/* ════════════════════════════════════════════════════════════════════════
   The first screen does one thing: say what this is, once, very large, with
   air around it. Everything that used to compete with the headline has moved.

   The live agent panel that sat beside it is the studio's best asset and was
   the worst thing for this screen: it halved the headline's width and filled
   the remaining space with a second focal point. It now opens the dusk half,
   at full width, immediately above the demos it belongs to.
   ════════════════════════════════════════════════════════════════════════ */

export function Hero() {
  const { s, lang } = useLang();
  const { full } = useMotion();
  const latest = getPreviews(lang)[0];
  const ui = uiFor(lang);

  return (
    <section
      id="top"
      className="relative overflow-hidden flex items-center pt-32 pb-20 sm:pt-40 sm:pb-28 lg:min-h-[94vh]"
    >
      <Lattice />
      {/* The constellation is the one piece of hero motion, and only where the
          device and connection can carry it without costing battery. */}
      {full && <ParticleField />}

      <div className="relative z-10 shell text-center">
        <div style={{ animation: 'fadeIn 1.1s both' }} className="flex justify-center text-gold">
          <Aperture className="w-32 h-7 sm:w-40 sm:h-8" />
        </div>

        <div style={{ animation: 'fadeUp .9s .08s both' }} className="mt-7 flex justify-center">
          <span className="eyebrow-centred">{s.hero.eyebrow}</span>
        </div>

        <h1 style={{ animation: 'fadeUp 1s .18s both' }} className="display-1 mt-8 mx-auto max-w-4xl">
          {s.hero.h1a}<br />{s.hero.h1b}
          <span className="italic gradient-text">{s.hero.ship}</span>
        </h1>

        <p style={{ animation: 'fadeUp 1s .3s both' }} className="lede mt-8 mx-auto max-w-xl text-muted">
          {s.hero.p}
        </p>

        <div style={{ animation: 'fadeUp 1s .4s both' }} className="mt-11 flex flex-col sm:flex-row sm:justify-center items-stretch sm:items-center gap-4">
          <button onClick={() => scrollTo('contact')} className="btn-primary">
            {s.cta} <Arrow className="w-4 h-4" />
          </button>
          <button onClick={() => scrollTo('work')} className="btn-ghost group">
            {s.hero.view} <Arrow className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        <div style={{ animation: 'fadeUp 1s .5s both' }} className="mt-10 flex flex-col items-center gap-5">
          <span className="inline-flex items-center gap-2.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" style={{ animation: 'pulse2 2.4s infinite' }} />
            {s.hero.avail}
          </span>

          {/* The newest article, named. A pill that says only "Adoption" is
              decoration; one that says what you would be reading is a link. */}
          <a href={insightsHref(lang, latest.id)} className="badge max-w-full tactile">
            <span className="text-accent shrink-0">{ui.latest}</span>
            <span className="truncate normal-case tracking-normal font-sans text-[12px]">{latest.title}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* Three figures, set as figures. Sarvam's "10B+ tokens served / <100ms" row is
   the reference: a number large enough to be the content, and a mono label
   small enough to stay out of its way. */
export function Metrics() {
  const { s } = useLang();
  return (
    <section className="border-t border-hair/8">
      <div className="shell band-y grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
        {METRICS.map((m, i) => (
          <div key={m.n} className="flex items-baseline gap-5 sm:block text-left">
            <div className="font-display text-[2.75rem] sm:text-6xl leading-none text-ivory shrink-0">{m.n}</div>
            <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-muted sm:mt-5 max-w-[16rem]">
              {s.metrics[i]}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* The live agent panel, promoted out of the hero. It opens the dusk half of the
   page as a full-width instrument: a waveform running in four languages, not a
   screenshot, and it appears on phones too. Hiding the one ownable graphic
   below `lg:` meant most visitors never saw it. */
const WAVE_BARS = [0.4, 0.62, 0.35, 0.85, 0.5, 1, 0.45, 0.72, 0.38, 0.9, 0.55, 0.8, 0.42, 0.68, 0.36, 0.95, 0.48, 0.75, 0.4, 0.6];

export function AgentBanner() {
  const { s } = useLang();
  const { moving } = useMotion();
  const ref = useReveal();
  return (
    <section ref={ref}>
      <div className="shell section-y">
        <button
          onClick={() => scrollTo('play')}
          className="reveal group block w-full text-left surface grain spot p-7 sm:p-10 overflow-hidden transition-colors hover:border-accent/40"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="eyebrow">{s.hero.panel}</span>
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" style={{ animation: moving ? 'pulse2 2.4s infinite' : 'none' }} />
              {s.va.live}
            </span>
          </div>

          <div className="mt-8 flex items-end gap-1 sm:gap-1.5 h-24 sm:h-32">
            {WAVE_BARS.map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-full bg-accent/60"
                style={{
                  height: `${h * 100}%`,
                  transformOrigin: 'bottom',
                  animation: moving ? `bar ${1.1 + (i % 5) * 0.15}s ease-in-out ${i * 0.05}s infinite` : 'none',
                }}
              />
            ))}
          </div>

          <div className="mt-8 rule" />
          <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
            <p className="card-body">{s.hero.bannerP}</p>
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent opacity-80 group-hover:opacity-100 transition">
              {s.hero.bannerCta} <Arrow className="w-4 h-4 rotate-90" />
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2.5 font-mono text-[10px] text-muted uppercase tracking-[0.18em]">
            <span className="text-gold">EN</span><span className="text-hair/25">·</span>
            <span>DE</span><span className="text-hair/25">·</span>
            <span>ES</span><span className="text-hair/25">·</span>
            <span>FR</span>
          </div>
        </button>
      </div>
    </section>
  );
}
