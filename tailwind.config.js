/** @type {import('tailwindcss').Config} */

/* ════════════════════════════════════════════════════════════════════════
   The palette is indirected through CSS custom properties so one set of
   utility classes serves both theme regimes. `text-ivory` means "the
   foreground colour here": near-black on the dawn half of the page, off-white
   on the dusk half, decided by the `data-regime` attribute on the nearest
   section wrapper (see src/index.css).

   Each variable holds a space-separated RGB triple rather than a hex string
   so Tailwind's opacity modifiers keep working: `border-hair/10` compiles to
   rgb(var(--c-hair) / 0.1).
   ════════════════════════════════════════════════════════════════════════ */
const token = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './labs/**/*.{html,js,jsx}', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: token('--c-bg'),        // canvas
        panel: token('--c-panel'),   // raised surface, opaque
        ivory: token('--c-fg'),      // primary text
        muted: token('--c-muted'),   // body text
        accent: token('--c-accent'), // saffron: the one raised voice
        gold: token('--c-second'),   // indigo / periwinkle: eyebrows, labels
        hair: token('--c-hair'),     // hairlines, borders, faint fills
        danger: '#e04848',

        /* Regime-independent brand constants, for gradients and ornament
           fills that must stay the same colour on both halves. */
        saffron: '#E8833A',
        marigold: '#F0A14B',
        periwinkle: '#C7D2FE',
        indigo: '#4338CA',
        night: '#0B0E1A',
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'Didot', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        /* Dawn surfaces read as paper lifted off the page: no inset
           highlight, just a tight contact shadow under a soft ambient one. */
        paper: '0 1px 2px rgba(26,23,20,0.04), 0 12px 32px -12px rgba(26,23,20,0.10)',
        'paper-lg': '0 2px 4px rgba(26,23,20,0.05), 0 28px 60px -20px rgba(26,23,20,0.16)',
        /* Dusk surfaces are lit from their top edge instead. */
        elevated: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 18px 40px -14px rgba(0,0,0,0.65)',
        'elevated-lg': '0 1px 0 0 rgba(255,255,255,0.07) inset, 0 30px 60px -20px rgba(0,0,0,0.7)',
        glow: '0 10px 30px -8px rgb(var(--c-accent) / 0.45)',
        'glow-lg': '0 20px 50px -12px rgb(var(--c-accent) / 0.38)',
      },
    },
  },
  plugins: [],
};
