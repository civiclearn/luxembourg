const QUESTIONS = [
  {
    "q": {
      "fr": "Entre une loi luxembourgeoise, la Constitution luxembourgeoise et un traité européen, qu'est-ce qui est prédominant?",
      "en": "Between a Luxembourg law, the Luxembourg Constitution and a European treaty, which one prevails?",
      "de": "Was hat Vorrang zwischen einem luxemburgischen Gesetz, der luxemburgischen Verfassung und einem europäischen Vertrag?"
    },
    "a": {
      "fr": [
        "le traité européen",
        "la loi luxembourgeoise",
        "la Constitution luxembourgeoise"
      ],
      "en": [
        "the European treaty",
        "the Luxembourg law",
        "the Luxembourg Constitution"
      ],
      "de": [
        "der europäische Vertrag",
        "das luxemburgische Gesetz",
        "die luxemburgische Verfassung"
      ]
    }
  },
  {
    "q": {
      "fr": "En quelle année la liberté syndicale est-elle apparue dans la Constitution?",
      "en": "In which year did freedom of association (trade union freedom) appear in the Constitution?",
      "de": "In welchem Jahr wurde die Gewerkschaftsfreiheit in die Verfassung aufgenommen?"
    },
    "a": {
      "fr": [
        "en 1948",
        "en 1878",
        "en 1974"
      ],
      "en": [
        "in 1948",
        "in 1878",
        "in 1974"
      ],
      "de": [
        "1948",
        "1878",
        "1974"
      ]
    }
  },
  {
    "q": {
      "fr": "Quand a été abolie la peine de mort pour tous les crimes au Luxembourg?",
      "en": "When was the death penalty abolished for all crimes in Luxembourg?",
      "de": "Wann wurde die Todesstrafe für alle Verbrechen in Luxemburg abgeschafft?"
    },
    "a": {
      "fr": [
        "en 1979",
        "en 1995",
        "en 1948"
      ],
      "en": [
        "in 1979",
        "in 1995",
        "in 1948"
      ],
      "de": [
        "1979",
        "1995",
        "1948"
      ]
    }
  },
  {
    "q": {
      "fr": "Quelle est la position du Luxembourg face à l'euthanasie?",
      "en": "What is Luxembourg’s position on euthanasia?",
      "de": "Wie ist die Haltung Luxemburgs zur Euthanasie?"
    },
    "a": {
      "fr": [
        "Elle est autorisée sous certaines conditions.",
        "Elle est interdite.",
        "Elle est autorisée pour les personnes de plus de 90 ans."
      ],
      "en": [
        "It is authorised under certain conditions.",
        "It is prohibited.",
        "It is authorised for people over 90 years old."
      ],
      "de": [
        "Sie ist unter bestimmten Bedingungen erlaubt.",
        "Sie ist verboten.",
        "Sie ist für Personen über 90 Jahre erlaubt."
      ]
    }
  },
  {
    "q": {
      "fr": "Qu'est-ce qui n'est pas garanti par les droits-libertés?",
      "en": "What is NOT guaranteed by freedom rights?",
      "de": "Was wird durch Freiheitsrechte NICHT garantiert?"
    },
    "a": {
      "fr": [
        "le droit au chômage",
        "les droits du justiciable",
        "la protection de l'individu contre l'État"
      ],
      "en": [
        "the right to unemployment benefits",
        "the rights of litigants",
        "protection of the individual against the State"
      ],
      "de": [
        "das Recht auf Arbeitslosengeld",
        "die Rechte der Prozessbeteiligten",
        "der Schutz des Einzelnen gegenüber dem Staat"
      ]
    }
  },
  {
    "q": {
      "fr": "Qu'est-ce qui n'est pas garanti par les droits-créance?",
      "en": "What is NOT guaranteed by entitlement rights?",
      "de": "Was wird durch Anspruchsrechte NICHT garantiert?"
    },
    "a": {
      "fr": [
        "le droit de vote",
        "le droit à la santé",
        "le droit à l'éducation"
      ],
      "en": [
        "the right to vote",
        "the right to health care",
        "the right to education"
      ],
      "de": [
        "das Wahlrecht",
        "das Recht auf Gesundheit",
        "das Recht auf Bildung"
      ]
    }
  },
  {
    "q": {
      "fr": "Combien de membres comprend la Commission consultative des droits de l'homme?",
      "en": "How many members does the Consultative Commission on Human Rights have?",
      "de": "Wie viele Mitglieder hat die Beratende Menschenrechtskommission?"
    },
    "a": {
      "fr": [
        "21",
        "65",
        "7"
      ],
      "en": [
        "21",
        "65",
        "7"
      ],
      "de": [
        "21",
        "65",
        "7"
      ]
    }
  },
  {
    "q": {
      "fr": "L'âge minimum pour pouvoir voter au Luxembourg est:",
      "en": "The minimum age to be allowed to vote in Luxembourg is:",
      "de": "Das Mindestalter, um in Luxemburg wählen zu dürfen, beträgt:"
    },
    "a": {
      "fr": [
        "18 ans",
        "21 ans",
        "16 ans"
      ],
      "en": [
        "18 years",
        "21 years",
        "16 years"
      ],
      "de": [
        "18 Jahre",
        "21 Jahre",
        "16 Jahre"
      ]
    }
  },
  {
    "q": {
      "fr": "Où siège la Cour européenne des droits de l'homme?",
      "en": "Where is the European Court of Human Rights based?",
      "de": "Wo hat der Europäische Gerichtshof für Menschenrechte seinen Sitz?"
    },
    "a": {
      "fr": [
        "à Strasbourg",
        "à Luxembourg",
        "à Bruxelles"
      ],
      "en": [
        "in Strasbourg",
        "in Luxembourg",
        "in Brussels"
      ],
      "de": [
        "in Straßburg",
        "in Luxemburg",
        "in Brüssel"
      ]
    }
  },
  {
    "q": {
      "fr": "En vertu de quel principe aucun individu ou groupe d’individus ne doit être privilégié par la loi?",
      "en": "Under which principle must no individual or group of individuals be favoured by the law?",
      "de": "Nach welchem Grundsatz darf kein Einzelner oder keine Gruppe von Personen durch das Gesetz bevorzugt werden?"
    },
    "a": {
      "fr": [
        "l'égalité devant la loi",
        "la liberté individuelle",
        "la liberté d'opinion"
      ],
      "en": [
        "equality before the law",
        "individual freedom",
        "freedom of opinion"
      ],
      "de": [
        "Gleichheit vor dem Gesetz",
        "individuelle Freiheit",
        "Meinungsfreiheit"
      ]
    }
  }
];
