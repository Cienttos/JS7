import { register } from '../logic/controllers/accessController.js';

// Función handler para manejar peticiones HTTP a esta ruta
export default async function handler(req, res) {
  // Solo aceptamos método POST para registrar usuarios
  if (req.method === 'POST') {
    return register(req, res); // Delegamos la lógica al controlador register
  }
  
  // Si no es POST, respondemos con error 405 (Método no permitido)
  res.status(405).end();
}
