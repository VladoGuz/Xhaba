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
  const { name, email, password, age, estado, municipio, barrio, role } = req.body;

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

  const client = await pool.connect();
  let newUser;

  try {
    await client.query('BEGIN');

    let newArtisanId = null;
    
    // Si es artesano, primero crearle su perfil en la tabla de artesanos
    if (role === 'artisan') {
      const artisanQuery = `
        INSERT INTO artisans (name, community, state)
        VALUES ($1, $2, $3)
        RETURNING id
      `;
      const artisanRes = await client.query(artisanQuery, [
        name.trim(),
        municipio ? municipio.trim() : 'Desconocido',
        estado ? estado.trim() : 'Oaxaca'
      ]);
      newArtisanId = artisanRes.rows[0].id;
    }

    // Guardar en la base de datos y retornar los datos del usuario omitiendo el hash de la contraseña
    const newUserQuery = `
      INSERT INTO users (name, email, password_hash, age, estado, municipio, barrio, role, artisan_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, name, email, age, estado, municipio, barrio, role, profile_picture, artisan_id
    `;
    
    const userRes = await client.query(newUserQuery, [
      name.trim(),
      email.toLowerCase().trim(),
      passwordHash,
      age ? parseInt(age, 10) : null,
      estado ? estado.trim() : null,
      municipio ? municipio.trim() : null,
      barrio ? barrio.trim() : null,
      role || "client",
      newArtisanId
    ]);

    newUser = userRes.rows[0];

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  res.status(201).json({
    message: "Usuario registrado con éxito",
    user: newUser
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

  // Generar token JWT mediante el servicio firmando { id, email, role, artisan_id }
  const token = generateToken({ id: user.id, email: user.email, role: user.role, artisan_id: user.artisan_id });

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
      estado: user.estado,
      municipio: user.municipio,
      barrio: user.barrio,
      role: user.role,
      profile_picture: user.profile_picture,
      artisan_id: user.artisan_id
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
    "SELECT id, name, email, age, estado, municipio, barrio, role, profile_picture, artisan_id FROM users WHERE id = $1",
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

/**
 * Actualiza los datos del perfil del usuario autenticado.
 * 
 * @route   PUT /api/auth/profile
 * @desc    Permite modificar nombre, email, edad, municipio y barrio del usuario.
 *          El rol de cuenta NO puede ser modificado por este endpoint por seguridad.
 * @access  Privado (Requiere sesión iniciada)
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, email, age, estado, municipio, barrio } = req.body;

  // Validar que al menos se envíe el nombre
  if (!name || !name.trim()) {
    const err = new Error("El nombre es obligatorio");
    err.statusCode = 400;
    throw err;
  }

  // Verificar que el email no esté en uso por otro usuario
  if (email) {
    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND id != $2",
      [email.toLowerCase().trim(), userId]
    );
    if (emailCheck.rows.length > 0) {
      const err = new Error("El correo electrónico ya está en uso por otra cuenta");
      err.statusCode = 400;
      throw err;
    }
  }

  const updatedUser = await pool.query(
    `UPDATE users 
     SET name = $1, email = $2, age = $3, estado = $4, municipio = $5, barrio = $6
     WHERE id = $7
     RETURNING id, name, email, age, estado, municipio, barrio, role, profile_picture`,
    [
      name.trim(),
      email ? email.toLowerCase().trim() : null,
      age ? parseInt(age, 10) : null,
      estado ? estado.trim() : null,
      municipio ? municipio.trim() : null,
      barrio ? barrio.trim() : null,
      userId
    ]
  );

  res.json({
    message: "Perfil actualizado con éxito",
    user: updatedUser.rows[0]
  });
});

// ========== DIRECCIONES ==========

/**
 * Obtiene todas las direcciones del usuario autenticado.
 * @route   GET /api/auth/addresses
 * @access  Privado
 */
export const getAddresses = asyncHandler(async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM addresses WHERE user_id = $1 ORDER BY created_at DESC",
    [req.user.id]
  );
  res.json({ addresses: result.rows });
});

/**
 * Crea una nueva dirección para el usuario autenticado.
 * @route   POST /api/auth/addresses
 * @access  Privado
 */
export const createAddress = asyncHandler(async (req, res) => {
  const { label, estado, municipio, barrio } = req.body;

  if (!estado && !municipio && !barrio) {
    const err = new Error("Debes llenar al menos un campo de la dirección");
    err.statusCode = 400;
    throw err;
  }

  const result = await pool.query(
    `INSERT INTO addresses (user_id, label, estado, municipio, barrio)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [req.user.id, label || 'Casa', estado || null, municipio || null, barrio || null]
  );

  res.status(201).json({
    message: "Dirección agregada",
    address: result.rows[0]
  });
});

/**
 * Elimina una dirección del usuario autenticado.
 * @route   DELETE /api/auth/addresses/:id
 * @access  Privado
 */
export const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id",
    [id, req.user.id]
  );

  if (result.rows.length === 0) {
    const err = new Error("Dirección no encontrada");
    err.statusCode = 404;
    throw err;
  }

  res.json({ message: "Dirección eliminada" });
});

import fs from 'fs';
import path from 'path';

/**
 * Sube o actualiza la foto de perfil del usuario.
 * 
 * @route   PUT /api/auth/avatar
 * @access  Privado
 */
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    const err = new Error("No se ha proporcionado ninguna imagen");
    err.statusCode = 400;
    throw err;
  }

  const userId = req.user.id;
  const newImageName = req.file.filename;

  // Obtener usuario para eliminar foto anterior si existe
  const userQuery = await pool.query("SELECT profile_picture FROM users WHERE id = $1", [userId]);
  const oldPicture = userQuery.rows[0]?.profile_picture;

  if (oldPicture) {
    const oldPath = path.join(process.cwd(), 'uploads', oldPicture);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  // Actualizar BD
  await pool.query(
    "UPDATE users SET profile_picture = $1 WHERE id = $2",
    [newImageName, userId]
  );

  res.json({
    message: "Foto de perfil actualizada",
    profile_picture: newImageName
  });
});

/**
 * Elimina la foto de perfil del usuario.
 * 
 * @route   DELETE /api/auth/avatar
 * @access  Privado
 */
export const deleteAvatar = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const userQuery = await pool.query("SELECT profile_picture FROM users WHERE id = $1", [userId]);
  const oldPicture = userQuery.rows[0]?.profile_picture;

  if (oldPicture) {
    const oldPath = path.join(process.cwd(), 'uploads', oldPicture);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  // Actualizar BD a null
  await pool.query(
    "UPDATE users SET profile_picture = NULL WHERE id = $1",
    [userId]
  );

  res.json({
    message: "Foto de perfil eliminada",
    profile_picture: null
  });
});
