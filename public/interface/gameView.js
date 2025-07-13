import { apiFetch } from "../services/api.js";
import { mostrarError } from "../utils/helpers.js";
import { Timer } from "../utils/timer.js";
import { Snackbar } from "../utils/snackbar.js";

const snackbar = new Snackbar();

let timerInstance = null;

export function renderGameView({ app, game, user, onGameEnd }) {
  let tiempoSegundos = 0;
  let juegoTerminado = false;

  const getFrameImagePath = (intentos) => {
    const frameNumber = 7 - intentos;
    return `../img/f${frameNumber}.jpeg`;
  };

  const actualizarVista = (data) => {
    const jugadaInput = document.getElementById("inputJugada");
    const btnEnviar = document.getElementById("btnEnviar");

    game.palabraOculta = data.palabra_oculta.split("").join(" ");
    game.intentos = data.intentos;
    game.letrasIncorrectas = data.letras_incorrectas || [];
    game.score = typeof data.score === "number" ? data.score : game.score;

    document.getElementById("palabraOculta").textContent = game.palabraOculta;
    document.getElementById("letrasIncorrectas").textContent = game.letrasIncorrectas.join(", ");
    document.getElementById("score").textContent = game.score;
    document.getElementById("intentos").textContent = game.intentos;
    document.getElementById("ahorcadoImg").src = getFrameImagePath(game.intentos);

    // Si pierde
    if (game.intentos === 0) {
      jugadaInput.disabled = true;
      btnEnviar.textContent = "Volver a jugar";
      juegoTerminado = true;
      snackbar.error("¡Perdiste! Intenta de nuevo.");
      return;
    }

    // Si gana
    if (data.scores) {
      timerInstance.stop();
      jugadaInput.disabled = true;
      btnEnviar.textContent = "Volver a jugar";
      juegoTerminado = true;
      snackbar.success("¡Ganaste! 🎉 Excelente trabajo.");
    }
  };

  app.innerHTML = `
    <div class="game-container">
      <div class="game-header">
        <div class="game-header-item">
          <div>Cronometro</div>
          <div id="cronometro">0 s</div>
        </div>
        <div class="game-header-item">
          <div>Aciertos</div>
          <div id="score">${game.score}</div>
        </div>
        <div class="game-header-item">
          <div>Intentos</div>
          <div id="intentos">${game.intentos}</div>
        </div>
        <div class="game-header-item">
          <div>Letras incorrectas</div>
          <div id="letrasIncorrectas">${game.letrasIncorrectas.join(", ")}</div>
        </div>
      </div>

      <div class="player-name">${user.name}</div>

      <div class="game-image-container">
        <img id="ahorcadoImg" src="${getFrameImagePath(game.intentos)}" alt="Ahorcado" />
      </div>

      <p id="palabraOculta" class="word-display">${game.palabraOculta}</p>

      <input type="text" id="inputJugada" class="game-input" placeholder="Ingresa letra o palabra" />

      <div class="button-group">
        <button id="btnEnviar">Probar</button>
        <button id="btnFinalizar">Abandonar</button>
      </div>
    </div>
  `;

  if (timerInstance) timerInstance.stop();

  timerInstance = new Timer((segundos) => {
    tiempoSegundos = segundos;
    document.getElementById("cronometro").textContent = `${segundos} s`;
  });
  timerInstance.start();

  document.getElementById("btnEnviar").onclick = async () => {
    const jugadaInput = document.getElementById("inputJugada");

    // Si el juego terminó, volver al menú
    if (juegoTerminado) {
      onGameEnd();
      return;
    }

    const jugada = jugadaInput.value.trim().toLowerCase();

    if (!jugada) {
      snackbar.error("Ingresa algo");
      return;
    }

    const palabraOriginal = game.palabraOculta.replace(/ /g, "");
    if (jugada.length !== 1 && jugada.length !== palabraOriginal.length) {
      snackbar.error("Ingresa 1 letra o la palabra completa");
      return;
    }

    try {
      const res = await apiFetch(
        "/game/validate-word",
        "POST",
        { palabraUsuario: jugada, tiempo: tiempoSegundos },
        user.token
      );

      const data = await res.json();

      if (res.ok) {
        actualizarVista(data);
        jugadaInput.value = "";
        jugadaInput.focus();

        if (data.mensaje && data.mensaje.toLowerCase().includes("acertaste")) {
          snackbar.success(data.mensaje);
        }
      } else {
        mostrarError(data.error || "Error en jugada");
      }
    } catch {
      mostrarError("Error de conexión");
    }
  };

  document.getElementById("btnFinalizar").onclick = async () => {
    try {
      const res = await apiFetch(
        "/game/finalize",
        "POST",
        { tiempo: tiempoSegundos },
        user.token
      );

      const data = await res.json();

      if (res.ok) {
        timerInstance.stop();
        snackbar.success("Juego finalizado. Score: " + data.score);
        onGameEnd();
      } else {
        mostrarError(data.error || "Error al finalizar");
      }
    } catch {
      mostrarError("Error de conexión");
    }
  };
}
