import  React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, roles } = useAuth();

  console.log("DEBUG ProtectedRoute");
  console.log("user:", user);
  console.log("roles:", roles);
  console.log("allowedRoles:", allowedRoles);

  if (!user) return <Navigate to="/login" />; // não logado

  if (allowedRoles && !roles.some(r => allowedRoles.includes(r))) {
    return <Navigate to="/login" />; // role não permitida
  }

  return children;
};

export default ProtectedRoute;