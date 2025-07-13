// Función que realiza peticiones HTTP con fetch
// Parámetros:
// - endpoint: URL o ruta del recurso al que se quiere acceder
// - method: método HTTP (GET, POST, PUT, DELETE...), por defecto GET
// - body: datos que se enviarán en el cuerpo de la petición (para métodos como POST), por defecto null
// - headers: objeto con cabeceras HTTP adicionales, por defecto vacío
export async function apiRequest(endpoint, method = "GET", body = null, headers = {}) {
  // Configuramos el objeto con las opciones de la petición
  const config = {
    method, // método HTTP que se usará (ej: "POST")
    headers: {
      "Content-Type": "application/json", // Indicamos que enviamos y esperamos JSON
      ...headers, // Permitimos añadir cabeceras extra si es necesario
    },
  };

  // Si se enviaron datos en body (por ejemplo en POST), los convertimos a JSON
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    // Realizamos la petición con fetch, pasando el endpoint y la configuración
    const response = await fetch(endpoint, config);

    // Convertimos la respuesta a JSON
    const data = await response.json();

    // Devolvemos el resultado
    return data;
  } catch (err) {
    // Si ocurre un error (red, servidor, etc.) lo mostramos en consola para debugging
    console.error(`Error en ${method} ${endpoint}:`, err);

    // Propagamos el error para que pueda manejarse en quien llame esta función
    throw err;
  }
}
