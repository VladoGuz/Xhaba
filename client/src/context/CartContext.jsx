import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '../services/api';

// Creación del Contexto de Carrito de Compras de React
const CartContext = createContext();

/**
 * 🎓 GUÍA PARA ESTUDIANTES: CartContext.jsx
 * 
 * Proveedor de Contexto de Carrito (CartProvider).
 * En React, si tienes una variable que ocupas en muchas páginas (como el Carrito),
 * en lugar de pasarla de un componente a otro como "props", creas un "Contexto Global".
 * Cualquier componente que necesite el carrito solo tiene que usar `useCart()`.
 * 
 * Gestiona el carrito de compras persistente. Combina el almacenamiento local (localStorage)
 * para usuarios invitados con almacenamiento persistente en la nube (PostgreSQL 'cart_items')
 * una vez que el cliente inicia sesión.
 */
export function CartProvider({ children }) {
  const { user } = useAuth(); // Consume la sesión del usuario para reaccionar ante login/logout
  
  // `useState` es como una memoria interna. `cartItems` es la variable que usamos para leer el carrito.
  // `setCartItems` es la ÚNICA forma de cambiar lo que hay dentro del carrito.
  const [cartItems, setCartItems] = useState([]); 
  const [isLoaded, setIsLoaded] = useState(false); // Bandera para evitar sincronizar datos vacíos al montar el componente

  // 1. Cargar el carrito inicial (desde la base de datos si está logueado, de lo contrario desde localStorage)
  // `useEffect` es una función que se ejecuta de forma automática en cuanto este componente se carga en pantalla.
  useEffect(() => {
    const loadCart = async () => {
      setIsLoaded(false);
      if (user && user.role === 'client') {
        try {
          // Si el usuario está autenticado, lee su carrito guardado en la base de datos
          const dbCart = await apiFetch("/api/cart");
          if (Array.isArray(dbCart)) {
            setCartItems(dbCart);
          } else {
            setCartItems([]);
          }
        } catch (err) {
          console.error("Error al cargar el carrito desde la base de datos, usando localStorage como respaldo:", err);
          // Respaldo en localStorage en caso de falla de red del servidor
          const savedCart = localStorage.getItem('xhaba_cart');
          setCartItems(savedCart ? JSON.parse(savedCart) : []);
        }
      } else {
        // Invitados leen del almacenamiento local del navegador
        const savedCart = localStorage.getItem('xhaba_cart');
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      }
      setIsLoaded(true);
    };

    loadCart();
  }, [user]);

  // 2. Efecto de Sincronización Reactiva: Al mutar cartItems, actualiza localStorage y sincroniza con la base de datos
  useEffect(() => {
    // Evita sobreescribir con un arreglo vacío mientras carga la información del usuario
    if (!isLoaded) return;

    // Guarda localmente para persistencia de respaldo
    localStorage.setItem('xhaba_cart', JSON.stringify(cartItems));

    const syncWithDb = async () => {
      // Envía una petición POST de sincronización masiva al servidor únicamente para clientes registrados
      if (user && user.role === 'client') {
        try {
          await apiFetch("/api/cart", {
            method: "POST",
            body: JSON.stringify({ cartItems })
          });
        } catch (err) {
          console.error("Error al sincronizar el carrito con la base de datos:", err);
        }
      }
    };

    syncWithDb();
  }, [cartItems, user, isLoaded]);

  /**
   * Agrega un artículo al carrito.
   * Si ya existe la variante (id), incrementa la cantidad en 1.
   * 
   * Nota para estudiantes: Nota cómo NUNCA hacemos `cartItems.push()`. 
   * En React el estado es INMUTABLE, siempre creamos un arreglo nuevo o usamos el setter (`setCartItems`).
   * 
   * @param {Object} product - Estructura de la variante de prenda a agregar.
   */
  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        if (product.stock !== undefined && exists.quantity >= product.stock) {
          alert('No puedes agregar más unidades. Has alcanzado el límite de stock disponible.');
          return prev;
        }
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      if (product.stock !== undefined && product.stock <= 0) {
        alert('Este producto se encuentra agotado.');
        return prev;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  /**
   * Actualiza la cantidad de un artículo en el carrito.
   * Verifica los límites de stock y cantidad mínima (1).
   * 
   * @param {string} id - variant_id del artículo.
   * @param {number} delta - incremento (+1) o decremento (-1).
   */
  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return item;
        if (item.stock !== undefined && newQuantity > item.stock) {
          alert('No puedes agregar más unidades. Has alcanzado el límite de stock disponible.');
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  /**
   * Elimina por completo un artículo del carrito.
   * 
   * @param {string} id - variant_id de la prenda.
   */
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  /**
   * Vacía por completo el carrito de compras.
   */
  const clearCart = () => setCartItems([]);

  // Cálculo dinámico del total acumulado en el carrito
  const total = cartItems.reduce((acc, item) => {
    // Asegura limpiar caracteres especiales del precio antes de realizar la suma aritmética
    const itemPrice = parseFloat(String(item.price).replace(/[^0-9.-]+/g, '')) || 0;
    return acc + (itemPrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * Hook personalizado (Custom Hook) para consumir las funciones y estado del carrito
 * en cualquier parte del frontend de React de forma directa.
 */
export function useCart() {
  return useContext(CartContext);
}
