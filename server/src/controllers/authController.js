import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../services/tokenService.js";
import { config } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Registra un nuevo usuario en la base de datos (Cliente o Artesano).
 * 
 * @route   POST /api/auth/register
 * @desc    Valida que el correo no esté registrado previamente, genera el hash de la contraseña usando
 *          bcryptjs para evitar guardar contraseñas en texto plano, e inserta el nuevo registro en la tabla 'users'.
 * @access  Público
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, age, municipio, barrio, role } = req.body;

  // Las validaciones de campos obligatorios ya se procesaron en validateRegister middleware.
  
  // Validar si el email ya existe en la BD
  const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email.toLowerCase().trim()]);
  if (existingUser.rows.length > 0) {
    const err = new Error("El correo electrónico ya está registrado");
    err.statusCode = 400; // Bad Request
    throw err;
  }

  // Encriptar contraseña usando un factor de costo (saltRounds) de 10
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Guardar en la base de datos y retornar los datos del usuario omitiendo el hash de la contraseña
  const newUserQuery = `
    INSERT INTO users (name, email, password_hash, age, municipio, barrio, role)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, name, email, age, municipio, barrio, role
  `;
  
  const newUser = await pool.query(newUserQuery, [
    name.trim(),
    email.toLowerCase().trim(),
    passwordHash,
    age ? parseInt(age, 10) : null,
    municipio ? municipio.trim() : null,
    barrio ? barrio.trim() : null,
    role || "client"
  ]);

  res.status(201).json({
    message: "Usuario registrado con éxito",
    user: newUser.rows[0]
  });
});

/**
 * Inicia sesión de usuario.
 * 
 * @route   POST /api/auth/login
 * @desc    Busca al usuario por correo, valida el hash de contraseña e inyecta un JWT firmado
 *          dentro de una cookie HttpOnly de sesión para mantener el estado.
 * @access  Público
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Buscar al usuario por correo electrónico
  const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase().trim()]);
  if (userQuery.rows.length === 0) {
    const err = new Error("Credenciales inválidas");
    err.statusCode = 401; // Unauthorized
    throw err;
  }

  const user = userQuery.rows[0];

  // Comprobar si la cuenta de usuario se encuentra suspendida
  if (user.is_banned) {
    const err = new Error("Esta cuenta ha sido suspendida por la administración de Xhaba");
    err.statusCode = 403; // Forbidden
    throw err;
  }

  // Comparar hashes de contraseña (contraseña en texto plano vs hash guardado)
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const err = new Error("Credenciales inválidas");
    err.statusCode = 401;
    throw err;
  }

  // Generar token JWT mediante el servicio firmando { id, email, role }
  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  // Configurar Cookie HTTP-only en la respuesta
  res.cookie("xhaba_session", token, {
    httpOnly: true, // Protege contra vulnerabilidades XSS
    secure: config.nodeEnv === "production", // Sólo envía la cookie por HTTPS en producción
    sameSite: "lax", // Previene ataques CSRF
    maxAge: 24 * 60 * 60 * 1000 // Expiración en 1 día expresada en milisegundos
  });

  res.json({
    message: "Inicio de sesión exitoso",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      municipio: user.municipio,
      barrio: user.barrio,
      role: user.role
    }
  });
});

/**
 * Cierra la sesión activa de usuario.
 * 
 * @route   POST /api/auth/logout
 * @desc    Limpia (borra) la cookie xhaba_session del cliente configurando una fecha de expiración pasada.
 * @access  Público
 */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("xhaba_session", {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax"
  });
  res.json({ success: true, message: "Sesión cerrada correctamente" });
});

/**
 * Obtener perfil del usuario actual (sesión activa).
 * 
 * @route   GET /api/auth/me
 * @desc    Lee el id de usuario inyectado previamente por el middleware de autenticación (req.user.id)
 *          y obtiene los datos actualizados del usuario de la base de datos.
 * @access  Privado (Requiere sesión iniciada)
 */
export const getMe = asyncHandler(async (req, res) => {
  const userQuery = await pool.query(
    "SELECT id, name, email, age, municipio, barrio, role FROM users WHERE id = $1",
    [req.user.id]
  );

  if (userQuery.rows.length === 0) {
    const err = new Error("Usuario no encontrado");
    err.statusCode = 404; // Not Found
    throw err;
  }

  res.json({
    user: userQuery.rows[0]
  });
});
