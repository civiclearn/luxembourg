/* ===============================
   CivicEdge Reading Assist
   Standalone Module (robust)
   =============================== */

(function () {
  const STORAGE_KEY = "civicedge_readingAssist";

  // Load state from localStorage
  let enabled = false;
  try {
    enabled = localStorage.getItem(STORAGE_KEY) === "1";
  } catch (_) {
    enabled = false;
  }

  // Make globally readable immediately
  window.readingAssistEnabled = enabled;

  // Update toggle button UI
  function updateButton() {
    const btn = document.getElementById("readingToggle");
    if (!btn) return;

    btn.textContent = enabled ? "🔊" : "🔇";
    btn.title = enabled
      ? "Aide à la lecture (activée)"
      : "Aide à la lecture (désactivée)";
  }

  // Central setter
  function setEnabled(value) {
    enabled = !!value;
    window.readingAssistEnabled = enabled;

    try {
      localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
    } catch (_) {}

    updateButton();
  }

  // Toggle handler
  function toggleReadingAssist() {
    setEnabled(!enabled);

    // Optional confirmation voice
    try {
      const msg = new SpeechSynthesisUtterance(
        enabled ? "Aide à la lecture activée" : "Aide à la lecture désactivée"
      );
      msg.lang = "fr-FR";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(msg);
    } catch (_) {}
  }

  // Bind to current button (safe even if called many times)
  function initReadingToggle() {
    const btn = document.getElementById("readingToggle");
    if (!btn) return;

    // Prevent double-binding
    if (!btn.dataset.ceReadingBound) {
      btn.addEventListener("click", toggleReadingAssist);
      btn.dataset.ceReadingBound = "1";
    }

    updateButton();
  }

  // Bind on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReadingToggle);
  } else {
    initReadingToggle();
  }

  // === RE-BIND WHEN DASHBOARD OPENS ===
  // The dashboard replaces DOM nodes, including #readingToggle
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "openDashboard") {
      // Let the dashboard DOM update first
      setTimeout(initReadingToggle, 50);
    }
  });

  // Optional API
  window.CivicReading = {
    isEnabled: () => enabled,
    speak(text) {
      try {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = "fr-FR";
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
      } catch (_) {}
    },
  };
})();
