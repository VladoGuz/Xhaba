import { verifyToken } from "../services/tokenService.js";

/**
 * Middleware para autenticar peticiones mediante un JSON Web Token (JWT) guardado en las cookies de la petición.
 * 
 * @param {import("express").Request} req - Petición HTTP. Se inspecciona la cookie xhaba_session.
 * @param {import("express").Response} res - Respuesta HTTP.
 * @param {import("express").NextFunction} next - Siguiente función en la pila de middleware de Express.
 * 
 * Si el token existe y es válido, inyecta la información decodificada del usuario (id, email, role)
 * en `req.user` y da paso al siguiente middleware. Si no existe, retorna 401. Si es inválido, retorna 403.
 */
export const authenticateToken = (req, res, next) => {
  // Las cookies son analizadas previamente por el middleware cookieParser en index.js
  const token = req.cookies.xhaba_session;

  if (!token) {
    return res.status(401).json({ error: "No autorizado, sesión no iniciada" });
  }

  try {
    // Verifica la firma y descifra el payload del JWT
    const decoded = verifyToken(token);
    
    // Inyecta el usuario descifrado en el objeto de la petición (request)
    req.user = decoded; // Estructura: { id, email, role }
    next();
  } catch (err) {
    console.error("Error al verificar token JWT:", err.message);
    // Retorna 403 Forbidden cuando el token expiró o fue alterado
    return res.status(403).json({ error: "Sesión inválida o expirada. Por favor, inicie sesión nuevamente." });
  }
};

/**
 * Middleware para autorizar el acceso a rutas únicamente a roles específicos.
 * Debe colocarse obligatoriamente después de authenticateToken para que req.user exista.
 * 
 * @param {...string} rolesAllowed - Lista de roles permitidos (ej. 'admin', 'artisan', 'client').
 * @returns {import("express").RequestHandler} Función middleware de Express.
 */
export const authorizeRoles = (...rolesAllowed) => {
  return (req, res, next) => {
    // Si req.user no existe, significa que no se aplicó authenticateToken antes
    if (!req.user) {
      return res.status(401).json({ error: "No autorizado, sesión no iniciada" });
    }

    // Compara el rol del usuario contra la lista de roles permitidos
    if (!rolesAllowed.includes(req.user.role)) {
      return res.status(403).json({ error: "Acceso denegado: permisos insuficientes para realizar esta acción" });
    }

    next();
  };
};
