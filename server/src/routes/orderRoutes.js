import express from "express";
import { createCheckoutOrder } from "../controllers/orderController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Las rutas de órdenes requieren inicio de sesión y rol de cliente
router.use(authenticateToken);
router.use(authorizeRoles("client"));

router.post("/checkout", createCheckoutOrder);

export default router;
