import EN from './articles.en.js';
import DE from './articles.de.js';
import ES from './articles.es.js';
import FR from './articles.fr.js';
import { ARTICLE_IDS, ARTICLE_META, PREVIEWS } from './meta.js';

/* ════════════════════════════════════════════════════════════════════════
   Full articles: metadata from meta.js joined to the bodies. Importing
   this module pulls every language's prose, so only /insights should.
   The homepage teaser imports getPreviews from meta.js instead.
   ════════════════════════════════════════════════════════════════════════ */

const BODIES = { EN, DE, ES, FR };

/* Falls back to English per layer rather than all-or-nothing, so a language
   that is missing one article still renders the rest of its own copy. */
export function getArticles(lang) {
  const preview = PREVIEWS[lang] ?? PREVIEWS.EN;
  const body = BODIES[lang] ?? EN;
  return ARTICLE_IDS.map((id) => ({
    id,
    ...ARTICLE_META[id],
    ...(preview[id] ?? PREVIEWS.EN[id]),
    ...(body[id] ?? EN[id]),
  }));
}

export function getArticle(lang, id) {
  return getArticles(lang).find((a) => a.id === id) ?? null;
}

export { BODIES as ARTICLE_BODIES };
export { ARTICLE_IDS, ARTICLE_META, INSIGHTS_UI, PREVIEWS, getPreviews, uiFor } from './meta.js';
