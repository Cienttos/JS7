// Importamos funciones para manejar datos de juegos en la base de datos
import {
  crearNuevoJuegoDB,
  obtenerJuegoActivoDB,
  actualizarJuegoDB,
} from "../db/gameDB.js";

// Importamos función para manejar el score, para actualizarlo al finalizar juego
import { manejarScore } from "../services/scoreService.js";

// Función para crear un nuevo juego en la base de datos
// Parámetros: id de usuario, palabra a adivinar, palabra oculta (con guiones o espacios), intentos restantes, puntaje inicial
export async function crearNuevoJuego(userId, palabra, palabraOculta, intentos, score) {
  return crearNuevoJuegoDB(userId, palabra, palabraOculta, intentos, score);
}

// Función para obtener el juego activo (en progreso) de un usuario
export async function obtenerJuegoActivo(userId) {
  return obtenerJuegoActivoDB(userId);
}

// Función para actualizar datos del juego (como intentos, palabra oculta, puntaje, etc.)
// Recibe id de usuario y objeto con datos a actualizar
export async function actualizarJuego(userId, data) {
  return actualizarJuegoDB(userId, data);
}

// Función para finalizar un juego, actualizando el score del usuario según el puntaje final y tiempo
export async function finalizarJuego(userId, nuevoScore, tiempo) {
  await manejarScore(userId, nuevoScore, tiempo);
}
