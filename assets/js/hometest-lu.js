// ============================
// hometest-lu.js — TRILINGUAL
// FR / EN / DE — Luxembourg
// 14 questions + 15th result card
// ============================

// ----------------------------
// SETTINGS
// ----------------------------
const QUESTIONS_PER_ROW = 3;
let currentLang = "fr";

// ----------------------------
// UI STRINGS
// ----------------------------
const UI = {
  progress: {
    fr: "Progression",
    en: "Progress",
    de: "Fortschritt"
  },
  correct: {
    fr: "Correct!",
    en: "Correct!",
    de: "Richtig!"
  },
  wrong: {
    fr: "Bonne réponse : ",
    en: "Correct answer: ",
    de: "Richtige Antwort: "
  },
  resultTitle: pct => ({
    fr: pct >= 80 ? "Félicitations!" :
        pct >= 50 ? "Très bien!" :
        pct >= 25 ? "Bon début!" : "Peut encore s'améliorer",
    en: pct >= 80 ? "Congratulations!" :
        pct >= 50 ? "Very good!" :
        pct >= 25 ? "Good start!" : "Needs improvement",
    de: pct >= 80 ? "Glückwunsch!" :
        pct >= 50 ? "Sehr gut!" :
        pct >= 25 ? "Guter Anfang!" : "Verbesserung möglich"
  })
};

