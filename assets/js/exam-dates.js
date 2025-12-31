(async function () {
  try {
    const res = await fetch("/assets/data/official-exams.json");
    if (!res.ok) return;

    const data = await res.json();
    const today = new Date();

    function nextDate(entries) {
  return entries
    .map(e => new Date(`${e.date}T${e.time}`))
    .filter(d => d >= today)
    .sort((a, b) => a - b)[0];
}


    function formatDate(date, lang) {
      return date.toLocaleDateString(lang, {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    }

    const fr = nextDate(data.languages.fr);
    const en = nextDate(data.languages.en);
    const de = nextDate(data.languages.de);

    if (fr) {
      document.getElementById("exam-date-fr").textContent =
        formatDate(fr, "fr-FR");
    }

    if (en) {
      document.getElementById("exam-date-en").textContent =
        formatDate(en, "en-GB");
    }

    if (de) {
      document.getElementById("exam-date-de").textContent =
        formatDate(de, "de-DE");
    }

    const updated = new Date(data.last_updated).toLocaleDateString("fr-FR");

    const meta = document.getElementById("exam-dates-meta");
    if (meta) {
      meta.textContent =
        `Source officielle : ${data.source} · Mis à jour le ${updated}`;
    }

  } catch (e) {
    /* fail silently */
  }
})();
