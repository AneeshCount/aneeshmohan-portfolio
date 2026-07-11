import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base: works on a github.io project subpath now, and at the aneeshmohan.com
// root once the custom domain is attached.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2018',
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        journal: resolve(__dirname, 'labs/journal/index.html'),
      },
    },
  },
});
