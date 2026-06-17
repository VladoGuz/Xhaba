import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Carga y validación inicial de variables de entorno y configuración del servidor
import { config } from "./src/config/env.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importación de rutas de la API REST
import artisanRoutes from "./src/routes/artesanosRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import homeRoutes from "./src/routes/homeRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";

// Función encargada de asegurar el esquema DDL y semillas DML en la base de datos
import { ensureDatabaseSchema } from "./src/config/alter_users_table.js";

// Middleware global para el manejo y formateo de excepciones arrojadas en el servidor
import { errorHandler } from "./src/middlewares/errorHandler.js";

// Instanciación de la aplicación Express
const app = express();

/**
 * 🎓 GUÍA PARA ESTUDIANTES: index.js (El Servidor)
 * 
 * Este archivo es el punto de entrada de nuestro Backend. Es el programa que "escucha" peticiones 24/7.
 * Express es la librería de Node.js que nos hace la vida muy fácil para crear servidores web.
 * 
 * Configuración de CORS (Cross-Origin Resource Sharing) dinámico.
 * Por seguridad, los navegadores bloquean peticiones entre diferentes dominios (ej. el puerto 5173 intentando 
 * hablar con el puerto 5000). CORS es el permiso explícito que da el servidor para decir "Sí, confío en mi frontend".
 * 
 * Es sumamente importante habilitar 'credentials: true' para permitir el envío automático
 * de la cookie 'xhaba_session' que maneja el estado de sesión HTTPOnly.
 */
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));

// Middlewares globales de parsing de Express
// 🎓 Piensa en los Middlewares como "porteros" o "traductores" que procesan la petición antes de que llegue a nuestras rutas.
app.use(express.json()); // Traduce el cuerpo (body) de las peticiones entrantes a un objeto JSON usable en Javascript.
app.use(cookieParser()); // Traduce las cookies que vienen en la petición (ej. el token de sesión) a un formato fácil de leer en req.cookies.

// Servir estáticamente los archivos subidos (fotos de prendas)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Registro de enrutadores correspondientes a los diferentes módulos de la API de Xhaba
app.use("/api/auth", authRoutes);       // Registro, login, logout, perfil actual
app.use("/api/admin", adminRoutes);     // Moderación, métricas administrativas y carritos abandonados
app.use("/api/artisans", artisanRoutes); // Perfil público de artesanos, reputación y reseñas
app.use("/api/products", productRoutes); // Catálogo completo de prendas, variantes y gestión de stock
app.use("/api/orders", orderRoutes);     // Checkout con bloqueo concurrente (FOR UPDATE)
app.use("/api/cart", cartRoutes);       // Sincronización del carrito persistente del cliente en la DB
app.use("/home", homeRoutes);           // Consulta optimizada para la página de bienvenida central

// Middleware global de manejo de errores (siempre debe ser el último registrado en la cola de middlewares)
app.use(errorHandler);

// Inicialización del servidor Express en el puerto configurado
app.listen(config.port, async () => {
  // Asegura que las tablas, relaciones y datos de semilla locales estén al día al iniciar el servidor
  await ensureDatabaseSchema();
  console.log(`🚀 Servidor corriendo en el puerto http://localhost:${config.port}`);
});
