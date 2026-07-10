import React, { useEffect, useRef, useState } from 'react';
import { PROJECTS, METRICS, SKILLS, SOCIALS, SERVICES, TRUST, PLATFORMS } from './data.js';
import { ParticleField } from './interactive.jsx';
import { AgentConsole } from './agent.jsx';
import { VoiceAgent } from './voice.jsx';

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
const NAV_LINKS = [['Work', 'work'], ['Playground', 'play'], ['Process', 'process'], ['About', 'about'], ['Contact', 'contact']];

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
          <button onClick={() => scrollTo('contact')} className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent border-b border-accent/40 pb-0.5 hover:text-ivory hover:border-ivory transition">Start a project</button>
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
        <div style={{ animation: 'fadeIn .9s both' }} className="eyebrow">AI &amp; Software Studio · Voice · Agents · Full-Stack</div>

        <h1 style={{ animation: 'fadeUp 1s .1s both' }} className="mt-10 text-[3.25rem] sm:text-[5.5rem] leading-[1.04] tracking-tight">
          Fast, intelligent<br />software, built to <span className="italic text-accent">ship.</span>
        </h1>

        <p style={{ animation: 'fadeUp 1s .22s both' }} className="mt-9 text-lg text-muted max-w-lg leading-relaxed">
          A founder-led studio that takes products from a blank page to production: precise interfaces, solid APIs and data layers, and AI that does real work. Agents that run operations. Voice agents that hold real conversations.
        </p>

        <div style={{ animation: 'fadeUp 1s .32s both' }} className="mt-12 flex flex-wrap items-center gap-7">
          <button onClick={() => scrollTo('work')} className="group font-mono text-[12px] uppercase tracking-[0.2em] text-ivory inline-flex items-center gap-3 border-b border-white/20 pb-1.5 hover:border-accent hover:text-accent transition">
            View the work <Arrow className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
          <span className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" style={{ animation: 'pulse2 2.4s infinite' }} /> Accepting new clients
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

