import express from "express";
import * as artisanController from "../controllers/artisanController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * ==========================================
 * Rutas Públicas (Cualquier visitante)
 * ==========================================
 */

/**
 * @route   GET /api/artisans
 * @desc    Obtiene el catálogo de artesanos de Oaxaca con filtros opcionales de comunidad y región.
 * @access  Público
 */
router.get("/", artisanController.getArtisans);

/**
 * @route   GET /api/artisans/:id
 * @desc    Obtiene la información de perfil detallada de un artesano específico.
 * @access  Público
 */
router.get("/:id", artisanController.getArtisanById);

/**
 * @route   GET /api/artisans/:id/reviews
 * @desc    Obtiene la lista de reseñas y valoraciones del artesano.
 * @access  Público
 */
router.get("/:id/reviews", artisanController.getArtisanReviews);

/**
 * ==========================================
 * Rutas Protegidas (Requieren autenticación)
 * ==========================================
 */

/**
 * @route   POST /api/artisans
 * @desc    Crea o vincula el perfil detallado del artesano a su cuenta de usuario.
 * @access  Privado (Autenticado)
 */
router.post("/", authenticateToken, artisanController.createArtisan);

/**
 * @route   GET /api/artisans/:id/products
 * @desc    Obtiene las prendas de vestir pertenecientes a un artesano específico.
 * @access  Privado (Autenticado)
 */
router.get("/:id/products", authenticateToken, artisanController.getArtisanProducts);

/**
 * @route   PUT /api/artisans/variants/:variantId/stock
 * @desc    Actualiza directamente el inventario/stock de una variante de producto.
 * @access  Privado (Autenticado)
 */
router.put("/variants/:variantId/stock", authenticateToken, artisanController.updateVariantStock);

/**
 * @route   POST /api/artisans/:id/reviews
 * @desc    Registra una nueva valoración de un cliente hacia el artesano.
 * @access  Privado (Autenticado)
 */
router.post("/:id/reviews", authenticateToken, artisanController.createArtisanReview);

export default router;
