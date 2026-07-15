import React, { createContext, useContext, useEffect, useState } from 'react';

/* ════════════════════════════════════════════════════════════════════════
   I18N: all page copy in EN (primary), DE, ES, FR. The interactive demo
   transcripts (missions.js / calls.js) are localized via demo-i18n.js;
   only tool-call signatures stay in English (they read as code).
   Editorial rule: no em dashes, en dashes or minus signs anywhere.
   ════════════════════════════════════════════════════════════════════════ */

export const LANGS = ['EN', 'DE', 'ES', 'FR'];

const STR = {
  EN: {
    nav: ['Work', 'Playground', 'Process', 'About', 'Contact'],
    cta: 'Start a project',
    more: 'More',
    hero: {
      eyebrow: 'AI & Software Studio · Voice · Agents · Full-Stack',
      h1a: 'Fast, intelligent', h1b: 'software, built to ', ship: 'ship.',
      p: 'A senior-led studio building voice agents, AI workforces, and production software, from blank page to ship.',
      view: 'View the work', avail: 'Accepting new projects',
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
    work: { eyebrow: 'Selected Work', h2a: 'Products designed, built', h2b: 'and shipped from zero.', howToCta: 'How to test this', swipe: 'Swipe to browse →', more: 'And more, on request.' },
    projects: [
      { tag: 'Flagship · Agentic AI', blurb: 'An EV charging and energy-management SaaS built from the ground up. Agentic watchdogs continuously monitor chargers, batteries and solar, while an LLM chat layer lets users control the system in plain language: start a vehicle charging, shift load to solar, or push a schedule, and the agents execute.', note: 'Proprietary codebase · live demo shows full functionality', label: 'demo.ridergy.com' },
      { tag: 'Live Product · Mentorship Marketplace', blurb: 'A two-sided mentorship marketplace: students planning to study abroad book verified mentors already at universities around the world, with paid sessions, contact unlock after checkout, document feedback, mentor earnings dashboards and multi-author guides. Built and run as our own product, expanding beyond study abroad.', label: 'auroramentors.com' },
      { tag: 'AI Retail Intelligence', blurb: 'An AI dashboard for supermarkets and chains: demand forecasting with confidence bands, an AI reorder engine ranking SKUs by days-of-cover, price-optimization recommendations, and an agentic insights assistant that answers questions and proposes the next action.', label: 'Live demo' },
      { tag: 'Logistics Platform', blurb: 'A modern logistics company site with a real-time shipment cost calculator (volumetric weight, multi-mode pricing, fuel and GST), a live tracking widget, and a validated lead-capture flow. Built as a conversion-focused marketing site.', label: 'Live demo' },
      { tag: 'Hyperlocal Marketplace PWA', blurb: 'A 33-service hyperlocal marketplace as an installable PWA: a multi-screen booking flow, masonry partner portfolios with verified badges, and a wallet and escrow payment model with a 30:70 split released by customer PIN.', label: 'Live demo' },
      { tag: 'Event Registration & Management Portal', blurb: 'A full event platform built from an SRS in days: dual participant/exhibitor registration with real QR passes and calendar invites, a separate admin portal with a live dashboard, drag-free agenda management, camera-based QR check-in with duplicate detection, and CSV/Excel/PDF exports.', note: 'Admin demo: admin@solsticedynamics.com / ConnectAdmin@2026', label: 'Live demo', howTo: [
        'Register as a participant or exhibitor on the homepage to get a real, scannable QR pass.',
        'Go to /admin and log in with the demo credentials above.',
        'Open QR Check-in, allow camera access, and scan the pass from step 1 for instant check-in feedback.',
        'Browse the live dashboard, registrations, and agenda, all backed by a real database, not a static mockup.',
      ] },
      { tag: 'IoT · AI Firmware Copilot', blurb: 'A local AI assistant that turns a plain-language description into working ESP32 firmware: it plans the project, generates the architecture and modular FreeRTOS code, writes the files into an Arduino project, builds locally and flashes the board only when a device is safely detected. IoT and microcontroller work, from prompt to hardware.', note: 'In development · private walkthrough on request', label: '' },
      { tag: 'Account & Payments Portal', blurb: 'A scrap and recycling pickup platform built as a working prototype in a day: a password-protected customer portal with registration, login and profile editing, Stripe payments verified server-side, an admin panel for managing customers and pickup tickets, and a Postgres data model with row-level security so customers only ever see and edit their own records.', note: 'Customer demo: test.buyer@scrapline-test.com / TestPass123! · Admin: demo.customer@scrapline-test.com / DemoPass123!', label: 'Live demo', howTo: [
        'Click "Get started" to register your own account, or sign in with the seeded customer login above.',
        'Browse the customer portal: edit your profile, book a pickup, and pay with Stripe in test mode.',
        'Sign in with the seeded admin login, then go to /admin to manage customers and pickup tickets.',
        'Row-level security means a signed-in customer only ever sees and edits their own data, never another account\'s.',
      ] },
    ],
    pg: {
      eyebrow: 'Live demos', h2a: 'Give an agent a job.', h2b: 'Then interrupt it.',
      p1: 'This is what we build: AI that does real work, not chat. Take a live call with a ', voice: 'voice agent',
      p2: ' that speaks, books, and recovers when you cut it off mid-sentence. Or run an ', ops: 'operations agent',
      p3: ' on a mission and throw it a curveball. The same loop we ship to production on frontier models, replayed right in your browser.',
      tabVoice: 'Voice agent · live call', tabOps: 'Ops agent · missions', demoNote: '',
    },
    va: {
      title: 'Voice Agent', roleAgent: 'Agent', roleCaller: 'Caller', cutTag: 'interrupted',
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
      skip: 'Skip to the result →', complete: 'Mission complete', curveHandled: '1 curveball handled', replayTry: 'Replay and try the curveball', replay: 'Replay', addedLive: 'added live',
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
        { t: 'AI-to-AI Sales & Marketing', d: "Outbound and marketing agents that pitch, qualify and negotiate directly with a prospect's AI assistant, escalating to a human only once there is a real deal to sign." },
      ],
    },
    pr: {
      eyebrow: 'How we work', h2a: 'Big-firm discipline.', h2b: 'Studio speed.',
      p: 'Premium does not mean slow, and fast does not mean fragile. It means one accountable owner, clear milestones, and work you can inspect every week.',
      platforms: 'Built on platforms your business already trusts',
    },
    trust: [
      { t: 'Senior-led, always', d: 'Every project is led end to end by a senior engineer, never handed off to juniors. Vetted specialist designers and engineers join as your scope grows, so capacity is never the bottleneck.' },
      { t: 'Your IP, fully yours', d: 'Clean contracts, NDA before you share anything sensitive, and full source code and IP transfer on completion.' },
      { t: 'Security by default', d: 'Least-privilege access, encrypted secrets, audit trails and GDPR-aware data handling on every build.' },
      { t: 'Global, async-first', d: 'Clients across US, EU, Middle East and Asia get overlap hours, weekly demo videos and one accountable point of contact.' },
      { t: 'Milestone billing', d: 'Pay per shipped milestone, never for promises. Direct bank transfer works great, or platform escrow if you prefer: Upwork, Malt, Contra, your choice.' },
      { t: 'Supported after launch', d: 'Documentation, handover training and 30 days of included support with every build. Long-term care via retainers.' },
    ],
    join: {
      eyebrow: 'Join the studio', h2a: 'We hire talent,', h2b: 'not resumes.',
      p: 'The project pipeline is growing: voice agents, AI workforces, premium apps and dashboards for clients worldwide. We work with freelancers and specialists, project-based, async-first, paid per milestone.',
      roles: [
        { t: 'AI Engineer', d: 'LLM agents, RAG, evals' },
        { t: 'Voice AI Engineer', d: 'STT/TTS pipelines, telephony' },
        { t: 'Full-Stack Engineer', d: 'React/Next, Node, Python' },
        { t: 'Mobile Engineer', d: 'Flutter, PWAs' },
        { t: 'Product Designer', d: 'Premium interfaces, design systems' },
        { t: 'Automation Specialist', d: 'n8n, Make, WhatsApp API' },
        { t: 'Sales & Digital Marketing', d: 'Outbound, ads, SEO, content' },
      ],
      openT: 'None of these?', openD: 'Open applications are welcome. Tell us what you do exceptionally well and show one thing you made.',
      cta: 'Apply now', note: 'Applications go through the contact form: mention the role and link your best work.',
    },
    ab: {
      eyebrow: 'About', h2a: 'A studio built on', h2b: 'senior craft.',
      p1: 'a-niche is a small studio of senior engineers and designers. The same accountable team stays on your project from kickoff to launch, with vetted specialists joining as your scope grows and the capacity to scale behind it.',
      p2: 'Our own products, RiDERgy (agentic AI running EV charging and energy management) and Aurora Mentors (a live mentorship marketplace), run in production every day, where reliability is non-negotiable. Every client project is held to that same standard, from the architecture and the interface to the API, the data and the intelligence layer that makes it useful.',
    },
    ct: {
      eyebrow: 'Contact', h2a: 'Have something', h2b: 'worth building?',
      p: 'A voice agent, an AI workforce, a full platform, or a paid consultation to map your options. Tell us what you need and get a senior reply within a day.',
      name: 'Your name', email: 'Your email', msg: 'What are we building?',
      phName: 'Jane Founder', phEmail: 'jane@company.com', phMsg: 'A voice agent for our clinic front desk. Two locations, about 90 calls a day…',
      consult: 'Paid consultations available: strategy, architecture and AI roadmaps.',
      send: 'Send message', sending: 'Sending…',
      sentH: 'Message received.', sentP: "The team reviews every message and responds promptly, usually within a day. If it's urgent, mention it on LinkedIn too.",
      err: 'The form could not send just now. Please reach out via LinkedIn below instead.',
      nda: 'NDA-friendly · Milestone billing · Direct or platform escrow, your choice',
    },
    consent: {
      p: 'We use cookies for analytics to understand how visitors use this site. No data is sold or used for ads.',
      accept: 'Accept', decline: 'Decline',
    },
  },

  DE: {
    nav: ['Arbeiten', 'Playground', 'Prozess', 'Über uns', 'Kontakt'],
    cta: 'Projekt starten',
    more: 'Mehr',
    hero: {
      eyebrow: 'KI- & Software-Studio · Voice · Agenten · Full-Stack',
      h1a: 'Schnelle, intelligente', h1b: 'Software, gebaut zum ', ship: 'Liefern.',
      p: 'Ein senior-geführtes Studio für Voice-Agenten, KI-Workforces und Produktionssoftware, vom leeren Blatt bis zum Launch.',
      view: 'Arbeiten ansehen', avail: 'Wir nehmen neue Projekte an',
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
    work: { eyebrow: 'Ausgewählte Arbeiten', h2a: 'Produkte entworfen, gebaut', h2b: 'und von null geliefert.', howToCta: 'So testen Sie es', swipe: 'Zum Durchblättern wischen →', more: 'Und mehr, auf Anfrage.' },
    projects: [
      { tag: 'Flaggschiff · Agentische KI', blurb: 'Ein SaaS für EV-Laden und Energiemanagement, von Grund auf gebaut. Agentische Watchdogs überwachen Ladepunkte, Batterien und Solar, während eine LLM-Chat-Ebene das System in Alltagssprache steuert: Fahrzeug laden, Last auf Solar verschieben, Zeitplan setzen, die Agenten führen aus.', note: 'Proprietäre Codebasis · Live-Demo zeigt vollen Funktionsumfang', label: 'demo.ridergy.com' },
      { tag: 'Live-Produkt · Mentoring-Marktplatz', blurb: 'Ein zweiseitiger Mentoring-Marktplatz: Studierende mit Auslandsplänen buchen verifizierte Mentoren, die bereits an Universitäten weltweit studieren, mit bezahlten Sessions, Kontaktfreigabe nach dem Checkout, Dokumenten-Feedback, Earnings-Dashboards und Guides mehrerer Autoren. Als eigenes Produkt gebaut und betrieben, mit Ausbau über das Auslandsstudium hinaus.', label: 'auroramentors.com' },
      { tag: 'KI-Retail-Intelligence', blurb: 'Ein KI-Dashboard für Supermärkte und Ketten: Nachfrageprognosen mit Konfidenzband, eine KI-Nachbestell-Engine, die SKUs nach Reichweite priorisiert, Preisoptimierung und ein agentischer Insights-Assistent, der Fragen beantwortet und die nächste Aktion vorschlägt.', label: 'Live-Demo' },
      { tag: 'Logistik-Plattform', blurb: 'Eine moderne Logistik-Website mit Echtzeit-Frachtkostenrechner (Volumengewicht, Multi-Mode-Preise, Kraftstoff und Steuern), Live-Tracking-Widget und validierter Lead-Erfassung. Gebaut als conversion-fokussierte Marketing-Site.', label: 'Live-Demo' },
      { tag: 'Hyperlokale Marktplatz-PWA', blurb: 'Ein hyperlokaler Marktplatz mit 33 Services als installierbare PWA: mehrstufiger Buchungsflow, Partner-Portfolios mit Verifizierungs-Badges und ein Wallet-/Escrow-Zahlungsmodell mit 30:70-Split per Kunden-PIN.', label: 'Live-Demo' },
      { tag: 'Event-Registrierungs- und Verwaltungsportal', blurb: 'Eine komplette Event-Plattform, in wenigen Tagen aus einem Lastenheft gebaut: doppelte Registrierung für Teilnehmer und Aussteller mit echten QR-Pässen und Kalendereinladungen, ein separates Admin-Portal mit Live-Dashboard, drag-freie Agenda-Verwaltung, kamerabasierter QR-Check-in mit Duplikaterkennung und CSV-/Excel-/PDF-Exporte.', note: 'Admin-Demo: admin@solsticedynamics.com / ConnectAdmin@2026', label: 'Live-Demo', howTo: [
        'Auf der Startseite als Teilnehmer oder Aussteller registrieren, um einen echten, scanbaren QR-Pass zu erhalten.',
        'Unter /admin mit den Demo-Zugangsdaten oben anmelden.',
        'QR-Check-in öffnen, Kamerazugriff erlauben und den Pass aus Schritt 1 scannen für sofortiges Check-in-Feedback.',
        'Live-Dashboard, Registrierungen und Agenda durchsehen, alles gestützt auf eine echte Datenbank, kein statisches Mockup.',
      ] },
      { tag: 'IoT · KI-Firmware-Copilot', blurb: 'Ein lokaler KI-Assistent, der eine Alltagssprache-Beschreibung in funktionierende ESP32-Firmware verwandelt: Er plant das Projekt, erzeugt Architektur und modularen FreeRTOS-Code, schreibt die Dateien in ein Arduino-Projekt, baut lokal und flasht das Board nur, wenn ein Gerät sicher erkannt wird. IoT- und Mikrocontroller-Arbeit, vom Prompt bis zur Hardware.', note: 'In Entwicklung · privater Walkthrough auf Anfrage', label: '' },
      { tag: 'Konten- & Zahlungsportal', blurb: 'Eine Recycling- und Schrottabholungsplattform, als funktionierender Prototyp in einem Tag gebaut: passwortgeschütztes Kundenportal mit Registrierung, Login und Profilbearbeitung, serverseitig verifizierte Stripe-Zahlungen, ein Admin-Panel zur Verwaltung von Kunden und Abholtickets, und ein Postgres-Datenmodell mit Row-Level-Security, sodass Kunden nur ihre eigenen Datensätze sehen und bearbeiten.', note: 'Kunden-Demo: test.buyer@scrapline-test.com / TestPass123! · Admin: demo.customer@scrapline-test.com / DemoPass123!', label: 'Live-Demo', howTo: [
        'Auf "Get started" klicken, um ein eigenes Konto zu registrieren, oder mit dem Demo-Kundenlogin oben anmelden.',
        'Das Kundenportal erkunden: Profil bearbeiten, eine Abholung buchen und im Stripe-Testmodus bezahlen.',
        'Mit dem Demo-Admin-Login anmelden und dann zu /admin gehen, um Kunden und Abholtickets zu verwalten.',
        'Row-Level-Security bedeutet: Ein angemeldeter Kunde sieht und bearbeitet immer nur seine eigenen Daten, nie die eines anderen Kontos.',
      ] },
    ],
    pg: {
      eyebrow: 'Live-Demos', h2a: 'Geben Sie einem Agenten einen Job.', h2b: 'Dann unterbrechen Sie ihn.',
      p1: 'Das ist, was wir bauen: KI, die echte Arbeit leistet, nicht Chat. Führen Sie ein Live-Telefonat mit einem ', voice: 'Voice-Agenten',
      p2: ', der spricht, bucht und sich fängt, wenn Sie ihn mitten im Satz unterbrechen. Oder schicken Sie einen ', ops: 'Operations-Agenten',
      p3: ' auf Mission und werfen Sie ihm einen Störfall dazwischen. Dieselbe Schleife liefern wir mit Frontier-Modellen in Produktion, hier im Browser wiedergegeben.',
      tabVoice: 'Voice-Agent · Live-Anruf', tabOps: 'Ops-Agent · Missionen', demoNote: '',
    },
    va: {
      title: 'Voice-Agent', roleAgent: 'Agent', roleCaller: 'Anrufer', cutTag: 'unterbrochen',
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
      skip: 'Zum Ergebnis springen →', complete: 'Mission abgeschlossen', curveHandled: '1 Störfall gemeistert', replayTry: 'Nochmal, mit Störfall', replay: 'Wiederholen', addedLive: 'live ergänzt',
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
        { t: 'KI-zu-KI Sales & Marketing', d: 'Outbound- und Marketing-Agenten, die direkt mit dem KI-Assistenten eines Interessenten pitchen, qualifizieren und verhandeln, und erst eskalieren, wenn es wirklich etwas zu unterschreiben gibt.' },
      ],
    },
    pr: {
      eyebrow: 'Wie wir arbeiten', h2a: 'Konzern-Disziplin.', h2b: 'Studio-Tempo.',
      p: 'Premium heißt nicht langsam, und schnell heißt nicht fragil. Es heißt: ein verantwortlicher Owner, klare Meilensteine und Arbeit, die Sie jede Woche prüfen können.',
      platforms: 'Gebaut auf Plattformen, denen Ihr Unternehmen bereits vertraut',
    },
    trust: [
      { t: 'Senior-geführt, immer', d: 'Jedes Projekt führt ein Senior-Engineer Ende-zu-Ende, nie an Junioren abgegeben. Geprüfte Spezialisten für Design und Engineering stoßen dazu, wenn der Umfang wächst. Kapazität ist nie der Engpass.' },
      { t: 'Ihre IP, vollständig', d: 'Saubere Verträge, NDA bevor Sie Sensibles teilen, und vollständige Übertragung von Quellcode und IP bei Abschluss.' },
      { t: 'Sicherheit als Standard', d: 'Least-Privilege-Zugriffe, verschlüsselte Secrets, Audit-Trails und DSGVO-bewusster Umgang mit Daten in jedem Build.' },
      { t: 'Global, async-first', d: 'Kunden in den USA, der EU, dem Nahen Osten und Asien erhalten Überlappungszeiten, wöchentliche Demo-Videos und einen verantwortlichen Ansprechpartner.' },
      { t: 'Abrechnung nach Meilensteinen', d: 'Bezahlt wird pro geliefertem Meilenstein, nie für Versprechen. Direkte Überweisung funktioniert bestens, oder Plattform-Escrow, wenn Sie das bevorzugen: Upwork, Malt, Contra, Ihre Wahl.' },
      { t: 'Support nach dem Launch', d: 'Dokumentation, Übergabe-Training und 30 Tage Support inklusive bei jedem Build. Langfristige Betreuung per Retainer.' },
    ],
    join: {
      eyebrow: 'Ins Studio kommen', h2a: 'Wir suchen Talent,', h2b: 'keine Lebensläufe.',
      p: 'Die Projekt-Pipeline wächst: Voice-Agenten, KI-Workforces, Premium-Apps und Dashboards für Kunden weltweit. Wir arbeiten mit Freelancern und Spezialisten, projektbasiert, async-first, bezahlt pro Meilenstein.',
      roles: [
        { t: 'AI Engineer', d: 'LLM-Agenten, RAG, Evals' },
        { t: 'Voice AI Engineer', d: 'STT/TTS-Pipelines, Telefonie' },
        { t: 'Full-Stack Engineer', d: 'React/Next, Node, Python' },
        { t: 'Mobile Engineer', d: 'Flutter, PWAs' },
        { t: 'Product Designer', d: 'Premium-Interfaces, Designsysteme' },
        { t: 'Automation Specialist', d: 'n8n, Make, WhatsApp API' },
        { t: 'Sales & Digital Marketing', d: 'Outbound, Ads, SEO, Content' },
      ],
      openT: 'Nichts dabei?', openD: 'Initiativbewerbungen sind willkommen. Sagen Sie uns, was Sie außergewöhnlich gut können, und zeigen Sie eine Sache, die Sie gebaut haben.',
      cta: 'Jetzt bewerben', note: 'Bewerbungen laufen über das Kontaktformular: Rolle nennen und beste Arbeit verlinken.',
    },
    ab: {
      eyebrow: 'Über uns', h2a: 'Ein Studio, gebaut auf', h2b: 'Senior-Handwerk.',
      p1: 'a-niche ist ein kleines Studio aus Senior-Engineers und -Designern. Dasselbe verantwortliche Team bleibt vom Kickoff bis zum Launch an Ihrem Projekt, geprüfte Spezialisten stoßen dazu, wenn Ihr Umfang wächst, mit skalierbarer Kapazität dahinter.',
      p2: 'Unsere eigenen Produkte, RiDERgy (agentische KI für EV-Laden und Energiemanagement) und Aurora Mentors (ein live betriebener Mentoring-Marktplatz), laufen täglich in Produktion, wo Zuverlässigkeit nicht verhandelbar ist. Jedes Kundenprojekt wird an demselben Standard gemessen, von Architektur und Interface bis zu API, Daten und der Intelligenz-Ebene, die alles nützlich macht.',
    },
    ct: {
      eyebrow: 'Kontakt', h2a: 'Etwas, das es wert ist,', h2b: 'gebaut zu werden?',
      p: 'Ein Voice-Agent, eine KI-Workforce, eine komplette Plattform oder eine bezahlte Beratung, um Ihre Optionen zu kartieren. Sagen Sie uns, was Sie brauchen, und erhalten Sie innerhalb eines Tages eine Senior-Antwort.',
      name: 'Ihr Name', email: 'Ihre E-Mail', msg: 'Was bauen wir?',
      phName: 'Max Gründer', phEmail: 'max@firma.de', phMsg: 'Ein Voice-Agent für unsere Praxis-Rezeption. Zwei Standorte, etwa 90 Anrufe am Tag…',
      consult: 'Bezahlte Beratung verfügbar: Strategie, Architektur und KI-Roadmaps.',
      send: 'Nachricht senden', sending: 'Wird gesendet…',
      sentH: 'Nachricht erhalten.', sentP: 'Das Team prüft jede Nachricht und antwortet zügig, in der Regel innerhalb eines Tages. Bei Dringendem gern zusätzlich per LinkedIn melden.',
      err: 'Das Formular konnte gerade nicht senden. Bitte melden Sie sich stattdessen unten über LinkedIn.',
      nda: 'NDA-freundlich · Meilenstein-Abrechnung · Direkt oder Plattform-Escrow, Ihre Wahl',
    },
    consent: {
      p: 'Wir verwenden Cookies für Analytics, um zu verstehen, wie Besucher diese Seite nutzen. Keine Daten werden verkauft oder für Werbung genutzt.',
      accept: 'Akzeptieren', decline: 'Ablehnen',
    },
  },

  ES: {
    nav: ['Trabajo', 'Playground', 'Proceso', 'Nosotros', 'Contacto'],
    cta: 'Iniciar un proyecto',
    more: 'Más',
    hero: {
      eyebrow: 'Estudio de IA y Software · Voz · Agentes · Full-Stack',
      h1a: 'Software rápido e', h1b: 'inteligente, hecho para ', ship: 'entregar.',
      p: 'Un estudio senior que construye agentes de voz, plantillas de IA y software de producción, del papel en blanco al lanzamiento.',
      view: 'Ver el trabajo', avail: 'Aceptamos nuevos proyectos',
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
    work: { eyebrow: 'Trabajo seleccionado', h2a: 'Productos diseñados, construidos', h2b: 'y entregados desde cero.', howToCta: 'Cómo probarlo', swipe: 'Desliza para ver más →', more: 'Y más, bajo petición.' },
    projects: [
      { tag: 'Buque insignia · IA agéntica', blurb: 'Un SaaS de carga de vehículos eléctricos y gestión energética construido desde cero. Watchdogs agénticos vigilan cargadores, baterías y solar, mientras una capa de chat LLM permite controlar el sistema en lenguaje natural: cargar un vehículo, mover carga a solar o fijar un horario, y los agentes ejecutan.', note: 'Código propietario · la demo en vivo muestra toda la funcionalidad', label: 'demo.ridergy.com' },
      { tag: 'Producto en vivo · Marketplace de mentores', blurb: 'Un marketplace de mentores de dos lados: estudiantes que planean estudiar en el extranjero reservan mentores verificados que ya están en universidades de todo el mundo, con sesiones de pago, desbloqueo de contacto tras el checkout, revisión de documentos, panel de ingresos y guías multiautor. Construido y operado como producto propio, en expansión más allá del estudio en el extranjero.', label: 'auroramentors.com' },
      { tag: 'Inteligencia retail con IA', blurb: 'Un dashboard de IA para supermercados y cadenas: pronóstico de demanda con bandas de confianza, un motor de reposición que prioriza SKUs por días de cobertura, optimización de precios y un asistente agéntico que responde preguntas y propone la siguiente acción.', label: 'Demo en vivo' },
      { tag: 'Plataforma logística', blurb: 'Una web logística moderna con calculadora de costes de envío en tiempo real (peso volumétrico, precios multimodales, combustible e impuestos), widget de tracking en vivo y captura de leads validada. Construida como site de marketing enfocado en conversión.', label: 'Demo en vivo' },
      { tag: 'PWA marketplace hiperlocal', blurb: 'Un marketplace hiperlocal de 33 servicios como PWA instalable: flujo de reserva multipantalla, portafolios de socios con insignias verificadas y un modelo de pago con wallet y escrow con reparto 30:70 liberado por PIN del cliente.', label: 'Demo en vivo' },
      { tag: 'Portal de registro y gestión de eventos', blurb: 'Una plataforma de eventos completa construida desde un SRS en días: registro dual de participante y expositor con pases QR reales e invitaciones de calendario, un portal de administración separado con dashboard en vivo, gestión de agenda sin arrastrar, check-in por cámara con QR y detección de duplicados, y exportes en CSV/Excel/PDF.', note: 'Demo de admin: admin@solsticedynamics.com / ConnectAdmin@2026', label: 'Demo en vivo', howTo: [
        'Regístrate como participante o expositor en la página de inicio para obtener un pase QR real y escaneable.',
        'Ve a /admin e inicia sesión con las credenciales de la demo de arriba.',
        'Abre QR Check-in, permite el acceso a la cámara y escanea el pase del paso 1 para feedback instantáneo de check-in.',
        'Explora el dashboard en vivo, los registros y la agenda, todo respaldado por una base de datos real, no una maqueta estática.',
      ] },
      { tag: 'IoT · Copiloto de firmware con IA', blurb: 'Un asistente de IA local que convierte una descripción en lenguaje natural en firmware ESP32 funcional: planifica el proyecto, genera la arquitectura y el código FreeRTOS modular, escribe los archivos en un proyecto Arduino, compila en local y flashea la placa solo cuando detecta un dispositivo de forma segura. Trabajo IoT y de microcontroladores, del prompt al hardware.', note: 'En desarrollo · demo privada bajo petición', label: '' },
      { tag: 'Portal de cuentas y pagos', blurb: 'Una plataforma de recogida de chatarra y reciclaje construida como prototipo funcional en un día: portal de cliente protegido con contraseña con registro, inicio de sesión y edición de perfil, pagos con Stripe verificados en el servidor, un panel de administración para gestionar clientes y tickets de recogida, y un modelo de datos en Postgres con seguridad a nivel de fila para que cada cliente solo vea y edite sus propios registros.', note: 'Demo de cliente: test.buyer@scrapline-test.com / TestPass123! · Admin: demo.customer@scrapline-test.com / DemoPass123!', label: 'Demo en vivo', howTo: [
        'Haz clic en "Get started" para registrar tu propia cuenta, o inicia sesión con el login de cliente de demo de arriba.',
        'Explora el portal del cliente: edita tu perfil, reserva una recogida y paga en modo de prueba de Stripe.',
        'Inicia sesión con el login de admin de demo y ve a /admin para gestionar clientes y tickets de recogida.',
        'La seguridad a nivel de fila significa que un cliente conectado solo ve y edita sus propios datos, nunca los de otra cuenta.',
      ] },
    ],
    pg: {
      eyebrow: 'Demos en vivo', h2a: 'Dale un trabajo a un agente.', h2b: 'Luego interrúmpelo.',
      p1: 'Esto es lo que construimos: IA que hace trabajo real, no chat. Atiende una llamada en vivo con un ', voice: 'agente de voz',
      p2: ' que habla, agenda y se recupera cuando lo cortas a mitad de frase. O lanza un ', ops: 'agente de operaciones',
      p3: ' a una misión y tírale una bola curva. El mismo bucle que llevamos a producción con modelos frontier, reproducido en tu navegador.',
      tabVoice: 'Agente de voz · llamada en vivo', tabOps: 'Agente de ops · misiones', demoNote: '',
    },
    va: {
      title: 'Agente de voz', roleAgent: 'Agente', roleCaller: 'Cliente', cutTag: 'interrumpido',
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
      skip: 'Saltar al resultado →', complete: 'Misión completada', curveHandled: '1 bola curva resuelta', replayTry: 'Repetir y probar la bola curva', replay: 'Repetir', addedLive: 'añadido en vivo',
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
        { t: 'Ventas y marketing IA a IA', d: 'Agentes de ventas y marketing que presentan, califican y negocian directamente con el asistente de IA de un cliente potencial, y solo escalan a una persona cuando hay un trato real que firmar.' },
      ],
    },
    pr: {
      eyebrow: 'Cómo trabajamos', h2a: 'Disciplina de gran firma.', h2b: 'Velocidad de estudio.',
      p: 'Premium no significa lento, y rápido no significa frágil. Significa un responsable claro, hitos definidos y trabajo que puedes inspeccionar cada semana.',
      platforms: 'Construido sobre plataformas en las que tu negocio ya confía',
    },
    trust: [
      { t: 'Liderazgo senior, siempre', d: 'Cada proyecto lo dirige de principio a fin un ingeniero senior, nunca se delega a juniors. Diseñadores e ingenieros especialistas verificados se suman cuando el alcance crece; la capacidad nunca es el cuello de botella.' },
      { t: 'Tu IP, completamente tuya', d: 'Contratos limpios, NDA antes de compartir nada sensible, y transferencia total de código fuente e IP al finalizar.' },
      { t: 'Seguridad por defecto', d: 'Accesos de privilegio mínimo, secretos cifrados, trazas de auditoría y manejo de datos consciente del RGPD en cada proyecto.' },
      { t: 'Global y asíncrono', d: 'Clientes en EE. UU., Europa, Oriente Medio y Asia reciben horas de solape, videos demo semanales y un único punto de contacto responsable.' },
      { t: 'Facturación por hitos', d: 'Pagas por hito entregado, nunca por promesas. La transferencia directa funciona perfectamente, o escrow de plataforma si lo prefieres: Upwork, Malt, Contra, tú eliges.' },
      { t: 'Soporte tras el lanzamiento', d: 'Documentación, formación de traspaso y 30 días de soporte incluidos en cada proyecto. Cuidado a largo plazo vía retainers.' },
    ],
    join: {
      eyebrow: 'Únete al estudio', h2a: 'Buscamos talento,', h2b: 'no currículums.',
      p: 'La cartera de proyectos crece: agentes de voz, plantillas de IA, apps y dashboards premium para clientes de todo el mundo. Trabajamos con freelancers y especialistas, por proyecto, async-first, con pago por hito.',
      roles: [
        { t: 'AI Engineer', d: 'Agentes LLM, RAG, evals' },
        { t: 'Voice AI Engineer', d: 'Pipelines STT/TTS, telefonía' },
        { t: 'Full-Stack Engineer', d: 'React/Next, Node, Python' },
        { t: 'Mobile Engineer', d: 'Flutter, PWAs' },
        { t: 'Product Designer', d: 'Interfaces premium, sistemas de diseño' },
        { t: 'Automation Specialist', d: 'n8n, Make, WhatsApp API' },
        { t: 'Ventas y Marketing Digital', d: 'Outbound, ads, SEO, contenido' },
      ],
      openT: '¿Nada encaja?', openD: 'Las candidaturas espontáneas son bienvenidas. Cuéntanos qué haces excepcionalmente bien y muestra algo que hayas creado.',
      cta: 'Postúlate', note: 'Las candidaturas van por el formulario de contacto: menciona el rol y enlaza tu mejor trabajo.',
    },
    ab: {
      eyebrow: 'Nosotros', h2a: 'Un estudio construido con', h2b: 'oficio senior.',
      p1: 'a-niche es un estudio pequeño de ingenieros y diseñadores senior. El mismo equipo responsable se queda en tu proyecto desde el kickoff hasta el lanzamiento, con especialistas verificados que se suman cuando tu alcance crece y capacidad para escalar detrás.',
      p2: 'Nuestros propios productos, RiDERgy (IA agéntica para carga de vehículos eléctricos y gestión energética) y Aurora Mentors (un marketplace de mentores en vivo), funcionan a diario en producción, donde la fiabilidad no es negociable. Cada proyecto de cliente se mide con ese mismo estándar, de la arquitectura y la interfaz a la API, los datos y la capa de inteligencia que lo hace útil.',
    },
    ct: {
      eyebrow: 'Contacto', h2a: '¿Tienes algo que', h2b: 'valga la pena construir?',
      p: 'Un agente de voz, una plantilla de IA, una plataforma completa o una consultoría de pago para mapear tus opciones. Cuéntanos qué necesitas y recibe una respuesta senior en un día.',
      name: 'Tu nombre', email: 'Tu correo', msg: '¿Qué construimos?',
      phName: 'Ana Fundadora', phEmail: 'ana@empresa.com', phMsg: 'Un agente de voz para la recepción de nuestra clínica. Dos sedes, unas 90 llamadas al día…',
      consult: 'Consultorías de pago disponibles: estrategia, arquitectura y hojas de ruta de IA.',
      send: 'Enviar mensaje', sending: 'Enviando…',
      sentH: 'Mensaje recibido.', sentP: 'El equipo revisa cada mensaje y responde con prontitud, normalmente en un día. Si es urgente, menciónalo también por LinkedIn.',
      err: 'El formulario no pudo enviarse ahora. Escríbenos por LinkedIn, aquí abajo.',
      nda: 'NDA disponible · Facturación por hitos · Directo o escrow de plataforma, tú eliges',
    },
    consent: {
      p: 'Usamos cookies de analítica para entender cómo los visitantes usan este sitio. No vendemos datos ni los usamos para publicidad.',
      accept: 'Aceptar', decline: 'Rechazar',
    },
  },

  FR: {
    nav: ['Réalisations', 'Playground', 'Méthode', 'À propos', 'Contact'],
    cta: 'Lancer un projet',
    more: 'Plus',
    hero: {
      eyebrow: 'Studio IA & Logiciel · Voix · Agents · Full-Stack',
      h1a: 'Des logiciels rapides,', h1b: 'intelligents, faits pour ', ship: 'livrer.',
      p: 'Un studio senior qui construit agents vocaux, effectifs IA et logiciels de production, de la page blanche à la livraison.',
      view: 'Voir les réalisations', avail: 'Nouveaux projets bienvenus',
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
    work: { eyebrow: 'Réalisations choisies', h2a: 'Des produits conçus, construits', h2b: 'et livrés de zéro.', howToCta: 'Comment le tester', swipe: 'Balayez pour parcourir →', more: 'Et bien plus, sur demande.' },
    projects: [
      { tag: 'Vaisseau amiral · IA agentique', blurb: "Un SaaS de recharge VE et de gestion d'énergie construit de zéro. Des watchdogs agentiques surveillent bornes, batteries et solaire, tandis qu'une couche de chat LLM pilote le système en langage courant : lancer une charge, basculer sur le solaire, fixer un planning, et les agents exécutent.", note: 'Code propriétaire · la démo en direct montre toutes les fonctionnalités', label: 'demo.ridergy.com' },
      { tag: "Produit live · Marketplace de mentorat", blurb: "Une marketplace de mentorat à deux faces : les étudiants qui préparent des études à l'étranger réservent des mentors vérifiés déjà dans des universités du monde entier, avec sessions payantes, déblocage du contact après paiement, relecture de documents, tableau de gains et guides multi-auteurs. Construit et exploité comme notre propre produit, en expansion au-delà des études à l'étranger.", label: 'auroramentors.com' },
      { tag: 'Intelligence retail IA', blurb: "Un dashboard IA pour supermarchés et enseignes : prévision de demande avec bandes de confiance, moteur de réassort classant les SKU par jours de couverture, optimisation des prix et assistant agentique qui répond aux questions et propose l'action suivante.", label: 'Démo live' },
      { tag: 'Plateforme logistique', blurb: "Un site logistique moderne avec calculateur de coûts en temps réel (poids volumétrique, tarifs multimodaux, carburant et taxes), widget de suivi en direct et capture de leads validée. Conçu comme un site marketing orienté conversion.", label: 'Démo live' },
      { tag: 'PWA marketplace hyperlocale', blurb: "Une marketplace hyperlocale de 33 services en PWA installable : parcours de réservation multi-écrans, portfolios partenaires avec badges vérifiés et paiement wallet/escrow avec répartition 30:70 libérée par PIN client.", label: 'Démo live' },
      { tag: "Portail d'inscription et de gestion d'événements", blurb: "Une plateforme événementielle complète construite à partir d'un cahier des charges en quelques jours : inscription participant/exposant avec vrais QR codes et invitations calendrier, un portail admin séparé avec dashboard live, gestion d'agenda sans glisser-déposer, check-in QR par caméra avec détection des doublons, et exports CSV/Excel/PDF.", note: 'Démo admin : admin@solsticedynamics.com / ConnectAdmin@2026', label: 'Démo live', howTo: [
        "S'inscrire comme participant ou exposant sur la page d'accueil pour obtenir un vrai QR code scannable.",
        'Aller sur /admin et se connecter avec les identifiants de démo ci-dessus.',
        "Ouvrir QR Check-in, autoriser la caméra, et scanner le pass de l'étape 1 pour un retour instantané.",
        "Parcourir le dashboard live, les inscriptions et l'agenda, le tout appuyé sur une vraie base de données, pas une maquette statique.",
      ] },
      { tag: 'IoT · Copilote firmware IA', blurb: "Un assistant IA local qui transforme une description en langage courant en firmware ESP32 fonctionnel : il planifie le projet, génère l'architecture et le code FreeRTOS modulaire, écrit les fichiers dans un projet Arduino, compile en local et ne flashe la carte que lorsqu'un appareil est détecté en toute sécurité. Du prompt au matériel : IoT et microcontrôleurs.", note: 'En développement · démonstration privée sur demande', label: '' },
      { tag: 'Portail comptes et paiements', blurb: "Une plateforme de collecte de ferraille et de recyclage construite comme prototype fonctionnel en une journée : portail client protégé par mot de passe avec inscription, connexion et édition de profil, paiements Stripe vérifiés côté serveur, un panneau d'administration pour gérer les clients et les tickets de collecte, et un modèle de données Postgres avec sécurité au niveau des lignes pour que chaque client ne voie et ne modifie que ses propres données.", note: 'Démo client : test.buyer@scrapline-test.com / TestPass123! · Admin : demo.customer@scrapline-test.com / DemoPass123!', label: 'Démo live', howTo: [
        'Cliquez sur "Get started" pour créer votre propre compte, ou connectez-vous avec les identifiants client de démo ci-dessus.',
        'Explorez le portail client : modifiez votre profil, réservez une collecte et payez en mode test Stripe.',
        'Connectez-vous avec les identifiants admin de démo puis allez sur /admin pour gérer les clients et les tickets de collecte.',
        "La sécurité au niveau des lignes signifie qu'un client connecté ne voit et ne modifie que ses propres données, jamais celles d'un autre compte.",
      ] },
    ],
    pg: {
      eyebrow: 'Démos live', h2a: 'Donnez un travail à un agent.', h2b: 'Puis interrompez-le.',
      p1: "Voilà ce que nous construisons : une IA qui fait un vrai travail, pas du chat. Prenez un appel en direct avec un ", voice: 'agent vocal',
      p2: " qui parle, réserve et se rattrape quand vous le coupez en pleine phrase. Ou envoyez un ", ops: "agent d'opérations",
      p3: " en mission et lancez-lui un imprévu. La même boucle que nous livrons en production sur des modèles frontier, rejouée dans votre navigateur.",
      tabVoice: 'Agent vocal · appel live', tabOps: "Agent d'ops · missions", demoNote: '',
    },
    va: {
      title: 'Agent vocal', roleAgent: 'Agent', roleCaller: 'Client', cutTag: 'interrompu',
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
      skip: 'Aller au résultat →', complete: 'Mission accomplie', curveHandled: '1 imprévu géré', replayTry: "Rejouer et tenter l'imprévu", replay: 'Rejouer', addedLive: 'ajouté en direct',
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
        { t: 'Ventes et marketing IA à IA', d: "Des agents commerciaux et marketing qui présentent, qualifient et négocient directement avec l'assistant IA d'un prospect, et n'escaladent vers un humain que lorsqu'il y a un vrai contrat à signer." },
      ],
    },
    pr: {
      eyebrow: 'Notre méthode', h2a: 'Rigueur de grand cabinet.', h2b: 'Vitesse de studio.',
      p: "Premium ne veut pas dire lent, et rapide ne veut pas dire fragile. Cela veut dire : un responsable identifié, des jalons clairs et un travail que vous inspectez chaque semaine.",
      platforms: 'Construit sur des plateformes que votre entreprise connaît déjà',
    },
    trust: [
      { t: 'Direction senior, toujours', d: "Chaque projet est mené de bout en bout par un ingénieur senior, jamais délégué à des juniors. Des designers et ingénieurs spécialistes vérifiés rejoignent quand le périmètre grandit ; la capacité n'est jamais le goulot." },
      { t: 'Votre PI, entièrement à vous', d: 'Contrats propres, NDA avant tout partage sensible, et transfert complet du code source et de la PI à la livraison.' },
      { t: 'Sécurité par défaut', d: 'Accès au moindre privilège, secrets chiffrés, journaux d\'audit et gestion des données conforme RGPD sur chaque projet.' },
      { t: 'Global, async d\'abord', d: 'Clients aux États-Unis, en Europe, au Moyen-Orient et en Asie : heures de recouvrement, vidéos de démo hebdomadaires et un interlocuteur responsable unique.' },
      { t: 'Facturation au jalon', d: "Vous payez au jalon livré, jamais sur promesse. Le virement direct fonctionne très bien, ou l'escrow d'une plateforme si vous préférez : Upwork, Malt, Contra, à votre choix." },
      { t: 'Suivi après lancement', d: 'Documentation, formation de passation et 30 jours de support inclus avec chaque projet. Suivi long terme via retainer.' },
    ],
    join: {
      eyebrow: 'Rejoindre le studio', h2a: 'Nous cherchons du talent,', h2b: 'pas des CV.',
      p: "Le pipeline de projets grandit : agents vocaux, effectifs IA, apps et dashboards premium pour des clients du monde entier. Nous travaillons avec des freelances et des spécialistes, au projet, async d'abord, payés au jalon.",
      roles: [
        { t: 'AI Engineer', d: 'Agents LLM, RAG, évals' },
        { t: 'Voice AI Engineer', d: 'Pipelines STT/TTS, téléphonie' },
        { t: 'Full-Stack Engineer', d: 'React/Next, Node, Python' },
        { t: 'Mobile Engineer', d: 'Flutter, PWA' },
        { t: 'Product Designer', d: 'Interfaces premium, design systems' },
        { t: 'Automation Specialist', d: 'n8n, Make, WhatsApp API' },
        { t: 'Sales & Marketing Digital', d: 'Outbound, ads, SEO, contenu' },
      ],
      openT: 'Rien qui colle ?', openD: "Les candidatures spontanées sont bienvenues. Dites-nous ce que vous faites exceptionnellement bien et montrez une chose que vous avez créée.",
      cta: 'Postuler', note: 'Les candidatures passent par le formulaire de contact : indiquez le rôle et un lien vers votre meilleur travail.',
    },
    ab: {
      eyebrow: 'À propos', h2a: 'Un studio bâti sur', h2b: "un savoir-faire senior.",
      p1: "a-niche est un petit studio d'ingénieurs et designers senior. La même équipe responsable reste sur votre projet du lancement à la livraison, avec des spécialistes vérifiés qui rejoignent quand votre périmètre grandit et la capacité de monter en charge derrière.",
      p2: "Nos propres produits, RiDERgy (IA agentique pour la recharge VE et la gestion d'énergie) et Aurora Mentors (une marketplace de mentorat en direct), tournent chaque jour en production, là où la fiabilité ne se négocie pas. Chaque projet client est tenu au même standard, de l'architecture et l'interface jusqu'à l'API, les données et la couche d'intelligence qui rend le tout utile.",
    },
    ct: {
      eyebrow: 'Contact', h2a: 'Quelque chose qui mérite', h2b: "d'être construit ?",
      p: "Un agent vocal, un effectif IA, une plateforme complète, ou une consultation payante pour cartographier vos options. Dites-nous ce qu'il vous faut et recevez une réponse senior sous un jour.",
      name: 'Votre nom', email: 'Votre e-mail', msg: 'Que construisons-nous ?',
      phName: 'Jeanne Fondatrice', phEmail: 'jeanne@entreprise.fr', phMsg: "Un agent vocal pour l'accueil de notre clinique. Deux sites, environ 90 appels par jour…",
      consult: 'Consultations payantes disponibles : stratégie, architecture et feuilles de route IA.',
      send: 'Envoyer le message', sending: 'Envoi…',
      sentH: 'Message bien reçu.', sentP: "L'équipe examine chaque message et répond rapidement, en général sous un jour. Si c'est urgent, signalez-le aussi sur LinkedIn.",
      err: "Le formulaire n'a pas pu envoyer. Contactez-nous plutôt via LinkedIn, ci-dessous.",
      nda: 'NDA possible · Facturation au jalon · Direct ou escrow de plateforme, au choix',
    },
    consent: {
      p: "Nous utilisons des cookies d'analyse pour comprendre comment les visiteurs utilisent ce site. Aucune donnée n'est vendue ni utilisée pour la publicité.",
      accept: 'Accepter', decline: 'Refuser',
    },
  },
};

const Ctx = createContext(null);

function initialLang() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang')?.toUpperCase();
    if (LANGS.includes(fromUrl)) return fromUrl;
  } catch { /* no-op */ }
  try {
    const stored = localStorage.getItem('lang');
    if (LANGS.includes(stored)) return stored;
  } catch { /* private mode */ }
  return 'EN';
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);
  useEffect(() => {
    document.documentElement.lang = lang.toLowerCase();
    try { localStorage.setItem('lang', lang); } catch { /* private mode */ }
  }, [lang]);
  const setLang = (l) => setLangState(l);
  return <Ctx.Provider value={{ lang, setLang, s: STR[lang] }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
