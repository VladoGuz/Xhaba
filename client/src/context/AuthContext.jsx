import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

// Creación del Contexto de Autenticación de React
const AuthContext = createContext();

/**
 * Proveedor de Contexto de Autenticación (AuthProvider).
 * 
 * Envuelve el árbol de componentes de React para suministrar de forma global
 * el estado del usuario autenticado, métodos para login, register y logout,
 * y un indicador de carga ('loading') para evitar renderizar vistas protegidas
 * antes de verificar la sesión contra el servidor.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Contiene null si es invitado, o { id, name, email, role } si está logueado
  const [loading, setLoading] = useState(true); // Indica si está verificando la cookie JWT al arrancar

  // Efecto de inicialización: Consulta la sesión activa en el servidor al montar la app
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Petición a /api/auth/me (el servidor lee la cookie HttpOnly automáticamente)
        const data = await apiFetch("/api/auth/me");
        if (data && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        // Si arroja 401/403, significa que el usuario es un invitado
        console.log("No hay una sesión activa previa (usuario invitado).");
      } finally {
        setLoading(false); // Finaliza la carga de verificación
      }
    };
    checkSession();
  }, []);

  /**
   * Inicia sesión enviando credenciales al servidor.
   * 
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} Datos del usuario autenticado.
   */
  const login = async (email, password) => {
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (data && data.user) {
        setUser(data.user); // Asigna el usuario al estado global
        return data.user;
      }
      throw new Error("Respuesta inválida del servidor");
    } catch (err) {
      console.error("Error en login:", err.message);
      throw err; // Lanza el error para ser capturado y mostrado en el formulario
    }
  };

  /**
   * Registra una nueva cuenta de usuario (cliente, artesano, etc.).
   * 
   * @param {Object} userData - Datos de registro ({ name, email, password, role, etc. }).
   * @returns {Promise<Object>} Respuesta del servidor.
   */
  const register = async (userData) => {
    try {
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      return data;
    } catch (err) {
      console.error("Error en registro:", err.message);
      throw err;
    }
  };

  /**
   * Cierra la sesión activa de usuario.
   * Limpia las cookies en el servidor y reestablece el estado global 'user' a null.
   */
  const logout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Error en logout del servidor, limpiando estado local:", err.message);
    } finally {
      setUser(null); // Resetea el estado local de forma garantizada
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personalizado (Custom Hook) para consumir de forma sencilla la sesión del usuario
 * en cualquier componente hijo sin necesidad de usar AuthContext.Consumer.
 */
export function useAuth() {
  return useContext(AuthContext);
}
