#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════
   EDITORIAL AND CONTENT RULES

   Things a linter cannot see and a human reviewer misses on the fourth
   language. Every rule here exists because breaking it ships a visible
   defect to a-niche.com, not because it offends a style guide.

   Run: npm run rules
   ════════════════════════════════════════════════════════════════════════ */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SITE_HOST = 'a-niche.com';

/* These rules police shipped content. `tests` and `scripts` are tooling that
   no visitor reads, and both legitimately contain the characters and markers
   the rules forbid, because that is what they are checking for. */
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'coverage', '.github', 'tests']);
const SCAN_EXT = new Set(['.js', '.jsx', '.html', '.css', '.json', '.txt', '.xml']);
const SKIP_FILES = new Set(['package-lock.json']);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry) || SKIP_FILES.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (SCAN_EXT.has(extname(entry))) out.push(full);
  }
  return out;
}

/* ── Rules ──────────────────────────────────────────────────────────────
   Each rule is { id, why, test(line, file) -> message | null }. Rules run
   per line so every violation reports a jump-to location.
   ──────────────────────────────────────────────────────────────────────── */

/* The house editorial rule. Em dash, en dash, minus sign, figure dash and
   horizontal bar all render inconsistently across the four languages and
   across the display font; ASCII hyphen only. */
const FORBIDDEN_DASHES = [
  ['—', 'em dash'],
  ['–', 'en dash'],
  ['−', 'minus sign'],
  ['‒', 'figure dash'],
  ['―', 'horizontal bar'],
];

const RULES = [
  {
    id: 'no-fancy-dashes',
    why: 'House editorial rule: ASCII hyphen only, in every language.',
    test(line) {
      const hits = FORBIDDEN_DASHES.filter(([ch]) => line.includes(ch));
      if (!hits.length) return null;
      return `contains ${hits.map(([, name]) => name).join(', ')}`;
    },
  },
  {
    id: 'no-placeholders',
    why: 'Placeholder text must never reach a build.',
    test(line, file) {
      if (file.startsWith('scripts/')) return null; // this file names the markers
      const m = line.match(/\b(REPLACE_ME|LOREM IPSUM|Lorem ipsum|XXX_TODO)\b/);
      return m ? `placeholder marker "${m[1]}"` : null;
    },
  },
  {
    id: 'canonical-host',
    why: `Canonical, og:url and sitemap entries must point at ${SITE_HOST}, not a pre-rebrand host.`,
    test(line, file) {
      if (extname(file) !== '.html' && extname(file) !== '.xml') return null;
      const isUrlTag = /rel="canonical"|property="og:url"|<loc>/.test(line);
      if (!isUrlTag) return null;
      const url = line.match(/https?:\/\/[^"<\s]+/);
      if (!url) return null;
      return url[0].includes(SITE_HOST) ? null : `points at ${url[0]}`;
    },
  },
  {
    id: 'external-links-safe',
    why: 'target="_blank" without rel="noreferrer" leaks the referrer and exposes window.opener.',
    test(line) {
      if (!line.includes('target="_blank"')) return null;
      return /rel="(noreferrer|noopener)/.test(line) || line.includes('rel="noreferrer"')
        ? null
        : 'target="_blank" without rel="noreferrer"';
    },
  },
];

/* ── Runner ─────────────────────────────────────────────────────────────── */
const files = walk(ROOT);
const violations = [];

for (const file of files) {
  const rel = relative(ROOT, file);
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      const message = rule.test(line, rel);
      if (message) violations.push({ rel, line: i + 1, rule, message });
    }
  });
}

if (violations.length === 0) {
  console.log(`content rules: ${RULES.length} rules, ${files.length} files, no violations`);
  process.exit(0);
}

const byRule = new Map();
for (const v of violations) {
  if (!byRule.has(v.rule.id)) byRule.set(v.rule.id, { why: v.rule.why, items: [] });
  byRule.get(v.rule.id).items.push(v);
}

console.error(`content rules: ${violations.length} violation(s)\n`);
for (const [id, { why, items }] of byRule) {
  console.error(`  ${id}: ${why}`);
  for (const v of items) console.error(`    ${v.rel}:${v.line}  ${v.message}`);
  console.error('');
}
process.exit(1);
