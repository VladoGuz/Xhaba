import React, { useState } from 'react';
import ProductForm from '../components/ProductForm';
import InventoryList from '../components/InventoryList';
import Reputation from '../components/Reputation';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

/**
 * Componente ArtisanDashboard (Panel de Artesano)
 * Integra las historias de usuario del rol Vendedor:
 * - HU-05: Subir Prenda (ProductForm)
 * - HU-06: Mi Inventario (InventoryList)
 * - HU-07: Reputación (Reputation)
 */
function ArtisanDashboard() {
  const { logout } = useAuth();
  // Estado para manejar la navegación entre pestañas
  const [activeTab, setActiveTab] = useState('inventory'); // inventory | new | reputation

  return (
    <div className="min-h-screen bg-manta py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-barro">Panel de Artesano</h1>
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
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 font-medium transition-colors ${activeTab === 'inventory' ? 'text-barro border-b-2 border-barro' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Mi Inventario
          </button>
          <button 
            onClick={() => setActiveTab('new')}
            className={`pb-3 font-medium transition-colors ${activeTab === 'new' ? 'text-barro border-b-2 border-barro' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Subir Prenda
          </button>
          <button 
            onClick={() => setActiveTab('reputation')}
            className={`pb-3 font-medium transition-colors ${activeTab === 'reputation' ? 'text-barro border-b-2 border-barro' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Reputación
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'inventory' && <InventoryList />}
          {activeTab === 'new' && <ProductForm />}
          {activeTab === 'reputation' && <Reputation />}
        </div>
      </div>
    </div>
  );
}

export default ArtisanDashboard;
