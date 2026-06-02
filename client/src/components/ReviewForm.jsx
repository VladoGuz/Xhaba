import React, { useState } from 'react';
import { Star, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

function ReviewForm({ artisanId }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Comprobar si el cliente está registrado y logueado
  const hasPurchased = user && user.role === 'client'; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      alert('Por favor, selecciona una calificación.');
      return;
    }

    setLoading(true);

    try {
      await apiFetch(`/api/artisans/${artisanId}/reviews`, {
        method: "POST",
        body: JSON.stringify({
          customerName: user.name,
          rating,
          comment
        })
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error al enviar reseña:", err);
      setError(err.message || "No se pudo registrar tu reseña en la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  if (!hasPurchased) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-200">
        <p className="text-gray-500 font-medium">Solo los clientes registrados e iniciados de Xhaba pueden dejar una valoración para el artesano.</p>
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
      
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            className={`transition-colors ${star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(rating)}
            disabled={loading}
          >
            <Star className="w-8 h-8 fill-current" />
          </button>
        ))}
      </div>

      <textarea
        required
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={loading}
        placeholder="¿Qué te pareció la calidad del bordado, la tela y la atención?"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-barro focus:border-transparent outline-none min-h-[100px] mb-4"
      ></textarea>

      <button 
        type="submit"
        disabled={loading}
        className="bg-barro text-white px-6 py-2 rounded-lg font-medium hover:bg-cochinilla transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        <span>Enviar Valoración</span>
      </button>
    </form>
  );
}

export default ReviewForm;
