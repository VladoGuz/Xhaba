import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Obtiene la lista completa de prendas de vestir aprobadas con sus variantes e imágenes.
 * 
 * @route   GET /api/products
 * @desc    Realiza consultas SQL avanzadas utilizando agregaciones JSON de PostgreSQL (json_agg y json_build_object).
 *          Esto permite retornar en una sola consulta toda la estructura jerárquica del producto,
 *          evitando el problema de consultas múltiples recurrentes (N+1 queries).
 * @access  Público
 */
export const getProductsWithVariants = asyncHandler(async (req, res) => {
  const query = `
    SELECT 
      p.id AS product_id,
      p.title,
      p.description,
      p.technique,
      p.material,
      p.category,
      p.base_price,
      a.name AS artisan_name,
      a.community AS artisan_community,
      -- Agregación JSON para empaquetar todas las variantes asociadas del producto
      (
        SELECT COALESCE(json_agg(json_build_object(
          'variant_id', pv.id,
          'color', pv.color,
          'size', pv.size_label,
          'measurements', pv.measurements,
          'stock', pv.stock
        )), '[]')
        FROM product_variants pv WHERE pv.product_id = p.id
      ) AS variants,
      -- Agregación JSON para agrupar las rutas de imágenes en un arreglo plano de cadenas
      (
        SELECT COALESCE(json_agg(pi.image_name), '[]')
        FROM product_images pi WHERE pi.product_id = p.id
      ) AS images
    FROM products p
    JOIN artisans a ON p.artisan_id = a.id
    WHERE p.is_hidden = FALSE -- Filtra únicamente las prendas visibles no ocultadas por moderación
    ORDER BY p.title ASC;
  `;

  const result = await pool.query(query);
  res.json(result.rows);
});

/**
 * Obtiene el detalle individual de un producto por su UUID.
 * 
 * @route   GET /api/products/:id
 * @desc    Consulta un producto específico inyectando de forma anidada sus variantes e imágenes en formato JSON.
 * @access  Público
 */
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      p.id AS product_id,
      p.title,
      p.description,
      p.technique,
      p.material,
      p.category,
      p.base_price,
      a.id AS artisan_id,
      a.name AS artisan_name,
      a.community AS artisan_community,
      a.bio AS artisan_bio,
      (
        SELECT COALESCE(json_agg(json_build_object(
          'variant_id', pv.id,
          'color', pv.color,
          'size', pv.size_label,
          'measurements', pv.measurements,
          'stock', pv.stock
        )), '[]')
        FROM product_variants pv WHERE pv.product_id = p.id
      ) AS variants,
      (
        SELECT COALESCE(json_agg(pi.image_name), '[]')
        FROM product_images pi WHERE pi.product_id = p.id
      ) AS images
    FROM products p
    JOIN artisans a ON p.artisan_id = a.id
    WHERE p.id = $1 AND p.is_hidden = FALSE;
  `;

  const result = await pool.query(query, [id]);
  
  if (result.rows.length === 0) {
    const err = new Error("Producto no encontrado");
    err.statusCode = 404; // Not Found
    throw err;
  }
  
  res.json(result.rows[0]);
});

/**
 * Registra y publica una nueva prenda en el catálogo general.
 * 
 * @route   POST /api/products
 * @desc    Crea una prenda de vestir asociada a la cuenta del artesano autenticado,
 *          crea automáticamente su variante por defecto (talla/stock) y registra su foto principal.
 * @access  Privado (Artesano registrado)
 */
export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, technique, material, category, base_price, stock, size_label, image_name } = req.body;
  const artisanId = req.user.artisan_id; // Recuperado del token decodificado en req.user

  if (!artisanId) {
    const err = new Error("No tienes un perfil de artesano registrado para publicar prendas");
    err.statusCode = 403; // Forbidden
    throw err;
  }

  if (!title || !technique || !material || !category || !base_price || !stock) {
    const err = new Error("Los campos título, técnica, material, categoría, precio y stock son obligatorios");
    err.statusCode = 400; // Bad Request
    throw err;
  }

  // 1. Insertar prenda base en la tabla 'products'
  const productQuery = `
    INSERT INTO products (artisan_id, title, description, technique, material, category, base_price)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, title, category, base_price
  `;
  const productRes = await pool.query(productQuery, [
    artisanId,
    title.trim(),
    description ? description.trim() : null,
    technique.trim(),
    material.trim(),
    category.trim(),
    parseFloat(base_price)
  ]);

  const product = productRes.rows[0];

  // 2. Insertar una variante de stock inicial vinculada al producto recién creado
  const variantQuery = `
    INSERT INTO product_variants (product_id, color, size_label, stock)
    VALUES ($1, 'Único/Tradicional', $2, $3)
  `;
  await pool.query(variantQuery, [
    product.id,
    size_label ? size_label.trim() : "Unitalla",
    parseInt(stock, 10)
  ]);

  // 3. Vincular la foto seleccionada por el artesano en la tabla 'product_images'.
  // Si no selecciona ninguna, se asigna 'valles1.jpg' como fallback predeterminado.
  const imgName = image_name ? image_name.trim() : 'valles1.jpg';
  await pool.query(
    `INSERT INTO product_images (product_id, image_name, is_primary)
     VALUES ($1, $2, TRUE)`,
    [product.id, imgName]
  );

  res.status(201).json({
    message: "Prenda publicada con éxito en el catálogo de Xhaba",
    product
  });
});
