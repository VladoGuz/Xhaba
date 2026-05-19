import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Fíjate en la extensión .js obligatoria
import artisanRoutes from "./src/routes/artisanRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas base
app.use("/api/artisans", artisanRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${PORT}/ `);
});
