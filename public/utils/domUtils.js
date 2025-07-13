// domUtils.js

/**
 * Devuelve un elemento del DOM por su ID.
 * Ejemplo: const btn = $("mi-boton");
 */
export const $ = (id) => document.getElementById(id);

/**
 * Atajo para asignar un evento click.
 * Ejemplo: onClick($("btn"), () => alert("Hola"));
 */
export const onClick = (element, callback) => {
  if (element) element.addEventListener("click", callback);
};

/**
 * Atajo para asignar un evento submit a un formulario.
 * Ejemplo: onSubmit($("form"), (e) => {...});
 */
export const onSubmit = (form, callback) => {
  if (form) form.addEventListener("submit", callback);
};

/**
 * Ejecuta una función cuando el DOM está completamente cargado.
 * Ejemplo: ready(() => console.log("DOM listo"));
 */
export const ready = (callback) => {
  window.addEventListener("DOMContentLoaded", callback);
};


// Crea un nuevo elemento HTML con atributos opcionales.
// tag: el tipo de etiqueta a crear (por ejemplo "div", "li", "span").
// attrs: un objeto con atributos como id, className, textContent, etc.
export const crearElemento = (tag, attrs = {}) => {
  const el = document.createElement(tag);

  // Recorre los atributos y los asigna al elemento
  for (const [key, value] of Object.entries(attrs)) {
    // Si el atributo existe en el elemento (como textContent, className)
    if (key in el) {
      el[key] = value;
    } else {
      // Si es un atributo HTML estándar (como data-id, title, etc.)
      el.setAttribute(key, value);
    }
  }

  // Devuelve el nuevo elemento
  return el;
};
