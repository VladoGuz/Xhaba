import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { User, Shield, Briefcase, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Vista de Inicio de Sesión (Login).
 * 
 * Permite autenticarse en Xhaba:
 * 1. Si el usuario ya está autenticado, lo redirige automáticamente al Home (`<Navigate to="/" replace />`).
 * 2. Presenta un formulario tradicional que realiza peticiones HTTP POST seguras.
 * 3. Proporciona botones de "Acceso Rápido Demo" para agilizar pruebas de auditoría y evaluación
 *    de los tres roles (Cliente, Artesano, Administrador).
 */
function Login() {
  const { user, login } = useAuth(); // Consume el estado de sesión global
  const navigate = useNavigate();

  // Estados locales para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Suministra feedback visual de carga en el botón submit

  // Redirección reactiva de seguridad: Si ya hay sesión activa, impide volver a loguearse
  if (user) {
    if (user.role === 'artisan') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  /**
   * Envía los datos del formulario al contexto de autenticación.
   */
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      // Redirige al Dashboard de Artesano o al Home dependiendo del rol
      if (loggedInUser.role === 'artisan') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Credenciales incorrectas. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Autocompleta y envía inmediatamente el formulario con credenciales preestablecidas.
   * Utilizado únicamente para desarrollo, testing y revisión docente del proyecto.
   * 
   * @param {string} demoEmail
   * @param {string} demoPassword
   */
  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setError(null);
    setLoading(true);
    try {
      const loggedInUser = await login(demoEmail, demoPassword);
      if (loggedInUser.role === 'artisan') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError('Error al iniciar sesión con la cuenta demo. Asegúrese de que el servidor esté encendido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-manta py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-serif font-bold text-barro text-center mb-2">Iniciar Sesión</h2>
        <p className="text-gray-500 text-center mb-8">Ingresa a tu cuenta de Xhaba</p>

        {/* Renderiza alerta roja de error de credenciales o de red */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Formulario de Login */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo Electrónico"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grana focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grana focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Botón de envío dinámico */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-grana text-white py-3 rounded-lg font-medium hover:bg-grana-dark transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Ingresando...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Ingresar
              </>
            )}
          </button>
        </form>

        {/* Separador visual */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">Acceso Rápido Demo</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Botones de simulación / acceso rápido de testing */}
        <div className="space-y-3">
          <button
            onClick={() => handleQuickLogin('client@xhaba.com', 'client123')}
            disabled={loading}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 text-sm"
          >
            <span className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Demo Comprador
            </span>
            <span className="text-xs text-gray-400">client@xhaba.com</span>
          </button>

          <button
            onClick={() => handleQuickLogin('artisan@xhaba.com', 'artisan123')}
            disabled={loading}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 text-sm"
          >
            <span className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-yellow-500" />
              Demo Artesano
            </span>
            <span className="text-xs text-gray-400">artisan@xhaba.com</span>
          </button>

          <button
            onClick={() => handleQuickLogin('admin@xhaba.com', 'admin123')}
            disabled={loading}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 text-sm"
          >
            <span className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              Demo Administrador
            </span>
            <span className="text-xs text-gray-400">admin@xhaba.com</span>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-grana font-semibold hover:underline"
          >
            Regístrate
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
