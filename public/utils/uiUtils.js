// uiUtils.js

/**
 * Muestra u oculta las secciones según si hay token
 */
export function togglePantalla(inicio, juego, hayToken) {
  inicio.style.display = hayToken ? "none" : "block";
  juego.style.display = hayToken ? "block" : "none";
}

/**
 * Muestra un formulario y oculta las acciones
 */
export function mostrarFormulario(formulario, acciones) {
  acciones.style.display = "none";
  formulario.style.display = "block";
}

/**
 * Vuelve al menú de acciones desde un formulario
 */
export function volverAlMenu(formulario, acciones) {
  formulario.style.display = "none";
  acciones.style.display = "block";
}
