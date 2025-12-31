
// ============================
// CivicEdge Flashcards v2 — Stable working build
// ============================

// --- DOM references ---
const els = {
  topicContainer: document.getElementById("topicContainer"),
  topicsWrapper:  document.getElementById("topicsWrapper"),
  card: document.getElementById("card"),
  qText: document.getElementById("qText"),
  aText: document.getElementById("aText"),
  flip: document.getElementById("flipBtn"),
  known: document.getElementById("knownBtn"),
  again: document.getElementById("againBtn"),
  prev: document.getElementById("prevBtn"),
  next: document.getElementById("nextBtn"),
  status: document.getElementById("status")
};

// --- Globals ---
let allQuestions = [];
let currentDeck = [];
let currentIndex = 0;
let mastered = new Set();

// --- Load mastered list from localStorage ---
function loadMastered() {
  try {
    const data = JSON.parse(localStorage.getItem("civicedge_flashcards_mastered") || "[]");
    mastered = new Set(data);
  } catch {
    mastered = new Set();
  }
}

// --- Save mastered list ---
function saveMastered() {
  localStorage.setItem("civicedge_flashcards_mastered", JSON.stringify([...mastered]));
}

// --- Load JSON bank ---
async function loadBank() {
  try {
    const res = await fetch("../banks/canada-fr/questions.json");
    const data = await res.json();
    allQuestions = data.questions || [];
    buildTopicChips();
  } catch (err) {
    els.status.textContent = "Erreur lors du chargement des données.";
    console.error("Flashcards: unable to load CivicEdge question bank.", err);
  }
}

// --- Build topic chips (unselected by default) ---
function buildTopicChips() {
  const topics = [...new Set(allQuestions.map(q => q.topic))].sort();

  // clear container
  els.topicContainer.innerHTML = "";

  topics.forEach(topic => {
    const btn = document.createElement("button");
    btn.className = "topic-toggle";
    btn.textContent = topic;
    btn.dataset.topic = topic;
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      updateDeck();
    });
    els.topicContainer.appendChild(btn);
  });
}


// --- Compute current active topics and prepare deck ---
function updateDeck() {
  const activeTopics = Array.from(document.querySelectorAll(".topic-toggle.active"))
    .map(el => el.dataset.topic);

// --- No topic selected → placeholder state ---
if (activeTopics.length === 0) {
  els.card.classList.add("placeholder");
  els.qText.textContent = "";
  els.aText.textContent = "";
  els.status.textContent = "Sélectionnez un thème pour commencer.";
  els.card.style.display = "block";
  return;
} else {
  els.card.classList.remove("placeholder");
}

  // Build deck, excluding mastered
  currentDeck = allQuestions.filter(
    q => activeTopics.includes(q.topic) && !mastered.has(q.id)
  );
  currentIndex = 0;

// --- Deck finished ---
if (currentDeck.length === 0) {
  // show only one clean message
  els.status.innerHTML = `
    🎉 Bravo ! Vous avez maîtrisé ces questions.<br><br>
    <button id="changeTheme" class="btn" type="button">Changer de thème</button>
  `;

  // hide the flashcard itself and clear its texts
  els.qText.textContent = "";
  els.aText.textContent = "";
  els.card.classList.add("placeholder");
  els.card.style.display = "block";

  // attach reset logic to the button
  const btn = document.getElementById("changeTheme");
  if (btn) {
    btn.addEventListener("click", () => {
      // 1️⃣ unselect topics
      document.querySelectorAll(".topic-toggle.active").forEach(el =>
        el.classList.remove("active")
      );

      // 2️⃣ reset deck & counters
      currentDeck = [];
      currentIndex = 0;
      mastered.clear();

      // 3️⃣ restore placeholder appearance and message
      els.card.classList.add("placeholder");
      els.status.textContent = "Sélectionnez un thème pour commencer.";
      els.card.style.display = "block";

      // 4️⃣ scroll to topic area
      if (els.topicsWrapper)
        els.topicsWrapper.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // stop further execution
  return;
}


  // --- Normal case ---
  els.card.style.display = "block";
  els.status.textContent = `${currentDeck.length} cartes restantes.`;
  showCard();
}

// --- Show card content ---
function showCard() {
  if (!currentDeck.length) return;
  const q = currentDeck[currentIndex];
  els.qText.textContent = q.q;

  const correct = q.options.find(o => o.correct);
  els.aText.textContent = correct ? correct.t : "—";

  els.card.classList.remove("flipped");
  els.status.textContent = `Carte ${currentIndex + 1} / ${currentDeck.length}`;
}

// --- Flip card ---
function flipCard() {
  els.card.classList.toggle("flipped");
}

// --- Mark as known ---
function markKnown() {
  if (!currentDeck.length) return;
  const q = currentDeck[currentIndex];
  mastered.add(q.id);
  saveMastered();

  currentDeck.splice(currentIndex, 1);
  if (currentDeck.length === 0) {
    updateDeck();
    return;
  }
  if (currentIndex >= currentDeck.length) currentIndex = 0;
  showCard();
}

// --- Mark as review (no status change) ---
function markAgain() {
  nextCard();
}

// --- Navigation ---
function nextCard() {
  if (!currentDeck.length) return;
  currentIndex = (currentIndex + 1) % currentDeck.length;
  showCard();
}

function prevCard() {
  if (!currentDeck.length) return;
  currentIndex = (currentIndex - 1 + currentDeck.length) % currentDeck.length;
  showCard();
}

// --- Event listeners ---
els.flip.addEventListener("click", flipCard);
els.known.addEventListener("click", markKnown);
els.again.addEventListener("click", markAgain);
els.next.addEventListener("click", nextCard);
els.prev.addEventListener("click", prevCard);

// --- Init ---
loadMastered();
loadBank();

// --- Init ---
loadMastered();
loadBank();

// --- Force placeholder on load if nothing selected ---
if (document.querySelectorAll(".topic-toggle.active").length === 0) {
  els.card.classList.add("placeholder");
  els.status.textContent = "Sélectionnez un thème pour commencer.";
  els.card.style.display = "block";
}
