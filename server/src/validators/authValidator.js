/**
 * Middleware de validación para registro de usuarios
 */
export const validateRegister = (req, res, next) => {
  const { name, email, password, age, role } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "El nombre es obligatorio y no puede estar vacío" });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ error: "El correo electrónico es obligatorio" });
  }

  // Validación básica de formato de correo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: "El correo electrónico provisto tiene un formato inválido" });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: "La contraseña es obligatoria y debe tener al menos 6 caracteres" });
  }

  if (age) {
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18) {
      return res.status(400).json({ error: "Debe ser mayor de 18 años para registrarse en la plataforma" });
    }
  }

  if (role && !["client", "artisan", "admin"].includes(role)) {
    return res.status(400).json({ error: "El rol seleccionado no es válido" });
  }

  next();
};

/**
 * Middleware de validación para inicio de sesión
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ error: "El correo electrónico es obligatorio" });
  }

  if (!password) {
    return res.status(400).json({ error: "La contraseña es obligatoria" });
  }

  next();
};
