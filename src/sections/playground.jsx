import { useState } from 'react';
import { useLang } from '../i18n.jsx';
import { useReveal, useTabs } from '../ui.jsx';
import { AgentConsole } from '../agent.jsx';
import { VoiceAgent } from '../voice.jsx';

/* ?tab=agent deep-links straight to the ops agent; anything else opens on the
   voice call, which is the stronger first impression. */
function initialTab() {
  try {
    return new URLSearchParams(window.location.search).get('tab') === 'agent' ? 1 : 0;
  } catch {
    return 0;
  }
}

export function Playground() {
  const { s } = useLang();
  const ref = useReveal();
  const [tab, setTab] = useState(initialTab);
  const labels = [s.pg.tabVoice, s.pg.tabOps];
  /* Shares the a11y contract with the Services strip and the work orbit, so
     all three are one tab stop with arrow keys inside, rather than three
     different keyboard behaviours that happen to look alike. */
  const { tabProps, listProps, panelProps } = useTabs({ count: 2, active: tab, onSelect: setTab });

  return (
    <section id="play" ref={ref} className="border-t border-hair/8">
      <div className="shell section-y">
        <div className="reveal max-w-2xl">
          <div className="eyebrow">{s.pg.eyebrow}</div>
          <h2 className="display-2 mt-5">{s.pg.h2a}<br className="hidden sm:block" /> {s.pg.h2b}</h2>
          <p className="reveal lede text-muted mt-6 max-w-xl">
            {s.pg.p1}<span className="text-ivory">{s.pg.voice}</span>{s.pg.p2}<span className="text-ivory">{s.pg.ops}</span>{s.pg.p3}
          </p>
        </div>

        {/* The two tab labels are full sentences in four languages, so the
            switch scrolls sideways on a phone rather than wrapping each label
            onto two lines inside its own pill. */}
        <div className="reveal mt-10 -mx-5 px-5 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
          <div {...listProps} aria-label={s.pg.eyebrow} className="tabstrip">
            {labels.map((label, i) => (
              <button key={label} {...tabProps(i, 'play-panel')} className="tab tactile">
                {label}
              </button>
            ))}
          </div>
        </div>

        <div {...panelProps('play-panel')} className="reveal mt-7">
          {tab === 0 ? <VoiceAgent onOps={() => setTab(1)} /> : <AgentConsole />}
        </div>
      </div>
    </section>
  );
}
