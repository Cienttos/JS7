// Importamos Express, el framework para crear el servidor
import express from "express";

// Importamos las rutas definidas en otro archivo (routes.js)
import router from "./routes.js";

// Importamos dotenv, que nos permite usar variables de entorno desde un archivo .env
import dotenv from "dotenv";

// Importamos cookie-parser para poder leer y manejar cookies en las peticiones
import cookieParser from "cookie-parser";

// Cargamos las variables de entorno desde el archivo .env
dotenv.config();

// Creamos una instancia de la aplicación de Express
const app = express();

// Hacemos pública la carpeta "public", para servir archivos como imágenes, CSS, etc.
app.use(express.static("public"));

// Le decimos a Express que acepte datos en formato JSON en las peticiones
app.use(express.json());

// Habilitamos el uso de cookies en la app
app.use(cookieParser());

// Usamos las rutas que definimos en routes.js para manejar las peticiones
app.use("/", router);

// Definimos el puerto en el que se va a ejecutar el servidor (puede venir de .env o ser 3000 por defecto)
const PORT = process.env.PORT || 3000;

// Encendemos el servidor y mostramos un mensaje por consola cuando esté listo
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
});
