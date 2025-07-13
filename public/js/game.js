export class Game {
  // Constructor que crea una nueva partida con la palabra oculta, intentos y puntaje inicial
  constructor({ palabraOculta, intentos, score = 0 }) {
    // Guarda la palabra con espacios entre letras para mostrarla
    this.palabraOculta = palabraOculta.split("").join(" ");
    this.intentos = intentos;             // Intentos disponibles para el jugador
    this.letrasIncorrectas = [];          // Letras que el jugador ha errado
    this.score = score;                   // Puntaje actual
  }

  // Actualiza el estado del juego con nueva información (por ejemplo, del servidor)
  actualizar({ palabra_oculta, intentos, letras_incorrectas, score }) {
    this.palabraOculta = palabra_oculta.split("").join(" ");  // Actualiza la palabra oculta
    this.intentos = intentos;                                  // Actualiza intentos restantes
    this.letrasIncorrectas = letras_incorrectas || [];        // Actualiza letras incorrectas (o vacío)
    if (typeof score === "number") {                           // Si hay nuevo puntaje válido, actualiza
      this.score = score;
    }
  }
}
