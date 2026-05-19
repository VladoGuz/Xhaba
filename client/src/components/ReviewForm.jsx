import React, { useState } from 'react';
import { Star } from 'lucide-react';

function ReviewForm({ artisanId }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Simulación: Comprobar si el cliente compró a este artesano (HU-04)
  const hasPurchased = true; 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Por favor, selecciona una calificación.');
      return;
    }
    // Enviar a la base de datos
    setSubmitted(true);
  };

  if (!hasPurchased) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-200">
        <p className="text-gray-500">Solo los clientes que han comprado una prenda de este artesano pueden dejar una valoración.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-green-50 p-6 rounded-lg text-center border border-green-200">
        <p className="text-green-700 font-medium">¡Gracias por tu valoración! Has ayudado a otros a conocer la calidad de este artesano.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-medium text-gray-900 mb-4">Valora el trabajo de este Artesano</h3>
      
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            className={`transition-colors ${star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(rating)}
          >
            <Star className="w-8 h-8 fill-current" />
          </button>
        ))}
      </div>

      <textarea
        required
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="¿Qué te pareció la calidad del bordado, la tela y la atención?"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none min-h-[100px] mb-4"
      ></textarea>

      <button 
        type="submit"
        className="bg-barro text-white px-6 py-2 rounded-lg font-medium hover:bg-[#8B3A2F] transition-colors"
      >
        Enviar Valoración
      </button>
    </form>
  );
}

export default ReviewForm;
