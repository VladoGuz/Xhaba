import pool from "../config/db.js";

/**
 * Obtiene la lista simplificada de prendas de vestir sin variantes ni imágenes.
 * 
 * @route   GET /home/products
 * @desc    Consulta básica e inicial sobre la tabla 'products'. Usada como consulta liviana de diagnóstico.
 * @access  Público
 */
export const getProducts = async (req, res) => {
  try {
    const allProducts = await pool.query(
      "SELECT * FROM products ORDER BY id ASC;"
    );
    res.json(allProducts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

/**
 * Obtiene el catálogo completo de prendas junto con sus respectivas variantes e imágenes
 * estructuradas en formato JSON para la página central (Home).
 * 
 * @route   GET /home/products/variants
 * @desc    Ejecuta un JOIN entre prendas ('products') y artesanos ('artisans'), y corre subconsultas
 *          JSON avanzadas (json_agg) para recuperar imágenes y tallas en un único viaje de red (single network roundtrip).
 * @access  Público
 */
export const getProductsWithVariants = async (req, res) => {
  try {
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
        -- Retorna las variantes asociadas empaquetadas en un array de objetos JSON
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
        -- Retorna las imágenes del catálogo en un array de strings (nombres de archivos)
        (
          SELECT COALESCE(json_agg(pi.image_name), '[]')
          FROM product_images pi WHERE pi.product_id = p.id
        ) AS images
      FROM products p
      JOIN artisans a ON p.artisan_id = a.id
      WHERE p.is_hidden = FALSE -- Filtra las prendas desaprobadas u ocultadas
      ORDER BY p.title ASC;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error ejecutando el JOIN en homeController:", err.message);
    res.status(500).json({ error: "Error al obtener el catálogo de productos" });
  }
};
