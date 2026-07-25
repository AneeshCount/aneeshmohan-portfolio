import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

/* ════════════════════════════════════════════════════════════════════════
   Lint rules. Deliberately opinionated about the two classes of mistake
   this codebase is actually exposed to:

   1. Stale or missing hook dependencies, because most of the interactive
      surface (voice replay, agent console, reveal-on-scroll) is timers and
      observers inside effects.
   2. Accidental shadowing, which already bit us once: `SKILLS.map((s) =>`
      inside a component that had `const { s } = useLang()`.

   Style is not enforced here. `npm run rules` covers the editorial rules
   that a formatter cannot see.
   ════════════════════════════════════════════════════════════════════════ */

export default [
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**'] },

  js.configs.recommended,

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      /* This project renders trusted, hand-written copy; prop-types would be
         noise on components that only ever take a string. */
      'react/prop-types': 'off',
      /* Apostrophes and quotes in four languages of body copy are intentional. */
      'react/no-unescaped-entities': 'off',

      'no-shadow': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  /* Node-side files: config, scripts and tooling. */
  {
    files: ['*.config.js', 'scripts/**/*.{js,mjs}'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-console': 'off' },
  },

  /* Tests get the Vitest globals and are allowed to shadow freely. */
  {
    files: ['tests/**/*.{js,jsx}'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: { 'no-shadow': 'off', 'no-console': 'off' },
  },
];
