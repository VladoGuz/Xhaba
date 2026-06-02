import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Procesa la compra de los artículos en el carrito transaccionalmente.
 * Utiliza SELECT ... FOR UPDATE para evitar colisiones de stock y asegurar concurrencia real (HU-02).
 * POST /api/orders/checkout
 */
export const createCheckoutOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { cartItems, shippingAddress } = req.body;

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    const err = new Error("El carrito de compras no contiene artículos");
    err.statusCode = 400;
    throw err;
  }

  const client = await pool.connect();

  try {
    // 1. Iniciar transacción SQL
    await client.query("BEGIN");

    let totalAmount = 0;
    const itemsToProcess = [];

    // 2. Bloquear y verificar el stock de cada variante solicitada concurrentemente
    for (const item of cartItems) {
      const variantQuery = `
        SELECT pv.id, pv.stock, p.base_price, p.title 
        FROM product_variants pv 
        JOIN products p ON pv.product_id = p.id 
        WHERE pv.id = $1 
        FOR UPDATE
      `;
      const variantRes = await client.query(variantQuery, [item.id]);

      if (variantRes.rows.length === 0) {
        throw new Error(`La variante del producto con ID ${item.id} no existe.`);
      }

      const variant = variantRes.rows[0];

      // Validar stock disponible
      if (variant.stock < item.quantity) {
        const err = new Error(`Lo sentimos, el stock es insuficiente para la prenda: "${variant.title}".`);
        err.statusCode = 409; // Conflicto de recursos (concurrencia)
        throw err;
      }

      const price = parseFloat(variant.base_price);
      totalAmount += price * item.quantity;

      itemsToProcess.push({
        variantId: variant.id,
        quantity: item.quantity,
        priceAtPurchase: price
      });
    }

    // 3. Crear el registro de la orden
    const orderQuery = `
      INSERT INTO orders (user_id, status, total_amount, shipping_address)
      VALUES ($1, 'completed', $2, $3)
      RETURNING id
    `;
    const orderRes = await client.query(orderQuery, [
      userId,
      totalAmount,
      shippingAddress ? shippingAddress.trim() : "Dirección de Registro"
    ]);
    const orderId = orderRes.rows[0].id;

    // 4. Crear los detalles de la orden (order_items) y restar el stock
    for (const item of itemsToProcess) {
      // Registrar ítem de orden
      const itemQuery = `
        INSERT INTO order_items (order_id, variant_id, price_at_purchase, quantity)
        VALUES ($1, $2, $3, $4)
      `;
      await client.query(itemQuery, [
        orderId,
        item.variantId,
        item.priceAtPurchase,
        item.quantity
      ]);

      // Decrementar stock de la variante
      const updateStockQuery = `
        UPDATE product_variants 
        SET stock = stock - $1 
        WHERE id = $2
      `;
      await client.query(updateStockQuery, [item.quantity, item.variantId]);
    }

    // 5. Limpiar los elementos del carrito en la base de datos ya que la compra fue exitosa
    await client.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);

    // 6. Confirmar la transacción
    await client.query("COMMIT");

    res.status(201).json({
      message: "¡Pago y compra procesados con éxito!",
      orderId,
      totalAmount
    });

  } catch (error) {
    // Revertir todos los cambios si algo falla
    await client.query("ROLLBACK");
    console.error("Transacción fallida - Rollback ejecutado:", error.message);
    
    res.status(error.statusCode || 500).json({
      error: error.message || "Error al procesar la transacción de compra"
    });
  } finally {
    // Liberar la conexión al pool
    client.release();
  }
});
