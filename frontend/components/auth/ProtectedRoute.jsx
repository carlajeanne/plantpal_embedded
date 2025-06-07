import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = token && token !== "undefined" && token !== "null";

  return isAuthenticated ? <Outlet /> : <Navigate to="/Login" replace />;
};

export default ProtectedRoute;