// ----------------------------
// QUESTIONS (14) — FIXED
// ----------------------------
const QUESTIONS = [
  {
    q: {
      fr: "Pourquoi est-ce que les Orange-Nassau perdent le contrôle du Luxembourg en 1890?",
      en: "Why did the House of Orange-Nassau lose control of Luxembourg in 1890?",
      de: "Warum verloren die Oranien-Nassau 1890 die Kontrolle über Luxemburg?"
    },
    a: {
      fr: [
        "à cause de l’extinction des mâles de cette branche",
        "à cause d'une défaite militaire",
        "pour des raisons financières"
      ],
      en: [
        "because the male line of that branch died out",
        "because of a military defeat",
        "for financial reasons"
      ],
      de: [
        "wegen des Aussterbens der männlichen Linie",
        "wegen einer militärischen Niederlage",
        "aus finanziellen Gründen"
      ]
    },
    correct: { fr: 0, en: 0, de: 0 }
  },
  {
    q: {
      fr: "Dans quelle Confédération entre le Grand-Duché de Luxembourg en 1815?",
      en: "Which confederation did the Grand Duchy of Luxembourg join in 1815?",
      de: "Welcher Konföderation trat das Großherzogtum Luxemburg 1815 bei?"
    },
    a: {
      fr: ["la Confédération germanique", "la Confédération helvétique", "la Confédération wallonne"],
      en: ["the German Confederation", "the Swiss Confederation", "the Walloon Confederation"],
      de: ["der Deutsche Bund", "der Schweizerische Bund", "die Wallonische Konföderation"]
    },
    correct: { fr: 0, en: 0, de: 0 }
  },
  {
    q: {
      fr: "En 1964, la Grande-Duchesse Charlotte abdique en faveur de qui?",
      en: "In 1964, in favour of whom did Grand Duchess Charlotte abdicate?",
      de: "Zu Gunsten von wem dankte Großherzogin Charlotte 1964 ab?"
    },
    a: {
      fr: ["son fils Jean", "sa sœur Marie-Adélaïde", "sa fille Marie-Gabrielle"],
      en: ["her son Jean", "her sister Marie-Adélaïde", "her daughter Marie-Gabrielle"],
      de: ["ihres Sohnes Jean", "ihrer Schwester Marie-Adélaïde", "ihrer Tochter Marie-Gabrielle"]
    },
    correct: { fr: 0, en: 0, de: 0 }
  },
  {
    q: {
      fr: "Qu'est-ce que l'UEBL?",
      en: "What is the UEBL?",
      de: "Was ist die UEBL?"
    },
    a: {
      fr: [
        "l’Union économique belgo-luxembourgeoise",
        "l'Union des étudiants boursiers du Luxembourg",
        "l'Union des établissements bancaires luxembourgeois"
      ],
      en: [
        "the Belgian-Luxembourg Economic Union",
        "the Union of Scholarship Students of Luxembourg",
        "the Union of Luxembourg Banking Institutions"
      ],
      de: [
        "die Belgisch-Luxemburgische Wirtschaftsunion",
        "die Union der Stipendiaten Luxemburgs",
        "die Union der luxemburgischen Bankinstitute"
      ]
    },
    correct: { fr: 0, en: 0, de: 0 }
  },
  {
    q: {
      fr: "Pour voter, il faut disposer des droits politiques et civils, c’est-à-dire:",
      en: "To vote, one must have political and civil rights, meaning:",
      de: "Um wählen zu dürfen, muss man über politische und bürgerliche Rechte verfügen, das heißt:"
    },
    a: {
      fr: [
        "ne pas avoir été condamné(e) pour certains délits de droit commun",
        "être inscrit sur les listes électorales",
        "ne pas avoir commis de crimes"
      ],
      en: [
        "not having been convicted of certain ordinary criminal offences",
        "being registered on the electoral lists",
        "not having committed crimes"
      ],
      de: [
        "nicht wegen bestimmter gemeinrechtlicher Straftaten verurteilt worden zu sein",
        "in die Wählerlisten eingetragen zu sein",
        "keine Verbrechen begangen zu haben"
      ]
    },
    correct: { fr: 0, en: 0, de: 0 }
  },
  {
    q: {
      fr: "Combien de fois la Chambre des députés devrait normalement se prononcer sur l'ensemble d'un texte?",
      en: "How many times should the Chamber of Deputies normally vote on a law as a whole?",
      de: "Wie oft sollte sich die Abgeordnetenkammer normalerweise über einen Gesetzestext insgesamt äußern?"
    },
    a: {
      fr: ["deux fois", "une fois", "trois fois"],
      en: ["twice", "once", "three times"],
      de: ["zweimal", "einmal", "dreimal"]
    },
    correct: { fr: 0, en: 0, de: 0 }
  },
  {
    q: {
      fr: "Qui nomme et démissionne formellement les conseillers d’État?",
      en: "Who formally appoints and dismisses the members of the Council of State?",
      de: "Wer ernennt und entlässt formell die Mitglieder des Staatsrates?"
    },
    a: {
      fr: ["le Grand-Duc", "le Premier ministre", "la Chambre des députés"],
      en: ["the Grand Duke", "the Prime Minister", "the Chamber of Deputies"],
      de: ["der Großherzog", "der Premierminister", "die Abgeordnetenkammer"]
    },
    correct: { fr: 0, en: 0, de: 0 }
  },
  {
    q: {
      fr: "Pour combien d'années est élu le conseil communal?",
      en: "For how many years is the municipal council elected?",
      de: "Für wie viele Jahre wird der Gemeinderat gewählt?"
    },
    a: {
      fr: ["6 ans", "5 ans", "4 ans"],
      en: ["6 years", "5 years", "4 years"],
      de: ["6 Jahre", "5 Jahre", "4 Jahre"]
    },
    correct: { fr: 0, en: 0, de: 0 }
  },
  {
    q: {
      fr: "Quel âge faut-il avoir pour être éligible à la Chambre des députés?",
      en: "How old must one be to be eligible for the Chamber of Deputies?",
      de: "Wie alt muss man sein, um für die Abgeordnetenkammer wählbar zu sein?"
    },
    a: {
      fr: ["18 ans", "25 ans", "21 ans"],
      en: ["18 years", "25 years", "21 years"],
      de: ["18 Jahre", "25 Jahre", "21 Jahre"]
    },
    correct: { fr: 0, en: 0, de: 0 }
  },
  {
    q: {
      fr: "Combien existe-t-il de circonscriptions électorales?",
      en: "How many electoral constituencies are there?",
      de: "Wie viele Wahlkreise gibt es?"
    },
    a: {
      fr: ["quatre", "huit", "deux"],
      en: ["four", "eight", "two"],
      de: ["vier", "acht", "zwei"]
    },
    correct: { fr: 0, en: 0, de: 0 }
  },
  {
    q: {
      fr: "Combien y a-t-il de tribunaux d’arrondissement au Luxembourg?",
      en: "How many district courts are there in Luxembourg?",
      de: "Wie viele Bezirksgerichte gibt es in Luxemburg?"
    },
    a: {
      fr: ["deux", "trois", "cinq"],
      en: ["two", "three", "five"],
      de: ["zwei", "drei", "fünf"]
    },
    correct: { fr: 0, en: 0, de: 0 }
  },
  {
    q: {
      fr: "La scolarité est gratuite et obligatoire pour les enfants de quel âge?",
      en: "For children of what age is schooling free and compulsory?",
      de: "Für Kinder welchen Alters ist die Schulbildung kostenlos und verpflichtend?"
    },
    a: {
      fr: ["de 4 à 18 ans", "de 3 à 18 ans", "de 7 à 16 ans"],
      en: ["from 4 to 18 years old", "from 3 to 18 years old", "from 7 to 16 years old"],
      de: ["von 4 bis 18 Jahren", "von 3 bis 18 Jahren", "von 7 bis 16 Jahren"]
    },
    correct: { fr: 0, en: 0, de: 0 }
  },
  {
    q: {
      fr: "Entre une loi luxembourgeoise, la Constitution luxembourgeoise et un traité européen, qu'est-ce qui est prédominant?",
      en: "Between a Luxembourg law, the Luxembourg Constitution and a European treaty, which one prevails?",
      de: "Was hat Vorrang zwischen einem luxemburgischen Gesetz, der luxemburgischen Verfassung und einem europäischen Vertrag?"
    },
    a: {
      fr: ["le traité européen", "la loi luxembourgeoise", "la Constitution luxembourgeoise"],
      en: ["the European treaty", "the Luxembourg law", "the Luxembourg Constitution"],
      de: ["der europäische Vertrag", "das luxemburgische Gesetz", "die luxemburgische Verfassung"]
    },
    correct: { fr: 0, en: 0, de: 0 }
  },
  {
    q: {
      fr: "Que supprime la convention de Schengen?",
      en: "What does the Schengen Agreement abolish?",
      de: "Was schafft das Schengener Übereinkommen ab?"
    },
    a: {
      fr: ["les contrôles d’identité aux frontières", "les monnaies nationales", "les impôts nationaux"],
      en: ["border controls at internal borders", "national currencies", "national taxes"],
      de: ["die Grenzkontrollen an den Binnengrenzen", "die nationalen Währungen", "die nationalen Steuern"]
    },
    correct: { fr: 0, en: 0, de: 0 }
  }
];


