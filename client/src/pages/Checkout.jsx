import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { apiFetch } from '../services/api';

/**
 * Componente Checkout (Historia de Usuario HU-02)
 * Realiza el proceso de pago y la validación de concurrencia de inventario transaccionalmente.
 * Asegura que si dos clientes compran una pieza única al mismo tiempo, 
 * solo uno tenga éxito y el otro reciba un mensaje de error (Rollback real en BD).
 */
function Checkout() {
  const { cartItems, total, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Estado para manejar el flujo del pago: idle | loading | success | error
  const [status, setStatus] = useState('idle'); 
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Realiza la petición a la pasarela de pago transaccional en el backend.
   */
  const handlePayment = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await apiFetch("/api/orders/checkout", {
        method: "POST",
        body: JSON.stringify({
          cartItems,
          shippingAddress: "Valles Centrales, Oaxaca, México"
        })
      });

      setStatus('success');
      clearCart();
    } catch (err) {
      console.error("Error al procesar checkout real:", err);
      setErrorMessage(err.message || "Lo sentimos, ocurrió un conflicto de inventario al procesar tu compra.");
      setStatus('error');
    }
  };

  if (cartItems.length === 0 && status === 'idle') {
    return (
      <div className="min-h-screen bg-manta flex items-center justify-center">
        <p className="text-gray-500">No hay artículos para pagar.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-manta py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-serif font-bold text-barro mb-6 text-center">Pasarela de Pago (Real BD)</h2>
        
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-center text-lg">Total a pagar: <strong className="text-xl text-barro">${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong></p>
        </div>

        {status === 'success' && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-700">¡Pago Exitoso!</h3>
            <p className="mt-2 text-gray-600">El stock se ha reducido correctamente y tu pedido está registrado en la base de datos.</p>
            <button onClick={() => navigate('/')} className="mt-6 text-barro underline">Volver al inicio</button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-8">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-red-700">Conflicto de Inventario</h3>
            <p className="mt-2 text-gray-600">{errorMessage}</p>
            <p className="text-xs text-gray-400 mt-4">Un rollback transaccional se ha ejecutado de manera segura en la base de datos.</p>
            <button onClick={() => setStatus('idle')} className="mt-6 bg-gray-200 px-6 py-2 rounded hover:bg-gray-300">Reintentar</button>
          </div>
        )}

        {(status === 'idle' || status === 'loading') && (
          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input required type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none text-gray-700" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento</label>
                <input required type="text" placeholder="MM/YY" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                <input required type="text" placeholder="123" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-gray-700" />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full bg-barro text-white py-3 rounded-lg font-medium hover:bg-cochinilla transition-colors shadow-sm disabled:opacity-50"
            >
              {status === 'loading' ? 'Procesando pago en base de datos...' : 'Pagar Ahora'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Checkout;
