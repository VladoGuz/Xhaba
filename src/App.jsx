import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Páginas Públicas / Invitado
import Home from './pages/Home';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';

// Páginas del Cliente
import Cart from './pages/shop/Cart';
import Checkout from './pages/shop/Checkout';
import ArtisanProfile from './pages/shop/ArtisanProfile';
import ClientProfile from './pages/shop/ClientProfile';

// Páginas del Artesano y Administrador
import ArtisanDashboard from './pages/dashboard/ArtisanDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

/**
 * Componente Principal (App)
 * Configura la estructura base (Layout) de la aplicación y define las Rutas (URLs)
 * para navegar entre las diferentes vistas sin recargar la página.
 */
function App() {
  return (
    <div className="bg-manta min-h-screen font-sans flex flex-col justify-between">
      <div>
        {/* Barra de navegación siempre visible en la parte superior */}
        <Navbar />
        
        {/* Definición de Rutas: Muestra el componente dependiendo de la URL */}
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/artisan/:id" element={<ArtisanProfile />} />
          
          {/* Rutas Privadas: Cliente */}
          <Route path="/cart" element={<ProtectedRoute rolesAllowed={['client']}><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute rolesAllowed={['client']}><Checkout /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute rolesAllowed={['client']}><ClientProfile /></ProtectedRoute>} />
          
          {/* Rutas Privadas: Artesano */}
          <Route path="/dashboard" element={<ProtectedRoute rolesAllowed={['artisan']}><ArtisanDashboard /></ProtectedRoute>} />
          
          {/* Rutas Privadas: Administrador */}
          <Route path="/admin" element={<ProtectedRoute rolesAllowed={['admin']}><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </div>
      
      {/* Pie de página siempre visible al fondo */}
      <Footer />
    </div>
  );
}

export default App;