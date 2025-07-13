import {
  crearNuevoJuegoDB,
  obtenerJuegoActivoDB,
  actualizarJuegoDB,
} from "../db/gameDB.js";

import { manejarScore } from "../services/scoreService.js";

export async function crearNuevoJuego(userId, palabra, palabraOculta, intentos, score) {
  return crearNuevoJuegoDB(userId, palabra, palabraOculta, intentos, score);
}

export async function obtenerJuegoActivo(userId) {
  return obtenerJuegoActivoDB(userId);
}

export async function actualizarJuego(userId, data) {
  return actualizarJuegoDB(userId, data);
}

export async function finalizarJuego(userId, nuevoScore, tiempo) {
  await manejarScore(userId, nuevoScore, tiempo);
}
