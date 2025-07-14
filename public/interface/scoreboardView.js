export function renderScoreboard(scores, currentUserName) {
  const ordenados = [...scores].sort((a, b) => {
    return b.best_score - a.best_score || a.best_time - b.best_time;
  });

  // Esperamos al renderizado del DOM para agregar evento
  setTimeout(() => {
    const downloadButton = document.getElementById("downloadPDF");
    if (downloadButton) {
      downloadButton.addEventListener("click", async () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Scoreboard", 14, 20);

        const table = document.querySelector("#scoreTable");
        const rows = [...table.querySelectorAll("tbody tr")].map(tr => {
          return [...tr.querySelectorAll("td")].map(td => td.textContent);
        });

        const headers = ["Pos", "Jugador", "Score", "Tiempo"];

        doc.autoTable({
          head: [headers],
          body: rows,
          startY: 30,
        });

        doc.save("scoreboard.pdf");
      });
    }
  }, 0);

  return `
    <div class="table-scroll">
      <table id="scoreTable" border="1">
        <thead>
          <tr><th>Pos</th><th>Jugador</th><th>Score</th><th>Tiempo</th></tr>
        </thead>
        <tbody>
          ${ordenados
            .map(
              (s, i) => `
            <tr class="${s.user_name === currentUserName ? "highlight-row" : ""}">
              <td>${i + 1}</td>
              <td>${s.user_name}</td>
              <td>${s.best_score}</td>
              <td>${s.best_time}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <div class="btn-container">
      <button id="downloadPDF">Descargar Score</button>
    </div>
  `;
}
