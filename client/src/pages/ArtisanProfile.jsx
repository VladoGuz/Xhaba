import React from 'react';
import { User, MapPin } from 'lucide-react';
import ReviewForm from '../components/ReviewForm';

function ArtisanProfile() {
  return (
    <div className="min-h-screen bg-manta py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Cabecera del Perfil */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            <User className="w-16 h-16 text-gray-400" />
            {/* Si tuviera foto: <img src="..." className="w-full h-full object-cover" /> */}
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Familia Mendoza</h1>
            <p className="text-gray-600 flex items-center gap-2 mt-2">
              <MapPin className="w-4 h-4" /> San Antonino Castillo Velasco, Valles Centrales
            </p>
            <p className="text-gray-500 mt-2">Especialistas en la técnica "Hazme si puedes". Tradición familiar desde 1950.</p>
          </div>
        </div>

        {/* Zona de Valoración (HU-04) */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Reseñas de Clientes</h2>
          <ReviewForm artisanId="1" />
        </section>

      </div>
    </div>
  );
}

export default ArtisanProfile;
