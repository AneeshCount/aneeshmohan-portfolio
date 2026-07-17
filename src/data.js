export const PROJECTS = [
  {
    name: 'RiDERgy',
    tag: 'Flagship · Agentic AI',
    blurb: 'An EV charging and energy-management SaaS built from the ground up. Agentic watchdogs continuously monitor chargers, batteries and solar, while an LLM chat layer lets users control the system in plain language: start a vehicle charging, shift load to solar, or push a schedule, and the agents execute.',
    tech: ['Agentic AI', 'LangGraph', 'LLMs', 'FastAPI', 'React', 'AWS'],
    link: 'https://demo.ridergy.com',
    linkLabel: 'demo.ridergy.com',
    note: 'Proprietary codebase · live demo shows full functionality',
    accent: 'from-violet-500 to-fuchsia-500',
  },
  {
    name: 'Aurora Mentors',
    tag: 'Live Product · Mentorship Marketplace',
    blurb: 'A two-sided mentorship marketplace: students planning to study abroad book verified mentors already at universities worldwide.',
    tech: ['Next.js 14', 'Supabase', 'NextAuth', 'Razorpay', 'Marketplace'],
    link: 'https://auroramentors.com',
    linkLabel: 'auroramentors.com',
    accent: 'from-amber-400 to-rose-500',
  },
  {
    name: 'RetailMind',
    tag: 'AI Retail Intelligence',
    blurb: 'An AI dashboard for supermarkets and chains: demand forecasting with confidence bands, an AI reorder engine ranking SKUs by days-of-cover, price-optimization recommendations, and an agentic insights assistant that answers questions and proposes the next action.',
    tech: ['React', 'AI Agent', 'Forecasting', 'Tailwind'],
    link: 'https://retailmind-demo.vercel.app/',
    linkLabel: 'Live demo',
    accent: 'from-indigo-500 to-cyan-500',
  },
  {
    name: 'CargoLink',
    tag: 'Logistics Platform',
    blurb: 'A modern logistics company site with a real-time shipment cost calculator (volumetric weight, multi-mode pricing, fuel and GST), a live tracking widget, and a validated lead-capture flow. Built as a conversion-focused marketing site.',
    tech: ['React', 'Tailwind', 'Node', 'Calculator'],
    link: 'https://aneeshcount.github.io/cargolink-logistics-demo/',
    linkLabel: 'Live demo',
    accent: 'from-sky-500 to-emerald-500',
  },
  {
    name: 'Daksh Sathi',
    tag: 'Hyperlocal Marketplace PWA',
    blurb: 'A 33-service hyperlocal marketplace as an installable PWA: a multi-screen booking flow, masonry partner portfolios with verified badges, and a wallet and escrow payment model with a 30:70 split released by customer PIN.',
    tech: ['React PWA', 'Wallet/Escrow', 'Tailwind', 'PostgreSQL'],
    link: 'https://daksh-sathi-demo.vercel.app/',
    linkLabel: 'Live demo',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Solstice CONNECT',
    tag: 'Event Registration & Management Portal',
    blurb: 'A full event platform built from an SRS in days: dual participant/exhibitor registration with real QR passes and calendar invites, a separate admin portal with a live dashboard, drag-free agenda management, camera-based QR check-in with duplicate detection, and CSV/Excel/PDF exports.',
    tech: ['Next.js', 'Prisma', 'PostgreSQL', 'QR/Camera', 'Admin Portal'],
    link: 'https://solstice-connect.vercel.app',
    linkLabel: 'Live demo',
    note: 'Admin demo: admin@solsticedynamics.com / ConnectAdmin@2026',
    howTo: [
      'Register as a participant or exhibitor on the homepage to get a real, scannable QR pass.',
      'Go to /admin and log in with the demo credentials above.',
      'Open QR Check-in, allow camera access, and scan the pass from step 1 for instant check-in feedback.',
      'Browse the live dashboard, registrations, and agenda, all backed by a real database, not a static mockup.',
    ],
    accent: 'from-blue-500 to-orange-500',
  },
  {
    name: 'ESPAI',
    tag: 'IoT · AI Firmware Copilot',
    blurb: 'A local AI assistant that turns a plain-language description into working ESP32 firmware: planning, architecture, modular FreeRTOS code, local build and a safe flash flow.',
    tech: ['ESP32', 'FreeRTOS', 'Arduino', 'FastAPI', 'React', 'LLMs'],
    link: null,
    linkLabel: '',
    note: 'In development · private walkthrough on request',
    accent: 'from-orange-500 to-amber-500',
  },
  {
    name: 'ScrapLine',
    tag: 'Account & Payments Portal',
    blurb: 'A scrap and recycling pickup platform built as a working prototype in a day: a password-protected customer portal with registration, login and profile editing, Stripe payments verified server-side, an admin panel for managing customers and pickup tickets, and a Postgres data model with row-level security so customers only ever see and edit their own records.',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'Stripe', 'RLS'],
    link: 'https://scrapline-mvp.vercel.app',
    linkLabel: 'Live demo',
    note: 'Customer demo: test.buyer@scrapline-test.com / TestPass123! · Admin: demo.customer@scrapline-test.com / DemoPass123!',
    howTo: [
      'Click "Get started" to register your own account, or sign in with the seeded customer login above.',
      'Browse the customer portal: edit your profile, book a pickup, and pay with Stripe in test mode.',
      'Sign in with the seeded admin login, then go to /admin to manage customers and pickup tickets.',
      'Row-level security means a signed-in customer only ever sees and edits their own data, never another account\'s.',
    ],
    accent: 'from-teal-400 to-lime-500',
  },
  {
    name: 'Meridian',
    tag: 'RBAC Business Dashboard',
    blurb: 'A role-based business dashboard proving out a Laravel + jQuery stack end to end: session-based auth with three enforced roles, live AJAX KPI dashboards with filtering, charting and CSV export, and a swappable payment-gateway service, sandbox today, real Stripe with a one-line config change.',
    tech: ['Laravel', 'jQuery', 'RBAC', 'Chart.js', 'Stripe'],
    link: 'https://bizplatform-poc.onrender.com',
    linkLabel: 'Live demo',
    note: 'Demo logins (password: password): admin@demo.test · editor@demo.test · viewer@demo.test · free-tier hosting, first load after idle can take 20-30s',
    howTo: [
      'Log in as admin@demo.test to see the full RBAC-gated experience, including User Management.',
      'Filter the KPI dashboard by category, region and date range, all AJAX, no page reloads.',
      'Download the filtered KPI data as CSV straight from the dashboard.',
      'Try a test payment with pm_card_visa (succeeds) or pm_card_decline (fails), handled by a sandbox gateway with no external calls.',
    ],
    accent: 'from-cyan-600 to-sky-500',
  },
  {
    name: 'Collections Portal',
    tag: 'Field Collections App',
    blurb: 'A field-collections app built for a client outreach: employees log in, pick a collection mode, and log an amount that saves instantly to a real database, each person only ever seeing their own entries. Built on Vercel and Supabase so it runs on real data, not a mockup.',
    tech: ['Next.js', 'Supabase', 'RLS', 'Field Ops'],
    link: 'https://collections-portal-pi.vercel.app/demo?passkey=bqsM2C5Qnkch',
    linkLabel: 'Live demo (auto login)',
    note: 'Demo link logs you straight in with a passkey, no signup needed',
    accent: 'from-lime-500 to-green-600',
  },
  {
    name: 'Smart Money Dashboard',
    tag: 'Crypto Analytics Prototype',
    blurb: 'A dashboard tracking a public Binance Futures "Smart Money" trader profile: ROI, PnL, margin balance, win rate, drawdown and net transfer, refreshed daily by a scheduled scraper and stored in Supabase. Built after reverse-engineering the target\'s network traffic to confirm which stats are public versus login-gated.',
    tech: ['Python', 'FastAPI', 'Vercel Cron', 'Supabase'],
    link: 'https://smart-money-dashboard-prototype.vercel.app',
    linkLabel: 'Live demo',
    accent: 'from-yellow-500 to-orange-600',
  },
  {
    name: 'Treasure Hunt',
    tag: 'Live City Treasure Hunt PWA',
    blurb: 'A mobile-first PWA for running live, time-based city treasure hunt events: team leaders register with an event code, teams solve location-based clues about real places, and prove they found each spot via GPS, photo or an answer code before the next stop unlocks, all tracked on a live shared leaderboard.',
    tech: ['Next.js PWA', 'Supabase Realtime', 'Leaflet/GPS'],
    link: null,
    linkLabel: '',
    note: 'In development · private walkthrough on request',
    accent: 'from-fuchsia-500 to-purple-600',
  },
  {
    name: 'Giftr',
    tag: 'AI Gifting Platform',
    blurb: 'A premium gifting platform: create a universal wishlist, share one link or QR code anywhere, and let anyone gift you, either by buying an item directly or sending cash that Giftr\'s AI converts into the best possible gift across vendors, purchased and shipped automatically, with the recipient\'s address never revealed to givers.',
    tech: ['Next.js', 'Prisma', 'PostgreSQL', 'AI Agent'],
    link: null,
    linkLabel: '',
    note: 'In development · private walkthrough on request',
    accent: 'from-pink-500 to-rose-400',
  },
  {
    name: 'ResumeSearch',
    tag: 'AI Recruiting Platform',
    blurb: 'An internal recruiting platform: upload or email-intake resumes, auto-tag them by industry, function and seniority, then search or ask natural-language questions across the whole candidate pool using RAG over embedded resume data. Works fully offline with a tagging fallback when no LLM key is configured.',
    tech: ['FastAPI', 'PostgreSQL', 'pgvector', 'Celery', 'Claude API'],
    link: null,
    linkLabel: '',
    note: 'In development · private walkthrough on request',
    accent: 'from-blue-600 to-indigo-500',
  },
  {
    name: 'Reseller Panel',
    tag: 'RBAC Wallet & Payments Portal',
    blurb: 'A dependency-free reseller storefront panel: client and admin dashboards, a wallet system with manual QR-based top-ups and admin-approved credit, a pluggable upstream-provider API for auto-fulfilment, and a token-based password reset flow, all on a plain PHP/MySQL stack built to run on ordinary shared hosting.',
    tech: ['PHP', 'MySQL', 'Wallet/Escrow', 'RBAC'],
    link: null,
    linkLabel: '',
    note: 'In development · private walkthrough on request',
    accent: 'from-slate-500 to-zinc-600',
  },
  {
    name: 'Nmap Pro',
    tag: 'Network Scanning Dashboard',
    blurb: 'A browser dashboard that wraps the real nmap binary: enter targets, pick TCP SYN, TCP Connect or UDP scans, watch progress live, then search, sort and export results as CSV or JSON. Runs locally against your own network, since scanning needs a real network-facing host and often root privileges.',
    tech: ['Node.js', 'Nmap', 'Docker', 'Self-hosted'],
    link: null,
    linkLabel: '',
    note: 'Self-hosted tool · runs against your own network, private walkthrough on request',
    accent: 'from-emerald-600 to-teal-700',
  },
];

