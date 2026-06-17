import React, { useState, useRef } from 'react';
import { Upload, Tag, Image as ImageIcon, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { apiFetch } from '../services/api';

/**
 * Componente ProductForm (Formulario de Registro de Prendas).
 */
function ProductForm() {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    category: 'Huipiles',
    title: '',
    size_label: 'Unitalla',
    base_price: '',
    stock: '',
    description: '',
    technique: 'Bordado a mano',
    material: 'Manta natural',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (parseFloat(formData.base_price) <= 0 || parseInt(formData.stock, 10) < 0) {
      setError("El precio y el stock deben ser números mayores o iguales a cero.");
      return;
    }

    if (!imageFile) {
      setError("Debes seleccionar una imagen para la prenda.");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('technique', formData.technique);
      payload.append('material', formData.material);
      payload.append('category', formData.category);
      payload.append('base_price', formData.base_price);
      payload.append('stock', formData.stock);
      payload.append('size_label', formData.size_label);
      payload.append('image', imageFile);

      await apiFetch("/api/products", {
        method: "POST",
        body: payload
      });

      setSuccess(true);
      // Resetear campos del formulario
      setFormData({
        category: 'Huipiles',
        title: '',
        size_label: 'Unitalla',
        base_price: '',
        stock: '',
        description: '',
        technique: 'Bordado a mano',
        material: 'Manta natural',
      });
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error al registrar prenda en catálogo:", err);
      setError(err.message || "No se pudo registrar la prenda en la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar 5MB max
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no debe pesar más de 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Registrar Nueva Prenda</h2>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md flex items-start gap-3 shadow-sm">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm font-medium">¡Prenda publicada con éxito en el catálogo real! Podrás verla en el Home y Catálogo.</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none bg-white transition-all text-gray-700"
            >
              <option>Huipiles</option>
              <option>Blusas</option>
              <option>Guayaberas</option>
              <option>Rebozos</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Talla</label>
            <select 
              name="size_label" 
              value={formData.size_label} 
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none bg-white transition-all text-gray-700"
            >
              <option>Unitalla</option>
              <option>Chica</option>
              <option>Mediana</option>
              <option>Grande</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Pieza</label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              required 
              type="text" 
              name="title" 
              value={formData.title}
              placeholder="Ej: Huipil de Gala tradicional"
              onChange={handleChange} 
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none transition-all text-gray-700" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Técnica Artesanal</label>
            <select 
              name="technique" 
              value={formData.technique} 
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none bg-white transition-all text-gray-700"
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
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none bg-white transition-all text-gray-700"
            >
              <option>Manta natural</option>
              <option>Algodón</option>
              <option>Lana</option>
              <option>Seda</option>
              <option>Lino</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio (MXN)</label>
            <input 
              required 
              type="number" 
              name="base_price" 
              value={formData.base_price}
              placeholder="Ej: 1500"
              onChange={handleChange} 
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none transition-all text-gray-700" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Disponible</label>
            <input 
              required 
              type="number" 
              name="stock" 
              value={formData.stock}
              placeholder="Ej: 3"
              onChange={handleChange} 
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none transition-all text-gray-700" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Significado Cultural y Detalles del Bordado</label>
          <textarea 
            required 
            name="description" 
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            placeholder="Explica el significado de las grecas, las flores o la técnica utilizada..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-[100px] focus:ring-2 focus:ring-barro focus:border-transparent outline-none transition-all text-gray-700"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Foto de la Prenda</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <span className="text-xs text-gray-500 block mb-1">Sube una foto desde tu equipo (Máx. 5MB):</span>
              <input 
                type="file" 
                accept="image/jpeg, image/png, image/webp"
                onChange={handleImageChange}
                disabled={loading}
                ref={fileInputRef}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-barro file:text-white hover:file:bg-cochinilla cursor-pointer transition-colors"
              />
            </div>
            <div className="relative h-32 w-full rounded-lg overflow-hidden border border-gray-300 bg-white flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Vista previa de prenda"
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                  <span className="text-xs font-medium">Sin imagen</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full bg-barro text-white py-3 rounded-lg font-medium hover:bg-cochinilla transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Guardando en base de datos...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Publicar Prenda</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
