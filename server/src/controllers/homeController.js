import pool from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const allProducts = await pool.query(
      "SELECT * FROM products ORDER BY id ASC;",
    );
    res.json(allProducts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

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
      WHERE p.is_hidden = FALSE
      ORDER BY p.title ASC;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error ejecutando el JOIN:", err.message);
    res.status(500).json({ error: "Error al obtener el catálogo de productos" });
  }
};
