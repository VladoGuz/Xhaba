import express from "express";
import { getProductsWithVariants, getProductById, createProduct } from "../controllers/productController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rutas públicas
router.get("/", getProductsWithVariants);
router.get("/:id", getProductById);

// Rutas protegidas (para publicar prendas)
router.post("/", authenticateToken, createProduct);

export default router;
