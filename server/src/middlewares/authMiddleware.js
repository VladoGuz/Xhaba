import { verifyToken } from "../services/tokenService.js";

/**
 * Middleware para autenticar peticiones mediante un JWT guardado en las cookies.
 * Si el token es válido, inyecta la información decodificada del usuario en req.user.
 */
export const authenticateToken = (req, res, next) => {
  const token = req.cookies.xhaba_session;

  if (!token) {
    return res.status(401).json({ error: "No autorizado, sesión no iniciada" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    console.error("Error al verificar token JWT:", err.message);
    return res.status(403).json({ error: "Sesión inválida o expirada. Por favor, inicie sesión nuevamente." });
  }
};

/**
 * Middleware para autorizar el acceso únicamente a ciertos roles.
 * Debe colocarse después de authenticateToken.
 */
export const authorizeRoles = (...rolesAllowed) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autorizado, sesión no iniciada" });
    }

    if (!rolesAllowed.includes(req.user.role)) {
      return res.status(403).json({ error: "Acceso denegado: permisos insuficientes para realizar esta acción" });
    }

    next();
  };
};
