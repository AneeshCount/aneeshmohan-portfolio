import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/bodoni-moda/500.css';
import '@fontsource/bodoni-moda/600.css';
import '@fontsource/bodoni-moda/700.css';
import '@fontsource/bodoni-moda/500-italic.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import { LangProvider } from '../i18n.jsx';
import ConsentBanner from '../consent.jsx';
import '../index.css';
import Insights from './Insights.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LangProvider>
      <Insights />
      <ConsentBanner />
    </LangProvider>
  </React.StrictMode>
);
