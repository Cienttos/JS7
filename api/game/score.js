import { obtenerScore } from "../../logic/controllers/gameController.js";

// Handler para obtener todos los scores
export default async function handler(req, res) {
  // Solo acepta método GET para obtener los scores
  if (req.method === "GET") {
    return obtenerScore(req, res); // Llama al controlador que obtiene los scores
  }
  // Si el método no es GET, responde con error 405 (método no permitido)
  res.status(405).end("Método no permitido");
}
