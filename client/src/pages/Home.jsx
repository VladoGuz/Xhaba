import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/product.service';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const data = await productService.getProductsWithVariants();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener productos para Home:", err);
        setError("No pudimos conectar con el telar de productos. Por favor, recarga.");
        setLoading(false);
      }
    };

    fetchHomeProducts();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-barro">
          Riqueza Textil de los Valles Centrales
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
          Cada hilo cuenta una historia. Explora nuestra colección de prendas elaboradas con técnicas ancestrales zapotecas.
        </p>
      </div>

      {loading ? (
        /* Skeletons de Carga Premium */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-pink-50 flex flex-col justify-between p-6">
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
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-pink-100 p-8 shadow-sm">
          <p className="text-red-500 font-semibold text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-grana text-white px-6 py-2 rounded-xl text-sm font-bold shadow hover:bg-grana-dark transition-all"
          >
            Reintentar
          </button>
        </div>
      ) : (
        /* Cuadrícula de Productos Dinámica */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 6).map((product) => {
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
    </main>
  );
}

export default Home;
