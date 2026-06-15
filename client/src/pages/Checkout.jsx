import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

/**
 * Vista de Checkout/Pago de Compras (Checkout) - Historia de Usuario HU-02.
 * 
 * Simula una pasarela de pago que invoca al endpoint transaccional del backend.
 * Demuestra de forma didáctica la protección contra concurrencia:
 * - Envía los artículos del carrito (`cartItems`) al servidor.
 * - Si el servidor detecta stock suficiente, disminuye el inventario y retorna éxito.
 * - Si otra petición paralela agota la prenda antes, el servidor retorna HTTP 409 Conflict.
 * - El frontend captura dicho error y notifica del conflicto transaccional (Rollback).
 */
function Checkout() {
  const { cartItems, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Manejo de estados de la transacción:
  // 'idle' (esperando acción), 'loading' (procesando compra), 'success' (compra confirmada), 'error' (sobreventa/fallo)
  const [status, setStatus] = useState('idle'); 
  const [errorMessage, setErrorMessage] = useState('');

  // Direcciones
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await apiFetch('/api/auth/addresses');
        setAddresses(data.addresses || []);
      } catch (err) {
        console.error('Error al cargar direcciones:', err);
      }
    };
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const addressOptions = [];
  const defaultAddrStr = [user?.barrio, user?.municipio, user?.estado].filter(Boolean).join(', ');
  if (defaultAddrStr) {
    addressOptions.push({ id: 'default', label: 'Registro: ' + defaultAddrStr, value: defaultAddrStr });
  }
  addresses.forEach(a => {
    const addrStr = [a.barrio, a.municipio, a.estado].filter(Boolean).join(', ');
    if (addrStr) {
      addressOptions.push({ id: a.id, label: `${a.label}: ${addrStr}`, value: addrStr });
    }
  });

  // Establecer dirección seleccionada por defecto
  useEffect(() => {
    if (!selectedAddress && addressOptions.length > 0) {
      setSelectedAddress(addressOptions[0].value);
    }
  }, [addressOptions, selectedAddress]);

  /**
   * Envía la solicitud de checkout al backend envuelta en la pasarela de pago.
   */
  const handlePayment = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      // Petición al endpoint transaccional del backend
      await apiFetch("/api/orders/checkout", {
        method: "POST",
        body: JSON.stringify({
          cartItems,
          shippingAddress: selectedAddress || "Valles Centrales, Oaxaca, México"
        })
      });

      setStatus('success');
      clearCart(); // Limpia la bolsa local de compras tras el éxito de pago
    } catch (err) {
      console.error("Error al procesar checkout real en base de datos:", err);
      // Captura el mensaje específico de stock insuficiente o conflicto arrojado por el backend
      setErrorMessage(err.message || "Lo sentimos, ocurrió un conflicto de inventario al procesar tu compra.");
      setStatus('error');
    }
  };

  // Validación: Si no hay artículos y no se ha procesado compra, redirecciona
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
        
        {/* Desglose total de pago */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-center text-lg">Total a pagar: <strong className="text-xl text-barro">${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong></p>
        </div>

        {/* Flujo Exitoso */}
        {status === 'success' && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-700">¡Pago Exitoso!</h3>
            <p className="mt-2 text-gray-600">El stock se ha reducido correctamente y tu pedido está registrado en la base de datos.</p>
            <button onClick={() => navigate('/')} className="mt-6 text-barro underline">Volver al inicio</button>
          </div>
        )}

        {/* Flujo de Error por Concurrencia (Rollback) */}
        {status === 'error' && (
          <div className="text-center py-8">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-red-700">Conflicto de Inventario</h3>
            <p className="mt-2 text-gray-600">{errorMessage}</p>
            <p className="text-xs text-gray-400 mt-4">Un rollback transaccional se ha ejecutado de manera segura en la base de datos.</p>
            <button onClick={() => setStatus('idle')} className="mt-6 bg-gray-200 px-6 py-2 rounded hover:bg-gray-300">Reintentar</button>
          </div>
        )}

        {/* Selección de Dirección de Envío y Formulario de Pago */}
        {(status === 'idle' || status === 'loading') && (
          <>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2"><MapPin className="w-5 h-5 text-barro" /> Dirección de Envío</h3>
              {addressOptions.length > 0 ? (
                <div className="relative">
                  <select 
                    value={selectedAddress} 
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none text-gray-700 bg-gray-50 focus:bg-white focus:border-barro transition-colors appearance-none"
                    disabled={status === 'loading'}
                  >
                    {addressOptions.map(opt => (
                      <option key={opt.id} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              ) : (
                <div className="text-amber-700 text-sm p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500" />
                  <p>No tienes una dirección completa registrada en tu perfil ni direcciones adicionales. El envío se mandará por defecto a Oaxaca.</p>
                </div>
              )}
            </div>

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
          </>
        )}
      </div>
    </div>
  );
}

export default Checkout;
