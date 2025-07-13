export default class ScoreClass {
  constructor() {
    this.seccionScore = document.getElementById("score");
    this.listaScores = document.getElementById("lista-scores");
    this.scoreUsuario = document.getElementById("score-usuario");
    this.btnJugar = document.getElementById("btn-jugar");
    this.btnCerrarSesion = document.getElementById("btn-cerrar-sesion");

    this.btnJugar.addEventListener("click", () => this.emitirJugar());
    this.btnCerrarSesion.addEventListener("click", () => this.emitirCerrarSesion());

    this.jugarCallback = null;
    this.cerrarSesionCallback = null;
  }

  mostrarSecciones() {
    this.seccionScore.style.display = "block";
  }

  ocultarSecciones() {
    this.seccionScore.style.display = "none";
  }

  cargarScores(scores = null) {
    // Si se pasan scores, usamos esos. Sino hacemos fetch.
    if (scores) {
      this.renderScores(scores);
    } else {
      fetch("/game/score", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          this.renderScores(data);
        })
        .catch(console.error);
    }
  }

  renderScores(scores) {
    this.listaScores.innerHTML = "";

    if (!Array.isArray(scores) || scores.length === 0) {
      this.listaScores.innerHTML = "<li>No hay scores para mostrar</li>";
      return;
    }

    scores.forEach(({ user_name, best_score, best_time }) => {
      const li = document.createElement("li");
      li.textContent = `${user_name} - Puntaje: ${best_score}, Tiempo: ${best_time}s`;
      this.listaScores.appendChild(li);
    });
  }

  onJugar(callback) {
    this.jugarCallback = callback;
  }

  emitirJugar() {
    if (this.jugarCallback) this.jugarCallback();
  }

  onCerrarSesion(callback) {
    this.cerrarSesionCallback = callback;
  }

  emitirCerrarSesion() {
    if (this.cerrarSesionCallback) this.cerrarSesionCallback();
  }
}
