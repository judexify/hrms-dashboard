import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
