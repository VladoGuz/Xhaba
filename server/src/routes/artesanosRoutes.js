import express from "express";
import * as artisanController from "../controllers/artisanController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rutas públicas
router.get("/", artisanController.getArtisans);
router.get("/:id", artisanController.getArtisanById);
router.get("/:id/reviews", artisanController.getArtisanReviews);

// Rutas protegidas (requieren sesión)
router.post("/", authenticateToken, artisanController.createArtisan);
router.get("/:id/products", authenticateToken, artisanController.getArtisanProducts);
router.put("/variants/:variantId/stock", authenticateToken, artisanController.updateVariantStock);
router.post("/:id/reviews", authenticateToken, artisanController.createArtisanReview);

export default router;
