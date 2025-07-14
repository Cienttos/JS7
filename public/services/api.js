// URL base de la API a la que vamos a hacer las peticiones
export const API_URL = "https://ahorcadotime.vercel.app/";

// apiFetch facilita hacer peticiones fetch a la API con JSON y token.
export async function apiFetch(endpoint, method = "GET", body = null, token = null) {
  // Definimos los encabezados, siempre con JSON
  const headers = {
    "Content-Type": "application/json",
  };

  // Si tenemos token, lo añadimos en el encabezado Authorization
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Hacemos la petición fetch con la URL completa, método, headers y body si existe
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null, // si hay body lo convertimos a JSON, sino null
  });

  // Retornamos la respuesta para que quien llame la función pueda manejarla
  return res;
}
