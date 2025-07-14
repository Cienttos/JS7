import { apiFetch } from "../services/api.js";       // Función para hacer llamadas a la API
import { authService } from "../services/auth.js";   // Servicio para guardar token y nombre localmente
import { mostrarError } from "../utils/helpers.js";  // Función para mostrar mensajes de error

// Función que renderiza la vista de registro de usuario
export function renderRegisterView() {
  const container = document.getElementById("formContainer");

  // Insertamos el formulario de registro en el contenedor
  container.innerHTML = `
    <h3>Registro</h3>
    <form id="registerForm">
      <input type="text" id="regName" placeholder="Nombre" required />
      <input type="password" id="regPass" placeholder="Contraseña" required />
      <input type="password" id="regRePass" placeholder="Repetir Contraseña" required />
      <button type="submit">Registrarse</button>
    </form>
  `;

  // Cuando el formulario se envía:
  document.getElementById("registerForm").onsubmit = async (e) => {
    e.preventDefault(); // Evitamos que se recargue la página por defecto

    // Tomamos los valores ingresados y eliminamos espacios extras
    const name = document.getElementById("regName").value.trim();
    const password = document.getElementById("regPass").value.trim();
    const repassword = document.getElementById("regRePass").value.trim();

    // Validamos que las contraseñas coincidan
    if (password !== repassword) {
      mostrarError("Las contraseñas no coinciden");
      return; // Si no coinciden, no seguimos con el registro
    }

    try {
      // Llamamos a la API para registrar usuario (método POST con datos)
      const res = await apiFetch("/register", "POST", { name, password, repassword });
      const data = await res.json();

      // Si la API responde con error, mostramos el mensaje
      if (!data.success) {
        mostrarError(data.message || "Error al registrarse");
        return;
      }

      // Guardamos el token y el nombre localmente para mantener sesión
      authService.guardarToken(data.token, name);

      // Recargamos la página para actualizar el estado (usuario logueado)
      window.location.reload();
    } catch {
      // En caso de fallo en la conexión mostramos un error genérico
      mostrarError("Error en conexión");
    }
  };
}
