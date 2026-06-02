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
    WHERE p.id = $1
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
