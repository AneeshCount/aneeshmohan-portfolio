/* ════════════════════════════════════════════════════════════════════════
   INSIGHTS METADATA: everything needed to *advertise* an article, in all
   four languages. Deliberately separate from the article bodies so the
   homepage teaser can import this without pulling ~45kB of prose into the
   main bundle; only /insights loads articles.<lang>.js.

   Headlines sit side by side across languages here on purpose: it is the
   one place where a translation drifting in tone is easy to spot.
   Editorial rule: no em dashes, en dashes or minus signs, any language.
   ════════════════════════════════════════════════════════════════════════ */

export const ARTICLE_IDS = ['why-ai-fails', 'ai-advantage'];

/* Language-independent facts: dates and read time do not translate. */
export const ARTICLE_META = {
  'why-ai-fails': { date: '2026-07-20', readMins: 7 },
  'ai-advantage': { date: '2026-07-24', readMins: 6 },
};

export const PREVIEWS = {
  EN: {
    'why-ai-fails': {
      tag: 'Adoption',
      title: 'Why most companies get nothing back from AI',
      deck: 'Model quality stopped being the bottleneck a while ago. Here are the six reasons the pilot never turned into a line on the P&L, and what the projects that pay for themselves do differently.',
    },
    'ai-advantage': {
      tag: 'Strategy',
      title: 'The compounding cost of being late to AI',
      deck: 'Being ahead is not about buying the newest model. It is about the two years of process, data and fluency that your competitor cannot buy later at any price.',
    },
  },
  DE: {
    'why-ai-fails': {
      tag: 'Einführung',
      title: 'Warum die meisten Unternehmen nichts aus KI herausholen',
      deck: 'Die Modellqualität ist schon länger nicht mehr der Engpass. Hier sind die sechs Gründe, warum aus dem Pilotprojekt nie eine Zeile in der Gewinn- und Verlustrechnung wurde, und was Projekte anders machen, die sich rechnen.',
    },
    'ai-advantage': {
      tag: 'Strategie',
      title: 'Was es kostet, bei KI zu spät zu kommen',
      deck: 'Vorn zu sein heißt nicht, das neueste Modell zu kaufen. Es geht um die zwei Jahre an Prozessen, Daten und Routine, die Ihr Wettbewerber später zu keinem Preis nachkaufen kann.',
    },
  },
  ES: {
    'why-ai-fails': {
      tag: 'Adopción',
      title: 'Por qué la mayoría de las empresas no obtienen resultados con la IA',
      deck: 'La calidad del modelo dejó de ser el cuello de botella hace tiempo. Estas son las seis razones por las que el piloto nunca se convirtió en una línea de la cuenta de resultados, y qué hacen distinto los proyectos que sí se pagan solos.',
    },
    'ai-advantage': {
      tag: 'Estrategia',
      title: 'El coste acumulado de llegar tarde a la IA',
      deck: 'Ir por delante no consiste en comprar el modelo más nuevo. Consiste en los dos años de procesos, datos y soltura que tu competencia no podrá comprar después a ningún precio.',
    },
  },
  FR: {
    'why-ai-fails': {
      tag: 'Adoption',
      title: "Pourquoi la plupart des entreprises n'obtiennent rien de l'IA",
      deck: "La qualité des modèles n'est plus le goulot d'étranglement depuis un moment. Voici les six raisons pour lesquelles le pilote n'est jamais devenu une ligne du compte de résultat, et ce que font différemment les projets qui se remboursent.",
    },
    'ai-advantage': {
      tag: 'Stratégie',
      title: "Ce que coûte le retard sur l'IA",
      deck: "Être en avance ne consiste pas à acheter le dernier modèle. Il s'agit des deux années de processus, de données et d'aisance que votre concurrent ne pourra racheter plus tard à aucun prix.",
    },
  },
};

