import dotenv from "dotenv";

// Inicializa dotenv para leer el archivo .env ubicado en la raíz del servidor
dotenv.config();

/**
 * Listado de variables de entorno requeridas para el correcto funcionamiento
 * de la aplicación en cualquier ambiente (desarrollo, testing o producción).
 */
const requiredEnv = [
  "PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "JWT_SECRET",
  "CLIENT_URL"
];

// Filtra e identifica cuáles variables de entorno requeridas no están definidas
const missingEnv = requiredEnv.filter((envVar) => !process.env[envVar]);

// Si falta alguna variable, detiene la aplicación inmediatamente con un código de error explícito
if (missingEnv.length > 0) {
  console.error(`🚨 Error crítico: Faltan las siguientes variables de entorno obligatorias: ${missingEnv.join(", ")}`);
  process.exit(1);
}

/**
 * Configuración global tipada y centralizada del backend de Xhaba.
 * Evita leer directamente process.env en múltiples partes del código y
 * proporciona valores de fallback sensatos en desarrollo.
 */
export const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  db: {
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME,
  }
};
