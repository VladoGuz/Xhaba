import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-manta border-b-2 border-barro/10 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo / Nombre de la Marca */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <span className="font-serif font-bold text-3xl tracking-wide text-barro">
              Xha<span className="text-grana">ba</span>
            </span>
          </div>

          {/* Menú de Navegación Central */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-barro-dark hover:text-grana font-medium transition-colors">
              Catálogo Ancestral
            </a>
            <a href="#" className="text-barro-dark hover:text-grana font-medium transition-colors">
              Nuestros Artesanos
            </a>
            <a href="#" className="text-barro-dark hover:text-grana font-medium transition-colors">
              Conoce los Valles
            </a>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center space-x-4">
            <button className="text-barro hover:text-grana transition-colors relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-grana text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </button>

            <button className="hidden md:block border-2 border-barro text-barro hover:bg-barro hover:text-white px-5 py-2 rounded font-semibold transition-all">
              Ingresar
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

// ¡ESTA ES LA LÍNEA MÁGICA QUE LE FALTA A TU ARCHIVO!
export default Navbar;