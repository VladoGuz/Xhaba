import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

/**
 * Firmar un token JWT con la información del usuario
 * @param {Object} payload - { id, email, role }
 * @returns {string} token firmado
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: "24h"
  });
};

/**
 * Verificar un token JWT
 * @param {string} token
 * @returns {Object} payload decodificado
 */
export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
