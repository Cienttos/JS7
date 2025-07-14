import { apiFetch } from "../services/api.js";      // Función para llamar a la API
import { mostrarError } from "../utils/helpers.js"; // Función para mostrar mensajes (no usada acá)
import { Timer } from "../utils/timer.js";          // Clase para manejar un cronómetro
import { Snackbar } from "../utils/snackbar.js";    // Clase para mostrar notificaciones

const snackbar = new Snackbar();  // Instancia para mostrar mensajes tipo snackbars
let timerInstance = null;         // Variable para controlar el temporizador

// Función principal para renderizar la vista del juego
export function renderGameView({ app, game, user, onGameEnd }) {
  let tiempoSegundos = 0;        // Guarda el tiempo transcurrido en segundos
  let juegoTerminado = false;    // Bandera para saber si el juego terminó

  // Función para obtener la ruta de la imagen del ahorcado según intentos restantes
  const getFrameImagePath = (intentos) => {
    const frameNumber = 7 - intentos;  // Calcula qué imagen mostrar
    return `../img/f${frameNumber}.jpeg`;
  };

  // Función que actualiza la interfaz con los datos que llegan del servidor
  const actualizarVista = (data) => {
    const jugadaInput = document.getElementById("inputJugada");
    const btnEnviar = document.getElementById("btnEnviar");

    // Actualizamos las variables del juego con la info nueva
    game.palabraOculta = data.palabra_oculta.split("").join(" ");
    game.intentos = data.intentos;
    game.letrasIncorrectas = data.letras_incorrectas || [];
    game.score = typeof data.score === "number" ? data.score : game.score;

    // Actualizamos el contenido visible en el DOM
    document.getElementById("palabraOculta").textContent = game.palabraOculta;
    document.getElementById("letrasIncorrectas").textContent = game.letrasIncorrectas.join(", ");
    document.getElementById("score").textContent = game.score;
    document.getElementById("intentos").textContent = game.intentos;
    document.getElementById("ahorcadoImg").src = getFrameImagePath(game.intentos);

    // Si se quedaron sin intentos, bloqueamos inputs y mostramos mensaje de derrota
    if (game.intentos === 0) {
      jugadaInput.disabled = true;
      btnEnviar.disabled = true;
      btnEnviar.style.display = "none"; 
      juegoTerminado = true;
      snackbar.error("¡Perdiste! No te quedan intentos.");
      return;
    }

    // Si ganó, paramos el timer, bloqueamos inputs y mostramos mensaje de éxito
    if (data.scores) {
      timerInstance.stop();
      jugadaInput.disabled = true;
      btnEnviar.disabled = true;
      juegoTerminado = true;
      snackbar.success("¡Ganaste! 🎉 Excelente trabajo.");
    }
  };

  // Renderizamos toda la vista del juego en el contenedor 'app'
  app.innerHTML = `
    <div class="game-container">
      <div class="game-header">
        <div class="game-header-item">
          <div>Cronómetro</div>
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

  // Si ya existía un timer, lo paramos antes de crear uno nuevo
  if (timerInstance) timerInstance.stop();

  // Creamos y arrancamos el temporizador que actualiza el cronómetro en pantalla cada segundo
  timerInstance = new Timer((segundos) => {
    tiempoSegundos = segundos;
    document.getElementById("cronometro").textContent = `${segundos} s`;
  });
  timerInstance.start();

  // Manejador del botón "Probar"
  document.getElementById("btnEnviar").onclick = async () => {
    const jugadaInput = document.getElementById("inputJugada");
    const btnEnviar = document.getElementById("btnEnviar");

    // Si ya terminó el juego, no hacemos nada
    if (juegoTerminado) return;

    // Tomamos la jugada y la limpiamos
    const jugada = jugadaInput.value.trim().toLowerCase();

    // Validaciones:
    if (!jugada) {
      snackbar.error("Debes ingresar una letra o palabra.");
      return;
    }

    const palabraOriginal = game.palabraOculta.replace(/ /g, "");

    // La jugada debe ser una letra o la palabra completa
    if (jugada.length !== 1 && jugada.length !== palabraOriginal.length) {
      snackbar.error("Ingresa 1 sola letra o la palabra completa.");
      return;
    }

    // Si ya probó esa letra antes, avisamos y no seguimos
    if (jugada.length === 1 && (game.letrasIncorrectas.includes(jugada) || game.palabraOculta.includes(jugada))) {
      snackbar.warning("Ya probaste esa letra.");
      return;
    }

    try {
      // Enviamos la jugada a la API para validar
      const res = await apiFetch(
        "/game/validate-word",
        "POST",
        { palabraUsuario: jugada, tiempo: tiempoSegundos },
        user.token
      );

      const data = await res.json();

      // Si la respuesta es correcta, actualizamos la vista y limpiamos el input
      if (res.ok) {
        actualizarVista(data);
        jugadaInput.value = "";
        jugadaInput.focus();

        // Si hay mensaje extra, lo mostramos con snackbar (éxito o info)
        if (data.mensaje) {
          if (data.mensaje.toLowerCase().includes("acertaste")) {
            snackbar.success(data.mensaje);
          } else {
            snackbar.info(data.mensaje);
          }
        }
      } else {
        // Si hubo error, mostramos mensaje
        snackbar.error(data.error || "Error en la jugada.");
      }
    } catch {
      // Si falla la conexión, avisamos
      snackbar.error("Error de conexión con el servidor.");
    }
  };

  // Manejador del botón "Abandonar" o finalizar juego manualmente
  document.getElementById("btnFinalizar").onclick = async () => {
    // Si ya perdió o terminó, paramos el timer y salimos
    if (game.intentos === 0 || juegoTerminado) {
      timerInstance.stop();
      snackbar.info("Saliendo del juego...");
      onGameEnd();
      return;
    }

    try {
      // Enviamos a la API la finalización anticipada con el tiempo jugado
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
        snackbar.error(data.error || "Error al finalizar el juego.");
      }
    } catch {
      snackbar.error("Error de conexión con el servidor.");
    }
  };
}
