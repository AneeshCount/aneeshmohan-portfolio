/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
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
    },
  },
  plugins: [],
};
