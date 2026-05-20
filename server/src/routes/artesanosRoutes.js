const express = require("express");
const router = express.Router();
const artisanController = require("../controllers/arteanosController");

// Definir los endpoints
router.get("/", artisanController.getArtisans);
router.post("/", artisanController.createArtisan);

module.exports = router;
