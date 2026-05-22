import express from "express";
import {
  getProducts,
  getProductsWithVariants,
} from "../controllers/homeController.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/products/variants", getProductsWithVariants);

export default router;
