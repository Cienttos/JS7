import { apiFetch } from "../services/api.js";       // Función para hacer solicitudes a la API
import { authService } from "../services/auth.js";   // Servicio para manejar token y nombre en localStorage
import { mostrarError } from "../utils/helpers.js";  // Función para mostrar mensajes de error

// Función que renderiza la vista de login (inicio de sesión)
export function renderLoginView() {
  const container = document.getElementById("formContainer");

  // Insertamos el formulario de login en el contenedor
  container.innerHTML = `
    <h3>Login</h3>
    <form id="loginForm">
      <input type="text" id="loginName" placeholder="Nombre" required />
      <input type="password" id="loginPass" placeholder="Contraseña" required />
      <button type="submit">Ingresar</button>
    </form>
  `;

  // Manejamos el evento submit del formulario
  document.getElementById("loginForm").onsubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue automáticamente

    // Obtenemos y limpiamos los valores ingresados
    const name = document.getElementById("loginName").value.trim();
    const password = document.getElementById("loginPass").value.trim();

    try {
      // Llamamos a la API para intentar iniciar sesión
      const res = await apiFetch("/login", "POST", { name, password });
      const data = await res.json();

      // Si la respuesta no es exitosa, mostramos el mensaje de error
      if (!data.success) {
        mostrarError(data.message || "Error al iniciar sesión");
        return;
      }

      // Guardamos el token y el nombre para mantener sesión
      authService.guardarToken(data.token, name);

      // Recargamos la página para actualizar la interfaz (usuario logueado)
      window.location.reload();
    } catch {
      // Si hay un error de conexión, mostramos un mensaje genérico
      mostrarError("Error de conexión");
    }
  };
}
