import React, { useState } from 'react';
import { ShieldAlert, CheckCircle } from 'lucide-react';

function UserModeration() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Juan Cliente', role: 'Cliente', email: 'juan@email.com', status: 'active' },
    { id: 2, name: 'Estafador123', role: 'Artesano', email: 'fake@email.com', status: 'active' },
  ]);

  const toggleBan = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'active' ? 'banned' : 'active';
        alert(`Usuario ${newStatus === 'banned' ? 'baneado (Token JWT revocado)' : 'restaurado'} exitosamente (HU-09)`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Control de Usuarios</h2>
        <p className="text-gray-500 mt-1">Suspende o banea cuentas con reportes de fraude o mal comportamiento.</p>
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
            {users.map((u) => (
              <tr key={u.id} className={`transition-colors ${u.status === 'banned' ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                <td className="p-4 font-medium text-gray-900">{u.name}</td>
                <td className="p-4 text-gray-600">{u.role}</td>
                <td className="p-4 text-gray-600">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.status === 'active' ? 'Activo' : 'Baneado'}
                  </span>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => toggleBan(u.id)}
                    className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded transition-colors ${u.status === 'active' ? 'text-white bg-red-600 hover:bg-red-700' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}`}
                  >
                    {u.status === 'active' ? <><ShieldAlert className="w-4 h-4" /> Banear</> : <><CheckCircle className="w-4 h-4" /> Restaurar</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserModeration;
