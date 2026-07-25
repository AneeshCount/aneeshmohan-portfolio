#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════
   POST-BUILD CHECKS

   Unit tests run against source. These run against dist, which is what
   actually reaches a-niche.com, and catch the class of defect that only
   exists after bundling and only shows up in production:

     - a page listed in the sitemap that the build never emitted
     - a custom domain that lost its CNAME, taking the site offline
     - a page missing its canonical or consent bootstrap
     - the homepage quietly growing an article-sized bundle again

   Run: node scripts/check-build.mjs (after npm run build)
   ════════════════════════════════════════════════════════════════════════ */

import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const SITE_HOST = 'a-niche.com';

/* Every HTML entry the build is expected to emit, and what it must contain.
   The homepage budget is the important one: the insights teaser reads from
   meta.js so the four languages of article prose stay off the homepage. It
   is a ceiling, not a target, and raising it should be a deliberate act. */
const PAGES = [
  { path: 'index.html', canonical: `https://${SITE_HOST}/`, budgetKb: 420 },
  { path: 'insights/index.html', canonical: `https://${SITE_HOST}/insights/` },
  { path: 'labs/journal/index.html' },
];

const failures = [];
const fail = (msg) => failures.push(msg);

if (!existsSync(DIST)) {
  console.error('check-build: dist/ is missing. Run npm run build first.');
  process.exit(1);
}

/* ── Pages ──────────────────────────────────────────────────────────────── */
for (const page of PAGES) {
  const full = join(DIST, page.path);
  if (!existsSync(full)) {
    fail(`${page.path}: not emitted by the build`);
    continue;
  }
  const html = readFileSync(full, 'utf8');

  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${page.path}: no <title>`);
  if (!/name="description"\s+content="[^"]+"/.test(html)) {
    fail(`${page.path}: no meta description`);
  }

  if (page.canonical) {
    const found = html.match(/rel="canonical"\s+href="([^"]+)"/);
    if (!found) fail(`${page.path}: no canonical link`);
    else if (found[1] !== page.canonical) {
      fail(`${page.path}: canonical is ${found[1]}, expected ${page.canonical}`);
    }
    /* Consent Mode must default to denied before GTM loads, or the first
       pageview is recorded without permission. */
    if (!html.includes('GTM-')) fail(`${page.path}: no GTM container`);
    if (!html.includes("'denied'")) fail(`${page.path}: consent defaults are not denied`);
  }

  if (page.budgetKb) {
    const scripts = [...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((m) => m[1]);
    const preloads = [...html.matchAll(/rel="modulepreload"[^>]+href="([^"]+\.js)"/g)].map((m) => m[1]);
    const bytes = [...new Set([...scripts, ...preloads])]
      .map((src) => join(DIST, src.replace(/^\.?\//, '')))
      .filter((f) => existsSync(f))
      .reduce((sum, f) => sum + statSync(f).size, 0);
    const kb = Math.round(bytes / 1024);
    if (kb > page.budgetKb) {
      fail(`${page.path}: ships ${kb} kB of JS, over the ${page.budgetKb} kB budget`);
    } else {
      console.log(`  ${page.path}: ${kb} kB JS (budget ${page.budgetKb} kB)`);
    }
  }
}

/* ── Hosting files ──────────────────────────────────────────────────────── */
const cname = join(DIST, 'CNAME');
if (!existsSync(cname)) fail('CNAME: missing, the custom domain would drop on deploy');
else if (readFileSync(cname, 'utf8').trim() !== SITE_HOST) {
  fail(`CNAME: points at ${readFileSync(cname, 'utf8').trim()}, expected ${SITE_HOST}`);
}

for (const f of ['robots.txt', 'sitemap.xml', 'favicon.svg', 'og-image.png']) {
  if (!existsSync(join(DIST, f))) fail(`${f}: missing from the build`);
}

/* ── Sitemap points at pages that exist ─────────────────────────────────── */
const sitemapPath = join(DIST, 'sitemap.xml');
if (existsSync(sitemapPath)) {
  const locs = [...readFileSync(sitemapPath, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!locs.length) fail('sitemap.xml: lists no URLs');
  for (const loc of locs) {
    if (!loc.startsWith(`https://${SITE_HOST}/`)) {
      fail(`sitemap.xml: ${loc} is not on ${SITE_HOST}`);
      continue;
    }
    const rel = loc.replace(`https://${SITE_HOST}/`, '');
    const target = join(DIST, rel, rel.endsWith('/') || rel === '' ? 'index.html' : '');
    if (!existsSync(target)) fail(`sitemap.xml: ${loc} has no page in dist (${rel || 'index.html'})`);
  }
}

/* ── Report ─────────────────────────────────────────────────────────────── */
if (!failures.length) {
  console.log(`check-build: ${PAGES.length} pages, hosting files and sitemap all good`);
  process.exit(0);
}

console.error(`\ncheck-build: ${failures.length} problem(s)\n`);
for (const f of failures) console.error(`  ${f}`);
process.exit(1);
