import { iniciarJuego } from "../../logic/controllers/gameController.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return iniciarJuego(req, res);
  }
  res.status(405).end("Método no permitido");
}
