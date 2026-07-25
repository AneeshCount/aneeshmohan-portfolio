import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

/* jsdom has no IntersectionObserver, and every section mounts one through
   useReveal(). Stub it so component tests exercise real markup. */
class MockIntersectionObserver {
  constructor(cb) { this.cb = cb; }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}

/* The hero constellation asks for reduced-motion and then paints to a
   canvas. jsdom implements neither, so both are stubbed rather than mocked
   away: the components stay on their real code path. */
const matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
});

const canvas2d = () =>
  new Proxy(
    { canvas: null, measureText: () => ({ width: 0 }), getImageData: () => ({ data: [] }) },
    { get: (target, key) => (key in target ? target[key] : () => {}) }
  );

beforeEach(() => {
  globalThis.IntersectionObserver = MockIntersectionObserver;
  window.IntersectionObserver = MockIntersectionObserver;
  window.matchMedia = matchMedia;
  window.HTMLCanvasElement.prototype.getContext = canvas2d;
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  window.location.hash = '';
});
