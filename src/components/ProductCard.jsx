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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-64">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        {isUnique && (
          <span className="absolute top-4 right-4 bg-barro text-white text-xs font-bold px-3 py-1 rounded-full">
            Pieza Única
          </span>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-gray-500 mb-4">
          Por: <Link to={`/artisan/${id}`} className="text-barro hover:underline">{artisan}</Link>
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ${price}
          </span>
          <button 
            onClick={handleBuyClick}
            className="flex items-center gap-2 bg-barro text-white px-4 py-2 rounded-lg hover:bg-[#8B3A2F] transition-colors"
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
