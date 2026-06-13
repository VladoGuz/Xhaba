import React, { useState, useEffect, useRef } from 'react';
import { Save, AlertCircle, Loader, Image as ImageIcon, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

/**
 * Componente InventoryList (Inventario del Artesano).
 */
function InventoryList() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);
  const [uploadingImageId, setUploadingImageId] = useState(null);

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

  useEffect(() => {
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

  const handleImageClick = (productId) => {
    setUploadingImageId(productId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !uploadingImageId) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe pesar más de 5MB");
      return;
    }

    try {
      const payload = new FormData();
      payload.append('image', file);

      await apiFetch(`/api/products/${uploadingImageId}/image`, {
        method: "PUT",
        body: payload
      });

      alert("Imagen actualizada correctamente");
      // Refrescar inventario si es necesario (el endpoint actual de artesanos devuelve variantes, quizá no imágenes directamente, pero es buena práctica)
      fetchInventory();
    } catch (err) {
      console.error("Error al actualizar imagen:", err);
      alert(err.message || "Ocurrió un error al actualizar la imagen.");
    } finally {
      setUploadingImageId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
        <p className="text-gray-500 mt-1">Actualiza rápidamente tu disponibilidad y fotos si vendes físicamente.</p>
      </div>

      <input 
        type="file" 
        accept="image/jpeg, image/png, image/webp"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-4 font-medium">Prenda</th>
              <th className="p-4 font-medium">Variante (Color / Talla)</th>
              <th className="p-4 font-medium">Precio</th>
              <th className="p-4 font-medium">Stock Actual</th>
              <th className="p-4 font-medium">Foto</th>
              <th className="p-4 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventory.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500 font-medium">Aún no has registrado ninguna prenda en tu catálogo.</td>
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
                      onClick={() => handleImageClick(item.product_id)}
                      className="flex items-center gap-1 text-sm text-fuchsia-600 hover:text-fuchsia-800 transition-colors font-medium"
                      title="Cambiar foto de la prenda"
                    >
                      <ImageIcon className="w-4 h-4" /> 
                      {uploadingImageId === item.product_id ? <Loader className="w-3 h-3 animate-spin" /> : "Cambiar Foto"}
                    </button>
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
