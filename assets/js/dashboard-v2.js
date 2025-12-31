// ../assets/js/dashboard-v2.js
// CivicLearn — New Dashboard Wiring (no engine.js changes required here)
// ---------------------------------------------------------------

(function () {
  document.addEventListener("DOMContentLoaded", initDashboard);

  // ---------- Small helpers ----------

  function loadJSON(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function formatMinutesToHhMm(totalMinutes) {
    const m = Math.max(0, Math.round(totalMinutes || 0));
    const h = Math.floor(m / 60);
    const rem = m % 60;
    const pad = (n) => (n < 10 ? "0" + n : "" + n);
    return h + "h " + pad(rem) + "m";
  }

  function formatMinutesShort(totalMinutes) {
    const m = Math.max(0, Math.round(totalMinutes || 0));
    const h = Math.floor(m / 60);
    const rem = m % 60;
    if (h === 0) return rem + " m";
    if (rem === 0) return h + " h";
    return h + " h " + rem + " m";
  }

  function safeText(el, value) {
    if (el) el.textContent = value;
  }

  // ---------- Data adapters (make best guess from engine) ----------

  function getStats() {
    // Expected typical shape (adjust if needed):
    // {
    //   totalAnswered, totalCorrect, totalWrong, totalSkipped,
    //   totalMinutes, weeklyMinutes, history: [...]
    // }
    const stats = loadJSON("civicedge_stats", {}) || {};

    const totalAnswered =
      stats.totalAnswered ??
      stats.answered ??
      0;

    const totalCorrect =
      stats.totalCorrect ??
      stats.correct ??
      0;

    const totalWrong =
      stats.totalWrong ??
      stats.wrong ??
      0;

    const totalSkipped =
      stats.totalSkipped ??
      stats.skipped ??
      0;

    const totalMinutes =
      stats.totalMinutes ??
      stats.totalStudyMinutes ??
      0;

    const weeklyMinutes =
      stats.weeklyMinutes ??
      stats.last7DaysMinutes ??
      0;

    // Session / daily history for the stacked area chart
    const history = Array.isArray(stats.history) ? stats.history : [];

    return {
      raw: stats,
      totalAnswered,
      totalCorrect,
      totalWrong,
      totalSkipped,
      totalMinutes,
      weeklyMinutes,
      history
    };
  }


function getProgress() {
  const raw = loadJSON("civicedge_progress", {}) || {};
  const totalQuestions = window.__ceTotalQuestions || 0;
  let masteredCount = 0;

  Object.keys(raw).forEach((key) => {
    const rec = raw[key] || {};

    // A question is mastered if it has EVER been answered correctly
    if ((rec.correct || rec.rights || 0) > 0) masteredCount++;
  });

  const mastery = totalQuestions > 0 ? masteredCount / totalQuestions : 0;

  return { raw, mastery, totalQuestions, masteredCount };
}

function getTopics() {
  const progress = loadJSON("civicedge_progress", {}) || {};

  // Normalizer → converts JSON topics into safe keys
  function normalizeTopic(t) {
    return t
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/le canada moderne/i, "moderne")
      .replace(/les canadiens/i, "canadiens")
      .replace(/\s+/g, "");
  }

  // 1) Count how many questions exist in each topic (from bank)
  const bank = window.__ceBank || [];
  const totalPerTopic = {};

  bank.forEach((q) => {
    const raw = q.topic || "";
    const t = normalizeTopic(raw);
    if (!totalPerTopic[t]) totalPerTopic[t] = 0;
    totalPerTopic[t]++;
  });

  // 2) Count how many questions answered in each topic (from progress)
  const answeredPerTopic = {};

  Object.keys(progress).forEach((key) => {
    const parts = key.split(":");
    if (parts.length < 2) return;

    const rawTopic = parts[0];
    const t = normalizeTopic(rawTopic);

    if (!answeredPerTopic[t]) answeredPerTopic[t] = 0;
    answeredPerTopic[t]++;
  });

  // 3) Compute coverage ratio
  const result = {};

  Object.keys(totalPerTopic).forEach((t) => {
    const total = totalPerTopic[t];
    const answered = answeredPerTopic[t] || 0;
    result[t] = {
      mastery: total > 0 ? answered / total : 0
    };
  });

  return result;
}

  // ---------- Reading toggle (Aide à la lecture) ----------

  function initReadingToggle() {
    const btn = document.getElementById("readingToggle");
    if (!btn) return;

    const STORAGE_KEY = "civicedge_readingAssist";
    const current = window.localStorage.getItem(STORAGE_KEY) === "on";

    applyReadingState(btn, current);

    btn.addEventListener("click", () => {
      const nowEnabled = !(window.localStorage.getItem(STORAGE_KEY) === "on");
      window.localStorage.setItem(STORAGE_KEY, nowEnabled ? "on" : "off");
      applyReadingState(btn, nowEnabled);

      // Optional: dispatch event so the audio player can react
      const ev = new CustomEvent("civicedge:reading-toggle", {
        detail: { enabled: nowEnabled }
      });
      document.dispatchEvent(ev);
    });
  }

  function applyReadingState(btn, enabled) {
    if (!btn) return;
    if (enabled) {
      btn.textContent = "🔊";
      btn.title = "Aide à la lecture (activée)";
    } else {
      btn.textContent = "🔇";
      btn.title = "Aide à la lecture (désactivée)";
    }
  }



function getStreakFromHistory(history) {
  if (!history || !Array.isArray(history) || history.length === 0) return 0;

  // extract unique dates
  const dates = [...new Set(history.map(s => s.date))];

  // sort newest → oldest
  dates.sort().reverse();

  const today = new Date();
  const format = d => d.toISOString().slice(0, 10);

  let streak = 0;
  let cursor = new Date(today);

  while (true) {
    const dateStr = format(cursor);

    if (dates.includes(dateStr)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1); // go to previous day
    } else {
      break; // streak ends
    }
  }

  return streak;
}

  // ---------- Charts ----------
  /* ----------------------------------------------------------
   ROLLING ACCURACY TREND (new bottom-right chart)
   ---------------------------------------------------------- */

function computeRollingAccuracy(history) {
  if (!Array.isArray(history) || history.length === 0) return [];

  // Sort by timestamp
  const sorted = [...history].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  // Extract % accuracy per session
  const accuracies = sorted.map(s => {
    const pct = Number(s.percent);
    return isNaN(pct) ? 0 : pct;
  });

  const WINDOW = 5; // rolling average window
  const output = [];

  for (let i = 0; i < accuracies.length; i++) {
    const start = Math.max(0, i - WINDOW + 1);
    const slice = accuracies.slice(start, i + 1);
    const avg =
      slice.reduce((a, b) => a + b, 0) / slice.length;

    output.push({
      label: String(i + 1),
      value: Math.round(avg)
    });
  }

  // Limit to last 20 points for readability
const MAX_POINTS = 20;
if (output.length > MAX_POINTS) {
  return output.slice(output.length - MAX_POINTS);
}
return output;
}

function initAccuracyTrendChart(history) {
  const canvas = document.getElementById("stackedAreaChart");
  if (!canvas) return;

  const data = computeRollingAccuracy(history);

  const labels = data.length ? data.map(d => d.label) : ["—"];
  const values = data.length ? data.map(d => d.value) : [0];

  const ctx = canvas.getContext("2d");

  // Destroy previous chart
  if (window.stackedAreaChartInstance) {
    window.stackedAreaChartInstance.destroy();
  }

  window.stackedAreaChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Précision (moyenne mobile)",
          data: values,
          borderColor: "#6A38FF",
          backgroundColor: "rgba(106, 56, 255, 0.12)",
          tension: 0.3,
          fill: true,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: "#6A38FF"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ctx.parsed.y + "% de précision"
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: { stepSize: 20 }
        },
        x: {
          ticks: {
            display: false   // hide X-axis labels
          },
          grid: {
            display: false   // hide vertical gridlines (optional)
          }
        }
      }
    }
  });
}


  
  // ---------- Load bank total (safe dashboard-only loader) ----------
