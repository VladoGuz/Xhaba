const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "xhaba",
});

<<<<<<< HEAD
// Pequeño truco para verificar en consola si la conexión fue exitosa al iniciar el servidor
pool.query('SELECT NOW()')
  .then(() => console.log('🚀 Conexión exitosa a la base de datos PostgreSQL'))
  .catch((err) => console.error('❌ Error crítico al conectar a la base de datos:', err.message));

export default pool;
=======
module.exports = pool;
>>>>>>> e37668ea780e9db28f484aef9ab0c205de5b272e
