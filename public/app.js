const API_URL = "http://localhost:3000";
const app = document.getElementById("app");

let user = null;
let scores = [];
let currentGame = null;
let timerInterval = null;
let tiempoSegundos = 0;

function guardarToken(token, name) {
  localStorage.setItem("token", token);
  localStorage.setItem("name", name);
}

function obtenerToken() {
  return localStorage.getItem("token");
}

function obtenerNombre() {
  return localStorage.getItem("name");
}

function borrarToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
}

function mostrarError(msg) {
  alert(msg);
}

async function render() {
  const token = obtenerToken();
  const name = obtenerNombre();

  if (!token) {
    user = null;
    renderLoginRegister();
    return;
  }

  try {
    const res = await fetch(API_URL + "/game/score", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Token inválido");

    scores = await res.json();
    user = { token, name };
    renderMenuLogged();
  } catch (error) {
    borrarToken();
    renderLoginRegister();
  }
}

function renderLoginRegister() {
  app.innerHTML = `
    <h2>Bienvenido, por favor Inicia sesión o Regístrate</h2>
    <div>
      <button id="btnShowLogin">Iniciar sesión</button>
      <button id="btnShowRegister">Registrarse</button>
    </div>
    <div id="formContainer"></div>
  `;

  document.getElementById("btnShowLogin").onclick = () => renderLoginForm();
  document.getElementById("btnShowRegister").onclick = () => renderRegisterForm();
}

function renderLoginForm() {
  document.getElementById("formContainer").innerHTML = `
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
      const res = await fetch(API_URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();
      if (!data.success) {
        mostrarError(data.message || "Error al iniciar sesión");
        return;
      }

      guardarToken(data.token, name);
      user = { name, token: data.token };
      await cargarScores();
      renderMenuLogged();
    } catch {
      mostrarError("Error de conexión");
    }
  };
}

function renderRegisterForm() {
  document.getElementById("formContainer").innerHTML = `
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
      const res = await fetch(API_URL + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password, repassword }),
      });

      const data = await res.json();
      if (!data.success) {
        mostrarError(data.message || "Error al registrarse");
        return;
      }

      guardarToken(data.token, name);
      user = { name, token: data.token };
      await cargarScores();
      renderMenuLogged();
    } catch {
      mostrarError("Error en conexión");
    }
  };
}

async function cargarScores() {
  try {
    const res = await fetch(API_URL + "/game/score", {
      method: "GET",
      headers: { Authorization: `Bearer ${user.token}` },
    });

    scores = await res.json();
  } catch {
    scores = [];
  }
}

