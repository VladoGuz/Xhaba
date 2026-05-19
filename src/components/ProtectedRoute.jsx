import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente Wrapper para proteger rutas.
 * Recibe los 'rolesAllowed' permitidos en un array (ej: ['client', 'admin']).
 */
function ProtectedRoute({ children, rolesAllowed }) {
  const { user } = useAuth();

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
