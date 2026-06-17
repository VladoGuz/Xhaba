import React, { useState, useEffect } from 'react';
import { Save, X, Loader, AlertCircle } from 'lucide-react';
import { apiFetch } from '../services/api';

function EditProductModal({ productId, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    technique: '',
    material: '',
    base_price: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiFetch(`/api/products/${productId}`);
        setFormData({
          title: data.title || '',
          category: data.category || '',
          technique: data.technique || '',
          material: data.material || '',
          base_price: data.base_price || '',
          description: data.description || ''
        });
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar detalles del producto:", err);
        setError("Ocurrió un error al cargar la información del producto.");
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await apiFetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      onSave(); // Refresca el padre
      onClose(); // Cierra el modal
    } catch (err) {
      console.error("Error al actualizar prenda:", err);
      setError(err.message || "Ocurrió un error al guardar los cambios.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Encabezado */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10 rounded-t-2xl">
          <h2 className="text-2xl font-serif font-bold text-gray-900">Editar Detalles de Prenda</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Loader className="w-8 h-8 animate-spin text-barro mb-4" />
              <p className="font-medium">Cargando información...</p>
            </div>
          ) : (
            <form id="editProductForm" onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start gap-3 shadow-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none bg-white text-gray-700"
                  >
                    <option>Huipiles</option>
                    <option>Blusas</option>
                    <option>Guayaberas</option>
                    <option>Rebozos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio (MXN)</label>
                  <input 
                    required 
                    type="number" 
                    name="base_price" 
                    value={formData.base_price}
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none text-gray-700" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Pieza</label>
                <input 
                  required 
                  type="text" 
                  name="title" 
                  value={formData.title}
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none text-gray-700" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Técnica Artesanal</label>
                  <select 
                    name="technique" 
                    value={formData.technique} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none bg-white text-gray-700"
                  >
                    <option>Bordado a mano</option>
                    <option>Telar de pedal</option>
                    <option>Telar de cintura</option>
                    <option>Brocado</option>
                    <option>Deshilado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material Base</label>
                  <select 
                    name="material" 
                    value={formData.material} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none bg-white text-gray-700"
                  >
                    <option>Manta natural</option>
                    <option>Algodón</option>
                    <option>Lana</option>
                    <option>Seda</option>
                    <option>Lino</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Significado Cultural y Detalles</label>
                <textarea 
                  required 
                  name="description" 
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-[100px] focus:ring-2 focus:ring-barro focus:border-transparent outline-none text-gray-700"
                ></textarea>
              </div>

            </form>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 p-6 flex justify-end gap-3 rounded-b-2xl">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form="editProductForm"
            disabled={loading || saving}
            className="flex items-center gap-2 bg-barro text-white px-6 py-2 rounded-lg font-medium hover:bg-cochinilla transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Guardar Cambios
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditProductModal;
