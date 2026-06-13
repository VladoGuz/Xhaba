/**
 * Middleware de validación para el registro de nuevos usuarios en Xhaba.
 * 
 * Valida los datos ingresados en el cuerpo de la petición (req.body):
 * - El nombre no debe estar vacío.
 * - El correo debe ser válido y cumplir con una expresión regular estándar.
 * - La contraseña debe tener una longitud mínima de 6 caracteres.
 * - La edad (opcional) debe indicar mayoría de edad (18 años) si es provista.
 * - El rol asignado debe coincidir con alguno de los roles válidos: 'client', 'artisan', 'admin'.
 * 
 * Si alguna regla no se cumple, retorna una respuesta HTTP 400 Bad Request inmediata con el mensaje de error.
 */
export const validateRegister = (req, res, next) => {
  const { name, email, password, age, role } = req.body;

  // Validación de nombre
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "El nombre es obligatorio y no puede estar vacío" });
  }

  // Validación de existencia de correo
  if (!email || !email.trim()) {
    return res.status(400).json({ error: "El correo electrónico es obligatorio" });
  }

  // Validación de formato de correo mediante expresión regular (Regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: "El correo electrónico provisto tiene un formato inválido" });
  }

  // Validación de contraseña
  if (!password || password.length < 6) {
    return res.status(400).json({ error: "La contraseña es obligatoria y debe tener al menos 6 caracteres" });
  }

  // Validación de edad para asegurar mayoría de edad en la plataforma
  if (age) {
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18) {
      return res.status(400).json({ error: "Debe ser mayor de 18 años para registrarse en la plataforma" });
    }
  }

  // Validación del rol solicitado
  if (role && !["client", "artisan", "admin"].includes(role)) {
    return res.status(400).json({ error: "El rol seleccionado no es válido" });
  }

  next(); // Todo es válido, continúa al controlador de registro
};

/**
 * Middleware de validación para el inicio de sesión.
 * 
 * Valida los datos requeridos mínimos para autenticarse (correo y contraseña).
 * Si faltan campos, interrumpe el ciclo con una respuesta HTTP 400.
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ error: "El correo electrónico es obligatorio" });
  }

  if (!password) {
    return res.status(400).json({ error: "La contraseña es obligatoria" });
  }

  next(); // Datos mínimos ingresados, continúa al controlador de autenticación
};
