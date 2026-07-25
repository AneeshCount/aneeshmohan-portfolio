import { describe, expect, it } from 'vitest';
import { LANGS } from '../src/i18n.jsx';
import {
  ARTICLE_BODIES,
  ARTICLE_IDS,
  ARTICLE_META,
  INSIGHTS_UI,
  PREVIEWS,
  getArticle,
  getArticles,
  getPreviews,
} from '../src/insights/articles.js';

/* Articles are stored as typed blocks rather than HTML strings precisely so
   that a translation cannot quietly drift: if the German version loses a
   heading or reorders a list, the block signature stops matching English and
   this suite fails before the page ships. */

const signature = (article) => article.blocks.map((b) => b.t).join(',');

describe('article data', () => {
  it.each(LANGS)('%s defines every article', (lang) => {
    expect(Object.keys(ARTICLE_BODIES[lang]).sort()).toEqual([...ARTICLE_IDS].sort());
  });

  it.each(LANGS)('%s has a preview for every article', (lang) => {
    for (const id of ARTICLE_IDS) {
      const preview = PREVIEWS[lang][id];
      expect(preview, `${lang} ${id}`).toBeTruthy();
      for (const key of ['tag', 'title', 'deck']) {
        expect(preview[key], `${lang} ${id}.${key}`).toBeTruthy();
      }
    }
  });

  it.each(ARTICLE_IDS)('%s has the same block structure in every language', (id) => {
    const en = signature(getArticle('EN', id));
    for (const lang of LANGS) {
      expect(signature(getArticle(lang, id)), `${lang} ${id}`).toBe(en);
    }
  });

  it.each(LANGS)('%s ships no empty blocks', (lang) => {
    for (const article of getArticles(lang)) {
      article.blocks.forEach((block, i) => {
        const where = `${lang} ${article.id} block[${i}] (${block.t})`;
        if (Array.isArray(block.v)) {
          expect(block.v.length, where).toBeGreaterThan(0);
          for (const item of block.v) expect(String(item).trim(), where).not.toBe('');
        } else {
          expect(String(block.v).trim(), where).not.toBe('');
        }
      });
    }
  });

  it.each(LANGS)('%s obeys the ASCII-hyphen editorial rule', (lang) => {
    const offenders = [];
    for (const article of getArticles(lang)) {
      for (const block of article.blocks) {
        const text = Array.isArray(block.v) ? block.v.join(' ') : String(block.v);
        if (/[‒–—―−]/.test(text)) offenders.push(`${article.id}: ${text.slice(0, 60)}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('dates every article as an ISO day and gives it a read time', () => {
    for (const id of ARTICLE_IDS) {
      expect(ARTICLE_META[id].date, id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(ARTICLE_META[id].date)), id).toBe(false);
      expect(ARTICLE_META[id].readMins, id).toBeGreaterThan(0);
    }
  });

  it.each(LANGS)('%s reader chrome is complete', (lang) => {
    const ui = INSIGHTS_UI[lang];
    expect(ui, lang).toBeTruthy();
    for (const [key, value] of Object.entries(INSIGHTS_UI.EN)) {
      if (typeof value !== 'string') continue;
      expect(ui[key], `${lang}.${key}`).toBeTruthy();
    }
  });
});

describe('article selectors', () => {
  it('previews carry metadata without the article body', () => {
    for (const preview of getPreviews('EN')) {
      expect(preview.title).toBeTruthy();
      expect(preview.readMins).toBeGreaterThan(0);
      expect(preview.blocks).toBeUndefined();
    }
  });

  it('falls back to English for an unknown language', () => {
    expect(getPreviews('JP').map((p) => p.title)).toEqual(getPreviews('EN').map((p) => p.title));
  });

  it('returns null for an unknown article id', () => {
    expect(getArticle('EN', 'not-an-article')).toBeNull();
  });

  it('keeps previews and articles in the same order', () => {
    expect(getArticles('EN').map((a) => a.id)).toEqual(ARTICLE_IDS);
    expect(getPreviews('DE').map((a) => a.id)).toEqual(ARTICLE_IDS);
  });
});
