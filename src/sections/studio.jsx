import { useState } from 'react';
import { useLang } from '../i18n.jsx';
import { useReveal, scrollTo } from '../ui.jsx';
import { PLATFORMS, SKILLS } from '../data.js';
import { TRUST_PREVIEW_COUNT } from '../config.js';

/* How we work: the trust section. Six commitments is the right number to make
   and the wrong number to put on screen at once, so three lead and the rest
   are one click away. Anyone reading this section is already interested enough
   to open it; anyone scanning gets past it in three cards. */
export function Process() {
  const { s } = useLang();
  const [showAll, setShowAll] = useState(false);
  const ref = useReveal([showAll]);
  const visible = showAll ? s.trust : s.trust.slice(0, TRUST_PREVIEW_COUNT);

  return (
    <section id="process" ref={ref} className="border-t border-hair/8">
      <div className="shell section-y">
        <div className="reveal max-w-2xl">
          <div className="eyebrow">{s.pr.eyebrow}</div>
          <h2 className="display-2 mt-5">{s.pr.h2a}<br className="hidden sm:block" /> {s.pr.h2b}</h2>
          <p className="lede text-muted mt-6 max-w-xl">{s.pr.p}</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((t) => (
            <div key={t.t} className="reveal surface spot p-7">
              <h3 className="card-title">{t.t}</h3>
              <p className="card-body mt-3">{t.d}</p>
            </div>
          ))}
        </div>
        {s.trust.length > TRUST_PREVIEW_COUNT && (
          <button
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="reveal mt-8 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gold hover:text-accent transition tactile"
          >
            <span className={`inline-block transition-transform duration-300 ${showAll ? 'rotate-45' : ''}`}>+</span>
            {showAll ? s.work.showLess : `${s.pr.showAll} (${s.trust.length})`}
          </button>
        )}
        <div className="reveal mt-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{s.pr.platforms}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {PLATFORMS.map((p) => <span key={p} className="chip">{p}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

export function About() {
  const { s } = useLang();
  const ref = useReveal();
  return (
    <section id="about" ref={ref} className="border-t border-hair/8">
      <div className="shell section-y grid md:grid-cols-5 gap-12">
        <div className="md:col-span-2">
          <div className="reveal eyebrow">{s.ab.eyebrow}</div>
          <h2 className="reveal display-2 mt-5">{s.ab.h2a}<br />{s.ab.h2b}</h2>
          <p className="reveal lede text-muted mt-8">{s.ab.p1}</p>
          <p className="reveal card-body mt-5">{s.ab.p2}</p>
        </div>
        <div className="md:col-span-3 grid sm:grid-cols-2 gap-x-8 gap-y-10">
          {SKILLS.map((group) => (
            <div key={group.group} className="reveal">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">{group.group}</h3>
              <div className="rule mt-4" />
              <ul className="mt-4 space-y-2.5">
                {group.items.map((it) => (
                  <li key={it} className="card-body flex items-center gap-3">
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

/* Join: talent and open applications. */
export function Join() {
  const { s } = useLang();
  const ref = useReveal();
  return (
    <section id="join" ref={ref} className="border-t border-hair/8">
      <div className="shell section-y">
        <div className="reveal max-w-2xl">
          <div className="eyebrow">{s.join.eyebrow}</div>
          <h2 className="display-2 mt-5">{s.join.h2a}<br />{s.join.h2b}</h2>
          <p className="lede text-muted mt-6">{s.join.p}</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {s.join.roles.map((r) => (
            <div key={r.t} className="reveal rounded-2xl border border-hair/10 p-5 hover:border-accent/40 transition-colors">
              <div className="card-title">{r.t}</div>
              <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{r.d}</div>
            </div>
          ))}
          <div className="reveal rounded-2xl border border-gold/30 bg-gold/[0.05] p-5">
            <div className="card-title !text-gold">{s.join.openT}</div>
            <p className="card-body mt-1.5">{s.join.openD}</p>
          </div>
        </div>
        <div className="reveal mt-10 flex flex-wrap items-center gap-6">
          <button onClick={() => scrollTo('contact')} className="btn-primary">
            {s.join.cta}
          </button>
          <p className="font-mono text-[10px] text-muted max-w-md leading-relaxed">{s.join.note}</p>
        </div>
      </div>
    </section>
  );
}
