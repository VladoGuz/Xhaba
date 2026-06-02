import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../services/tokenService.js";
import { config } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Registrar un nuevo usuario (Cliente o Artesano)
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, age, municipio, barrio, role } = req.body;

  // Las validaciones de campos obligatorios ya se procesaron en validateRegister middleware.
  
  // Validar si el email ya existe en la BD
  const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email.toLowerCase().trim()]);
  if (existingUser.rows.length > 0) {
    const err = new Error("El correo electrónico ya está registrado");
    err.statusCode = 400;
    throw err;
  }

  // Encriptar contraseña
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Guardar en la base de datos
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
 * Iniciar sesión de usuario
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Buscar al usuario por correo
  const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase().trim()]);
  if (userQuery.rows.length === 0) {
    const err = new Error("Credenciales inválidas");
    err.statusCode = 401;
    throw err;
  }

  const user = userQuery.rows[0];

  // Comparar hashes de contraseña
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const err = new Error("Credenciales inválidas");
    err.statusCode = 401;
    throw err;
  }

  // Generar token JWT mediante el servicio
  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  // Configurar Cookie HTTP-only
  res.cookie("xhaba_session", token, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000 // 1 día
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
 * Cerrar sesión
 * POST /api/auth/logout
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
 * Obtener perfil del usuario actual (sesión activa)
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  const userQuery = await pool.query(
    "SELECT id, name, email, age, municipio, barrio, role FROM users WHERE id = $1",
    [req.user.id]
  );

  if (userQuery.rows.length === 0) {
    const err = new Error("Usuario no encontrado");
    err.statusCode = 404;
    throw err;
  }

  res.json({
    user: userQuery.rows[0]
  });
});
