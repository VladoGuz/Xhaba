import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { apiFetch } from '../services/api';

/**
 * Componente UserModeration (Control de Cuentas y Moderación de Usuarios).
 * 
 * Cumple con la Historia de Usuario HU-09. Proporciona a los administradores una
 * interfaz administrativa centralizada para auditar y gestionar las cuentas registradas en Xhaba.
 * 
 * Características clave:
 * 1. Obtiene la lista completa de usuarios (clientes, artesanos, administradores) desde `/api/admin/users`.
 * 2. Muestra indicadores de estado (Activo/Baneado) y roles.
 * 3. Habilita la suspensión (baneo) de cuentas fraudulentas o de comportamiento inapropiado.
 * 4. Envía la actualización al servidor mediante una petición POST a `/api/admin/users/:id/toggle-ban`.
 */
function UserModeration() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar usuarios de la base de datos
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiFetch("/api/admin/users");
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener usuarios en panel administrador:", err);
        setError("No se pudieron cargar los usuarios de la base de datos.");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleBan = async (id) => {
    try {
      const result = await apiFetch(`/api/admin/users/${id}/toggle-ban`, {
        method: "POST"
      });
      
      // Actualizar estado local
      setUsers(users.map(u => 
        u.id === id ? { ...u, is_banned: result.is_banned } : u
      ));
      
      alert(result.message);
    } catch (err) {
      console.error("Error al cambiar estado de baneo:", err);
      alert(err.message || "No se pudo actualizar el estado del usuario.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-100 flex items-center justify-center gap-2 text-barro font-medium">
        <Loader className="w-5 h-5 animate-spin text-grana" />
        <span>Cargando lista de usuarios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start gap-3 shadow-sm max-w-xl mx-auto mt-6">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <span className="text-sm font-medium">{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Control de Usuarios (Real-time BD)</h2>
        <p className="text-gray-500 mt-1">Suspende o restaura cuentas de compradores y artesanos con datos reales.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-4 font-medium">Nombre</th>
              <th className="p-4 font-medium">Rol</th>
              <th className="p-4 font-medium">Correo</th>
              <th className="p-4 font-medium">Estado</th>
              <th className="p-4 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">No hay usuarios registrados en el sistema.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className={`transition-colors ${u.is_banned ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}>
                  <td className="p-4 font-medium text-gray-900">{u.name}</td>
                  <td className="p-4 text-gray-600 capitalize">{u.role}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${!u.is_banned ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {!u.is_banned ? 'Activo' : 'Baneado'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleBan(u.id)}
                      className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded font-medium transition-colors ${!u.is_banned ? 'text-white bg-red-600 hover:bg-red-700' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}`}
                    >
                      {!u.is_banned ? <><ShieldAlert className="w-4 h-4" /> Banear</> : <><CheckCircle className="w-4 h-4" /> Restaurar</>}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserModeration;
