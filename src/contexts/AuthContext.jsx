import React, { createContext, useContext, useState, useEffect } from 'react';

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  MANAGER: 'MANAGER',
  USER: 'USER'
};

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (credentials) => {
    // Simulação de login - Depois substituir por chamada real à API
    if (credentials.email && credentials.password) {
      // Usuário de exemplo
      const loggedUser = {
        id: '1',
        name: 'Usuário Teste',
        email: credentials.email,
        role: ROLES.USER,
        building: 'Edifício Teste',
        block: 'A',
        apartment: '101'
      };

      setUser(loggedUser);
      return loggedUser;
    }
    throw new Error('Credenciais inválidas');
  };

  const register = async (userData) => {
    // Simulação de registro - Depois substituir por chamada real à API
    if (userData.email && userData.password) {
      // Simula sucesso no registro
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...userData
      };
    }
    throw new Error('Dados inválidos');
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        register,
        ROLES,
        isAuthenticated: !!user 
      }}
    >
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