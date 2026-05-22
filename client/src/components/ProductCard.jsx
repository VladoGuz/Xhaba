import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function ProductCard({ id, title, price, artisan, image, isUnique }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBuyClick = () => {
    if (!user || user.role !== 'client') {
      alert('Debes iniciar sesión como cliente para poder comprar.');
      navigate('/login');
      return;
    }
    addToCart({ id, title, price, artisan, image, isUnique });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-pink-100/50 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
      <Link to={`/product/${id}`} className="relative h-64 overflow-hidden block">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {isUnique && (
          <span className="absolute top-4 right-4 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md animate-pulse">
            Pieza Única
          </span>
        )}
      </Link>
      
      <div className="p-6 bg-gradient-to-b from-white to-pink-50/30">
        <Link to={`/product/${id}`}>
          <h3 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-fuchsia-600 transition-colors">
            {title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 mb-4">
          Por: <span className="text-rose-500 font-medium">{artisan}</span>
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-pink-100">
          <span className="text-2xl font-black text-gray-900">
            ${price}
          </span>
          <button 
            onClick={handleBuyClick}
            className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
