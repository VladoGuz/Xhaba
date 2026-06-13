import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '../services/api';

// Creación del Contexto de Carrito de Compras de React
const CartContext = createContext();

/**
 * Proveedor de Contexto de Carrito (CartProvider).
 * 
 * Gestiona el carrito de compras persistente. Combina el almacenamiento local (localStorage)
 * para usuarios invitados con almacenamiento persistente en la nube (PostgreSQL 'cart_items')
 * una vez que el cliente inicia sesión.
 */
export function CartProvider({ children }) {
  const { user } = useAuth(); // Consume la sesión del usuario para reaccionar ante login/logout
  const [cartItems, setCartItems] = useState([]); // Arreglo conteniendo { id (variant_id), title, price, quantity, etc. }
  const [isLoaded, setIsLoaded] = useState(false); // Bandera para evitar sincronizar datos vacíos al montar el componente

  // 1. Cargar el carrito inicial (desde la base de datos si está logueado, de lo contrario desde localStorage)
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
   * @param {Object} product - Estructura de la variante de prenda a agregar.
   */
  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
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
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, total }}>
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
