import { apiFetch } from "./api";

export const productService = {
  getProductsWithVariants: async () => {
    return await apiFetch("/api/products");
  },
  
  getProductsBasic: async () => {
    return await apiFetch("/home/products");
  }
};
