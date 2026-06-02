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

/**
 * Obtener un artesano individual por su ID.
 * GET /api/artisans/:id
 */
export const getArtisanById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "SELECT id, name, community, state, bio FROM artisans WHERE id = $1",
    [id]
  );

  if (result.rows.length === 0) {
    const err = new Error("Artesano no encontrado");
    err.statusCode = 404;
    throw err;
  }

  res.json(result.rows[0]);
});

/**
 * Obtener productos y variantes de un artesano específico.
 * GET /api/artisans/:id/products
 */
export const getArtisanProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      p.id AS product_id,
      p.title,
      p.category,
      p.base_price,
      pv.id AS variant_id,
      pv.color,
      pv.size_label AS size,
      pv.stock
    FROM products p
    LEFT JOIN product_variants pv ON p.id = pv.product_id
    WHERE p.artisan_id = $1
    ORDER BY p.title ASC;
  `;
  
  const result = await pool.query(query, [id]);
  res.json(result.rows);
});

/**
 * Actualizar el stock de una variante específica.
 * PUT /api/artisans/variants/:variantId/stock
 */
export const updateVariantStock = asyncHandler(async (req, res) => {
  const { variantId } = req.params;
  const { stock } = req.body;

  if (stock === undefined || isNaN(parseInt(stock, 10))) {
    const err = new Error("El stock debe ser un número válido");
    err.statusCode = 400;
    throw err;
  }

  const check = await pool.query("SELECT id FROM product_variants WHERE id = $1", [variantId]);
  if (check.rows.length === 0) {
    const err = new Error("Variante no encontrada");
    err.statusCode = 404;
    throw err;
  }

  await pool.query(
    "UPDATE product_variants SET stock = $1 WHERE id = $2",
    [parseInt(stock, 10), variantId]
  );

  res.json({
    message: "Stock actualizado con éxito en la base de datos",
    stock: parseInt(stock, 10)
  });
});

/**
 * Obtener las valoraciones (reviews) de un artesano y su promedio de puntuación.
 * GET /api/artisans/:id/reviews
 */
export const getArtisanReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const reviews = await pool.query(
    "SELECT id, customer_name, rating, comment, created_at FROM reviews WHERE artisan_id = $1 ORDER BY created_at DESC",
    [id]
  );

  const stats = await pool.query(
    "SELECT AVG(rating)::numeric(10,1) as average FROM reviews WHERE artisan_id = $1",
    [id]
  );

  res.json({
    reviews: reviews.rows,
    average: parseFloat(stats.rows[0].average) || 5.0
  });
});

/**
 * Crear una nueva valoración (review) para un artesano.
 * POST /api/artisans/:id/reviews
 */
export const createArtisanReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { customerName, rating, comment } = req.body;

  if (!customerName || !rating) {
    const err = new Error("Nombre del cliente y calificación son obligatorios");
    err.statusCode = 400;
    throw err;
  }

  const checkArtisan = await pool.query("SELECT id FROM artisans WHERE id = $1", [id]);
  if (checkArtisan.rows.length === 0) {
    const err = new Error("Artesano no encontrado");
    err.statusCode = 404;
    throw err;
  }

  const newReview = await pool.query(
    "INSERT INTO reviews (artisan_id, customer_name, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
    [id, customerName.trim(), parseInt(rating, 10), comment ? comment.trim() : null]
  );

  res.status(201).json(newReview.rows[0]);
});
