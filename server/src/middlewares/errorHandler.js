/**
 * Centralized Error Handler Middleware
 * Captura todos los errores propagados por las rutas y retorna una respuesta JSON consistente.
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Ocurrió un error inesperado en el servidor";

  // Mostrar el error en consola en desarrollo para facilitar la depuración
  if (process.env.NODE_ENV !== "production") {
    console.error("💥 Error capturado por middleware:", err);
  } else {
    console.error(`❌ [Error] ${message} (Status: ${statusCode})`);
  }

  // Errores de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Sintaxis JSON inválida en el cuerpo de la petición" });
  }

  res.status(statusCode).json({
    error: message,
    // stack sólo en desarrollo
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};
