import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/product.service';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProductsWithVariants();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("No se pudieron cargar los productos. Inténtalo más tarde.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section animado y femenino */}
      <section className="relative overflow-hidden bg-gradient-to-br from-fuchsia-100 via-pink-100 to-rose-50 animate-gradient-x py-24 px-4 sm:px-6 lg:px-8 shadow-inner">
        {/* Adornos circulares flotantes de fondo */}
        <div className="absolute top-0 left-10 w-48 h-48 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-10 right-20 w-64 h-64 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
        <div className="relative max-w-4xl mx-auto text-center z-10 animate-float" style={{ animationDelay: '1s' }}>
          <h1 className="text-5xl md:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-500 drop-shadow-sm tracking-tight mb-6">
            Riqueza Textil de los Valles Centrales
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-medium max-w-2xl mx-auto bg-white/60 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-white/60">
            Cada hilo cuenta una historia. Explora nuestra colección de prendas elaboradas con técnicas ancestrales zapotecas.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {loading && <div className="text-center text-pink-500 font-medium animate-pulse">Cargando colección...</div>}
        {error && <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => {
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
      </section>
    </main>
  );
}

export default Home;
