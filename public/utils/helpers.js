// Importamos la clase Snackbar que se usa para mostrar mensajes visuales en pantalla
import { Snackbar } from './snackbar.js';

// Creamos una instancia para poder usarla
const snackbar = new Snackbar();

// Función para mostrar un mensaje de error en pantalla
export function mostrarError(mensaje) {
  snackbar.error(mensaje); // Llama al método "error" del snackbar con el mensaje recibido
}

// Función que toma una palabra y la devuelve con espacios entre cada letra
// Ejemplo: "hola" => "h o l a"
export function formatearPalabra(palabra) {
  return palabra.split("").join(" ");
}
