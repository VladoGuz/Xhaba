import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas Públicas / Invitado
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import AboutUs from './pages/AboutUs';
import Terms from './pages/Terms';

// Páginas del Cliente
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ArtisanProfile from './pages/ArtisanProfile';
import ClientProfile from './pages/ClientProfile';

// Páginas del Artesano y Administrador
import ArtisanDashboard from './pages/ArtisanDashboard';
import AdminDashboard from './pages/AdminDashboard';

/**
 * 🎓 GUÍA PARA ESTUDIANTES: App.jsx
 * 
 * Componente Raíz de la Interfaz (App).
 * Imagina que este archivo es el "índice" o el "mapa" de tu sitio web. 
 * Aquí le decimos a React qué pantalla mostrar dependiendo de la URL (el link) en la que esté el usuario.
 * 
 * Conceptos Clave aquí:
 * 1. <Routes> y <Route>: Vienen de 'react-router-dom'. Son las reglas de navegación. Si la URL dice "/login", 
 *    muestra el componente <Login />.
 * 2. <Navbar> y <Footer>: Nota cómo están FUERA de <Routes>. Esto significa que SIEMPRE se van a mostrar 
 *    (en todas las pantallas de la página), como el menú principal de un restaurante.
 * 3. <ProtectedRoute>: Es un componente "guardia de seguridad". Revisa si el usuario tiene permiso (está logueado) 
 *    antes de dejarlo entrar a ciertas páginas, como el "dashboard".
 */
function App() {
  return (
    <div className="bg-manta min-h-screen font-sans flex flex-col justify-between">
      <div>
        {/* Barra de navegación superior reactiva */}
        <Navbar />
        
        {/* Declaración de rutas dinámicas de Xhaba */}
        <Routes>
          {/* ========================================================
              RUTAS PÚBLICAS: Accesibles por cualquier usuario invitado
              ======================================================== */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/artisan/:id" element={<ArtisanProfile />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* ========================================================
              RUTAS DE CLIENTES: Requieren rol 'client'
              ======================================================== */}
          <Route path="/cart" element={<ProtectedRoute rolesAllowed={['client']}><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute rolesAllowed={['client']}><Checkout /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute rolesAllowed={['client']}><ClientProfile /></ProtectedRoute>} />
          
          {/* ========================================================
              RUTAS DE ARTESANOS: Requieren rol 'artisan'
              ======================================================== */}
          <Route path="/dashboard" element={<ProtectedRoute rolesAllowed={['artisan']}><ArtisanDashboard /></ProtectedRoute>} />
          
          {/* ========================================================
              RUTAS DE ADMINISTRADOR: Requieren rol 'admin'
              ======================================================== */}
          <Route path="/admin" element={<ProtectedRoute rolesAllowed={['admin']}><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </div>
      
      {/* Pie de página descriptivo */}
      <Footer />
    </div>
  );
}

export default App;
