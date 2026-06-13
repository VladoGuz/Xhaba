import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas Públicas / Invitado
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';

// Páginas del Cliente
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ArtisanProfile from './pages/ArtisanProfile';
import ClientProfile from './pages/ClientProfile';

// Páginas del Artesano y Administrador
import ArtisanDashboard from './pages/ArtisanDashboard';
import AdminDashboard from './pages/AdminDashboard';

/**
 * Componente Raíz de la Interfaz (App).
 * 
 * Define la estructura general de la página (Layout) que mantiene fijos la barra
 * de navegación (Navbar) y el pie de página (Footer). 
 * 
 * Implementa el árbol de enrutamiento del lado del cliente utilizando React Router DOM,
 * protegiendo las vistas de clientes, artesanos y administradores a través del
 * envoltorio condicional 'ProtectedRoute'.
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
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/artisan/:id" element={<ArtisanProfile />} />
          
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
