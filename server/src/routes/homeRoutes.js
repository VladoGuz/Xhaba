import express from "express";
import {
  getProducts,
  getProductsWithVariants,
} from "../controllers/homeController.js";

const router = express.Router();

/**
 * @route   GET /home/products
 * @desc    Obtiene la lista inicial de productos para mostrar en la vista central de bienvenida (Home).
 * @access  Público
 */
router.get("/products", getProducts);

/**
 * @route   GET /home/products/variants
 * @desc    Obtiene los productos estructurados con sus respectivas variantes de inventario.
 * @access  Público
 */
router.get("/products/variants", getProductsWithVariants);

export default router;
