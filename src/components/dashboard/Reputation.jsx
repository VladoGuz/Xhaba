import React from 'react';
import { Star, MessageSquare } from 'lucide-react';

function Reputation() {
  const reviews = [
    { id: 1, customer: 'Ana Gómez', rating: 5, comment: 'Hermoso bordado, muy buena calidad y atención excelente.', date: '15 May 2026' },
    { id: 2, customer: 'Luis Pérez', rating: 4, comment: 'La tela es fresca, el envío tardó un poco pero valió la pena.', date: '10 May 2026' },
  ];

  const averageRating = 4.5; // Simulación: AVG de base de datos (HU-07)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="border-b border-gray-100 pb-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">{averageRating}</div>
          <div className="flex text-yellow-400 justify-center">
            <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5" />
          </div>
          <p className="text-gray-500 mt-2 text-sm">Promedio General</p>
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">Tu Reputación Digital</h2>
          <p className="text-gray-600 mt-1">El prestigio es fundamental para la confianza de nuevos compradores. Mantén la calidad de tu trabajo.</p>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-lg text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-400" /> Comentarios de Clientes
        </h3>
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium text-gray-900">{review.customer}</span>
                  <span className="text-sm text-gray-400 ml-2">{review.date}</span>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reputation;