/* ── What I build ───────────────────────────────────────────────────────── */
function WhatIBuild() {
  const ref = useReveal();
  return (
    <section ref={ref} className="border-b border-white/[0.05]">
      <div className="mx-auto max-w-6xl px-8 py-24">
        <div className="reveal max-w-2xl">
          <div className="eyebrow">What we build</div>
          <h2 className="text-3xl sm:text-4xl mt-7 leading-snug">Premium builds. Production standards.</h2>
          <p className="text-muted mt-5 leading-relaxed">Voice agents, AI workforces and full platforms, designed and shipped by a senior team that scales with your scope. Everything below is production-grade: secure, integrated, and yours.</p>
        </div>
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {SERVICES.map((c) => (
            <div key={c.t} className="reveal flex flex-col">
              <div className="rule" />
              <h3 className="font-display text-lg text-ivory mt-4">{c.t}</h3>
              <p className="mt-2.5 text-[13px] text-muted leading-relaxed flex-1">{c.d}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-gold/80">{c.eg}</p>
            </div>
          ))}
        </div>
        <div className="reveal mt-16 rounded-xl border border-gold/25 bg-gold/[0.03] p-7 sm:p-9 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="font-display text-xl text-ivory">Not sure where AI fits your business?</h3>
            <p className="mt-2 text-[14px] text-muted leading-relaxed">Start with a fixed-fee AI audit: a two-week deep dive that maps the highest-ROI automations in your operation, with a costed roadmap. The fee is credited against your first build.</p>
          </div>
          <button onClick={() => scrollTo('contact')} className="shrink-0 rounded-full border border-gold/50 text-gold font-mono text-[11px] uppercase tracking-[0.18em] px-6 py-3 hover:bg-gold/10 transition">Book an audit →</button>
        </div>
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
const DEMO_TABS = [
  ['voice', 'Voice agent · live call'],
  ['agent', 'Ops agent · missions'],
];

function Playground() {
  const ref = useReveal();
  const [tab, setTab] = useState('voice');
  return (
    <section id="play" ref={ref} className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl px-8 py-32">
        <div className="reveal max-w-2xl">
          <div className="eyebrow">Live demos</div>
          <h2 className="text-4xl sm:text-5xl mt-7 leading-tight">Give an agent a job.<br className="hidden sm:block" /> Then interrupt it.</h2>
          <p className="reveal text-muted mt-6 max-w-xl leading-relaxed">
            This is what we build: AI that does real work, not chat. Take a live call with a <span className="text-ivory">voice agent</span> that speaks, books, and recovers when you cut it off mid-sentence. Or run an <span className="text-ivory">operations agent</span> on a mission and throw it a curveball. The same loop we ship to production on frontier models, replayed right in your browser.
          </p>
        </div>

        <div className="reveal mt-12 inline-flex rounded-full border border-white/[0.08] p-1 font-mono text-[10px] uppercase tracking-[0.16em]">
          {DEMO_TABS.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`rounded-full px-5 py-2.5 transition ${tab === id ? 'bg-accent text-ink font-semibold' : 'text-muted hover:text-ivory'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="reveal mt-8">
          {tab === 'voice' ? <VoiceAgent onOps={() => setTab('agent')} /> : <AgentConsole />}
        </div>
      </div>
    </section>
  );
}

/* ── How we work (trust) ────────────────────────────────────────────────── */
function Process() {
  const ref = useReveal();
  return (
    <section id="process" ref={ref} className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl px-8 py-32">
        <div className="reveal max-w-2xl">
          <div className="eyebrow">How we work</div>
          <h2 className="text-4xl sm:text-5xl mt-7 leading-tight">Big-firm discipline.<br className="hidden sm:block" /> Studio speed.</h2>
          <p className="text-muted mt-6 max-w-xl leading-relaxed">Premium does not mean slow, and fast does not mean fragile. It means one accountable owner, clear milestones, and work you can inspect every week.</p>
        </div>
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {TRUST.map((t) => (
            <div key={t.t} className="reveal surface p-7">
              <h3 className="font-display text-lg text-ivory">{t.t}</h3>
              <p className="mt-3 text-[13.5px] text-muted leading-relaxed">{t.d}</p>
            </div>
          ))}
        </div>
        <div className="reveal mt-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/70">Built on platforms your business already trusts</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {PLATFORMS.map((p) => <span key={p} className="chip">{p}</span>)}
          </div>
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
          <h2 className="reveal text-3xl sm:text-4xl mt-7 leading-snug">A studio with<br />founder attention.</h2>
          <p className="reveal text-muted mt-8 leading-relaxed">
            The studio is led by founder Aneesh Mohan and backed by a network of vetted specialist designers and engineers who join as your scope grows. You always know who is accountable: one senior owner, hands on your build, with the capacity to scale behind it.
          </p>
          <p className="reveal text-muted mt-4 leading-relaxed">
            The flagship is RiDERgy, our own product: agentic AI running EV charging and energy management in production, where reliability is non-negotiable. Every client project is held to that standard, from the architecture and the interface to the API, the data and the intelligence layer that makes it useful.
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

/* Form relay: Web3Forms (https://web3forms.com). The access key is public by
   design; it maps to the studio inbox without exposing the address anywhere
   on the page or in this bundle. Get a free key and paste it below. */
const WEB3FORMS_KEY = '59330203-42bb-48bb-9d3c-a96adeaf35c6';

const FIELD_CLS = 'w-full rounded-lg bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-[14px] text-ivory placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition';

function ContactForm() {
  const [state, setState] = useState('idle');
  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    if (data.get('botcheck')) return;
    if (WEB3FORMS_KEY.startsWith('REPLACE')) { setState('error'); return; }
    data.append('access_key', WEB3FORMS_KEY);
    data.append('subject', 'New inquiry · studio site');
    setState('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      const json = await res.json();
      if (json.success) { setState('sent'); form.reset(); } else setState('error');
    } catch {
      setState('error');
    }
  };

  if (state === 'sent') {
    return (
      <div className="mt-12 mx-auto max-w-lg rounded-xl border border-accent/30 bg-accent/[0.04] p-8 text-center">
        <div className="font-display text-2xl text-ivory">Message received.</div>
        <p className="mt-3 text-[14px] text-muted leading-relaxed">Expect a senior reply within a day. If it's urgent, mention that in a LinkedIn message too.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-12 mx-auto max-w-lg text-left">
      <input type="checkbox" name="botcheck" tabIndex="-1" autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Your name</label>
          <input id="cf-name" name="name" type="text" required maxLength="120" placeholder="Jane Founder" className={`mt-2 ${FIELD_CLS}`} />
        </div>
        <div>
          <label htmlFor="cf-email" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Your email</label>
          <input id="cf-email" name="email" type="email" required maxLength="200" placeholder="jane@company.com" className={`mt-2 ${FIELD_CLS}`} />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="cf-msg" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">What are we building?</label>
        <textarea id="cf-msg" name="message" required rows="5" maxLength="4000" placeholder="A voice agent for our clinic front desk. Two locations, about 90 calls a day…" className={`mt-2 ${FIELD_CLS} resize-y`} />
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-[10px] text-muted/60">Paid consultations available: strategy, architecture and AI roadmaps.</p>
        <button type="submit" disabled={state === 'sending'}
          className="rounded-full bg-accent text-ink font-semibold text-sm px-7 py-3 hover:brightness-110 active:scale-[.98] transition disabled:opacity-60">
          {state === 'sending' ? 'Sending…' : 'Send message'}
        </button>
      </div>
      {state === 'error' && (
        <p role="status" className="mt-4 text-[13px] text-danger/90">The form could not send just now. Please reach out via LinkedIn below instead.</p>
      )}
    </form>
  );
}

function Contact() {
  return (
    <section id="contact" className="relative border-t border-white/[0.05] overflow-hidden">
      <div className="glow w-[36rem] h-[36rem] -bottom-56 left-1/2 -translate-x-1/2" />
      <div className="relative mx-auto max-w-3xl px-8 py-36 text-center">
        <div className="eyebrow justify-center">Contact</div>
        <h2 className="text-4xl sm:text-6xl mt-8 leading-[1.08]">Have something<br /> worth building?</h2>
        <p className="mt-8 text-muted max-w-md mx-auto leading-relaxed">A voice agent, an AI workforce, a full platform, or a paid consultation to map your options. Tell us what you need and get a senior reply within a day.</p>
        <ContactForm />
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-muted/60">NDA-friendly · Milestone billing · Escrow via Upwork or Freelancer</p>
        <div className="mt-12 charge-track max-w-[14rem] mx-auto" />
        <div className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-3 font-mono text-[11px] uppercase tracking-[0.18em]">
          {SOCIALS.map((s) => (
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
      <WhatIBuild />
      <Work />
      <Playground />
      <Process />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
