import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente Wrapper para proteger rutas.
 * Recibe los 'rolesAllowed' permitidos en un array (ej: ['client', 'admin']).
 */
function ProtectedRoute({ children, rolesAllowed }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-manta">
        <div className="w-12 h-12 border-4 border-grana border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-barro font-medium tracking-wide">Cargando sesión...</p>
      </div>
    );
  }

  if (!user) {
    // No está logueado, enviar al login
    return <Navigate to="/login" replace />;
  }

  if (rolesAllowed && !rolesAllowed.includes(user.role)) {
    // Está logueado pero no tiene el rol correcto, enviar a home
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
