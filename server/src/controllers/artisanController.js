import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Obtiene todos los artesanos ordenados por fecha de creación descendente.
 * GET /api/artisans
 */
export const getArtisans = asyncHandler(async (req, res) => {
  const allArtisans = await pool.query(
    "SELECT * FROM artisans ORDER BY created_at DESC"
  );
  res.json(allArtisans.rows);
});

/**
 * Crear un nuevo artesano.
 * POST /api/artisans
 */
export const createArtisan = asyncHandler(async (req, res) => {
  const { name, community, state, bio } = req.body;
  
  if (!name || !community || !state) {
    const err = new Error("Nombre, comunidad y estado son campos obligatorios");
    err.statusCode = 400;
    throw err;
  }

  const newArtisan = await pool.query(
    "INSERT INTO artisans (name, community, state, bio) VALUES ($1, $2, $3, $4) RETURNING *",
    [name.trim(), community.trim(), state.trim(), bio ? bio.trim() : null]
  );
  
  res.status(201).json(newArtisan.rows[0]);
});
