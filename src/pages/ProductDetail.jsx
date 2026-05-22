import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, Heart, ShieldCheck, Truck, RefreshCw, Sparkles, UserCheck } from 'lucide-react';
import { productService } from '../services/product.service';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Estados de datos
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de la variante seleccionada
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [addedAlert, setAddedAlert] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data);

        // Preseleccionar la primera variante disponible si existen
        if (data.variants && data.variants.length > 0) {
          const firstAvailable = data.variants.find(v => v.stock > 0) || data.variants[0];
          setSelectedColor(firstAvailable.color);
          setSelectedSize(firstAvailable.size);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener producto en detalle:", err);
        setError("El textil que buscas no se encuentra disponible o no existe.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Si está cargando
  if (loading) {
    return (
      <div className="min-h-screen bg-manta flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium animate-pulse">Tejiendo los detalles de la prenda...</p>
        </div>
      </div>
    );
  }

  // Si hay error
  if (error || !product) {
    return (
      <div className="min-h-screen bg-manta py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-100 shadow-sm text-center">
          <h2 className="text-2xl font-serif font-black text-gray-900 mb-3">Prenda Inexistente</h2>
          <p className="text-gray-500 mb-6 font-medium">{error || "Lo sentimos, el producto no fue encontrado."}</p>
          <button 
            onClick={() => navigate('/catalog')}
            className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold px-6 py-2.5 rounded-xl hover:shadow-lg transition-all"
          >
            Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  // Agrupar colores únicos disponibles
  const availableColors = [...new Set(product.variants.map(v => v.color))].filter(Boolean);

  // Obtener tallas asociadas al color seleccionado
  const sizesForSelectedColor = product.variants.filter(v => v.color === selectedColor);

  // Encontrar el objeto de variante actualmente seleccionado
  const currentVariant = product.variants.find(
    v => v.color === selectedColor && v.size === selectedSize
  ) || product.variants[0];

  // Verificar si hay stock
  const isOutOfStock = !product.variants || product.variants.length === 0 || !product.variants.some(v => v.stock > 0);
  const isCurrentVariantOutOfStock = currentVariant ? currentVariant.stock === 0 : true;

  const handleAddToCartClick = () => {
    if (!user || user.role !== 'client') {
      alert('Debes iniciar sesión como cliente para poder realizar compras.');
      navigate('/login');
      return;
    }

    if (!selectedColor || !selectedSize) {
      alert('Por favor selecciona un color y una talla antes de añadir.');
      return;
    }

    // Estructurar el ítem para añadir a la bolsa
    addToCart({
      id: currentVariant.variant_id || product.product_id,
      productId: product.product_id,
      title: `${product.title} (${selectedColor} - ${selectedSize})`,
      price: product.base_price,
      artisan: `${product.artisan_name} (${product.artisan_community})`,
      image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=600&auto=format&fit=crop",
      color: selectedColor,
      size: selectedSize,
    });

    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 4000);
  };

  return (
    <main className="min-h-screen bg-manta py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Enlace de regreso y migas de pan */}
        <div className="flex items-center gap-2 mb-8">
          <Link 
            to="/catalog" 
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-fuchsia-600 transition-colors bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Volver al Catálogo</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-400 font-medium truncate max-w-[200px] md:max-w-xs">{product.category}</span>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-900 font-bold truncate max-w-[250px] md:max-w-md">{product.title}</span>
        </div>

        {/* Alerta de Éxito al agregar al Carrito */}
        {addedAlert && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold p-4 rounded-2xl shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-down">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 animate-bounce" />
              <div>
                <p className="font-bold">¡Prenda añadida a tu bolsa!</p>
                <p className="text-xs text-emerald-100">Has reservado temporalmente esta obra de arte textil.</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/cart')}
              className="bg-white text-emerald-700 font-bold text-xs uppercase px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow"
            >
              Ver Bolsa de Compras
            </button>
          </div>
        )}

        {/* DETALLE PRINCIPAL DEL PRODUCTO */}
        <section className="bg-white rounded-3xl border border-pink-100/50 shadow-sm overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* COLUMNA IZQUIERDA: GALERIA DE IMAGENES */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-pink-50/20 to-white flex flex-col justify-center relative border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="relative rounded-2xl overflow-hidden shadow-inner aspect-square max-h-[500px] mx-auto w-full group">
                <img 
                  src="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=600&auto=format&fit=crop" 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badges Flotantes */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5 animate-gradient-x">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                    <span>Pieza de Autor</span>
                  </span>
                  {currentVariant && currentVariant.stock === 1 && (
                    <span className="bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md animate-pulse">
                      ¡Única pieza en existencia!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: SELECCION DE VARIANTES Y DETALLES */}
            <div className="p-8 md:p-12 flex flex-col justify-between">
              <div>
                
                {/* Categoría y Título */}
                <span className="text-xs uppercase font-bold tracking-widest text-fuchsia-500 mb-2 inline-block">
                  {product.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-serif font-black text-gray-900 mb-4 tracking-tight leading-tight">
                  {product.title}
                </h1>

                {/* Artesano y Comunidad */}
                <p className="text-gray-500 font-medium mb-6">
                  Elaborado por la artesana: <span className="text-rose-600 font-bold">{product.artisan_name}</span> en la comunidad zapoteca de <span className="text-gray-700 font-semibold">{product.artisan_community}</span>.
                </p>

                {/* Precio */}
                <div className="pb-6 border-b border-gray-100 mb-6">
                  <span className="text-4xl font-black text-gray-900">${product.base_price}</span>
                  <span className="text-sm font-semibold text-gray-400 ml-2">MXN</span>
                </div>

                {/* Badges de Técnica y Material */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-fuchsia-50/50 border border-fuchsia-100 rounded-2xl p-4">
                    <span className="text-[10px] uppercase font-bold text-fuchsia-500 block mb-1">Técnica Empleada</span>
                    <span className="font-bold text-gray-800 text-sm">{product.technique}</span>
                  </div>
                  <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4">
                    <span className="text-[10px] uppercase font-bold text-rose-500 block mb-1">Material Base</span>
                    <span className="font-bold text-gray-800 text-sm">{product.material}</span>
                  </div>
                </div>

                {/* SELECTORES DE VARIANTES */}
                {!isOutOfStock ? (
                  <div className="space-y-6 mb-8">
                    
                    {/* Selector de Color */}
                    {availableColors.length > 0 && (
                      <div>
                        <label className="block text-xs uppercase font-bold tracking-wider text-gray-500 mb-3">Color de Lienzo</label>
                        <div className="flex flex-wrap gap-2.5">
                          {availableColors.map(color => (
                            <button
                              key={color}
                              onClick={() => {
                                setSelectedColor(color);
                                // Seleccionar la primera talla disponible para este color
                                const matchingSizes = product.variants.filter(v => v.color === color);
                                const availableSize = matchingSizes.find(s => s.stock > 0) || matchingSizes[0];
                                setSelectedSize(availableSize.size);
                              }}
                              className={`px-4.5 py-2.5 rounded-xl text-sm font-bold border transition-all ${selectedColor === color ? 'bg-fuchsia-600 border-fuchsia-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Selector de Talla */}
                    {sizesForSelectedColor.length > 0 && (
                      <div>
                        <label className="block text-xs uppercase font-bold tracking-wider text-gray-500 mb-3">Talla de la Prenda</label>
                        <div className="flex flex-wrap gap-2.5">
                          {sizesForSelectedColor.map(variant => (
                            <button
                              key={variant.variant_id}
                              disabled={variant.stock === 0}
                              onClick={() => setSelectedSize(variant.size)}
                              className={`px-4.5 py-2.5 rounded-xl text-sm font-bold border transition-all flex flex-col items-center justify-center min-w-[70px] ${variant.stock === 0 ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed line-through' : selectedSize === variant.size ? 'bg-rose-600 border-rose-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}
                            >
                              <span>{variant.size}</span>
                              <span className={`text-[9px] mt-0.5 ${variant.stock === 0 ? 'text-gray-300' : selectedSize === variant.size ? 'text-rose-100' : 'text-gray-400'}`}>
                                {variant.stock > 0 ? `${variant.stock} disp.` : 'Agotado'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ficha Técnica de Medidas en Centímetros */}
                    {currentVariant && currentVariant.measurements && (
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <label className="block text-xs uppercase font-bold tracking-wider text-gray-500 mb-3">Medidas en centímetros (Prenda tendida)</label>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          {Object.entries(currentVariant.measurements).map(([key, val]) => (
                            <div key={key} className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-sm">
                              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">{key}</span>
                              <span className="font-extrabold text-gray-800 text-base">{val}</span>
                              <span className="text-[9px] font-bold text-gray-400 ml-0.5">cm</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="bg-rose-50 border border-rose-100 p-4.5 rounded-2xl text-rose-700 font-bold text-center mb-8">
                    Esta pieza única está agotada en todas sus variantes.
                  </div>
                )}

              </div>

              {/* ACCION DE COMPRA */}
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCartClick}
                  disabled={isOutOfStock || isCurrentVariantOutOfStock}
                  className="flex-grow flex items-center justify-center gap-2.5 bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-extrabold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:scale-100 disabled:shadow-none transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>
                    {isOutOfStock ? 'Agotado por Completo' : isCurrentVariantOutOfStock ? 'Variante Agotada' : 'Añadir a la Bolsa'}
                  </span>
                </button>
                
                <button 
                  className="p-4 border border-gray-200 rounded-2xl text-gray-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors shadow-sm"
                  title="Guardar en favoritos"
                >
                  <Heart className="w-6 h-6" />
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* SECCION SECUNDARIA: HISTORIA DEL CREADOR (EL ALMA DE LA PRENDA) */}
        <section className="bg-gradient-to-br from-[#8B3A2F]/10 via-[#B35446]/5 to-white rounded-3xl p-8 md:p-12 border border-[#8B3A2F]/10 flex flex-col md:flex-row items-center gap-8 shadow-inner">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#8B3A2F] to-[#B35446] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg">
            <UserCheck className="w-10 h-10" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2 bg-white/50 border border-[#8B3A2F]/15 px-3 py-1 rounded-full w-fit text-[10px] font-bold text-[#8B3A2F] tracking-widest uppercase">
              <span>EL ALMA DE LA PRENDA</span>
            </div>
            <h2 className="text-2xl font-serif font-black text-gray-900 mb-3">
              Conoce a {product.artisan_name}
            </h2>
            <p className="text-gray-700 leading-relaxed max-w-4xl font-medium">
              {product.artisan_bio || "Esta hermosa pieza artesanal ha sido confeccionada con devoción e historia por manos tejedoras oaxaqueñas. Cada bordado y patrón representa años de legado familiar y tradiciones transmitidas de generación en generación."}
            </p>
            <p className="text-xs font-semibold text-[#B35446] mt-4">
              📍 Creado en la comunidad de: {product.artisan_community}, Oaxaca.
            </p>
          </div>
        </section>

        {/* SECCION TERCIARIA: GARANTIAS ARTESANALES */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-pink-50 rounded-xl text-pink-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Comercio 100% Directo</h4>
              <p className="text-sm text-gray-500">El pago se entrega sin intermediación alguna a la familia artesana que diseñó y tejió la prenda.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-pink-50 rounded-xl text-pink-500">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Envío Protegido Especial</h4>
              <p className="text-sm text-gray-500">Cada textil se empaca con protección especial contra humedad para resguardar las hebras y tintes orgánicos.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-pink-50 rounded-xl text-pink-500">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Garantía de Autenticidad</h4>
              <p className="text-sm text-gray-500">Incluye certificado físico firmado por el maestro textilero validando la procedencia técnica y geográfica.</p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

export default ProductDetail;