// ----------------------------
// STATE
// ----------------------------
let correctCount = 0;
let answeredCount = 0;
let currentRow = 0;

// ----------------------------
// UI TARGETS
// ----------------------------
const container = document.getElementById("inline-test-questions");
const expandBtn = document.getElementById("inline-test-expand");

// ----------------------------
// HELPERS
// ----------------------------
function shuffleAnswers(q) {
  const correctIndex = q.correct[currentLang];

  const zipped = q.a[currentLang].map((t, i) => ({
    t,
    c: i === correctIndex
  }));

  for (let i = zipped.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [zipped[i], zipped[j]] = [zipped[j], zipped[i]];
  }

  q.a[currentLang] = zipped.map(x => x.t);
  q.correct[currentLang] = zipped.findIndex(x => x.c);
}


function resetInlineTest() {
  correctCount = 0;
  answeredCount = 0;
  currentRow = 0;
  container.innerHTML = "";
  QUESTIONS.forEach(q => shuffleAnswers(q));
  updateProgress();
}

// ----------------------------
// PROGRESS
// ----------------------------
function updateProgress() {
  const total = QUESTIONS.length;
  const done = answeredCount;
  const ratio = total ? done / total : 0;

  // text
  const textEl = document.getElementById("inline-progress-text");
  if (textEl) {
    textEl.textContent = `${UI.progress[currentLang]} : ${done} / ${total}`;
  }

  const redEl = document.querySelector(".lux-bar.red");
  const whiteEl = document.querySelector(".lux-bar.white");
  const blueEl = document.querySelector(".lux-bar.blue");

  if (!redEl || !whiteEl || !blueEl) return;
  const third = 1 / 3;

  let redPct = 0;
  let whitePct = 0;
  let bluePct = 0;

  if (ratio <= third) {
    redPct = ratio / third;
  } else if (ratio <= 2 * third) {
    redPct = 1;
    whitePct = (ratio - third) / third;
  } else {
    redPct = 1;
    whitePct = 1;
    bluePct = (ratio - 2 * third) / third;
  }

  // Each segment is max 33.333%
  redEl.style.width = (redPct * 33.333) + "%";
  whiteEl.style.width = (whitePct * 33.333) + "%";
  blueEl.style.width = (bluePct * 33.333) + "%";
}


