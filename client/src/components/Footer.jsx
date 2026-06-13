import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente Footer (Pie de Página).
 * 
 * Renderiza el pie de página global de Xhaba.
 * 
 * Detalles de diseño para fines pedagógicos:
 * 1. Utiliza colores de la paleta rústica: `bg-barro-dark` (tonos de barro negro o terracota oscurecido)
 *    con acentos en `border-grana` (rojo cochinilla) para marcar una separación visual con el contenido.
 * 2. Estructura de rejilla responsiva (`grid-cols-1 md:grid-cols-4`) para enlaces institucionales,
 *    regiones de Oaxaca y datos de contacto de soporte.
 */
const Footer = () => {
  return (
    <footer className="bg-barro-dark text-manta pt-16 pb-8 border-t-4 border-grana mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Rejilla de secciones */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Columna 1: Marca y Misión */}
          <div className="space-y-4">
            <span className="font-serif font-bold text-3xl tracking-wide text-white">
              Xha<span className="text-grana">ba</span>
            </span>
            <p className="text-gray-400 text-sm leading-relaxed">
              Preservando la historia y el alma de Oaxaca a través de textiles auténticos. Apoyamos directamente el comercio justo con familias artesanas.
            </p>
          </div>

          {/* Columna 2: Filtros/Regiones */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 uppercase tracking-wider">
              Regiones Textiles
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-grana transition-colors">Valles Centrales</a></li>
              <li><a href="#" className="hover:text-grana transition-colors">Istmo de Tehuantepec</a></li>
              <li><a href="#" className="hover:text-grana transition-colors">Sierra Juárez</a></li>
              <li><a href="#" className="hover:text-grana transition-colors">Piezas de Colección</a></li>
            </ul>
          </div>

          {/* Columna 3: Información Institucional */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 uppercase tracking-wider">
              Comunidad Xhaba
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-grana transition-colors">Sobre Nosotros</Link></li>
              <li><Link to="/catalog" className="hover:text-grana transition-colors">Nuestros Artesanos</Link></li>
              <li><Link to="/catalog" className="hover:text-grana transition-colors">Garantía de Autenticidad</Link></li>
            </ul>
          </div>

          {/* Columna 4: Datos de Contacto */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 uppercase tracking-wider">
              Contacto
            </h4>
            <p className="text-sm text-gray-400 mb-2">📍 Oaxaca de Juárez, México</p>
            <p className="text-sm text-gray-400 mb-2">✉️ contacto@xhaba.com</p>
            <p className="text-sm text-gray-400">📞 +52 (951) 123 4567</p>
          </div>

        </div>

        {/* Barra inferior de Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; 2026 Xhaba E-commerce. Orgullosamente hecho en Oaxaca.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="hover:text-gray-400 transition-colors">Términos y Condiciones</Link>
            <Link to="/terms" className="hover:text-gray-400 transition-colors">Política de Privacidad</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
