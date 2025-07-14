// Importamos funciones y clases necesarias para la lógica y las vistas
import { authService } from "../services/auth.js";
import { apiFetch } from "../services/api.js";
import { Game } from "../js/game.js";
import { renderLoginView } from "./loginView.js";
import { renderRegisterView } from "./registerView.js";
import { renderMenuView } from "./menuView.js";
import { renderGameView } from "./gameView.js";
import { mostrarError } from "../utils/helpers.js";

// Variables globales para controlar estado de la app
let app;             // Elemento principal donde se renderiza todo
let user = null;     // Usuario logueado (token y nombre)
let scores = [];     // Lista de scores para mostrar
let currentGame = null;  // Juego actual en curso
let timer = null;        // Temporizador (no usado aquí pero declarado)

// Función inicial que se llama para arrancar la app
export function initRender() {
  app = document.getElementById("app"); // Guardamos el elemento principal
  render();                            // Llamamos a la función que decide qué mostrar
}

// Función principal que decide qué vista mostrar según si hay usuario logueado o no
async function render() {
  // Obtenemos token y nombre guardados en localStorage
  const token = authService.obtenerToken();
  const name = authService.obtenerNombre();

  // Si no hay token, mostramos la pantalla de login/registro
  if (!token) {
    user = null;
    renderLoginRegister();
    return;
  }

  try {
    // Intentamos obtener la lista de scores con el token guardado
    const res = await apiFetch("/game/score", "GET", null, token);
    if (!res.ok) throw new Error("Token inválido");

    scores = await res.json();   // Guardamos los scores recibidos
    user = { token, name };      // Guardamos usuario actual
    await renderMenu();          // Mostramos el menú principal
  } catch (error) {
    // Si algo falla, borramos token y mostramos pantalla de login/registro
    authService.borrarToken();
    renderLoginRegister();
  }
}

// Muestra la pantalla de bienvenida con opciones para login o registro
function renderLoginRegister() {
  app.innerHTML = `
    <div class="welcome-box">
      <h1>✏️ ¡AhorcadoTime!</h1>
      <p><strong>Reglas:</strong> Tenés que adivinar la palabra antes de que se te acaben los intentos. Podés ingresar letras o toda la palabra. ¡Tu puntaje dependerá de los aciertos y el tiempo!</p>
      <p><em>Iniciá sesión o registrate para comenzar a jugar.</em></p>
      <div class="button-group">
        <button class="btn" id="btnShowLogin">Iniciar sesión</button>
        <button class="btn" id="btnShowRegister">Registrarse</button>
      </div>
    </div>
    <div id="formContainer"></div>
  `;

  document.getElementById("btnShowLogin").onclick = () => renderLoginView();
  document.getElementById("btnShowRegister").onclick = () => renderRegisterView();
}


// Muestra el menú principal y prepara un nuevo juego
async function renderMenu() {
  currentGame = null; // Reiniciamos el juego actual

  try {
    // Intentamos iniciar un nuevo juego llamando a la API
    const res = await apiFetch("/game/start", "POST", null, user.token);
    if (res.ok) {
      const data = await res.json();

      // Creamos la instancia de juego con los datos recibidos
      currentGame = new Game({
        palabraOculta: data.palabraOculta,
        intentos: data.intentos,
        score: data.score,
      });
    }
  } catch (e) {
    console.log("Error: "+e)
  }

  // Renderizamos el menú, pasando datos y funciones para manejar eventos
  renderMenuView({
    app,
    user,
    scores,
    currentGame,
    onLogout: () => {
      // Al cerrar sesión borramos datos y volvemos a pantalla inicial
      authService.borrarToken();
      user = null;
      currentGame = null;
      render();
    },
    onPlay: () => renderGame(), // Al jugar, mostramos la vista del juego
  });
}

// Muestra la vista del juego activo o un mensaje si no hay juego
function renderGame() {
  if (!currentGame) {
    app.innerHTML = "<p>No hay juego activo</p>";
    return;
  }

  // Llamamos a la vista que muestra el juego, con datos y función para terminarlo
  renderGameView({
    app,
    game: currentGame,
    user,
    onGameEnd: async () => {
      // Al terminar el juego, actualizamos la lista de scores y volvemos al menú
      scores = [];
      try {
        const res = await apiFetch("/game/score", "GET", null, user.token);
        if (res.ok) scores = await res.json();
      } catch {}
      await renderMenu();
    },
  });
}
