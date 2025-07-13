export default class AuthClass {
  constructor(scoreInstance, gameInstance) {
    this.scoreInstance = scoreInstance;
    this.gameInstance = gameInstance;

    this.btnReg = document.getElementById("btn-reg");
    this.btnLog = document.getElementById("btn-log");
    this.formReg = document.getElementById("form-reg");
    this.formLog = document.getElementById("form-log");
    this.btnVolverReg = document.getElementById("volver-reg");
    this.btnVolverLog = document.getElementById("volver-log");

    this.init();
  }

  async init() {
    // Revisar si hay sesión activa (cookie)
    await this.checkSession();

    // Eventos botones menú inicio
    this.btnReg.addEventListener("click", () => this.mostrarFormRegistro());
    this.btnLog.addEventListener("click", () => this.mostrarFormLogin());
    this.btnVolverReg.addEventListener("click", () => this.mostrarMenuInicio());
    this.btnVolverLog.addEventListener("click", () => this.mostrarMenuInicio());

    // Eventos submit formularios
    this.formReg.addEventListener("submit", (e) => this.handleRegistro(e));
    this.formLog.addEventListener("submit", (e) => this.handleLogin(e));
  }

  mostrarMenuInicio() {
    document.getElementById("inicio").style.display = "block";
    this.formReg.style.display = "none";
    this.formLog.style.display = "none";
    if (this.scoreInstance) this.scoreInstance.ocultarSecciones();
    if (this.gameInstance) this.gameInstance.ocultarSecciones();
  }

  mostrarFormRegistro() {
    document.getElementById("inicio").style.display = "block";
    this.formReg.style.display = "block";
    this.formLog.style.display = "none";
  }

  mostrarFormLogin() {
    document.getElementById("inicio").style.display = "block";
    this.formReg.style.display = "none";
    this.formLog.style.display = "block";
  }

  mostrarMenuScore() {
    document.getElementById("inicio").style.display = "none";
    if (this.gameInstance) this.gameInstance.ocultarSecciones();
    this.scoreInstance.mostrarSecciones();
    this.scoreInstance.cargarScores();
  }

  async checkSession() {
    try {
      const res = await fetch("/game/score", {
        credentials: "include",
      });
      if (res.ok) {
        this.mostrarMenuScore();
      } else {
        this.mostrarMenuInicio();
      }
    } catch {
      this.mostrarMenuInicio();
    }
  }

  async handleRegistro(e) {
    e.preventDefault();
    const name = document.getElementById("reg-nombre").value.trim();
    const password = document.getElementById("reg-pass").value;
    const repassword = document.getElementById("reg-pass2").value;

    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, password, repassword }),
      });
      const data = await res.json();

      if (data.success) {
        alert("Registro exitoso");
        this.mostrarMenuScore();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    const name = document.getElementById("log-nombre").value.trim();
    const password = document.getElementById("log-pass").value;

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json();

      if (data.success) {
        this.mostrarMenuScore();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  cerrarSesion() {
    // Para cerrar sesión, se borra cookie con petición al backend
    document.cookie = "token=; Max-Age=0; path=/";
    this.mostrarMenuInicio();
  }
}
