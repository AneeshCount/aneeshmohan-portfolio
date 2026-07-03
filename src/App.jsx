import React, { useEffect, useRef, useState } from 'react';
import { PROJECTS, METRICS, SKILLS, SOCIALS } from './data.js';
import { ParticleField } from './interactive.jsx';
import { EnergyGame } from './game.jsx';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal') ?? [];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.14 }
    );
    els.forEach((el, i) => { el.style.animationDelay = `${(i % 4) * 0.1}s`; io.observe(el); });
    return () => io.disconnect();
  }, []);
  return ref;
}

const Arrow = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

/* ── Nav ────────────────────────────────────────────────────────────────── */
const NAV_LINKS = [['Work', 'work'], ['Playground', 'play'], ['About', 'about'], ['Contact', 'contact']];

function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 24);
    window.addEventListener('scroll', f); return () => window.removeEventListener('scroll', f);
  }, []);
  const go = (id) => { setOpen(false); scrollTo(id); };
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid || open ? 'bg-ink/90 backdrop-blur-md border-b border-white/[0.05]' : ''}`}>
      <nav className="mx-auto max-w-6xl px-8 h-20 flex items-center justify-between">
        <a href="#top" className="font-display text-ivory text-lg tracking-tight">Aneesh Mohan</a>
        <div className="hidden sm:flex items-center gap-10 font-mono text-[11px] uppercase tracking-[0.2em]">
          {NAV_LINKS.map(([t, id]) => (
            <button key={id} onClick={() => go(id)} className="text-muted hover:text-ivory transition link-underline">{t}</button>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <a href="mailto:mohananeesh003@gmail.com" className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent border-b border-accent/40 pb-0.5 hover:text-ivory hover:border-ivory transition">Hire me</a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="sm:hidden flex flex-col justify-center gap-[5px] w-8 h-8"
          >
            <span className={`block h-px w-5 bg-ivory transition-transform duration-300 ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
            <span className={`block h-px w-5 bg-ivory transition-transform duration-300 ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>
      {open && (
        <div className="sm:hidden border-t border-white/[0.05] bg-ink/95 backdrop-blur-md px-8 py-6 flex flex-col gap-5">
          {NAV_LINKS.map(([t, id]) => (
            <button key={id} onClick={() => go(id)} className="text-left font-mono text-[12px] uppercase tracking-[0.2em] text-muted hover:text-ivory transition">{t}</button>
          ))}
        </div>
      )}
    </header>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center grid-bg overflow-hidden">
      <ParticleField />
      <div className="glow w-[40rem] h-[40rem] -top-48 -right-56" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />

      <div className="relative z-10 mx-auto max-w-6xl px-8 w-full">
        <div style={{ animation: 'fadeIn .9s both' }} className="eyebrow">Full-Stack &amp; AI Engineer</div>

        <h1 style={{ animation: 'fadeUp 1s .1s both' }} className="mt-10 text-[3.25rem] sm:text-[5.5rem] leading-[1.04] tracking-tight">
          Fast, intelligent<br />software, built to <span className="italic text-accent">ship.</span>
        </h1>

        <p style={{ animation: 'fadeUp 1s .22s both' }} className="mt-9 text-lg text-muted max-w-lg leading-relaxed">
          I'm Aneesh Mohan. I take products from a blank page to production with the same standard end to end: a precise interface, a solid API and data layer, and AI that does real work.
        </p>

        <div style={{ animation: 'fadeUp 1s .32s both' }} className="mt-12 flex flex-wrap items-center gap-7">
          <button onClick={() => scrollTo('work')} className="group font-mono text-[12px] uppercase tracking-[0.2em] text-ivory inline-flex items-center gap-3 border-b border-white/20 pb-1.5 hover:border-accent hover:text-accent transition">
            View the work <Arrow className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
          <span className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" style={{ animation: 'pulse2 2.4s infinite' }} /> Available for work
          </span>
        </div>

        <div style={{ animation: 'fadeUp 1s .42s both' }} className="mt-20 charge-track max-w-sm" />
      </div>
    </section>
  );
}

/* ── Metrics ────────────────────────────────────────────────────────────── */
function Metrics() {
  return (
    <section className="border-y border-white/[0.05]">
      <div className="mx-auto max-w-6xl px-8 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
        {METRICS.map((m) => (
          <div key={m.l}>
            <div className="font-display text-4xl text-ivory">{m.n}</div>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted mt-3">{m.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Work ───────────────────────────────────────────────────────────────── */
function Work() {
  const ref = useReveal();
  return (
    <section id="work" ref={ref} className="mx-auto max-w-6xl px-8 py-32">
      <div className="reveal max-w-2xl">
        <div className="eyebrow">Selected Work</div>
        <h2 className="text-4xl sm:text-5xl mt-7 leading-tight">Products designed, built<br className="hidden sm:block" /> and shipped from zero.</h2>
      </div>

      <div className="mt-20 grid md:grid-cols-2 gap-7">
        {PROJECTS.map((p, i) => (
          <article key={p.name} className="reveal pcard p-9 flex flex-col">
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs text-muted/60">{String(i + 1).padStart(2, '0')} / 04</span>
              {p.link && (
                <a href={p.link} target="_blank" rel="noreferrer" className="text-muted hover:text-accent transition inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
                  {p.linkLabel} <Arrow className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            <h3 className="mt-8 text-3xl">{p.name}</h3>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{p.tag}</p>
            <p className="mt-6 text-[15px] text-muted leading-relaxed flex-1">{p.blurb}</p>
            {p.note && <p className="mt-5 text-xs text-muted/70 italic">{p.note}</p>}
            <div className="mt-7 flex flex-wrap gap-2">
              {p.tech.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── Playground (interactive) ───────────────────────────────────────────── */
function Playground() {
  const ref = useReveal();
  return (
    <section id="play" ref={ref} className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl px-8 py-32">
        <div className="reveal max-w-2xl">
          <div className="eyebrow">Interactive</div>
          <h2 className="text-4xl sm:text-5xl mt-7 leading-tight">Don't take my word for it.<br className="hidden sm:block" /> Try it yourself.</h2>
          <p className="reveal text-muted mt-6 max-w-xl leading-relaxed">This is the kind of problem I build for: balancing solar, battery and grid under a hard limit. Play one round of <span className="text-ivory">Grid Master</span> and see how efficiently you can run a charging site.</p>
        </div>
        <div className="reveal mt-16">
          <EnergyGame />
        </div>
      </div>
    </section>
  );
}

/* ── About + Skills ─────────────────────────────────────────────────────── */
function About() {
  const ref = useReveal();
  return (
    <section id="about" ref={ref} className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl px-8 py-32 grid md:grid-cols-5 gap-16">
        <div className="md:col-span-2">
          <div className="reveal eyebrow">About</div>
          <h2 className="reveal text-3xl sm:text-4xl mt-7 leading-snug">Founder's mind,<br />engineer's hands.</h2>
          <p className="reveal text-muted mt-8 leading-relaxed">
            I founded RiDERgy, where I build agentic AI for EV charging and energy management, a domain where speed, reliability and clarity are non-negotiable.
          </p>
          <p className="reveal text-muted mt-4 leading-relaxed">
            I own the whole stack: the architecture, a considered interface, the API and data beneath it, and the intelligence layer that makes it useful. I move quickly, and I ship things people depend on.
          </p>
        </div>
        <div className="md:col-span-3 grid sm:grid-cols-2 gap-x-7 gap-y-10">
          {SKILLS.map((s) => (
            <div key={s.group} className="reveal">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">{s.group}</h3>
              <div className="rule mt-4" />
              <ul className="mt-4 space-y-2.5">
                {s.items.map((it) => (
                  <li key={it} className="text-[15px] text-muted flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-accent/70" /> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Contact ────────────────────────────────────────────────────────────── */
function Contact() {
  return (
    <section id="contact" className="relative border-t border-white/[0.05] overflow-hidden">
      <div className="glow w-[36rem] h-[36rem] -bottom-56 left-1/2 -translate-x-1/2" />
      <div className="relative mx-auto max-w-3xl px-8 py-36 text-center">
        <div className="eyebrow justify-center">Contact</div>
        <h2 className="text-4xl sm:text-6xl mt-8 leading-[1.08]">Have something<br /> worth building?</h2>
        <p className="mt-8 text-muted max-w-md mx-auto leading-relaxed">An MVP, a production platform, or an AI feature you need shipped. I'm available, and I'd like to hear about it.</p>
        <a href="mailto:mohananeesh003@gmail.com" className="inline-block mt-10 font-display italic text-2xl sm:text-3xl text-ivory border-b border-accent/50 pb-1 hover:text-accent transition">
          mohananeesh003@gmail.com
        </a>
        <div className="mt-12 charge-track max-w-[14rem] mx-auto" />
        <div className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-3 font-mono text-[11px] uppercase tracking-[0.18em]">
          {SOCIALS.filter((s) => s.label !== 'Email').map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="text-muted hover:text-ivory transition">{s.label}</a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted/70">
        <span className="font-display text-ivory tracking-normal text-sm normal-case">Aneesh Mohan</span>
        <span>© {new Date().getFullYear()} · Built from scratch · React &amp; Tailwind</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Metrics />
      <Work />
      <Playground />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
