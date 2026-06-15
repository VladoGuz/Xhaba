import express from "express";
import { register, login, logout, getMe, uploadAvatar, deleteAvatar, updateProfile, getAddresses, createAddress, deleteAddress } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validateRegister, validateLogin } from "../validators/authValidator.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registra un nuevo usuario en la plataforma.
 * @access  Público
 * @handler validateRegister (validador de campos) -> register (controlador de creación)
 */
router.post("/register", validateRegister, register);

/**
 * @route   POST /api/auth/login
 * @desc    Inicia sesión, verifica credenciales y establece la cookie JWT 'xhaba_session'.
 * @access  Público
 * @handler validateLogin (validador de formato) -> login (autenticación)
 */
router.post("/login", validateLogin, login);

/**
 * @route   POST /api/auth/logout
 * @desc    Cierra la sesión del usuario limpiando la cookie 'xhaba_session'.
 * @access  Público
 * @handler logout
 */
router.post("/logout", logout);

/**
 * @route   GET /api/auth/me
 * @desc    Retorna la información del usuario autenticado en la sesión actual.
 * @access  Privado (Requiere cookie JWT)
 * @handler authenticateToken (verificación de firma JWT) -> getMe (lectura de datos)
 */
router.get("/me", authenticateToken, getMe);

/**
 * @route   PUT /api/auth/avatar
 * @desc    Sube o actualiza la foto de perfil del usuario
 * @access  Privado
 */
router.put("/avatar", authenticateToken, upload.single('image'), uploadAvatar);

/**
 * @route   DELETE /api/auth/avatar
 * @desc    Elimina la foto de perfil del usuario
 * @access  Privado
 */
router.delete("/avatar", authenticateToken, deleteAvatar);

/**
 * @route   PUT /api/auth/profile
 * @desc    Actualiza los datos personales del usuario (nombre, email, edad, municipio, barrio).
 *          El rol de cuenta NO es modificable por este endpoint.
 * @access  Privado (Requiere cookie JWT)
 */
router.put("/profile", authenticateToken, updateProfile);

/**
 * @route   GET /api/auth/addresses
 * @desc    Obtiene las direcciones del usuario autenticado
 * @access  Privado
 */
router.get("/addresses", authenticateToken, getAddresses);

/**
 * @route   POST /api/auth/addresses
 * @desc    Crea una nueva dirección
 * @access  Privado
 */
router.post("/addresses", authenticateToken, createAddress);

/**
 * @route   DELETE /api/auth/addresses/:id
 * @desc    Elimina una dirección
 * @access  Privado
 */
router.delete("/addresses/:id", authenticateToken, deleteAddress);

export default router;
