import React, { useState, useEffect } from 'react';
import { EyeOff, Eye, AlertCircle, Loader } from 'lucide-react';
import { apiFetch } from '../services/api';

function ProductModeration() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos de la base de datos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiFetch("/api/admin/products");
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener productos en panel administrador:", err);
        setError("No se pudieron cargar los productos de la base de datos.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const result = await apiFetch(`/api/admin/products/${id}/toggle-hide`, {
        method: "POST"
      });

      // Actualizar estado local
      setProducts(products.map(p => 
        p.product_id === id ? { ...p, is_hidden: result.is_hidden } : p
      ));

      alert(result.message);
    } catch (err) {
      console.error("Error al cambiar visibilidad de prenda:", err);
      alert(err.message || "No se pudo actualizar el estado del producto.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-100 flex items-center justify-center gap-2 text-barro font-medium">
        <Loader className="w-5 h-5 animate-spin text-grana" />
        <span>Cargando lista de prendas...</span>
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
        <h2 className="text-2xl font-serif font-bold text-gray-900">Moderación de Productos (Real-time BD)</h2>
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
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">No hay productos registrados en el sistema.</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.product_id} className={`transition-colors ${p.is_hidden ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}>
                  <td className="p-4 font-medium text-gray-900">{p.title}</td>
                  <td className="p-4 text-gray-600">{p.artisan_name}</td>
                  <td className="p-4 text-gray-600">{p.category}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${!p.is_hidden ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {!p.is_hidden ? 'Público' : 'Oculto'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleStatus(p.product_id)}
                      className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded font-medium transition-colors ${!p.is_hidden ? 'text-white bg-red-600 hover:bg-red-700' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}`}
                    >
                      {!p.is_hidden ? <><EyeOff className="w-4 h-4" /> Dar de baja</> : <><Eye className="w-4 h-4" /> Reactivar</>}
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

export default ProductModeration;
