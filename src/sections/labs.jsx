import { useLang } from '../i18n.jsx';
import { useReveal } from '../ui.jsx';
import { LAB_LINKS } from '../config.js';

export function Labs() {
  const { s } = useLang();
  const ref = useReveal();
  return (
    <section id="labs" ref={ref} className="border-t border-hair/8">
      <div className="shell section-y">
        <div className="reveal max-w-2xl">
          <div className="eyebrow">{s.labs.eyebrow}</div>
          <h2 className="display-2 mt-5">{s.labs.h2a}<br />{s.labs.h2b}</h2>
          <p className="lede text-muted mt-6">{s.labs.p}</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {s.labs.items.map((it, i) => {
            const href = LAB_LINKS[i];
            const body = (
              <>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="card-title">{it.t}</h3>
                  <span className={`shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] border rounded-full px-2.5 py-1 ${
                    href ? 'text-accent border-accent/40 bg-accent/10' : 'text-gold border-gold/30 bg-gold/10'}`}>
                    {href ? s.labs.live : s.labs.soon}
                  </span>
                </div>
                <p className="card-body mt-3 flex-1">{it.d}</p>
                {href && <span className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">{s.labs.open}</span>}
              </>
            );
            return href ? (
              <a key={it.t} href={href} target="_blank" rel="noreferrer"
                className="reveal pcard spot tactile p-7 flex flex-col">
                {body}
              </a>
            ) : (
              <div key={it.t} className="reveal surface p-7 flex flex-col opacity-80">{body}</div>
            );
          })}
        </div>
        <p className="reveal mt-6 font-mono text-[10px] text-muted">{s.labs.note}</p>
      </div>
    </section>
  );
}
