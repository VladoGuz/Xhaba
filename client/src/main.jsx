import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import App from './App.jsx'
import './assets/index.css' // Estilos globales y paleta de colores Rústica y Artesanal (beige, terracota, mostaza)

/**
 * Punto de entrada principal de la aplicación React.
 * 
 * Se encarga de:
 * 1. Buscar el nodo contenedor de HTML con ID 'root'.
 * 2. Renderizar el árbol de componentes de React bajo StrictMode para advertir malas prácticas.
 * 3. Envolver la aplicación con:
 *    - BrowserRouter: Habilita el sistema de rutas dinámicas del cliente.
 *    - AuthProvider: Suministra el contexto global de inicio de sesión y sesión persistente.
 *    - CartProvider: Suministra las funcionalidades y persistencia del carrito de compras.
 */
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
