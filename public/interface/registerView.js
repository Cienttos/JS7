import { apiFetch } from "../services/api.js";
import { authService } from "../services/auth.js";
import { mostrarError } from "../utils/helpers.js";

export function renderRegisterView() {
  const container = document.getElementById("formContainer");

  container.innerHTML = `
    <h3>Registro</h3>
    <form id="registerForm">
      <input type="text" id="regName" placeholder="Nombre" required />
      <input type="password" id="regPass" placeholder="Contraseña" required />
      <input type="password" id="regRePass" placeholder="Repetir Contraseña" required />
      <button type="submit">Registrarse</button>
    </form>
  `;

  document.getElementById("registerForm").onsubmit = async (e) => {
    e.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const password = document.getElementById("regPass").value.trim();
    const repassword = document.getElementById("regRePass").value.trim();

    if (password !== repassword) {
      mostrarError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await apiFetch("/register", "POST", { name, password, repassword });
      const data = await res.json();

      if (!data.success) {
        mostrarError(data.message || "Error al registrarse");
        return;
      }

      authService.guardarToken(data.token, name);
      window.location.reload();
    } catch {
      mostrarError("Error en conexión");
    }
  };
}
