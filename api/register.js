import { register } from '../logic/controllers/accessController.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return register(req, res);
  }
  res.status(405).end(); // Método no permitido
}
