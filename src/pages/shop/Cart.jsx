import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

/**
 * Componente Cart (Historia de Usuario HU-03)
 * Muestra los artículos seleccionados por el cliente.
 * Se apoya en CartContext para preservar los datos incluso si el usuario
 * cierra la pestaña, simulando la persistencia en base de datos.
 */
function Cart() {
  const { cartItems, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-manta py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <ShoppingBag className="w-8 h-8 text-barro" />
          <h2 className="text-3xl font-serif font-bold text-barro">Tu Bolsa de Compras</h2>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">Aún no tienes prendas en tu bolsa.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 bg-barro text-white px-6 py-2 rounded-lg hover:bg-[#8B3A2F] transition-colors"
            >
              Explorar Catálogo
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <li key={item.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <div>
                      <h3 className="font-medium text-lg text-gray-900">{item.title}</h3>
                      <p className="text-gray-500">Cantidad: {item.quantity}</p>
                      <p className="text-barro font-semibold">${item.price}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Eliminar del carrito"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="bg-gray-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xl font-medium text-gray-900">
                Total: <span className="font-bold text-barro">${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full sm:w-auto bg-barro text-white px-8 py-3 rounded-lg font-medium hover:bg-[#8B3A2F] transition-colors shadow-sm"
              >
                Proceder al Pago
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