export const METRICS = [
  { n: '0→1', l: 'Products shipped from scratch' },
  { n: 'Live', l: 'Agentic AI in production' },
  { n: 'Global', l: 'Async delivery across timezones' },
];

export const SKILLS = [
  { group: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'Flutter', 'PWAs'] },
  { group: 'Backend', items: ['Node.js / Express', 'Python / FastAPI', 'REST APIs', 'WebSockets'] },
  { group: 'AI / Agents', items: ['LLMs (Claude, GPT, Gemini)', 'LangChain / LangGraph', 'Agentic workflows', 'Voice agents (STT · TTS · telephony)', 'RAG + pgvector'] },
  { group: 'Infra / Ops', items: ['PostgreSQL', 'Redis', 'AWS', 'Docker', 'CI/CD', 'Nginx / VPS', 'IoT (ESP32 · MQTT · FreeRTOS)'] },
];

export const SERVICES = [
  {
    t: 'Voice agents',
    d: 'AI receptionists and outbound callers that answer, qualify, book and follow up, around the clock, in any language.',
    eg: 'Live demo: take a call below',
  },
  {
    t: 'AI agents & automations',
    d: 'Agents that run real operations: triage, reporting, follow-ups, back-office flows that execute themselves.',
    eg: 'Live demo: run the ops agent below',
  },
  {
    t: 'WhatsApp & support AI',
    d: 'Assistants on WhatsApp and your site that sell, support and answer from your own documents, with clean human handoff.',
    eg: 'RAG over your prices, policies, FAQs',
  },
  {
    t: 'Web & mobile apps',
    d: 'Secure, fully integrated full-stack apps: auth, payments, admin panels, APIs, installable on any phone.',
    eg: 'Daksh Sathi: 33-service marketplace PWA',
  },
  {
    t: 'SaaS & MVPs',
    d: 'Blank page to paying users: multi-tenant products with billing, infra and CI, shipped in weeks.',
    eg: 'RiDERgy: production energy SaaS',
  },
  {
    t: 'Dashboards & analytics',
    d: 'Forecasting, AI insights and reporting that executives actually read and act on.',
    eg: 'RetailMind: AI retail intelligence',
  },
  {
    t: 'Integrations & internal tools',
    d: 'Your CRM, calendar, inbox and telephony stitched into one system that updates itself.',
    eg: 'n8n · Zapier · MCP · WhatsApp API',
  },
  {
    t: 'Websites that sell',
    d: 'Conversion-focused marketing sites with calculators, lead capture and clean SEO.',
    eg: 'CargoLink: logistics site + quote engine',
  },
];

