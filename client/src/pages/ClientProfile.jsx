import React, { useState } from 'react';
import { User, MapPin, CreditCard, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function ClientProfile() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('personal');

  return (
    <div className="min-h-screen bg-manta py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Menú Lateral */}
        <div className="w-full md:w-64 bg-white p-6 rounded-xl shadow-sm border border-gray-100 self-start">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="font-serif font-bold text-gray-900">{user?.name}</h3>
            <p className="text-sm text-gray-500 capitalize">Perfil {user?.role}</p>
          </div>
          <div className="space-y-2">
            <button onClick={() => setActiveSection('personal')} className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeSection === 'personal' ? 'bg-barro/10 text-barro' : 'text-gray-600 hover:bg-gray-50'}`}>Datos Personales</button>
            <button onClick={() => setActiveSection('address')} className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeSection === 'address' ? 'bg-barro/10 text-barro' : 'text-gray-600 hover:bg-gray-50'}`}>Direcciones</button>
            <button onClick={() => setActiveSection('payment')} className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeSection === 'payment' ? 'bg-barro/10 text-barro' : 'text-gray-600 hover:bg-gray-50'}`}>Métodos de Pago</button>
            <button onClick={logout} className="w-full text-left px-4 py-2 mt-8 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">Cerrar Sesión</button>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          {activeSection === 'personal' && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2"><User className="w-6 h-6 text-barro" /> Datos Personales</h2>
              <p className="text-gray-500 mb-6">Aquí puedes actualizar tu foto de perfil y tu información básica.</p>
              {/* Formulario mock */}
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border border-dashed border-gray-300">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
                <button className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">Cambiar Foto</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" defaultValue={user?.name} className="px-4 py-2 border rounded-lg w-full" />
                <input type="email" defaultValue="juan@email.com" className="px-4 py-2 border rounded-lg w-full" />
              </div>
            </div>
          )}

          {activeSection === 'address' && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2"><MapPin className="w-6 h-6 text-barro" /> Mis Direcciones</h2>
              <div className="border border-gray-200 p-4 rounded-lg mb-4">
                <p className="font-medium">Casa Principal</p>
                <p className="text-sm text-gray-600">Oaxaca de Juárez, Centro. CP 68000</p>
              </div>
              <button className="text-barro font-medium hover:underline">+ Añadir nueva dirección</button>
            </div>
          )}

          {activeSection === 'payment' && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2"><CreditCard className="w-6 h-6 text-barro" /> Métodos de Pago</h2>
              <div className="border border-gray-200 p-4 rounded-lg mb-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Visa terminada en 4242</p>
                  <p className="text-sm text-gray-600">Expira en 12/28</p>
                </div>
                <button className="text-red-500 hover:text-red-700 text-sm font-medium">Eliminar</button>
              </div>
              <button className="text-barro font-medium hover:underline">+ Añadir nueva tarjeta</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ClientProfile;
