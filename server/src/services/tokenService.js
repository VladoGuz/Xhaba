import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

/**
 * Firma y genera un token JWT con la información de sesión del usuario.
 * 
 * @param {Object} payload - Contiene los datos que se codificarán en el token (ej. { id, email, role }).
 * @returns {string} Token firmado en formato de cadena compacta de JWT.
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: "24h" // El token expira automáticamente en 24 horas
  });
};

/**
 * Verifica la firma de un token JWT recibido.
 * Si el token es correcto y no ha expirado, descifra y retorna el payload original.
 * De lo contrario, arroja una excepción de jsonwebtoken.
 * 
 * @param {string} token - Token JWT a verificar.
 * @returns {Object} Payload descifrado.
 */
export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
