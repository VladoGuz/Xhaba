import express from "express";
import { getProductsWithVariants, getProductById } from "../controllers/productController.js";

const router = express.Router();

// GET /api/products -> Obtiene el catálogo completo con sus variantes
router.get("/", getProductsWithVariants);

// GET /api/products/:id -> Obtiene un producto individual por su ID
router.get("/:id", getProductById);

export default router;
