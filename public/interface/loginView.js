// Importamos funciones para hacer peticiones, manejar autenticación y mostrar errores
import { apiFetch } from "../services/api.js";
import { authService } from "../services/auth.js";
import { mostrarError } from "../utils/helpers.js";

// Función que muestra el formulario de login y maneja el proceso de inicio de sesión
export function renderLoginView() {
  // Seleccionamos el contenedor donde se mostrará el formulario
  const container = document.getElementById("formContainer");

  // Insertamos el HTML del formulario de login
  container.innerHTML = `
    <h3>Login</h3>
    <form id="loginForm">
      <input type="text" id="loginName" placeholder="Nombre" required />
      <input type="password" id="loginPass" placeholder="Contraseña" required />
      <button type="submit">Ingresar</button>
    </form>
  `;

  // Agregamos el evento para cuando se envíe el formulario
  document.getElementById("loginForm").onsubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar

    // Obtenemos los valores ingresados y los limpiamos de espacios extra
    const name = document.getElementById("loginName").value.trim();
    const password = document.getElementById("loginPass").value.trim();

    try {
      // Hacemos la petición a la API para iniciar sesión con los datos ingresados
      const res = await apiFetch("/login", "POST", { name, password });
      const data = await res.json();

      // Si la API responde con error, mostramos el mensaje
      if (!data.success) {
        mostrarError(data.message || "Error al iniciar sesión");
        return;
      }

      // Si el login es exitoso, guardamos el token y recargamos la página para mostrar el menú
      authService.guardarToken(data.token, name);
      window.location.reload();
    } catch {
      // Si hay problemas de conexión, mostramos un mensaje de error
      mostrarError("Error de conexión");
    }
  };
}
