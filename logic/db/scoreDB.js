import pool from "../../db.js";

export async function obtenerScorePorUsuarioDB(userId) {
  const [rows] = await pool.query(
    `SELECT * FROM scores WHERE user_id = ?`,
    [userId]
  );
  return rows[0];
}

export async function crearNuevoScoreDB(userId, userName, score, tiempo) {
  const now = new Date();

  await pool.query(
    `INSERT INTO scores (user_id, user_name, best_score, best_time, last_date) 
     VALUES (?, ?, ?, ?, ?)`,
    [userId, userName, score, tiempo, now]
  );

  return { score, best_time: tiempo, last_date: now };
}


export async function actualizarScoreDB(userId, score, tiempo) {
  const now = new Date();

  await pool.query(
    `UPDATE scores 
     SET best_score = ?, best_time = ?, last_date = ? 
     WHERE user_id = ?`,
    [score, tiempo, now, userId]
  );

  return { score, best_time: tiempo, last_date: now };
}

export async function obtenerNombreUsuarioDB(userId) {
  const [rows] = await pool.query(
    `SELECT user_name FROM users WHERE id = ?`,
    [userId]
  );

  return rows.length ? rows[0].user_name : "";
}

export async function obtenerTodosLosScoresDB() {
  const [rows] = await pool.query(
    `SELECT user_name, best_time, best_score, last_date FROM scores`
  );

  return rows;
}
