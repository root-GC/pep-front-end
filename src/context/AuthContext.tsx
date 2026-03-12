import React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getUser, getRoles } from "../utils/auth.js";

interface AuthContextType {
  user: any;
  roles: string[];
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, roles: [], setUser: () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(getUser());
  const [roles, setRoles] = useState(getRoles());

  useEffect(() => {
    setUser(getUser());
    setRoles(getRoles());
  }, []);

  return <AuthContext.Provider value={{ user, roles, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);