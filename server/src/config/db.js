import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Pequeño truco para verificar en consola si la conexión fue exitosa al iniciar el servidor
pool.query('SELECT NOW()')
  .then(() => console.log('🚀 Conexión exitosa a la base de datos PostgreSQL'))
  .catch((err) => console.error('❌ Error crítico al conectar a la base de datos:', err.message));

export default pool;
