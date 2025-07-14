import { procesarJugada } from "../../logic/controllers/gameController.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return procesarJugada(req, res);
  }
  res.status(405).end("Método no permitido");
}