async function loadBankSize() {
  if (window.__ceTotalQuestions) return; // already loaded
  
  try {
    const res = await fetch("/banks/canada-fr/questions.json");
    const raw = await res.json();
    const bank = Array.isArray(raw) ? raw : (raw.questions || []);
    window.__ceTotalQuestions = bank.length;
	window.__ceBank = bank;   
  } catch (err) {
    console.error("Error loading bank for donut:", err);
    window.__ceTotalQuestions = 0;
  }
}


  let globalChartInstance = null;
  let topicsChartInstance = null;
  let stackedAreaChartInstance = null;

  function initCharts(metrics, topics, history) {
	  loadBankSize();
	  if (!window.__ceTotalQuestions) {
  // Bank may not be loaded yet — try again shortly
  return setTimeout(() => initCharts(metrics, topics, history), 100);
}

    if (!window.Chart) return; // Chart.js not loaded

    initGlobalChart(metrics);
    initTopicsChart(topics);
    initAccuracyTrendChart(history);
  }

  function initGlobalChart(metrics) {
    const canvas = document.getElementById("globalChart");
    const pctEl = document.getElementById("globalPct");
    const answeredEl = document.getElementById("globalAnswered");
    if (!canvas) return;

    const masteryPercent = metrics.totalQuestions
  ? Math.round((metrics.masteredCount / metrics.totalQuestions) * 100)
  : 0;
    const answered = window.__ceTotalQuestions;

    safeText(pctEl, masteryPercent + "%");
    if (answeredEl) {
      safeText(
        answeredEl,
        (answered || 0).toLocaleString("fr-CA") + " questions"
      );
    }

    const ctx = canvas.getContext("2d");
    if (globalChartInstance) {
      globalChartInstance.destroy();
    }

    globalChartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Maîtrisé", "À travailler"],
        datasets: [
          {
            data: [
  metrics.masteredCount,
  Math.max(0, metrics.totalQuestions - metrics.masteredCount)
],
            backgroundColor: ["#6A38FF", "#E8E2FF"]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
  const total = metrics.totalQuestions || 0;
  const value = ctx.parsed;
  const pct = total ? Math.round((value / total) * 100) : 0;
  return `${ctx.label}: ${pct}%`;
}

            }
          }
        }
      }
    });
  }

