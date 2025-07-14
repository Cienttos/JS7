// Importamos la función initRender desde el archivo render.js dentro de la carpeta interface
import { initRender } from "./interface/render.js";

// Esperamos a que el contenido del documento (HTML) esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Una vez cargado todo, llamamos a initRender para iniciar la interfaz o vista
  initRender();
});
