import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Consultar sesión activa al montar el sitio
  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await apiFetch("/api/auth/me");
        if (data && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.log("No hay una sesión activa previa (invitado).");
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  /**
   * Iniciar sesión con email y contraseña real
   */
  const login = async (email, password) => {
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (data && data.user) {
        setUser(data.user);
        return data.user;
      }
      throw new Error("Respuesta inválida del servidor");
    } catch (err) {
      console.error("Error en login:", err.message);
      throw err;
    }
  };

  /**
   * Registrar un nuevo usuario
   */
  const register = async (userData) => {
    try {
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      return data;
    } catch (err) {
      console.error("Error en register:", err.message);
      throw err;
    }
  };

  /**
   * Cerrar sesión
   */
  const logout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Error en logout del servidor, limpiando estado local:", err.message);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
