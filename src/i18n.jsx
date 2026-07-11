import React, { createContext, useContext, useState } from 'react';

/* ════════════════════════════════════════════════════════════════════════
   I18N: all page copy in EN (primary), DE, ES, FR. The interactive demo
   transcripts (missions.js / calls.js) stay in English by design; the
   demo chrome is translated and non-EN modes show a small note.
   ════════════════════════════════════════════════════════════════════════ */

export const LANGS = ['EN', 'DE', 'ES', 'FR'];

const STR = {
  EN: {
    nav: ['Work', 'Playground', 'Process', 'About', 'Contact'],
    cta: 'Start a project',
    hero: {
      eyebrow: 'AI & Software Studio · Voice · Agents · Full-Stack',
      h1a: 'Fast, intelligent', h1b: 'software, built to ', ship: 'ship.',
      p: 'A founder-led studio that takes products from a blank page to production: precise interfaces, solid APIs and data layers, and AI that does real work. Agents that run operations. Voice agents that hold real conversations.',
      view: 'View the work', avail: 'Accepting new clients',
    },
    metrics: ['Products shipped from scratch', 'Agentic AI in production', 'Async delivery across timezones'],
    wb: {
      eyebrow: 'What we build', h2: 'Premium builds. Production standards.',
      p: 'Voice agents, AI workforces and full platforms, designed and shipped by a senior team that scales with your scope. Everything below is production-grade: secure, integrated, and yours.',
    },
    services: [
      { t: 'Voice agents', d: 'AI receptionists and outbound callers that answer, qualify, book and follow up, around the clock, in any language.', eg: 'Live demo: take a call below' },
      { t: 'AI agents & automations', d: 'Agents that run real operations: triage, reporting, follow-ups, back-office flows that execute themselves.', eg: 'Live demo: run the ops agent below' },
      { t: 'WhatsApp & support AI', d: 'Assistants on WhatsApp and your site that sell, support and answer from your own documents, with clean human handoff.', eg: 'RAG over your prices, policies, FAQs' },
      { t: 'Web & mobile apps', d: 'Secure, fully integrated full-stack apps: auth, payments, admin panels, APIs, installable on any phone.', eg: 'Daksh Sathi: 33-service marketplace PWA' },
      { t: 'SaaS & MVPs', d: 'Blank page to paying users: multi-tenant products with billing, infra and CI, shipped in weeks.', eg: 'RiDERgy: production energy SaaS' },
      { t: 'Dashboards & analytics', d: 'Forecasting, AI insights and reporting that executives actually read and act on.', eg: 'RetailMind: AI retail intelligence' },
      { t: 'Integrations & internal tools', d: 'Your CRM, calendar, inbox and telephony stitched into one system that updates itself.', eg: 'n8n · Zapier · MCP · WhatsApp API' },
      { t: 'Websites that sell', d: 'Conversion-focused marketing sites with calculators, lead capture and clean SEO.', eg: 'CargoLink: logistics site + quote engine' },
    ],
    audit: {
      h: 'Not sure where AI fits your business?',
      p: 'Start with a fixed-fee AI audit: a two-week deep dive that maps the highest-ROI automations in your operation, with a costed roadmap. The fee is credited against your first build.',
      cta: 'Book an audit →',
    },
    work: { eyebrow: 'Selected Work', h2a: 'Products designed, built', h2b: 'and shipped from zero.' },
    projects: [
      { tag: 'Flagship · Agentic AI', blurb: 'An EV charging and energy-management SaaS built from the ground up. Agentic watchdogs continuously monitor chargers, batteries and solar, while an LLM chat layer lets users control the system in plain language: start a vehicle charging, shift load to solar, or push a schedule, and the agents execute.', note: 'Proprietary codebase · private walkthrough on request', label: 'ridergy.com' },
      { tag: 'Live Product · Mentorship Marketplace', blurb: 'A two-sided mentorship marketplace: students planning to study abroad book verified mentors already at universities around the world, with paid sessions, contact unlock after checkout, document feedback, mentor earnings dashboards and multi-author guides. Built and run as our own product, expanding beyond study abroad.', label: 'auroramentors.com' },
      { tag: 'AI Retail Intelligence', blurb: 'An AI dashboard for supermarkets and chains: demand forecasting with confidence bands, an AI reorder engine ranking SKUs by days-of-cover, price-optimization recommendations, and an agentic insights assistant that answers questions and proposes the next action.', label: 'Live demo' },
      { tag: 'Logistics Platform', blurb: 'A modern logistics company site with a real-time shipment cost calculator (volumetric weight, multi-mode pricing, fuel and GST), a live tracking widget, and a validated lead-capture flow. Built as a conversion-focused marketing site.', label: 'Live demo' },
      { tag: 'Hyperlocal Marketplace PWA', blurb: 'A 33-service hyperlocal marketplace as an installable PWA: a multi-screen booking flow, masonry partner portfolios with verified badges, and a wallet and escrow payment model with a 30:70 split released by customer PIN.', label: 'Live demo' },
    ],
    pg: {
      eyebrow: 'Live demos', h2a: 'Give an agent a job.', h2b: 'Then interrupt it.',
      p1: 'This is what we build: AI that does real work, not chat. Take a live call with a ', voice: 'voice agent',
      p2: ' that speaks, books, and recovers when you cut it off mid-sentence. Or run an ', ops: 'operations agent',
      p3: ' on a mission and throw it a curveball. The same loop we ship to production on frontier models, replayed right in your browser.',
      tabVoice: 'Voice agent · live call', tabOps: 'Ops agent · missions', demoNote: '',
    },
    va: {
      title: 'Voice Agent',
      p1: 'A live call: the agent ', b1: 'speaks out loud', p2: ', works its tools mid-conversation, and (the hard part) ', b2: 'recovers when you interrupt it', p3: '. Pick a call.',
      answer: 'Answer the call →',
      foot: "Deterministic replay of a production voice pipeline (STT → LLM + tools → TTS). It speaks with your browser's free built-in voice, which is why it sounds robotic. Nothing is recorded and no audio leaves this page.",
      stackLine: 'Client builds sound human. We build on the production voice stack:',
      live: 'Live', ended: 'Ended', soundOn: '🔊 Sound on', muted: '🔇 Muted',
      interrupt: 'Interrupt', soon: 'soon', handled: '✓ Handled live', skip: 'Skip to the result →',
      states: { agent: 'Agent speaking', caller: 'Caller · transcribing', think: 'Reasoning', tool: 'Working the tools', idle: 'Connecting…', done: 'Call ended' },
      complete: 'Call complete', summary: 'summary extracted live',
      voiceNote: "Demo voice: your browser's free built-in TTS. Production agents run ElevenLabs or Cartesia-grade voices and sound human.",
      replayTry: 'Replay and interrupt it', replay: 'Replay the call', opsBtn: '⚙ Run the ops agent',
    },
    ops: {
      title: 'Agent Console',
      p1: 'Six missions, one loop: ', loop: 'perceive → plan → act → adapt', p2: '. Pick a mission, watch the agent run it, then throw it a curveball.',
      run: 'Run mission →',
      foot: 'Deterministic replay of a real agent architecture. Runs entirely in your browser, no API calls.',
      stackLine: 'In production this loop runs on frontier models with real tools:',
      plan: 'Plan', liveRun: 'Live run', curveball: 'Curveball', incoming: '⚡ Incoming…', adapted: '✓ Agent adapted',
      complete: 'Mission complete', curveHandled: '1 curveball handled', replayTry: 'Replay and try the curveball', replay: 'Replay', addedLive: 'added live',
    },
    labs: {
      eyebrow: 'Labs', h2a: 'Ideas we test', h2b: 'in the open.',
      p: 'Small, working experiments from our own idea pipeline. Each one becomes a client capability once it earns its keep.',
      live: 'Live lab', soon: 'In the lab', open: 'Open the lab →',
      note: 'A2A Commerce and Seller AI already run as live missions in the Playground above.',
      items: [
        { t: 'Voice Journal', d: 'Speak for a minute and get a structured journal entry: title, mood, action items. Real microphone input, entirely in your browser.' },
        { t: 'AI Budgeter', d: 'A personal CFO that watches your spending, flags the overshoot and answers why in plain language.' },
        { t: 'GiftingAI', d: 'Give it a person, an occasion and a budget; it argues its way to the right gift.' },
      ],
    },
    pr: {
      eyebrow: 'How we work', h2a: 'Big-firm discipline.', h2b: 'Studio speed.',
      p: 'Premium does not mean slow, and fast does not mean fragile. It means one accountable owner, clear milestones, and work you can inspect every week.',
      platforms: 'Built on platforms your business already trusts',
    },
    trust: [
      { t: 'Senior-led, always', d: 'Every project is led end to end by the founder. Vetted specialist designers and engineers join as your scope grows, so capacity is never the bottleneck.' },
      { t: 'Your IP, fully yours', d: 'Clean contracts, NDA before you share anything sensitive, and full source code and IP transfer on completion.' },
      { t: 'Security by default', d: 'Least-privilege access, encrypted secrets, audit trails and GDPR-aware data handling on every build.' },
      { t: 'Global, async-first', d: 'Clients across US, EU, Middle East and Asia get overlap hours, weekly demo videos and one accountable point of contact.' },
      { t: 'Milestone billing', d: 'Pay per shipped milestone, never for promises. Direct bank transfer works great, or platform escrow if you prefer: Upwork, Malt, Contra, your choice.' },
      { t: 'Supported after launch', d: 'Documentation, handover training and 30 days of included support with every build. Long-term care via retainers.' },
    ],
    ab: {
      eyebrow: 'About', h2a: 'A studio with', h2b: 'founder attention.',
      p1: 'The studio is led by founder Aneesh Mohan and backed by a network of vetted specialist designers and engineers who join as your scope grows. You always know who is accountable: one senior owner, hands on your build, with the capacity to scale behind it.',
      p2: 'The flagship is RiDERgy, our own product: agentic AI running EV charging and energy management in production, where reliability is non-negotiable. Every client project is held to that standard, from the architecture and the interface to the API, the data and the intelligence layer that makes it useful.',
    },
    ct: {
      eyebrow: 'Contact', h2a: 'Have something', h2b: 'worth building?',
      p: 'A voice agent, an AI workforce, a full platform, or a paid consultation to map your options. Tell us what you need and get a senior reply within a day.',
      name: 'Your name', email: 'Your email', msg: 'What are we building?',
      phName: 'Jane Founder', phEmail: 'jane@company.com', phMsg: 'A voice agent for our clinic front desk. Two locations, about 90 calls a day…',
      consult: 'Paid consultations available: strategy, architecture and AI roadmaps.',
      send: 'Send message', sending: 'Sending…',
      sentH: 'Message received.', sentP: "Expect a senior reply within a day. If it's urgent, mention that in a LinkedIn message too.",
      err: 'The form could not send just now. Please reach out via LinkedIn below instead.',
      nda: 'NDA-friendly · Milestone billing · Direct or platform escrow, your choice',
    },
    footer: 'Built from scratch · React & Tailwind',
  },

  DE: {
    nav: ['Arbeiten', 'Playground', 'Prozess', 'Über uns', 'Kontakt'],
    cta: 'Projekt starten',
    hero: {
      eyebrow: 'KI- & Software-Studio · Voice · Agenten · Full-Stack',
      h1a: 'Schnelle, intelligente', h1b: 'Software, gebaut zum ', ship: 'Liefern.',
      p: 'Ein gründergeführtes Studio, das Produkte vom leeren Blatt bis in die Produktion bringt: präzise Interfaces, solide APIs und Datenebenen, und KI, die echte Arbeit leistet. Agenten, die Abläufe steuern. Voice-Agenten, die echte Gespräche führen.',
      view: 'Arbeiten ansehen', avail: 'Wir nehmen neue Kunden an',
    },
    metrics: ['Produkte von null gebaut', 'Agentische KI in Produktion', 'Asynchrone Lieferung über Zeitzonen'],
    wb: {
      eyebrow: 'Was wir bauen', h2: 'Premium-Builds. Produktionsstandards.',
      p: 'Voice-Agenten, KI-Workforces und komplette Plattformen, entworfen und geliefert von einem Senior-Team, das mit Ihrem Umfang wächst. Alles unten ist Produktionsqualität: sicher, integriert und Ihres.',
    },
    services: [
      { t: 'Voice-Agenten', d: 'KI-Rezeption und Outbound-Anrufe: annehmen, qualifizieren, buchen und nachfassen, rund um die Uhr, in jeder Sprache.', eg: 'Live-Demo: unten einen Anruf annehmen' },
      { t: 'KI-Agenten & Automationen', d: 'Agenten für echte Abläufe: Triage, Reporting, Follow-ups und Backoffice-Prozesse, die sich selbst ausführen.', eg: 'Live-Demo: unten den Ops-Agenten starten' },
      { t: 'WhatsApp- & Support-KI', d: 'Assistenten auf WhatsApp und Ihrer Website, die aus Ihren eigenen Dokumenten verkaufen, supporten und antworten, mit sauberer Übergabe an Menschen.', eg: 'RAG über Ihre Preise, Richtlinien, FAQs' },
      { t: 'Web- & Mobile-Apps', d: 'Sichere, voll integrierte Full-Stack-Apps: Auth, Zahlungen, Admin-Panels, APIs, installierbar auf jedem Telefon.', eg: 'Daksh Sathi: Marktplatz-PWA mit 33 Services' },
      { t: 'SaaS & MVPs', d: 'Vom leeren Blatt zu zahlenden Nutzern: mandantenfähige Produkte mit Billing, Infrastruktur und CI, geliefert in Wochen.', eg: 'RiDERgy: Energie-SaaS in Produktion' },
      { t: 'Dashboards & Analytics', d: 'Forecasting, KI-Insights und Reporting, das Führungskräfte wirklich lesen und nutzen.', eg: 'RetailMind: KI-Retail-Intelligence' },
      { t: 'Integrationen & interne Tools', d: 'CRM, Kalender, Posteingang und Telefonie zu einem System verbunden, das sich selbst aktuell hält.', eg: 'n8n · Zapier · MCP · WhatsApp API' },
      { t: 'Websites, die verkaufen', d: 'Conversion-starke Marketing-Websites mit Rechnern, Lead-Erfassung und sauberem SEO.', eg: 'CargoLink: Logistik-Site + Angebotsrechner' },
    ],
    audit: {
      h: 'Unsicher, wo KI in Ihr Geschäft passt?',
      p: 'Starten Sie mit einem KI-Audit zum Festpreis: zwei Wochen Tiefenanalyse, die die Automationen mit dem höchsten ROI in Ihrem Betrieb kartiert, mit kalkulierter Roadmap. Die Gebühr wird auf Ihren ersten Build angerechnet.',
      cta: 'Audit buchen →',
    },
    work: { eyebrow: 'Ausgewählte Arbeiten', h2a: 'Produkte entworfen, gebaut', h2b: 'und von null geliefert.' },
    projects: [
      { tag: 'Flaggschiff · Agentische KI', blurb: 'Ein SaaS für EV-Laden und Energiemanagement, von Grund auf gebaut. Agentische Watchdogs überwachen Ladepunkte, Batterien und Solar, während eine LLM-Chat-Ebene das System in Alltagssprache steuert: Fahrzeug laden, Last auf Solar verschieben, Zeitplan setzen, die Agenten führen aus.', note: 'Proprietäre Codebasis · privater Walkthrough auf Anfrage', label: 'ridergy.com' },
      { tag: 'Live-Produkt · Mentoring-Marktplatz', blurb: 'Ein zweiseitiger Mentoring-Marktplatz: Studierende mit Auslandsplänen buchen verifizierte Mentoren, die bereits an Universitäten weltweit studieren, mit bezahlten Sessions, Kontaktfreigabe nach dem Checkout, Dokumenten-Feedback, Earnings-Dashboards und Guides mehrerer Autoren. Als eigenes Produkt gebaut und betrieben, mit Ausbau über das Auslandsstudium hinaus.', label: 'auroramentors.com' },
      { tag: 'KI-Retail-Intelligence', blurb: 'Ein KI-Dashboard für Supermärkte und Ketten: Nachfrageprognosen mit Konfidenzband, eine KI-Nachbestell-Engine, die SKUs nach Reichweite priorisiert, Preisoptimierung und ein agentischer Insights-Assistent, der Fragen beantwortet und die nächste Aktion vorschlägt.', label: 'Live-Demo' },
      { tag: 'Logistik-Plattform', blurb: 'Eine moderne Logistik-Website mit Echtzeit-Frachtkostenrechner (Volumengewicht, Multi-Mode-Preise, Kraftstoff und Steuern), Live-Tracking-Widget und validierter Lead-Erfassung. Gebaut als conversion-fokussierte Marketing-Site.', label: 'Live-Demo' },
      { tag: 'Hyperlokale Marktplatz-PWA', blurb: 'Ein hyperlokaler Marktplatz mit 33 Services als installierbare PWA: mehrstufiger Buchungsflow, Partner-Portfolios mit Verifizierungs-Badges und ein Wallet-/Escrow-Zahlungsmodell mit 30:70-Split per Kunden-PIN.', label: 'Live-Demo' },
    ],
    pg: {
      eyebrow: 'Live-Demos', h2a: 'Geben Sie einem Agenten einen Job.', h2b: 'Dann unterbrechen Sie ihn.',
      p1: 'Das ist, was wir bauen: KI, die echte Arbeit leistet, nicht Chat. Führen Sie ein Live-Telefonat mit einem ', voice: 'Voice-Agenten',
      p2: ', der spricht, bucht und sich fängt, wenn Sie ihn mitten im Satz unterbrechen. Oder schicken Sie einen ', ops: 'Operations-Agenten',
      p3: ' auf Mission und werfen Sie ihm einen Störfall dazwischen. Dieselbe Schleife liefern wir mit Frontier-Modellen in Produktion, hier im Browser wiedergegeben.',
      tabVoice: 'Voice-Agent · Live-Anruf', tabOps: 'Ops-Agent · Missionen', demoNote: 'Die Demo-Gespräche laufen auf Englisch.',
    },
    va: {
      title: 'Voice-Agent',
      p1: 'Ein Live-Anruf: der Agent ', b1: 'spricht hörbar', p2: ', nutzt mitten im Gespräch seine Tools und (der schwere Teil) ', b2: 'fängt sich, wenn Sie ihn unterbrechen', p3: '. Wählen Sie einen Anruf.',
      answer: 'Anruf annehmen →',
      foot: 'Deterministische Wiedergabe einer produktiven Voice-Pipeline (STT → LLM + Tools → TTS). Gesprochen wird mit der kostenlosen Browser-Stimme, daher klingt sie robotisch. Nichts wird aufgezeichnet, kein Audio verlässt diese Seite.',
      stackLine: 'Kundenprojekte klingen menschlich. Wir bauen auf dem Produktions-Voice-Stack:',
      live: 'Live', ended: 'Beendet', soundOn: '🔊 Ton an', muted: '🔇 Stumm',
      interrupt: 'Unterbrechen', soon: 'gleich', handled: '✓ Live gemeistert', skip: 'Zum Ergebnis springen →',
      states: { agent: 'Agent spricht', caller: 'Anrufer · Transkription', think: 'Denkt nach', tool: 'Arbeitet mit Tools', idle: 'Verbinde…', done: 'Anruf beendet' },
      complete: 'Anruf abgeschlossen', summary: 'Zusammenfassung live extrahiert',
      voiceNote: 'Demo-Stimme: die kostenlose Browser-TTS. Produktive Agenten nutzen Stimmen auf ElevenLabs- oder Cartesia-Niveau und klingen menschlich.',
      replayTry: 'Nochmal, diesmal unterbrechen', replay: 'Anruf wiederholen', opsBtn: '⚙ Ops-Agenten starten',
    },
    ops: {
      title: 'Agenten-Konsole',
      p1: 'Sechs Missionen, eine Schleife: ', loop: 'wahrnehmen → planen → handeln → anpassen', p2: '. Wählen Sie eine Mission, sehen Sie dem Agenten zu, dann werfen Sie ihm einen Störfall dazwischen.',
      run: 'Mission starten →',
      foot: 'Deterministische Wiedergabe einer echten Agenten-Architektur. Läuft komplett im Browser, keine API-Calls.',
      stackLine: 'In Produktion läuft diese Schleife auf Frontier-Modellen mit echten Tools:',
      plan: 'Plan', liveRun: 'Live-Lauf', curveball: 'Störfall', incoming: '⚡ Kommt…', adapted: '✓ Agent angepasst',
      complete: 'Mission abgeschlossen', curveHandled: '1 Störfall gemeistert', replayTry: 'Nochmal, mit Störfall', replay: 'Wiederholen', addedLive: 'live ergänzt',
    },
    labs: {
      eyebrow: 'Labs', h2a: 'Ideen, die wir', h2b: 'offen testen.',
      p: 'Kleine, funktionierende Experimente aus unserer eigenen Ideen-Pipeline. Jedes wird zur Kunden-Leistung, sobald es sich beweist.',
      live: 'Live-Lab', soon: 'Im Labor', open: 'Lab öffnen →',
      note: 'A2A Commerce und Seller AI laufen bereits als Live-Missionen im Playground oben.',
      items: [
        { t: 'Voice Journal', d: 'Eine Minute sprechen, ein strukturierter Journal-Eintrag: Titel, Stimmung, Action Items. Echte Mikrofon-Eingabe, komplett im Browser.' },
        { t: 'AI Budgeter', d: 'Ein persönlicher CFO, der Ihre Ausgaben beobachtet, Überschreitungen meldet und das Warum in klarer Sprache erklärt.' },
        { t: 'GiftingAI', d: 'Person, Anlass und Budget angeben; die KI argumentiert sich zum richtigen Geschenk.' },
      ],
    },
    pr: {
      eyebrow: 'Wie wir arbeiten', h2a: 'Konzern-Disziplin.', h2b: 'Studio-Tempo.',
      p: 'Premium heißt nicht langsam, und schnell heißt nicht fragil. Es heißt: ein verantwortlicher Owner, klare Meilensteine und Arbeit, die Sie jede Woche prüfen können.',
      platforms: 'Gebaut auf Plattformen, denen Ihr Unternehmen bereits vertraut',
    },
    trust: [
      { t: 'Senior-geführt, immer', d: 'Jedes Projekt führt der Gründer Ende-zu-Ende. Geprüfte Spezialisten für Design und Engineering stoßen dazu, wenn der Umfang wächst. Kapazität ist nie der Engpass.' },
      { t: 'Ihre IP, vollständig', d: 'Saubere Verträge, NDA bevor Sie Sensibles teilen, und vollständige Übertragung von Quellcode und IP bei Abschluss.' },
      { t: 'Sicherheit als Standard', d: 'Least-Privilege-Zugriffe, verschlüsselte Secrets, Audit-Trails und DSGVO-bewusster Umgang mit Daten in jedem Build.' },
      { t: 'Global, async-first', d: 'Kunden in den USA, der EU, dem Nahen Osten und Asien erhalten Überlappungszeiten, wöchentliche Demo-Videos und einen verantwortlichen Ansprechpartner.' },
      { t: 'Abrechnung nach Meilensteinen', d: 'Bezahlt wird pro geliefertem Meilenstein, nie für Versprechen. Direkte Überweisung funktioniert bestens, oder Plattform-Escrow, wenn Sie das bevorzugen: Upwork, Malt, Contra, Ihre Wahl.' },
      { t: 'Support nach dem Launch', d: 'Dokumentation, Übergabe-Training und 30 Tage Support inklusive bei jedem Build. Langfristige Betreuung per Retainer.' },
    ],
    ab: {
      eyebrow: 'Über uns', h2a: 'Ein Studio mit', h2b: 'Gründer-Aufmerksamkeit.',
      p1: 'Das Studio wird vom Gründer Aneesh Mohan geführt, gestützt auf ein Netzwerk geprüfter Spezialisten für Design und Engineering, die dazustoßen, wenn Ihr Umfang wächst. Sie wissen immer, wer verantwortlich ist: ein Senior-Owner, selbst am Build, mit skalierbarer Kapazität dahinter.',
      p2: 'Das Flaggschiff ist RiDERgy, unser eigenes Produkt: agentische KI, die EV-Laden und Energiemanagement in Produktion betreibt, wo Zuverlässigkeit nicht verhandelbar ist. Jedes Kundenprojekt wird an diesem Standard gemessen, von Architektur und Interface bis zu API, Daten und der Intelligenz-Ebene, die alles nützlich macht.',
    },
    ct: {
      eyebrow: 'Kontakt', h2a: 'Etwas, das es wert ist,', h2b: 'gebaut zu werden?',
      p: 'Ein Voice-Agent, eine KI-Workforce, eine komplette Plattform oder eine bezahlte Beratung, um Ihre Optionen zu kartieren. Sagen Sie uns, was Sie brauchen, und erhalten Sie innerhalb eines Tages eine Senior-Antwort.',
      name: 'Ihr Name', email: 'Ihre E-Mail', msg: 'Was bauen wir?',
      phName: 'Max Gründer', phEmail: 'max@firma.de', phMsg: 'Ein Voice-Agent für unsere Praxis-Rezeption. Zwei Standorte, etwa 90 Anrufe am Tag…',
      consult: 'Bezahlte Beratung verfügbar: Strategie, Architektur und KI-Roadmaps.',
      send: 'Nachricht senden', sending: 'Wird gesendet…',
      sentH: 'Nachricht erhalten.', sentP: 'Erwarten Sie innerhalb eines Tages eine Senior-Antwort. Bei Dringendem gern zusätzlich per LinkedIn melden.',
      err: 'Das Formular konnte gerade nicht senden. Bitte melden Sie sich stattdessen unten über LinkedIn.',
      nda: 'NDA-freundlich · Meilenstein-Abrechnung · Direkt oder Plattform-Escrow, Ihre Wahl',
    },
    footer: 'Von Grund auf gebaut · React & Tailwind',
  },

  ES: {
    nav: ['Trabajo', 'Playground', 'Proceso', 'Nosotros', 'Contacto'],
    cta: 'Iniciar un proyecto',
    hero: {
      eyebrow: 'Estudio de IA y Software · Voz · Agentes · Full-Stack',
      h1a: 'Software rápido e', h1b: 'inteligente, hecho para ', ship: 'entregar.',
      p: 'Un estudio dirigido por su fundador que lleva productos del papel en blanco a producción: interfaces precisas, APIs y capas de datos sólidas, e IA que hace trabajo real. Agentes que operan procesos. Agentes de voz que sostienen conversaciones reales.',
      view: 'Ver el trabajo', avail: 'Aceptamos nuevos clientes',
    },
    metrics: ['Productos creados desde cero', 'IA agéntica en producción', 'Entrega asíncrona entre husos horarios'],
    wb: {
      eyebrow: 'Qué construimos', h2: 'Construcción premium. Estándares de producción.',
      p: 'Agentes de voz, plantillas de IA y plataformas completas, diseñadas y entregadas por un equipo senior que escala con tu alcance. Todo lo de abajo es calidad de producción: seguro, integrado y tuyo.',
    },
    services: [
      { t: 'Agentes de voz', d: 'Recepcionistas de IA y llamadas salientes que atienden, califican, agendan y hacen seguimiento, a toda hora y en cualquier idioma.', eg: 'Demo en vivo: atiende una llamada abajo' },
      { t: 'Agentes de IA y automatizaciones', d: 'Agentes para operaciones reales: triaje, reportes, seguimientos y flujos de back-office que se ejecutan solos.', eg: 'Demo en vivo: corre el agente de operaciones' },
      { t: 'WhatsApp y soporte con IA', d: 'Asistentes en WhatsApp y tu web que venden, dan soporte y responden desde tus propios documentos, con traspaso limpio a humanos.', eg: 'RAG sobre tus precios, políticas y FAQs' },
      { t: 'Apps web y móviles', d: 'Apps full-stack seguras y totalmente integradas: auth, pagos, paneles de administración, APIs, instalables en cualquier teléfono.', eg: 'Daksh Sathi: PWA marketplace de 33 servicios' },
      { t: 'SaaS y MVPs', d: 'Del papel en blanco a usuarios que pagan: productos multi-tenant con facturación, infraestructura y CI, entregados en semanas.', eg: 'RiDERgy: SaaS de energía en producción' },
      { t: 'Dashboards y analítica', d: 'Pronósticos, insights de IA y reportes que los ejecutivos de verdad leen y usan.', eg: 'RetailMind: inteligencia retail con IA' },
      { t: 'Integraciones y herramientas internas', d: 'Tu CRM, calendario, correo y telefonía unidos en un sistema que se actualiza solo.', eg: 'n8n · Zapier · MCP · WhatsApp API' },
      { t: 'Webs que venden', d: 'Sitios de marketing enfocados en conversión, con calculadoras, captura de leads y SEO limpio.', eg: 'CargoLink: web logística + cotizador' },
    ],
    audit: {
      h: '¿No sabes dónde encaja la IA en tu negocio?',
      p: 'Empieza con una auditoría de IA a precio fijo: dos semanas de análisis que mapean las automatizaciones de mayor ROI en tu operación, con una hoja de ruta costeada. El importe se descuenta de tu primer proyecto.',
      cta: 'Reservar auditoría →',
    },
    work: { eyebrow: 'Trabajo seleccionado', h2a: 'Productos diseñados, construidos', h2b: 'y entregados desde cero.' },
    projects: [
      { tag: 'Buque insignia · IA agéntica', blurb: 'Un SaaS de carga de vehículos eléctricos y gestión energética construido desde cero. Watchdogs agénticos vigilan cargadores, baterías y solar, mientras una capa de chat LLM permite controlar el sistema en lenguaje natural: cargar un vehículo, mover carga a solar o fijar un horario, y los agentes ejecutan.', note: 'Código propietario · demo privada bajo petición', label: 'ridergy.com' },
      { tag: 'Producto en vivo · Marketplace de mentores', blurb: 'Un marketplace de mentores de dos lados: estudiantes que planean estudiar en el extranjero reservan mentores verificados que ya están en universidades de todo el mundo, con sesiones de pago, desbloqueo de contacto tras el checkout, revisión de documentos, panel de ingresos y guías multiautor. Construido y operado como producto propio, en expansión más allá del estudio en el extranjero.', label: 'auroramentors.com' },
      { tag: 'Inteligencia retail con IA', blurb: 'Un dashboard de IA para supermercados y cadenas: pronóstico de demanda con bandas de confianza, un motor de reposición que prioriza SKUs por días de cobertura, optimización de precios y un asistente agéntico que responde preguntas y propone la siguiente acción.', label: 'Demo en vivo' },
      { tag: 'Plataforma logística', blurb: 'Una web logística moderna con calculadora de costes de envío en tiempo real (peso volumétrico, precios multimodales, combustible e impuestos), widget de tracking en vivo y captura de leads validada. Construida como site de marketing enfocado en conversión.', label: 'Demo en vivo' },
      { tag: 'PWA marketplace hiperlocal', blurb: 'Un marketplace hiperlocal de 33 servicios como PWA instalable: flujo de reserva multipantalla, portafolios de socios con insignias verificadas y un modelo de pago con wallet y escrow con reparto 30:70 liberado por PIN del cliente.', label: 'Demo en vivo' },
    ],
    pg: {
      eyebrow: 'Demos en vivo', h2a: 'Dale un trabajo a un agente.', h2b: 'Luego interrúmpelo.',
      p1: 'Esto es lo que construimos: IA que hace trabajo real, no chat. Atiende una llamada en vivo con un ', voice: 'agente de voz',
      p2: ' que habla, agenda y se recupera cuando lo cortas a mitad de frase. O lanza un ', ops: 'agente de operaciones',
      p3: ' a una misión y tírale una bola curva. El mismo bucle que llevamos a producción con modelos frontier, reproducido en tu navegador.',
      tabVoice: 'Agente de voz · llamada en vivo', tabOps: 'Agente de ops · misiones', demoNote: 'Las conversaciones de la demo son en inglés.',
    },
    va: {
      title: 'Agente de voz',
      p1: 'Una llamada en vivo: el agente ', b1: 'habla en voz alta', p2: ', usa sus herramientas en plena conversación y (la parte difícil) ', b2: 'se recupera cuando lo interrumpes', p3: '. Elige una llamada.',
      answer: 'Atender la llamada →',
      foot: 'Reproducción determinista de una pipeline de voz de producción (STT → LLM + herramientas → TTS). Habla con la voz gratuita del navegador, por eso suena robótica. No se graba nada y ningún audio sale de esta página.',
      stackLine: 'Los proyectos de clientes suenan humanos. Construimos sobre el stack de voz de producción:',
      live: 'En vivo', ended: 'Finalizada', soundOn: '🔊 Sonido', muted: '🔇 Silencio',
      interrupt: 'Interrumpir', soon: 'pronto', handled: '✓ Resuelto en vivo', skip: 'Saltar al resultado →',
      states: { agent: 'Agente hablando', caller: 'Cliente · transcribiendo', think: 'Razonando', tool: 'Usando herramientas', idle: 'Conectando…', done: 'Llamada finalizada' },
      complete: 'Llamada completada', summary: 'resumen extraído en vivo',
      voiceNote: 'Voz de la demo: el TTS gratuito de tu navegador. Los agentes de producción usan voces nivel ElevenLabs o Cartesia y suenan humanos.',
      replayTry: 'Repetir e interrumpirlo', replay: 'Repetir la llamada', opsBtn: '⚙ Correr el agente de ops',
    },
    ops: {
      title: 'Consola de agentes',
      p1: 'Seis misiones, un bucle: ', loop: 'percibir → planear → actuar → adaptar', p2: '. Elige una misión, mira al agente ejecutarla y luego tírale una bola curva.',
      run: 'Ejecutar misión →',
      foot: 'Reproducción determinista de una arquitectura de agentes real. Corre por completo en tu navegador, sin llamadas a APIs.',
      stackLine: 'En producción este bucle corre sobre modelos frontier con herramientas reales:',
      plan: 'Plan', liveRun: 'Ejecución en vivo', curveball: 'Bola curva', incoming: '⚡ Llegando…', adapted: '✓ Agente adaptado',
      complete: 'Misión completada', curveHandled: '1 bola curva resuelta', replayTry: 'Repetir y probar la bola curva', replay: 'Repetir', addedLive: 'añadido en vivo',
    },
    labs: {
      eyebrow: 'Labs', h2a: 'Ideas que probamos', h2b: 'a la vista.',
      p: 'Experimentos pequeños y funcionales de nuestra propia cantera de ideas. Cada uno se convierte en capacidad para clientes cuando se lo gana.',
      live: 'Lab en vivo', soon: 'En el laboratorio', open: 'Abrir el lab →',
      note: 'A2A Commerce y Seller AI ya corren como misiones en vivo en el Playground de arriba.',
      items: [
        { t: 'Voice Journal', d: 'Habla un minuto y recibe una entrada de diario estructurada: título, ánimo, acciones. Micrófono real, todo en tu navegador.' },
        { t: 'AI Budgeter', d: 'Un CFO personal que vigila tus gastos, avisa del exceso y explica el porqué en lenguaje claro.' },
        { t: 'GiftingAI', d: 'Dale una persona, una ocasión y un presupuesto; argumenta hasta dar con el regalo correcto.' },
      ],
    },
    pr: {
      eyebrow: 'Cómo trabajamos', h2a: 'Disciplina de gran firma.', h2b: 'Velocidad de estudio.',
      p: 'Premium no significa lento, y rápido no significa frágil. Significa un responsable claro, hitos definidos y trabajo que puedes inspeccionar cada semana.',
      platforms: 'Construido sobre plataformas en las que tu negocio ya confía',
    },
    trust: [
      { t: 'Liderazgo senior, siempre', d: 'Cada proyecto lo dirige el fundador de principio a fin. Diseñadores e ingenieros especialistas verificados se suman cuando el alcance crece; la capacidad nunca es el cuello de botella.' },
      { t: 'Tu IP, completamente tuya', d: 'Contratos limpios, NDA antes de compartir nada sensible, y transferencia total de código fuente e IP al finalizar.' },
      { t: 'Seguridad por defecto', d: 'Accesos de privilegio mínimo, secretos cifrados, trazas de auditoría y manejo de datos consciente del RGPD en cada proyecto.' },
      { t: 'Global y asíncrono', d: 'Clientes en EE. UU., Europa, Oriente Medio y Asia reciben horas de solape, videos demo semanales y un único punto de contacto responsable.' },
      { t: 'Facturación por hitos', d: 'Pagas por hito entregado, nunca por promesas. La transferencia directa funciona perfectamente, o escrow de plataforma si lo prefieres: Upwork, Malt, Contra, tú eliges.' },
      { t: 'Soporte tras el lanzamiento', d: 'Documentación, formación de traspaso y 30 días de soporte incluidos en cada proyecto. Cuidado a largo plazo vía retainers.' },
    ],
    ab: {
      eyebrow: 'Nosotros', h2a: 'Un estudio con', h2b: 'atención del fundador.',
      p1: 'El estudio lo dirige su fundador, Aneesh Mohan, respaldado por una red de especialistas verificados en diseño e ingeniería que se suman cuando tu alcance crece. Siempre sabes quién responde: un owner senior, con las manos en tu proyecto y capacidad para escalar detrás.',
      p2: 'El buque insignia es RiDERgy, nuestro propio producto: IA agéntica operando carga de vehículos eléctricos y gestión energética en producción, donde la fiabilidad no es negociable. Cada proyecto de cliente se mide con ese estándar, de la arquitectura y la interfaz a la API, los datos y la capa de inteligencia que lo hace útil.',
    },
    ct: {
      eyebrow: 'Contacto', h2a: '¿Tienes algo que', h2b: 'valga la pena construir?',
      p: 'Un agente de voz, una plantilla de IA, una plataforma completa o una consultoría de pago para mapear tus opciones. Cuéntanos qué necesitas y recibe una respuesta senior en un día.',
      name: 'Tu nombre', email: 'Tu correo', msg: '¿Qué construimos?',
      phName: 'Ana Fundadora', phEmail: 'ana@empresa.com', phMsg: 'Un agente de voz para la recepción de nuestra clínica. Dos sedes, unas 90 llamadas al día…',
      consult: 'Consultorías de pago disponibles: estrategia, arquitectura y hojas de ruta de IA.',
      send: 'Enviar mensaje', sending: 'Enviando…',
      sentH: 'Mensaje recibido.', sentP: 'Espera una respuesta senior en un día. Si es urgente, menciónalo también por LinkedIn.',
      err: 'El formulario no pudo enviarse ahora. Escríbenos por LinkedIn, aquí abajo.',
      nda: 'NDA disponible · Facturación por hitos · Directo o escrow de plataforma, tú eliges',
    },
    footer: 'Construido desde cero · React & Tailwind',
  },

  FR: {
    nav: ['Réalisations', 'Playground', 'Méthode', 'À propos', 'Contact'],
    cta: 'Lancer un projet',
    hero: {
      eyebrow: 'Studio IA & Logiciel · Voix · Agents · Full-Stack',
      h1a: 'Des logiciels rapides,', h1b: 'intelligents, faits pour ', ship: 'livrer.',
      p: 'Un studio dirigé par son fondateur, qui mène les produits de la page blanche à la production : interfaces précises, APIs et couches de données solides, et une IA qui fait un vrai travail. Des agents qui pilotent les opérations. Des agents vocaux qui tiennent de vraies conversations.',
      view: 'Voir les réalisations', avail: 'Nouveaux clients bienvenus',
    },
    metrics: ['Produits créés de zéro', 'IA agentique en production', 'Livraison asynchrone, tous fuseaux'],
    wb: {
      eyebrow: 'Ce que nous construisons', h2: 'Réalisation premium. Standards de production.',
      p: "Agents vocaux, effectifs IA et plateformes complètes, conçus et livrés par une équipe senior qui grandit avec votre périmètre. Tout ce qui suit est de qualité production : sécurisé, intégré, et à vous.",
    },
    services: [
      { t: 'Agents vocaux', d: "Réceptionnistes IA et appels sortants : répondre, qualifier, réserver et relancer, jour et nuit, dans toutes les langues.", eg: 'Démo live : décrochez un appel ci-dessous' },
      { t: 'Agents IA & automatisations', d: 'Des agents pour de vraies opérations : tri, reporting, relances et back-office qui s\'exécutent seuls.', eg: "Démo live : lancez l'agent d'opérations" },
      { t: 'WhatsApp & support IA', d: 'Des assistants sur WhatsApp et votre site qui vendent, assistent et répondent depuis vos propres documents, avec passage propre à un humain.', eg: 'RAG sur vos prix, politiques et FAQ' },
      { t: 'Apps web & mobiles', d: "Des apps full-stack sécurisées et intégrées : auth, paiements, back-offices, APIs, installables sur tout téléphone.", eg: 'Daksh Sathi : PWA marketplace, 33 services' },
      { t: 'SaaS & MVP', d: 'De la page blanche aux utilisateurs payants : produits multi-tenant avec facturation, infra et CI, livrés en quelques semaines.', eg: 'RiDERgy : SaaS énergie en production' },
      { t: 'Dashboards & analytique', d: 'Prévisions, insights IA et reporting que les dirigeants lisent et utilisent vraiment.', eg: 'RetailMind : intelligence retail IA' },
      { t: 'Intégrations & outils internes', d: 'Votre CRM, agenda, boîte mail et téléphonie reliés en un système qui se met à jour tout seul.', eg: 'n8n · Zapier · MCP · WhatsApp API' },
      { t: 'Sites qui vendent', d: 'Des sites marketing orientés conversion : calculateurs, capture de leads et SEO propre.', eg: 'CargoLink : site logistique + devis' },
    ],
    audit: {
      h: "Vous ne savez pas où l'IA s'insère chez vous ?",
      p: "Commencez par un audit IA à prix fixe : deux semaines d'analyse qui cartographient les automatisations au meilleur ROI dans votre activité, avec une feuille de route chiffrée. Le montant est déduit de votre premier projet.",
      cta: 'Réserver un audit →',
    },
    work: { eyebrow: 'Réalisations choisies', h2a: 'Des produits conçus, construits', h2b: 'et livrés de zéro.' },
    projects: [
      { tag: 'Vaisseau amiral · IA agentique', blurb: "Un SaaS de recharge VE et de gestion d'énergie construit de zéro. Des watchdogs agentiques surveillent bornes, batteries et solaire, tandis qu'une couche de chat LLM pilote le système en langage courant : lancer une charge, basculer sur le solaire, fixer un planning, et les agents exécutent.", note: 'Code propriétaire · démonstration privée sur demande', label: 'ridergy.com' },
      { tag: "Produit live · Marketplace de mentorat", blurb: "Une marketplace de mentorat à deux faces : les étudiants qui préparent des études à l'étranger réservent des mentors vérifiés déjà dans des universités du monde entier, avec sessions payantes, déblocage du contact après paiement, relecture de documents, tableau de gains et guides multi-auteurs. Construit et exploité comme notre propre produit, en expansion au-delà des études à l'étranger.", label: 'auroramentors.com' },
      { tag: 'Intelligence retail IA', blurb: "Un dashboard IA pour supermarchés et enseignes : prévision de demande avec bandes de confiance, moteur de réassort classant les SKU par jours de couverture, optimisation des prix et assistant agentique qui répond aux questions et propose l'action suivante.", label: 'Démo live' },
      { tag: 'Plateforme logistique', blurb: "Un site logistique moderne avec calculateur de coûts en temps réel (poids volumétrique, tarifs multimodaux, carburant et taxes), widget de suivi en direct et capture de leads validée. Conçu comme un site marketing orienté conversion.", label: 'Démo live' },
      { tag: 'PWA marketplace hyperlocale', blurb: "Une marketplace hyperlocale de 33 services en PWA installable : parcours de réservation multi-écrans, portfolios partenaires avec badges vérifiés et paiement wallet/escrow avec répartition 30:70 libérée par PIN client.", label: 'Démo live' },
    ],
    pg: {
      eyebrow: 'Démos live', h2a: 'Donnez un travail à un agent.', h2b: 'Puis interrompez-le.',
      p1: "Voilà ce que nous construisons : une IA qui fait un vrai travail, pas du chat. Prenez un appel en direct avec un ", voice: 'agent vocal',
      p2: " qui parle, réserve et se rattrape quand vous le coupez en pleine phrase. Ou envoyez un ", ops: "agent d'opérations",
      p3: " en mission et lancez-lui un imprévu. La même boucle que nous livrons en production sur des modèles frontier, rejouée dans votre navigateur.",
      tabVoice: 'Agent vocal · appel live', tabOps: "Agent d'ops · missions", demoNote: 'Les conversations de la démo sont en anglais.',
    },
    va: {
      title: 'Agent vocal',
      p1: "Un appel en direct : l'agent ", b1: 'parle à voix haute', p2: ', utilise ses outils en pleine conversation et (le plus dur) ', b2: "se rattrape quand vous l'interrompez", p3: '. Choisissez un appel.',
      answer: "Décrocher l'appel →",
      foot: "Rejeu déterministe d'une pipeline vocale de production (STT → LLM + outils → TTS). La voix est celle, gratuite, de votre navigateur, d'où son côté robotique. Rien n'est enregistré, aucun audio ne quitte cette page.",
      stackLine: 'Les projets clients sonnent humain. Nous construisons sur le stack vocal de production :',
      live: 'En direct', ended: 'Terminé', soundOn: '🔊 Son activé', muted: '🔇 Muet',
      interrupt: 'Interrompre', soon: 'bientôt', handled: '✓ Géré en direct', skip: 'Aller au résultat →',
      states: { agent: "L'agent parle", caller: 'Client · transcription', think: 'Raisonne', tool: 'Utilise ses outils', idle: 'Connexion…', done: 'Appel terminé' },
      complete: 'Appel terminé', summary: 'résumé extrait en direct',
      voiceNote: 'Voix de démo : le TTS gratuit de votre navigateur. En production, les agents utilisent des voix niveau ElevenLabs ou Cartesia et sonnent humain.',
      replayTry: "Rejouer et l'interrompre", replay: "Rejouer l'appel", opsBtn: "⚙ Lancer l'agent d'ops",
    },
    ops: {
      title: 'Console des agents',
      p1: 'Six missions, une boucle : ', loop: 'percevoir → planifier → agir → adapter', p2: ". Choisissez une mission, regardez l'agent la mener, puis lancez-lui un imprévu.",
      run: 'Lancer la mission →',
      foot: "Rejeu déterministe d'une vraie architecture d'agents. Tourne entièrement dans votre navigateur, sans appel d'API.",
      stackLine: 'En production, cette boucle tourne sur des modèles frontier avec de vrais outils :',
      plan: 'Plan', liveRun: 'Exécution live', curveball: 'Imprévu', incoming: '⚡ Ça arrive…', adapted: '✓ Agent adapté',
      complete: 'Mission accomplie', curveHandled: '1 imprévu géré', replayTry: "Rejouer et tenter l'imprévu", replay: 'Rejouer', addedLive: 'ajouté en direct',
    },
    labs: {
      eyebrow: 'Labs', h2a: 'Des idées testées', h2b: 'au grand jour.',
      p: "De petites expériences fonctionnelles issues de notre propre vivier d'idées. Chacune devient une offre client dès qu'elle fait ses preuves.",
      live: 'Lab en direct', soon: 'Au labo', open: 'Ouvrir le lab →',
      note: 'A2A Commerce et Seller AI tournent déjà en missions live dans le Playground ci-dessus.',
      items: [
        { t: 'Voice Journal', d: 'Parlez une minute et recevez une entrée de journal structurée : titre, humeur, actions. Vrai micro, entièrement dans votre navigateur.' },
        { t: 'AI Budgeter', d: 'Un directeur financier personnel qui surveille vos dépenses, signale les excès et explique pourquoi en langage clair.' },
        { t: 'GiftingAI', d: "Donnez-lui une personne, une occasion et un budget ; il argumente jusqu'au bon cadeau." },
      ],
    },
    pr: {
      eyebrow: 'Notre méthode', h2a: 'Rigueur de grand cabinet.', h2b: 'Vitesse de studio.',
      p: "Premium ne veut pas dire lent, et rapide ne veut pas dire fragile. Cela veut dire : un responsable identifié, des jalons clairs et un travail que vous inspectez chaque semaine.",
      platforms: 'Construit sur des plateformes que votre entreprise connaît déjà',
    },
    trust: [
      { t: 'Direction senior, toujours', d: "Chaque projet est mené de bout en bout par le fondateur. Des designers et ingénieurs spécialistes vérifiés rejoignent quand le périmètre grandit ; la capacité n'est jamais le goulot." },
      { t: 'Votre PI, entièrement à vous', d: 'Contrats propres, NDA avant tout partage sensible, et transfert complet du code source et de la PI à la livraison.' },
      { t: 'Sécurité par défaut', d: 'Accès au moindre privilège, secrets chiffrés, journaux d\'audit et gestion des données conforme RGPD sur chaque projet.' },
      { t: 'Global, async d\'abord', d: 'Clients aux États-Unis, en Europe, au Moyen-Orient et en Asie : heures de recouvrement, vidéos de démo hebdomadaires et un interlocuteur responsable unique.' },
      { t: 'Facturation au jalon', d: "Vous payez au jalon livré, jamais sur promesse. Le virement direct fonctionne très bien, ou l'escrow d'une plateforme si vous préférez : Upwork, Malt, Contra, à votre choix." },
      { t: 'Suivi après lancement', d: 'Documentation, formation de passation et 30 jours de support inclus avec chaque projet. Suivi long terme via retainer.' },
    ],
    ab: {
      eyebrow: 'À propos', h2a: 'Un studio avec', h2b: "l'attention du fondateur.",
      p1: "Le studio est dirigé par son fondateur, Aneesh Mohan, appuyé par un réseau de spécialistes vérifiés en design et ingénierie qui rejoignent quand votre périmètre grandit. Vous savez toujours qui est responsable : un owner senior, les mains dans votre projet, avec la capacité de monter en charge derrière.",
      p2: "Le vaisseau amiral est RiDERgy, notre propre produit : une IA agentique qui opère recharge VE et gestion d'énergie en production, là où la fiabilité ne se négocie pas. Chaque projet client est tenu à ce standard, de l'architecture et l'interface jusqu'à l'API, les données et la couche d'intelligence qui rend le tout utile.",
    },
    ct: {
      eyebrow: 'Contact', h2a: 'Quelque chose qui mérite', h2b: "d'être construit ?",
      p: "Un agent vocal, un effectif IA, une plateforme complète, ou une consultation payante pour cartographier vos options. Dites-nous ce qu'il vous faut et recevez une réponse senior sous un jour.",
      name: 'Votre nom', email: 'Votre e-mail', msg: 'Que construisons-nous ?',
      phName: 'Jeanne Fondatrice', phEmail: 'jeanne@entreprise.fr', phMsg: "Un agent vocal pour l'accueil de notre clinique. Deux sites, environ 90 appels par jour…",
      consult: 'Consultations payantes disponibles : stratégie, architecture et feuilles de route IA.',
      send: 'Envoyer le message', sending: 'Envoi…',
      sentH: 'Message bien reçu.', sentP: "Attendez-vous à une réponse senior sous un jour. Si c'est urgent, signalez-le aussi sur LinkedIn.",
      err: "Le formulaire n'a pas pu envoyer. Contactez-nous plutôt via LinkedIn, ci-dessous.",
      nda: 'NDA possible · Facturation au jalon · Direct ou escrow de plateforme, au choix',
    },
    footer: 'Construit de zéro · React & Tailwind',
  },
};

const Ctx = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try { return LANGS.includes(localStorage.getItem('lang')) ? localStorage.getItem('lang') : 'EN'; }
    catch { return 'EN'; }
  });
  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem('lang', l); } catch { /* private mode */ }
    document.documentElement.lang = l.toLowerCase();
  };
  return <Ctx.Provider value={{ lang, setLang, s: STR[lang] }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
