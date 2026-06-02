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
  } catch (err) {
    console.error("Error ejecutando el JOIN:", err.message);
    res.status(500).json({ error: "Error al obtener el catálogo de productos" });
  }
};
