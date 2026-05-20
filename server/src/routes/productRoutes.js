import express from "express";
import { getProductsWithVariants } from "../controllers/productController.js";

const router = express.Router();

// GET /api/products -> Obtiene el catálogo completo con sus variantes
router.get("/", getProductsWithVariants);

export default router;
