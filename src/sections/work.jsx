import { useState } from 'react';
import { useLang } from '../i18n.jsx';
import { Arrow, useReveal } from '../ui.jsx';
import { PROJECTS } from '../data.js';
import { WORK_PREVIEW_COUNT } from '../config.js';

export function Work() {
  const { s } = useLang();
  const [openHow, setOpenHow] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const ref = useReveal([showAll]);
  const visibleProjects = showAll ? PROJECTS : PROJECTS.slice(0, WORK_PREVIEW_COUNT);

  return (
    <section id="work" ref={ref} className="shell section-y">
      <div className="reveal max-w-2xl">
        <div className="eyebrow">{s.work.eyebrow}</div>
        <h2 className="display-2 mt-5">{s.work.h2a}<br className="hidden sm:block" /> {s.work.h2b}</h2>
      </div>

      <p className="reveal mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted/50 sm:hidden">{s.work.swipe}</p>

      <div className="mt-6 sm:mt-10 flex gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-8 px-8 pb-2 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0">
        {visibleProjects.map((p, i) => {
          /* Translations are index-aligned with PROJECTS (asserted in tests).
             The fallback keeps the card rendering if a language is short. */
          const tr = s.projects[i] ?? {};
          const howTo = tr.howTo;
          const expanded = openHow === i;
          return (
            <article key={p.id} className="reveal pcard spot shrink-0 w-[86%] snap-center sm:w-auto sm:shrink p-7 sm:p-8 flex flex-col">
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-muted/60">{String(i + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}+</span>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noreferrer" className="text-muted hover:text-accent transition inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
                    {tr.label} <Arrow className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <h3 className="mt-6 text-3xl">{p.name}</h3>
              <p className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{tr.tag}</p>
              <p className="mt-5 text-[15px] text-muted leading-relaxed flex-1">{tr.blurb}</p>
              {tr.note && !howTo && <p className="mt-6 text-xs text-muted/70 italic">{tr.note}</p>}
              {howTo && (
                <div className="mt-6 pt-5 border-t border-white/[0.06]">
                  <button
                    onClick={() => setOpenHow(expanded ? null : i)}
                    aria-expanded={expanded}
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gold/80 hover:text-gold transition"
                  >
                    <span className={`inline-block transition-transform duration-300 ${expanded ? 'rotate-45' : ''}`}>+</span>
                    {s.work.howToCta}
                  </button>
                  {expanded && (
                    <div className="mt-4 space-y-4">
                      {tr.note && <p className="text-xs text-muted/70 italic">{tr.note}</p>}
                      <ol className="space-y-2.5 border-l border-gold/25 pl-4">
                        {howTo.map((step, j) => (
                          <li key={j} className="text-[13px] text-muted leading-relaxed">
                            <span className="text-gold/70 font-mono text-[11px] mr-1.5">{j + 1}.</span>{step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-2">
                {p.tech.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
            </article>
          );
        })}
      </div>
      <div className="reveal mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
        <button
          onClick={() => setShowAll(!showAll)}
          aria-expanded={showAll}
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gold/80 hover:text-gold transition"
        >
          <span className={`inline-block transition-transform duration-300 ${showAll ? 'rotate-45' : ''}`}>+</span>
          {showAll ? s.work.showLess : `${s.work.showAll} (${PROJECTS.length})`}
        </button>
        {!showAll && <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted/50">{s.work.more}</p>}
      </div>
    </section>
  );
}
