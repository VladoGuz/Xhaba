import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

/**
 * Componente InventoryList (Inventario del Artesano).
 * 
 * Cumple con la Historia de Usuario HU-06. Proporciona a los maestros artesanos
 * una vista de tabla interactiva para administrar existencias (stock) de sus variantes de productos.
 * 
 * Características clave:
 * 1. Recupera el `artisan_id` del usuario logueado en el frontend.
 * 2. Carga todas las prendas vinculadas a dicho artesano desde `/api/artisans/:id/products`.
 * 3. Permite edición rápida "in-line" de existencias mediante entradas numéricas en cada celda.
 * 4. Envía actualizaciones inmediatas al backend por medio de una petición PUT a `/api/artisans/variants/:variant_id/stock`.
 */
function InventoryList() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar inventario del artesano logueado
  useEffect(() => {
    const fetchInventory = async () => {
      if (!user || !user.artisan_id) {
        setError("No tienes un perfil de artesano vinculado a esta cuenta.");
        setLoading(false);
        return;
      }

      try {
        const data = await apiFetch(`/api/artisans/${user.artisan_id}/products`);
        setInventory(data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener inventario del artesano:", err);
        setError("Ocurrió un error al cargar tu inventario.");
        setLoading(false);
      }
    };

    fetchInventory();
  }, [user]);

  const handleStockChange = (variantId, newStock) => {
    setInventory(inventory.map(item => 
      item.variant_id === variantId ? { ...item, stock: Number(newStock) } : item
    ));
  };

  const handleSave = async (item) => {
    try {
      const result = await apiFetch(`/api/artisans/variants/${item.variant_id}/stock`, {
        method: "PUT",
        body: JSON.stringify({ stock: item.stock })
      });
      alert(result.message);
    } catch (err) {
      console.error("Error al actualizar stock de variante:", err);
      alert(err.message || "No se pudo guardar el stock.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-100 flex items-center justify-center gap-2 text-barro font-medium">
        <Loader className="w-5 h-5 animate-spin text-grana" />
        <span>Cargando tu inventario...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start gap-3 shadow-sm max-w-xl mx-auto mt-6">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <span className="text-sm font-medium">{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Mi Inventario (Real-time BD)</h2>
        <p className="text-gray-500 mt-1">Actualiza rápidamente tu disponibilidad si vendes físicamente.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-4 font-medium">Prenda</th>
              <th className="p-4 font-medium">Variante (Color / Talla)</th>
              <th className="p-4 font-medium">Precio</th>
              <th className="p-4 font-medium">Stock Actual</th>
              <th className="p-4 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventory.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">Aún no has registrado ninguna prenda en tu catálogo.</td>
              </tr>
            ) : (
              inventory.map((item) => (
                <tr key={item.variant_id || item.product_id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{item.title}</td>
                  <td className="p-4 text-gray-600">
                    {item.color || "Liso"} / {item.size || "Única"}
                  </td>
                  <td className="p-4 text-gray-600">${item.base_price}</td>
                  <td className="p-4">
                    <input 
                      type="number" 
                      value={item.stock || 0} 
                      onChange={(e) => handleStockChange(item.variant_id, e.target.value)}
                      className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-barro outline-none"
                      min="0"
                    />
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleSave(item)}
                      className="flex items-center gap-1 text-sm text-white bg-green-600 px-3 py-1.5 rounded hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" /> Guardar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryList;
