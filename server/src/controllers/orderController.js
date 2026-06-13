import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Procesa la compra de los artículos en el carrito de compras de forma transaccional.
 * 
 * @route   POST /api/orders/checkout
 * @desc    Ejecuta una transacción SQL (BEGIN/COMMIT/ROLLBACK) de base de datos.
 *          Implementa un bloqueo pesimista en PostgreSQL (SELECT ... FOR UPDATE) sobre las variantes solicitadas
 *          para evitar condiciones de carrera (race conditions) cuando múltiples compradores adquieren prendas
 *          de edición limitada o piezas únicas de forma simultánea.
 * @access  Privado (Cliente)
 */
export const createCheckoutOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { cartItems, shippingAddress } = req.body;

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    const err = new Error("El carrito de compras no contiene artículos");
    err.statusCode = 400; // Bad Request
    throw err;
  }

  // Se solicita un cliente dedicado del Pool de conexiones. Las transacciones (BEGIN/COMMIT)
  // deben ejecutarse sobre el mismo cliente físico, no directamente llamando a pool.query().
  const client = await pool.connect();

  try {
    // 1. Iniciar la transacción SQL
    await client.query("BEGIN");

    let totalAmount = 0;
    const itemsToProcess = [];

    // 2. Bloquear y verificar el stock de cada variante solicitada
    for (const item of cartItems) {
      // 'FOR UPDATE' le dice a PostgreSQL: Bloquea esta fila. Ninguna otra conexión podrá leer
      // o modificar esta fila usando 'FOR UPDATE' o sentencias de escritura hasta que la transacción actual termine.
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

      // Validar si hay suficiente stock disponible físico en la base de datos
      if (variant.stock < item.quantity) {
        // Arroja error 409 Conflict indicando que el stock ha sido comprometido por otra compra
        const err = new Error(`Lo sentimos, el stock es insuficiente para la prenda: "${variant.title}".`);
        err.statusCode = 409;
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

    // 3. Crear el registro principal de la orden de compra (orders)
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

    // 4. Crear los detalles individuales de la compra (order_items) y descontar el stock
    for (const item of itemsToProcess) {
      // Registrar el desglose del producto en order_items
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

      // Restar la cantidad comprada del inventario real en product_variants
      const updateStockQuery = `
        UPDATE product_variants 
        SET stock = stock - $1 
        WHERE id = $2
      `;
      await client.query(updateStockQuery, [item.quantity, item.variantId]);
    }

    // 5. Limpiar el carrito de compras persistente en la DB una vez completada la venta
    await client.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);

    // 6. Si todo ha sido exitoso, confirmar la transacción (COMMIT) aplicando los cambios permanentemente
    await client.query("COMMIT");

    res.status(201).json({
      message: "¡Pago y compra procesados con éxito!",
      orderId,
      totalAmount
    });

  } catch (error) {
    // Si ocurre cualquier error, aborta toda la transacción y restaura el stock original (ROLLBACK)
    await client.query("ROLLBACK");
    console.error("Transacción fallida - Rollback ejecutado:", error.message);
    
    res.status(error.statusCode || 500).json({
      error: error.message || "Error al procesar la transacción de compra"
    });
  } finally {
    // IMPORTANTE: Liberar la conexión dedicada de vuelta al pool de conexiones.
    // Omitir esto generaría una fuga de conexiones (connection leak) que colapsaría el servidor.
    client.release();
  }
});
