import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/product.service';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const data = await productService.getProductsWithVariants();
        // Filtrar productos agotados para no mostrarlos en la página de inicio
        const inStockData = data.filter(product => product.variants && product.variants.length > 0 && product.variants.some(v => v.stock > 0));
        setProducts(inStockData);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener productos para Home:", err);
        setError("No pudimos conectar con el telar de productos. Por favor, recarga.");
        setLoading(false);
      }
    };

    fetchHomeProducts();
  }, []);

  return (
    <div className="bg-manta min-h-screen">
      
      {/* Hero Section Inmersivo */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo con overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero_textile.png" 
            alt="Fondo de Textiles Artesanales" 
            className="w-full h-full object-cover animate-pan-image"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-manta"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-semibold tracking-widest uppercase mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            Tradición que Trasciende
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-black text-white mb-6 leading-tight drop-shadow-2xl animate-fade-in-up animation-delay-100">
            El Arte Textil de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cempasuchil to-cochinilla">Oaxaca</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 font-medium max-w-2xl mx-auto mb-10 drop-shadow-lg animate-fade-in-up animation-delay-200">
            Descubre piezas únicas elaboradas a mano con técnicas milenarias. 
            Cada hilo cuenta la historia y cosmovisión de nuestras comunidades.
          </p>

          <Link 
            to="/catalog" 
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-cempasuchil to-cochinilla rounded-full overflow-hidden shadow-2xl hover:shadow-cempasuchil/50 transition-all hover:scale-105 animate-fade-in-up animation-delay-300"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <span className="relative flex items-center gap-2">
              Explorar el Catálogo 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* Sección de Categorías Visuales (Colecciones) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Huipiles Tradicionales", img: "/images/huipil.png", link: "/catalog?category=Huipiles" },
            { title: "Blusas Bordadas", img: "/images/blusa.png", link: "/catalog?category=Blusas" },
            { title: "Guayaberas Elegantes", img: "/images/guayabera.png", link: "/catalog?category=Guayaberas" }
          ].map((cat, idx) => (
            <Link to={cat.link} key={idx} className="group relative h-80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all">
              <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-bold text-white font-serif mb-2 transform transition-transform group-hover:-translate-y-2">{cat.title}</h3>
                <div className="w-12 h-1 bg-cempasuchil rounded-full transform origin-left transition-all group-hover:w-full"></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sección "Joyas del Telar" (Últimas obras) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-cempasuchil font-bold mb-2">
              <Star className="w-5 h-5 fill-current" />
              <span className="uppercase tracking-widest text-sm">Recién Llegados</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-gray-900">
              Joyas del Telar
            </h2>
          </div>
          <Link to="/catalog" className="text-fuchsia-600 font-bold hover:text-fuchsia-800 transition-colors flex items-center gap-1 mt-4 md:mt-0">
            Ver todo el catálogo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          /* Skeletons de Carga */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-gray-100 p-6 flex flex-col justify-between shadow-sm">
                <div className="bg-gray-200 rounded-xl h-56 w-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between items-center mt-auto">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded-xl w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Estado de Error */
          <div className="text-center py-12 bg-white rounded-2xl border border-red-100 p-8 shadow-sm">
            <p className="text-red-500 font-semibold text-lg">{error}</p>
          </div>
        ) : (
          /* Grid de Productos Descubiertos */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 6).map((product) => {
              const isUnique = product.variants && product.variants.some(v => v.stock === 1);
              return (
                <ProductCard
                  key={product.product_id || product.id}
                  id={product.product_id || product.id}
                  title={product.title}
                  price={product.base_price}
                  artisan={`${product.artisan_name} (${product.artisan_community})`}
                  image={product.images && product.images[0] ? product.images[0] : 'valles1.jpg'}
                  isUnique={isUnique}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Banner de Compromiso */}
      <section className="bg-barro py-20 mt-12 text-white text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Comercio Justo y Directo</h2>
          <p className="text-lg text-gray-300 font-medium mb-8">
            En Xhaba conectamos directamente a los maestros artesanos con personas que valoran el trabajo hecho a mano, garantizando un pago justo y respetuoso de su labor y tiempo.
          </p>
          <Link to="/about" className="inline-block border-2 border-white/50 hover:border-white px-8 py-3 rounded-full font-bold transition-all hover:bg-white hover:text-barro">
            Conoce Nuestra Misión
          </Link>
        </div>
      </section>
      
    </div>
  );
}

export default Home;
