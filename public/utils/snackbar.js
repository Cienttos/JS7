export class Snackbar {
  constructor() {
    // Crear contenedor general si no existe
    if (!document.getElementById('snackbar-container')) {
      this.container = document.createElement('div');
      this.container.id = 'snackbar-container';
      this.container.style.position = 'fixed';
      this.container.style.left = '50%';
      this.container.style.transform = 'translateX(-50%)';
      this.container.style.zIndex = '9999';
      this.container.style.width = 'auto';
      this.container.style.maxWidth = '90%';
      this.container.style.pointerEvents = 'none';
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('snackbar-container');
    }
  }

  _createSnackbar(message, type = 'info', from = 'bottom') {
    const snack = document.createElement('div');
    snack.textContent = message;
    snack.style.minWidth = '250px';
    snack.style.margin = '0.5rem auto';
    snack.style.padding = '1rem 1.5rem';
    snack.style.borderRadius = '12px';
    snack.style.color = '#222';
    snack.style.fontFamily = `'Patrick Hand', cursive, sans-serif`;
    snack.style.fontSize = '1.1rem';
    snack.style.boxShadow = '3px 3px 10px rgba(0,0,0,0.2), inset 0 0 5px rgba(255,255,255,0.6)';
    snack.style.opacity = '0';
    snack.style.pointerEvents = 'auto';
    snack.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    snack.style.userSelect = 'none';
    snack.style.position = 'relative';

    // Colores y animación según tipo
    if (type === 'error') {
      snack.style.background = '#ffdddd';
      snack.style.border = '2px solid #e44';
      snack.style.boxShadow = '2px 2px 8px rgba(228, 68, 68, 0.6), inset 0 0 10px rgba(255, 200, 200, 0.8)';
      snack.style.transform = from === 'top' ? 'translateY(-100%)' : 'translateY(100%)';
    } else if (type === 'success') {
      snack.style.background = '#ddffdd';
      snack.style.border = '2px solid #4a4';
      snack.style.boxShadow = '2px 2px 8px rgba(74, 148, 74, 0.6), inset 0 0 10px rgba(200, 255, 200, 0.8)';
      snack.style.transform = from === 'top' ? 'translateY(-100%)' : 'translateY(100%)';
    } else {
      // info or default
      snack.style.background = '#ddeeff';
      snack.style.border = '2px solid #4488cc';
      snack.style.boxShadow = '2px 2px 8px rgba(68, 136, 204, 0.6), inset 0 0 10px rgba(200, 220, 255, 0.8)';
      snack.style.transform = from === 'top' ? 'translateY(-100%)' : 'translateY(100%)';
    }

    return snack;
  }

  show(message, type = 'info', duration = 3000, from = 'bottom') {
    const snack = this._createSnackbar(message, type, from);
    this.container.appendChild(snack);

    // For from top, place container at top, else bottom
    if(from === 'top') {
      this.container.style.top = '20px';
      this.container.style.bottom = '';
    } else {
      this.container.style.bottom = '20px';
      this.container.style.top = '';
    }

    // Trigger animation (show)
    requestAnimationFrame(() => {
      snack.style.opacity = '1';
      snack.style.transform = 'translateY(0)';
    });

    // Ocultar después del tiempo
    setTimeout(() => {
      snack.style.opacity = '0';
      snack.style.transform = from === 'top' ? 'translateY(-100%)' : 'translateY(100%)';

      // Eliminar después de animación
      snack.addEventListener('transitionend', () => {
        snack.remove();
      }, {once: true});
    }, duration);
  }

  success(msg, duration = 3000, from = 'bottom') {
    this.show(msg, 'success', duration, from);
  }

  error(msg, duration = 3000, from = 'top') {
    this.show(msg, 'error', duration, from);
  }

  info(msg, duration = 3000, from = 'bottom') {
    this.show(msg, 'info', duration, from);
  }
}
