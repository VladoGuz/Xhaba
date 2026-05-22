import express from "express";
import * as artisanController from "../controllers/artisanController.js";

const router = express.Router();

// Definir los endpoints
router.get("/", artisanController.getArtisans);
router.post("/", artisanController.createArtisan);

export default router;
