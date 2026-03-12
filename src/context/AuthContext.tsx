import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// Funções utilitárias para pegar dados do localStorage
export const getUser = () => {
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
};

export const getRoles = () => {
  const saved = localStorage.getItem("roles");
  return saved ? JSON.parse(saved) : [];
};

// Tipo do contexto
interface AuthContextType {
  user: any;
  roles: string[];
  setUser: (user: any) => void;
  setRoles: (roles: string[]) => void;
  logout: () => void;
}

// Criação do contexto
const AuthContext = createContext<AuthContextType>({
  user: null,
  roles: [],
  setUser: () => {},
  setRoles: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(getUser());
  const [roles, setRoles] = useState(getRoles());

  useEffect(() => {
    setUser(getUser());
    setRoles(getRoles());
  }, []);

  // Função de logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("roles");
    setUser(null);
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ user, roles, setUser, setRoles, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => useContext(AuthContext);