// Función que recibe la lista de scores y el nombre del usuario actual
// y devuelve el HTML para mostrar la tabla del scoreboard
export function renderScoreboard(scores, currentUserName) {
  // Ordenamos los scores primero por mejor puntaje (descendente)
  // y en caso de empate, por mejor tiempo (ascendente)
  const ordenados = [...scores].sort((a, b) => {
    return b.best_score - a.best_score || a.best_time - b.best_time;
  });

  // Esperamos un ciclo para asegurarnos que el DOM esté renderizado
  // para luego agregar el evento al botón de descarga PDF
  setTimeout(() => {
    const downloadButton = document.getElementById("downloadPDF");
    if (downloadButton) {
      // Al hacer clic en el botón de descargar
      downloadButton.addEventListener("click", async () => {
        // Obtenemos la librería jsPDF desde el objeto window
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Configuramos título del PDF
        doc.setFontSize(18);
        doc.text("Scoreboard", 14, 20);

        // Tomamos las filas de la tabla en el DOM y extraemos el texto de cada celda
        const table = document.querySelector("#scoreTable");
        const rows = [...table.querySelectorAll("tbody tr")].map(tr => {
          return [...tr.querySelectorAll("td")].map(td => td.textContent);
        });

        // Encabezados para la tabla en el PDF
        const headers = ["Pos", "Jugador", "Score", "Tiempo"];

        // Usamos autoTable para crear tabla dentro del PDF con los datos
        doc.autoTable({
          head: [headers],
          body: rows,
          startY: 30,
        });

        // Guardamos el PDF con nombre "scoreboard.pdf"
        doc.save("scoreboard.pdf");
      });
    }
  }, 0);

  // Retornamos el HTML de la tabla, resaltando al usuario actual
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
