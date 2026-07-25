import { describe, expect, it } from 'vitest';
import { LANGS, STR } from '../src/i18n.jsx';
import { NAV_IDS } from '../src/config.js';
import { leaves, shape } from './shape.js';

/* The site renders four languages from one component tree. Every component
   indexes into STR by key and, in several places, by array position. A
   translation that drops a key or an array entry does not crash at build
   time; it renders `undefined` on a live page in a language the author does
   not read. These tests are the only thing standing between that and prod. */

const OTHERS = LANGS.filter((l) => l !== 'EN');

describe('i18n', () => {
  it('defines every declared language', () => {
    for (const lang of LANGS) expect(STR[lang], `STR.${lang}`).toBeTypeOf('object');
    expect(Object.keys(STR).sort()).toEqual([...LANGS].sort());
  });

  it.each(OTHERS)('%s has the same structure as EN', (lang) => {
    expect(shape(STR[lang])).toEqual(shape(STR.EN));
  });

  it.each(LANGS)('%s has no empty strings', (lang) => {
    const empty = leaves(STR[lang]).filter(({ text }) => text.trim() === '');
    expect(empty.map((e) => e.path)).toEqual([]);
  });

  it.each(LANGS)('%s obeys the ASCII-hyphen editorial rule', (lang) => {
    const bad = leaves(STR[lang]).filter(({ text }) => /[‒–—―−]/.test(text));
    expect(bad.map((b) => `${b.path}: ${b.text}`)).toEqual([]);
  });

  it.each(LANGS)('%s nav is aligned with NAV_IDS', (lang) => {
    expect(STR[lang].nav).toHaveLength(NAV_IDS.length);
  });
});
