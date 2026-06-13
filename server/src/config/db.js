import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";

// Cargar las variables de entorno definidas en el archivo .env
dotenv.config();

/**
 * Pool de conexiones de PostgreSQL.
 * Express y pg administran un grupo (pool) de conexiones reutilizables para
 * evitar la sobrecarga de crear y destruir una conexión física en cada consulta HTTP.
 */
const pool = new Pool({
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Verificación inicial de la conexión a la base de datos al arrancar el servidor
pool.query('SELECT NOW()')
  .then(() => console.log('🚀 Conexión exitosa a la base de datos PostgreSQL'))
  .catch((err) => console.error('❌ Error crítico al conectar a la base de datos:', err.message));

export default pool;
