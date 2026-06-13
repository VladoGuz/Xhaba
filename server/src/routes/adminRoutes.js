import express from "express";
import { getUsers, toggleUserBan, getProducts, toggleProductHide, getAbandonedCartsStats } from "../controllers/adminController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Aplicación de seguridad a nivel de enrutador (Router-level middleware).
 * Todas las rutas declaradas a continuación requieren de forma obligatoria:
 * 1. Tener un token JWT válido de sesión en las cookies (authenticateToken).
 * 2. Que el rol decodificado en dicho token sea exactamente 'admin' (authorizeRoles).
 */
router.use(authenticateToken);
router.use(authorizeRoles("admin"));

/**
 * @route   GET /api/admin/users
 * @desc    Obtiene la lista completa de usuarios (clientes, artesanos, admins) para moderación.
 * @access  Privado (Admin)
 */
router.get("/users", getUsers);

/**
 * @route   POST /api/admin/users/:id/toggle-ban
 * @desc    Banea (suspende) o desbanea una cuenta de usuario específica.
 * @access  Privado (Admin)
 */
router.post("/users/:id/toggle-ban", toggleUserBan);

/**
 * @route   GET /api/admin/products
 * @desc    Obtiene la lista completa de productos registrados por artesanos para revisión.
 * @access  Privado (Admin)
 */
router.get("/products", getProducts);

/**
 * @route   POST /api/admin/products/:id/toggle-hide
 * @desc    Oculta o muestra una prenda del catálogo general de forma lógica.
 * @access  Privado (Admin)
 */
router.post("/products/:id/toggle-hide", toggleProductHide);

/**
 * @route   GET /api/admin/abandoned-carts
 * @desc    Obtiene las estadísticas de carritos abandonados (artículos en base de datos sin comprar).
 * @access  Privado (Admin)
 */
router.get("/abandoned-carts", getAbandonedCartsStats);

export default router;
