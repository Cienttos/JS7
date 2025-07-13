// Importamos funciones necesarias para hacer peticiones, manejar autenticación y mostrar errores
import { apiFetch } from "../services/api.js";
import { authService } from "../services/auth.js";
import { mostrarError } from "../utils/helpers.js";

// Función que muestra el formulario de registro y maneja el proceso
export function renderRegisterView() {
  // Seleccionamos el contenedor donde se mostrará el formulario
  const container = document.getElementById("formContainer");

  // Insertamos el HTML del formulario de registro
  container.innerHTML = `
    <h3>Registro</h3>
    <form id="registerForm">
      <input type="text" id="regName" placeholder="Nombre" required />
      <input type="password" id="regPass" placeholder="Contraseña" required />
      <input type="password" id="regRePass" placeholder="Repetir Contraseña" required />
      <button type="submit">Registrarse</button>
    </form>
  `;

  // Agregamos el evento para cuando se envíe el formulario
  document.getElementById("registerForm").onsubmit = async (e) => {
    e.preventDefault(); // Evita que se recargue la página al enviar

    // Obtenemos los valores ingresados y los limpiamos de espacios extra
    const name = document.getElementById("regName").value.trim();
    const password = document.getElementById("regPass").value.trim();
    const repassword = document.getElementById("regRePass").value.trim();

    // Verificamos que las contraseñas coincidan antes de enviar
    if (password !== repassword) {
      mostrarError("Las contraseñas no coinciden");
      return; // Salimos si no coinciden
    }

    try {
      // Hacemos la petición a la API para registrar al usuario
      const res = await apiFetch("/register", "POST", { name, password, repassword });
      const data = await res.json();

      // Si la API responde con error, mostramos el mensaje
      if (!data.success) {
        mostrarError(data.message || "Error al registrarse");
        return;
      }

      // Si se registra con éxito, guardamos el token y recargamos la página
      authService.guardarToken(data.token, name);
      window.location.reload();
    } catch {
      // Si hay problemas de conexión, mostramos un error
      mostrarError("Error en conexión");
    }
  };
}
