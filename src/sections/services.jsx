import { useLang } from '../i18n.jsx';
import { useReveal, scrollTo } from '../ui.jsx';

export function WhatIBuild() {
  const { s } = useLang();
  const ref = useReveal();
  return (
    <section ref={ref} className="border-b border-white/[0.05]">
      <div className="shell section-y">
        <div className="reveal max-w-2xl">
          <div className="eyebrow">{s.wb.eyebrow}</div>
          <h2 className="display-2 mt-5">{s.wb.h2}</h2>
          <p className="text-muted mt-5 leading-relaxed">{s.wb.p}</p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {s.services.map((c) => (
            <div key={c.t} className="reveal flex flex-col">
              <div className="rule" />
              <h3 className="font-display text-lg text-ivory mt-4">{c.t}</h3>
              <p className="mt-2.5 text-[13px] text-muted leading-relaxed flex-1">{c.d}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-gold/80">{c.eg}</p>
            </div>
          ))}
        </div>
        <div className="reveal mt-10 rounded-xl border border-gold/25 bg-gold/[0.03] p-7 sm:p-9 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="font-display text-xl text-ivory">{s.audit.h}</h3>
            <p className="mt-2 text-[14px] text-muted leading-relaxed">{s.audit.p}</p>
          </div>
          <button onClick={() => scrollTo('contact')} className="shrink-0 rounded-full bg-gold text-ink font-mono text-[11px] uppercase tracking-[0.18em] px-6 py-3 hover:bg-ivory transition">{s.audit.cta}</button>
        </div>
      </div>
    </section>
  );
}
