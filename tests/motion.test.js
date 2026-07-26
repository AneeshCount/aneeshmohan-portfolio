import { afterEach, describe, expect, it, vi } from 'vitest';
import { detectTier, resolveTier, TIERS } from '../src/motion.js';
import { MOTION_KEY } from '../src/config.js';

/* The tier decides whether a visitor gets a canvas constellation and a
   rotating arc, or a completely static page. Getting it wrong in the generous
   direction burns battery on a phone and animates for someone who asked the
   OS not to; getting it wrong in the mean direction ships the stripped page to
   everyone. Both failures are silent, which is why they are tested. */

/* jsdom has no matchMedia and no navigator.connection, so each case installs
   exactly the signals it is about and clears them afterwards. */
function stubMedia(reduce) {
  window.matchMedia = vi.fn().mockImplementation((q) => ({
    matches: q.includes('prefers-reduced-motion') ? reduce : false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

function stubNavigator(props) {
  for (const [k, v] of Object.entries(props)) {
    Object.defineProperty(navigator, k, { value: v, configurable: true, writable: true });
  }
}

afterEach(() => {
  stubMedia(false);
  stubNavigator({ connection: undefined, deviceMemory: 8, hardwareConcurrency: 8 });
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('motion tiers', () => {
  it('returns one of the declared tiers', () => {
    stubMedia(false);
    expect(TIERS).toContain(detectTier());
  });

  it('goes still when the visitor asked for reduced motion', () => {
    stubMedia(true);
    expect(detectTier()).toBe('still');
  });

  it('goes still on a metered connection', () => {
    stubMedia(false);
    stubNavigator({ connection: { saveData: true, effectiveType: '4g' } });
    expect(detectTier()).toBe('still');
  });

  it('steps down to calm on a slow connection', () => {
    stubMedia(false);
    stubNavigator({ connection: { saveData: false, effectiveType: '3g' } });
    expect(detectTier()).toBe('calm');
  });

  it('steps down to calm on a low-memory device', () => {
    stubMedia(false);
    stubNavigator({ connection: undefined, deviceMemory: 2, hardwareConcurrency: 8 });
    expect(detectTier()).toBe('calm');
  });

  /* Most browsers expose neither connection nor deviceMemory. A missing signal
     is not evidence of a slow device, so the absence of everything must land on
     `full` rather than quietly shipping the static page to Safari and Firefox. */
  it('runs at full when the device reports nothing', () => {
    stubMedia(false);
    stubNavigator({ connection: undefined, deviceMemory: undefined, hardwareConcurrency: undefined });
    expect(detectTier()).toBe('full');
  });

  it('survives a browser with no matchMedia at all', () => {
    delete window.matchMedia;
    expect(TIERS).toContain(detectTier());
  });

  it('lets an explicit choice override detection in both directions', () => {
    stubMedia(true); // the OS says reduce
    localStorage.setItem(MOTION_KEY, 'full');
    expect(resolveTier()).toBe('full');

    stubMedia(false); // the OS says nothing
    localStorage.setItem(MOTION_KEY, 'still');
    expect(resolveTier()).toBe('still');
  });

  it('ignores a stored value that is not a tier', () => {
    stubMedia(false);
    localStorage.setItem(MOTION_KEY, 'sideways');
    expect(resolveTier()).toBe(detectTier());
  });
});
