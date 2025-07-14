// Definimos una clase llamada Timer que se encarga de contar el tiempo en segundos
export class Timer {
  constructor(updateCallback = null) {
    this.seconds = 0; // Contador de segundos
    this.interval = null; // Guardamos el ID del setInterval para poder detenerlo
    this.updateCallback = updateCallback; // Función que se puede ejecutar cada segundo (si se pasa una)
  }

  // Método para comenzar el temporizador
  start() {
    this.stop(); // Por si ya había un temporizador corriendo, lo detenemos primero
    this.seconds = 0; // Reiniciamos los segundos
    this.interval = setInterval(() => {
      this.seconds++; // Aumentamos el contador cada segundo
      if (this.updateCallback) this.updateCallback(this.seconds); // Llamamos a la función externa, si existe
    }, 1000); // Cada 1000 milisegundos (1 segundo)
  }

  // Método para detener el temporizador
  stop() {
    if (this.interval !== null) {
      clearInterval(this.interval); // Detenemos el setInterval
      this.interval = null; // Marcamos que ya no hay temporizador activo
    }
  }

  // Método para reiniciar el temporizador (detener y poner en 0)
  reset() {
    this.stop();
    this.seconds = 0;
  }

  // Método para obtener el tiempo actual en segundos
  get time() {
    return this.seconds;
  }
}
