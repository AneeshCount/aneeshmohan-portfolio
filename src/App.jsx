import { useEffect } from 'react';
import ConsentBanner from './consent.jsx';
import { useSpotlight } from './ui.jsx';
import { Footer, Nav } from './sections/nav.jsx';
import { Hero, Metrics } from './sections/hero.jsx';
import { WhatIBuild } from './sections/services.jsx';
import { Work } from './sections/work.jsx';
import { Playground } from './sections/playground.jsx';
import { Labs } from './sections/labs.jsx';
import { InsightsTeaser } from './sections/insights.jsx';
import { About, Join, Process } from './sections/studio.jsx';
import { Contact } from './sections/contact.jsx';

/* Deep links like /#work land before the sections have laid out, so the jump
   is deferred a frame or two and done without smooth scrolling. */
function useHashLanding() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' }), 150);
    return () => clearTimeout(t);
  }, []);
}

export default function App() {
  useHashLanding();
  useSpotlight();
  return (
    <>
      <Nav />
      <Hero />
      <Metrics />
      <WhatIBuild />
      <Work />
      <Playground />
      <Labs />
      <InsightsTeaser />
      <Process />
      <About />
      <Join />
      <Contact />
      <Footer />
      <ConsentBanner />
    </>
  );
}
