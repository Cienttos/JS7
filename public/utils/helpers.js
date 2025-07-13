// utils/helpers.js
import { Snackbar } from './snackbar.js';

const snackbar = new Snackbar();

export function mostrarError(mensaje) {
  snackbar.error(mensaje);
}

export function formatearPalabra(palabra) {
  return palabra.split("").join(" ");
}
