import express from "express";
import { register, login } from './logic/controllers/accessController.js';
import { iniciarJuego, procesarJugada, obtenerScore, finalizarJuegoManual } from "./logic/controllers/gameController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/game/start", iniciarJuego);
router.post("/game/validate-word", procesarJugada);
router.get("/game/score", obtenerScore);
router.post("/game/finalize", finalizarJuegoManual);

export default router;
