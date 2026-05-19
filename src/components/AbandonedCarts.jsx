import React from 'react';
import { ShoppingCart, TrendingDown } from 'lucide-react';

function AbandonedCarts() {
  const stats = {
    abandoned24h: 12,
    totalValue: 15400, // MXN
    recoveryRate: '15%'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="border-b border-gray-100 pb-6 mb-6">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Monitoreo de Carritos Abandonados</h2>
        <p className="text-gray-500 mt-1">Mide la efectividad de la plataforma y el interés real de los compradores (HU-10).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex items-center gap-4">
          <div className="p-4 bg-white rounded-full text-red-500 shadow-sm">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-800">Carritos Abandonados (24h)</p>
            <p className="text-3xl font-bold text-red-900">{stats.abandoned24h}</p>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-center gap-4">
          <div className="p-4 bg-white rounded-full text-blue-500 shadow-sm">
            <TrendingDown className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">Valor Perdido Estimado</p>
            <p className="text-3xl font-bold text-blue-900">${stats.totalValue.toLocaleString('es-MX')}</p>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex items-center gap-4">
          <div className="p-4 bg-white rounded-full text-green-500 shadow-sm">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-800">Tasa de Recuperación</p>
            <p className="text-3xl font-bold text-green-900">{stats.recoveryRate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AbandonedCarts;
