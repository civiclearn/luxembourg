/* CivicEdge Engine – Phase 2 (Autopilot-by-default) */
// === CivicEdge Settings Loader (theme, font, reading assist) ===
(() => {
  try {
    // Theme
    const theme = localStorage.getItem("civicedge_theme");
    if (theme) document.documentElement.dataset.theme = theme;

    // Font size
    const font = localStorage.getItem("civicedge_fontSize");
    if (font) document.body.style.fontSize = font + "px";


  } catch (err) {
    console.error("Settings loader failed", err);
  }
})();

// === CONFETTI EFFECT (final tuned version – fast & realistic) ===
function launchConfetti() {
  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 9999,
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  const colors = ["#22c55e", "#3b82f6", "#fbbf24", "#f87171", "#a78bfa"];
  const pieces = Array.from({ length: 180 }, () => ({
    x: Math.random() * W,
    y: -Math.random() * H * 0.5,        // start near top
    size: 2 + Math.random() * 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    vy: 3 + Math.random() * 6,          // vertical speed: much faster
    vx: (Math.random() - 0.5) * 2,      // small horizontal drift
    rotation: Math.random() * 2 * Math.PI,
    rspeed: (Math.random() - 0.5) * 0.3,
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rspeed;

      // recycle piece when it leaves bottom
      if (p.y > H + 10) {
        p.y = -10 - Math.random() * H * 0.2;
        p.x = Math.random() * W;
        p.vy = 3 + Math.random() * 6;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }
    raf = requestAnimationFrame(draw);
  }

  let raf = requestAnimationFrame(draw);

  // stop after 2.5s
  setTimeout(() => {
    cancelAnimationFrame(raf);
    canvas.remove();
  }, 2500);
}
let lastConfig = null; // cache last quiz setup for restarts


async function initQuiz(config) {
	  // NEW — full attempt log
  config.__sessionLog = [];
	// Detect mode
if (config?.quick) {
  window.CIVIC_MODE = "quick"
} else if (config?.simulation) {
  window.CIVIC_MODE = "simulation";
} else if (config?.recursive) {
  window.CIVIC_MODE = "topics";
} else {
  window.CIVIC_MODE = "traps";
}
	window.__ceSessionStart = performance.now();
	lastConfig = config; // remember current setup
  // === visual flash on question card ===
  function flashCard(correct) {
    const card = document.querySelector(".ce-card");
    if (!card) return;
    const cls = correct ? "flash-green" : "flash-red";
    card.classList.add(cls);
    setTimeout(() => card.classList.remove(cls), 500);
  }
  const mount = document.getElementById("quiz");
  if (!mount) { console.error("Missing #quiz container"); return; }

  const {
    bank,
    limit = 20,                // fixed spoonful
    timed = false,
    recursive = true,          // re-ask wrongs until all correct
    showFeedback = true,       // display feedback bubbles when available
    simulation = false         // simulation = one pass, no feedback, timer by default
  } = config;

  let timerInterval = null;
  let timeLeft = 0;
  let data = [];

  // --- Load questions ---
  if (Array.isArray(bank)) {
    data = bank;
  } else if (Array.isArray(window[bank])) {
    data = window[bank];
  } else {
   try {
  const res = await fetch(bank);
  const raw = await res.json();
  data = Array.isArray(raw) ? raw : (raw.questions || []);
  console.log("✅ Loaded", Array.isArray(data) ? data.length : 0, "questions");
  window.__ceTotalQuestions = data.length;
} catch (e) {
  mount.innerHTML = `<p>Impossible de charger la banque de questions.</p>`;
  console.error("Erreur de chargement du fichier JSON", e);
  return;
}

  }

  if (!Array.isArray(data) || data.length === 0) {
    mount.innerHTML = `<p>Banque vide.</p>`;
    return;
  }

// --- Prepare question set (Autopilot = only unmastered; Simulation keeps all) ---
let pool = data;

if (recursive && !simulation) {
  try {
    const progress = JSON.parse(localStorage.getItem("civicedge_progress") || "{}");
    // Keep only questions not yet mastered (normal recursive logic)
    pool = data.filter(q => {
      const key = `${q.topic}:${q.q}`;
      return !progress[key] || progress[key].correct === 0;
    });
  } catch (_) {
    pool = data;
  }
}

// --- Handle case when there’s nothing left to practice ---
if (!Array.isArray(pool) || pool.length === 0) {
  mount.innerHTML = `
    <div class="ce-card">
      <h2>Tout est maîtrisé 🎉</h2>
      <p>Ce sujet est entièrement maîtrisé. Choisissez un autre sujet pour continuer à progresser.</p>
      <div class="ce-actions">
        <button id="ce-return" class="btn-primary">Retour</button>
      </div>
    </div>
  `;

  const btn = document.getElementById("ce-return");
  if (btn) {
    btn.addEventListener("click", () => {
      mount.innerHTML = "";
      window.scrollTo(0, 0);
      if (window.CivicEdge?.openDashboard) {
        window.CivicEdge.openDashboard();
      }
    });
  }
  return;
}

// --- Shuffle and slice the question set normally ---
const shuffled = [...pool].sort(() => Math.random() - 0.5);
let questions = shuffled.slice(0, Math.min(limit, shuffled.length));



  // runtime
  let idx = 0;
  let score = 0;
  let wrong = [];
  let completed = [];

  // === RENDER QUESTION ===
  function renderQuestion() {
    const q = questions[idx];

      if (!q) {
    // recursion loop for Autopilot-like behavior
    if (recursive && wrong.length > 0) {
      questions = [...wrong];
      wrong = [];
      idx = 0;
      renderQuestion();
      return;
    }
    return renderEnd();
  }

  // shuffle options
  const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);


    // answer buttons + optional per-option TTS
    const opts = shuffledOptions
      .map((o, i) => `
        <div class="ce-opt-wrap">
          <button class="ce-opt" data-correct="${o.correct ? "1" : "0"}">${o.t}</button>
          ${window.readingAssistEnabled ? `<button class="tts-opt" data-text="${o.t}" aria-label="Lire la réponse ${i + 1}">🔊</button>` : ""}
        </div>
      `)
      .join("");

    mount.innerHTML = `
      <div class="ce-card">
        <div class="ce-head">
          <div>Question ${idx + 1} / ${questions.length}</div>
          <div class="ce-topic">${q.topic || ""}</div>
        </div>
        <h2 class="ce-q">
          ${q.q}
          ${window.readingAssistEnabled ? '<button class="tts-btn" aria-label="Lire la question">🔊</button>' : ""}
        </h2>
        <div class="ce-opts">${opts}</div>
        <div id="ce-feedback" class="ce-feedback" style="display:none;"></div>
        <div class="ce-actions" style="display:none;">
          <button id="ce-next">Suivant</button>
        </div>
      </div>
    `;

    // clicks on answers
   document.querySelectorAll(".ce-opt").forEach((btn) => {
  btn.addEventListener("click", () => {
    const correct = btn.getAttribute("data-correct") === "1";

    // --- ensure civicedge_stats exists ---
    let stats = {};
    try {
      stats = JSON.parse(localStorage.getItem("civicedge_stats") || "{}");
      if (stats === null || typeof stats !== "object" || Array.isArray(stats)) {
        stats = { totalAnswered: 0, history: [] };
      }
    } catch (_) {
      stats = { totalAnswered: 0, history: [] };
    }

    // always ensure history exists
    if (!Array.isArray(stats.history)) stats.history = [];

    // --- increment totalAnswered ---
    stats.totalAnswered = (parseInt(stats.totalAnswered, 10) || 0) + 1;
    localStorage.setItem("civicedge_stats", JSON.stringify(stats));

    // --- increment totalCorrect / totalWrong ---
    if (correct) {
      stats.totalCorrect = (parseInt(stats.totalCorrect, 10) || 0) + 1;
    } else {
      stats.totalWrong = (parseInt(stats.totalWrong, 10) || 0) + 1;
    }
    localStorage.setItem("civicedge_stats", JSON.stringify(stats));

    // --- lock options ---
    document.querySelectorAll(".ce-opt").forEach((b) => {
      b.disabled = true;
      if (showFeedback && !correct && b.getAttribute("data-correct") === "1") {
        b.classList.add("ce-yes");
      }
    });

    btn.classList.add(correct ? "ce-yes" : "ce-no");
    flashCard(correct);

    // feedback bubble
    const fbEl = document.getElementById("ce-feedback");
    const hasFb = !!(q.feedback && q.feedback.trim().length > 0);
    if (showFeedback && hasFb) {
      fbEl.textContent = q.feedback;
      fbEl.style.display = "block";
    }

    // Reading Assist: confirmation
    if (window.readingAssistEnabled) {
      const msg = new SpeechSynthesisUtterance(correct ? "Bonne réponse !" : "Mauvaise réponse !");
      msg.lang = "fr-FR";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(msg);
    }

    // record user answer
    q._userAnswer = btn.textContent;
    q._userCorrect = correct;
// === SAFE ATTEMPT LOGGING (per attempt) ===
if (config && config.__sessionLog) {
  config.__sessionLog.push({
    id: q.id || q.q,
    q: q.q,
    topic: q.topic || null,
    userAnswer: q._userAnswer,
    correctAnswer: (q.options.find(o => o.correct) || {}).t || null,
    _userCorrect: q._userCorrect
  });
}

    // --- total Questions Answered counter (global) ---
    try {
      let tqa = parseInt(localStorage.getItem("civicedge_totalAnswered") || "0", 10);
      tqa++;
      localStorage.setItem("civicedge_totalAnswered", tqa.toString());
    } catch (_) {}

    // === Unified progress tracking ===
    try {
      const progress = JSON.parse(localStorage.getItem("civicedge_progress") || "{}");
      const key = `${q.topic}:${q.q}`;
      if (!progress[key]) {
        progress[key] = { attempts: 0, correct: 0, wrongs: 0, rights: 0 };
      }

      const rec = progress[key];
      rec.attempts++;

      if (correct) {
        rec.correct++;
        rec.rights = (rec.rights || 0) + 1; 
      } else {
        rec.wrongs = (rec.wrongs || 0) + 1;
      }

      localStorage.setItem("civicedge_progress", JSON.stringify(progress));
    } catch (_) {}

    updateProgressBar();

    if (correct) score++;
    if (recursive) {
      if (correct) completed.push(q);
      else wrong.push(q);
    }

    // show NEXT button
    const actions = document.querySelector(".ce-actions");
    actions.style.display = "block";
    document.getElementById("ce-next").onclick = () => {
      idx++;
      renderQuestion();
    };

    // --- Quick progress bar ---
    try {
      const bar = document.getElementById("quickProgress");
      if (bar && questions.length <= 5) {
        const pct = ((idx + 1) / questions.length) * 100;
        bar.style.width = `${pct}%`;
      }
    } catch (e) {
      console.warn("Progress bar update skipped", e);
    }

  });
});


    // Reading Assist for question
    if (window.readingAssistEnabled) {
      const ttsBtn = document.querySelector(".tts-btn");
      if (ttsBtn) {
        ttsBtn.addEventListener("click", () => {
          const msg = new SpeechSynthesisUtterance(q.q);
          msg.lang = "fr-FR";
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(msg);
        });
      }
    }

    // Reading Assist for options
    if (window.readingAssistEnabled) {
      document.querySelectorAll(".tts-opt").forEach(btn => {
        btn.addEventListener("click", () => {
          const text = btn.getAttribute("data-text");
          const msg = new SpeechSynthesisUtterance(text);
          msg.lang = "fr-FR";
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(msg);
        });
      });
    }
  // --- Quick progress initial draw (Q1) ---
try {
  const bar = document.getElementById("quickProgress");
  if (bar && questions.length <= 5) {
    const pct = ((idx + 1) / questions.length) * 100;
    bar.style.width = `${pct}%`;
  }
} catch (e) {
  console.warn("Initial progress bar draw skipped", e);
}

  
  } // renderQuestion

 // === END SCREEN ===
function renderEnd() {
  // ensure unanswered are treated as wrong (timer expiry case)
  questions.forEach(q => {
    if (q._userCorrect === undefined) q._userCorrect = false;
  });

  // recompute score
  score = questions.filter(q => q._userCorrect).length;
  const percent = Math.round((score / questions.length) * 100);

  let html = `<div class="ce-card"><h2>Résultat</h2>`;

    if (config?.quick) {
    // Quick Test summary
    html += `
      <h2>Test rapide terminé ✅</h2>
      <p>Vous pouvez relancer un autre ensemble de 5 questions.</p>
      <div class="ce-actions">
        <button id="restartBtn">Rejouer un test rapide</button>
      </div>
    `;
  }
else if (recursive && !simulation) {
  // Full mastery case (topic completed)
  const isChapterMode = !!document.getElementById("backManual");
  html += `
    <h2>Tout est maîtrisé 🎉</h2>
    <p>Ce sujet est entièrement maîtrisé. ${isChapterMode
      ? "Utilisez le bouton « ← Retour au chapitre » sous le test pour revenir à la lecture."
      : "Choisissez un autre sujet."
    }</p>
    ${isChapterMode ? "" : `
      <div class="ce-actions">
        <button id="restartBtn" class="btn-primary">Retour</button>
      </div>
    `}
  `;
  launchConfetti();
  // 🔔 tell chapter.html that this batch is finished
  document.dispatchEvent(new Event("quizEnded"));


	

  } else {
    html += `
      <p>Score : <strong>${score}</strong> / ${questions.length} (${percent} %)</p>
      ${simulation ? `
        <p style="font-size:18px;margin-top:10px">
          ${score >= 15 ? "✅ <strong>Réussi</strong> — Félicitations !" : "❌ <strong>Échoué</strong> — Vous pouvez réessayer."}
        </p>
      ` : ""}
      <div class="ce-actions">
        ${percent === 100 ? "" : `<button id="reviewBtn">Revoir les erreurs</button>`}
        <button id="restartBtn">Recommencer</button>
      </div>
    `;
  }

  html += `</div>`;
  mount.innerHTML = html;

// === RETOUR / RECOMMENCER BEHAVIOUR ===
const restart = document.getElementById("restartBtn");
if (restart) {
  restart.addEventListener("click", () => {
if (config?.quick) {
  window.CIVIC_MODE = "quick";

  quizArea.innerHTML = '<div id="quiz"></div>';
        initQuiz({
           bank,
           limit: 5,
           timed: false,
           recursive: false,
           showFeedback: true,
           simulation: false,
           quick: true
  });
  return;
}


    if (recursive && !simulation) {
      // Full mastery → back to dashboard view
      mount.innerHTML = "";
      window.scrollTo(0, 0);
      if (window.CivicEdge?.openDashboard) {
        window.CivicEdge.openDashboard();
      }
      document.dispatchEvent(new Event("quizEnded"));
      return;
    }

    // Default case → restart same quiz
    initQuiz({
      bank,
      limit,
      timed,
      recursive,
      showFeedback,
      simulation,
    });
  });
}

const review = document.getElementById("reviewBtn");
if (review) review.addEventListener("click", renderReview);

// === CivicEdge Statistics Tracker ===
try {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const stats = JSON.parse(localStorage.getItem("civicedge_stats") || "{}");
  if (!stats.totalMinutes) stats.totalMinutes = 0;
  const existing = stats.history?.find(s => s.date === today);
  let durationMin = Math.round(((performance.now() - (window.__ceSessionStart || performance.timing.navigationStart)) / 60000));
if (durationMin < 1) durationMin = 1;  // ensure at least 1 minute logged
// --- add this session's duration to cumulative total ---
stats.totalMinutes += durationMin;
// --- save updated cumulative study time ---
localStorage.setItem("civicedge_stats", JSON.stringify(stats));

const sessionData = {
  date: today,
  timestamp: now.toISOString(),

  // --- FIXED: use full session log for correct totals ---
  score: (config.__sessionLog || []).filter(q => q._userCorrect).length,
  total: (config.__sessionLog || []).length,
  percent: (() => {
    const t = (config.__sessionLog || []).length;
    const s = (config.__sessionLog || []).filter(q => q._userCorrect).length;
    return t > 0 ? Math.round((s / t) * 100) : 0;
  })(),

  // NEW: real test mode
  mode: window.CIVIC_MODE || "unknown",

  // Only keep topic if Test à Mesure
  topic:
    window.CIVIC_MODE === "topics" && questions[0] && questions[0].topic
      ? questions[0].topic
      : null,

  durationMin
};


  sessionData.questions = (config.__sessionLog || []).map(q => ({
  id: q.id || q.q,
  q: q.q,
  topic: q.topic || null,
  userAnswer: q.userAnswer || null,
  correctAnswer: q.correctAnswer || null,
  correct: !!q._userCorrect
}));


  stats.history = stats.history || [];
  stats.history.push({
    ...sessionData,
    sessions: 1,
    avgScore: sessionData.percent
  });

  localStorage.setItem("civicedge_stats", JSON.stringify(stats));
} catch (err) {
  console.error("Stats tracking failed", err);
}
} 
  // === REVIEW ===
  function renderReview() {
    const wrongQs = questions.filter(q => q._userAnswer && !q._userCorrect);

    if (wrongQs.length === 0) {
      document.getElementById("quiz").innerHTML = `
        <div class="ce-card">
          <h2>Aucune erreur 🎉</h2>
          <p>Vous avez répondu correctement à toutes les questions.</p>
          <div class="ce-actions">
  <button id="reviewRestart">Recommencer</button>
</div>
        </div>
      `;
      return;
    }

    const list = wrongQs.map(q => {
      const correctOpt = q.options.find(o => o.correct);
      const userOpt = q.options.find(o => o.t === q._userAnswer);
      return `
        <div class="ce-card" style="margin-bottom:12px">
          <div class="ce-head">${q.topic || ""}</div>
          <h3>${q.q}</h3>
          <p><strong>Votre réponse :</strong> <span style="color:#dc2626">${userOpt ? userOpt.t : "—"}</span></p>
          <p><strong>Bonne réponse :</strong> <span style="color:#16a34a">${correctOpt ? correctOpt.t : ""}</span></p>
          ${q.feedback && q.feedback.trim().length ? `<div class="ce-feedback">${q.feedback}</div>` : ""}
        </div>
      `;
    }).join("");

document.getElementById("quiz").innerHTML = `
  <div>
    <h2>Vos erreurs</h2>
    ${list}
    <div class="ce-actions" style="margin-top:20px">
      <button id="reviewRestart">Recommencer</button>
    </div>
  </div>
`;

// Restart the same quiz setup (for Simulation mode)
const reviewRestart = document.getElementById("reviewRestart");
if (reviewRestart) {
  reviewRestart.addEventListener("click", async () => {
    if (!lastConfig) return;

    const cfg = { ...lastConfig };

    if (typeof cfg.bank === "string") {
      try {
        const res = await fetch(cfg.bank);
        const raw = await res.json();
        cfg.bank = Array.isArray(raw) ? raw : (raw.questions || []);
      } catch (e) {
        console.error("Erreur lors du rechargement du bank:", e);
        document.getElementById("quiz").innerHTML =
          "<p>Impossible de préparer la simulation.</p>";
        return;
      }
    }

    initQuiz(cfg);
  });
}


  }

// === TIMER — Circular Ring (header-aware, left-aligned) ===
if (timed) {
  const header = document.querySelector(".ce-header-top");
  const oldTimer = document.getElementById("ce-timer-ring");
  if (oldTimer) oldTimer.remove();
  if (header) {
    const ringWrap = document.createElement("div");
    ringWrap.id = "ce-timer-ring";
    ringWrap.innerHTML = `
      <svg viewBox="0 0 36 36">
        <path class="track" stroke="#e5e7eb" stroke-width="3" fill="none"
              d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0 -32" />
        <path class="fill" stroke="var(--brand)" stroke-width="3" fill="none"
              stroke-linecap="round" stroke-dasharray="100,100"
              d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0 -32" />
        <text x="18" y="21" text-anchor="middle" class="time">30:00</text>
      </svg>`;
    header.prepend(ringWrap);
  }

  let total = 30 * 60;        // 30 min default
  let remaining = total;
  const fill = document.querySelector("#ce-timer-ring .fill");
  const text = document.querySelector("#ce-timer-ring .time");

  function update() {
    const mins = Math.floor(remaining / 60);
    const secs = String(remaining % 60).padStart(2, "0");
    const pct = (remaining / total) * 100;
    if (fill) fill.style.strokeDasharray = `${pct},100`;
    if (text) text.textContent = `${mins}:${secs}`;
  }

  update();
  const interval = setInterval(() => {
    remaining--;
    update();
    // --- visual & final warning ---
if (remaining === 10) {
  if (fill) fill.style.stroke = "#f59e0b"; // amber pulse
  if (text) text.style.fill = "#b45309";
  const ring = document.getElementById("ce-timer-ring");
  if (ring) ring.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }],
    { duration: 800, iterations: 5 }
  );
}

if (remaining <= 0) {
  clearInterval(interval);

  // brief "time's up" banner before ending
  const card = document.querySelector(".ce-card");
  if (card) {
    const banner = document.createElement("div");
    banner.textContent = "⏰ Temps écoulé !";
    banner.style.cssText = `
      background:#fee2e2;
      color:#b91c1c;
      text-align:center;
      font-weight:700;
      padding:12px;
      border-radius:12px;
      margin-bottom:16px;
      animation: fadeIn .5s ease-in;
    `;
    card.prepend(banner);
    setTimeout(() => renderEnd(), 1200);
  } else {
    renderEnd();
  }
}

  }, 1000);

  window.__ceTimerInterval = interval;
  window.__ceStopTimer = () => {
    clearInterval(window.__ceTimerInterval);
    const ring = document.getElementById("ce-timer-ring");
    if (ring) ring.remove();
  };
}

  renderQuestion();
}
// === DASHBOARD ENHANCEMENTS ===

