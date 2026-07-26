import { useId } from 'react';

/* ════════════════════════════════════════════════════════════════════════
   ORNAMENT

   Authored geometry, drawn with `currentColor` so one component serves both
   theme regimes and nothing is fetched at runtime.

   The register here is deliberately engineered rather than cultural. The
   studio is made in India and the palette carries that on its own, quietly:
   a sunrise running from saffron into indigo. Everything in this file is
   instrument-panel geometry instead, in the vein of Linear: hairline
   construction, exact repeats, nothing decorative that is not also precise.
   Read as a set of tolerances, not as heritage ornament.
   ════════════════════════════════════════════════════════════════════════ */

/* A fine interlaced lattice: an upright square crossed by a 45-degree square,
   wired out to the tile midpoints so repeats interlock continuously instead of
   abutting. It is a compass-and-straightedge construction, and at 4% it reads
   as machined texture rather than as pattern.

   Rendered as a real <svg><pattern> rather than an encoded data URI so the
   stroke inherits colour from the regime instead of needing one baked copy per
   palette. The radial mask fades it out rather than cutting it, so it reads as
   depth. Replaces the square blueprint grid the page used to sit on. */
export function Lattice({ className = '', tile = 72 }) {
  const h = tile / 2;
  const q = tile / 4;
  /* Pattern and gradient ids are document-global, so every ornament mints its
     own. Two of these sharing an id would have the second silently paint with
     the first one's geometry. */
  const id = useId();
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{
        opacity: 'var(--lattice, .05)',
        WebkitMaskImage: 'radial-gradient(120% 90% at 50% 0%, #000 12%, transparent 78%)',
        maskImage: 'radial-gradient(120% 90% at 50% 0%, #000 12%, transparent 78%)',
      }}
      aria-hidden="true"
    >
      <svg className="w-full h-full text-ivory" fill="none">
        <defs>
          <pattern id={id} width={tile} height={tile} patternUnits="userSpaceOnUse">
            <path d={`M${q} ${q}H${tile - q}V${tile - q}H${q}Z`} stroke="currentColor" strokeWidth="0.75" />
            <path d={`M${h} ${q / 2}L${tile - q / 2} ${h}L${h} ${tile - q / 2}L${q / 2} ${h}Z`} stroke="currentColor" strokeWidth="0.75" />
            <path
              d={`M${h} 0V${q / 2}M${tile} ${h}H${tile - q / 2}M${h} ${tile}V${tile - q / 2}M0 ${h}H${q / 2}`}
              stroke="currentColor"
              strokeWidth="0.75"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

/* The aperture: concentric hairline arcs closing on a single lit point, set on
   a rule that fades at both ends. An iris stopping down, or a signal resolving
   out of noise. Used above the hero eyebrow and once in the handover band, and
   nowhere else, because a mark used three times stops being a mark. */
export function Aperture({ className = 'w-32 h-8' }) {
  const id = useId();
  return (
    <svg viewBox="0 0 128 24" fill="none" className={className} aria-hidden="true">
      {/* three stops of the iris, opening outward from the centre */}
      <path d="M64 4.5A7.5 7.5 0 0 1 64 19.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity=".9" />
      <path d="M64 4.5A7.5 7.5 0 0 0 64 19.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity=".9" />
      <path d="M55 1.5A13 13 0 0 0 55 22.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".45" />
      <path d="M73 1.5A13 13 0 0 1 73 22.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".45" />
      {/* the lit point at the centre: the one thing in focus */}
      <circle cx="64" cy="12" r="2" className="fill-accent" />
      {/* the rule it is set on */}
      <path d="M2 12H44" stroke={`url(#${id}-l)`} strokeWidth="1" />
      <path d="M84 12H126" stroke={`url(#${id}-r)`} strokeWidth="1" />
      <defs>
        <linearGradient id={`${id}-l`} x1="2" y1="0" x2="44" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".6" />
        </linearGradient>
        <linearGradient id={`${id}-r`} x1="126" y1="0" x2="84" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* An offset dot field, the registration lattice a plotter would index against.
   Sits behind the orbit so the arc of nodes traces its own line through a grid
   that is visibly regular, which is what makes the arc read as measured. */
export function DotField({ className = '' }) {
  const id = useId();
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{
        opacity: 'var(--lattice, .05)',
        WebkitMaskImage: 'radial-gradient(80% 80% at 50% 50%, #000 10%, transparent 72%)',
        maskImage: 'radial-gradient(80% 80% at 50% 50%, #000 10%, transparent 72%)',
      }}
      aria-hidden="true"
    >
      <svg className="w-full h-full text-ivory">
        <defs>
          <pattern id={id} width="44" height="44" patternUnits="userSpaceOnUse">
            <circle cx="11" cy="11" r="1.3" fill="currentColor" />
            <circle cx="33" cy="33" r="1.3" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
