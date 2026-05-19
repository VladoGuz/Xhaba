import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Roles: null (guest), 'client', 'artisan', 'admin'
  const [user, setUser] = useState(null);

  const loginAsClient = () => {
    setUser({ role: 'client', name: 'Juan Cliente', id: 101 });
  };

  const loginAsArtisan = () => {
    setUser({ role: 'artisan', name: 'Familia Mendoza', id: 1 });
  };

  const loginAsAdmin = () => {
    setUser({ role: 'admin', name: 'Admin Principal', id: 999 });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginAsClient, loginAsArtisan, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
