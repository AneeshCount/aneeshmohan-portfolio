import React from 'react';
import { createRoot } from 'react-dom/client';
// Self-hosted fonts (was Google Fonts CDN): no render-blocking third-party
// request, and the site works offline/behind firewalls.
import '@fontsource/bodoni-moda/500.css';
import '@fontsource/bodoni-moda/600.css';
import '@fontsource/bodoni-moda/700.css';
import '@fontsource/bodoni-moda/800.css';
import '@fontsource/bodoni-moda/500-italic.css';
import '@fontsource/bodoni-moda/600-italic.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import App from './App.jsx';
import { LangProvider } from './i18n.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </React.StrictMode>
);
