import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Obtener todos los usuarios de la base de datos (Exclusivo Administrador)
 * GET /api/admin/users
 */
export const getUsers = asyncHandler(async (req, res) => {
  const users = await pool.query(
    "SELECT id, name, email, role, age, municipio, barrio, is_banned FROM users ORDER BY name ASC"
  );
  res.json(users.rows);
});

/**
 * Activar/Desactivar baneo de usuario (Exclusivo Administrador)
 * POST /api/admin/users/:id/toggle-ban
 */
export const toggleUserBan = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // No permitir que el administrador se banee a sí mismo
  if (id === req.user.id) {
    const err = new Error("No puedes suspender tu propia cuenta de administrador");
    err.statusCode = 400;
    throw err;
  }

  const userCheck = await pool.query("SELECT is_banned FROM users WHERE id = $1", [id]);
  if (userCheck.rows.length === 0) {
    const err = new Error("Usuario no encontrado");
    err.statusCode = 404;
    throw err;
  }

  const currentStatus = userCheck.rows[0].is_banned;
  const newStatus = !currentStatus;

  await pool.query("UPDATE users SET is_banned = $1 WHERE id = $2", [newStatus, id]);

  res.json({
    message: `Usuario ${newStatus ? "suspendido" : "reactivado"} exitosamente`,
    is_banned: newStatus
  });
});

/**
 * Obtener todos los productos, incluyendo los ocultos (Exclusivo Administrador)
 * GET /api/admin/products
 */
export const getProducts = asyncHandler(async (req, res) => {
  const query = `
    SELECT 
      p.id AS product_id,
      p.title,
      p.category,
      p.is_hidden,
      a.name AS artisan_name
    FROM products p
    JOIN artisans a ON p.artisan_id = a.id
    ORDER BY p.title ASC;
  `;
  const products = await pool.query(query);
  res.json(products.rows);
});

/**
 * Ocultar/Mostrar producto (Exclusivo Administrador)
 * POST /api/admin/products/:id/toggle-hide
 */
export const toggleProductHide = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const productCheck = await pool.query("SELECT is_hidden FROM products WHERE id = $1", [id]);
  if (productCheck.rows.length === 0) {
    const err = new Error("Producto no encontrado");
    err.statusCode = 404;
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
