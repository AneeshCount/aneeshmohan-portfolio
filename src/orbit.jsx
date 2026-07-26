import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useMediaQuery, useMotion, useTabs } from './ui.jsx';
import { tick } from './motion.js';
import { DotField } from './ornament.jsx';
import { ORBIT_DWELL_MS } from './config.js';

/* ════════════════════════════════════════════════════════════════════════
   ORBIT

   Sixteen projects, one on screen at a time. The old grid put sixteen 80-word
   blurbs on the page at once, which was most of the density problem in a
   single component.

   The nodes sit on the arc of a large circle whose centre is off to the left,
   so the arc bulges toward the reader. Node `i` is placed at an angle
   proportional to `i - active`, which means the selected project always swings
   to the same front position, furthest right and largest, while its neighbours
   fall back along the curve and fade. Selecting a different node re-runs the
   same layout with a new `active`, so the whole arc appears to rotate that
   project forward and grow it.

   Collapsed nodes carry the project name and nothing else. All the prose lives
   in the one detail panel, which is the trade that buys the page its air.

   Exactly one layout is mounted at a time. Rendering the arc and its fallback
   strip together and hiding one with CSS would duplicate the panel content,
   the tab ids and the focus refs, so the choice is made in JS.
   ════════════════════════════════════════════════════════════════════════ */

/* Geometry.

   Offsets are computed in pixels against a measured container, not in
   percentages: a CSS percentage inside `translate()` resolves against the
   element's own box, so percentage-positioned pills of different widths land in
   different places and pile up. Measuring once per resize and animating pixels
   keeps the motion on the compositor, which `left`/`top` transitions would not.

   The vertical spacing is linear in `k` while the horizontal recession, scale
   and opacity come off a cosine. A true circle compresses its ends, which put
   the outermost pills on top of each other; spacing them evenly and letting
   only the depth cues curve is what a coverflow arc actually does, and it reads
   as a curve while staying legible at the edges. */
const SPAN = 2;        // nodes either side of the front, so five slots
const SLOTS = SPAN * 2 + 1;
const SPREAD = 25;     // degrees of recession per step away from the front
const FRONT_X = 0.6;   // front node's centre, as a fraction of container width
const RECESS = 0.34;   // how far back the furthest node pulls, same units

/* Which slice of the list the arc is showing.

   Centring the selection and dropping whatever falls outside leaves the arc
   half empty at either end of the list: pick the last project and there is
   nothing below it but air. So the window slides and then stops, the way a
   scrollable list does. Near the ends the selection is off-centre but the arc
   stays full, and since scale and opacity key off distance from the selection
   rather than off slot position, the selected node is still the biggest and
   brightest one wherever it happens to sit.

   Wrapping the list around instead would keep the selection dead centre, but a
   node crossing from the bottom of the arc to the top would animate straight
   through the middle of it, which looks like a fault rather than a rotation. */
export function windowStart(active, count) {
  if (count <= SLOTS) return 0;
  return Math.min(Math.max(0, active - SPAN), count - SLOTS);
}

/* Where node `i` sits and how present it is. `slot` drives the vertical
   position, `k` (distance from the selection) drives every depth cue. */
export function place(i, active, start, count, box) {
  const slot = i - start;
  const visible = Math.min(count, SLOTS);
  if (slot < 0 || slot >= visible) return null;
  const k = i - active;
  const depth = Math.cos((k * SPREAD * Math.PI) / 180);
  const step = box.h / (visible + 1);
  return {
    x: box.w * FRONT_X - box.w * RECESS * (1 - depth),
    y: step * (slot + 1),
    scale: 0.66 + depth * 0.34,
    /* Floored well above zero: a node that fades to nothing looks like a bug,
       and the point is that the list continues past the edge of the arc. */
    opacity: 0.25 + 0.75 * Math.abs(depth) ** 1.5,
    z: Math.round(depth * 100), // nodes nearer the front sit above those behind
  };
}

