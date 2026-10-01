// ----------------------------
// SETTINGS
// ----------------------------
const QUESTIONS_PER_ROW = 3;

// ----------------------------
// FULL QUESTION POOL (Canada – FR)
// ----------------------------
const INLINE_TEST_QUESTIONS = [
  {
    q: "Qui représente le souverain dans les provinces du Canada?",
    a: [
      "Le lieutenant-gouverneur",
      "Le gouverneur général",
      "Le premier ministre provincial",
      "Le président de l’Assemblée législative"
    ],
    correct: 0
  },
  {
    q: "En quelle année le territoire du Nunavut a-t-il été officiellement créé?",
    a: ["1982", "1999", "1975", "2003"],
    correct: 1
  },
  {
    q: "Quel tribunal constitue la plus haute instance judiciaire au Canada?",
    a: [
      "La Cour suprême du Canada",
      "La Cour fédérale",
      "La Cour canadienne de l’impôt",
      "La Cour d’appel fédérale"
    ],
    correct: 0
  },

  {
    q: "Dans quelle région du Canada trouve-t-on les marées les plus fortes au monde?",
    a: [
      "La baie de Fundy",
      "Le fleuve Fraser",
      "Le détroit d’Hudson",
      "Le golfe du Saint-Laurent"
    ],
    correct: 0
  },
  {
    q: "Quel est le rôle principal du gouverneur général?",
    a: [
      "Représenter le souverain au niveau fédéral",
      "Nommer les maires",
      "Diriger les forces armées",
      "Émettre les avis d'élections provinciales"
    ],
    correct: 0
  },
  {
    q: "Quel est l’organe chargé d’adopter les lois fédérales au Canada?",
    a: [
      "Le Parlement du Canada",
      "La Cour suprême",
      "Les législatures provinciales",
      "Le Cabinet"
    ],
    correct: 0
  },

  {
    q: "Quel document historique de 1763 a établi la base du régime britannique en Amérique du Nord?",
    a: [
      "La Proclamation royale",
      "L’Acte de l’Amérique du Nord britannique",
      "La Charte canadienne des droits",
      "L’Acte de Québec"
    ],
    correct: 0
  },
  {
    q: "Qui choisit les juges de la Cour suprême du Canada?",
    a: [
      "Le premier ministre et le Cabinet",
      "Le gouverneur général seul",
      "Le Sénat",
      "Un vote du Parlement entier"
    ],
    correct: 0
  },
  {
    q: "Quels territoires canadiens sont représentés par des commissaires plutôt que des lieutenants-gouverneurs?",
    a: [
      "Yukon, Territoires du Nord-Ouest et Nunavut",
      "Yukon seulement",
      "Nunavut seulement",
      "Territoires du Nord-Ouest seulement"
    ],
    correct: 0
  },

  {
    q: "Quel événement historique est célébré le 1er juillet au Canada?",
    a: [
      "L’adoption de l’Acte de l’Amérique du Nord britannique (1867)",
      "La signature de la Charte canadienne (1982)",
      "Le début de la Confédération en 1841",
      "L’entrée de Terre-Neuve dans la Confédération"
    ],
    correct: 0
  },
  {
    q: "Quel organisme national fournit les services policiers dans plusieurs provinces et territoires?",
    a: [
      "La Gendarmerie royale du Canada (GRC)",
      "La Police militaire canadienne",
      "Le Service canadien du renseignement de sécurité",
      "Les Services correctionnels du Canada"
    ],
    correct: 0
  },
  {
    q: "Quel est l’objectif principal de la Loi sur les langues officielles?",
    a: [
      "Garantir l’égalité du français et de l’anglais au niveau fédéral",
      "Déterminer la langue des provinces",
      "Créer un système scolaire bilingue obligatoire",
      "Supprimer les barrières économiques entre provinces"
    ],
    correct: 0
  },

  {
    q: "Quel groupe autochtone est principalement associé au Nunavut?",
    a: [
      "Les Inuits",
      "Les Premières Nations des Plaines",
      "Les Métis",
      "La Nation huronne-wendat"
    ],
    correct: 0
  },
{
  q: "Qui sont les Acadiens dans l’histoire du Canada?",
  a: [
    "Les descendants des colons français établis dans les Maritimes",
    "Un regroupement de Premières Nations des Prairies",
    "Une communauté issue de la colonisation britannique",
    "Un groupe métis originaire du Nord"
  ],
  correct: 0
},
  {
    q: "Quelle instance est responsable des finances publiques au niveau fédéral?",
    a: [
      "Le ministre des Finances",
      "Le Président du Sénat",
      "Le greffier du Conseil privé",
      "Le directeur parlementaire du budget"
    ],
    correct: 0
  },

{
  q: "Quelle découverte médicale majeure réalisée par des chercheurs canadiens a sauvé des millions de vies dans le monde?",
  a: [
    "L’insuline",
    "Le vaccin contre la variole",
    "La pénicilline",
    "Le premier stimulateur cardiaque"
  ],
  correct: 0
},
  {
    q: "Qui est responsable de faire appliquer les lois provinciales?",
    a: [
      "Les forces policières provinciales",
      "Le Parlement du Canada",
      "La Cour suprême",
      "Les maires"
    ],
    correct: 0
  },
  {
    q: "Quel événement de 1917 a profondément marqué l’histoire militaire canadienne?",
    a: [
      "La bataille de la crête de Vimy",
      "La bataille de Passchendaele",
      "Le raid de Dieppe",
      "La bataille de l’Atlantique"
    ],
    correct: 0
  },

  {
    q: "Que signifie le terme « responsabilité ministérielle » dans le système canadien?",
    a: [
      "Les ministres doivent répondre devant la Chambre des communes",
      "Les ministres nomment les juges",
      "Les provinces doivent suivre les directives fédérales",
      "Les ministres peuvent dissoudre le Parlement"
    ],
    correct: 0
  },
  {
    q: "Quel fleuve joue un rôle majeur dans le commerce et l’histoire du Canada?",
    a: ["Le Saint-Laurent", "Le Mackenzie", "Le Churchill", "Le Fraser"],
    correct: 0
  }
];

