import { procesarLetra } from "../utils/palabraUtils.js";

export function validarJugada(palabraUsuario, palabra, palabraOcultaArr, letrasIncorrectas, intentos) {
  let mensaje = "";
  let sumarScore = false;
  let intentosRestantes = intentos;

  if (palabraUsuario.length === palabra.length) {
    if (palabraUsuario === palabra) {
      sumarScore = true;
      mensaje = "¡Correcto! Palabra resuelta. Se genera una nueva palabra.";
    } else {
      intentosRestantes = Math.max(0, intentos - 6);
      mensaje = "Palabra incorrecta. Pierdes 6 intentos.";
    }
  } else if (palabraUsuario.length === 1) {
    const resultado = procesarLetra(
      palabraUsuario,
      palabra,
      palabraOcultaArr,
      letrasIncorrectas,
      intentos
    );
    palabraOcultaArr = resultado.palabraOcultaArr;
    letrasIncorrectas = resultado.letrasIncorrectas;
    intentosRestantes = resultado.intentos;
    mensaje = resultado.mensaje;
  } else {
    throw { status: 400, message: "Solo una letra o la palabra completa" };
  }

  return {
    nuevaPalabra: palabra,
    nuevaPalabraOculta: palabraOcultaArr.join(""),
    letrasIncorrectasActualizadas: letrasIncorrectas,
    intentosRestantes,
    mensaje,
    sumarScore,
  };
}
