import express from "express";
import { getCart, syncCart } from "../controllers/cartController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Todas las rutas de carrito requieren inicio de sesión y rol de cliente
router.use(authenticateToken);
router.use(authorizeRoles("client"));

router.get("/", getCart);
router.post("/", syncCart);

export default router;
