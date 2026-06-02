import express from "express";
import { getUsers, toggleUserBan, getProducts, toggleProductHide } from "../controllers/adminController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Todas las rutas de administración requieren autenticación y rol 'admin'
router.use(authenticateToken);
router.use(authorizeRoles("admin"));

router.get("/users", getUsers);
router.post("/users/:id/toggle-ban", toggleUserBan);

router.get("/products", getProducts);
router.post("/products/:id/toggle-hide", toggleProductHide);

export default router;
