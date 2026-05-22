import React, { useState } from 'react';
import ProductForm from '../components/ProductForm';
import InventoryList from '../components/InventoryList';
import Reputation from '../components/Reputation';

/**
 * Componente ArtisanDashboard (Panel de Artesano)
 * Integra las historias de usuario del rol Vendedor:
 * - HU-05: Subir Prenda (ProductForm)
 * - HU-06: Mi Inventario (InventoryList)
 * - HU-07: Reputación (Reputation)
 */
function ArtisanDashboard() {
  // Estado para manejar la navegación entre pestañas
  const [activeTab, setActiveTab] = useState('inventory'); // inventory | new | reputation

  return (
    <div className="min-h-screen bg-manta py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-barro mb-8">Panel de Artesano</h1>
        
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
