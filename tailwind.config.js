/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './labs/**/*.{html,js,jsx}', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a1014',      // teal-black
        panel: '#0f1a1e',    // raised surface
        panel2: '#14242a',
        ivory: '#EAF0EE',    // bright primary text
        muted: '#AEBFBB',    // higher-contrast body text
        accent: '#2FE3BE',   // luminous teal (used sparingly)
        gold: '#CBB489',     // rare warm detail
        danger: '#ff5d5d',
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'Didot', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        // Tactile depth for a dark UI: a soft black drop plus a faint teal
        // halo, so raised elements read as lit rather than just outlined.
        elevated: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 18px 40px -14px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.05)',
        'elevated-lg': '0 1px 0 0 rgba(255,255,255,0.07) inset, 0 30px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)',
        glow: '0 10px 30px -8px rgba(47,227,190,0.45)',
        'glow-lg': '0 20px 50px -12px rgba(47,227,190,0.35)',
      },
    },
  },
  plugins: [],
};