// Reset all progress
const resetAllBtn = document.getElementById("resetAll");
if (resetAllBtn) {
  resetAllBtn.addEventListener("click", () => {
    if (!confirm("Voulez-vous vraiment effacer tous vos progrès ?")) return;

    // existing
    localStorage.removeItem("civicedge_progress");

    // === NEW: reset total questions answered ===
    localStorage.removeItem("civicedge_totalAnswered");

    // (optional but recommended) clear stats/history if used by dashboard-v2
    localStorage.removeItem("civicedge_stats");
    localStorage.removeItem("civicedge_topics");

    location.reload();
  });
}

// --- Test à mesure (Custom Test, new logic: select topics to include) ---
const startBtn = document.getElementById("startCustom");
if (startBtn) {
  let customFirstClick = true;

  startBtn.addEventListener("click", async () => {
    const topicsWrap = document.getElementById("topicsWrapper");
    const topicContainer = document.getElementById("topicContainer");

    // first click → show topics
    if (customFirstClick) {
      customFirstClick = false;
      topicsWrap.classList.remove("hidden");

      // unselect all topics by default (new logic)
      document.querySelectorAll(".topic-toggle").forEach(t => t.classList.remove("active"));

      // hint for user
      if (!document.getElementById("topicHint")) {
        const hint = document.createElement("p");
        hint.id = "topicHint";
        hint.textContent = "Cochez les sujets à inclure puis cliquez à nouveau sur Test à mesure pour commencer.";
        hint.style.cssText = "text-align:center;margin-top:0.6rem;color:#555;font-style:italic;";
        topicsWrap.parentNode.insertBefore(hint, topicsWrap.nextSibling);
      }
      return;
    }

    // second click → start quiz
    const activeTopics = Array.from(document.querySelectorAll(".topic-toggle.active")).map(el => el.dataset.topic);
    const quizArea = document.getElementById("quizArea");
    quizArea.innerHTML = "<div id='quiz'></div>";

    try {
      const res = await fetch("../banks/canada-fr/questions.json");
      const raw = await res.json();
      const allData = Array.isArray(raw) ? raw : (raw.questions || []);
      const filtered = activeTopics.length ? allData.filter(q => activeTopics.includes(q.topic)) : allData;
	  window.__ceTotalQuestions = allData.length;

      window.CIVIC_MODE = "topics";

      initQuiz({
        bank: filtered,
        limit: 20,
        timed: false,
        recursive: true,
        showFeedback: true,
        simulation: false
});

    } catch (e) {
      console.error("Erreur pendant le chargement du test", e);
      quizArea.innerHTML = "<p>Impossible de préparer la simulation.</p>";
    }

    // hide topics again for next time
    topicsWrap.classList.add("hidden");
    const hintEl = document.getElementById("topicHint");
    if (hintEl) hintEl.remove();
    customFirstClick = true;
    document.getElementById("ce-dashboard").classList.remove("open");
  });
}

