// Importamos funciones para hacer peticiones, mostrar errores y manejar el timer
import { apiFetch } from "../services/api.js";
import { mostrarError } from "../utils/helpers.js";
import { Timer } from "../utils/timer.js";

let timerInstance = null;  // Variable para guardar la instancia del timer

// Función que muestra la vista del juego y maneja la lógica de jugadas y finalización
export function renderGameView({ app, game, user, onGameEnd }) {
  let tiempoSegundos = 0;  // Contador de tiempo en segundos

  // Armamos el HTML que muestra el estado actual del juego
  app.innerHTML = `
    <h3>Juego Ahorcado</h3>
    <p><b>Palabra:</b> <span id="palabraOculta">${game.palabraOculta}</span></p>
    <p><b>Intentos:</b> <span id="intentos">${game.intentos}</span></p>
    <p><b>Letras incorrectas:</b> <span id="letrasIncorrectas">${game.letrasIncorrectas.join(", ")}</span></p>
    <p><b>Tiempo:</b> <span id="cronometro">0 s</span></p>
    <p><b>Score:</b> <span id="score">${game.score}</span></p>
    <input type="text" id="inputJugada" placeholder="Ingresa letra o palabra" />
    <button id="btnEnviar">Enviar</button>
    <button id="btnFinalizar">Finalizar Juego</button>
    <p id="mensaje"></p>
  `;

  // Si ya había un timer funcionando, lo detenemos para reiniciarlo
  if (timerInstance) timerInstance.stop();

  // Creamos una nueva instancia del timer, que actualiza el cronómetro en pantalla
  timerInstance = new Timer((segundos) => {
    tiempoSegundos = segundos;
    document.getElementById("cronometro").textContent = `${segundos} s`;
  });
  timerInstance.start(); // Iniciamos el timer

  // Evento para cuando el jugador envía una jugada (letra o palabra)
  document.getElementById("btnEnviar").onclick = async () => {
    const jugadaInput = document.getElementById("inputJugada");
    const jugada = jugadaInput.value.trim().toLowerCase();

    // Validaciones simples: que no esté vacío y que sea 1 letra o palabra completa
    if (!jugada) {
      alert("Ingresa algo");
      return;
    }

    const palabraOriginal = game.palabraOculta.replace(/ /g, "");
    if (jugada.length !== 1 && jugada.length !== palabraOriginal.length) {
      alert("Ingresa 1 letra o la palabra completa");
      return;
    }

    try {
      // Enviamos la jugada a la API junto con el tiempo transcurrido
      const res = await apiFetch(
        "/game/validate-word",
        "POST",
        { palabraUsuario: jugada, tiempo: tiempoSegundos },
        user.token
      );

      const data = await res.json();

      if (res.ok) {
        // Actualizamos el estado del juego con los datos recibidos
        game.palabraOculta = data.palabra_oculta.split("").join(" ");
        game.intentos = data.intentos;
        game.letrasIncorrectas = data.letras_incorrectas || [];
        game.score = typeof data.score === "number" ? data.score : game.score;

        // Actualizamos la vista con el nuevo estado
        document.getElementById("palabraOculta").textContent = game.palabraOculta;
        document.getElementById("intentos").textContent = game.intentos;
        document.getElementById("letrasIncorrectas").textContent = game.letrasIncorrectas.join(", ");
        document.getElementById("score").textContent = game.score;
        document.getElementById("mensaje").textContent = data.mensaje || "";

        jugadaInput.value = ""; // Limpiamos el input

        // Si el juego terminó (la API devuelve scores), detenemos el timer y avisamos
        if (data.scores) {
          timerInstance.stop();
          alert("Juego terminado");
          onGameEnd(); // Llamamos a la función para terminar el juego (volver al menú)
        }
      } else {
        mostrarError(data.error || "Error en jugada");
      }
    } catch {
      mostrarError("Error de conexión");
    }
  };

  // Evento para cuando el jugador decide finalizar el juego manualmente
  document.getElementById("btnFinalizar").onclick = async () => {
    try {
      // Enviamos la solicitud para finalizar el juego con el tiempo actual
      const res = await apiFetch(
        "/game/finalize",
        "POST",
        { tiempo: tiempoSegundos },
        user.token
      );

      const data = await res.json();

      if (res.ok) {
        timerInstance.stop(); // Detenemos el timer
        alert("Juego finalizado. Score: " + data.score);
        onGameEnd(); // Volvemos al menú
      } else {
        mostrarError(data.error || "Error al finalizar");
      }
    } catch {
      mostrarError("Error de conexión");
    }
  };
}
