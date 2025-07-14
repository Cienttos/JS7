// Importamos Express, un framework para crear servidores web fácilmente
import express from "express";

// Importamos dos funciones que se encargan del registro y login de usuarios
import { register, login } from "./logic/controllers/accessController.js";

// Importamos funciones relacionadas al juego (iniciar, procesar jugadas, etc.)
import {
  iniciarJuego,
  procesarJugada,
  obtenerScore,
  finalizarJuegoManual,
} from "./logic/controllers/gameController.js";

// Creamos un "router", que nos permite definir las distintas rutas (endpoints) de nuestra API
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post("/register", register);

// Ruta para hacer login (iniciar sesión)
router.post("/login", login);

// Ruta para comenzar un nuevo juego
router.post("/game/start", iniciarJuego);

// Ruta para validar la palabra que el usuario escribió durante el juego
router.post("/game/validate-word", procesarJugada);

// Ruta para obtener el puntaje del jugador actual
router.get("/game/score", obtenerScore);

// Ruta para finalizar el juego manualmente
router.post("/game/finalize", finalizarJuegoManual);

// Exportamos este router para poder usarlo en otras partes del proyecto (como en el archivo principal del servidor)
export default router;