// Pièges fréquents launcher
const trapsBtn = document.getElementById("startTraps");
if (trapsBtn) {
  trapsBtn.addEventListener("click", async () => {
    const res = await fetch("../banks/canada-fr/questions.json");
    const raw = await res.json();
    const data = Array.isArray(raw) ? raw : (raw.questions || []);

    let progress = {};
    try { progress = JSON.parse(localStorage.getItem("civicedge_progress") || "{}"); } catch (_) {}
    const trickyKeys = Object.keys(progress).filter(k => progress[k].attempts >= 3 && progress[k].correct === 0);
    const trickySet = data.filter(q => trickyKeys.includes(`${q.topic}:${q.q}`));

    const quizArea = document.getElementById("quizArea");
    quizArea.innerHTML = trickySet.length
      ? '<div id="quiz"></div>'
      : `<div class="ce-card"><h2>Aucune question récurrente 🎉</h2>
          <p>Vous n’avez pas de questions souvent ratées.</p></div>`;

    if (trickySet.length > 0) {
      window.CIVIC_MODE = "traps";

        initQuiz({
          bank: trickySet,
          limit: trickySet.length,
          timed: false,
          recursive: false,
          showFeedback: true,
          simulation: false
});

    }

    document.getElementById("ce-dashboard").classList.remove("open");
  });
}

