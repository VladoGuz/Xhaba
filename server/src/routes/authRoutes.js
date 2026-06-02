import express from "express";
import { register, login, logout, getMe } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validateRegister, validateLogin } from "../validators/authValidator.js";

const router = express.Router();

// Ruta para el registro de usuarios con validador intermedio
router.post("/register", validateRegister, register);

// Ruta para el inicio de sesión con validador intermedio
router.post("/login", validateLogin, login);

// Ruta para el cierre de sesión
router.post("/logout", logout);

// Ruta para obtener la sesión del usuario actual (protegida con token)
router.get("/me", authenticateToken, getMe);

export default router;
