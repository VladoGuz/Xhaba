import express from "express";
import { getCart, syncCart } from "../controllers/cartController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Control de acceso del Carrito:
 * Solo clientes autenticados pueden sincronizar o guardar su carrito de compras en la DB.
 */
router.use(authenticateToken);
router.use(authorizeRoles("client"));

/**
 * @route   GET /api/cart
 * @desc    Obtiene todos los artículos del carrito guardados en la base de datos para el cliente actual.
 * @access  Privado (Cliente)
 */
router.get("/", getCart);

/**
 * @route   POST /api/cart
 * @desc    Sincroniza el carrito (carga masiva desde localStorage del cliente tras loguearse).
 * @access  Privado (Cliente)
 */
router.post("/", syncCart);

export default router;
