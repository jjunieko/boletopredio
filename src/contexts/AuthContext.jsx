import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  MANAGER: 'MANAGER',
  USER: 'USER'
};

export const AuthProvider = ({ children }) => {
  // Development user for testing - change role here to test different permissions
  const devUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    document: '123.456.789-00',
    block: 'A',
    apartment: '101',
    role: ROLES.MANAGER, // Changed to MANAGER to access Bills
    building: 'Solar Building'
  };

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : devUser;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, ROLES }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider; 