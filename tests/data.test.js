import { describe, expect, it } from 'vitest';
import { LANGS, STR } from '../src/i18n.jsx';
import { METRICS, PROJECTS, SKILLS, SOCIALS } from '../src/data.js';
import { LAB_LINKS, NAV_IDS, SITE_URL, WEB3FORMS_ENDPOINT, WORK_PREVIEW_COUNT } from '../src/config.js';

/* data.js holds language-independent facts, i18n.jsx holds the prose, and
   the components join them by array index. That contract is invisible in
   the source: reordering PROJECTS silently attaches the wrong description
   to the wrong project in all four languages. These tests are the contract. */

describe('projects', () => {
  it('has unique ids', () => {
    const ids = PROJECTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every project a name and at least one tech chip', () => {
    for (const p of PROJECTS) {
      expect(p.name, p.id).toBeTruthy();
      expect(p.tech.length, p.id).toBeGreaterThan(0);
    }
  });

  it('uses absolute https links or an explicit null', () => {
    for (const p of PROJECTS) {
      if (p.link === null) continue;
      expect(p.link, p.id).toMatch(/^https:\/\//);
    }
  });

  it.each(LANGS)('%s translations are index-aligned with PROJECTS', (lang) => {
    const tr = STR[lang].projects;
    expect(tr).toHaveLength(PROJECTS.length);
    tr.forEach((t, i) => {
      expect(t.tag, `${lang} projects[${i}] (${PROJECTS[i].id}) tag`).toBeTruthy();
      expect(t.blurb, `${lang} projects[${i}] (${PROJECTS[i].id}) blurb`).toBeTruthy();
    });
  });

  it.each(LANGS)('%s labels a project link if and only if there is a link', (lang) => {
    STR[lang].projects.forEach((t, i) => {
      const hasLabel = Boolean(t.label);
      expect(hasLabel, `${lang} ${PROJECTS[i].id}`).toBe(Boolean(PROJECTS[i].link));
    });
  });

  it('shows a preview slice smaller than the full list', () => {
    expect(WORK_PREVIEW_COUNT).toBeGreaterThan(0);
    expect(WORK_PREVIEW_COUNT).toBeLessThan(PROJECTS.length);
  });
});

describe('config', () => {
  it('points at the live host without a trailing slash', () => {
    expect(SITE_URL).toBe('https://a-niche.com');
  });

  it('posts the contact form over https', () => {
    expect(WEB3FORMS_ENDPOINT).toMatch(/^https:\/\//);
  });

  it('keeps NAV_IDS unique', () => {
    expect(new Set(NAV_IDS).size).toBe(NAV_IDS.length);
  });
});

describe('secondary data', () => {
  it.each(LANGS)('%s metric labels match METRICS', (lang) => {
    expect(STR[lang].metrics).toHaveLength(METRICS.length);
  });

  it.each(LANGS)('%s lab entries match LAB_LINKS', (lang) => {
    expect(STR[lang].labs.items).toHaveLength(LAB_LINKS.length);
  });

  it('names every skill group and fills it', () => {
    for (const group of SKILLS) {
      expect(group.group).toBeTruthy();
      expect(group.items.length, group.group).toBeGreaterThan(0);
    }
  });

  it('gives every social an https link', () => {
    for (const social of SOCIALS) expect(social.href, social.label).toMatch(/^https:\/\//);
  });
});
