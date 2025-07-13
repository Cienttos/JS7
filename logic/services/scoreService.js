import {
  obtenerScorePorUsuarioDB,
  actualizarScoreDB,
  crearNuevoScoreDB,
  obtenerNombreUsuarioDB,
  obtenerTodosLosScoresDB,
} from "../db/scoreDB.js";

export async function manejarScore(userId, scoreActual, tiempoActual) {
  const currentScore = await obtenerScorePorUsuarioDB(userId);

  if (currentScore) {
    if (scoreActual > currentScore.best_score) {
      return actualizarScoreDB(userId, scoreActual, tiempoActual);
    } else {
      return {
        score: currentScore.best_score,
        best_time: currentScore.best_time,
        last_date: currentScore.last_date,
      };
    }
  } else {
    const userName = await obtenerNombreUsuarioDB(userId);
    return crearNuevoScoreDB(userId, userName, scoreActual, tiempoActual);
  }
}


export async function obtenerTodosLosScores() {
  return obtenerTodosLosScoresDB();
}
