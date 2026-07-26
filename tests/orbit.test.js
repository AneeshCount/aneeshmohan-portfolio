import { describe, expect, it } from 'vitest';
import { place, windowStart } from '../src/orbit.jsx';

describe('orbit geometry', () => {
  const box = { w: 426, h: 480 };
  const COUNT = 16;

  it('centres the selection while the list has room on both sides', () => {
    expect(windowStart(5, COUNT)).toBe(3);
    expect(place(5, 5, 3, COUNT, box).y).toBeCloseTo(480 / 2, 5);
  });

  /* The arc must stay full at the ends of the list. Clamping the window is what
     stops the last project from being selected with nothing below it but air. */
  it('clamps the window at both ends so the arc is never half empty', () => {
    expect(windowStart(0, COUNT)).toBe(0);
    expect(windowStart(1, COUNT)).toBe(0);
    expect(windowStart(COUNT - 1, COUNT)).toBe(COUNT - 5);
    for (const active of [0, 1, 7, COUNT - 2, COUNT - 1]) {
      const start = windowStart(active, COUNT);
      const shown = Array.from({ length: COUNT }, (_, i) => place(i, active, start, COUNT, box)).filter(Boolean);
      expect(shown, `active=${active}`).toHaveLength(5);
    }
  });

  it('gives the selected node the front position whatever the window', () => {
    for (const active of [0, 3, COUNT - 1]) {
      const start = windowStart(active, COUNT);
      const shown = Array.from({ length: COUNT }, (_, i) => {
        const p = place(i, active, start, COUNT, box);
        return p && { i, ...p };
      }).filter(Boolean);
      const sel = shown.find((p) => p.i === active);
      expect(sel.scale, `active=${active}`).toBeCloseTo(1, 5);
      expect(sel.opacity).toBeCloseTo(1, 5);
      expect(Math.max(...shown.map((p) => p.x))).toBeCloseTo(sel.x, 5);
      expect(Math.max(...shown.map((p) => p.scale))).toBeCloseTo(sel.scale, 5);
    }
  });

  it('spaces the visible nodes evenly and keeps them inside the box', () => {
    const start = windowStart(8, COUNT);
    const ys = Array.from({ length: COUNT }, (_, i) => place(i, 8, start, COUNT, box))
      .filter(Boolean).map((p) => p.y);
    const gaps = ys.slice(1).map((y, i) => y - ys[i]);
    for (const g of gaps) expect(g).toBeCloseTo(gaps[0], 5);
    for (const y of ys) { expect(y).toBeGreaterThan(0); expect(y).toBeLessThan(box.h); }
  });

  /* A node fading to nothing reads as a rendering fault, and the point of the
     receded nodes is to show that the list continues. */
  it('never fades a visible node to invisible', () => {
    const start = windowStart(8, COUNT);
    const ops = Array.from({ length: COUNT }, (_, i) => place(i, 8, start, COUNT, box))
      .filter(Boolean).map((p) => p.opacity);
    for (const o of ops) expect(o).toBeGreaterThan(0.2);
  });

  it('shows every node when the list is shorter than the arc', () => {
    const shown = Array.from({ length: 3 }, (_, i) => place(i, 0, windowStart(0, 3), 3, box)).filter(Boolean);
    expect(shown).toHaveLength(3);
  });
});
