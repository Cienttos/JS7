// Importamos la conexión pool para hacer consultas a la base de datos
import pool from "../../db.js";

// Función que obtiene el score de un usuario específico (por su userId)
// Retorna la fila con los datos del score o undefined si no existe
export async function obtenerScorePorUsuarioDB(userId) {
  const [rows] = await pool.query(
    `SELECT * FROM scores WHERE user_id = ?`,
    [userId]
  );
  return rows[0]; // Primer resultado (debería ser único)
}

// Función para crear un nuevo registro de score en la tabla 'scores'
// Recibe id y nombre de usuario, score, tiempo y guarda la fecha actual
export async function crearNuevoScoreDB(userId, userName, score, tiempo) {
  const now = new Date();

  await pool.query(
    `INSERT INTO scores (user_id, user_name, best_score, best_time, last_date) 
     VALUES (?, ?, ?, ?, ?)`,
    [userId, userName, score, tiempo, now]
  );

  // Retorna el score recién creado con fecha y tiempo
  return { score, best_time: tiempo, last_date: now };
}

// Función para actualizar un score existente en la tabla 'scores'
// Actualiza el puntaje, tiempo y fecha al momento actual para un usuario dado
export async function actualizarScoreDB(userId, score, tiempo) {
  const now = new Date();

  await pool.query(
    `UPDATE scores 
     SET best_score = ?, best_time = ?, last_date = ? 
     WHERE user_id = ?`,
    [score, tiempo, now, userId]
  );

  // Retorna el nuevo score con tiempo y fecha
  return { score, best_time: tiempo, last_date: now };
}

// Función que obtiene el nombre de usuario desde la tabla 'users' por id
// Retorna el nombre o cadena vacía si no existe
export async function obtenerNombreUsuarioDB(userId) {
  const [rows] = await pool.query(
    `SELECT user_name FROM users WHERE id = ?`,
    [userId]
  );

  return rows.length ? rows[0].user_name : "";
}

// Función que obtiene todos los scores registrados en la tabla 'scores'
// Devuelve un array con todos los registros
export async function obtenerTodosLosScoresDB() {
  const [rows] = await pool.query(
    `SELECT user_name, best_time, best_score, last_date FROM scores`
  );

  return rows;
}
