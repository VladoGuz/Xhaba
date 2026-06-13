/**
 * Middleware centralizado para el manejo de errores de Express (Global Error Handler).
 * 
 * Captura todos los errores que ocurren en la capa de controladores y rutas
 * que son propagados invocando next(error) o mediante excepciones no controladas.
 * 
 * @param {Object} err - Instancia de error capturada. Puede contener properties personalizadas como statusCode.
 * @param {import("express").Request} req - Petición HTTP.
 * @param {import("express").Response} res - Respuesta HTTP.
 * @param {import("express").NextFunction} next - Siguiente middleware.
 */
export const errorHandler = (err, req, res, next) => {
  // Define el código de estado HTTP (por defecto 500 para errores internos del servidor)
  const statusCode = err.statusCode || 500;
  const message = err.message || "Ocurrió un error inesperado en el servidor";

  // Mostrar la traza del error en consola durante el desarrollo para facilitar la depuración
  if (process.env.NODE_ENV !== "production") {
    console.error("💥 Error capturado por el middleware global de Xhaba:", err);
  } else {
    // En producción se registra una bitácora simplificada y no invasiva
    console.error(`❌ [Error] ${message} (Status: ${statusCode})`);
  }

  // Manejo especial para errores sintácticos de parsing de JSON en el body
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Sintaxis JSON inválida en el cuerpo de la petición" });
  }

  // Responde con un formato JSON unificado al cliente para asegurar una consistencia en el frontend
  res.status(statusCode).json({
    error: message,
    // Envía la pila de llamadas (stack trace) únicamente en entorno de desarrollo para proteger datos internos
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};
