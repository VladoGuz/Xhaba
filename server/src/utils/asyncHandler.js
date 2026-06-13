/**
 * asyncHandler
 * 
 * Función de orden superior (Higher-Order Function) que envuelve controladores asíncronos de Express.
 * Elimina la necesidad de escribir bloques repetitivos de `try/catch` en cada controlador asíncrono.
 * 
 * Si una promesa es rechazada (ocurre un error), la atrapa con `.catch(next)` y la delega
 * automáticamente al middleware de control de errores centralizado.
 * 
 * @param {Function} fn - Controlador asíncrono que recibe (req, res, next).
 * @returns {Function} Express Middleware.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
