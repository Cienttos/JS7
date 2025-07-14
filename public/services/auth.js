// Constantes que definen las claves para guardar datos en localStorage
const TOKEN_KEY = "token"; // clave para almacenar el token de autenticación
const NAME_KEY = "name";   // clave para almacenar el nombre del usuario

// Objeto con funciones para manejar el token y nombre en localStorage
export const authService = {
  // Guarda el token y el nombre en localStorage
  guardarToken(token, name) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(NAME_KEY, name);
  },

  // Obtiene el token almacenado (si existe)
  obtenerToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Obtiene el nombre almacenado (si existe)
  obtenerNombre() {
    return localStorage.getItem(NAME_KEY);
  },

  // Borra el token y el nombre del localStorage (logout)
  borrarToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NAME_KEY);
  },
};
