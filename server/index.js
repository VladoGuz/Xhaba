const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importar rutas (ejemplo con artesanos)
const artisanRoutes = require("./src/routes/artesanosRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite a Express leer JSON en el body de las peticiones

// Rutas base
app.use("/api/artisans", artisanRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
