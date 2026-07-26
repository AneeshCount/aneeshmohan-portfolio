import { useMemo, useState } from 'react';
import { useLang } from '../i18n.jsx';
import { Arrow, useReveal } from '../ui.jsx';
import { Orbit } from '../orbit.jsx';
import { PROJECTS } from '../data.js';
import { WORK_PREVIEW_COUNT } from '../config.js';

/* ════════════════════════════════════════════════════════════════════════
   The work, one project at a time. The arc carries the names; this panel
   carries everything a visitor actually reads, which is why the section can
   hold sixteen projects without reading as sixteen projects.
   ════════════════════════════════════════════════════════════════════════ */

function Detail({ project, tr, index, total, s }) {
  const [openHow, setOpenHow] = useState(false);
  const howTo = tr.howTo;

  return (
    <article className="surface grain spot p-7 sm:p-9">
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-[11px] text-muted">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        {/* target and rel stay on one line: the content-rule check that catches
            an unsafe _blank reads line by line. */}
        {project.link && (
          <a
            href={project.link} target="_blank" rel="noreferrer"
            className="text-muted hover:text-accent transition inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider"
          >
            {tr.label} <Arrow className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      <h3 className="display-3 mt-5">{project.name}</h3>
      <p className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{tr.tag}</p>
      <p className="card-body mt-5">{tr.blurb}</p>

      {tr.note && !howTo && <p className="mt-6 text-xs text-muted italic">{tr.note}</p>}

      {howTo && (
        <div className="mt-6 pt-5 border-t border-hair/8">
          <button
            onClick={() => setOpenHow((v) => !v)}
            aria-expanded={openHow}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gold hover:text-accent transition"
          >
            <span className={`inline-block transition-transform duration-300 ${openHow ? 'rotate-45' : ''}`}>+</span>
            {s.work.howToCta}
          </button>
          {openHow && (
            <div className="mt-4 space-y-4">
              {tr.note && <p className="text-xs text-muted italic">{tr.note}</p>}
              <ol className="space-y-2.5 border-l border-gold/30 pl-4">
                {howTo.map((step, j) => (
                  <li key={j} className="card-body">
                    <span className="text-gold/80 font-mono text-[11px] mr-1.5">{j + 1}.</span>{step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      <div className="mt-7 flex flex-wrap gap-2">
        {project.tech.map((t) => <span key={t} className="chip">{t}</span>)}
      </div>
    </article>
  );
}

export function Work() {
  const { s } = useLang();
  const [showAll, setShowAll] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useReveal([showAll]);

  const count = showAll ? PROJECTS.length : WORK_PREVIEW_COUNT;
  const items = useMemo(
    () => PROJECTS.slice(0, count).map((p) => ({ key: p.id, label: p.name })),
    [count]
  );

  /* Collapsing the list while a later project is selected would leave the arc
     pointing at a node it no longer renders. */
  const safeActive = Math.min(active, items.length - 1);
  const project = PROJECTS[safeActive];
  /* Translations are index-aligned with PROJECTS (asserted in tests). The
     fallback keeps the panel rendering if a language is short. */
  const tr = s.projects[safeActive] ?? {};

  return (
    <section id="work" ref={ref} className="border-t border-hair/8">
      <div className="shell section-y">
        <div className="reveal max-w-2xl">
          <div className="eyebrow">{s.work.eyebrow}</div>
          <h2 className="display-2 mt-5">{s.work.h2a}<br className="hidden sm:block" /> {s.work.h2b}</h2>
        </div>

        <div className="reveal mt-10 sm:mt-14">
          <Orbit
            items={items}
            active={safeActive}
            onSelect={setActive}
            panelId="work-detail"
            label={s.work.eyebrow}
          >
            <Detail project={project} tr={tr} index={safeActive} total={PROJECTS.length} s={s} />
          </Orbit>
        </div>

        <div className="reveal mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <button
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gold hover:text-accent transition tactile"
          >
            <span className={`inline-block transition-transform duration-300 ${showAll ? 'rotate-45' : ''}`}>+</span>
            {showAll ? s.work.showLess : `${s.work.showAll} (${PROJECTS.length})`}
          </button>
          {/* The arc is genuinely arrow-navigable, so it should say so. */}
          <p className="hidden md:flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            <span className="kbd">↑</span><span className="kbd">↓</span> {s.work.keys}
          </p>
          <p className="md:hidden font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{s.work.swipe}</p>
        </div>
      </div>
    </section>
  );
}
