import React from 'react';

const ProductCard = ({ title, price, artisan, image, isUnique }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md border border-barro/10 overflow-hidden transition-all hover:-translate-y-1 group">
      {/* Contenedor de Imagen */}
      <div className="relative h-72 overflow-hidden bg-gray-100">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        {isUnique && (
          <span className="absolute top-3 left-3 bg-grana text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
            Pieza Única
          </span>
        )}
      </div>

      {/* Información de la prenda */}
      <div className="p-5">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
          Artesano: {artisan}
        </p>
        <h3 className="font-serif text-lg font-bold text-barro leading-tight mb-2">
          {title}
        </h3>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-barro-dark">
            ${price} MXN
          </span>
          <button className="bg-manta border-2 border-barro text-barro hover:bg-barro hover:text-white px-4 py-2 rounded font-semibold transition-colors">
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;