export const TRUST = [
  {
    t: 'Senior-led, always',
    d: 'Every project is led end to end by a senior engineer, never handed off to juniors. Vetted specialist designers and engineers join as your scope grows, so capacity is never the bottleneck.',
  },
  {
    t: 'Your IP, fully yours',
    d: 'Clean contracts, NDA before you share anything sensitive, and full source code and IP transfer on completion.',
  },
  {
    t: 'Security by default',
    d: 'Least-privilege access, encrypted secrets, audit trails and GDPR-aware data handling on every build.',
  },
  {
    t: 'Global, async-first',
    d: 'Clients across US, EU, Middle East and Asia get overlap hours, weekly demo videos and one accountable point of contact.',
  },
  {
    t: 'Milestone billing',
    d: 'Pay per shipped milestone, never for promises. Escrow-friendly: direct, Upwork or Freelancer, whichever protects you best.',
  },
  {
    t: 'Supported after launch',
    d: 'Documentation, handover training and 30 days of included support with every build. Long-term care via retainers.',
  },
];

export const PLATFORMS = [
  'AWS', 'Google Cloud', 'Anthropic Claude', 'OpenAI', 'ElevenLabs', 'Deepgram',
  'Twilio', 'WhatsApp Business', 'Stripe', 'Razorpay', 'Supabase', 'PostgreSQL', 'Vercel', 'Docker',
];

export const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aneeshmohan3', handle: 'aneeshmohan3' },
  { label: 'X', href: 'https://x.com/aniche03', handle: '@aniche03' },
];
