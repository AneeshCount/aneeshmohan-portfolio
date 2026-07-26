import { useState } from 'react';
import { useLang } from '../i18n.jsx';
import { useReveal, useTabs, scrollTo } from '../ui.jsx';

/* ════════════════════════════════════════════════════════════════════════
   Eight capabilities, one on screen. The grid version put eight descriptions
   side by side, which is eight paragraphs the visitor has to triage before
   learning anything. A strip of eight short labels and one panel says the same
   thing and asks for one decision.
   ════════════════════════════════════════════════════════════════════════ */

export function WhatIBuild() {
  const { s } = useLang();
  const ref = useReveal();
  const [active, setActive] = useState(0);
  const { tabProps, listProps, panelProps } = useTabs({
    count: s.services.length,
    active,
    onSelect: setActive,
  });
  const service = s.services[active];

  return (
    <section ref={ref} className="border-t border-hair/8">
      <div className="shell section-y">
        <div className="reveal max-w-2xl">
          <div className="eyebrow">{s.wb.eyebrow}</div>
          <h2 className="display-2 mt-5">{s.wb.h2}</h2>
          <p className="lede text-muted mt-6 max-w-xl">{s.wb.p}</p>
        </div>

        {/* Eight labels in four languages will not fit one line on a phone, so
            the strip scrolls sideways rather than wrapping each label onto two
            lines inside its own pill. */}
        <div className="reveal mt-10 -mx-5 px-5 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
          <div {...listProps} aria-label={s.wb.eyebrow} className="tabstrip">
            {s.services.map((c, i) => (
              <button key={c.t} {...tabProps(i, 'service-panel')} className="tab tactile">
                {c.t}
              </button>
            ))}
          </div>
        </div>

        <div
          {...panelProps('service-panel')}
          className="surface spot mt-7 p-8 sm:p-11 min-h-[15rem] flex flex-col justify-center"
          /* Keyed on the active index so the panel re-mounts and fades rather
             than swapping its text in place, which reads as a jump. */
          key={active}
          style={{ animation: 'fadeIn .45s var(--ease-out) both' }}
        >
          <h3 className="display-3">{service.t}</h3>
          <p className="lede mt-5 text-muted max-w-2xl">{service.d}</p>
          <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.16em] text-gold">{service.eg}</p>
        </div>

        <div className="reveal mt-12 surface p-8 sm:p-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="display-3">{s.audit.h}</h3>
            <p className="card-body mt-3">{s.audit.p}</p>
          </div>
          <button onClick={() => scrollTo('contact')} className="btn-primary shrink-0">
            {s.audit.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
