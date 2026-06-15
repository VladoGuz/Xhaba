import pool from './src/config/db.js';

pool.query("SELECT id, email, role, artisan_id FROM users WHERE role = 'artisan'")
  .then(res => {
    console.log(res.rows);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
