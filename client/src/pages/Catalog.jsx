import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, RotateCcw, Tag, Sparkles, MapPin } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/product.service';

/**
 * Vista del Catálogo General de Textiles (Catalog).
 * 
 * Permite buscar, filtrar y ordenar de manera reactiva la lista completa de prendas de Xhaba:
 * - Filtro de texto por coincidencia en título, descripción o nombre de artesano.
 * - Filtros por categoría y técnicas artesanales extraídas de forma dinámica de los datos del backend.
 * - Filtro numérico por rango de precios.
 * - Ordenación alfabética y por valor monetario.
 * 
 * Implementa sincronización de filtros con los Query Parameters de la URL (useSearchParams).
 */
function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamQuery = searchParams.get('search') || ''; 
  const categoryParamQuery = searchParams.get('category') || '';
  const regionParamQuery = searchParams.get('region') || '';

  // Estados de datos obtenidos del servidor
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados locales para los filtros seleccionados
  const [searchQuery, setSearchQuery] = useState(searchParamQuery);
  const [selectedCategory, setSelectedCategory] = useState(categoryParamQuery);
  const [selectedRegion, setSelectedRegion] = useState(regionParamQuery);
  const [selectedTechnique, setSelectedTechnique] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('title-asc'); // Criterio de orden por defecto: Nombre (A-Z)

  // Efecto: Sincroniza los filtros cuando cambia el Query Parameter en la barra de direcciones
  useEffect(() => {
    setSearchQuery(searchParamQuery);
    setSelectedCategory(categoryParamQuery);
    setSelectedRegion(regionParamQuery);
  }, [searchParamQuery, categoryParamQuery, regionParamQuery]);

  // Carga inicial del catálogo completo
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProductsWithVariants();
        // Filtrar productos agotados para que no se muestren en el catálogo
        const inStockData = data.filter(product => product.variants && product.variants.length > 0 && product.variants.some(v => v.stock > 0));
        setProducts(inStockData);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar productos en catálogo:", err);
        setError("Ocurrió un error al cargar el catálogo de textiles. Inténtalo de nuevo.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Extracción dinámica de categorías y técnicas únicas utilizando 'Set' de JavaScript
  // Evita declarar categorías de forma dura y se adapta automáticamente a lo registrado en la DB
  const excludedCategories = ['Blusas', 'Huipiles', 'Rebozos'];
  const categories = [...new Set(products.map(p => p.category))].filter(c => c && !excludedCategories.includes(c));
  const techniques = [...new Set(products.map(p => p.technique))].filter(Boolean);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedRegion('');
    setSelectedTechnique('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('title-asc');
    setSearchParams({}); // Limpia los parámetros de búsqueda de la URL
  };

  const getRegionFromCommunity = (community) => {
    const c = community.toLowerCase();
    if (c.includes('teotitlán') || c.includes('antonino') || c.includes('bartolo') || c.includes('mitla') || c.includes('ocotlán') || c.includes('oaxaca')) return 'Valles Centrales';
    if (c.includes('juchitán') || c.includes('tehuantepec') || c.includes('mateo')) return 'Istmo';
    if (c.includes('pinotepa') || c.includes('jamiltepec') || c.includes('huatulco')) return 'Costa';
    if (c.includes('tlaxiaco') || c.includes('huajuapan') || c.includes('putla')) return 'Mixteca';
    if (c.includes('tuxtepec') || c.includes('jalapa') || c.includes('valle nacional')) return 'Papaloapan';
    if (c.includes('huautla') || c.includes('magón')) return 'Cañada';
    return 'Otra';
  };

  // Lógica de Filtrado: Computa en caliente (en cada render) el arreglo de prendas filtradas
  const filteredProducts = products.filter(product => {
    // 1. Coincidencia por texto
    const matchesSearch = 
      !searchQuery || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      product.artisan_name.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Coincidencia por Categoría
    const matchesCategory = !selectedCategory || product.category === selectedCategory;

    // 3. Coincidencia por Técnica Artesanal
    const matchesTechnique = !selectedTechnique || product.technique === selectedTechnique;

    // 4. Coincidencia por Rango Mínimo de Precio
    const priceNum = parseFloat(product.base_price);
    const matchesMinPrice = !minPrice || priceNum >= parseFloat(minPrice);

    // 5. Coincidencia por Rango Máximo de Precio
    const matchesMaxPrice = !maxPrice || priceNum <= parseFloat(maxPrice);

    // 6. Coincidencia por Región
    const region = getRegionFromCommunity(product.artisan_community);
    const matchesRegion = !selectedRegion || region === selectedRegion;

    return matchesSearch && matchesCategory && matchesTechnique && matchesMinPrice && matchesMaxPrice && matchesRegion;
  });

  // Lógica de Ordenación: Aplica sort() sobre el arreglo previamente filtrado
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
        
        {/* Banner Ilustrativo y Estadísticas */}
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
          </div>
        </section>

        {/* Categorías Visuales */}
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-black text-gray-900 mb-6 flex items-center gap-2">
            <Tag className="w-6 h-6 text-fuchsia-500" /> Explorar por Colección
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'huipiles', name: 'Huipiles', img: '/images/huipil.png' },
              { id: 'blusas', name: 'Blusas', img: '/images/blusa.png' },
              { id: 'guayaberas', name: 'Guayaberas', img: '/images/guayabera.png' },
              { id: 'manteleria', name: 'Mantelería', img: '/images/manteleria.png' }
            ].map(cat => (
              <div 
                key={cat.name}
                onClick={() => { setSelectedCategory(cat.name); setSearchParams({ category: cat.name }); }}
                className="relative h-32 md:h-40 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
              >
                <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-white font-bold text-lg">{cat.name}</h3>
              </div>
            ))}
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

            {/* Buscador de texto libre */}
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

            {/* Selector de Categorías (Botones interactivos con estilo de pestaña) */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
              <div className="flex flex-col gap-2">
                {categories.map(category => (
                  <button 
                    key={category}
                    onClick={() => { const next = new URLSearchParams(searchParams); next.set('category', category); setSearchParams(next); }}
                    className={`text-left text-sm py-2 px-3 rounded-lg font-medium transition-all ${selectedCategory === category ? 'bg-fuchsia-50 text-fuchsia-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Regiones */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-fuchsia-400" />
                Región
              </label>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => { const next = new URLSearchParams(searchParams); next.delete('region'); setSearchParams(next); }}
                  className={`text-left text-sm py-2 px-3 rounded-lg font-medium transition-all ${!selectedRegion ? 'bg-fuchsia-50 text-fuchsia-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Todas las regiones
                </button>
                {['Valles Centrales', 'Istmo', 'Costa', 'Mixteca', 'Papaloapan', 'Cañada'].map(region => (
                  <button 
                    key={region}
                    onClick={() => { const next = new URLSearchParams(searchParams); next.set('region', region); setSearchParams(next); }}
                    className={`text-left text-sm py-2 px-3 rounded-lg font-medium transition-all ${selectedRegion === region ? 'bg-fuchsia-50 text-fuchsia-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Técnicas (Dropdown) */}
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

            {/* Orden de clasificación */}
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

          {/* CUADRÍCULA DE PRODUCTOS RESULTANTES */}
          <section className="flex-grow">
            {loading && (
              /* Skeletons animados durante la consulta a la base de datos */
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


                {sortedProducts.length === 0 ? (
                  /* Vista vacía (No results fallback) */
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
                  /* Grid de Cards Agrupadas por Región */
                  <div className="space-y-16">
                    {['Valles Centrales', 'Istmo', 'Costa', 'Mixteca', 'Papaloapan', 'Cañada', 'Otra'].map(regionGroup => {
                      const regionProducts = sortedProducts.filter(p => getRegionFromCommunity(p.artisan_community) === regionGroup);
                      
                      if (regionProducts.length === 0) return null;

                      return (
                        <div key={regionGroup}>
                          <div className="flex items-center gap-4 mb-6">
                            <h2 className="text-3xl font-serif font-black text-gray-900">{regionGroup}</h2>
                            <div className="h-px bg-gray-200 flex-grow mt-2"></div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {regionProducts.map((product) => {
                              // Determina si es una pieza única (stock: 1)
                              const isUnique = product.variants && product.variants.some(v => v.stock === 1);
                              // Obtener la primera variante con stock disponible para el checkout
                              const firstAvailableVariant = product.variants && product.variants.find(v => v.stock > 0);
                              return (
                                <ProductCard 
                                  key={product.product_id || product.id}
                                  id={product.product_id || product.id}
                                  title={product.title}
                                  price={product.base_price}
                                  artisan={`${product.artisan_name} (${product.artisan_community})`}
                                  // Fallback de imagen primaria si no existe
                                  image={product.images && product.images[0] ? product.images[0] : 'valles1.jpg'}
                                  isUnique={isUnique}
                                  variantId={firstAvailableVariant ? firstAvailableVariant.variant_id : null}
                                  stock={firstAvailableVariant ? firstAvailableVariant.stock : 0}
                                />
                              );
                            })}
                          </div>
                        </div>
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
