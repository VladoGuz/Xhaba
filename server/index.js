import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Fíjate en la extensión .js obligatoria
import artisanRoutes from "./src/routes/artesanosRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import homeRoutes from "./src/routes/homeRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite a Express leer JSON en el body de las peticiones

// Rutas base
app.use("/api/artisans", artisanRoutes);
app.use("/api/products", productRoutes);
app.use("/home", homeRoutes);
// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
