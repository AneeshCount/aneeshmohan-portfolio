import { useLang } from '../i18n.jsx';
import { useReveal, scrollTo } from '../ui.jsx';
import { PLATFORMS, SKILLS } from '../data.js';

/* How we work: the trust section. */
export function Process() {
  const { s } = useLang();
  const ref = useReveal();
  return (
    <section id="process" ref={ref} className="border-t border-white/[0.05]">
      <div className="shell section-y">
        <div className="reveal max-w-2xl">
          <div className="eyebrow">{s.pr.eyebrow}</div>
          <h2 className="display-2 mt-5">{s.pr.h2a}<br className="hidden sm:block" /> {s.pr.h2b}</h2>
          <p className="text-muted mt-6 max-w-xl leading-relaxed">{s.pr.p}</p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {s.trust.map((t) => (
            <div key={t.t} className="reveal surface spot p-7">
              <h3 className="font-display text-lg text-ivory">{t.t}</h3>
              <p className="mt-3 text-[13.5px] text-muted leading-relaxed">{t.d}</p>
            </div>
          ))}
        </div>
        <div className="reveal mt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/70">{s.pr.platforms}</p>
          <div className="mt-4 flex flex-wrap gap-2">
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
    <section id="about" ref={ref} className="border-t border-white/[0.05]">
      <div className="shell section-y grid md:grid-cols-5 gap-12">
        <div className="md:col-span-2">
          <div className="reveal eyebrow">{s.ab.eyebrow}</div>
          <h2 className="reveal display-2 mt-5">{s.ab.h2a}<br />{s.ab.h2b}</h2>
          <p className="reveal text-muted mt-8 leading-relaxed">{s.ab.p1}</p>
          <p className="reveal text-muted mt-4 leading-relaxed">{s.ab.p2}</p>
        </div>
        <div className="md:col-span-3 grid sm:grid-cols-2 gap-x-7 gap-y-10">
          {SKILLS.map((group) => (
            <div key={group.group} className="reveal">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">{group.group}</h3>
              <div className="rule mt-4" />
              <ul className="mt-4 space-y-2.5">
                {group.items.map((it) => (
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

/* Join: talent and open applications. */
export function Join() {
  const { s } = useLang();
  const ref = useReveal();
  return (
    <section id="join" ref={ref} className="border-t border-white/[0.05]">
      <div className="shell section-y">
        <div className="reveal max-w-2xl">
          <div className="eyebrow">{s.join.eyebrow}</div>
          <h2 className="display-2 mt-5">{s.join.h2a}<br />{s.join.h2b}</h2>
          <p className="text-muted mt-5 leading-relaxed">{s.join.p}</p>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {s.join.roles.map((r) => (
            <div key={r.t} className="reveal rounded-xl border border-white/[0.08] p-5 hover:border-accent/40 transition-colors">
              <div className="font-display text-[17px] text-ivory">{r.t}</div>
              <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{r.d}</div>
            </div>
          ))}
          <div className="reveal rounded-xl border border-gold/30 bg-gold/[0.04] p-5">
            <div className="font-display text-[17px] text-gold">{s.join.openT}</div>
            <p className="mt-1.5 text-[12.5px] text-muted leading-relaxed">{s.join.openD}</p>
          </div>
        </div>
        <div className="reveal mt-8 flex flex-wrap items-center gap-5">
          <button onClick={() => scrollTo('contact')} className="rounded-full bg-accent text-ink font-semibold text-sm px-7 py-3 hover:brightness-110 active:scale-[.98] transition">
            {s.join.cta}
          </button>
          <p className="font-mono text-[10px] text-muted/60 max-w-md leading-relaxed">{s.join.note}</p>
        </div>
      </div>
    </section>
  );
}
