// Importamos funciones para acceder y modificar datos de scores en la base de datos
import {
  obtenerScorePorUsuarioDB,
  actualizarScoreDB,
  crearNuevoScoreDB,
  obtenerNombreUsuarioDB,
  obtenerTodosLosScoresDB,
} from "../db/scoreDB.js";

// Función que maneja la lógica de guardar o actualizar el score de un usuario
// Recibe:
// userId: id del usuario
// scoreActual: puntaje obtenido en la partida actual
// tiempoActual: tiempo tomado en la partida actual
export async function manejarScore(userId, scoreActual, tiempoActual) {
  // Buscamos el score actual que tiene el usuario en la base de datos
  const currentScore = await obtenerScorePorUsuarioDB(userId);

  // Si el usuario ya tiene un score guardado
  if (currentScore) {
    // Comparamos si el nuevo score es mejor que el guardado
    if (scoreActual > currentScore.best_score) {
      // Si es mejor, actualizamos el score y tiempo en la DB
      return actualizarScoreDB(userId, scoreActual, tiempoActual);
    } else {
      // Si no es mejor, devolvemos el score y tiempo guardados sin cambios
      return {
        score: currentScore.best_score,
        best_time: currentScore.best_time,
        last_date: currentScore.last_date,
      };
    }
  } else {
    // Si no existe score para el usuario, obtenemos su nombre
    const userName = await obtenerNombreUsuarioDB(userId);
    // Creamos un nuevo registro de score para el usuario con el score y tiempo actual
    return crearNuevoScoreDB(userId, userName, scoreActual, tiempoActual);
  }
}

// Función para obtener todos los scores guardados en la base de datos
export async function obtenerTodosLosScores() {
  return obtenerTodosLosScoresDB();
}