function initTopicsChart(topics) {
  const canvas = document.getElementById("topicsChart");
  if (!canvas) return;

  const keys = Object.keys(topics || {});
  if (!keys.length) {
    const ctx = canvas.getContext("2d");
    if (topicsChartInstance) topicsChartInstance.destroy();
    topicsChartInstance = new Chart(ctx, {
      type: "bar",
      data: { labels: ["Aucun thème"], datasets: [{ data: [0] }] },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { min: 0, max: 100 }, y: { ticks: { font: { family: "Space Grotesk" }}}}
      }
    });
    return;
  }

  const labelMap = {
    citoyennete: "Citoyenneté",
    canadiens: "Les Canadiens",
    histoire: "Histoire",
    moderne: "Canada moderne",
    gouvernement: "Gouvernement",
    elections: "Élections",
    justice: "Justice",
    symboles: "Symboles",
    economie: "Économie",
    regions: "Régions"
  };

  const labels = [];
  const values = [];

  keys.forEach((key) => {
    const topic = topics[key] || {};
    const rawMastery = topic.mastery ?? 0;
    const pct = Math.max(0, Math.min(100, Math.round(rawMastery * 100)));
    labels.push(labelMap[key] || key);
    values.push(pct);
  });

  const ctx = canvas.getContext("2d");
  if (topicsChartInstance) topicsChartInstance.destroy();

  topicsChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
  {
    data: values,
    backgroundColor: "#6A38FF",
    borderRadius: 6,
    barThickness: 14,       // thinner bars
    maxBarThickness: 14,
    categoryPercentage: 0.45, // controls total vertical space per category
    barPercentage: 0.65 
       // controls bar size inside that space
  }
]

    },
    options: {
      indexAxis: "y",                               // horizontal layout
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 10, bottom: 10 } },

      plugins: {
        legend: { display: false },
        tooltip: {
          titleFont: { family: "Space Grotesk", size: 14 },
          bodyFont: { family: "Space Grotesk", size: 13 },
          callbacks: {
            label: (ctx) => ctx.raw + "% maîtrisé"
          }
        }
      },

      scales: {
        x: {
          min: 0,
          max: 100,
          grid: { display: false },
          ticks: {
            font: { family: "Space Grotesk", size: 12 },
            color: "#888"
          }
        },
        y: {
          grid: { display: false },
          ticks: {
            font: { family: "Space Grotesk", size: 13 },
            color: "#444",
            padding: 6
          }
        }
      }
    }
  });
}

  // ---------- Main init ----------

 async function initDashboard() {
    // 1) Reading toggle
    initReadingToggle();

    // 2) Countdown tile
  

    // 3) Load all base data
	await loadBankSize();
    const stats = getStats();
    const progress = getProgress();
	// update legacy gauge
const gauge = document.querySelector('.gauge[data-kind="progress"]');
if (gauge) {
  gauge.setAttribute('data-value', progress.mastery);
}

safeText(document.getElementById("overallPct"), Math.round(progress.mastery * 100) + "%");

// seen questions
const progressRaw = progress.raw || {};
const seen = Object.keys(progressRaw).length;
const total = progress.totalQuestions || 0;
safeText(document.getElementById("globalRatio"), `${seen} / ${total} questions vues`);

    const topics = getTopics();

    const accuracy =
      stats.totalAnswered > 0
        ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
        : 0;

// --- calculate daily study streak ---
    const streak = getStreakFromHistory(stats.history);


    // 4) Update top tiles
    const answeredEl = document.getElementById("tmAnswered");
    const accuracyEl = document.getElementById("tmAccuracy");
    const timeEl = document.getElementById("tmTime");
    const streakEl = document.getElementById("tmStreak");

    if (answeredEl) {
      safeText(
        answeredEl,
        (stats.totalAnswered || 0).toLocaleString("fr-CA")
      );
    }
    if (accuracyEl) {
      safeText(accuracyEl, accuracy + "%");
    }
    if (timeEl) {
      safeText(timeEl, formatMinutesToHhMm(stats.totalMinutes));
    }
    if (streakEl) {
      const n = streak || 0;
      safeText(streakEl, n + " jour" + (n > 1 ? "s" : ""));
    }
	
	// === FINAL COUNTDOWN ENGINE (Unified) ===

const sheet = document.getElementById("dateSheet");
const sheetOverlay = document.getElementById("dateSheetOverlay");
const openSheetBtn = document.getElementById("openDateSheet");

const modalInput = document.getElementById("sheetDateInput");
const displayInput = document.getElementById("examDateInput");

const countdownEl = document.getElementById("examCountdown");
const placeholderEl = document.getElementById("examNoDate");
const card = document.getElementById("countdownCard");

const STORAGE_KEY = "civicedge_testDate";

// -- Open bottom sheet --
if (openSheetBtn && sheet && sheetOverlay) {
  openSheetBtn.addEventListener("click", () => {
    sheet.classList.add("active");
    sheetOverlay.classList.add("active");

    // preload existing stored value
    const stored = window.localStorage.getItem(STORAGE_KEY) || "";
    modalInput.value = stored;
  });
}

// -- Close bottom sheet --
function closeSheet() {
  sheet.classList.remove("active");
  sheetOverlay.classList.remove("active");
}

const cancelBtn = document.getElementById("sheetCancel");
if (cancelBtn) cancelBtn.addEventListener("click", closeSheet);

// -- SAVE BUTTON --
const saveBtn = document.getElementById("sheetSave");
if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    const chosen = modalInput.value.trim();

    if (!chosen) {
      // No date chosen → reset everything
      window.localStorage.removeItem(STORAGE_KEY);
      displayInput.value = "";
      renderCountdown(null);
      closeSheet();
      return;
    }

    // Save to localStorage
    window.localStorage.setItem(STORAGE_KEY, chosen);

    // Update hidden input (internal state)
    displayInput.value = chosen;

    // Render countdown
    renderCountdown(chosen);

    closeSheet();
  });
}

