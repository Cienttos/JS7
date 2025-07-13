import pool from "../../db.js";

// Crear un nuevo juego en la base de datos
export async function crearNuevoJuegoDB(userId, palabra, palabraOculta, intentos, score) {
  // Usamos REPLACE INTO para crear o reemplazar el juego activo
  await pool.query(
    `REPLACE INTO games 
      (user_id, word, hidden_word, player_word, letters, attempts, time, date, status, score) 
      VALUES (?, ?, ?, '', '', ?, 0, NOW(), 'playing', ?)`,
    [userId, palabra, palabraOculta, intentos, score]
  );
}

// Obtener el juego activo de un usuario
export async function obtenerJuegoActivoDB(userId) {
  // Obtenemos el último juego con status "playing"
  const [rows] = await pool.query(
    `SELECT word, hidden_word, attempts, player_word, letters, score 
     FROM games 
     WHERE user_id = ? AND status = 'playing' 
     ORDER BY date DESC 
     LIMIT 1`,
    [userId]
  );
  return rows[0];
}

// Actualizar un juego existente
export async function actualizarJuegoDB(userId, data) {
  const {
    nuevaPalabra,
    nuevaPalabraOculta,
    palabraUsuario,
    letrasIncorrectas,
    intentosRestantes,
    tiempo,
    nuevoStatus,
    score,
  } = data;

  // Actualizamos los campos del juego con los valores nuevos
  await pool.query(
    `UPDATE games
     SET word = ?, 
         hidden_word = ?, 
         player_word = ?, 
         letters = ?, 
         attempts = ?, 
         time = ?, 
         status = ?, 
         score = ?
     WHERE user_id = ?`,
    [
      nuevaPalabra,
      nuevaPalabraOculta,
      palabraUsuario,
      letrasIncorrectas.join(","), // Convertimos array a string
      intentosRestantes,
      tiempo,
      nuevoStatus,
      score,
      userId,
    ]
  );
}
