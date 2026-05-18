import React, { useState } from 'react';
import { Upload, Tag, Image as ImageIcon } from 'lucide-react';

function ProductForm() {
  const [formData, setFormData] = useState({
    category: 'Huipiles',
    title: '',
    size: '',
    price: '',
    stock: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Producto registrado exitosamente. (Se asignó automáticamente tu Vendedor_ID simulado) - HU-05');
    // Limpiar formulario...
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Registrar Nueva Prenda</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none"
          >
            <option>Huipiles</option>
            <option>Blusas</option>
            <option>Guayaberas</option>
            <option>Rebozos</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Pieza</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input required type="text" name="title" onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Talla</label>
            <input required type="text" name="size" placeholder="Ej: Unitalla, M, G" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio (MXN)</label>
            <input required type="number" name="price" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Disponible</label>
            <input required type="number" name="stock" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Significado Cultural y Detalles del Bordado</label>
          <textarea 
            required 
            name="description" 
            onChange={handleChange}
            placeholder="Explica el significado de las grecas, las flores o la técnica utilizada..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-[100px]"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fotos de la Prenda</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Haz clic para subir imágenes o arrástralas aquí</p>
          </div>
        </div>

        <button type="submit" className="flex items-center justify-center gap-2 w-full bg-barro text-white py-3 rounded-lg font-medium hover:bg-[#8B3A2F] transition-colors">
          <Upload className="w-5 h-5" />
          Publicar Prenda
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
