import palabras from "../../const/palabras.js";
import {
  obtenerPalabraAleatoria,
  obtenerPalabraOculta,
} from "../utils/palabraUtils.js";

import { validarJugada } from "../validation/validarJugada.js";
import { obtenerUserIdDesdeToken } from "../utils/authUtils.js";

import {
  crearNuevoJuego,
  obtenerJuegoActivo,
  actualizarJuego,
  finalizarJuego,
} from "../services/gameService.js";

import { obtenerTodosLosScores } from "../services/scoreService.js";

// -----------------------------
// Iniciar un nuevo juego
// -----------------------------
export async function iniciarJuego(req, res) {
  try {
    const userId = obtenerUserIdDesdeToken(req);

    // Elegir palabra al azar y crear versión oculta (con guiones o espacios)
    const palabra = obtenerPalabraAleatoria(palabras);
    const palabraOculta = obtenerPalabraOculta(palabra);
    const intentos = 6;       // Intentos iniciales
    const scoreInicial = 0;   // Score inicial en 0

    // Crear juego nuevo en la base de datos
    await crearNuevoJuego(userId, palabra, palabraOculta, intentos, scoreInicial);

    // Responder con los datos iniciales del juego
    res.status(200).json({
      message: "Juego iniciado",
      palabraOculta,
      intentos,
      score: scoreInicial,
    });
  } catch (error) {
    console.error("Error al iniciar el juego:", error);
    res.status(error.status || 500).json({ error: error.message });
  }
}

// -----------------------------
// Procesar una jugada (letra o palabra)
// -----------------------------
export async function procesarJugada(req, res) {
  try {
    const userId = obtenerUserIdDesdeToken(req);
    const { palabraUsuario, tiempo } = req.body;

    // Validar que haya enviado palabra y tiempo
    if (!palabraUsuario || tiempo === undefined) {
      return res.status(400).json({ error: "Palabra del usuario o tiempo no proporcionado" });
    }

    // Obtener juego activo del usuario
    const juego = await obtenerJuegoActivo(userId);
    if (!juego) return res.status(404).json({ error: "No hay juego activo" });

    const { word: palabra, hidden_word: palabraOculta, attempts: intentos, letters, score } = juego;

    const letrasIncorrectas = letters ? letters.split(",") : [];
    let palabraOcultaArr = palabraOculta.replace(/ /g, "").split("");

    // Validar la jugada usando la lógica del juego
    const {
      nuevaPalabra,
      nuevaPalabraOculta,
      letrasIncorrectasActualizadas,
      intentosRestantes,
      mensaje,
      sumarScore,
    } = validarJugada(palabraUsuario, palabra, palabraOcultaArr, letrasIncorrectas, intentos);

    // Calcular nuevo score
    const nuevoScore = sumarScore ? score + 1 : score;

    // Determinar si el juego terminó
    const status = intentosRestantes <= 0 ? "finished" : "playing";
    const mensajeFinal = status === "finished" ? mensaje + " ¡Juego terminado!" : mensaje;

    // Si ganó, nueva palabra aleatoria y reiniciar intentos; sino mantener estado actual
    const palabraFinal = sumarScore ? obtenerPalabraAleatoria(palabras) : nuevaPalabra;
    const palabraOcultaFinal = sumarScore
      ? obtenerPalabraOculta(palabraFinal)
      : nuevaPalabraOculta;

    const intentosFinal = sumarScore ? 6 : intentosRestantes;
    const letrasFinal = sumarScore ? [] : letrasIncorrectasActualizadas;

    // Actualizar juego en base de datos con nuevo estado
    await actualizarJuego(userId, {
      nuevaPalabra: palabraFinal,
      nuevaPalabraOculta: palabraOcultaFinal.replace(/ /g, ""),
      palabraUsuario,
      letrasIncorrectas: letrasFinal,
      intentosRestantes: intentosFinal,
      tiempo,
      nuevoStatus: status,
      score: nuevoScore,
    });

    // Si el juego terminó, actualizar score en BD
    if (status === "finished") {
      await finalizarJuego(userId, nuevoScore, tiempo);
    }

    // Si terminó el juego, traer todos los scores para mostrar en la respuesta
    const scores = status === "finished" ? await obtenerTodosLosScores() : null;

    // Enviar datos actualizados al cliente
    res.status(200).json({
      palabra_oculta: palabraOcultaFinal,
      tiempo,
      intentos: intentosFinal,
      letras_incorrectas: letrasFinal,
      score: nuevoScore,
      mensaje: mensajeFinal,
      scores,
    });
  } catch (error) {
    console.error("Error al procesar jugada:", error);
    res.status(error.status || 500).json({ error: error.message });
  }
}

// -----------------------------
// Finalizar juego manualmente (usuario abandona)
// -----------------------------
export async function finalizarJuegoManual(req, res) {
  try {
    const userId = obtenerUserIdDesdeToken(req);
    const { tiempo } = req.body;

    // Validar que tiempo sea un número válido
    if (typeof tiempo !== "number") {
      return res.status(400).json({ error: "Tiempo no proporcionado o inválido" });
    }

    // Obtener juego activo para finalizarlo
    const juego = await obtenerJuegoActivo(userId);
    if (!juego)
      return res.status(404).json({ error: "No hay juego activo para finalizar" });

    const { score: scoreActual } = juego;

    // Finalizar juego actual y actualizar score
    await finalizarJuego(userId, scoreActual, tiempo);

    // Obtener lista actualizada de scores para enviar al cliente
    const scores = await obtenerTodosLosScores();

    res.status(200).json({
      message: "Juego finalizado manualmente",
      score: scoreActual,
      scores,
    });
  } catch (error) {
    console.error("Error al finalizar juego manualmente:", error);
    res.status(error.status || 500).json({ error: error.message });
  }
}

// -----------------------------
// Obtener todos los scores para mostrar tabla o ranking
// -----------------------------
export async function obtenerScore(req, res) {
  try {
    const scores = await obtenerTodosLosScores();
    if (!scores.length)
      return res.status(404).json({ message: "No se encontraron scores" });

    res.status(200).json(scores);
  } catch (error) {
    console.error("Error al obtener scores:", error);
    res.status(500).json({ error: "Error al obtener scores" });
  }
}
