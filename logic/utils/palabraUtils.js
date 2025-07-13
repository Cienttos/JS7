// ===========================================
// Obtener una palabra aleatoria del array
// ===========================================
// Toma un array de palabras y devuelve una aleatoria

export function obtenerPalabraAleatoria(array) {
  try {
    const palabra = array[Math.floor(Math.random() * array.length)];
    return palabra;
  } catch (err) {
    console.log(err);
    return null;
  }
}

// ===========================================
// Ocultar una palabra
// ===========================================
// Convierte una palabra en una cadena oculta con "_ " por cada letra

export function obtenerPalabraOculta(palabra) {
  try {
    const palabraOculta = "_ ".repeat(palabra.length);
    return palabraOculta;
  } catch (err) {
    console.log("Error:", err);
    return null;
  }
}

// ===========================================
// Procesar una letra ingresada
// ===========================================
// Recibe una letra, la palabra completa, el array de letras visibles,
// el array de letras incorrectas y los intentos restantes.
// Devuelve los valores actualizados, y un mensaje.

export function procesarLetra(letra, palabra, palabraOcultaArr, letrasIncorrectas, intentos) {
  let acierto = false;

  // Recorremos cada letra de la palabra y actualizamos si coincide
  palabra.split("").forEach((l, i) => {
    if (l === letra) {
      palabraOcultaArr[i] = letra;
      acierto = true;
    }
  });

  // Si no acertó, se descuenta un intento y se guarda la letra incorrecta
  if (!acierto) {
    if (!letrasIncorrectas.includes(letra)) {
      letrasIncorrectas.push(letra);
    }
    intentos = Math.max(0, intentos - 1); // Nunca baja de 0
  }

  return {
    palabraOcultaArr,
    letrasIncorrectas,
    intentos,
    mensaje: acierto ? "¡Letra acertada!" : "Letra incorrecta. Pierdes 1 intento.",
  };
}
