import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Mail, Lock, User, MapPin, Calendar } from 'lucide-react';

/**
 * Componente Register (Historia de Usuario HU-01)
 * Permite a los compradores registrarse en la plataforma ingresando:
 * Nombre, edad, dirección (específica de Valles Centrales) y foto de perfil.
 */
function Register() {
  const navigate = useNavigate();
  
  // Estado local para guardar los datos del formulario
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    password: '',
    municipio: '',
    barrio: '',
  });

  /**
   * Maneja el envío del formulario.
   * Aquí se simularía la petición al backend para:
   * 1. Validar que el correo no exista.
   * 2. Encriptar la contraseña con bcrypt.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Usuario registrado exitosamente (Simulación HU-01)');
    navigate('/'); // Redirige a la página principal tras el registro
  };

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Foto de Perfil */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <label className="absolute bottom-0 right-0 bg-barro text-white p-1.5 rounded-full cursor-pointer hover:bg-[#8B3A2F] transition-colors">
                <input type="file" className="hidden" accept="image/*" />
                <Camera className="w-4 h-4" />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                name="name"
                required
                placeholder="Nombre Completo" 
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="number" 
                name="age"
                required
                min="18"
                placeholder="Edad" 
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                name="email"
                required
                placeholder="Correo Electrónico" 
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                name="password"
                required
                placeholder="Contraseña" 
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none"
              />
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Dirección (Valles Centrales)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  name="municipio"
                  required
                  placeholder="Municipio" 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none"
                />
                <input 
                  type="text" 
                  name="barrio"
                  required
                  placeholder="Barrio/Sección" 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-barro text-white py-3 rounded-lg font-medium hover:bg-[#8B3A2F] transition-colors shadow-sm"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
