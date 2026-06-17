import express from "express";
import { getProductsWithVariants, getProductById, createProduct, updateProductImage, updateProduct } from "../controllers/productController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

/**
 * 🎓 GUÍA PARA ESTUDIANTES: productRoutes.js
 * 
 * Un "Enrutador" (Router) es como un operador telefónico.
 * Recibe la URL que pidió el Frontend (ej. GET /api/products) y decide qué función (Controlador) 
 * debe encargarse de responder.
 * 
 * Aquí definimos qué "método HTTP" escuchar:
 * - GET: Para pedir o leer datos.
 * - POST: Para crear o subir datos nuevos.
 * - PUT: Para actualizar o editar datos que ya existen.
 */
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
 * 
 * 🎓 Nota Estudiantil: Observa cómo hay TRES funciones en esta línea:
 * 1. authenticateToken: (Middleware) Primero verifica si el usuario tiene permiso.
 * 2. upload.single('image'): (Middleware) Luego, procesa y guarda la foto en el disco duro.
 * 3. createProduct: (Controlador) Finalmente, si los pasos anteriores salieron bien, guarda los textos en la Base de Datos.
 */
router.post("/", authenticateToken, upload.single('image'), createProduct);

/**
 * @route   PUT /api/products/:id/image
 * @desc    Actualiza la imagen principal de un producto. Elimina físicamente la imagen anterior para evitar basura.
 * @access  Privado (Artesano propietario)
 */
router.put("/:id/image", authenticateToken, upload.single('image'), updateProductImage);

/**
 * @route   PUT /api/products/:id
 * @desc    Actualiza la información general de una prenda.
 * @access  Privado (Artesano propietario)
 */
router.put("/:id", authenticateToken, updateProduct);

export default router;