async function renderMenuLogged() {
  currentGame = null;

  try {
    const res = await fetch(API_URL + "/game/start", {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token}` },
    });

    if (res.ok) {
      const data = await res.json();
      currentGame = {
        palabraOculta: data.palabraOculta.split("").join(" "),
        intentos: data.intentos,
        letrasIncorrectas: [],
        score: typeof data.score === "number" ? data.score : 0,
      };
    }
  } catch {}

  await cargarScores();

  app.innerHTML = `
    <h2>Bienvenido${user.name ? ", " + user.name : ""}</h2>
    <h3>Tabla de Scores</h3>
    ${
      scores.length === 0
        ? `<p>No hay scores disponibles</p>`
        : renderTablaScores(scores)
    }
    <div>
      <button id="btnJugar">Jugar Ahora</button>
      <button id="btnCerrarSesion">Cerrar Sesión</button>
    </div>
  `;

  document.getElementById("btnCerrarSesion").onclick = () => {
    borrarToken();
    user = null;
    currentGame = null;
    clearInterval(timerInterval);
    tiempoSegundos = 0;
    render();
  };

  document.getElementById("btnJugar").onclick = () => renderJuego();
}

function renderTablaScores(scores) {
  const ordenados = [...scores].sort((a, b) => b.best_score - a.best_score || a.best_time - b.best_time);

  return `
    <table border="1">
      <thead>
        <tr><th>Pos</th><th>Jugador</th><th>Score</th><th>Tiempo</th></tr>
      </thead>
      <tbody>
        ${ordenados.map((s, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${s.user_name}</td>
            <td>${s.best_score}</td>
            <td>${s.best_time}</td>
          </tr>`).join("")}
      </tbody>
    </table>
  `;
}

function renderJuego() {
  if (!currentGame) {
    app.innerHTML = `<p>No hay juego activo</p>`;
    return;
  }

  tiempoSegundos = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    tiempoSegundos++;
    document.getElementById("cronometro").textContent = `${tiempoSegundos} s`;
  }, 1000);

  app.innerHTML = `
    <h3>Juego Ahorcado</h3>
    <p><b>Palabra:</b> <span id="palabraOculta">${formatearPalabra(
      currentGame.palabraOculta
    )}</span></p>
    <p><b>Intentos:</b> <span id="intentos">${currentGame.intentos}</span></p>
    <p><b>Letras incorrectas:</b> <span id="letrasIncorrectas">${currentGame.letrasIncorrectas.join(
      ", "
    )}</span></p>
    <p><b>Tiempo:</b> <span id="cronometro">0 s</span></p>
    <p><b>Score:</b> <span id="score">${currentGame.score ?? 0}</span></p>
    <input type="text" id="inputJugada" placeholder="Ingresa letra o palabra" />
    <button id="btnEnviar">Enviar</button>
    <button id="btnFinalizar">Finalizar Juego</button>
    <p id="mensaje"></p>
  `;

  document.getElementById("btnEnviar").onclick = enviarJugada;
  document.getElementById("btnFinalizar").onclick = finalizarJuego;
}

function formatearPalabra(str) {
  return str.split("").join(" ");
}

async function enviarJugada() {
  const jugada = document.getElementById("inputJugada").value.trim().toLowerCase();
  if (!jugada) return alert("Ingresa algo");

  const palabraOriginal = currentGame.palabraOculta.replace(/ /g, "");
  if (jugada.length !== 1 && jugada.length !== palabraOriginal.length) {
    return alert("Ingresa 1 letra o la palabra completa");
  }

  try {
    const res = await fetch(API_URL + "/game/validate-word", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ palabraUsuario: jugada, tiempo: tiempoSegundos }),
    });

    const data = await res.json();

    if (res.ok) {
      currentGame.palabraOculta = formatearPalabra(data.palabra_oculta);
      currentGame.intentos = data.intentos;
      currentGame.letrasIncorrectas = data.letras_incorrectas || [];
      currentGame.score = typeof data.score === "number" ? data.score : currentGame.score;

      document.getElementById("palabraOculta").textContent = currentGame.palabraOculta;
      document.getElementById("intentos").textContent = currentGame.intentos;
      document.getElementById("letrasIncorrectas").textContent = currentGame.letrasIncorrectas.join(", ");
      document.getElementById("score").textContent = currentGame.score;
      document.getElementById("mensaje").textContent = data.mensaje || "";

      document.getElementById("inputJugada").value = "";

      if (data.scores) {
        clearInterval(timerInterval);
        await cargarScores();
        alert("Juego terminado");
        renderMenuLogged();
      }
    } else {
      mostrarError(data.error || "Error en jugada");
    }
  } catch {
    mostrarError("Error de conexión");
  }
}

async function finalizarJuego() {
  try {
    const res = await fetch(API_URL + "/game/finalize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ tiempo: tiempoSegundos }),
    });

    const data = await res.json();

    if (res.ok) {
      clearInterval(timerInterval);
      tiempoSegundos = 0;
      alert("Juego finalizado. Score: " + data.score);
      await cargarScores();
      renderMenuLogged();
    } else {
      mostrarError(data.error || "Error al finalizar");
    }
  } catch {
    mostrarError("Error de conexión");
  }
}

render();
