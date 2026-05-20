import express from "express";
import {
  getArtisans,
  createArtisan,
} from "../controllers/artisanController.js";

const router = express.Router();

// Definir los endpoints
router.get("/", getArtisans);
router.post("/", createArtisan);

export default router;
