import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Carga y validación inicial de configuración
import { config } from "./src/config/env.js";

import artisanRoutes from "./src/routes/artesanosRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import homeRoutes from "./src/routes/homeRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import { ensureDatabaseSchema } from "./src/config/alter_users_table.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const app = express();

// Configuración de CORS dinámica y segura para soportar cookies/credenciales
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));

app.use(express.json()); // Permite a Express leer JSON en el body de las peticiones
app.use(cookieParser()); // Habilita a Express para analizar las cookies recibidas

// Rutas base
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/artisans", artisanRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/home", homeRoutes);

// Middleware global de manejo de errores (siempre al final de la cola)
app.use(errorHandler);

// Iniciar servidor
app.listen(config.port, async () => {
  // Asegurar que la estructura de la base de datos esté al día al iniciar
  await ensureDatabaseSchema();
  console.log(`🚀 Servidor corriendo en el puerto http://localhost:${config.port}`);
});
