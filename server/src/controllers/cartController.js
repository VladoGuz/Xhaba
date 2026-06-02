import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Obtiene el carrito de compras guardado en la base de datos para el cliente logueado.
 * GET /api/cart
 */
export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT 
      ci.variant_id AS id,
      p.id AS product_id,
      p.title,
      p.base_price AS price,
      a.name AS artisan_name,
      a.community AS artisan_community,
      pv.color,
      pv.size_label AS size,
      ci.quantity
    FROM cart_items ci
    JOIN product_variants pv ON ci.variant_id = pv.id
    JOIN products p ON pv.product_id = p.id
    JOIN artisans a ON p.artisan_id = a.id
    WHERE ci.user_id = $1
    ORDER BY ci.created_at ASC
  `;

  const result = await pool.query(query, [userId]);

  // Formatear precios y agregar fallback de imagen
  const formattedItems = result.rows.map(item => ({
    ...item,
    price: parseFloat(item.price),
    image: `valles1.jpg` // Fallback o será modificado en el front
  }));

  res.json(formattedItems);
});

/**
 * Sincroniza el carrito del cliente (localStorage) con la base de datos.
 * POST /api/cart
 */
export const syncCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { cartItems } = req.body; // Array de { id, quantity } donde id es el variant_id

  if (!Array.isArray(cartItems)) {
    const err = new Error("El cuerpo de la petición debe contener un arreglo 'cartItems'");
    err.statusCode = 400;
    throw err;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Limpiar el carrito previo del usuario
    await client.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);

    // 2. Insertar los nuevos elementos
    for (const item of cartItems) {
      if (!item.id || !item.quantity) continue;

      // Verificar que la variante realmente exista
      const variantCheck = await client.query(
        "SELECT id FROM product_variants WHERE id = $1",
        [item.id]
      );

      if (variantCheck.rows.length > 0) {
        await client.query(
          `INSERT INTO cart_items (user_id, variant_id, quantity)
           VALUES ($1, $2, $3)
           ON CONFLICT (user_id, variant_id) 
           DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = CURRENT_TIMESTAMP`,
          [userId, item.id, parseInt(item.quantity, 10)]
        );
      }
    }

    await client.query("COMMIT");
    res.json({ message: "Carrito sincronizado exitosamente con la base de datos" });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al sincronizar el carrito:", error);
    throw error;
  } finally {
    client.release();
  }
});
