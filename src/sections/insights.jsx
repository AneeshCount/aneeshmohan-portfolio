import { useLang } from '../i18n.jsx';
import { Arrow, useReveal } from '../ui.jsx';
import { getPreviews, uiFor } from '../insights/meta.js';

/* Carries the reader's language across to the /insights entry, which boots
   its own LangProvider and reads ?lang= before falling back to localStorage. */
export const insightsHref = (lang, id) => `insights/?lang=${lang}${id ? `#${id}` : ''}`;

export function InsightsTeaser() {
  const { lang } = useLang();
  const ref = useReveal();
  const ui = uiFor(lang);
  const articles = getPreviews(lang);

  return (
    <section id="insights" ref={ref} className="border-t border-hair/8">
      <div className="shell section-y">
        <div className="reveal max-w-2xl">
          <div className="eyebrow">{ui.homeEyebrow}</div>
          <h2 className="display-2 mt-5">{ui.homeH2a}<br />{ui.homeH2b}</h2>
          <p className="lede text-muted mt-6">{ui.homeP}</p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          {articles.map((a) => (
            <a
              key={a.id}
              href={insightsHref(lang, a.id)}
              className="reveal pcard spot tactile p-7 sm:p-8 flex flex-col"
            >
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em]">
                <span className="text-accent">{a.tag}</span>
                <span className="text-hair/25">·</span>
                <span className="text-muted">{a.readMins} {ui.minRead}</span>
              </div>
              <h3 className="card-title mt-5">{a.title}</h3>
              <p className="card-body mt-4 flex-1">{a.deck}</p>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                {ui.read} <Arrow className="w-3.5 h-3.5" />
              </span>
            </a>
          ))}
        </div>

        <a
          href={insightsHref(lang)}
          className="reveal mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-gold/80 hover:text-gold transition"
        >
          {ui.homeCta}
        </a>
      </div>
    </section>
  );
}
