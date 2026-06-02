import React, { useState } from 'react';
import ProductModeration from '../components/ProductModeration';
import UserModeration from '../components/UserModeration';
import AbandonedCarts from '../components/AbandonedCarts';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

/**
 * Componente AdminDashboard (Panel de Administración)
 * Integra las historias de usuario del rol Moderador:
 * - HU-08: Moderación de Productos (Ocultar prendas irrelevantes)
 * - HU-09: Control de Usuarios (Suspender/Banear cuentas fraudulentas)
 * - HU-10: Carritos Abandonados (Dashboard de métricas)
 */
function AdminDashboard() {
  const { logout } = useAuth();
  // Estado para manejar la navegación entre pestañas
  const [activeTab, setActiveTab] = useState('products'); // products | users | carts

  return (
    <div className="min-h-screen bg-manta py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-barro">Panel de Administración</h1>
          <button 
            onClick={logout}
            className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors shadow-sm text-sm"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('products')}
            className={`pb-3 font-medium transition-colors ${activeTab === 'products' ? 'text-barro border-b-2 border-barro' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Moderación de Productos
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`pb-3 font-medium transition-colors ${activeTab === 'users' ? 'text-barro border-b-2 border-barro' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Control de Usuarios
          </button>
          <button 
            onClick={() => setActiveTab('carts')}
            className={`pb-3 font-medium transition-colors ${activeTab === 'carts' ? 'text-barro border-b-2 border-barro' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Carritos Abandonados
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'products' && <ProductModeration />}
          {activeTab === 'users' && <UserModeration />}
          {activeTab === 'carts' && <AbandonedCarts />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
