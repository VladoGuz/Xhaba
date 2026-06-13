import express from "express";
import { createCheckoutOrder } from "../controllers/orderController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Control de acceso a nivel de Router:
 * Únicamente los usuarios logueados con el rol 'client' pueden realizar compras.
 */
router.use(authenticateToken);
router.use(authorizeRoles("client"));

/**
 * @route   POST /api/orders/checkout
 * @desc    Procesa la orden de compra transaccional, bloquea y valida el stock disponible.
 * @access  Privado (Cliente)
 */
router.post("/checkout", createCheckoutOrder);

export default router;
