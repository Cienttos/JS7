// Constantes para las claves que usaremos en localStorage
const TOKEN_KEY = "token";
const NAME_KEY = "name";

// Objeto que agrupa funciones para manejar el token y nombre en localStorage
export const authService = {
  // Guarda el token y el nombre en el localStorage del navegador
  guardarToken(token, name) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(NAME_KEY, name);
  },

  // Obtiene el token guardado del localStorage
  obtenerToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Obtiene el nombre guardado del localStorage
  obtenerNombre() {
    return localStorage.getItem(NAME_KEY);
  },

  // Borra el token y el nombre del localStorage (para cerrar sesión)
  borrarToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NAME_KEY);
  },
};
