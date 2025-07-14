// Importamos el paquete mysql2 (versión con promesas) para conectarnos a la base de datos
import mysql from 'mysql2/promise';

// Importamos dotenv para poder usar las variables del archivo .env
import dotenv from 'dotenv';

// Cargamos las variables de entorno (como DB_HOST, DB_USER, etc.)
dotenv.config(); 

// Creamos un "pool" de conexiones a la base de datos MySQL
// Esto permite manejar múltiples conexiones de manera eficiente
const pool = mysql.createPool({
  host: process.env.DB_HOST,         // Dirección del servidor de base de datos
  user: process.env.DB_USER,         // Usuario de la base de datos
  password: process.env.DB_PASSWORD, // Contraseña del usuario
  database: process.env.DB_NAME,     // Nombre de la base de datos a la que nos conectamos
  waitForConnections: true,          // Esperar cuando no haya conexiones disponibles
  connectionLimit: 10,               // Máximo de conexiones al mismo tiempo
  queueLimit: 0                      // Sin límite de solicitudes en espera
});

// Exportamos el pool para que se pueda usar en otros archivos
export default pool;
