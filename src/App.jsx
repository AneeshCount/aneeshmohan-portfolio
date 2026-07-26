import { useEffect } from 'react';
import ConsentBanner from './consent.jsx';
import { useMotion, useSpotlight } from './ui.jsx';
import { Footer, Nav } from './sections/nav.jsx';
import { AgentBanner, Hero, Metrics } from './sections/hero.jsx';
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

/* ════════════════════════════════════════════════════════════════════════
   One canvas, top to bottom: indigo-black throughout, so a glowing orbit and
   a waveform read as instruments rather than as illustrations, and the first
   screen is disciplined by the same rule as every section after it.

   The order of sections is unchanged, so NAV_IDS and every shipped #hash deep
   link still land where they did.
   ════════════════════════════════════════════════════════════════════════ */

export default function App() {
  useHashLanding();
  useSpotlight();
  /* Mounted once at the root so the tier is written to <html> before the
     sections that read it decide what to mount. */
  useMotion();

  return (
    <>
      <Nav />

      <div className="relative grain">
        <Hero />
        <Metrics />
        <WhatIBuild />
        <AgentBanner />
        <Work />
        <Playground />
        <Labs />
        <InsightsTeaser />
        <Process />
        <About />
        <Join />
        <Contact />
        <Footer />
      </div>

      <ConsentBanner />
    </>
  );
}
