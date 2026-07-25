/* Insights: French. Mirrors articles.en.js block for block. */

export default {
  'why-ai-fails': {
    blocks: [
      { t: 'p', v: "Presque toutes les entreprises avec qui nous parlons ont déjà essayé l'IA. Un pilote, un chatbot, un abonnement pour toute l'équipe. Un nombre surprenant n'a rien à montrer : aucune heure économisée qu'elles puissent désigner, aucune ligne de coût qui ait bougé, aucun client qui l'ait remarqué. Ensuite s'installe la conclusion que l'IA est surestimée." },
      { t: 'p', v: "Ce n'est pas le modèle. Les systèmes disponibles aujourd'hui sont bien meilleurs que le travail que la plupart des entreprises leur demandent. Les échecs sont presque toujours les six mêmes, et chacun se corrige." },

      { t: 'h', v: "1. Vous avez acheté un chatbot alors qu'il vous fallait du travail terminé" },
      { t: 'p', v: "Un chatbot répond. Un agent termine. La différence compte parce qu'une entreprise ne manque pas de réponses : elle a un arriéré de travail inachevé. Des appels non rappelés, des devis non envoyés, des factures non relancées, des tickets non triés. Si votre IA produit du texte sur lequel un humain doit ensuite agir, vous avez ajouté une étape, pas supprimé une." },
      { t: 'p', v: "La solution est de définir le livrable avant l'outil. Pas « un assistant IA pour l'équipe commerciale », mais « chaque demande entrante reçoit une réponse qualifiée et un créneau réservé en moins de quatre minutes, à toute heure ». Cette phrase est vérifiable. « Assistant IA » ne l'est pas." },

      { t: 'h', v: "2. Elle ne touche pas aux systèmes où le travail se fait vraiment" },
      { t: 'p', v: "Une IA qui ne peut pas écrire dans votre CRM, votre agenda, votre base de données ou votre standard téléphonique est un générateur de suggestions. Presque toute la valeur de l'automatisation se situe du côté écriture, et c'est précisément le côté que la plupart des pilotes évitent, parce qu'il demande une vraie intégration, de vraies permissions et un plan de retour arrière." },
      { t: 'p', v: "C'est la plus grande ligne de partage que nous observons entre les projets qui meurent en silence et ceux qui sont reconduits. Une IA en lecture seule est une démo. Une IA avec un accès en écriture restreint, une piste d'audit et une validation humaine là où l'enjeu le justifie est une collègue." },

      { t: 'h', v: "3. Personne n'a défini ce que « ça marche » veut dire" },
      { t: 'p', v: "Demandez à une équipe comment s'est passé son pilote IA et vous obtiendrez des impressions. Ça avait l'air utile. Une fois ça s'est trompé. Quelqu'un aux opérations n'a pas aimé." },
      { t: 'p', v: "On ne pilote pas ce qu'on n'a jamais mesuré. Avant toute mise en production, relevez la référence : combien de minutes par ticket aujourd'hui, quelle part des appels est réellement décrochée, combien de temps entre un prospect et la première réponse, et ce que chacun de ces éléments coûte en coût complet. Fixez ensuite la barre que l'agent doit passer, et constituez un petit jeu d'évaluation de cas réels aux résultats connus, pour distinguer une régression d'un coup de malchance." },
      { t: 'quote', v: "Une seule hallucination tue un projet qui n'avait pas de chiffres. Sur un projet qui en a, ce n'est qu'un rapport de bug." },

      { t: 'h', v: '4. Le pilote était conçu pour ne jamais se terminer' },
      { t: 'p', v: "Les pilotes qui tournent sur des données synthétiques, dans un bac à sable, sans responsable et sans date de fin, sont une façon d'avoir l'air occupé sans rien décider. Six mois plus tard, l'outillage a évolué, le porteur interne a changé de poste, et le travail repart de zéro." },
      { t: 'p', v: "Donnez-lui plutôt une tranche réelle. Une équipe, un processus, des données réelles, des clients réels, quatre à six semaines, et une décision à la fin : on continue ou on arrête. Une chose étroite en production apprend plus en deux semaines qu'une chose large en préproduction en deux trimestres." },

      { t: 'h', v: '5. Vous avez automatisé un processus déjà cassé' },
      { t: 'p', v: "L'IA est un amplificateur. Pointez-la sur un processus aux responsabilités floues, avec trois sources de vérité et une pile d'exceptions non documentées, et vous obtiendrez des réponses fausses plus vite et à grande échelle. Le désordre était absorbé par le jugement humain, et automatiser le processus est exactement ce qui retire ce jugement." },
      { t: 'p', v: "Quand un processus est réellement cassé, réparez d'abord le processus ou choisissez-en un autre. Il y a presque toujours à côté un processus plus propre, plus coûteux et plus répétitif qui aurait de toute façon été la meilleure première cible." },

      { t: 'h', v: "6. Le travail de personne n'est devenu plus simple, donc personne ne l'a utilisé" },
      { t: 'p', v: "L'adoption n'est pas un problème de formation. Les gens utilisent un outil quand il leur retire un travail qu'ils détestent, et l'ignorent poliment quand il ajoute une étape de relecture à un travail qu'ils faisaient déjà bien. Si votre agent a besoin d'une vérification humaine à chaque fois, vous avez recruté un stagiaire et confié la supervision à votre collaborateur le plus cher." },
      { t: 'p', v: "Visez pour le premier chantier le travail que votre équipe déteste activement : les appels hors horaires, la saisie de données, le tri de premier niveau, la course aux documents. L'adoption se règle d'elle-même quand l'alternative est pire." },

      { t: 'h', v: 'À quoi ressemblent ceux qui fonctionnent' },
      { t: 'p', v: 'Les projets qui se remboursent sont peu spectaculaires, et ils ont tous la même forme :' },
      { t: 'ol', v: [
        'Un processus, choisi parce qu\'il est coûteux, répétitif et mesurable.',
        'Un chiffre de référence relevé avant que quoi que ce soit ne soit construit.',
        "Un accès en écriture aux vrais systèmes, strictement délimité, avec une piste d'audit.",
        "Un chemin d'échec défini : ce que fait l'agent quand il doute, et vers qui il escalade.",
        'En production avec de vrais utilisateurs en quelques semaines, pas une démo retenue pendant des trimestres.',
        "Un responsable unique, avec l'autorité de tout arrêter.",
      ] },
      { t: 'p', v: "Rien de tout cela ne parle vraiment d'IA. C'est de la discipline de livraison ordinaire, appliquée à une technologie que beaucoup continuent de traiter comme une exception à cette discipline. C'est la vraie raison pour laquelle la plupart des entreprises n'obtiennent rien." },
    ],
  },

  'ai-advantage': {
    blocks: [
      { t: 'p', v: "Il existe un argument confortable en faveur de l'attente. Les outils changent chaque mois, les prix continuent de baisser, et l'intégration astucieuse d'aujourd'hui sera la case à cocher de l'an prochain. Laissons quelqu'un d'autre payer l'apprentissage, puis adoptons la version mûre. Pour la plupart des technologies, cet argument était juste." },
      { t: 'p', v: "Ici il est faux, et la raison est précise : presque rien de l'avantage ne se trouve dans le modèle." },

      { t: 'h', v: "Le modèle est la partie qu'on peut acheter plus tard. Le reste, non." },
      { t: 'p', v: "Un modèle de pointe est une marchandise, et de surcroît louée. Votre concurrent peut s'abonner demain au même modèle, au même prix que vous. Ce à quoi il ne peut pas s'abonner, le jour où il décide de commencer, c'est à tout ceci :" },
      { t: 'ul', v: [
        "Des processus déjà remodelés autour de ce qu'un agent sait réellement faire.",
        "Des données propres, structurées et accessibles, parce que deux ans de travail sur l'IA ont imposé le rangement.",
        "Des jeux d'évaluation et des garde-fous bâtis à partir de vraies défaillances en production.",
        "Une équipe qui sait d'expérience où cela fonctionne et où cela ne fonctionne pas.",
        'Des clients déjà habitués à vos délais de réponse.',
      ] },
      { t: 'p', v: "Chacun de ces points a coûté du temps de calendrier, pas du budget. C'est ce qui fait que l'écart se creuse au lieu de se refermer." },

      { t: 'h', v: "L'écart apparaît dans les coûts unitaires, pas dans les communiqués de presse" },
      { t: 'p', v: "Une fois le vocabulaire retiré, bien adopter l'IA fait une seule chose : cela abaisse le coût marginal d'une opération, souvent beaucoup, et cela supprime la file d'attente." },
      { t: 'p', v: "Un concurrent dont l'accueil décroche chaque appel à deux heures du matin, dont les devis partent en quatre-vingt-dix secondes au lieu de deux jours, et dont le support coûte une fraction par ticket, ne gagne pas grâce à la technologie. Il gagne parce qu'il peut désormais dire oui à des travaux que vous devez refuser, et les facturer moins cher." },
      { t: 'p', v: "Vous ne verrez pas cela sous forme d'annonce. Vous le verrez comme une baisse lente et inexpliquée de votre taux de conversion." },
      { t: 'quote', v: "Personne ne perd face à l'IA. On perd face à un concurrent dont le délai de réponse est passé de deux jours à deux minutes." },

      { t: 'h', v: "Attendre a un prix, et il se mesure" },
      { t: 'p', v: "La façon honnête de poser la question n'est pas « faut-il faire de l'IA ». C'est de l'arithmétique. Prenez un processus. Comptez ce qu'il coûte aujourd'hui : heures, salaires, taux d'erreur, affaires perdues pour cause de lenteur. Multipliez par le nombre de trimestres que vous comptez attendre. Voilà la facture de la décision d'attendre, et elle dépasse généralement le coût du chantier." },
      { t: 'p', v: "Ajoutez ensuite la partie qui n'arrive jamais sur la facture : les changements de processus, les recrutements et le travail sur les données que vous ferez plus tard dans l'urgence, pendant qu'un concurrent les a faits calmement maintenant." },

      { t: 'h', v: "Être en avance ne veut pas dire être imprudent" },
      { t: 'p', v: "Être en avance ne veut pas dire refaire l'entreprise autour d'un chatbot ni signer un contrat de plateforme à sept chiffres. En pratique, cela veut dire :" },
      { t: 'ol', v: [
        'Choisir un processus par trimestre et le livrer pour de bon.',
        "Garder la couche modèle interchangeable, parce qu'elle sera changée.",
        "Être propriétaire de vos données, de vos prompts et de vos jeux d'évaluation, quel qu'en soit le constructeur.",
        'Bâtir une connaissance interne, pas seulement une relation fournisseur.',
        'Accepter de couper vite et sans drame ce qui ne fonctionne pas.',
      ] },
      { t: 'p', v: "C'est un programme modeste et peu spectaculaire. Tenu deux ans, il produit quelque chose qu'un concurrent ne rattrape pas en signant un chèque, ce qui est tout l'intérêt." },

      { t: 'h', v: "La fenêtre est plus étroite qu'elle n'en a l'air" },
      { t: 'p', v: "Les capacités se banalisent vite, et certains y lisent une raison de se détendre. C'est l'inverse. Quand tout le monde dispose des mêmes modèles, la différence se déplace entièrement vers l'intégration, les processus propres et les données propres, et ce sont précisément les parties lentes à construire. L'avantage offert à une entreprise qui démarre maintenant n'est pas un meilleur modèle que celui de ses concurrents. Ce sont deux ans d'avance sur tout ce à quoi le modèle se branche." },
    ],
  },
};
