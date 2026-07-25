import { useCallback, useEffect, useState } from 'react';
import { useLang } from '../i18n.jsx';
import { Arrow, LangSwitch, Wordmark, useReveal, useSpotlight } from '../ui.jsx';
import { ARTICLE_IDS, getArticle, getArticles, uiFor } from './articles.js';

/* ════════════════════════════════════════════════════════════════════════
   INSIGHTS READER: a hash-routed reader over the article data. The hash is
   the article id, so /insights/#why-ai-fails is shareable and survives a
   reload, and an empty hash renders the index. No router dependency.
   ════════════════════════════════════════════════════════════════════════ */

const homeHref = (lang, hash = '') => `../?lang=${lang}${hash}`;

function currentId() {
  const id = window.location.hash.slice(1);
  return ARTICLE_IDS.includes(id) ? id : null;
}

function useHashRoute() {
  const [id, setId] = useState(currentId);
  useEffect(() => {
    const onHash = () => { setId(currentId()); window.scrollTo({ top: 0, behavior: 'instant' }); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const go = useCallback((next) => {
    window.location.hash = next ?? '';
    if (!next) window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  return [id, go];
}

/* ── Chrome ─────────────────────────────────────────────────────────────── */
function Header({ lang }) {
  return (
    <header className="sticky top-0 z-50 bg-ink/90 backdrop-blur-md border-b border-white/[0.05]">
      <nav className="shell-narrow h-16 flex items-center justify-between">
        <a href={homeHref(lang)} className="text-ivory"><Wordmark /></a>
        <LangSwitch />
      </nav>
    </header>
  );
}

function Cta({ lang, ui }) {
  return (
    <div className="mt-16 rounded-xl border border-gold/25 bg-gold/[0.03] p-7 sm:p-9">
      <h3 className="font-display text-xl text-ivory">{ui.ctaH}</h3>
      <p className="mt-3 text-[14px] text-muted leading-relaxed">{ui.ctaP}</p>
      <a
        href={homeHref(lang, '#contact')}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold text-ink font-mono text-[11px] uppercase tracking-[0.18em] px-6 py-3 hover:bg-ivory transition"
      >
        {ui.ctaBtn}
      </a>
    </div>
  );
}

/* ── Article body ───────────────────────────────────────────────────────── */
function Block({ block }) {
  switch (block.t) {
    case 'h':
      return <h2 className="font-display text-2xl sm:text-[1.75rem] text-ivory leading-snug mt-14 mb-5">{block.v}</h2>;
    case 'quote':
      return (
        <blockquote className="my-10 border-l-2 border-accent/50 pl-6">
          <p className="font-display text-xl sm:text-2xl text-ivory/90 italic leading-snug">{block.v}</p>
        </blockquote>
      );
    case 'ul':
      return (
        <ul className="my-6 space-y-3">
          {block.v.map((item) => (
            <li key={item} className="flex gap-3.5 text-[16px] text-muted leading-relaxed">
              <span className="mt-[0.6em] w-1 h-1 shrink-0 rounded-full bg-accent/70" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="my-6 space-y-3 border-l border-gold/25 pl-5">
          {block.v.map((item, i) => (
            <li key={item} className="text-[16px] text-muted leading-relaxed">
              <span className="text-gold/70 font-mono text-[13px] mr-2">{i + 1}.</span>{item}
            </li>
          ))}
        </ol>
      );
    default:
      return <p className="my-5 text-[16px] sm:text-[17px] text-muted leading-[1.75]">{block.v}</p>;
  }
}

function Article({ article, lang, ui, go }) {
  const others = getArticles(lang).filter((a) => a.id !== article.id);

  /* Keep the tab title and the shared-link description in step with the
     article being read; the static tags in index.html cover the index. */
  useEffect(() => {
    const prev = document.title;
    document.title = `${article.title} · a-niche`;
    return () => { document.title = prev; };
  }, [article.title]);

  return (
    <article className="shell-narrow section-y">
      <button onClick={() => go(null)} className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted hover:text-ivory transition">
        {ui.back}
      </button>

      <div className="mt-10 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em]">
        <span className="text-accent">{article.tag}</span>
        <span className="text-white/15">·</span>
        <time className="text-muted/60" dateTime={article.date}>{article.date}</time>
        <span className="text-white/15">·</span>
        <span className="text-muted/60">{article.readMins} {ui.minRead}</span>
      </div>

      <h1 className="mt-6 font-display text-[2.25rem] sm:text-[3.25rem] leading-[1.08] tracking-tight text-ivory">{article.title}</h1>
      <p className="mt-6 text-lg text-muted/90 leading-relaxed">{article.deck}</p>
      <div className="mt-10 rule" />

      <div className="mt-8">
        {article.blocks.map((block, i) => <Block key={i} block={block} />)}
      </div>

      <Cta lang={lang} ui={ui} />

      {others.length > 0 && (
        <div className="mt-16 pt-10 border-t border-white/[0.06]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">{ui.next}</p>
          <div className="mt-5 grid gap-5">
            {others.map((a) => (
              <button key={a.id} onClick={() => go(a.id)} className="surface spot p-6 text-left hover:border-accent/40 transition-colors">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">{a.tag}</span>
                <h3 className="mt-3 font-display text-xl text-ivory leading-snug">{a.title}</h3>
                <p className="mt-2.5 text-[14px] text-muted leading-relaxed">{a.deck}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

/* ── Index ──────────────────────────────────────────────────────────────── */
function Index({ lang, ui, go }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="shell-narrow section-y">
      <a href={homeHref(lang)} className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted hover:text-ivory transition">
        {ui.backHome}
      </a>
      <div className="reveal mt-10">
        <div className="eyebrow">{ui.eyebrow}</div>
        <h1 className="mt-6 font-display text-[2.5rem] sm:text-[3.5rem] leading-[1.05] tracking-tight text-ivory">{ui.kicker}</h1>
        <p className="mt-6 text-lg text-muted leading-relaxed max-w-xl">{ui.intro}</p>
      </div>

      <div className="mt-14 grid gap-6">
        {getArticles(lang).map((a) => (
          <button key={a.id} onClick={() => go(a.id)} className="reveal surface spot p-7 sm:p-8 text-left hover:border-accent/40 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em]">
              <span className="text-accent">{a.tag}</span>
              <span className="text-white/15">·</span>
              <time className="text-muted/60" dateTime={a.date}>{a.date}</time>
              <span className="text-white/15">·</span>
              <span className="text-muted/60">{a.readMins} {ui.minRead}</span>
            </div>
            <h2 className="mt-5 font-display text-2xl sm:text-3xl text-ivory leading-snug">{a.title}</h2>
            <p className="mt-4 text-[15px] text-muted leading-relaxed">{a.deck}</p>
            <span className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
              {ui.read} <Arrow className="w-3.5 h-3.5" />
            </span>
          </button>
        ))}
      </div>

      <Cta lang={lang} ui={ui} />
    </div>
  );
}

export default function Insights() {
  const { lang } = useLang();
  const [id, go] = useHashRoute();
  useSpotlight();
  const ui = uiFor(lang);
  const article = id ? getArticle(lang, id) : null;

  return (
    <>
      <Header lang={lang} />
      <main>
        {article
          ? <Article article={article} lang={lang} ui={ui} go={go} />
          : <Index lang={lang} ui={ui} go={go} />}
      </main>
      <footer className="border-t border-white/[0.05]">
        <div className="shell-narrow py-10 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted/70">
          <a href={homeHref(lang)} className="text-ivory text-sm normal-case"><Wordmark /></a>
          <span>© {new Date().getFullYear()} a-niche</span>
        </div>
      </footer>
    </>
  );
}
