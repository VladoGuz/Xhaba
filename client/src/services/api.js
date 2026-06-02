const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Clase de Error Personalizada para capturar detalles específicos de respuestas HTTP.
 */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * apiFetch
 * Wrapper de fetch para estandarizar consultas, incluir credenciales de cookies
 * y extraer de manera limpia los mensajes de error arrojados por el backend.
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Permite el transporte de cookies HttpOnly
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    }
  };

  const response = await fetch(url, finalOptions);

  if (!response.ok) {
    let errorMessage = `Error: ${response.status} ${response.statusText}`;
    
    try {
      const data = await response.json();
      if (data && data.error) {
        errorMessage = data.error;
      }
    } catch (_) {
      // Respuesta sin cuerpo JSON, ignorar parse
    }

    throw new ApiError(response.status, errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  try {
    return await response.json();
  } catch (error) {
    // Retorno exitoso sin contenido JSON legible
    return null;
  }
};
