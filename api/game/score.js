import { obtenerScore } from "../../logic/controllers/gameController.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return obtenerScore(req, res);
  }
  res.status(405).end("Método no permitido");
}
