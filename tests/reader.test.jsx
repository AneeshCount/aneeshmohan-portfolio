import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Insights from '../src/insights/Insights.jsx';
import { LangProvider } from '../src/i18n.jsx';
import { ARTICLE_IDS, getArticle } from '../src/insights/articles.js';

/* The reader has no router: the URL hash is the route. That makes deep links
   shareable and free, and it makes the failure mode "a shared link opens the
   wrong page", which is exactly what these tests pin down. */

const mount = () => render(<LangProvider><Insights /></LangProvider>);

describe('insights reader', () => {
  it('renders the index when there is no hash', () => {
    mount();
    for (const id of ARTICLE_IDS) {
      expect(screen.getByText(getArticle('EN', id).title)).toBeInTheDocument();
    }
  });

  it('opens the article named in the hash', () => {
    window.location.hash = ARTICLE_IDS[0];
    mount();
    const article = getArticle('EN', ARTICLE_IDS[0]);
    expect(screen.getByRole('heading', { level: 1, name: article.title })).toBeInTheDocument();
  });

  it('falls back to the index for an unknown hash instead of rendering nothing', () => {
    window.location.hash = 'not-an-article';
    mount();
    expect(screen.getByText(getArticle('EN', ARTICLE_IDS[1]).title)).toBeInTheDocument();
  });

  it('sets the hash when an article is opened, so the URL stays shareable', async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByText(getArticle('EN', ARTICLE_IDS[0]).title));
    await waitFor(() => expect(window.location.hash).toBe(`#${ARTICLE_IDS[0]}`));
  });

  it('titles the tab after the article being read', async () => {
    window.location.hash = ARTICLE_IDS[1];
    mount();
    await waitFor(() =>
      expect(document.title).toBe(`${getArticle('EN', ARTICLE_IDS[1]).title} · a-niche`)
    );
  });

  it('renders every block of the article body', () => {
    window.location.hash = ARTICLE_IDS[0];
    const { container } = mount();
    const article = getArticle('EN', ARTICLE_IDS[0]);
    const expected = {
      h: article.blocks.filter((b) => b.t === 'h').length,
      quote: article.blocks.filter((b) => b.t === 'quote').length,
      ul: article.blocks.filter((b) => b.t === 'ul').length,
      ol: article.blocks.filter((b) => b.t === 'ol').length,
    };
    expect(container.querySelectorAll('h2')).toHaveLength(expected.h);
    expect(container.querySelectorAll('blockquote')).toHaveLength(expected.quote);
    expect(container.querySelectorAll('ul')).toHaveLength(expected.ul);
    expect(container.querySelectorAll('ol')).toHaveLength(expected.ol);
  });

  it('carries the reader language back to the homepage links', () => {
    localStorage.setItem('lang', 'DE');
    const { container } = mount();
    const home = container.querySelector('a[href*="lang="]');
    expect(home.getAttribute('href')).toContain('lang=DE');
  });

  it('offers the other article as a next read', () => {
    window.location.hash = ARTICLE_IDS[0];
    mount();
    expect(screen.getByText(getArticle('EN', ARTICLE_IDS[1]).title)).toBeInTheDocument();
  });
});
