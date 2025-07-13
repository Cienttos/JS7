export function renderScoreboard(scores) {
  // Creamos una copia del arreglo y lo ordenamos:
  // primero por mejor puntaje (descendente),
  // si hay empate, por mejor tiempo (ascendente)
  const ordenados = [...scores].sort((a, b) => {
    return b.best_score - a.best_score || a.best_time - b.best_time;
  });

  // Retornamos un string con la tabla HTML para mostrar los scores
  return `
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th>Pos</th>
          <th>Jugador</th>
          <th>Score</th>
          <th>Tiempo</th>
        </tr>
      </thead>
      <tbody>
        ${ordenados
          .map(
            (s, i) => `
          <tr>
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
  `;
}
