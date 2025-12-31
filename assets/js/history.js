// Bank map: id/text -> question object
let bankMap = {};

async function loadBank() {
  try {
    const res = await fetch("../banks/canada-fr/questions.json");
    const raw = await res.json();
    const bank = Array.isArray(raw) ? raw : (raw.questions || []);
    bankMap = {};
    bank.forEach((q) => {
      const key = q.id || q.q;
      if (!key) return;
      bankMap[key] = q;
    });
  } catch (e) {
    console.error("Erreur lors du chargement de la banque de questions pour l'historique:", e);
    bankMap = {};
  }
}


  // Render history after DOM ready + bank loaded
  document.addEventListener("DOMContentLoaded", async () => {
    await loadBank();

    const stats = JSON.parse(localStorage.getItem("civicedge_stats") || "{}");
    const history = Array.isArray(stats.history) ? stats.history.slice() : [];

    // Newest → oldest
    history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const historyList = document.getElementById("historyList");
    const detailsPanel = document.getElementById("detailsPanel");

    if (!historyList) return;

    if (history.length === 0) {
      historyList.innerHTML = "<p>Aucune session enregistrée.</p>";
      return;
    }

    // Render each session line
    history.forEach((session) => {
      const d = new Date(session.timestamp);
      const dateStr = d.toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short"
      });

      const item = document.createElement("div");
      item.className = "history-item";
      item.innerHTML = `
  <div class="history-title">${dateStr} — ${
    session.mode === "simulation" ? "Simulation officielle" :
    session.mode === "quick"      ? "Test rapide" :
    session.mode === "topics"     ? "Test à mesure" :
    session.mode === "traps"      ? "Pièges fréquents" :
                                    "Session"
  }</div>
  <div class="history-meta">
    ${session.percent}% — ${session.total} questions — ${session.durationMin} min
  </div>
`;


      item.addEventListener("click", () => showDetails(session, item, detailsPanel));
      historyList.appendChild(item);
    });
  });

  function showDetails(session, anchorEl, detailsPanel) {
    if (!detailsPanel || !anchorEl) return;

    const d = new Date(session.timestamp);
    const longDate = d.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });

    let html = `
      <h2>Détails — ${longDate}</h2>
      <p><strong>Score :</strong> ${session.percent}% (${session.score}/${session.total})</p>
      <p><strong>Durée :</strong> ${session.durationMin} minutes</p>
      <hr>
      <h3>Questions de cette session</h3>
    `;

    const questions = Array.isArray(session.questions) ? session.questions : [];

    if (!questions.length) {
      html += `<p>Aucune question enregistrée pour cette session.</p>`;
  } else {

// --- GROUP ATTEMPTS BY QUESTION ID ---
const grouped = {};
questions.forEach((q) => {
  if (!grouped[q.id]) grouped[q.id] = [];
  grouped[q.id].push(q);
});

// --- RENDER GROUPED QUESTIONS ---
Object.keys(grouped).forEach((id, index) => {
  const attempts = grouped[id];
  const first = attempts[0];

  // final correct answer
  const correctAnswer = first.correctAnswer || "—";

  html += `
    <div class="question-row" style="border-left-width: 8px; border-left-color: ${
      attempts.at(-1).correct ? "#16a34a" : "#dc2626"
    }">
      <div class="q-id">Question ${index + 1}</div>

      <div><strong>${first.q}</strong></div>
      <div style="margin-top:6px;margin-bottom:6px;font-size:14px;color:#888">
        ${attempts.length} tentative${attempts.length > 1 ? "s" : ""}
      </div>

      <div style="margin-left:12px; margin-top:4px;">
  `;

  attempts.forEach((att, i) => {
    html += `
        <div style="margin-bottom:4px;">
          <strong>Tentative ${i + 1} :</strong>
          <span style="color:${att.correct ? "#16a34a" : "#dc2626"}">
            ${att.userAnswer}
          </span>
        </div>
    `;
  });

  html += `
      </div>

      <div style="margin-top:6px;">
        <strong>Bonne réponse :</strong>
        <span style="color:#16a34a">${correctAnswer}</span>
      </div>
    </div>
  `;
});

}
  

    html += `<a class="back-btn" href="#">Fermer</a>`;

    detailsPanel.innerHTML = html;
    detailsPanel.style.display = "block";

    // Move the panel right under the clicked session
    anchorEl.insertAdjacentElement("afterend", detailsPanel);

    // Close handler
    const backBtn = detailsPanel.querySelector(".back-btn");
    if (backBtn) {
      backBtn.onclick = (e) => {
        e.preventDefault();
        detailsPanel.style.display = "none";
      };
    }

    // Ensure it's visible even if list is long
    detailsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
