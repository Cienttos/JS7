// URL base de la API a la que se harán las solicitudes
export const API_URL = "https://ahorcadotime.vercel.app/api";

// Función para hacer peticiones HTTP a la API
// endpoint: ruta específica de la API (ej: "/login")
// method: método HTTP (GET, POST, etc.), por defecto es GET
// body: datos que se envían (para POST, PUT, etc.), por defecto es null
export async function apiFetch(endpoint, method = "GET", body = null) {
  // Obtenemos el token guardado en localStorage (si existe)
  const token = localStorage.getItem("token");

  // Definimos los encabezados HTTP, indicando que enviamos JSON
  const headers = {
    "Content-Type": "application/json",
  };

  // Si hay token, agregamos autorización con Bearer token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Hacemos la petición fetch con la URL completa y las opciones
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,                // método HTTP
    headers,               // encabezados configurados
    body: body ? JSON.stringify(body) : null, // enviamos body si existe en formato JSON
    credentials: 'include', // para enviar cookies, opcional si usas cookies en la API
  });

  // Devolvemos la respuesta (Promise)
  return res;
}
