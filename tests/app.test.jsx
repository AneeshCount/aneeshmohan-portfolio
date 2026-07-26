import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App.jsx';
import { LangProvider, LANGS, STR } from '../src/i18n.jsx';
import { MOTION_KEY, NAV_IDS, WORK_PREVIEW_COUNT } from '../src/config.js';
import { PROJECTS } from '../src/data.js';
import { insightsHref } from '../src/sections/insights.jsx';

/* A smoke test over the whole page. It will not catch a design regression,
   but it does catch the class of breakage that ships silently: a section
   losing its anchor so the nav scrolls nowhere, a language rendering
   `undefined`, or the insights link dropping the reader's language. */

const mount = () => render(<LangProvider><App /></LangProvider>);

describe('homepage', () => {
  it('renders every section the nav points at', () => {
    const { container } = mount();
    for (const id of NAV_IDS) {
      expect(container.querySelector(`#${id}`), `#${id}`).not.toBeNull();
    }
  });

  it('renders without leaking undefined into the copy', () => {
    const { container } = mount();
    expect(container.textContent).not.toMatch(/undefined|\[object Object\]/);
  });

  /* The orbit names the selected project twice on purpose, once on its node in
     the arc and once as the heading of the detail panel, which is the ordinary
     tab-label-plus-panel-heading pairing. So these assert presence and absence
     rather than a single match. */
  it('shows a preview of the work, not the whole list', () => {
    mount();
    expect(screen.getAllByText(PROJECTS[0].name).length).toBeGreaterThan(0);
    expect(screen.queryByText(PROJECTS.at(-1).name)).not.toBeInTheDocument();
  });

  it('expands to the full project list on request', async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole('button', { name: new RegExp(STR.EN.work.showAll, 'i') }));
    expect(screen.getByText(PROJECTS.at(-1).name)).toBeInTheDocument();
  });

  it('drives the work orbit from the keyboard', async () => {
    const user = userEvent.setup();
    mount();
    const nodes = screen.getAllByRole('tab').filter((t) => t.id.startsWith('work-detail-tab-'));
    expect(nodes.length).toBe(WORK_PREVIEW_COUNT);
    expect(nodes[0]).toHaveAttribute('aria-selected', 'true');

    /* Roving tabindex: the strip is one tab stop, and the arrows move within
       it. Anything else and a keyboard visitor tabs through sixteen nodes. */
    expect(nodes[0]).toHaveAttribute('tabindex', '0');
    expect(nodes[1]).toHaveAttribute('tabindex', '-1');

    nodes[0].focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getAllByRole('tab').find((t) => t.id === 'work-detail-tab-1'))
      .toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText(PROJECTS[1].name).length).toBeGreaterThan(0);

    /* End wraps to the last node the arc is currently showing. */
    await user.keyboard('{End}');
    expect(screen.getAllByText(PROJECTS[WORK_PREVIEW_COUNT - 1].name).length).toBeGreaterThan(0);
  });

  /* `.reveal` starts at opacity 0, so a static page that never reveals is not a
     degraded page, it is a blank one. With motion off there is no animation to
     wait for, so every reveal must already be shown, inline, on mount. */
  it('shows all revealed content immediately when motion is off', () => {
    localStorage.setItem(MOTION_KEY, 'still');
    const { container } = mount();
    const reveals = [...container.querySelectorAll('.reveal')];
    expect(reveals.length).toBeGreaterThan(0);
    const hidden = reveals.filter((el) => el.style.opacity !== '1');
    expect(hidden.map((el) => el.className)).toEqual([]);
  });

  it('leaves reveals to the observer when motion is on', () => {
    localStorage.setItem(MOTION_KEY, 'full');
    const { container } = mount();
    /* The stubbed observer never reports an intersection, so nothing has been
       revealed yet: proof the inline override above is specific to `still`
       rather than something that fires unconditionally. */
    const reveals = [...container.querySelectorAll('.reveal')];
    expect(reveals.every((el) => el.style.opacity !== '1')).toBe(true);
  });

  it('falls back to the plain strip rather than the arc when motion is off', () => {
    localStorage.setItem(MOTION_KEY, 'still');
    mount();
    const list = screen.getByRole('tablist', { name: STR.EN.work.eyebrow });
    expect(list.getAttribute('aria-orientation')).toBe('horizontal');
    /* Every project in the preview is reachable in the fallback, not just the
       five the arc would have had room for. */
    expect(screen.getAllByRole('tab').filter((t) => t.id.startsWith('work-detail-tab-')))
      .toHaveLength(WORK_PREVIEW_COUNT);
  });

  /* Every roll-up renders its label twice so one copy can slide in behind the
     other. If the duplicate is not hidden from assistive tech, the footer reads
     "LinkedIn LinkedIn, Work Work" and the animation has cost more than it
     bought. */
  it('hides the duplicate half of every roll-up from assistive tech', () => {
    const { container } = mount();
    const rollups = [...container.querySelectorAll('.rollup')];
    expect(rollups.length).toBeGreaterThan(0);
    for (const r of rollups) {
      const copies = [...r.children];
      expect(copies).toHaveLength(2);
      expect(copies[0].getAttribute('aria-hidden')).toBeNull();
      expect(copies[1].getAttribute('aria-hidden')).toBe('true');
      expect(copies[0].textContent).toBe(copies[1].textContent);
    }
  });

  it('gives every footer link one accessible name, not a doubled one', () => {
    const { container } = mount();
    const footer = container.querySelector('footer');
    for (const social of ['LinkedIn', 'X']) {
      const link = [...footer.querySelectorAll('a')]
        .find((a) => a.textContent.replace(/\s+/g, '') === social.repeat(2) || a.textContent.trim() === social);
      expect(link, social).toBeTruthy();
      /* jsdom has no accessibility-tree API, so this asserts the mechanism that
         produces the name: exactly one non-hidden copy of the label. */
      const visible = [...link.querySelectorAll('.rollup > span:not([aria-hidden])')];
      expect(visible.map((s) => s.textContent)).toEqual([social]);
    }
  });

  it('ties each tab strip to the panel it controls', () => {
    mount();
    for (const tab of screen.getAllByRole('tab')) {
      const panelId = tab.getAttribute('aria-controls');
      expect(document.getElementById(panelId), `panel ${panelId}`).not.toBeNull();
    }
  });

  it('links to insights with the current language attached', () => {
    const { container } = mount();
    const links = [...container.querySelectorAll('a[href^="insights/"]')];
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) expect(link.getAttribute('href')).toMatch(/^insights\/\?lang=EN(#|$)/);
    expect(links.map((l) => l.getAttribute('href'))).toContain(insightsHref('EN'));
  });

  it('sends every external link out safely', () => {
    const { container } = mount();
    for (const a of container.querySelectorAll('a[target="_blank"]')) {
      expect(a.getAttribute('rel'), a.getAttribute('href')).toContain('noreferrer');
    }
  });

  it('gives every in-page nav link a section to land on', () => {
    const { container } = mount();
    for (const a of container.querySelectorAll('a[href^="#"]')) {
      const id = a.getAttribute('href').slice(1);
      if (!id) continue;
      expect(container.querySelector(`#${id}`), `#${id}`).not.toBeNull();
    }
  });
});

describe('language switching', () => {
  it.each(LANGS)('renders the whole page in %s', (lang) => {
    localStorage.setItem('lang', lang);
    const { container } = mount();
    expect(container.textContent).toContain(STR[lang].hero.view);
    expect(container.textContent).not.toMatch(/undefined/);
  });

  it('swaps the copy when a visitor picks another language', async () => {
    const user = userEvent.setup();
    const { container } = mount();
    expect(container.textContent).toContain(STR.EN.hero.view);
    await user.click(screen.getAllByRole('button', { name: 'DE' })[0]);
    expect(container.textContent).toContain(STR.DE.hero.view);
  });

  it('records the choice so the next visit keeps it', async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getAllByRole('button', { name: 'ES' })[0]);
    expect(localStorage.getItem('lang')).toBe('ES');
  });

  it('marks the document language for screen readers and search engines', async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getAllByRole('button', { name: 'FR' })[0]);
    expect(document.documentElement.lang).toBe('fr');
  });
});
