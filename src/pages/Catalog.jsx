import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, RotateCcw, Tag, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/product.service';

function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamQuery = searchParams.get('search') || '';

  // Estados de datos
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de filtros
  const [searchQuery, setSearchQuery] = useState(searchParamQuery);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTechnique, setSelectedTechnique] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('title-asc');

  // Sincronizar el input con la URL de búsqueda
  useEffect(() => {
    setSearchQuery(searchParamQuery);
  }, [searchParamQuery]);

  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProductsWithVariants();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar productos en catálogo:", err);
        setError("Ocurrió un error al cargar el catálogo de textiles. Inténtalo de nuevo.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Extraer valores únicos dinámicos para filtros
  const categories = [...new Set(products.map(p => p.category))].filter(Boolean);
  const techniques = [...new Set(products.map(p => p.technique))].filter(Boolean);

  // Limpiar filtros
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTechnique('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('title-asc');
    setSearchParams({});
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    // Filtro por texto (título, descripción o artesano)
    const matchesSearch = 
      !searchQuery || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      product.artisan_name.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtro por Categoría
    const matchesCategory = !selectedCategory || product.category === selectedCategory;

    // Filtro por Técnica
    const matchesTechnique = !selectedTechnique || product.technique === selectedTechnique;

    // Filtro por Precio Mínimo
    const priceNum = parseFloat(product.base_price);
    const matchesMinPrice = !minPrice || priceNum >= parseFloat(minPrice);

    // Filtro por Precio Máximo
    const matchesMaxPrice = !maxPrice || priceNum <= parseFloat(maxPrice);

    return matchesSearch && matchesCategory && matchesTechnique && matchesMinPrice && matchesMaxPrice;
  });

  // Ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseFloat(a.base_price);
    const priceB = parseFloat(b.base_price);

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
    if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
    return 0;
  });

  return (
    <main className="min-h-screen bg-manta py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Banner de Categoría y Bienvenida */}
        <section className="bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-500 rounded-3xl p-8 md:p-12 shadow-lg mb-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -translate-y-12 translate-x-12 animate-pulse"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full w-fit text-sm font-semibold tracking-wider">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow" />
                <span>EXPRESIONES TEXTILES DE OAXACA</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight mb-4">
                El Esplendor del Telar y la Aguja
              </h1>
              <p className="text-white/95 max-w-xl font-medium">
                Explora lienzos vivos confeccionados a mano. Cada prenda es única y refleja la cosmovisión e identidad de los pueblos originarios.
              </p>
            </div>
            <div className="hidden lg:block bg-white/15 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-inner max-w-xs text-center">
              <span className="text-3xl font-black">{products.length}</span>
              <p className="text-xs uppercase font-semibold tracking-wider text-pink-200 mt-1">Obras Registradas en Catálogo</p>
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* BARRA LATERAL DE FILTROS */}
          <aside className="w-full lg:w-72 flex-shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-pink-100/50 self-start">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-lg">
                <SlidersHorizontal className="w-5 h-5 text-fuchsia-500" />
                <span>Filtros</span>
              </div>
              <button 
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-all"
                title="Restablecer filtros"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            </div>

            {/* Búsqueda por Texto */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Búsqueda directa</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ej: Huipil, Bordado..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Categorías */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setSelectedCategory('')}
                  className={`text-left text-sm py-2 px-3 rounded-lg font-medium transition-all ${!selectedCategory ? 'bg-fuchsia-50 text-fuchsia-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Todas las prendas
                </button>
                {categories.map(category => (
                  <button 
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`text-left text-sm py-2 px-3 rounded-lg font-medium transition-all ${selectedCategory === category ? 'bg-fuchsia-50 text-fuchsia-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Técnicas */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Técnica Artesanal</label>
              <select 
                value={selectedTechnique} 
                onChange={(e) => setSelectedTechnique(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white"
              >
                <option value="">Todas las técnicas</option>
                {techniques.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Rango de Precios */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Rango de Precios (MXN)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                />
                <span className="text-gray-400 font-bold">-</span>
                <input 
                  type="number" 
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                />
              </div>
            </div>

            {/* Criterio de Ordenación */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ordenar Por</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white"
              >
                <option value="title-asc">Nombre (A - Z)</option>
                <option value="title-desc">Nombre (Z - A)</option>
                <option value="price-asc">Precio: de Menor a Mayor</option>
                <option value="price-desc">Precio: de Mayor a Menor</option>
              </select>
            </div>
          </aside>

          {/* CUADRICULA DE PRODUCTOS */}
          <section className="flex-grow">
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-gray-100 flex flex-col justify-between p-6">
                    <div className="bg-gray-200 rounded-xl h-56 w-full mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-10 bg-gray-200 rounded-xl w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 p-6 rounded-2xl text-center shadow-sm">
                <p className="font-semibold text-lg mb-2">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 bg-rose-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow hover:bg-rose-700 transition-colors">
                  Reintentar
                </button>
              </div>
            )}

            {!loading && !error && (
              <>
                {/* Contador de resultados */}
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600 font-medium">
                    Mostrando <span className="font-bold text-gray-900">{sortedProducts.length}</span> textiles artesanales
                  </p>
                </div>

                {sortedProducts.length === 0 ? (
                  <div className="bg-white rounded-3xl p-16 text-center border border-pink-100/50 shadow-sm flex flex-col items-center max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-6">
                      <Tag className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-serif font-black text-gray-900 mb-3">No hay coincidencias en el telar</h3>
                    <p className="text-gray-500 font-medium max-w-md mb-8">
                      No encontramos ningún textil que coincida con los criterios de búsqueda o filtros seleccionados. Intenta restablecer los filtros para ver el catálogo completo.
                    </p>
                    <button 
                      onClick={handleResetFilters}
                      className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restablecer Filtros
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedProducts.map((product) => {
                      const isUnique = product.variants && product.variants.some(v => v.stock === 1);
                      return (
                        <ProductCard 
                          key={product.product_id || product.id}
                          id={product.product_id || product.id}
                          title={product.title}
                          price={product.base_price}
                          artisan={`${product.artisan_name} (${product.artisan_community})`}
                          image="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=600&auto=format&fit=crop"
                          isUnique={isUnique}
                        />
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}

export default Catalog;
