import React, { useEffect, useRef, useState } from 'react';
import { PROJECTS, SKILLS, SOCIALS } from './data.js';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal') ?? [];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el, i) => { el.style.animationDelay = `${(i % 3) * 0.1}s`; io.observe(el); });
    return () => io.disconnect();
  });
  return ref;
}

const Arrow = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

/* ── Nav ────────────────────────────────────────────────────────────────── */
function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 24);
    window.addEventListener('scroll', f); return () => window.removeEventListener('scroll', f);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${solid ? 'bg-base/80 backdrop-blur border-b border-white/5' : ''}`}>
      <nav className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="font-extrabold tracking-tight text-white">aneesh<span className="grad-text">.</span></a>
        <div className="hidden sm:flex items-center gap-7 text-sm">
          {[['Work', 'work'], ['About', 'about'], ['Contact', 'contact']].map(([t, id]) => (
            <button key={id} onClick={() => scrollTo(id)} className="text-slate-400 hover:text-white transition">{t}</button>
          ))}
          <a href="mailto:mohananeesh003@gmail.com" className="rounded-full bg-white text-base font-semibold px-4 py-2 hover:bg-slate-200 transition">Hire me</a>
        </div>
        <a href="mailto:mohananeesh003@gmail.com" className="sm:hidden rounded-full bg-white text-base font-semibold px-4 py-2 text-sm">Hire me</a>
      </nav>
    </header>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden grid-bg min-h-screen flex items-center">
      <div className="aurora bg-v1 w-96 h-96 -top-20 -left-24 floaty" />
      <div className="aurora bg-v2 w-80 h-80 top-32 right-0 floaty" style={{ animationDelay: '1.5s' }} />
      <div className="aurora bg-v3 w-80 h-80 bottom-0 left-1/3 floaty" style={{ animationDelay: '3s' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-base/0 via-base/40 to-base" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 w-full">
        <div style={{ animation: 'fadeIn .8s both' }} className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Available for freelance & contract work
        </div>
        <h1 style={{ animation: 'fadeUp .8s .1s both' }} className="mt-6 text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
          I build full-stack<br />products with <span className="grad-text">agentic AI.</span>
        </h1>
        <p style={{ animation: 'fadeUp .8s .2s both' }} className="mt-6 text-lg text-slate-400 max-w-xl">
          I'm Aneesh Mohan, a full-stack and AI engineer. I take ideas from a blank page to production: clean frontends, solid APIs, real databases, and LLM agents that actually do the work.
        </p>
        <div style={{ animation: 'fadeUp .8s .3s both' }} className="mt-9 flex flex-wrap gap-3">
          <button onClick={() => scrollTo('work')} className="rounded-full bg-gradient-to-r from-v1 to-v2 text-white font-semibold px-6 py-3.5 hover:brightness-110 active:scale-95 transition shadow-lg shadow-fuchsia-500/20">View my work</button>
          <a href="mailto:mohananeesh003@gmail.com" className="rounded-full glass px-6 py-3.5 font-semibold text-white hover:bg-white/10 transition">Get in touch</a>
        </div>
        <div style={{ animation: 'fadeUp .8s .4s both' }} className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 font-mono">
          {['React', 'Next.js', 'FastAPI', 'Node', 'PostgreSQL', 'LLMs', 'AWS'].map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>
    </section>
  );
}

/* ── Work ───────────────────────────────────────────────────────────────── */
function Work() {
  const ref = useReveal();
  return (
    <section id="work" ref={ref} className="mx-auto max-w-5xl px-6 py-24">
      <div className="reveal flex items-end justify-between mb-12">
        <div>
          <p className="grad-text font-bold text-sm tracking-widest uppercase">Selected work</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Things I've built</h2>
        </div>
        <span className="hidden sm:block text-sm text-slate-500">{PROJECTS.length} projects</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {PROJECTS.map((p) => (
          <article key={p.name} className="reveal gcard p-6 flex flex-col hover:-translate-y-1 transition duration-300">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md bg-gradient-to-r ${p.accent} text-white`}>{p.tag}</span>
              {p.link && (
                <a href={p.link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition inline-flex items-center gap-1 text-sm">
                  {p.linkLabel} <Arrow />
                </a>
              )}
            </div>
            <h3 className="mt-4 text-2xl font-extrabold text-white">{p.name}</h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed flex-1">{p.blurb}</p>
            {p.note && <p className="mt-3 text-xs text-slate-500 italic">{p.note}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tech.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── About + Skills ─────────────────────────────────────────────────────── */
function About() {
  const ref = useReveal();
  return (
    <section id="about" ref={ref} className="relative">
      <div className="mx-auto max-w-5xl px-6 py-24 grid md:grid-cols-5 gap-12">
        <div className="md:col-span-2">
          <p className="reveal grad-text font-bold text-sm tracking-widest uppercase">About</p>
          <h2 className="reveal text-3xl font-extrabold text-white mt-2">Engineer, and founder.</h2>
          <p className="reveal text-slate-400 mt-4 leading-relaxed">
            I'm the founder of RiDERgy, where I build agentic AI for EV charging and energy management. I love the full arc of a product: architecture, a polished UI, the API and data model underneath, and the AI layer that makes it feel alive.
          </p>
          <p className="reveal text-slate-400 mt-3 leading-relaxed">
            I work fast, communicate clearly, and care about shipping things people actually use.
          </p>
        </div>
        <div className="md:col-span-3 grid sm:grid-cols-2 gap-4">
          {SKILLS.map((s) => (
            <div key={s.group} className="reveal gcard p-5">
              <h3 className="font-bold text-white">{s.group}</h3>
              <ul className="mt-3 space-y-1.5">
                {s.items.map((it) => (
                  <li key={it} className="text-sm text-slate-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-v1 to-v3" /> {it}
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
    <section id="contact" className="relative overflow-hidden">
      <div className="aurora bg-v2 w-96 h-96 -bottom-24 left-1/2 -translate-x-1/2 opacity-40" />
      <div className="relative mx-auto max-w-3xl px-6 py-28 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white">Let's build something <span className="grad-text">great.</span></h2>
        <p className="mt-4 text-slate-400 max-w-lg mx-auto">Have a product, an MVP, or an AI idea you want shipped? I'm available and I'd love to hear about it.</p>
        <a href="mailto:mohananeesh003@gmail.com" className="inline-flex items-center gap-2 mt-8 rounded-full bg-gradient-to-r from-v1 to-v2 text-white font-semibold px-7 py-4 hover:brightness-110 active:scale-95 transition shadow-lg shadow-fuchsia-500/20">
          mohananeesh003@gmail.com
        </a>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="glass rounded-full px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition">
              {s.label} <span className="text-slate-500">{s.handle}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
        <span className="font-extrabold text-white">aneesh<span className="grad-text">.</span></span>
        <span>© {new Date().getFullYear()} Aneesh Mohan. Built from scratch with React & Tailwind.</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Work />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