export function Orbit({ items, active, onSelect, panelId, label, children }) {
  const { tier, full } = useMotion();
  const wide = useMediaQuery('(min-width: 768px)');
  const [engaged, setEngaged] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const arcRef = useRef(null);

  /* The arc needs room and needs motion to make sense. A phone gets the strip,
     and so does anyone who has asked for a static page. */
  const arc = wide && tier !== 'still';

  const select = useCallback((i) => {
    setEngaged(true);
    tick(tier);
    onSelect(i);
  }, [onSelect, tier]);

  const { tabProps, listProps, panelProps } = useTabs({
    count: items.length,
    active,
    onSelect: select,
    orientation: arc ? 'vertical' : 'horizontal',
  });

  /* Auto-advance, so an untouched page still demonstrates what the arc does.
     Runs only at tier `full`, pauses while the pointer or focus is inside the
     arc, and stops for good once the visitor picks a node: a manual choice is
     a statement of intent that a timer should not then override. */
  useEffect(() => {
    if (!arc || !full || engaged || hovering) return;
    const t = setInterval(() => onSelect((active + 1) % items.length), ORBIT_DWELL_MS);
    return () => clearInterval(t);
  }, [arc, full, engaged, hovering, active, items.length, onSelect]);

  /* The arc lays out in pixels, so it needs its own measurements.

     Measured in a layout effect, which runs after the DOM is laid out but
     before the browser paints, so the very first frame already has the nodes in
     the right places. Waiting on a ResizeObserver for the initial measurement
     would mean shipping one frame with an empty arc, and a ResizeObserver that
     is being throttled (a background tab, a hidden container) would mean
     shipping an arc that never appears at all.

     The observer then handles changes only, which is what it is good at: the
     container is a grid track, so it also resizes when the panel's content
     changes, not just when the window does. The resize listener is the fallback
     for browsers without ResizeObserver. */
  useLayoutEffect(() => {
    const el = arcRef.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      setBox((prev) => (prev.w === width && prev.h === height ? prev : { w: width, h: height }));
    };
    measure();

    if (typeof ResizeObserver === 'function') {
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [arc]);

  const start = windowStart(active, items.length);
  const front = box.w > 0 ? place(active, active, start, items.length, box) : null;
  const wire = front ? { x: box.w * FRONT_X, y: front.y } : null;

  if (!arc) {
    return (
      <div className="relative">
        <div
          {...listProps}
          aria-label={label}
          className="-mx-5 px-5 sm:mx-0 sm:px-0 flex gap-2.5 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-1"
        >
          {items.map((item, i) => (
            <button
              key={item.key}
              {...tabProps(i, panelId)}
              className={`snap-center shrink-0 rounded-full border font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2.5 tactile ${
                i === active
                  ? 'border-accent/60 bg-accent/10 text-ivory'
                  : 'border-hair/12 text-muted'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div {...panelProps(panelId)} className="mt-6">{children}</div>
      </div>
    );
  }

  return (
    <div className="relative grid grid-cols-[minmax(0,.82fr)_minmax(0,1.18fr)] gap-8 lg:gap-12 items-center">
      <DotField />
      <div
        ref={arcRef}
        {...listProps}
        aria-label={label}
        className="relative h-[26rem] lg:h-[30rem]"
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
      >
        {/* The wire from the selected node out to the panel, so the arc reads as
            connected to what it is showing rather than floating beside it. It
            tracks the node rather than sitting at a fixed height, because near
            the ends of the list the selection is not at the centre. */}
        {wire && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none text-accent" aria-hidden="true" fill="none">
            <line
              x1={wire.x} y1={wire.y} x2="100%" y2={wire.y}
              stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" opacity=".3"
              style={{ transition: 'all .62s var(--spring)' }}
            />
          </svg>
        )}

        {box.w > 0 && items.map((item, i) => {
          const p = place(i, active, start, items.length, box);
          if (!p) return null;
          const on = i === active;
          return (
            <button
              key={item.key}
              {...tabProps(i, panelId)}
              className={`absolute left-0 top-0 whitespace-nowrap rounded-full border font-mono uppercase tracking-[0.14em] tactile ${
                on
                  ? 'border-accent/60 bg-accent/10 text-ivory text-[11px] px-5 py-2.5'
                  : 'border-hair/12 text-muted text-[10px] px-4 py-2 hover:border-accent/40 hover:text-ivory'
              }`}
              style={{
                /* The -50% pair centres the pill on its computed point before
                   the scale is applied, so a node grows about its own centre
                   instead of drifting along the arc as it grows. Percentages are
                   safe here: they are the element's own box, which is what
                   centring wants. The position above them is in pixels. */
                transform: `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(${p.scale})`,
                opacity: p.opacity,
                zIndex: p.z,
                transition: full
                  ? 'transform .62s var(--spring), opacity .5s var(--ease-out), border-color .3s, color .3s'
                  : 'transform .28s var(--ease-out), opacity .28s, border-color .3s, color .3s',
              }}
            >
              {on && <span className="inline-block w-1 h-1 rounded-full bg-accent mr-2.5 align-middle" />}
              {item.label}
            </button>
          );
        })}
      </div>

      <div {...panelProps(panelId)} className="min-w-0">{children}</div>
    </div>
  );
}
