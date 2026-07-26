import { useEffect } from 'react';
import ConsentBanner from './consent.jsx';
import { useMotion, useSpotlight } from './ui.jsx';
import { Aperture } from './ornament.jsx';
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
   The page runs one arc from dawn to dusk, with a single handover.

   Above it: the sunrise. Hero, the three figures, and the capability strip,
   on a saffron-to-periwinkle gradient with almost nothing on screen. This is
   the part that has to feel spacious, so it holds the least.

   Below it: the studio. The live agent, the work orbit, the demos and the
   close, on indigo-black, where a dark surface genuinely helps a waveform and
   a console read as instruments rather than as illustrations.

   The order of sections is unchanged, so NAV_IDS and every shipped #hash deep
   link still land where they did.
   ════════════════════════════════════════════════════════════════════════ */

/* The horizon. Periwinkle resolving into indigo-black across a tall band, with
   the aperture set on it, so the two halves meet as a horizon rather than as a
   seam between two stylesheets. */
function Horizon() {
  return (
    <div data-zone="seam" className="zone-seam relative flex items-center justify-center" aria-hidden="true">
      <Aperture className="w-32 h-7 text-periwinkle/50" />
    </div>
  );
}

export default function App() {
  useHashLanding();
  useSpotlight();
  /* Mounted once at the root so the tier is written to <html> before the
     sections that read it decide what to mount. */
  useMotion();

  return (
    <>
      <Nav />

      {/* data-regime styles the zone; data-zone is what useRegimeAtTop measures
          against, and only the real page zones carry it. */}
      <div className="zone-dawn" data-regime="dawn" data-zone="dawn">
        <Hero />
        <Metrics />
        <WhatIBuild />
      </div>

      <Horizon />

      <div className="zone-dusk grain" data-regime="dusk" data-zone="dusk">
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
