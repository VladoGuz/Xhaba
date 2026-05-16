import React from 'react';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <div className="bg-manta min-h-screen font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-barro text-center">
          Bienvenidos a la riqueza textil de los Valles Centrales
        </h1>
        <p className="text-center mt-4 text-gray-600">
          Explora nuestra colección de prendas únicas y con historia.
        </p>
      </main>
    </div>
  );
}

export default App;