import { useLang } from '../i18n.jsx';
import { Arrow, scrollTo } from '../ui.jsx';
import { ParticleField } from '../interactive.jsx';
import { METRICS } from '../data.js';
import { insightsHref } from './insights.jsx';
import { getPreviews, uiFor } from '../insights/meta.js';

/* ════════════════════════════════════════════════════════════════════════
   The hero opens with the thing the studio actually sells: an agent that
   is listening right now. The panel is a live waveform in four languages,
   not a screenshot, and it appears on phones too. Hiding the one ownable
   graphic below `lg:` meant most visitors never saw it.
   ════════════════════════════════════════════════════════════════════════ */

const WAVE_BARS = [0.5, 0.8, 0.4, 1, 0.6, 0.9, 0.45, 0.75, 0.55, 1, 0.5, 0.85, 0.4, 0.65];

function AgentPanel() {
  const { s } = useLang();
  return (
    <div className="surface spot p-6 sm:p-7 w-full max-w-sm mx-auto lg:mx-0 lg:max-w-none">
      <div className="flex items-center justify-between mb-6 sm:mb-7">
        <span className="eyebrow !text-[9px]">{s.hero.panel}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-accent" style={{ animation: 'pulse2 2.4s infinite' }} />
      </div>

      <div className="flex items-end gap-1.5 h-16 sm:h-20">
        {WAVE_BARS.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-full bg-accent/70"
            style={{
              height: `${h * 100}%`,
              transformOrigin: 'bottom',
              animation: `bar ${1.1 + (i % 5) * 0.15}s ease-in-out ${i * 0.06}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="mt-6 rule" />
      <div className="mt-5 flex items-center gap-2 font-mono text-[10px] text-muted uppercase tracking-[0.15em]">
        <span className="text-gold">EN</span><span className="text-white/15">·</span>
        <span>DE</span><span className="text-white/15">·</span>
        <span>ES</span><span className="text-white/15">·</span>
        <span>FR</span>
      </div>
    </div>
  );
}

/* Depth on wide screens only: the stack behind the panel costs layout room
   that a phone does not have to spare. */
function HeroVisual() {
  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0" style={{ perspective: '1400px' }}>
      <div className="glow w-[26rem] h-[26rem] -top-20 -right-10 hidden sm:block" />
      <div
        className="relative"
        style={{ transformStyle: 'preserve-3d', animation: 'floatY 6s ease-in-out infinite' }}
      >
        <div className="hidden lg:block absolute inset-0 translate-x-6 translate-y-10 rounded-xl bg-panel2/60 border border-white/[0.05]" />
        <div className="hidden lg:block absolute inset-0 translate-x-3 translate-y-5 rounded-xl bg-panel/70 border border-white/[0.06]" />
        <AgentPanel />
      </div>
    </div>
  );
}

export function Hero() {
  const { s, lang } = useLang();
  const latest = getPreviews(lang)[0];
  const ui = uiFor(lang);

  return (
    <section id="top" className="relative flex items-center overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:min-h-[92vh] lg:py-0">
      {/* The blueprint grid is masked to fade out, and a mask applies to an
          element's children as well as its background, so it gets its own
          layer instead of sitting on the section. */}
      <div className="absolute inset-0 grid-bg" aria-hidden="true" />
      <ParticleField />
      <div className="aurora" />

      <div className="relative z-10 shell grid lg:grid-cols-[1.08fr_.92fr] gap-12 lg:gap-16 items-center">
        <div>
          {/* The newest article, named. A pill that says only "Adoption" is
              decoration; one that says what you would be reading is a link. */}
          <a
            href={insightsHref(lang, latest.id)}
            className="badge max-w-full transition-colors"
            style={{ animation: 'fadeIn .9s both' }}
          >
            <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-accent" style={{ animation: 'pulse2 2.4s infinite' }} />
            <span className="text-accent shrink-0">{ui.latest}</span>
            <span className="truncate normal-case tracking-normal font-sans text-[12px]">{latest.title}</span>
          </a>

          <h1 style={{ animation: 'fadeUp 1s .1s both' }} className="display-1 mt-7">
            {s.hero.h1a}<br />{s.hero.h1b}
            <span className="italic gradient-text">{s.hero.ship}</span>
          </h1>

          <p style={{ animation: 'fadeUp 1s .22s both' }} className="lede mt-6 text-muted max-w-lg">
            {s.hero.p}
          </p>

          <div style={{ animation: 'fadeUp 1s .32s both' }} className="mt-9 flex flex-col sm:flex-row sm:items-center gap-4">
            <button onClick={() => scrollTo('contact')} className="btn-primary">
              {s.cta} <Arrow className="w-4 h-4" />
            </button>
            <button onClick={() => scrollTo('work')} className="btn-ghost group">
              {s.hero.view} <Arrow className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>

          <div style={{ animation: 'fadeUp 1s .4s both' }} className="mt-8 inline-flex items-center gap-2.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" style={{ animation: 'pulse2 2.4s infinite' }} />
            {s.hero.avail}
          </div>
        </div>

        <div style={{ animation: 'fadeUp 1.1s .3s both' }}>
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

export function Metrics() {
  const { s } = useLang();
  return (
    <section className="border-y border-white/[0.05]">
      <div className="shell py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        {METRICS.map((m, i) => (
          <div key={m.n} className="flex items-baseline gap-4 sm:block">
            <div className="font-display text-3xl sm:text-4xl text-ivory shrink-0">{m.n}</div>
            <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-muted sm:mt-3">{s.metrics[i]}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
