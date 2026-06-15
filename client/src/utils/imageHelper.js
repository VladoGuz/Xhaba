/**
 * Helper para resolver de forma dinámica imágenes de prendas en el empaquetador Vite.
 * 
 * @param {string} imageName - Nombre del archivo de imagen (ej. "valles1.jpg").
 * @returns {string} URL absoluta resuelta para renderizar en la etiqueta <img>.
 * 
 * Explicación didáctica para Vite:
 * En entornos compilados (Vite/Webpack), no podemos usar concatenaciones simples como `src={'./assets/' + name}`
 * porque las imágenes se procesan en la compilación y cambian de nombre (agregan un hash de versión).
 * La API nativa `new URL(path, import.meta.url)` le indica a Vite que debe registrar
 * estáticamente ese directorio de recursos estáticos ('ropa_tipica') e incluir las imágenes en el compilado final.
 */
export const getProductImageUrl = (imageName) => {
  // Retorna una foto por defecto de Unsplash como fallback si no se provee imagen
  if (!imageName) {
    return "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=600&auto=format&fit=crop";
  }
  
  // Si la imagen ya es una URL absoluta externa (ej. cargada por URL en la DB) la retorna sin modificar
  if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
    return imageName;
  }

  // Comprobar si es un activo estático de la demostración
  const isStaticAsset = [
    'valles1.jpg', 'valles2.jpg', 'valles3.jpg', 
    'istmo1.jpg', 'istmo2.jpg', 'istmo3.jpg', 
    'mixteca1.jpg', 'mixteca2.jpg', 'mixteca3.jpg', 
    'costa1.jpg', 'costa2.jpg', 'costa3.jpg', 
    'papaloapan1.jpg', 'papaloapan2.jpg', 'papaloapan3.jpg', 
    'canada1.jpg', 'canada2.jpg', 'canada3.jpg'
  ].includes(imageName);

  if (!isStaticAsset) {
    // Si la imagen es subida dinámicamente por un artesano, se sirve desde el backend
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return `${baseUrl}/uploads/${imageName}`;
  }
  
  try {
    // Resuelve dinámicamente la ruta física de los activos locales compilados de Vite
    return new URL(`../assets/ropa_tipica/${imageName}`, import.meta.url).href;
  } catch (error) {
    console.error("Error cargando recurso visual local en Xhaba:", imageName, error);
    // Retorna fallback decorativo ante fallas
    return "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=600&auto=format&fit=crop";
  }
};

/**
 * Listado de imágenes locales disponibles en 'client/src/assets/ropa_tipica'.
 * Utilizado por el selector visual de prendas en el formulario del artesano (ProductForm.jsx)
 * para asociar fotos correctas a los productos.
 */
export const AVAILABLE_PRODUCT_IMAGES = [
  { name: "valles1.jpg", label: "Huipil de San Antonino (Valles Centrales 1)" },
  { name: "valles2.jpg", label: "Blusa bordada blanca (Valles Centrales 2)" },
  { name: "valles3.jpg", label: "Bordado floral multicolor (Valles Centrales 3)" },
  { name: "istmo1.jpg", label: "Traje del Istmo - Flores negras (Istmo 1)" },
  { name: "istmo2.jpg", label: "Bordado de gala dorado (Istmo 2)" },
  { name: "istmo3.jpg", label: "Traje de Tehuana rojo (Istmo 3)" },
  { name: "mixteca1.jpg", label: "Huipil Triqui rojo (Mixteca 1)" },
  { name: "mixteca2.jpg", label: "Bordado tradicional mixteco (Mixteca 2)" },
  { name: "mixteca3.jpg", label: "Camisa de manta bordada (Mixteca 3)" },
  { name: "costa1.jpg", label: "Blusa de cajón (Costa 1)" },
  { name: "costa2.jpg", label: "Huipil amuzgo lila (Costa 2)" },
  { name: "costa3.jpg", label: "Falda de percal floreada (Costa 3)" },
  { name: "papaloapan1.jpg", label: "Huipil de gala Jalapa de Díaz (Papaloapan 1)" },
  { name: "papaloapan2.jpg", label: "Bordado de pájaros mazateco (Papaloapan 2)" },
  { name: "papaloapan3.jpg", label: "Vestido blanco bordado (Papaloapan 3)" },
  { name: "canada1.jpg", label: "Huipil Mazateco tradicional (Cañada 1)" },
  { name: "canada2.jpg", label: "Bordado floral rosa (Cañada 2)" },
  { name: "canada3.jpg", label: "Huipil de gala morado (Cañada 3)" }
];
