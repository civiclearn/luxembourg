const QUESTIONS = [
  {
    "q": {
      "fr": "Quand est-ce que le Conseil d'État doit donner un avis complémentaire sur un projet de loi?",
      "en": "When must the Council of State give an additional opinion on a bill?",
      "de": "Wann muss der Staatsrat zu einem Gesetzentwurf eine ergänzende Stellungnahme abgeben?"
    },
    "a": {
      "fr": [
        "s'il y a eu des amendements",
        "dans tous les cas",
        "si un quart des députés le demandent"
      ],
      "en": [
        "if amendments have been made",
        "in all cases",
        "if one quarter of the members of parliament request it"
      ],
      "de": [
        "wenn Änderungen vorgenommen wurden",
        "in allen Fällen",
        "wenn ein Viertel der Abgeordneten dies verlangt"
      ]
    }
  },
  {
    "q": {
      "fr": "Qui propose les membres du gouvernement?",
      "en": "Who proposes the members of the government?",
      "de": "Wer schlägt die Mitglieder der Regierung vor?"
    },
    "a": {
      "fr": [
        "le Premier ministre",
        "le Grand-Duc",
        "le Conseil d'État"
      ],
      "en": [
        "the Prime Minister",
        "the Grand Duke",
        "the Council of State"
      ],
      "de": [
        "der Premierminister",
        "der Großherzog",
        "der Staatsrat"
      ]
    }
  },
  {
    "q": {
      "fr": "Qui a l'initiative d'un projet de loi?",
      "en": "Who has the initiative for a bill (government bill)?",
      "de": "Wer hat die Initiative für einen Gesetzentwurf?"
    },
    "a": {
      "fr": [
        "le Gouvernement",
        "un ou plusieurs députés",
        "les citoyens"
      ],
      "en": [
        "the Government",
        "one or more members of parliament",
        "citizens"
      ],
      "de": [
        "die Regierung",
        "ein oder mehrere Abgeordnete",
        "die Bürger"
      ]
    }
  },
  {
    "q": {
      "fr": "Comment le Grand-Duc choisit-il le Premier ministre?",
      "en": "How does the Grand Duke choose the Prime Minister?",
      "de": "Wie wählt der Großherzog den Premierminister aus?"
    },
    "a": {
      "fr": [
        "sur base des résultats des élections",
        "selon ses affinités",
        "en faisant alterner les partis"
      ],
      "en": [
        "on the basis of election results",
        "according to personal affinities",
        "by alternating parties"
      ],
      "de": [
        "auf Grundlage der Wahlergebnisse",
        "nach persönlichen Neigungen",
        "durch Wechsel der Parteien"
      ]
    }
  },
  {
    "q": {
      "fr": "Pour combien d'années sont élus les députés européens?",
      "en": "For how many years are Members of the European Parliament elected?",
      "de": "Für wie viele Jahre werden die Abgeordneten des Europäischen Parlaments gewählt?"
    },
    "a": {
      "fr": [
        "5 ans",
        "7 ans",
        "4 ans"
      ],
      "en": [
        "5 years",
        "7 years",
        "4 years"
      ],
      "de": [
        "5 Jahre",
        "7 Jahre",
        "4 Jahre"
      ]
    }
  },
  {
    "q": {
      "fr": "Quand est-ce que l'avis d'une chambre professionnelle doit être demandé?",
      "en": "When must the opinion of a professional chamber be requested?",
      "de": "Wann muss die Stellungnahme einer Berufskammer eingeholt werden?"
    },
    "a": {
      "fr": [
        "pour tout projet de loi concernant son domaine de compétence",
        "avant tout licenciement",
        "pour toute nomination de ministre"
      ],
      "en": [
        "for any bill concerning its field of competence",
        "before any dismissal",
        "for any ministerial appointment"
      ],
      "de": [
        "bei jedem Gesetzentwurf, der ihren Zuständigkeitsbereich betrifft",
        "vor jeder Entlassung",
        "bei jeder Ernennung eines Ministers"
      ]
    }
  },
  {
    "q": {
      "fr": "Comment la Chambre des députés exprime-t-elle sa confiance à un gouvernement qui lui présente son programme?",
      "en": "How does the Chamber of Deputies express its confidence in a government presenting its programme?",
      "de": "Wie bringt die Abgeordnetenkammer ihr Vertrauen in eine Regierung zum Ausdruck, die ihr Programm vorlegt?"
    },
    "a": {
      "fr": [
        "par le vote d’une motion",
        "en applaudissant",
        "en débattant avec lui"
      ],
      "en": [
        "by voting a motion",
        "by applauding",
        "by debating with it"
      ],
      "de": [
        "durch die Abstimmung über eine Motion",
        "durch Applaus",
        "durch eine Debatte mit ihr"
      ]
    }
  },
  {
    "q": {
      "fr": "Qui dirige les membres du Parquet?",
      "en": "Who heads the members of the Public Prosecutor’s Office?",
      "de": "Wer leitet die Mitglieder der Staatsanwaltschaft?"
    },
    "a": {
      "fr": [
        "le procureur général d’État",
        "le Président de la Chambre",
        "le Grand-Duc"
      ],
      "en": [
        "the State Prosecutor General",
        "the President of the Chamber",
        "the Grand Duke"
      ],
      "de": [
        "der Generalstaatsanwalt des Staates",
        "der Präsident der Abgeordnetenkammer",
        "der Großherzog"
      ]
    }
  },
  {
    "q": {
      "fr": "Qui présente chaque année un avis sur la situation économique, financière et sociale du pays?",
      "en": "Who issues an annual opinion on the country’s economic, financial and social situation?",
      "de": "Wer gibt jährlich eine Stellungnahme zur wirtschaftlichen, finanziellen und sozialen Lage des Landes ab?"
    },
    "a": {
      "fr": [
        "le Conseil économique et social",
        "la Cour des comptes",
        "le Conseil d'État"
      ],
      "en": [
        "the Economic and Social Council",
        "the Court of Auditors",
        "the Council of State"
      ],
      "de": [
        "der Wirtschafts- und Sozialrat",
        "der Rechnungshof",
        "der Staatsrat"
      ]
    }
  },
  {
    "q": {
      "fr": "De quelle assemblée sont issus les échevins?",
      "en": "From which assembly are the aldermen (échevins) chosen?",
      "de": "Aus welcher Versammlung gehen die Schöffen hervor?"
    },
    "a": {
      "fr": [
        "le conseil communal",
        "le conseil municipal",
        "la Chambre des députés"
      ],
      "en": [
        "the municipal council",
        "the city council",
        "the Chamber of Deputies"
      ],
      "de": [
        "aus dem Gemeinderat",
        "aus dem Stadtrat",
        "aus der Abgeordnetenkammer"
      ]
    }
  }
];
