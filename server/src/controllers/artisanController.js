import pool from "../config/db.js";

export const getArtisans = async (req, res) => {
  try {
    const allArtisans = await pool.query(
      "SELECT * FROM artisans ORDER BY created_at DESC",
    );
    res.json(allArtisans.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al obtener artesanos" });
  }
};

// Crear un nuevo artesano
export const createArtisan = async (req, res) => {
  try {
    const { name, community, state, bio } = req.body;
    const newArtisan = await pool.query(
      "INSERT INTO artisans (name, community, state, bio) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, community, state, bio],
    );
    res.json(newArtisan.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al crear artesano" });
  }
};
