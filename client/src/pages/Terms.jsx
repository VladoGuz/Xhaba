import React from 'react';

function Terms() {
  return (
    <div className="min-h-screen bg-hueso py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-orange-100">
        <h1 className="text-3xl md:text-4xl font-serif font-black text-gray-900 mb-8 tracking-tight">
          Términos y Condiciones
        </h1>
        
        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introducción</h2>
            <p>
              Bienvenido a Xhaba. Al acceder y utilizar este sitio web, usted acepta estar sujeto a los presentes términos y condiciones de uso. Lea detenidamente este documento antes de realizar cualquier compra o registro en nuestra plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Naturaleza Artesanal de los Productos</h2>
            <p>
              Todos los textiles ofertados en Xhaba son elaborados a mano por artesanos de diversas comunidades de Oaxaca. Debido a su naturaleza artesanal, cada pieza es única. Pueden existir ligeras variaciones en dimensiones, tonalidades de color y patrones de bordado en comparación con las fotografías de muestra. Estas variaciones son testimonio de su autenticidad y no se consideran defectos de fabricación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Envíos y Entregas</h2>
            <p>
              Los tiempos de entrega pueden variar dependiendo de la disponibilidad de la pieza y la ubicación del comprador. En piezas bajo pedido (preventa o encargo especial), el tiempo de elaboración será especificado al momento de la compra. Todos los envíos nacionales e internacionales cuentan con seguro contra pérdida.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Políticas de Devolución</h2>
            <p>
              Por la naturaleza única y el trabajo invertido en cada prenda, solo aceptamos devoluciones en caso de daños evidentes durante el transporte o errores de envío (modelo o talla incorrecta enviada por error nuestro). El reclamo deberá realizarse en un plazo no mayor a 3 días naturales posteriores a la recepción del paquete.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Comercio Justo y Ética</h2>
            <p>
              Xhaba opera bajo principios estrictos de comercio justo. El precio base de cada pieza es establecido directamente por la familia artesana creadora. No toleramos el regateo ni la devaluación del trabajo manual de las comunidades indígenas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Propiedad Intelectual</h2>
            <p>
              Los diseños y patrones mostrados en las prendas son propiedad cultural de las comunidades originarias y/o del artesano creador. Queda estrictamente prohibida su reproducción masiva, industrialización o apropiación cultural con fines de lucro por parte de terceros.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Terms;
