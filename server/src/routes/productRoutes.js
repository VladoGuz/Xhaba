import express from "express";
import { getProductsWithVariants, getProductById, createProduct, updateProductImage } from "../controllers/productController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Obtiene el listado completo del catálogo de prendas con sus variantes e imágenes.
 *          Soporta filtros opcionales de búsqueda y categorías.
 * @access  Público
 */
router.get("/", getProductsWithVariants);

/**
 * @route   GET /api/products/:id
 * @desc    Obtiene el detalle individual de una prenda, incluyendo todas sus tallas e imágenes.
 * @access  Público
 */
router.get("/:id", getProductById);

/**
 * @route   POST /api/products
 * @desc    Crea una nueva prenda asociada a la cuenta del artesano autenticado.
 * @access  Privado (Requiere sesión iniciada)
 */
router.post("/", authenticateToken, upload.single('image'), createProduct);

/**
 * @route   PUT /api/products/:id/image
 * @desc    Actualiza la imagen principal de un producto. Elimina físicamente la imagen anterior para evitar basura.
 * @access  Privado (Artesano propietario)
 */
router.put("/:id/image", authenticateToken, upload.single('image'), updateProductImage);

export default router;