/* Minimal fallback styles (keep) */
function injectMinimalStyles() {
  if (document.getElementById("ce-min-css")) return;
  const css = `
  .ce-card{background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,.08);}
  .ce-head{display:flex;justify-content:space-between;color:#667085;margin-bottom:8px;font-size:14px}
  .ce-q{font-size:20px;margin:8px 0 16px}
  .ce-opts{display:grid;gap:8px}
  .ce-opt{padding:12px 14px;border-radius:10px;border:1px solid #e6e6e6;background:#f9fafb;cursor:pointer;text-align:left}
  .ce-opt:hover{background:#f3f4f6}
  .ce-opt.ce-yes{background:#e7f9ed;border-color:#34c759}
  .ce-opt.ce-no{background:#fde8e8;border-color:#f87171}
  .ce-feedback{margin-top:12px;padding:12px;border-left:4px solid #16a34a;background:#f0fdf4}
  .ce-actions{margin-top:16px}
  .ce-actions button{padding:10px 14px;border-radius:10px;border:0;background:#0ea5e9;color:#fff;cursor:pointer}
  #ce-timer{margin-bottom:12px;height:8px;background:#e5e7eb;border-radius:8px;position:relative;overflow:hidden}
  .ce-timer-inner{position:absolute;top:0;left:0;height:100%;background:#10b981;width:100%;transition:width 1s linear}
  #ce-timer-label{position:absolute;right:10px;top:-20px;font-size:13px;color:#555}
  `;
  const tag = document.createElement("style");
  tag.id = "ce-min-css";
  tag.textContent = css;
  document.head.appendChild(tag);
}

