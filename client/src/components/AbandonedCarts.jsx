import React, { useState, useEffect } from 'react';
import { ShoppingCart, TrendingDown, Loader, AlertCircle } from 'lucide-react';
import { apiFetch } from '../services/api';

/**
 * Componente AbandonedCarts (Monitoreo de Carritos Abandonados).
 * 
 * Widget para el panel de administración (AdminDashboard) que cumple con la Historia de Usuario HU-10.
 * Obtiene y visualiza métricas agregadas directamente desde el servidor acerca de los carritos de compras
 * activos o inactivos que aún no se han procesado como órdenes de compra.
 * 
 * Conceptos clave:
 * 1. Petición segura mediante `apiFetch` al endpoint administrativo `/api/admin/abandoned-carts`.
 * 2. Visualización agregada del total de carritos guardados, el valor monetario estimado retenido 
 *    y la tasa de conversión/recuperación del e-commerce.
 */
function AbandonedCarts() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiFetch("/api/admin/abandoned-carts");
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener estadísticas de carritos abandonados:", err);
        setError("No se pudieron cargar las estadísticas reales de carritos abandonados.");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-100 flex items-center justify-center gap-2 text-barro font-medium">
        <Loader className="w-5 h-5 animate-spin text-grana" />
        <span>Cargando estadísticas reales...</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start gap-3 shadow-sm max-w-xl mx-auto mt-6">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <span className="text-sm font-medium">{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="border-b border-gray-100 pb-6 mb-6">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Monitoreo de Carritos Abandonados (Real BD)</h2>
        <p className="text-gray-500 mt-1">Mide la efectividad de la plataforma y el interés real de los compradores con datos reales.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex items-center gap-4">
          <div className="p-4 bg-white rounded-full text-red-500 shadow-sm">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-800">Carritos Guardados (24h)</p>
            <p className="text-3xl font-bold text-red-900">{stats.abandoned24h}</p>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-center gap-4">
          <div className="p-4 bg-white rounded-full text-blue-500 shadow-sm">
            <TrendingDown className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">Valor Estimado Guardado</p>
            <p className="text-3xl font-bold text-blue-900">${stats.totalValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex items-center gap-4">
          <div className="p-4 bg-white rounded-full text-green-500 shadow-sm">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-800">Tasa de Conversión</p>
            <p className="text-3xl font-bold text-green-900">{stats.recoveryRate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AbandonedCarts;
