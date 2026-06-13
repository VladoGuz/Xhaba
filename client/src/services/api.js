// URL del backend configurada en las variables de entorno de Vite (.env)
// Si no existe, realiza fallback a http://localhost:5000 por defecto
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Clase de Error Personalizada (ApiError).
 * 
 * Extiende la clase base Error de JavaScript para adjuntar el código de estado HTTP (status).
 * Esto permite al frontend reaccionar de forma diferente ante errores específicos
 * (por ejemplo, redirigir a login ante un 401, o mostrar un aviso de stock agotado ante un 409).
 */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status; // Código HTTP (400, 401, 403, 404, 409, 500, etc.)
  }
}

/**
 * apiFetch
 * 
 * Wrapper utilitario sobre el método nativo window.fetch de JavaScript.
 * Estandariza la comunicación con la APIREST del backend de Xhaba:
 * - Define cabeceras JSON por defecto.
 * - Habilita de forma obligatoria 'credentials: "include"' para que el navegador adjunte
 *   automáticamente la cookie HttpOnly de sesión 'xhaba_session' en cada petición AJAX.
 * - Desglosa y parsea los mensajes de error en formato JSON devueltos por el servidor.
 * 
 * @param {string} endpoint - Ruta relativa del recurso (ej. "/api/products").
 * @param {Object} options - Opciones de configuración adicionales (method, body, headers).
 * @returns {Promise<any>} Objeto de respuesta JSON o null en respuestas vacías.
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    // Crucial: Permite enviar y recibir cookies (como 'xhaba_session') en solicitudes Cross-Origin
    credentials: "include", 
  };

  // Mezcla de forma segura las cabeceras y configuraciones personalizadas con las predeterminadas
  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    }
  };

  const response = await fetch(url, finalOptions);

  // Manejo centralizado de respuestas HTTP no exitosas (códigos 4xx y 5xx)
  if (!response.ok) {
    let errorMessage = `Error: ${response.status} ${response.statusText}`;
    
    try {
      // Intenta extraer el error de negocio formateado por el backend
      const data = await response.json();
      if (data && data.error) {
        errorMessage = data.error;
      }
    } catch (_) {
      // Ignora fallos de parseo en caso de que la respuesta sea HTML o texto plano
    }

    throw new ApiError(response.status, errorMessage);
  }

  // Si la respuesta es HTTP 204 No Content, retorna directamente null
  if (response.status === 204) {
    return null;
  }

  try {
    return await response.json();
  } catch (error) {
    // Si la llamada fue exitosa pero no retorna un JSON válido
    return null;
  }
};
