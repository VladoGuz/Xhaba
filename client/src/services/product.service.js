import { apiFetch } from "./api";

/**
 * Servicio productService.
 * 
 * Contiene funciones encapsuladas para realizar las peticiones AJAX relativas a productos.
 * Promueve la reutilización y limpieza de código en las vistas y componentes.
 */
export const productService = {
  /**
   * Obtiene todos los productos del catálogo completo con sus variantes de stock e imágenes.
   * @returns {Promise<Array>} Lista de productos.
   */
  getProductsWithVariants: async () => {
    return await apiFetch("/api/products");
  },
  
  /**
   * Obtiene una lista simplificada y básica de productos (sin imágenes ni variantes)
   * usada para renderizado rápido o auditorías básicas.
   * @returns {Promise<Array>} Lista de productos simplificada.
   */
  getProductsBasic: async () => {
    return await apiFetch("/home/products");
  },

  /**
   * Obtiene el detalle individual de un producto por su UUID.
   * @param {string} id - UUID del producto.
   * @returns {Promise<Object>} Datos del producto solicitado.
   */
  getProductById: async (id) => {
    return await apiFetch(`/api/products/${id}`);
  }
};
