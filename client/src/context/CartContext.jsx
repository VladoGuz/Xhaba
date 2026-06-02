import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Cargar el carrito inicial (desde la base de datos si está logueado, sino local)
  useEffect(() => {
    const loadCart = async () => {
      setIsLoaded(false);
      if (user && user.role === 'client') {
        try {
          const dbCart = await apiFetch("/api/cart");
          if (Array.isArray(dbCart)) {
            setCartItems(dbCart);
          } else {
            setCartItems([]);
          }
        } catch (err) {
          console.error("Error al cargar el carrito desde la base de datos:", err);
          // Fallback a localStorage
          const savedCart = localStorage.getItem('xhaba_cart');
          setCartItems(savedCart ? JSON.parse(savedCart) : []);
        }
      } else {
        const savedCart = localStorage.getItem('xhaba_cart');
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      }
      setIsLoaded(true);
    };

    loadCart();
  }, [user]);

  // 2. Sincronizar el carrito con localStorage y base de datos al cambiar
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem('xhaba_cart', JSON.stringify(cartItems));

    const syncWithDb = async () => {
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

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const total = cartItems.reduce((acc, item) => {
    const itemPrice = parseFloat(String(item.price).replace(/[^0-9.-]+/g, '')) || 0;
    return acc + (itemPrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