// -- CALCULATE + RENDER COUNTDOWN & COLORS --
function renderCountdown(dateStr) {
  if (!dateStr) {
    // No date → show placeholder
    if (countdownEl) countdownEl.style.display = "none";
    if (placeholderEl) placeholderEl.style.display = "block";

    if (card) {
      card.classList.remove("countdown-soon", "countdown-urgent", "countdown-normal");
      card.classList.add("countdown-normal");
    }
    return;
  }

  const today = new Date();
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const target = new Date(dateStr + "T00:00:00");
  const diffDays = Math.round(
    (target.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Determine label
  let label = "";
  if (diffDays > 0) label = "J-" + diffDays;
  else if (diffDays === 0) label = "C’est aujourd’hui !";
  else label = "Terminé";

  // Show countdown
  if (countdownEl) {
    countdownEl.textContent = label;
    countdownEl.style.display = "block";
  }
  if (placeholderEl) {
    placeholderEl.style.display = "none";
  }

  // Color classes
  if (card) {
    card.classList.remove("countdown-soon", "countdown-urgent", "countdown-normal");

    if (diffDays <= 6) {
      card.classList.add("countdown-urgent");
    } else if (diffDays <= 14) {
      card.classList.add("countdown-soon");
    } else {
      card.classList.add("countdown-normal");
    }
  }
}

// -- RESTORE ON PAGE LOAD --
(function restoreCountdown() {
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    displayInput.value = "";
    renderCountdown(null);
    return;
  }

  displayInput.value = stored;
  renderCountdown(stored);
})();


    // 5) Update welcome header line ("Vous avez étudié ... cette semaine.")
    const headerP = document.querySelector(".db-page-header p");
    if (headerP) {
      const weekly = stats.weeklyMinutes || 0;
      const txt =
        weekly > 0
          ? "Vous avez étudié " +
            formatMinutesShort(weekly) +
            " cette semaine."
          : "Vous n’avez pas encore étudié cette semaine.";
      headerP.textContent = txt;
    }

    // 6) Init charts (global mastery, topics, evolution)
	
console.log("DEBUG: totalQuestions =", progress.totalQuestions);
console.log("DEBUG: masteredCount =", progress.masteredCount);
console.log("DEBUG: mastery =", progress.mastery);
console.log("DEBUG: progress.raw =", progress.raw);

initCharts(
  {
    mastery: progress.mastery,
    masteredCount: progress.masteredCount,
    totalQuestions: progress.totalQuestions
  },
  topics,
  stats.history
);

  }
})();
// === Dynamic Welcome Line (gender-neutral rotation) ===
(function () {
  const messages = [
    "Heureux de vous revoir.",
    "Envie de continuer l’entraînement ?",
    "Continuons votre progression.",
    "Votre entraînement vous attend.",
    "La constance mène au succès.",
    "On y retourne ?"
  ];

  function applyWelcomeMessage() {
    const target = document.getElementById("welcomeDynamic");
    if (target) {
      const pick = messages[Math.floor(Math.random() * messages.length)];
      target.textContent = pick;
    }
  }

  // Wait until the dashboard layout is fully drawn
  document.addEventListener("DOMContentLoaded", () => {
    applyWelcomeMessage();
    setTimeout(applyWelcomeMessage, 50);   // repaint tolerance
    setTimeout(applyWelcomeMessage, 150);  // final ensure
  });
})();

// === Legacy SVG Gauge animation ===
(function initProgressGauge() {
  const g = document.querySelector('.gauge[data-kind="progress"]');
  if (!g) return;

  const circle = g.querySelector('.arc');
  const r = 34;
  const C = 2 * Math.PI * r;

  const target = parseFloat(g.getAttribute('data-value') || '0');
  let current = 0;

  if (target <= 0) {
    circle.setAttribute('stroke-dasharray', `0 ${C.toFixed(1)}`);
    return;
  }

  const step = target / 30;
  const anim = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(anim);
    }
    circle.setAttribute(
      'stroke-dasharray',
      `${(C * current).toFixed(1)} ${C.toFixed(1)}`
    );
  }, 20);
})();
