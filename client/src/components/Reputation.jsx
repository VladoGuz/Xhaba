import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

function Reputation() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(5.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReputation = async () => {
      if (!user || !user.artisan_id) {
        setError("No tienes un perfil de artesano vinculado a esta cuenta.");
        setLoading(false);
        return;
      }

      try {
        const data = await apiFetch(`/api/artisans/${user.artisan_id}/reviews`);
        setReviews(data.reviews || []);
        setAverageRating(data.average || 5.0);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener reputación del artesano:", err);
        setError("Ocurrió un error al cargar tus reseñas.");
        setLoading(false);
      }
    };

    fetchReputation();
  }, [user]);

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-100 flex items-center justify-center gap-2 text-barro font-medium">
        <Loader className="w-5 h-5 animate-spin text-grana" />
        <span>Cargando tu reputación...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start gap-3 shadow-sm max-w-xl mx-auto mt-6">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <span className="text-sm font-medium">{error}</span>
      </div>
    );
  }

  // Helper para pintar estrellas de calificación
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="border-b border-gray-100 pb-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">{averageRating}</div>
          <div className="flex justify-center text-yellow-400">
            {renderStars(Math.round(averageRating))}
          </div>
          <p className="text-gray-500 mt-2 text-sm">Promedio General</p>
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">Tu Reputación Digital (Real-time BD)</h2>
          <p className="text-gray-600 mt-1">El prestigio es fundamental para la confianza de nuevos compradores. Mantén la calidad de tu trabajo.</p>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-lg text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-400" /> Comentarios de Clientes
        </h3>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-6">Aún no has recibido valoraciones en esta plataforma.</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium text-gray-900">{review.customer_name}</span>
                    <span className="text-sm text-gray-400 ml-2">
                      {new Date(review.created_at).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment || "Sin comentario escrito."}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Reputation;
