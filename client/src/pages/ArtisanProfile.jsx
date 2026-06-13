import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, MapPin, AlertCircle, Loader } from 'lucide-react';
import ReviewForm from '../components/ReviewForm';
import { apiFetch } from '../services/api';

/**
 * Componente ArtisanProfile (Perfil Público del Artesano).
 * 
 * Renderiza la ficha pública de un artesano registrado en la plataforma.
 * 
 * Funcionalidades clave para fines pedagógicos:
 * 1. Obtención dinámica del ID de artesano desde los parámetros de ruta (`useParams`).
 * 2. Carga reactiva de metadatos (biografía, comunidad zapoteca, estado) de la base de datos mediante `apiFetch`.
 * 3. Renderizado del formulario de valoraciones y reseñas (`ReviewForm`), permitiendo calificar 
 *    el trabajo del artesano en cumplimiento de la Historia de Usuario HU-04 (Reputación y Reseñas).
 */
function ArtisanProfile() {
  const { id } = useParams(); // ID del artesano recuperado de la URL (ej: /artisan/:id)
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState(null); // Datos del artesano cargados desde el backend
  const [loading, setLoading] = useState(true); // Control de spinner de carga
  const [error, setError] = useState(null); // Almacenamiento de errores de red o base de datos

  // Carga el perfil del artesano al montar el componente o cambiar el ID
  useEffect(() => {
    const fetchArtisanProfile = async () => {
      try {
        const data = await apiFetch(`/api/artisans/${id}`);
        setArtisan(data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener perfil de artesano:", err);
        setError("El perfil del artesano no se encuentra disponible.");
        setLoading(false);
      }
    };
    fetchArtisanProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-manta flex items-center justify-center p-8">
        <div className="text-center">
          <Loader className="w-12 h-12 border-4 border-grana border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando perfil del artesano...</p>
        </div>
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="min-h-screen bg-manta py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-100 shadow-sm text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-black text-gray-900 mb-3">Artesano No Encontrado</h2>
          <p className="text-gray-500 mb-6 font-medium">{error || "Lo sentimos, el perfil buscado no existe."}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-grana text-white font-bold px-6 py-2.5 rounded-xl hover:shadow-lg transition-all"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-manta py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Cabecera del Perfil Real */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200 shadow-inner">
            <User className="w-16 h-16 text-gray-400" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-serif font-bold text-gray-900">{artisan.name}</h1>
            <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-2">
              <MapPin className="w-4 h-4 text-grana" /> {artisan.community}, {artisan.state}
            </p>
            <p className="text-gray-500 mt-3 leading-relaxed">{artisan.bio || "Creador artesano de indumentarias tradicionales oaxaqueñas y portador del legado cultural regional."}</p>
          </div>
        </div>

        {/* Zona de Valoración Real (HU-04) */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Reseñas de Clientes</h2>
          <ReviewForm artisanId={artisan.id} />
        </section>

      </div>
    </div>
  );
}

export default ArtisanProfile;
