import React, { useState } from 'react';
import { Save } from 'lucide-react';

function InventoryList() {
  const [inventory, setInventory] = useState([
    { id: 1, title: 'Huipil "Hazme si puedes"', stock: 2, price: 2450 },
    { id: 2, title: 'Blusa de Manta con Grecas', stock: 5, price: 850 },
  ]);

  const handleStockChange = (id, newStock) => {
    setInventory(inventory.map(item => item.id === id ? { ...item, stock: Number(newStock) } : item));
  };

  const handleSave = (id) => {
    alert(`Stock actualizado para el producto ID: ${id}. (Simulación de middleware validando pertenencia - HU-06)`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Mi Inventario</h2>
        <p className="text-gray-500 mt-1">Actualiza rápidamente tu disponibilidad si vendes físicamente.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-4 font-medium">Prenda</th>
              <th className="p-4 font-medium">Precio</th>
              <th className="p-4 font-medium">Stock Actual</th>
              <th className="p-4 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{item.title}</td>
                <td className="p-4 text-gray-600">${item.price}</td>
                <td className="p-4">
                  <input 
                    type="number" 
                    value={item.stock} 
                    onChange={(e) => handleStockChange(item.id, e.target.value)}
                    className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-barro outline-none"
                    min="0"
                  />
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => handleSave(item.id)}
                    className="flex items-center gap-1 text-sm text-white bg-green-600 px-3 py-1.5 rounded hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" /> Guardar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryList;
