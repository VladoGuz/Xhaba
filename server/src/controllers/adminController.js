import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Obtiene el listado completo de usuarios de la base de datos para la vista de moderación.
 * 
 * @route   GET /api/admin/users
 * @desc    Consulta y retorna información de todos los usuarios registrados, ordenada alfabéticamente.
 * @access  Privado (Admin)
 */
export const getUsers = asyncHandler(async (req, res) => {
  const users = await pool.query(
    "SELECT id, name, email, role, age, municipio, barrio, is_banned FROM users ORDER BY name ASC"
  );
  res.json(users.rows);
});

/**
 * Alterna el estado de suspensión (baneo) de un usuario en el sistema.
 * 
 * @route   POST /api/admin/users/:id/toggle-ban
 * @desc    Busca al usuario por su UUID, invierte su estado 'is_banned' y actualiza la base de datos.
 *          Contiene una regla de seguridad para impedir que el administrador se autobanee.
 * @access  Privado (Admin)
 */
export const toggleUserBan = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Regla preventiva: Evita que el administrador suspenda su propio acceso al panel
  if (id === req.user.id) {
    const err = new Error("No puedes suspender tu propia cuenta de administrador");
    err.statusCode = 400; // Bad Request
    throw err;
  }

  const userCheck = await pool.query("SELECT is_banned FROM users WHERE id = $1", [id]);
  if (userCheck.rows.length === 0) {
    const err = new Error("Usuario no encontrado");
    err.statusCode = 404; // Not Found
    throw err;
  }

  const currentStatus = userCheck.rows[0].is_banned;
  const newStatus = !currentStatus;

  // Actualización del estado lógico en la DB
  await pool.query("UPDATE users SET is_banned = $1 WHERE id = $2", [newStatus, id]);

  res.json({
    message: `Usuario ${newStatus ? "suspendido" : "reactivado"} exitosamente`,
    is_banned: newStatus
  });
});

/**
 * Obtiene el listado completo de productos (prendas) incluyendo los que están ocultos.
 * 
 * @route   GET /api/admin/products
 * @desc    Realiza un JOIN entre la tabla 'products' y 'artisans' para obtener los datos
 *          de las prendas junto con el nombre del artesano que las confeccionó.
 * @access  Privado (Admin)
 */
export const getProducts = asyncHandler(async (req, res) => {
  const query = `
    SELECT 
      p.id AS product_id,
      p.title,
      p.category,
      p.is_hidden,
      a.name AS artisan_name,
      COALESCE((SELECT SUM(stock) FROM product_variants WHERE product_id = p.id), 0) AS total_stock
    FROM products p
    JOIN artisans a ON p.artisan_id = a.id
    ORDER BY p.title ASC;
  `;
  const products = await pool.query(query);
  res.json(products.rows);
});

/**
 * Alterna la visibilidad (ocultamiento lógico) de un producto en la plataforma.
 * 
 * @route   POST /api/admin/products/:id/toggle-hide
 * @desc    Busca el producto por su UUID, invierte su estado 'is_hidden' y lo actualiza.
 *          Los productos ocultos no se muestran en el Home ni en el Catálogo general del cliente,
 *          pero permanecen guardados en la DB para auditoría e historial de compras.
 * @access  Privado (Admin)
 */
export const toggleProductHide = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const productCheck = await pool.query("SELECT is_hidden FROM products WHERE id = $1", [id]);
  if (productCheck.rows.length === 0) {
    const err = new Error("Producto no encontrado");
    err.statusCode = 404; // Not Found
    throw err;
  }

  const currentStatus = productCheck.rows[0].is_hidden;
  const newStatus = !currentStatus;

  await pool.query("UPDATE products SET is_hidden = $1 WHERE id = $2", [newStatus, id]);

  res.json({
    message: `Producto ${newStatus ? "ocultado" : "reactivado"} exitosamente`,
    is_hidden: newStatus
  });
});

/**
 * Genera y calcula las estadísticas reales del módulo de carritos abandonados.
 * 
 * @route   GET /api/admin/abandoned-carts
 * @desc    Ejecuta consultas agregadas en PostgreSQL para calcular:
 *          1. Cantidad de clientes únicos con actividad en su carrito en las últimas 24h.
 *          2. Valor económico total perdido sumando (base_price * quantity) de todos los cart_items activos.
 *          3. Tasa de conversión/recuperación mediante la fórmula: (órdenes completadas / (órdenes completadas + carritos activos)).
 * @access  Privado (Admin)
 */
export const getAbandonedCartsStats = asyncHandler(async (req, res) => {
  // 1. Carritos activos modificados en las últimas 24 horas usando filtros de INTERVAL de PostgreSQL
  const countRes = await pool.query(
    "SELECT COUNT(DISTINCT user_id) AS count FROM cart_items WHERE updated_at >= NOW() - INTERVAL '24 hours'"
  );
  const abandoned24h = parseInt(countRes.rows[0].count, 10);

  // 2. Valor total perdido estimado acumulado en la tabla cart_items
  const valueRes = await pool.query(`
    SELECT COALESCE(SUM(p.base_price * ci.quantity), 0) AS total
    FROM cart_items ci
    JOIN product_variants pv ON ci.variant_id = pv.id
    JOIN products p ON pv.product_id = p.id
  `);
  const totalValue = parseFloat(valueRes.rows[0].total);

  // 3. Tasa de recuperación (Órdenes exitosas vs Carritos totales persistentes)
  const ordersRes = await pool.query("SELECT COUNT(*) AS count FROM orders WHERE status = 'completed'");
  const completedOrders = parseInt(ordersRes.rows[0].count, 10);

  const activeCartsRes = await pool.query("SELECT COUNT(DISTINCT user_id) AS count FROM cart_items");
  const activeCarts = parseInt(activeCartsRes.rows[0].count, 10);

  const totalInteractions = completedOrders + activeCarts;
  const recoveryRate = totalInteractions > 0 
    ? `${Math.round((completedOrders / totalInteractions) * 100)}%`
    : "0%";

  res.json({
    abandoned24h,
    totalValue,
    recoveryRate
  });
});