// === CivicEdge Progress Bar — clean version, no icons ===
async function updateProgressBar(totalInBank) {
  const bar = document.getElementById("progressBar");
  if (!bar) return;

  const g = bar.querySelector(".progressFillGreen");
  const r = bar.querySelector(".progressFillRed");
  const label = document.getElementById("progressLabel");

  // auto-detect total if not provided
  if (!totalInBank) {
    try {
      const res = await fetch("../banks/canada-fr/questions.json");
      const raw = await res.json();
      const data = Array.isArray(raw) ? raw : (raw.questions || []);
      totalInBank = data.length || 500;
    } catch (_) {
      totalInBank = 500;
    }
  }

  // read stored progress
  let progress = {};
  try {
    progress = JSON.parse(localStorage.getItem("civicedge_progress") || "{}");
  } catch (_) {}

  const mastered = Object.values(progress).filter(p => p.correct > 0).length;
  const wronged  = Object.values(progress).filter(p => p.attempts > 0 && p.correct === 0).length;

  const masteredPct = Math.max(0, Math.min(100, (mastered / totalInBank) * 100));
  const wrongPct    = Math.max(0, Math.min(100, (wronged  / totalInBank) * 100));

  if (g) g.style.width = masteredPct + "%";
  if (r) r.style.width = wrongPct + "%";

  // label text (no 📅 icon)
  let daysText = "";
  try {
    const savedDate = localStorage.getItem("civicedge_testDate");
    if (savedDate) {
      const diff = Math.ceil((new Date(savedDate) - new Date()) / (1000 * 60 * 60 * 24));
      const days = diff >= 0 ? diff : 0;
      daysText = `${days} jour${days !== 1 ? "s" : ""} restants`;
    }
  } catch (_) {}

  const masteryText = `· Maîtrise : ${Math.round(masteredPct)}%`;
  if (label) label.textContent = `${daysText} ${masteryText}`.trim();
}

