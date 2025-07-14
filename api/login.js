import { login } from '../logic/controllers/accessController.js';

// Handler para la ruta de login
export default async function handler(req, res) {
  // Solo acepta método POST para iniciar sesión
  if (req.method === 'POST') {
    return login(req, res); // Llama al controlador login
  }
  // Si no es POST, responde con error 405 (método no permitido)
  res.status(405).end();
}
