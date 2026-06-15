import pool from './src/config/db.js';

async function fixArtisans() {
  const { rows } = await pool.query("SELECT id, name FROM users WHERE role = 'artisan' AND artisan_id IS NULL");
  
  for (const user of rows) {
    const artRes = await pool.query(
      "INSERT INTO artisans (name, community, state) VALUES ($1, 'Oaxaca', 'Oaxaca') RETURNING id",
      [user.name || 'Artesano']
    );
    await pool.query(
      "UPDATE users SET artisan_id = $1 WHERE id = $2",
      [artRes.rows[0].id, user.id]
    );
    console.log(`Fixed artisan_id for user ${user.name} (${user.id}) -> ${artRes.rows[0].id}`);
  }
  
  process.exit(0);
}

fixArtisans().catch(console.error);
