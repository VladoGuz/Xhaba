import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Obtiene el catálogo completo con sus variantes agregadas en formato JSON.
 * GET /api/products
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
      COALESCE(
        json_agg(
          json_build_object(
            'variant_id', pv.id,
            'color', pv.color,
            'size', pv.size_label,
            'measurements', pv.measurements,
            'stock', pv.stock
          )
        ) FILTER (WHERE pv.id IS NOT NULL), '[]'
      ) AS variants
    FROM products p
    JOIN artisans a ON p.artisan_id = a.id
    LEFT JOIN product_variants pv ON p.id = pv.product_id
    WHERE p.is_hidden = FALSE
    GROUP BY p.id, a.name, a.community
    ORDER BY p.title ASC;
  `;

  const result = await pool.query(query);
  res.json(result.rows);
});

/**
 * Obtiene un producto individual y sus variantes por su ID.
 * GET /api/products/:id
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
      COALESCE(
        json_agg(
          json_build_object(
            'variant_id', pv.id,
            'color', pv.color,
            'size', pv.size_label,
            'measurements', pv.measurements,
            'stock', pv.stock
          )
        ) FILTER (WHERE pv.id IS NOT NULL), '[]'
      ) AS variants
    FROM products p
    JOIN artisans a ON p.artisan_id = a.id
    LEFT JOIN product_variants pv ON p.id = pv.product_id
    WHERE p.id = $1 AND p.is_hidden = FALSE
    GROUP BY p.id, a.id, a.name, a.community, a.bio;
  `;

  const result = await pool.query(query, [id]);
  
  if (result.rows.length === 0) {
    const err = new Error("Producto no encontrado");
    err.statusCode = 404;
    throw err;
  }
  
  res.json(result.rows[0]);
});

/**
 * Crea un nuevo producto y su variante por defecto vinculada al artesano autenticado.
 * POST /api/products
 */
export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, technique, material, category, base_price, stock, size_label } = req.body;
  const artisanId = req.user.artisan_id; // Inyectado desde el token de autenticación

  if (!artisanId) {
    const err = new Error("No tienes un perfil de artesano registrado para publicar prendas");
    err.statusCode = 403;
    throw err;
  }

  if (!title || !technique || !material || !category || !base_price || !stock) {
    const err = new Error("Los campos título, técnica, material, categoría, precio y stock son obligatorios");
    err.statusCode = 400;
    throw err;
  }

  // Insertar producto
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

  // Insertar variante inicial por defecto
  const variantQuery = `
    INSERT INTO product_variants (product_id, color, size_label, stock)
    VALUES ($1, 'Único/Tradicional', $2, $3)
  `;
  await pool.query(variantQuery, [
    product.id,
    size_label ? size_label.trim() : "Unitalla",
    parseInt(stock, 10)
  ]);

  res.status(201).json({
    message: "Prenda publicada con éxito en el catálogo de Xhaba",
    product
  });
});
