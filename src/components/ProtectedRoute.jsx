import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, rolesPermitidos }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (rolesPermitidos && !rolesPermitidos.includes(user.rol)) {
    switch (user.rol) {
      case "empleado": return <Navigate to="/empleado/inicio" replace />;
      case "rrhh": return <Navigate to="/rrhh/inicio" replace />;
      case "gerente": return <Navigate to="/gerente/inicio" replace />;
      case "supervisor": return <Navigate to="/supervisor/inicio" replace />;
      default: return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
