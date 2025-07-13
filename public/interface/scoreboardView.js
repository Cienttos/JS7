export function renderScoreboard(scores, currentUserName) {
  // Ordenamos scores igual que antes
  const ordenados = [...scores].sort((a, b) => {
    return b.best_score - a.best_score || a.best_time - b.best_time;
  });

  return `
  <div class="table-scroll sticky-table">
    <table border="1" style="border-collapse: collapse; width: 100%;">
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
  `;
}
