import { finalizarJuegoManual } from "../../logic/controllers/gameController.js";

// Handler para finalizar el juego manualmente
export default async function handler(req, res) {
  // Solo acepta método POST para finalizar el juego
  if (req.method === "POST") {
    return finalizarJuegoManual(req, res); // Llama al controlador que finaliza el juego
  }
  // Si el método no es POST, responde con error 405 (método no permitido)
  res.status(405).end("Método no permitido");
}
