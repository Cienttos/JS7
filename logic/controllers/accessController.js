import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../../db.js"; // Conexión a la base de datos
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET; // Se obtiene la clave secreta desde el .env

// =====================
// REGISTRO DE USUARIO
// =====================
export const register = async (req, res) => {
  const { name, password, repassword } = req.body;

  // Validaciones iniciales
  if (!name || !password || !repassword) {
    return res.json({ success: false, message: "Todos los campos son obligatorios" });
  }

  if (password !== repassword) {
    return res.json({ success: false, message: "Las contraseñas tienen que ser iguales" });
  }

  try {
    // Verificamos si el usuario ya existe
    const [rows] = await pool.query("SELECT * FROM users WHERE user_name = ?", [name]);
    if (rows.length > 0) {
      return res.json({ success: false, message: "Nombre en uso" });
    }

    // Hasheamos la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertamos el nuevo usuario en la base de datos
    const [result] = await pool.query(
      "INSERT INTO users (user_name, password) VALUES (?, ?)", 
      [name, hashedPassword]
    );

    const userId = result.insertId;

    // Creamos el token
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });

    // Enviamos cookie manualmente con header (ya que res.cookie no funciona en Vercel)
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`);

    res.json({
      success: true,
      message: "Usuario registrado con éxito",
      token, // También enviamos el token en el body
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

// =====================
// LOGIN
// =====================
export const login = async (req, res) => {
  const { name, password } = req.body;

  // Validación de campos
  if (!name || !password) {
    return res.json({ success: false, message: "Nombre y contraseña son obligatorios" });
  }

  try {
    // Verificamos si el usuario existe
    const [rows] = await pool.query("SELECT * FROM users WHERE user_name = ?", [name]);
    if (rows.length === 0) {
      return res.json({ success: false, message: "Nombre o contraseña incorrectos" });
    }

    const user = rows[0];

    // Comparamos la contraseña ingresada con la almacenada
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Nombre o contraseña incorrectos" });
    }

    // Creamos y enviamos el token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    // Enviar cookie manualmente con header (ya que res.cookie no funciona en Vercel)
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`);

    res.json({
      success: true,
      message: "Ingreso exitoso",
      token, // También enviamos el token en el body
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
};
