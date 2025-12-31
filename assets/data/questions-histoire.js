const QUESTIONS = [
  {
    "q": {
      "fr": "Quelle est la date du traité de Londres imposant un partage du Luxembourg?",
      "en": "What is the date of the Treaty of London imposing a partition of Luxembourg?",
      "de": "Welches Datum hat der Londoner Vertrag, der eine Teilung Luxemburgs festlegte?"
    },
    "a": {
      "fr": [
        "19 avril 1839",
        "13 avril 1348",
        "12 avril 1786"
      ],
      "en": [
        "19 April 1839",
        "13 April 1348",
        "12 April 1786"
      ],
      "de": [
        "19. April 1839",
        "13. April 1348",
        "12. April 1786"
      ]
    }
  },
  {
    "q": {
      "fr": "Depuis quel traité le Grand-Duché est-il déclaré perpétuellement neutre?",
      "en": "Since which treaty has the Grand Duchy been declared perpetually neutral?",
      "de": "Seit welchem Vertrag gilt das Großherzogtum als dauerhaft neutral?"
    },
    "a": {
      "fr": [
        "le traité de Londres de 1867",
        "le traité de Londres de 1839",
        "le traité de Versailles de 1897"
      ],
      "en": [
        "the Treaty of London of 1867",
        "the Treaty of London of 1839",
        "the Treaty of Versailles of 1897"
      ],
      "de": [
        "der Londoner Vertrag von 1867",
        "der Londoner Vertrag von 1839",
        "der Versailler Vertrag von 1897"
      ]
    }
  },
  {
    "q": {
      "fr": "Quelle dynastie règne sur le Luxembourg depuis 1890?",
      "en": "Which dynasty has ruled Luxembourg since 1890?",
      "de": "Welche Dynastie herrscht seit 1890 über Luxemburg?"
    },
    "a": {
      "fr": [
        "les Nassau-Weilbourg",
        "les Orange-Nassau",
        "les Orléans"
      ],
      "en": [
        "the Nassau-Weilburg dynasty",
        "the Orange-Nassau dynasty",
        "the Orléans dynasty"
      ],
      "de": [
        "die Dynastie Nassau-Weilburg",
        "die Dynastie Oranien-Nassau",
        "die Dynastie Orléans"
      ]
    }
  },
  {
    "q": {
      "fr": "En 1697, quel traité oblige Louis XIV à restituer le duché de Luxembourg à l'Espagne?",
      "en": "In 1697, which treaty forced Louis XIV to return the Duchy of Luxembourg to Spain?",
      "de": "Welcher Vertrag zwang Ludwig XIV. 1697, das Herzogtum Luxemburg an Spanien zurückzugeben?"
    },
    "a": {
      "fr": [
        "le traité de Ryswick",
        "le traité de Vienne",
        "le traité de Versailles"
      ],
      "en": [
        "the Treaty of Ryswick",
        "the Treaty of Vienna",
        "the Treaty of Versailles"
      ],
      "de": [
        "der Frieden von Rijswijk",
        "der Wiener Vertrag",
        "der Vertrag von Versailles"
      ]
    }
  },
  {
    "q": {
      "fr": "Quand a été créée l'Université du Luxembourg?",
      "en": "When was the University of Luxembourg founded?",
      "de": "Wann wurde die Universität Luxemburg gegründet?"
    },
    "a": {
      "fr": [
        "en 2003",
        "en 1983",
        "en 1953"
      ],
      "en": [
        "2003",
        "1983",
        "1953"
      ],
      "de": [
        "2003",
        "1983",
        "1953"
      ]
    }
  },
  {
    "q": {
      "fr": "En 1964, la Grande-Duchesse Charlotte abdique en faveur de qui?",
      "en": "In 1964, in favour of whom did Grand Duchess Charlotte abdicate?",
      "de": "Zu Gunsten von wem dankte Großherzogin Charlotte 1964 ab?"
    },
    "a": {
      "fr": [
        "son fils Jean",
        "sa sœur Marie-Adélaïde",
        "sa fille Marie-Gabrielle"
      ],
      "en": [
        "her son Jean",
        "her sister Marie-Adélaïde",
        "her daughter Marie-Gabrielle"
      ],
      "de": [
        "zu Gunsten ihres Sohnes Jean",
        "zu Gunsten ihrer Schwester Marie-Adélaïde",
        "zu Gunsten ihrer Tochter Marie-Gabrielle"
      ]
    }
  },
  {
    "q": {
      "fr": "Que veut dire CECA?",
      "en": "What does ECSC stand for?",
      "de": "Wofür steht die Abkürzung EGKS?"
    },
    "a": {
      "fr": [
        "Communauté européenne du charbon et de l’acier",
        "Communauté européenne de coopération agricole",
        "Centralisation européenne du chemin de fer et de l'aviation"
      ],
      "en": [
        "European Coal and Steel Community",
        "European Community for Agricultural Cooperation",
        "European Centralisation of Railways and Aviation"
      ],
      "de": [
        "Europäische Gemeinschaft für Kohle und Stahl",
        "Europäische Gemeinschaft für landwirtschaftliche Zusammenarbeit",
        "Zentralisierung der europäischen Eisenbahnen und Luftfahrt"
      ]
    }
  },
  {
    "q": {
      "fr": "Qu'est-ce que l'UEBL?",
      "en": "What is the UEBL?",
      "de": "Was ist die UEBL?"
    },
    "a": {
      "fr": [
        "l’Union économique belgo-luxembourgeoise",
        "L'Union des étudiants boursiers du Luxembourg",
        "l'Union des établissements bancaires luxembourgeois"
      ],
      "en": [
        "the Belgian-Luxembourg Economic Union",
        "the Union of Scholarship Students of Luxembourg",
        "the Union of Luxembourg Banking Institutions"
      ],
      "de": [
        "die Belgisch-Luxemburgische Wirtschaftsunion",
        "die Union der Stipendiaten Luxemburgs",
        "die Union der luxemburgischen Bankinstitute"
      ]
    }
  },
  {
    "q": {
      "fr": "En 1842, le Luxembourg rentre dans quelle Union douanière?",
      "en": "In 1842, which customs union did Luxembourg join?",
      "de": "Welcher Zollunion trat Luxemburg 1842 bei?"
    },
    "a": {
      "fr": [
        "l'Union douanière allemande",
        "l'Union douanière française",
        "l'Union douanière belge"
      ],
      "en": [
        "the German Customs Union",
        "the French Customs Union",
        "the Belgian Customs Union"
      ],
      "de": [
        "der Deutsche Zollverein",
        "die Französische Zollunion",
        "die Belgische Zollunion"
      ]
    }
  },
  {
    "q": {
      "fr": "Quand le suffrage universel est-il introduit?",
      "en": "When was universal suffrage introduced?",
      "de": "Wann wurde das allgemeine Wahlrecht eingeführt?"
    },
    "a": {
      "fr": [
        "en 1919",
        "en 1940",
        "en 1970"
      ],
      "en": [
        "in 1919",
        "in 1940",
        "in 1970"
      ],
      "de": [
        "1919",
        "1940",
        "1970"
      ]
    }
  }
];
