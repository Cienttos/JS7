export default class GameClass {
  constructor(scoreInstance) {
    this.scoreInstance = scoreInstance;

    this.seccionJuego = document.getElementById("juego");
    this.inputJugada = document.getElementById("input-jugada");
    this.btnEnviar = document.getElementById("btn-enviar");
    this.mensajeDiv = document.getElementById("mensaje");
    this.btnFinalizar = document.getElementById("btn-finalizar");
    this.nombreSpan = document.getElementById("nombre");
    this.scoreSpan = document.getElementById("score");
    this.palabraSpan = document.getElementById("palabra");
    this.intentosSpan = document.getElementById("intentos");
    this.letrasIncorrectasSpan = document.getElementById("letras-incorrectas");
    this.cronometroSpan = document.getElementById("cronometro");

    this.tiempoInicio = null;
    this.cronometroInterval = null;

    this.init();
  }

  init() {
    this.btnEnviar.addEventListener("click", (e) => {
      e.preventDefault();
      this.enviarJugada();
    });

    this.btnFinalizar.addEventListener("click", (e) => {
      e.preventDefault();
      this.finalizarJuego();
    });
  }

  ocultarSecciones() {
    this.seccionJuego.style.display = "none";
  }

  mostrarSecciones() {
    this.seccionJuego.style.display = "block";
  }

  empezarCronometro() {
    this.tiempoInicio = Date.now();
    this.cronometroInterval = setInterval(() => {
      const segundos = Math.floor((Date.now() - this.tiempoInicio) / 1000);
      const min = String(Math.floor(segundos / 60)).padStart(2, "0");
      const seg = String(segundos % 60).padStart(2, "0");
      this.cronometroSpan.textContent = `${min}:${seg}`;
    }, 1000);
  }

  detenerCronometro() {
    clearInterval(this.cronometroInterval);
  }

  async iniciarJuego() {
    try {
      const res = await fetch("/game/start", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        this.palabraSpan.textContent = data.palabraOculta;
        this.intentosSpan.textContent = data.intentos;
        this.letrasIncorrectasSpan.textContent = "";
        this.scoreSpan.textContent = "0"; // Score inicial siempre 0
        this.mensajeDiv.textContent = "";
        this.inputJugada.value = "";
        this.mostrarSecciones();
        this.empezarCronometro();
      } else {
        alert(data.error || "Error al iniciar el juego");
      }
    } catch (err) {
      alert("Error en la conexión");
      console.error(err);
    }
  }

  async enviarJugada() {
    const jugada = this.inputJugada.value.trim().toLowerCase();
    if (!jugada) return;

    const tiempoTranscurrido = Math.floor((Date.now() - this.tiempoInicio) / 1000);

    try {
      const res = await fetch("/game/validate-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ palabraUsuario: jugada, tiempo: tiempoTranscurrido }),
      });
      const data = await res.json();

      if (res.ok) {
        this.palabraSpan.textContent = data.palabra_oculta;
        this.intentosSpan.textContent = data.intentos;
        this.letrasIncorrectasSpan.textContent = Array.isArray(data.letras_incorrectas)
          ? data.letras_incorrectas.join(", ")
          : "";
        this.mensajeDiv.textContent = data.mensaje;

        // Mostrar score solo si viene (cuando termina)
        if (data.score !== null && data.score !== undefined) {
          this.scoreSpan.textContent = data.score;
        }

        this.inputJugada.value = "";

        if (data.score !== null && data.score !== undefined) {
          // Juego terminó
          this.detenerCronometro();
          await this.scoreInstance.cargarScores();
          this.ocultarSecciones();
          this.scoreInstance.mostrarSecciones();
        }
      } else {
        this.mensajeDiv.textContent = data.error || "Error en la jugada";
      }
    } catch (err) {
      this.mensajeDiv.textContent = "Error en la conexión";
      console.error(err);
    }
  }

  async finalizarJuego() {
    this.detenerCronometro();
    const tiempoTranscurrido = Math.floor((Date.now() - this.tiempoInicio) / 1000);

    try {
      const res = await fetch("/game/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tiempo: tiempoTranscurrido }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.scores) {
          await this.scoreInstance.cargarScores(data.scores);
        }
        this.ocultarSecciones();
        this.scoreInstance.mostrarSecciones();
        this.mensajeDiv.textContent = "";
      } else {
        alert(data.error || "Error al finalizar el juego");
      }
    } catch (err) {
      alert("Error en la conexión al finalizar el juego");
      console.error(err);
    }
  }

  setNombre(nombre) {
    this.nombreSpan.textContent = nombre;
  }
}
