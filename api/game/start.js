import { iniciarJuego } from "../../logic/controllers/gameController.js";

// Handler para iniciar un nuevo juego
export default async function handler(req, res) {
  // Solo acepta método POST para iniciar el juego
  if (req.method === "POST") {
    return iniciarJuego(req, res); // Llama al controlador que inicia el juego
  }
  // Si el método no es POST, responde con error 405 (método no permitido)
  res.status(405).end("Método no permitido");
}
