// Constantes para las claves en localStorage
const TOKEN_KEY = "token";
const NAME_KEY = "name";

export const authService = {
  guardarToken(token, name) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(NAME_KEY, name);
  },

  obtenerToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  obtenerNombre() {
    return localStorage.getItem(NAME_KEY);
  },

  borrarToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NAME_KEY);
  },
};
