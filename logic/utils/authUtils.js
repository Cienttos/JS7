import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// ==========================================
// Extraer el ID de usuario desde el token
// ==========================================
// Esta función busca el token en las cookies del request.
// Si no encuentra el token, lanza un error con status 401.
// Si lo encuentra, lo decodifica usando JWT_SECRET y devuelve el user ID.

export function obtenerUserIdDesdeToken(req) {
  const token = req.cookies?.token;

  // Si no hay token, lanzamos un error
  if (!token) {
    const error = new Error("Token no proporcionado");
    error.status = 401;
    throw error;
  }

  // Decodificamos el token con la clave secreta
  const decoded = jwt.verify(token, JWT_SECRET);

  // Devolvemos el ID del usuario
  return decoded.id;
}
