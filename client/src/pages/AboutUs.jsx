import React from 'react';
import { Heart, Globe, Users, Shield } from 'lucide-react';

function AboutUs() {
  return (
    <div className="min-h-screen bg-hueso py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 mb-6 tracking-tight">
            Sobre <span className="bg-clip-text text-transparent bg-gradient-to-r from-cempasuchil to-cochinilla">Nosotros</span>
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Conectando el arte textil oaxaqueño con el mundo a través del comercio justo.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-orange-100 mb-12">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Nuestra Historia</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Xhaba nació de una profunda admiración por las manos creadoras de Oaxaca. Entendemos que cada huipil, blusa y lienzo lleva consigo no solo hilos y tintes naturales, sino siglos de historia, cosmovisión y la identidad viva de las comunidades indígenas.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Nuestro propósito es servir como un puente ético y transparente entre los artesanos de las ocho regiones de Oaxaca y personas que valoran el arte textil en todo el mundo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-cempasuchil mb-6">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Comercio Justo</h3>
            <p className="text-gray-500">
              Garantizamos que el pago justo llegue directamente a las familias artesanas, sin intermediarios abusivos.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-cochinilla mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Comunidad</h3>
            <p className="text-gray-500">
              Fomentamos el desarrollo sustentable de las comunidades preservando sus técnicas ancestrales.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Alcance Global</h3>
            <p className="text-gray-500">
              Llevamos el arte textil oaxaqueño a cualquier parte del mundo con envíos seguros y protegidos.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Autenticidad</h3>
            <p className="text-gray-500">
              Cada pieza incluye información de procedencia, técnica y el nombre del artesano creador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