/* UI chrome for the reader and the homepage teaser. */
export const INSIGHTS_UI = {
  EN: {
    eyebrow: 'Insights', kicker: 'Notes from shipping AI into production',
    intro: 'Field notes from building and running AI in production, written for the people who have to sign off on it.',
    minRead: 'min read', back: '← All insights', backHome: '← a-niche', next: 'Read next',
    ctaH: 'Want a second opinion on your AI plan?',
    ctaP: 'A fixed-fee audit maps the highest-ROI automations in your operation, with a costed roadmap. The fee is credited against your first build.',
    ctaBtn: 'Start a conversation →',
    homeEyebrow: 'Insights', homeH2a: 'What we have learned', homeH2b: 'shipping this for real.',
    homeP: 'Long-form notes on why AI projects fail, and what a two-year head start actually buys you.',
    homeCta: 'Read the insights →', read: 'Read →', latest: 'New',
  },
  DE: {
    eyebrow: 'Insights', kicker: 'Notizen aus dem Produktivbetrieb von KI',
    intro: 'Praxisnotizen aus dem Bauen und Betreiben von KI in Produktion, geschrieben für die Menschen, die es am Ende freigeben müssen.',
    minRead: 'Min. Lesezeit', back: '← Alle Insights', backHome: '← a-niche', next: 'Weiterlesen',
    ctaH: 'Eine zweite Meinung zu Ihrem KI-Vorhaben?',
    ctaP: 'Ein Audit zum Festpreis kartiert die Automationen mit dem höchsten ROI in Ihrem Betrieb, mit kalkulierter Roadmap. Die Gebühr wird auf Ihren ersten Build angerechnet.',
    ctaBtn: 'Gespräch starten →',
    homeEyebrow: 'Insights', homeH2a: 'Was wir gelernt haben,', homeH2b: 'als wir es wirklich gebaut haben.',
    homeP: 'Ausführliche Notizen dazu, warum KI-Projekte scheitern und was zwei Jahre Vorsprung tatsächlich einbringen.',
    homeCta: 'Insights lesen →', read: 'Lesen →', latest: 'Neu',
  },
  ES: {
    eyebrow: 'Insights', kicker: 'Notas de llevar IA a producción',
    intro: 'Notas de campo sobre construir y operar IA en producción, escritas para quienes tienen que dar el visto bueno.',
    minRead: 'min de lectura', back: '← Todos los insights', backHome: '← a-niche', next: 'Sigue leyendo',
    ctaH: '¿Quieres una segunda opinión sobre tu plan de IA?',
    ctaP: 'Una auditoría a precio fijo mapea las automatizaciones de mayor ROI en tu operación, con una hoja de ruta costeada. El importe se descuenta de tu primer proyecto.',
    ctaBtn: 'Empezar una conversación →',
    homeEyebrow: 'Insights', homeH2a: 'Lo que hemos aprendido', homeH2b: 'construyéndolo de verdad.',
    homeP: 'Notas extensas sobre por qué fracasan los proyectos de IA y qué compra realmente una ventaja de dos años.',
    homeCta: 'Leer los insights →', read: 'Leer →', latest: 'Nuevo',
  },
  FR: {
    eyebrow: 'Insights', kicker: "Notes de mise en production de l'IA",
    intro: "Notes de terrain sur la construction et l'exploitation de l'IA en production, écrites pour celles et ceux qui doivent la valider.",
    minRead: 'min de lecture', back: '← Tous les insights', backHome: '← a-niche', next: 'À lire ensuite',
    ctaH: 'Un deuxième avis sur votre plan IA ?',
    ctaP: "Un audit à prix fixe cartographie les automatisations au meilleur ROI dans votre organisation, avec une feuille de route chiffrée. Les frais sont déduits de votre premier chantier.",
    ctaBtn: 'Démarrer une conversation →',
    homeEyebrow: 'Insights', homeH2a: 'Ce que nous avons appris', homeH2b: 'en le construisant pour de vrai.',
    homeP: "Des notes longues sur les raisons de l'échec des projets IA, et sur ce que deux ans d'avance rapportent vraiment.",
    homeCta: 'Lire les insights →', read: 'Lire →', latest: 'Nouveau',
  },
};

export const uiFor = (lang) => INSIGHTS_UI[lang] ?? INSIGHTS_UI.EN;

/* Teaser-sized article records: metadata only, no bodies. */
export function getPreviews(lang) {
  const copy = PREVIEWS[lang] ?? PREVIEWS.EN;
  return ARTICLE_IDS.map((id) => ({ id, ...ARTICLE_META[id], ...copy[id] }));
}
