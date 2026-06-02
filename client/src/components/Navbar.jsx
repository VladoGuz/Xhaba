import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, UserCircle, Shield, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/catalog');
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-pink-200/50 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <Link to="/">
              <span className="font-serif text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-500 tracking-tight hover:scale-105 transition-transform inline-block animate-gradient-x">
                Xhaba
              </span>
            </Link>
          </div>

          {/* Buscador (Oculto en móvil) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full group">
              <input 
                type="text" 
                placeholder="Buscar textiles vibrantes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/50 border border-pink-100 rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400 transition-all group-hover:shadow-md"
              />
              <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-pink-500 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Íconos de Navegación */}
          <div className="flex items-center gap-6">
            
            {/* Si no está logueado */}
            {!user && (
              <Link to="/login" className="hidden md:flex flex-col items-center gap-1 text-gray-500 hover:text-fuchsia-500 transition-colors group">
                <LogIn className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase font-semibold tracking-wider group-hover:text-fuchsia-500">Ingresar</span>
              </Link>
            )}

            {/* Si es Artesano */}
            {user?.role === 'artisan' && (
              <Link to="/dashboard" className="hidden md:flex flex-col items-center gap-1 text-gray-500 hover:text-rose-500 transition-colors group" title="Artesano">
                <UserCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase font-semibold tracking-wider">Taller</span>
              </Link>
            )}

            {/* Si es Admin */}
            {user?.role === 'admin' && (
              <Link to="/admin" className="hidden md:flex flex-col items-center gap-1 text-gray-500 hover:text-pink-500 transition-colors group" title="Admin">
                <Shield className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase font-semibold tracking-wider">Admin</span>
              </Link>
            )}
            
            {/* Si es Cliente */}
            {user?.role === 'client' && (
              <>
                <Link to="/profile" className="hidden md:flex flex-col items-center gap-1 text-gray-500 hover:text-fuchsia-500 transition-colors group">
                  <UserCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] uppercase font-semibold tracking-wider">Perfil</span>
                </Link>

                <Link to="/cart" className="relative flex flex-col items-center gap-1 text-gray-500 hover:text-pink-500 transition-colors group">
                  <div className="relative">
                    <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-tr from-fuchsia-500 to-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce-slight">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] uppercase font-semibold tracking-wider">Bolsa</span>
                </Link>
              </>
            )}

            {/* Menú Hamburguesa (Solo móvil) */}
            <button className="md:hidden p-2 text-gray-500 hover:text-pink-500 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
