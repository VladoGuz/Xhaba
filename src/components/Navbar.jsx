import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, UserCircle, Shield, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white border-b border-barro/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <Link to="/">
              <span className="font-serif text-3xl font-bold text-barro tracking-tight hover:text-barro-dark transition-colors">
                Xhaba
              </span>
            </Link>
          </div>

          {/* Buscador (Oculto en móvil) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Buscar huipiles, blusas, guayaberas..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-barro/20 focus:border-barro transition-all"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-barro transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Íconos de Navegación */}
          <div className="flex items-center gap-6">
            
            {/* Si no está logueado */}
            {!user && (
              <Link to="/login" className="hidden md:flex flex-col items-center gap-1 text-gray-500 hover:text-barro transition-colors">
                <LogIn className="w-6 h-6" />
                <span className="text-[10px] uppercase font-semibold tracking-wider">Ingresar</span>
              </Link>
            )}

            {/* Si es Artesano */}
            {user?.role === 'artisan' && (
              <Link to="/dashboard" className="hidden md:flex flex-col items-center gap-1 text-gray-500 hover:text-barro transition-colors" title="Artesano">
                <UserCircle className="w-6 h-6" />
                <span className="text-[10px] uppercase font-semibold tracking-wider">Taller</span>
              </Link>
            )}

            {/* Si es Admin */}
            {user?.role === 'admin' && (
              <Link to="/admin" className="hidden md:flex flex-col items-center gap-1 text-gray-500 hover:text-barro transition-colors" title="Admin">
                <Shield className="w-6 h-6" />
                <span className="text-[10px] uppercase font-semibold tracking-wider">Admin</span>
              </Link>
            )}
            
            {/* Si es Cliente */}
            {user?.role === 'client' && (
              <>
                <Link to="/profile" className="hidden md:flex flex-col items-center gap-1 text-gray-500 hover:text-barro transition-colors">
                  <UserCircle className="w-6 h-6" />
                  <span className="text-[10px] uppercase font-semibold tracking-wider">Perfil</span>
                </Link>

                <Link to="/cart" className="relative flex flex-col items-center gap-1 text-gray-500 hover:text-barro transition-colors group">
                  <div className="relative">
                    <ShoppingBag className="w-6 h-6" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] uppercase font-semibold tracking-wider">Bolsa</span>
                </Link>
              </>
            )}

            {/* Menú Hamburguesa (Solo móvil) */}
            <button className="md:hidden p-2 text-gray-500 hover:text-barro transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