// ----------------------------
// STATE
// ----------------------------
let correctCount = 0;
let wrongCount = 0;
let answeredCount = 0;
let totalQuestions = INLINE_TEST_QUESTIONS.length;

let currentRow = 0;

// ----------------------------
// UI TARGETS
// ----------------------------
const container = document.getElementById("inline-test-questions");
const expandBtn = document.getElementById("inline-test-expand");

// ----------------------------
// PROGRESS DISPLAY
// ----------------------------
function updateProgressDisplay() {
  document.getElementById("inline-progress-text").textContent =
    `Progression : ${answeredCount} / ${totalQuestions} questions`;
}

function updateProgressBar() {
  const pct = (answeredCount / totalQuestions) * 100;
  document.getElementById("inline-progressbar").style.width = pct + "%";
}

// ----------------------------
// UTILITIES
// ----------------------------
function shuffleAnswers(question) {
  const combined = question.a.map((opt, index) => ({
    text: opt,
    isCorrect: index === question.correct
  }));

  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  question.a = combined.map(i => i.text);
  question.correct = combined.findIndex(i => i.isCorrect);
}

function createDonutChart() {
  const pct = Math.round((correctCount / totalQuestions) * 100);
  const C = 2 * Math.PI * 40;

  return `
    <div class="donut-wrapper">
      <svg width="120" height="120" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="#ebe6ff" stroke-width="12" fill="none"></circle>
        <circle cx="50" cy="50" r="40" stroke="#6d4aff" stroke-width="12" fill="none"
          stroke-dasharray="${(pct / 100) * C} ${(1 - pct / 100) * C}"
          transform="rotate(-90 50 50)" stroke-linecap="round"></circle>
      </svg>
      <div class="donut-center">${pct}%</div>
    </div>
  `;
}

function createEndCard() {
  const pct = Math.round((correctCount / totalQuestions) * 100);
  const card = document.createElement("div");
  card.className = "inline-question-card end-card";

  const title =
    pct >= 80 ? "Excellent travail !" :
    pct >= 50 ? "Très bien !" :
    pct >= 25 ? "Bon début !" :
    "Continuez l'entraînement";

  card.innerHTML = `
    <h3>${title}</h3>
    ${createDonutChart()}
    <p>Vous avez terminé les questions gratuites.  
    Accédez à plus de <strong>500 questions basées sur Discover Canada</strong>, aux simulations chronométrées et aux explications détaillées.</p>
    <a href="https://civiclearn.com/canadafr/checkout.html" class="hero-primary-btn">Obtenir l’accès complet</a>
  `;

  return card;
}

// ----------------------------
// BUILD ROWS
// ----------------------------
const rows = [];
for (let i = 0; i < totalQuestions; i += QUESTIONS_PER_ROW) {
  rows.push(INLINE_TEST_QUESTIONS.slice(i, i + QUESTIONS_PER_ROW));
}

INLINE_TEST_QUESTIONS.forEach(q => shuffleAnswers(q));

// ----------------------------
// RENDERING
// ----------------------------
function renderRow(rowIndex) {
  if (!rows[rowIndex]) return;

  rows[rowIndex].forEach((q, offset) => {
    const absoluteIndex = rowIndex * QUESTIONS_PER_ROW + offset;
    container.appendChild(createQuestionCard(q, absoluteIndex));
  });
}

function createQuestionCard(questionObj, absoluteIndex) {
  const card = document.createElement("div");
  card.className = "inline-question-card";

  const title = document.createElement("h3");
  title.textContent = questionObj.q;

  const feedback = document.createElement("div");
  feedback.className = "inline-feedback";

  card.append(title);

  questionObj.a.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "inline-option-btn";
    btn.textContent = opt;

    btn.onclick = () => {
      answeredCount++;
      updateProgressDisplay();
      updateProgressBar();

      if (i === questionObj.correct) {
        correctCount++;
        feedback.textContent = "Bonne réponse !";
        feedback.classList.add("inline-correct");
      } else {
        wrongCount++;
        feedback.textContent =
          "Bonne réponse : " + questionObj.a[questionObj.correct];
        feedback.classList.add("inline-wrong");
      }

      card.querySelectorAll("button").forEach(b => (b.disabled = true));
      card.appendChild(feedback);

      const isLastQuestion = absoluteIndex === totalQuestions - 1;

      if (isLastQuestion) {
        setTimeout(() => container.appendChild(createEndCard()), 300);
      }

      const isLastInRow =
        (absoluteIndex + 1) % QUESTIONS_PER_ROW === 0 &&
        absoluteIndex !== totalQuestions - 1;

      if (isLastInRow) {
        currentRow++;
        renderRow(currentRow);
      }
    };

    card.appendChild(btn);
  });

  return card;
}

// ----------------------------
// INITIAL RENDER
// ----------------------------
renderRow(0);
updateProgressDisplay();
updateProgressBar();

// ----------------------------
// CONTINUE BUTTON
// ----------------------------
expandBtn.onclick = () => {
  currentRow = 1;
  renderRow(currentRow);
  expandBtn.style.display = "none";
};
