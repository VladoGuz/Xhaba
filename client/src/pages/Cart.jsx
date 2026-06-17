import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProductImageUrl } from '../utils/imageHelper';
import { formatMXN } from '../utils/formatCurrency';

/**
 * Vista de la Bolsa de Compras (Cart) - Historia de Usuario HU-03.
 * 
 * Muestra el resumen detallado de los artículos que el cliente ha acumulado en su carrito.
 * Utiliza el `useCart` Hook para:
 * - Leer los artículos del carrito (`cartItems`).
 * - Calcular en caliente el precio total (`total`).
 * - Eliminar elementos (`removeFromCart`).
 * 
 * Resuelve las fotos de los productos de forma dinámica llamando a `getProductImageUrl`.
 */
function Cart() {
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-manta py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabecera decorativa */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <ShoppingBag className="w-8 h-8 text-barro" />
          <h2 className="text-3xl font-serif font-bold text-barro">Tu Bolsa de Compras</h2>
        </div>

        {cartItems.length === 0 ? (
          /* Estado Vacío: Invita a explorar el catálogo */
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">Aún no tienes prendas en tu bolsa.</p>
            <button 
              onClick={() => navigate('/catalog')}
              className="mt-6 bg-barro text-white px-6 py-2 rounded-lg hover:bg-cochinilla transition-colors"
            >
              Explorar Catálogo
            </button>
          </div>
        ) : (
          /* Listado de Artículos del Carrito */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <li key={item.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Renderiza la imagen dinámica empaquetada con enlace */}
                    <Link to={`/product/${item.productId || item.id}`} className="shrink-0">
                      <img 
                        src={getProductImageUrl(item.image)} 
                        alt={item.title} 
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity"
                      />
                    </Link>
                    <div>
                      <Link to={`/product/${item.productId || item.id}`}>
                        <h3 className="font-medium text-lg text-gray-900 hover:text-cempasuchil transition-colors">{item.title}</h3>
                      </Link>
                      <div className="flex items-center gap-3 mt-1 mb-1">
                        <p className="text-gray-500 text-sm">Cantidad:</p>
                        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1 text-gray-500 hover:text-barro disabled:opacity-50 transition-colors font-bold"
                            title="Disminuir cantidad"
                          >
                            -
                          </button>
                          <span className="px-2 font-medium text-gray-900 w-8 text-center text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            disabled={item.stock !== undefined && item.quantity >= item.stock}
                            className="px-3 py-1 text-gray-500 hover:text-barro disabled:opacity-50 transition-colors font-bold"
                            title="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                        {item.stock !== undefined && (
                          <span className="text-xs text-emerald-600 font-medium">({item.stock} disp.)</span>
                        )}
                      </div>
                      <p className="text-barro font-semibold">{formatMXN(item.price)}</p>
                    </div>
                  </div>
                  {/* Eliminar ítem del carrito */}
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
            {/* Pie de bolsa: Total económico y Checkout CTA */}
            <div className="bg-gray-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xl font-medium text-gray-900">
                Total: <span className="font-bold text-barro">{formatMXN(total)}</span>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full sm:w-auto bg-barro text-white px-8 py-3 rounded-lg font-medium hover:bg-cochinilla transition-colors shadow-sm"
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
