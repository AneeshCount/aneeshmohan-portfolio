import { MOTION_KEY } from './config.js';

/* ════════════════════════════════════════════════════════════════════════
   MOTION TIERS

   One decision, made once, about how much this device and connection should
   be asked to animate. Previously this was three separate judgements that
   could disagree: a prefers-reduced-motion block in the stylesheet, a second
   check inside the particle canvas, and a pointer test in the spotlight hook.

     full   everything, including the canvas constellation and auto-advance
     calm   cheap reveals only: no canvas, no timers, no spotlight
     still  nothing moves; every element renders in its final state

   Everything that moves is ambient, so `still` costs no information and no
   functionality. The gradients, jaali lattice and ornaments are static paint
   and survive at every tier, which is what keeps the static page premium
   rather than merely stripped.

   The tier is written to `data-motion` on <html>, where the stylesheet gates
   ambient animation off it, and read through useMotion() by the components
   that should skip mounting work rather than merely hide it.
   ════════════════════════════════════════════════════════════════════════ */

export const TIERS = ['full', 'calm', 'still'];

/* Guarded because this runs during module init in jsdom and on old Safari,
   where any of `matchMedia`, `navigator.connection` and `localStorage` can be
   missing or throw. A missing signal should never be read as a slow device. */
const mq = (q) => {
  try { return window.matchMedia?.(q).matches ?? false; } catch { return false; }
};

export function detectTier() {
  if (mq('(prefers-reduced-motion: reduce)')) return 'still';

  /* Effective connection type and saveData are only exposed by Chromium, so
     most visitors fall through to `full`. That is the right default: the
     signals below are evidence to step down, not evidence to step up. */
  const c = typeof navigator !== 'undefined'
    ? (navigator.connection || navigator.mozConnection || navigator.webkitConnection)
    : null;

  if (c?.saveData) return 'still';
  if (c && ['slow-2g', '2g', '3g'].includes(c.effectiveType)) return 'calm';

  if (typeof navigator !== 'undefined') {
    if ((navigator.deviceMemory ?? 8) <= 4) return 'calm';
    if ((navigator.hardwareConcurrency ?? 8) <= 4) return 'calm';
  }
  return 'full';
}

export function storedTier() {
  try {
    const v = localStorage.getItem(MOTION_KEY);
    return TIERS.includes(v) ? v : null;
  } catch { return null; }
}

/* A visitor's explicit choice always beats detection, in both directions:
   someone who turns motion on over a 3g connection has said they want it. */
export function resolveTier() {
  return storedTier() ?? detectTier();
}

export function applyTier(tier) {
  try { document.documentElement.setAttribute('data-motion', tier); } catch { /* no document */ }
}

export function persistTier(tier) {
  try {
    if (tier === null) localStorage.removeItem(MOTION_KEY);
    else localStorage.setItem(MOTION_KEY, tier);
  } catch { /* private mode: the tier still applies for this page view */ }
}

/* A real 8ms tick when a touch visitor lands on an orbit node. The desktop
   equivalent of this feedback is the press scale and the node lighting up;
   on a phone there is a finger on the glass and the hardware can answer it.

   Deliberately shorter than any notification buzz: this should register as the
   control having detent, not as an alert. Android only, since iOS Safari does
   not implement the Vibration API, and never when motion is off, because
   someone who asked for stillness meant all of it. */
export function tick(tier) {
  if (tier === 'still') return;
  try { navigator.vibrate?.(8); } catch { /* unsupported or blocked */ }
}
