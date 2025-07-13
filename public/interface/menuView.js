// Importamos la función que crea la tabla de scores
import { renderScoreboard } from "./scoreboardView.js";

// Función que muestra el menú principal de la app
// Recibe datos y funciones para manejar eventos
export function renderMenuView({ app, user, scores, currentGame, onLogout, onPlay }) {
  // Actualizamos el contenido del contenedor principal (app)
  app.innerHTML = `
    <h2>Bienvenido${user.name ? ", " + user.name : ""}</h2>  <!-- Saludo con el nombre si existe -->
    <h3>Tabla de Scores</h3>
    ${scores.length === 0 ? `<p>No hay scores disponibles</p>` : renderScoreboard(scores)}  <!-- Tabla o mensaje -->
    <div>
      <button id="btnJugar">Jugar Ahora</button>       <!-- Botón para comenzar a jugar -->
      <button id="btnCerrarSesion">Cerrar Sesión</button>  <!-- Botón para cerrar sesión -->
    </div>
  `;

  // Asignamos las funciones que se ejecutan al hacer clic en los botones
  document.getElementById("btnCerrarSesion").onclick = onLogout;
  document.getElementById("btnJugar").onclick = onPlay;
}
