import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Obtiene el listado completo de artesanos de Oaxaca.
 * 
 * @route   GET /api/artisans
 * @desc    Consulta la tabla 'artisans' ordenando de manera descendente por fecha de registro.
 * @access  Público
 */
export const getArtisans = asyncHandler(async (req, res) => {
  const allArtisans = await pool.query(
    "SELECT * FROM artisans ORDER BY created_at DESC"
  );
  res.json(allArtisans.rows);
});

/**
 * Registra un nuevo perfil de artesano.
 * 
 * @route   POST /api/artisans
 * @desc    Crea la entidad detallada del artesano con su biografía y geolocalización oaxaqueña.
 * @access  Privado (Autenticado)
 */
export const createArtisan = asyncHandler(async (req, res) => {
  const { name, community, state, bio } = req.body;
  
  if (!name || !community || !state) {
    const err = new Error("Nombre, comunidad y estado son campos obligatorios");
    err.statusCode = 400; // Bad Request
    throw err;
  }

  const newArtisan = await pool.query(
    "INSERT INTO artisans (name, community, state, bio) VALUES ($1, $2, $3, $4) RETURNING *",
    [name.trim(), community.trim(), state.trim(), bio ? bio.trim() : null]
  );
  
  res.status(201).json(newArtisan.rows[0]);
});

/**
 * Obtiene la información pública de un artesano específico por su UUID.
 * 
 * @route   GET /api/artisans/:id
 * @desc    Consulta y retorna los datos del artesano indicado en los parámetros.
 * @access  Público
 */
export const getArtisanById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "SELECT id, name, community, state, bio FROM artisans WHERE id = $1",
    [id]
  );

  if (result.rows.length === 0) {
    const err = new Error("Artesano no encontrado");
    err.statusCode = 404; // Not Found
    throw err;
  }

  res.json(result.rows[0]);
});

/**
 * Obtiene la lista completa de prendas de vestir y sus variantes de stock para un artesano.
 * 
 * @route   GET /api/artisans/:id/products
 * @desc    Utiliza un LEFT JOIN sobre 'product_variants' para que, si el artesano tiene un producto
 *          sin variantes declaradas, este aparezca igualmente en la lista con valores nulos de stock.
 * @access  Privado (Autenticado)
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
 * Actualiza el stock de inventario disponible para una variante específica.
 * 
 * @route   PUT /api/artisans/variants/:variantId/stock
 * @desc    Establece de forma manual el stock físico de una talla/color del producto,
 *          permitiendo reabastecer prendas agotadas en el catálogo.
 * @access  Privado (Autenticado)
 */
export const updateVariantStock = asyncHandler(async (req, res) => {
  const { variantId } = req.params;
  const { stock } = req.body;

  // Validación de entrada numérica
  if (stock === undefined || isNaN(parseInt(stock, 10))) {
    const err = new Error("El stock debe ser un número válido");
    err.statusCode = 400; // Bad Request
    throw err;
  }

  const check = await pool.query("SELECT id FROM product_variants WHERE id = $1", [variantId]);
  if (check.rows.length === 0) {
    const err = new Error("Variante no encontrada");
    err.statusCode = 404; // Not Found
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
 * Obtiene las reseñas escritas por los clientes para un artesano, junto al promedio general.
 * 
 * @route   GET /api/artisans/:id/reviews
 * @desc    Consulta las reseñas asociadas al artesano y realiza una consulta agregada con AVG() de SQL,
 *          redondeando el resultado a un decimal (numeric(10,1)) para la visualización de estrellas.
 * @access  Público
 */
export const getArtisanReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Obtiene el detalle de opiniones
  const reviews = await pool.query(
    "SELECT id, customer_name, rating, comment, created_at FROM reviews WHERE artisan_id = $1 ORDER BY created_at DESC",
    [id]
  );

  // Calcula el promedio de estrellas del artesano
  const stats = await pool.query(
    "SELECT AVG(rating)::numeric(10,1) as average FROM reviews WHERE artisan_id = $1",
    [id]
  );

  res.json({
    reviews: reviews.rows,
    // Retorna fallback de 5.0 en caso de no registrar opiniones todavía
    average: parseFloat(stats.rows[0].average) || 5.0
  });
});

/**
 * Crea una nueva valoración/reseña para el artesano.
 * 
 * @route   POST /api/artisans/:id/reviews
 * @desc    Registra una reseña de satisfacción asociándola al perfil público del artesano.
 * @access  Privado (Autenticado)
 */
export const createArtisanReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { customerName, rating, comment } = req.body;

  if (!customerName || !rating) {
    const err = new Error("Nombre del cliente y calificación son obligatorios");
    err.statusCode = 400; // Bad Request
    throw err;
  }

  const checkArtisan = await pool.query("SELECT id FROM artisans WHERE id = $1", [id]);
  if (checkArtisan.rows.length === 0) {
    const err = new Error("Artesano no encontrado");
    err.statusCode = 404; // Not Found
    throw err;
  }

  const newReview = await pool.query(
    "INSERT INTO reviews (artisan_id, customer_name, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
    [id, customerName.trim(), parseInt(rating, 10), comment ? comment.trim() : null]
  );

  res.status(201).json(newReview.rows[0]);
});
