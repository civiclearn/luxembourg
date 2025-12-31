document.addEventListener("DOMContentLoaded", () => {
  // ---------- UTIL ----------
  const $ = (s) => document.querySelector(s);

  // ---------- PROGRESS GAUGE (animated) ----------
(function initProgressGauge() {
  const g = document.querySelector('.gauge[data-kind="progress"]');
  if (!g) return;
  const circle = g.querySelector('.arc');
  const r = 34, C = 2 * Math.PI * r;
  const target = parseFloat(g.getAttribute('data-value') || '0');
  let current = 0;

  // 🧩 If target is 0, immediately clear ring
  if (target <= 0) {
    circle.setAttribute('stroke-dasharray', `0 ${C.toFixed(1)}`);
    return;
  }

  const step = target / 30;
  const anim = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(anim); }
    circle.setAttribute(
      'stroke-dasharray',
      `${(C * current).toFixed(1)} ${C.toFixed(1)}`
    );
  }, 20);
})();


  // ---------- MINI BARS (optional, only if #miniBars exists) ----------
  (function miniBars() {
    const el = $('#miniBars');
    if (!el) return;
    const minutes = [12, 30, 18, 45, 60, 22, 10];
    const max = Math.max(...minutes, 60);
    minutes.forEach((m, i) => {
      const b = document.createElement('div');
      b.className = 'b' + (m >= 40 ? ' hot' : '');
      b.style.height = ((m / max) * 100) + '%';
      b.title = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'][i] + ' — ' + m + ' min';
      el.appendChild(b);
    });
  })();

  // ---------- DÉCOUVERTES DU JOUR ----------
  let discoveryIndex = 0;
  let discoveriesData = null;

  async function loadDiscoveries(forceNext = false) {
    const grid = document.getElementById("discoveriesGrid");
    if (!grid) return;

    try {
      if (!discoveriesData) {
        const res = await fetch("../banks/canada-fr/cards.json");
        if (!res.ok) throw new Error("no cards");
        discoveriesData = await res.json();
      }

      const data = discoveriesData;
      const max = Math.min(data.people.length, data.places.length, data.dates.length);

      if (forceNext) discoveryIndex = (discoveryIndex + 1) % max;
      if (!forceNext && discoveryIndex === 0) {
        const today = new Date().getDate();
        discoveryIndex = today % max;
      }

      const items = [
        data.people[discoveryIndex],
        data.places[discoveryIndex],
        data.dates[discoveryIndex]
      ];

      grid.innerHTML = items.map(item => `
        <div class="discovery-card">
          <img src="${item.img}" alt="${item.name}">
          <div class="discovery-overlay"></div>
          <div class="discovery-text">
            <h4>${item.name}</h4>
            <p>${item.text}</p>
          </div>
        </div>
      `).join("");
    } catch (_) {
      const sec = document.querySelector(".discoveries-section");
      if (sec) sec.style.display = "none";
    }
  }
  loadDiscoveries();
  const discoverNextBtn = document.getElementById("discoverNext");
  if (discoverNextBtn) discoverNextBtn.addEventListener("click", () => loadDiscoveries(true));

  // ---------- SMART TILE (Question du jour / Fait du jour) ----------
  (async function initSmartTile() {
    const tile = document.getElementById("smartTile");
    if (!tile) return;

    const qBox = document.getElementById("smartQuestion");
    const aBox = document.getElementById("smartAnswers");
    const questionState = document.getElementById("questionState");
    const factState = document.getElementById("factState");
    const factBox = document.getElementById("smartFact");

    const TODAY_KEY = "smartTileDate";
    const QID_KEY = "smartTileID";
    const today = new Date().toISOString().slice(0, 10);

    const funFacts = [
      { text: "Le drapeau canadien a été adopté en 1965." },
      { text: "Le mot « Canada » vient de l’iroquois « Kanata », qui signifie village." },
      { text: "Ottawa est la capitale du Canada depuis 1857." },
      { text: "Le Canada compte 10 provinces et 3 territoires." },
      { text: "Le Nunavut, créé en 1999, est le plus vaste territoire canadien." },
      { text: "La feuille d’érable est un symbole du Canada depuis plus de 150 ans." },
      { text: "Le français et l’anglais sont les deux langues officielles du Canada." },
      { text: "Le Canada possède la plus longue frontière du monde avec les États-Unis." },
      { text: "La Gendarmerie royale du Canada a été fondée en 1873." },
      { text: "La devise du Canada est « A mari usque ad mare » — D’un océan à l’autre." },
      { text: "Le premier Premier ministre du Canada fut Sir John A. Macdonald." },
      { text: "Le totem est un symbole important des peuples autochtones de la côte ouest." },
      { text: "Le Canada abrite environ 60 % des lacs du monde." },
      { text: "Le sirop d’érable est produit principalement au Québec." },
      { text: "Le hockey sur glace est considéré comme le sport national d’hiver." },
      { text: "Le castor est l’animal emblématique du Canada depuis 1975." },
      { text: "Le drapeau du Canada s’appelle parfois l’Unifolié." },
      { text: "Le lac Supérieur est le plus grand lac d’eau douce au monde." },
      { text: "La population canadienne dépasse 40 millions d’habitants." },
      { text: "Les Canadiens célèbrent leur fête nationale le 1er juillet." },
      { text: "La Charte canadienne des droits et libertés date de 1982." },
      { text: "Le Canada est membre du Commonwealth et de la Francophonie." },
      { text: "Toronto est la plus grande ville du pays." },
      { text: "Le parc national Banff, créé en 1885, est le plus ancien du Canada." },
      { text: "Le Canada utilise le dollar canadien comme monnaie officielle." },
      { text: "Le pays compte six fuseaux horaires différents." },
      { text: "Le climat du Canada varie du subarctique au tempéré océanique." },
      { text: "Le pont de la Confédération relie l’Île-du-Prince-Édouard au continent." },
      { text: "Le bilinguisme officiel a été proclamé en 1969." },
      { text: "Les forêts couvrent environ la moitié du territoire canadien." }
    ];

    async function loadBank() {
      const urls = ["../banks/canada-fr/questions.json", "/banks/canada-fr/questions.json"];
      for (const url of urls) {
        try {
          const r = await fetch(url);
          if (!r.ok) continue;
          const j = await r.json();
          if (Array.isArray(j.questions)) {
            return j.questions.filter(q => q.q && Array.isArray(q.options));
          }
        } catch (_) {}
      }
      return [];
    }

    function showToast(msg, color = "#16a34a") {
      const toast = document.createElement("div");
      toast.textContent = msg;
      toast.style.cssText = `
        position:absolute;top:8px;right:10px;padding:4px 10px;
        background:${color};color:#fff;border-radius:6px;
        font-size:13px;opacity:0;transition:opacity .3s ease;
      `;
      tile.appendChild(toast);
      requestAnimationFrame(() => toast.style.opacity = 1);
      setTimeout(() => { toast.style.opacity = 0; }, 1000);
      setTimeout(() => toast.remove(), 1400);
    }

    function showFact() {
      const f = funFacts[Math.floor(Math.random() * funFacts.length)];
      factBox.textContent = f.text;
      questionState.style.opacity = 0;
      factState.style.opacity = 0;
      setTimeout(() => {
        questionState.style.display = "none";
        factState.style.display = "block";
        tile.classList.add("fact-mode");
        factState.animate(
          [{ transform: "translateY(10px)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
          { duration: 800, easing: "ease-out", fill: "forwards" }
        );
      }, 400);
    }

    const bank = await loadBank();
    const storedDate = localStorage.getItem(TODAY_KEY);
    const storedID = localStorage.getItem(QID_KEY);

    let q;
    if (storedDate === today && storedID && bank.length) {
      q = bank.find(item => item.id === storedID) || null;
    }
    if (!q) {
      q = bank.length
        ? bank[Math.floor(Math.random() * bank.length)]
        : {
            q: "Quel est l’animal national du Canada ?",
            options: [
              { t: "Le castor", correct: true },
              { t: "Le caribou" },
              { t: "L’ours" },
              { t: "Le loup" }
            ]
          };
      if (bank.length) {
        localStorage.setItem(TODAY_KEY, today);
        localStorage.setItem(QID_KEY, q.id || "");
      }
    }

    qBox.textContent = q.q;
    aBox.innerHTML = "";
    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt.t;
      btn.addEventListener("click", () => {
        aBox.querySelectorAll("button").forEach(b => b.disabled = true);

        if (opt.correct) {
          btn.style.background = "#dcfce7";
          btn.style.borderColor = "#22c55e";
          showToast("Bonne réponse !", "#16a34a");
        } else {
          btn.style.background = "#fee2e2";
          btn.style.borderColor = "#ef4444";
          const correctBtn = Array.from(aBox.querySelectorAll("button")).find(b => {
            const original = q.options.find(o => o.t === b.textContent);
            return original?.correct;
          });
          if (correctBtn) {
            correctBtn.style.background = "#dcfce7";
            correctBtn.style.borderColor = "#22c55e";
          }
          showToast("Mauvaise réponse…", "#dc2626");
        }

        setTimeout(showFact, 1000);
      }, { once: true });

      aBox.appendChild(btn);
    });
  })();

  // ---------- MICRO-BARS (Questions pratiquées) ----------
  (function initQSpark() {
    const el = document.getElementById("qSpark");
    if (!el) return;
    const ctx = el.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, 40);
    grad.addColorStop(0, "rgba(123,110,246,0.9)");
    grad.addColorStop(1, "rgba(123,110,246,0.4)");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"],
        datasets: [{
          data: [6, 12, 9, 15, 18, 10, 14],
          backgroundColor: grad,
          borderRadius: 4,
          borderSkipped: false,
          barThickness: 10
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: { x: { display: false }, y: { display: false } },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        animation: { duration: 800, easing: "easeOutQuart" }
      }
    });
  })();

  // ---------- GOVERNMENT ROTATION ----------
  const govData = [
    { name: "Charles III", role: "Roi du Canada", img: "../assets/images/govt/charles-iii.jpg" },
    { name: "Mary Simon", role: "Gouverneure générale du Canada", img: "../assets/images/govt/mary-simon.jpg" },
    { name: "Mark Carney", role: "Premier ministre du Canada", img: "../assets/images/govt/mark-carney.jpg" },
    { name: "Pierre Poilievre", role: "Chef de l’opposition officielle", img: "../assets/images/govt/pierre-poilievre.jpg" },
    { name: "Sean Fraser", role: "Procureur général et ministre de la Justice", img: "../assets/images/govt/sean-fraser.jpg" },
    { name: "François Legault", role: "Premier ministre du Québec", img: "../assets/images/govt/francois-legault.jpg" },
    { name: "Manon Jeannotte", role: "Lieutenante-gouverneure du Québec", img: "../assets/images/govt/manon-jeannotte.jpg" },
    { name: "Richard Wagner", role: "Président de la Cour suprême du Canada", img: "../assets/images/govt/richard-wagner.jpg" }
  ];
  let govIndex = 0;
  let autoRotateTimer = null;

  function renderGovCards() {
    const grid = document.getElementById("govGrid");
    if (!grid) return;
    grid.classList.add("fade-out");
    setTimeout(() => {
      grid.innerHTML = "";
      const pair = govData.slice(govIndex, govIndex + 2);
      pair.forEach(p => {
        const div = document.createElement("div");
        div.className = "card gov-square";
        div.innerHTML = `
          <img src="${p.img}" alt="${p.role}">
          <div class="gov-label">
            <div class="gov-role">${p.role}</div>
            <div class="gov-name">${p.name}</div>
          </div>
        `;
        div.addEventListener("click", nextGovPair);
        grid.appendChild(div);
      });
      grid.classList.remove("fade-out");
    }, 300);
  }
  function nextGovPair() { govIndex = (govIndex + 2) % govData.length; renderGovCards(); restartAutoRotation(); }
  function startAutoRotation() { autoRotateTimer = setInterval(() => nextGovPair(), 10000); }
  function restartAutoRotation() { clearInterval(autoRotateTimer); startAutoRotation(); }

  (function initGov() {
    const grid = document.getElementById("govGrid");
    if (!grid) return;
    const today = new Date().getDate();
    govIndex = (today * 2) % govData.length;
    renderGovCards();
    startAutoRotation();
  })();

  // ---------- COUNTDOWN ----------
  (function initCountdown() {
    const countdownValue = document.getElementById("countdownValue");
    const setup = document.getElementById("countdownSetup");
    const edit = document.getElementById("countdownEdit");
    const picker = document.getElementById("testDatePicker");
    const saveBtn = document.getElementById("saveTestDate");
    if (!countdownValue || !setup || !picker || !saveBtn) return;

    function renderCountdown() {
      const saved = localStorage.getItem("civicedge_testDate");
 if (!saved) {
  setup.style.display = "block";
  countdownValue.textContent = "Aucune date";
  if (edit) edit.style.display = "none";

  // 🪄 Hide ring + mark body as "no-date"
  document.body.classList.add("no-date");
  const ring = document.querySelector(".countdown-ring");
  if (ring) ring.style.display = "none";

  return;
}

      const today = new Date();
      const testDate = new Date(saved);
      const diff = Math.ceil((testDate - today) / (1000 * 60 * 60 * 24));
      countdownValue.textContent = diff >= 0 ? `J-${diff}` : "Terminé";
	  // 🪄 Restore ring + remove "no-date"
document.body.classList.remove("no-date");
const ring = document.querySelector(".countdown-ring");
if (ring) ring.style.display = "block";


      const fg = document.querySelector(".countdown-ring .fg");
      if (fg) {
        const startDate = localStorage.getItem("civicedge_startDate");
        if (startDate) {
          const start = new Date(startDate);
          const totalSpan = Math.max(1, Math.ceil((testDate - start) / (1000 * 60 * 60 * 24)));
          const elapsed = Math.min(totalSpan, Math.max(0, Math.ceil((today - start) / (1000 * 60 * 60 * 24))));
          const pct = (elapsed / totalSpan) * 100;
          fg.style.setProperty("--progress", pct.toFixed(1));
        } else {
          fg.style.setProperty("--progress", "0");
        }
      }
      setup.style.display = "none";
      if (edit) edit.style.display = "block";
    }

    saveBtn.addEventListener("click", () => {
      const val = picker.value;
      if (!val) { alert("Veuillez choisir une date."); return; }
      localStorage.setItem("civicedge_testDate", val);
      if (!localStorage.getItem("civicedge_startDate")) {
        localStorage.setItem("civicedge_startDate", new Date().toISOString().split("T")[0]);
      }
      renderCountdown();
    });

    if (edit) {
      edit.addEventListener("click", () => {
        setup.style.display = "block";
        edit.style.display = "none";
      });
    }

    renderCountdown();
  })();

  // ---------- READING TOGGLE ----------
  (function initReadingToggle() {
    const btn = document.getElementById("readingToggle");
    if (!btn) return;
    const assist = localStorage.getItem("civicedge_readingAssist") === "1";
    updateIcon(assist);
    btn.addEventListener("click", () => {
      const current = localStorage.getItem("civicedge_readingAssist") === "1";
      const newState = !current;
      localStorage.setItem("civicedge_readingAssist", newState ? "1" : "0");
      updateIcon(newState);
    });
    function updateIcon(state) {
      if (state) {
        btn.textContent = "🔊";
        btn.title = "Aide à la lecture activée";
        btn.classList.add("active");
      } else {
        btn.textContent = "🔇";
        btn.title = "Aide à la lecture désactivée";
        btn.classList.remove("active");
      }
    }
  })();

  // ---------- BANK + TOPIC PROGRESS + CHARTS ----------
  (async function initProgressAndCharts() {
    // Load bank
    let bank = [];
    try {
      const r = await fetch("../banks/canada-fr/questions.json");
      const data = await r.json();
      bank = data.questions || [];
    } catch (_) {}

    const topics = ["citoyennete","canadiens","histoire","moderne","gouvernement","elections","justice","symboles","economie","regions"];

    function computeTopicProgress() {
      const progress = JSON.parse(localStorage.getItem("civicedge_progress") || "{}");
      const stats = {};
      for (const t of topics) stats[t] = { correct: 0, attempts: 0, total: 0 };
      for (const q of bank) if (stats[q.topic]) stats[q.topic].total++;

      for (const [key, val] of Object.entries(progress)) {
        const [topic] = key.split(":");
        const t = topic.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (stats[t]) {
          stats[t].attempts += val.attempts || 0;
          stats[t].correct  += val.correct || 0;
        }
      }
      return stats;
    }

    function computeGlobalFromTopics() {
      const progress = JSON.parse(localStorage.getItem("civicedge_progress") || "{}");
      const totalQuestions = bank.length || 1;
      const masteredCount = Object.keys(progress).filter(k => (progress[k]?.correct || 0) > 0).length;
      const globalPct = Math.round((masteredCount / totalQuestions) * 100);
      return { globalPct, totalAttempts: masteredCount };
    }

    function renderTopicDashboard() {
      const progress = JSON.parse(localStorage.getItem("civicedge_progress") || "{}");
      document.querySelectorAll(".chapter-card").forEach(card => {
        const t = card.dataset.topic;
        const bar = card.querySelector(".bar-fill");
        const val = card.querySelector(".chapter-value");

        const totalInTopic = bank.filter(q =>
          q.topic.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"") === t
        ).length || 1;

        const mastered = Object.keys(progress).filter(k => {
          const topicKey = k.split(":")[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
          return topicKey === t && (progress[k].correct || 0) > 0;
        }).length;

        const pct = Math.round((mastered / totalInTopic) * 100);
        if (bar) bar.style.width = pct + "%";
        if (val) val.textContent = pct + "%";
      });
    }

    function drawCharts(stats) {
      const days = [], masteryByDay = [], studyByDay = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now); d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString("fr-FR", { weekday: "short" });
        days.push(label);
        const sameDay = Array.isArray(stats) ? stats.filter(s => new Date(s.date).toDateString() === d.toDateString()) : [];
        const dailyPct = sameDay.length
          ? Math.round(sameDay.reduce((sum, s) => sum + (s.percent || 0), 0) / sameDay.length)
          : 0;
        masteryByDay.push(dailyPct);
        const minSum = sameDay.reduce((sum, s) => sum + (s.durationMin || 0), 0);
        studyByDay.push(minSum);
      }

      const ctx1 = document.getElementById("progressChart");
      const ctx2 = document.getElementById("statsChart");

      if (ctx1) {
        new Chart(ctx1, {
          type: "line",
          data: {
            labels: days,
            datasets: [{
              data: masteryByDay,
              tension: .3,
              borderColor: "rgba(120,90,255,.9)",
              backgroundColor: "rgba(120,90,255,.25)",
              fill: true,
              pointRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { min: 0, max: 100 } }
          }
        });
      }

      if (ctx2) {
        new Chart(ctx2, {
          type: "bar",
          data: {
            labels: days,
            datasets: [{ data: studyByDay, backgroundColor: "rgba(120,90,255,.7)", borderRadius: 6 }]
          },
          options: {
            plugins: { legend: { display: false } },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 10, callback: (v) => `${v} min` },
                title: { display: true, text: "Minutes d’étude" }
              }
            }
          }
        });
      }
    }

    function updateDashboard() {
      const topicStats = computeTopicProgress();
      const { globalPct, totalAttempts } = computeGlobalFromTopics();

      const gauge = document.querySelector('.gauge[data-kind="progress"]');
      if (gauge) gauge.setAttribute('data-value', (globalPct / 100).toFixed(3));

      renderTopicDashboard();

      const gEl = document.querySelector("#overallPct,.globalPct");
      const qEl = document.querySelector("#qCount,.qCount");
      if (gEl) gEl.textContent = globalPct + "%";
      if (qEl) qEl.textContent = totalAttempts;

      const rhythmEl = document.getElementById("globalRhythm");
      const ratioEl  = document.getElementById("globalRatio");
      if (rhythmEl) {
        const stats = JSON.parse(localStorage.getItem("civicedge_stats") || "[]");
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const recent = stats.filter(s => new Date(s.date).getTime() >= sevenDaysAgo);
        let startPct = 0;
        if (recent.length) startPct = recent[0].percent || 0;
        const delta = globalPct - startPct;
        if (delta < 1) rhythmEl.textContent = "À améliorer";
        else if (delta < 3) rhythmEl.textContent = "Rythme stable";
        else if (delta < 6) rhythmEl.textContent = "Bon rythme";
        else rhythmEl.textContent = "Excellent rythme";
      }
      if (ratioEl) {
        const progress = JSON.parse(localStorage.getItem("civicedge_progress") || "{}");
        const mastered = Object.keys(progress).filter(k => (progress[k]?.correct || 0) > 0).length;
        ratioEl.textContent = `${mastered} / ${bank.length} questions maîtrisées`;
      }

      const stats = JSON.parse(localStorage.getItem("civicedge_stats") || "[]");
      drawCharts(stats);
    }

    updateDashboard();
  })();

  // ---------- LOGOUT ----------
  (function initLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;
    logoutBtn.addEventListener("click", async () => {
      if (window.MemberStack && typeof window.MemberStack.logout === "function") {
        await window.MemberStack.logout();
      } else {
        alert("Déconnexion non disponible (Memberstack non chargé).");
      }
    });
  })();

  // ---------- WEEKLY STUDY TIME ----------
  (function weeklyStudyTime() {
    const el = document.getElementById("studyTimeLine");
    if (!el) return;

    try {
      const stats = JSON.parse(localStorage.getItem("civicedge_stats") || "[]");
      if (!Array.isArray(stats) || stats.length === 0) {
        el.innerHTML = "Commencez votre premier entraînement aujourd’hui !";
        return;
      }
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 6);
      const recent = stats.filter(s => new Date(s.date) >= weekAgo);
      if (recent.length === 0) {
        el.innerHTML = "Vous n’avez pas encore étudié cette semaine.";
        return;
      }
      const totalMin = recent.reduce((sum, s) => sum + (s.durationMin || 0), 0);
      const h = Math.floor(totalMin / 60);
      const m = totalMin % 60;
      let timeStr = "";
      if (h > 0) timeStr += `${h} h `;
      timeStr += `${m} m`;
      el.innerHTML = `Vous avez étudié <strong>${timeStr}</strong> cette semaine.`;
    } catch (_) {}
  })();
});
// === MOBILE MENU TOGGLE ===
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".menu-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      document.body.classList.toggle("menu-open");
    });
  }
});
// === MOBILE MENU OVERLAY CLOSE ===
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("menuOverlay");
  const body = document.body;

  if (overlay) {
    overlay.addEventListener("click", () => {
      body.classList.remove("menu-open");
    });
  }
});
