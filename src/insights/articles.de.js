/* Insights: German. Mirrors articles.en.js block for block. */

export default {
  'why-ai-fails': {
    blocks: [
      { t: 'p', v: 'Fast jedes Unternehmen, mit dem wir sprechen, hat KI bereits ausprobiert. Ein Pilot, ein Chatbot, ein Abo für das ganze Team. Erstaunlich viele haben nichts vorzuweisen: keine eingesparten Stunden, auf die sie zeigen könnten, keine Kostenposition, die sich bewegt hat, keinen Kunden, dem es aufgefallen wäre. Danach setzt sich die Überzeugung fest, KI sei überschätzt.' },
      { t: 'p', v: 'Es liegt nicht am Modell. Die heute verfügbaren Systeme sind deutlich besser als die Aufgaben, die die meisten Unternehmen ihnen stellen. Es sind fast immer dieselben sechs Fehler, und jeder davon ist behebbar.' },

      { t: 'h', v: '1. Sie haben einen Chatbot gekauft, gebraucht hätten Sie erledigte Arbeit' },
      { t: 'p', v: 'Ein Chatbot antwortet. Ein Agent bringt zu Ende. Der Unterschied zählt, weil einem Unternehmen keine Antworten fehlen, sondern weil es einen Stau unerledigter Arbeit hat: nicht zurückgerufene Anrufe, nicht verschickte Angebote, nicht nachgefasste Rechnungen, nicht sortierte Tickets. Wenn Ihre KI Text produziert, auf den ein Mensch danach reagieren muss, haben Sie einen Schritt hinzugefügt, keinen entfernt.' },
      { t: 'p', v: 'Die Lösung: das Ergebnis vor dem Werkzeug definieren. Nicht "ein KI-Assistent für den Vertrieb", sondern "jede eingehende Anfrage bekommt zu jeder Uhrzeit innerhalb von vier Minuten eine qualifizierte Antwort und einen gebuchten Termin". Dieser Satz ist prüfbar. "KI-Assistent" ist es nicht.' },

      { t: 'h', v: '2. Sie kommt nicht an die Systeme heran, in denen die Arbeit wirklich passiert' },
      { t: 'p', v: 'Eine KI, die nicht in Ihr CRM, Ihren Kalender, Ihre Datenbank oder Ihre Telefonanlage schreiben kann, ist ein Vorschlagsautomat. Nahezu der gesamte Wert der Automatisierung liegt auf der Schreibseite, und genau diese Seite lassen die meisten Piloten aus, weil sie echte Integrationsarbeit, echte Berechtigungen und einen Rollback-Plan verlangt.' },
      { t: 'p', v: 'Das ist die größte Trennlinie, die wir zwischen Projekten sehen, die still sterben, und Projekten, die verlängert werden. Nur-Lese-KI ist eine Demo. KI mit eng gefasstem Schreibzugriff, Audit-Trail und einem menschlichen Freigabeschritt dort, wo das Risiko ihn rechtfertigt, ist eine Kollegin.' },

      { t: 'h', v: '3. Niemand hat definiert, was "funktioniert" heißt' },
      { t: 'p', v: 'Fragen Sie ein Team, wie der KI-Pilot gelaufen ist, und Sie bekommen Eindrücke. Es fühlte sich nützlich an. Einmal lag es falsch. Jemand aus dem Betrieb fand es nicht gut.' },
      { t: 'p', v: 'Man kann nicht steuern, was man nie gemessen hat. Bevor irgendetwas live geht: die Ausgangswerte erfassen. Wie viele Minuten pro Ticket heute, welcher Anteil der Anrufe tatsächlich angenommen wird, wie lange es vom Lead bis zur ersten Antwort dauert und was das jeweils vollkostenmäßig kostet. Dann die Latte setzen, die der Agent überspringen muss, und ein kleines Prüfset echter Fälle mit bekannten Sollergebnissen aufbauen, damit Sie eine Verschlechterung von Pech unterscheiden können.' },
      { t: 'quote', v: 'Eine einzige Halluzination erledigt ein Projekt, das keine Zahlen hatte. In einem Projekt mit Zahlen ist sie nur ein Fehlerbericht.' },

      { t: 'h', v: '4. Der Pilot war so angelegt, dass er nie endet' },
      { t: 'p', v: 'Piloten, die auf synthetischen Daten in einer Sandbox laufen, ohne Verantwortlichen und ohne Enddatum, sind eine Methode, beschäftigt auszusehen, ohne etwas zu entscheiden. Ein halbes Jahr später hat sich das Werkzeug weiterentwickelt, der interne Fürsprecher hat den Job gewechselt, und die Arbeit beginnt bei null.' },
      { t: 'p', v: 'Geben Sie ihm stattdessen ein echtes Stück Wirklichkeit. Ein Team, ein Arbeitsablauf, echte Daten, echte Kunden, vier bis sechs Wochen und am Ende eine Entscheidung: weiter oder nicht. Eine schmale Sache in Produktion lehrt Sie in zwei Wochen mehr als eine breite Sache im Staging in zwei Quartalen.' },

      { t: 'h', v: '5. Sie haben einen ohnehin kaputten Prozess automatisiert' },
      { t: 'p', v: 'KI ist ein Verstärker. Richten Sie sie auf einen Ablauf mit unklarer Verantwortung, drei Wahrheitsquellen und einem Berg undokumentierter Ausnahmen, und Sie bekommen falsche Antworten schneller und in großer Zahl. Das Chaos wurde bisher von menschlichem Urteilsvermögen aufgefangen, und die Automatisierung entfernt genau dieses Urteilsvermögen.' },
      { t: 'p', v: 'Wo ein Prozess wirklich kaputt ist: erst den Prozess reparieren oder einen anderen wählen. Fast immer liegt daneben ein saubererer, teurerer, repetitiverer Ablauf, der ohnehin das bessere erste Ziel gewesen wäre.' },

      { t: 'h', v: '6. Niemandes Arbeit wurde leichter, also nutzte es niemand' },
      { t: 'p', v: 'Akzeptanz ist kein Schulungsproblem. Menschen nutzen ein Werkzeug, wenn es ihnen ungeliebte Arbeit abnimmt, und ignorieren es stillschweigend, wenn es einer bisher gut laufenden Aufgabe einen Prüfschritt hinzufügt. Wenn Ihr Agent jedes einzelne Mal eine Kontrolle durch Menschen braucht, haben Sie einen Praktikanten eingestellt und die Aufsicht Ihrer teuersten Fachkraft übertragen.' },
      { t: 'p', v: 'Richten Sie den ersten Build auf Arbeit, die Ihr Team ausgesprochen ungern macht: Anrufe außerhalb der Geschäftszeiten, Dateneingabe, Erstsortierung, das Hinterherlaufen nach Dokumenten. Akzeptanz stellt sich von selbst ein, wenn die Alternative schlimmer ist.' },

      { t: 'h', v: 'Wie die aussehen, die funktionieren' },
      { t: 'p', v: 'Die Projekte, die sich selbst bezahlen, sind unspektakulär und haben dieselbe Form:' },
      { t: 'ol', v: [
        'Ein Arbeitsablauf, gewählt weil er teuer, repetitiv und messbar ist.',
        'Ein Ausgangswert, erfasst bevor irgendetwas gebaut wird.',
        'Schreibzugriff auf die echten Systeme, eng gefasst, mit Audit-Trail.',
        'Ein definierter Fehlerpfad: was der Agent tut, wenn er unsicher ist, und an wen er eskaliert.',
        'Innerhalb von Wochen live bei echten Nutzern, keine Demo, die über Quartale zurückgehalten wird.',
        'Ein verantwortlicher Owner, der die Befugnis hat, das Projekt zu beenden.',
      ] },
      { t: 'p', v: 'Nichts davon handelt wirklich von KI. Es ist gewöhnliche Lieferdisziplin, angewandt auf eine Technologie, die viele weiterhin als Ausnahme davon behandeln. Das ist der eigentliche Grund, warum die meisten Unternehmen nichts zurückbekommen.' },
    ],
  },

  'ai-advantage': {
    blocks: [
      { t: 'p', v: 'Es gibt ein bequemes Argument fürs Abwarten. Die Werkzeuge ändern sich monatlich, die Preise fallen weiter, und die clevere Integration von heute ist das Häkchen in der Feature-Liste von morgen. Sollen andere das Lehrgeld zahlen, dann übernimmt man die reife Version. Bei den meisten Technologien war dieses Argument richtig.' },
      { t: 'p', v: 'Hier ist es falsch, und der Grund ist konkret: fast nichts vom Vorsprung steckt im Modell.' },

      { t: 'h', v: 'Das Modell ist der Teil, den man später kaufen kann. Alles andere nicht.' },
      { t: 'p', v: 'Ein Frontier-Modell ist eine Ware, und zwar eine gemietete. Ihr Wettbewerber kann morgen dasselbe Modell abonnieren, zum selben Preis wie Sie. Was er am Tag seiner Entscheidung nicht abonnieren kann, ist Folgendes:' },
      { t: 'ul', v: [
        'Arbeitsabläufe, die bereits um das herumgebaut sind, was ein Agent tatsächlich leisten kann.',
        'Saubere, strukturierte, erreichbare Daten, weil zwei Jahre KI-Arbeit das Aufräumen erzwungen haben.',
        'Prüfsets und Leitplanken, gebaut aus echten Produktionsfehlern.',
        'Ein Team, das aus Erfahrung weiß, wo das funktioniert und wo nicht.',
        'Kunden, die an Ihre Reaktionszeiten längst gewöhnt sind.',
      ] },
      { t: 'p', v: 'Jeder dieser Punkte hat Kalenderzeit gekostet, kein Budget. Genau deshalb wächst der Abstand, statt sich zu schließen.' },

      { t: 'h', v: 'Der Abstand zeigt sich in der Stückkostenrechnung, nicht in Pressemitteilungen' },
      { t: 'p', v: 'Zieht man die Sprache ab, bewirkt gut eingeführte KI eines: sie senkt die Grenzkosten eines Ablaufs, meist deutlich, und sie beseitigt die Warteschlange.' },
      { t: 'p', v: 'Ein Wettbewerber, dessen Empfang jeden Anruf um zwei Uhr nachts annimmt, dessen Angebote in neunzig Sekunden statt in zwei Tagen rausgehen und dessen Support einen Bruchteil pro Ticket kostet, gewinnt nicht wegen der Technologie. Er gewinnt, weil er zu Aufträgen Ja sagen kann, die Sie ablehnen müssen, und weniger dafür verlangt.' },
      { t: 'p', v: 'Sie werden das nicht als Ankündigung sehen. Sie werden es als langsamen, unerklärlichen Rückgang der Abschlussquote sehen.' },
      { t: 'quote', v: 'Niemand verliert gegen KI. Man verliert gegen einen Wettbewerber, dessen Reaktionszeit von zwei Tagen auf zwei Minuten gefallen ist.' },

      { t: 'h', v: 'Warten hat einen Preis, und der ist messbar' },
      { t: 'p', v: 'Die ehrliche Betrachtung lautet nicht "sollen wir KI machen". Sie ist Rechnen. Nehmen Sie einen Arbeitsablauf. Zählen Sie, was er heute kostet: Stunden, Gehalt, Fehlerquote, Aufträge, die an langsamen Antworten verloren gehen. Multiplizieren Sie mit der Zahl der Quartale, die Sie zu warten gedenken. Das ist die Rechnung für die Entscheidung zu warten, und sie fällt meist höher aus als der Build.' },
      { t: 'p', v: 'Dazu kommt der Teil, der nie auf der Rechnung steht: die Prozessänderungen, die Einstellungen und die Datenarbeit, die Sie später unter Zeitdruck machen, während ein Wettbewerber sie jetzt in Ruhe erledigt hat.' },

      { t: 'h', v: 'Vorn zu sein heißt nicht, unvorsichtig zu sein' },
      { t: 'p', v: 'Vorn zu sein heißt nicht, das Unternehmen um einen Chatbot herum neu zu bauen oder einen Plattformvertrag im siebenstelligen Bereich zu unterschreiben. In der Praxis heißt es:' },
      { t: 'ol', v: [
        'Pro Quartal einen Arbeitsablauf auswählen und ihn tatsächlich liefern.',
        'Die Modellebene austauschbar halten, denn sie wird ausgetauscht werden.',
        'Ihre Daten, Ihre Prompts und Ihre Prüfsets besitzen, egal wer sie baut.',
        'Institutionelles Wissen aufbauen, nicht nur eine Lieferantenbeziehung.',
        'Bereit sein, etwas Nichtfunktionierendes schnell und ohne Drama zu beenden.',
      ] },
      { t: 'p', v: 'Das ist ein bescheidenes, unaufgeregtes Programm. Über zwei Jahre gefahren, entsteht daraus etwas, das ein Wettbewerber nicht per Scheck aufholen kann, und genau darum geht es.' },

      { t: 'h', v: 'Das Zeitfenster ist schmaler, als es aussieht' },
      { t: 'p', v: 'Fähigkeiten werden schnell zur Massenware, und viele lesen das als Grund, sich zurückzulehnen. Es ist das Gegenteil. Wenn alle dieselben Modelle haben, verschiebt sich der Unterschied vollständig auf Integration, eigene Prozesse und eigene Daten, und genau das sind die langsam zu bauenden Teile. Der Vorsprung, der einem Unternehmen offensteht, das jetzt beginnt, ist kein besseres Modell als das der Wettbewerber. Es sind zwei Jahre Vorsprung bei allem, woran das Modell angeschlossen wird.' },
    ],
  },
};
