import React, { useState } from 'react';
import { EyeOff, Eye } from 'lucide-react';

function ProductModeration() {
  const [products, setProducts] = useState([
    { id: 1, title: 'Huipil "Hazme si puedes"', artisan: 'Familia Mendoza', category: 'Huipiles', status: 'active' },
    { id: 2, title: 'Playera de Fútbol Genérica', artisan: 'Vendedor Externo', category: 'Otros', status: 'active' },
  ]);

  const toggleStatus = (id) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const newStatus = p.status === 'active' ? 'hidden' : 'active';
        alert(`Producto ${newStatus === 'hidden' ? 'dado de baja' : 'reactivado'} exitosamente (HU-08)`);
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Moderación de Productos</h2>
        <p className="text-gray-500 mt-1">Oculta productos que no cumplan con la temática de ropa típica de los Valles Centrales.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-4 font-medium">Producto</th>
              <th className="p-4 font-medium">Artesano</th>
              <th className="p-4 font-medium">Categoría</th>
              <th className="p-4 font-medium">Estado</th>
              <th className="p-4 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className={`transition-colors ${p.status === 'hidden' ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                <td className="p-4 font-medium text-gray-900">{p.title}</td>
                <td className="p-4 text-gray-600">{p.artisan}</td>
                <td className="p-4 text-gray-600">{p.category}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.status === 'active' ? 'Público' : 'Oculto'}
                  </span>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => toggleStatus(p.id)}
                    className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded transition-colors ${p.status === 'active' ? 'text-white bg-red-600 hover:bg-red-700' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}`}
                  >
                    {p.status === 'active' ? <><EyeOff className="w-4 h-4" /> Dar de baja</> : <><Eye className="w-4 h-4" /> Reactivar</>}
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

export default ProductModeration;
