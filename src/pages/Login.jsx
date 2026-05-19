import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { User, Shield, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { user, loginAsClient, loginAsArtisan, loginAsAdmin } = useAuth();
  const navigate = useNavigate();

  // Si ya está logueado, redirigir al home
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (roleLoginFunction) => {
    roleLoginFunction();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-manta py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-serif font-bold text-barro text-center mb-8">Iniciar Sesión (Simulador)</h2>
        <p className="text-gray-600 text-center mb-8">Selecciona el rol con el que deseas ingresar a la plataforma para probar los diferentes paneles.</p>
        
        <div className="space-y-4">
          <button 
            onClick={() => handleLogin(loginAsClient)}
            className="w-full flex items-center justify-center gap-3 bg-gray-50 border border-gray-200 text-gray-800 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            <User className="w-5 h-5 text-blue-500" />
            Ingresar como Cliente
          </button>

          <button 
            onClick={() => handleLogin(loginAsArtisan)}
            className="w-full flex items-center justify-center gap-3 bg-gray-50 border border-gray-200 text-gray-800 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            <Briefcase className="w-5 h-5 text-yellow-500" />
            Ingresar como Artesano
          </button>

          <button 
            onClick={() => handleLogin(loginAsAdmin)}
            className="w-full flex items-center justify-center gap-3 bg-gray-50 border border-gray-200 text-gray-800 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            <Shield className="w-5 h-5 text-red-500" />
            Ingresar como Administrador
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          ¿No tienes cuenta? <button onClick={() => navigate('/register')} className="text-barro font-semibold hover:underline">Regístrate</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
