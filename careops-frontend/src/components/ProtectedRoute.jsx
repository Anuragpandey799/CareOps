import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // ⛔ Don't redirect while checking auth
  if (loading) return null;

  if (!user) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
