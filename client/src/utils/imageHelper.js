/**
 * Helper para resolver de forma dinámica imágenes de prendas en Vite.
 * Mapea nombres de archivos en client/src/assets/ropa_tipica
 */
export const getProductImageUrl = (imageName) => {
  if (!imageName) {
    return "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=600&auto=format&fit=crop";
  }
  
  if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
    return imageName;
  }
  
  try {
    // La sintaxis new URL es analizada estáticamente por Vite tanto para dev como para build
    return new URL(`../assets/ropa_tipica/${imageName}`, import.meta.url).href;
  } catch (error) {
    console.error("Error cargando recurso visual:", imageName, error);
    return "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=600&auto=format&fit=crop";
  }
};

/**
 * Lista de imágenes disponibles para el selector visual
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
