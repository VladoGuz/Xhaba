/**
 * asyncHandler
 * Envuelve una función controladora asíncrona para capturar cualquier
 * promesa rechazada y enviarla al middleware de errores mediante next().
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
