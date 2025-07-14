import { procesarJugada } from "../../logic/controllers/gameController.js";

// Handler para procesar jugadas en el juego
export default async function handler(req, res) {
  // Solo acepta método POST para enviar jugadas
  if (req.method === "POST") {
    return procesarJugada(req, res); // Llama al controlador que procesa la jugada
  }
  // Si el método no es POST, devuelve error 405 (método no permitido)
  res.status(405).end("Método no permitido");
}
