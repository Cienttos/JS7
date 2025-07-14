import { procesarLetra } from "../utils/palabraUtils.js";

// Función que valida la jugada que hace el usuario
// Parámetros:
// palabraUsuario: letra o palabra que el usuario ingresó
// palabra: palabra correcta completa (sin ocultar)
// palabraOcultaArr: arreglo con las letras descubiertas y ocultas (array de caracteres)
// letrasIncorrectas: arreglo con las letras incorrectas ya probadas
// intentos: número actual de intentos restantes
export function validarJugada(palabraUsuario, palabra, palabraOcultaArr, letrasIncorrectas, intentos) {
  let mensaje = "";           // Mensaje que se mostrará según resultado
  let sumarScore = false;     // Bandera para indicar si se suma puntaje
  let intentosRestantes = intentos; // Copia del número de intentos para modificar

  // Caso 1: el usuario ingresó la palabra completa (tamaño igual a la palabra)
  if (palabraUsuario.length === palabra.length) {
    // Si la palabra es correcta
    if (palabraUsuario === palabra) {
      sumarScore = true;  // Se suma puntaje porque acertó la palabra completa
      mensaje = "¡Correcto! Palabra resuelta. Se genera una nueva palabra.";
    } else {
      // Si la palabra es incorrecta, se restan 6 intentos (mínimo 0)
      intentosRestantes = Math.max(0, intentos - 6);
      mensaje = "Palabra incorrecta. Pierdes 6 intentos.";
    }
  } 
  // Caso 2: el usuario ingresó solo una letra
  else if (palabraUsuario.length === 1) {
    // Llama a procesarLetra que se encarga de actualizar el estado con esa letra
    const resultado = procesarLetra(
      palabraUsuario,
      palabra,
      palabraOcultaArr,
      letrasIncorrectas,
      intentos
    );
    // Actualiza los valores con los que regresa procesarLetra
    palabraOcultaArr = resultado.palabraOcultaArr;
    letrasIncorrectas = resultado.letrasIncorrectas;
    intentosRestantes = resultado.intentos;
    mensaje = resultado.mensaje;
  } 
  // Caso 3: cualquier otro input (ni letra ni palabra del tamaño correcto)
  else {
    // Lanza un error con status 400 y mensaje descriptivo
    throw { status: 400, message: "Solo una letra o la palabra completa" };
  }

  // Devuelve un objeto con el nuevo estado actualizado después de la jugada
  return {
    nuevaPalabra: palabra,                       // La palabra original (sin cambios)
    nuevaPalabraOculta: palabraOcultaArr.join(""), // Palabra oculta actualizada como string
    letrasIncorrectasActualizadas: letrasIncorrectas, // Letras incorrectas actualizadas
    intentosRestantes,                           // Intentos restantes actualizados
    mensaje,                                     // Mensaje para mostrar al usuario
    sumarScore,                                  // Si se debe sumar puntaje (true/false)
  };
}
