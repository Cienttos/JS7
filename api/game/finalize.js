import { finalizarJuegoManual } from "../../logic/controllers/gameController.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return finalizarJuegoManual(req, res);
  }
  res.status(405).end("Método no permitido");
}