function createDonutChart() {
  const pct = Math.round((correctCount / QUESTIONS.length) * 100);
  const C = 2 * Math.PI * 40;

  return `
    <div class="donut-wrapper">
      <svg width="120" height="120" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40"
          stroke="#e6e1d8"
          stroke-width="12"
          fill="none"></circle>

        <circle cx="50" cy="50" r="40"
          stroke="#6d4aff"
          stroke-width="12"
          fill="none"
          stroke-dasharray="${(pct / 100) * C} ${(1 - pct / 100) * C}"
          transform="rotate(-90 50 50)"
          stroke-linecap="round"></circle>
      </svg>
      <div class="donut-center">${pct}%</div>
    </div>
  `;
}


// ----------------------------
// END CARD
// ----------------------------
function createEndCard() {
  const pct = Math.round((correctCount / QUESTIONS.length) * 100);
  const card = document.createElement("div");
  card.className = "inline-question-card end-card";



  card.innerHTML = `
    <h3>
  ${
    currentLang === "fr"
      ? "Continuez votre entraînement"
      : currentLang === "en"
      ? "Continue your training"
      : "Setzen Sie Ihr Training fort"
  }
</h3>
    ${createDonutChart()}
	<p>
  ${
    currentLang === "fr"
      ? "Vous avez commencé votre préparation au test Vivre-Ensemble. Accédez à l’ensemble des questions, tests et simulations pour poursuivre votre progression."
      : currentLang === "en"
      ? "You have started your preparation for the Vivre-Ensemble test. Access all questions, tests, and simulations to continue your progress."
      : "Sie haben mit Ihrer Vorbereitung auf den Vivre-Ensemble-Test begonnen. Greifen Sie auf alle Fragen, Tests und Simulationen zu, um Ihre Vorbereitung fortzusetzen."
  }
</p>
    
    <a href="https://civiclearn.com/lux/checkout.html"
       class="hero-primary-btn">
      ${
        currentLang === "fr"
          ? "Accès complet"
          : currentLang === "en"
          ? "Full access"
          : "Vollzugang"
      }
    </a>
  `;

  return card;
}


// ----------------------------
// RENDERING
// ----------------------------
function renderRow(rowIndex) {
  const slice = QUESTIONS.slice(
    rowIndex * QUESTIONS_PER_ROW,
    (rowIndex + 1) * QUESTIONS_PER_ROW
  );

  slice.forEach((q, offset) => {
    const absoluteIndex = rowIndex * QUESTIONS_PER_ROW + offset;
    const card = document.createElement("div");
    card.className = "inline-question-card";

    const h3 = document.createElement("h3");
    h3.textContent = q.q[currentLang];
    card.appendChild(h3);

    q.a[currentLang].forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "inline-option-btn";
      btn.textContent = opt;

btn.onclick = () => {
  answeredCount++;

  card.querySelectorAll("button").forEach((b, idx) => {
    b.disabled = true;

    if (idx === q.correct) {
      b.classList.add("inline-correct");
    }

    if (idx === i && i !== q.correct) {
      b.classList.add("inline-wrong");
    }
  });

  if (i === q.correct) {
    correctCount++;
  }

  const feedback = document.createElement("div");
  feedback.className = "inline-feedback";
  feedback.textContent =
    i === q.correct
      ? UI.correct[currentLang]
      : UI.wrong[currentLang] + q.a[currentLang][q.correct];

  card.appendChild(feedback);
  updateProgress();

  const isLastQuestion = absoluteIndex === QUESTIONS.length - 1;
  const isLastInRow =
    (absoluteIndex + 1) % QUESTIONS_PER_ROW === 0 &&
    !isLastQuestion;

  if (isLastInRow) {
    currentRow++;
    renderRow(currentRow);
  }

  if (isLastQuestion) {
    card.after(createEndCard());
  }
};


      card.appendChild(btn);
    });

    container.appendChild(card);
  });
}

// ----------------------------
// INIT
// ----------------------------
resetInlineTest();
renderRow(0);

document
  .querySelectorAll(".inline-lang-switch .lang-btn")
  .forEach(b => b.classList.toggle("active", b.dataset.lang === currentLang));

// ----------------------------
// LANGUAGE SWITCH (public)
// ----------------------------
window.setInlineTestLang = setLang;
function setLang(lang) {
  currentLang = lang;

  // update active pill
  document
    .querySelectorAll(".inline-lang-switch .lang-btn")
    .forEach(b => b.classList.toggle("active", b.dataset.lang === lang));

  resetInlineTest();
  renderRow(0);
}

