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

// Iniciar un nuevo juego
export async function iniciarJuego(req, res) {
  try {
    const userId = obtenerUserIdDesdeToken(req);

    const palabra = obtenerPalabraAleatoria(palabras);
    const palabraOculta = obtenerPalabraOculta(palabra);
    const intentos = 6;
    const scoreInicial = 0;

    await crearNuevoJuego(userId, palabra, palabraOculta, intentos, scoreInicial);

    res.status(200).json({
      message: "Juego iniciado",
      palabraOculta,
      intentos,
      score: scoreInicial, // ✅ agregado aquí
    });
  } catch (error) {
    console.error("Error al iniciar el juego:", error);
    res.status(error.status || 500).json({ error: error.message });
  }
}

// Procesar una jugada
export async function procesarJugada(req, res) {
  try {
    const userId = obtenerUserIdDesdeToken(req);
    const { palabraUsuario, tiempo } = req.body;

    if (!palabraUsuario || tiempo === undefined) {
      return res.status(400).json({ error: "Palabra del usuario o tiempo no proporcionado" });
    }

    const juego = await obtenerJuegoActivo(userId);
    if (!juego) return res.status(404).json({ error: "No hay juego activo" });

    const { word: palabra, hidden_word: palabraOculta, attempts: intentos, letters, score } = juego;

    const letrasIncorrectas = letters ? letters.split(",") : [];
    let palabraOcultaArr = palabraOculta.replace(/ /g, "").split("");

    const {
      nuevaPalabra,
      nuevaPalabraOculta,
      letrasIncorrectasActualizadas,
      intentosRestantes,
      mensaje,
      sumarScore,
    } = validarJugada(palabraUsuario, palabra, palabraOcultaArr, letrasIncorrectas, intentos);

    const nuevoScore = sumarScore ? score + 1 : score;

    const status = intentosRestantes <= 0 ? "finished" : "playing";
    const mensajeFinal = status === "finished" ? mensaje + " ¡Juego terminado!" : mensaje;

    const palabraFinal = sumarScore ? obtenerPalabraAleatoria(palabras) : nuevaPalabra;
    const palabraOcultaFinal = sumarScore
      ? obtenerPalabraOculta(palabraFinal)
      : nuevaPalabraOculta;

    const intentosFinal = sumarScore ? 6 : intentosRestantes;
    const letrasFinal = sumarScore ? [] : letrasIncorrectasActualizadas;

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

    if (status === "finished") {
      await finalizarJuego(userId, nuevoScore, tiempo);
    }

    const scores = status === "finished" ? await obtenerTodosLosScores() : null;

    res.status(200).json({
      palabra_oculta: palabraOcultaFinal,
      tiempo,
      intentos: intentosFinal,
      letras_incorrectas: letrasFinal,
      score: status === "finished" ? nuevoScore : nuevoScore, // también se envía el score
      mensaje: mensajeFinal,
      scores,
    });
  } catch (error) {
    console.error("Error al procesar jugada:", error);
    res.status(error.status || 500).json({ error: error.message });
  }
}

// Finalizar juego manualmente
export async function finalizarJuegoManual(req, res) {
  try {
    const userId = obtenerUserIdDesdeToken(req);
    const { tiempo } = req.body;

    if (typeof tiempo !== "number") {
      return res.status(400).json({ error: "Tiempo no proporcionado o inválido" });
    }

    const juego = await obtenerJuegoActivo(userId);
    if (!juego)
      return res.status(404).json({ error: "No hay juego activo para finalizar" });

    const { score: scoreActual } = juego;

    await finalizarJuego(userId, scoreActual, tiempo);

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

// Obtener todos los scores
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
