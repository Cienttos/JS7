// utils/timer.js

export class Timer {
  constructor(updateCallback = null) {
    this.seconds = 0;
    this.interval = null;
    this.updateCallback = updateCallback; // función que se llama cada segundo
  }

  start() {
    this.stop(); // por si ya había uno corriendo
    this.seconds = 0;
    this.interval = setInterval(() => {
      this.seconds++;
      if (this.updateCallback) this.updateCallback(this.seconds);
    }, 1000);
  }

  stop() {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  reset() {
    this.stop();
    this.seconds = 0;
  }

  get time() {
    return this.seconds;
  }
}
