import pool from "../config/db.js";

export const getProductsWithVariants = async (req, res) => {
  try {
    // La consulta SQL con agregación JSON
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
        -- Agrupamos las variantes en un array de objetos JSON
        COALESCE(
          json_agg(
            json_build_object(
              'variant_id', pv.id,
              'color', pv.color,
              'size', pv.size_label,
              'measurements', pv.measurements, -- Tu campo JSONB se anida perfectamente
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
    res
      .status(500)
      .json({ error: "Error al obtener el catálogo de productos" });
  }
};

export const getProductById = async (req, res) => {
  try {
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
        -- Agrupamos las variantes en un array de objetos JSON
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
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener producto por ID:", err.message);
    res.status(500).json({ error: "Error al obtener detalles del producto" });
  }
};