// initial render
updateProgressBar();

/// === CivicEdge: floating dashboard button (draggable + functional) ===
(function () {
  const dash = document.getElementById("ce-dashboard");
  const openDash = document.getElementById("openDashboard");
  const closeDash = document.getElementById("ce-close");

  // ✅ Ensure open/close always work
  if (openDash && dash) {
    openDash.addEventListener("click", () => dash.classList.add("open"));
  }
  if (closeDash && dash) {
    closeDash.addEventListener("click", () => dash.classList.remove("open"));
  }

  // === Draggable behaviour (desktop only) ===
  const btn = document.querySelector(".ce-floating-btn");
  if (!btn) return;

  // Skip dragging on touch devices
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

  let offsetX = 0,
    offsetY = 0,
    isDragging = false;

  const startDrag = (e) => {
    isDragging = true;
    offsetX = e.clientX - btn.getBoundingClientRect().left;
    offsetY = e.clientY - btn.getBoundingClientRect().top;
    btn.style.transition = "none";
  };

  const moveDrag = (e) => {
    if (!isDragging) return;
    btn.style.left = e.clientX - offsetX + "px";
    btn.style.top = e.clientY - offsetY + "px";
    btn.style.right = "auto";
    btn.style.bottom = "auto";
  };

  const endDrag = () => {
    isDragging = false;
    btn.style.transition = "";
  };

  btn.addEventListener("mousedown", startDrag);
  window.addEventListener("mousemove", moveDrag);
  window.addEventListener("mouseup", endDrag);
})();
document.addEventListener("DOMContentLoaded", () => {
  // === Sidebar collapsible — Manuel Officiel ===
  const manualToggle = document.getElementById("manualToggle");
  const subnav = document.getElementById("chaptersSubnav");
  if (manualToggle && subnav) {
    const open = localStorage.getItem("manualMenuOpen") === "true";
    if (open) {
      manualToggle.classList.add("open");
      subnav.classList.add("show");
    }
    manualToggle.addEventListener("click", e => {
      e.preventDefault();
      manualToggle.classList.toggle("open");
      subnav.classList.toggle("show");
      localStorage.setItem("manualMenuOpen", manualToggle.classList.contains("open"));
    });
	
	// --- Auto-collapse when clicking any chapter link ---
subnav.querySelectorAll("a.sub").forEach(link => {
  link.addEventListener("click", () => {
    manualToggle.classList.remove("open");
    subnav.classList.remove("show");
    localStorage.setItem("manualMenuOpen", "false");
  });
});

  }

  // === CivicEdge Manual Loader (centralized) ===
  const manualFrame = document.getElementById("manualFrame");
    if (manualFrame) {
    const params = new URLSearchParams(window.location.search);
    const chapter = params.get("chapter");
    // Always resolve path from /dashboard/
    const basePath = window.location.pathname.includes("/dashboard/")
      ? "./manual/chapters/"
      : "dashboard/manual/chapters/";

    manualFrame.src = chapter
      ? `${basePath}${chapter}.html`
      : `${basePath}cover.html`;
  }

});
