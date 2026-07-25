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
    <section id="insights" ref={ref} className="border-t border-white/[0.05]">
      <div className="shell section-y">
        <div className="reveal max-w-2xl">
          <div className="eyebrow">{ui.homeEyebrow}</div>
          <h2 className="display-2 mt-5">{ui.homeH2a}<br />{ui.homeH2b}</h2>
          <p className="text-muted mt-5 leading-relaxed">{ui.homeP}</p>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-6">
          {articles.map((a) => (
            <a
              key={a.id}
              href={insightsHref(lang, a.id)}
              className="reveal surface spot p-7 sm:p-8 flex flex-col hover:border-accent/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em]">
                <span className="text-accent">{a.tag}</span>
                <span className="text-white/15">·</span>
                <span className="text-muted/60">{a.readMins} {ui.minRead}</span>
              </div>
              <h3 className="mt-5 font-display text-2xl text-ivory leading-snug">{a.title}</h3>
              <p className="mt-4 text-[14px] text-muted leading-relaxed flex-1">{a.deck}</p>
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
