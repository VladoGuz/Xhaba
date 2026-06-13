import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Mail, Lock, User, MapPin, Calendar, Briefcase, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Vista de Registro de Cuenta (Register) - Historia de Usuario HU-01.
 * 
 * Permite a nuevos usuarios registrarse en la plataforma Xhaba.
 * Soporta dos perfiles mediante el campo de rol:
 * - 'client' (Compradores y coleccionistas textiles).
 * - 'artisan' (Maestros tejedores y costureros oaxaqueños).
 * 
 * Recolecta geolocalización regional (municipio y barrio/sección de Oaxaca)
 * y realiza validaciones en caliente (edad mínima de 18 años, contraseñas seguras).
 */
function Register() {
  const navigate = useNavigate();
  const { register } = useAuth(); // Consume la función de registro provista por AuthContext
  
  // Estado local que agrupa todos los campos del formulario
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    password: '',
    municipio: '',
    barrio: '',
    role: 'client' // Rol por defecto: Cliente
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // Feedback visual en el botón durante la petición

  /**
   * Procesa el envío del formulario. Realiza validaciones del lado del cliente antes
   * de disparar la petición HTTP al servidor para ahorrar recursos de red.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // 1. Guardias de validación básica del lado del cliente
    if (!formData.name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (formData.age && parseInt(formData.age, 10) < 18) {
      setError("Debes ser mayor de 18 años para poder registrarte");
      return;
    }

    setLoading(true);

    try {
      // Petición de registro al servidor Express
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: formData.age ? parseInt(formData.age, 10) : null,
        municipio: formData.municipio,
        barrio: formData.barrio,
        role: formData.role
      });
      
      setSuccess(true);
      
      // Temporizador pedagógico: Espera 2 segundos mostrando un mensaje verde de éxito
      // y luego redirige a la pantalla de Login.
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Ocurrió un error al registrar el usuario. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejador de cambio genérico para actualizar el estado del formulario de forma limpia
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-manta py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-barro">Crea tu Cuenta</h2>
          <p className="text-gray-600 mt-2">Únete a nuestra comunidad de arte textil</p>
        </div>

        {/* Alerta de error */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Alerta de éxito */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md flex items-start gap-3 shadow-sm">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm font-medium">¡Registro exitoso! Redirigiendo a inicio de sesión...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar / Foto de Perfil maqueta */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <label className="absolute bottom-0 right-0 bg-barro text-white p-1.5 rounded-full cursor-pointer hover:bg-[#1a1a1a] transition-colors">
                <input type="file" className="hidden" accept="image/*" />
                <Camera className="w-4 h-4" />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            {/* Campo: Nombre Completo */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                placeholder="Nombre Completo" 
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grana focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Campo: Edad */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="number" 
                name="age"
                required
                min="18"
                value={formData.age}
                placeholder="Edad" 
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grana focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Campo: Correo Electrónico */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                placeholder="Correo Electrónico" 
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grana focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Campo: Contraseña */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                name="password"
                required
                value={formData.password}
                placeholder="Contraseña" 
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grana focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Campo: Rol de Cuenta (Cliente vs Artesano) */}
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grana focus:border-transparent outline-none bg-white text-gray-700 transition-all cursor-pointer"
              >
                <option value="client">Registrarse como Cliente / Comprador</option>
                <option value="artisan">Registrarse como Artesano / Vendedor</option>
              </select>
            </div>

            {/* Seccional de Dirección o procedencia regional de Oaxaca */}
            <div className="pt-2">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-grana" /> Dirección (Valles Centrales)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  name="municipio"
                  required
                  value={formData.municipio}
                  placeholder="Municipio" 
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grana focus:border-transparent outline-none transition-all"
                />
                <input 
                  type="text" 
                  name="barrio"
                  required
                  value={formData.barrio}
                  placeholder="Barrio/Sección" 
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-grana focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-grana text-white py-3 rounded-lg font-medium hover:bg-grana-dark transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Procesando...
              </>
            ) : (
              "Registrarse"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <button 
            onClick={() => navigate('/login')} 
            className="text-grana font-semibold hover:underline"
          >
            Inicia Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
