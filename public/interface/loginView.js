import { apiFetch } from "../services/api.js";
import { authService } from "../services/auth.js";
import { mostrarError } from "../utils/helpers.js";

export function renderLoginView() {
  const container = document.getElementById("formContainer");

  container.innerHTML = `
    <h3>Login</h3>
    <form id="loginForm">
      <input type="text" id="loginName" placeholder="Nombre" required />
      <input type="password" id="loginPass" placeholder="Contraseña" required />
      <button type="submit">Ingresar</button>
    </form>
  `;

  document.getElementById("loginForm").onsubmit = async (e) => {
    e.preventDefault();

    const name = document.getElementById("loginName").value.trim();
    const password = document.getElementById("loginPass").value.trim();

    try {
      const res = await apiFetch("/login", "POST", { name, password });
      const data = await res.json();

      if (!data.success) {
        mostrarError(data.message || "Error al iniciar sesión");
        return;
      }

      authService.guardarToken(data.token, name);
      window.location.reload();
    } catch {
      mostrarError("Error de conexión");
    }
  };
}
