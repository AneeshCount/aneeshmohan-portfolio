/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0c',      // warm near-black
        panel: '#121215',    // raised surface
        panel2: '#17171b',
        ivory: '#ECE7DC',    // warm off-white (primary text)
        muted: '#8d887e',    // warm muted body text
        accent: '#27e0d4',   // electric cyan, used sparingly
        gold: '#c7b299',     // soft beige-gold (luxury neutral)
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
