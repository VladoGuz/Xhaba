import React from 'react';
import Navbar from './components/layout/Navbar';
import ProductCard from './components/catalog/ProductCard';
import Footer from './components/layout/Footer'; // <-- 1. Importamos el Footer

function App() {
  return (
    // Usamos flex-col y min-h-screen para que el footer siempre se empuje al fondo
    <div className="bg-manta min-h-screen font-sans flex flex-col justify-between">
      
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-barro">
              Riqueza Textil de los Valles Centrales
            </h1>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
              Cada hilo cuenta una historia. Explora nuestra colección de prendas elaboradas con técnicas ancestrales zapotecas.
            </p>
          </div>

          {/* Cuadrícula de Productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProductCard 
              title='Huipil "Hazme si puedes" Bordado a Mano'
              price="2,450"
              artisan="Familia Mendoza (San Antonino)"
              image="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=600&auto=format&fit=crop"
              isUnique={true}
            />
            <ProductCard 
              title="Blusa de Manta con Grecas de Mitla"
              price="850"
              artisan="Colectivo Xigaga"
              image="https://images.unsplash.com/photo-1583391733958-d25e07fac662?q=80&w=600&auto=format&fit=crop"
              isUnique={false}
            />
            <ProductCard 
              title="Guayabera de Telar de Pedal"
              price="1,200"
              artisan="Taller Los Telares (Mitla)"
              image="https://images.unsplash.com/photo-1596755094514-f87e32f0822d?q=80&w=600&auto=format&fit=crop"
              isUnique={false}
            />
          </div>
        </main>
      </div>

      <Footer /> {/* <-- 2. Colocamos el Footer al final */}
    </div>
  );
}

export default App;