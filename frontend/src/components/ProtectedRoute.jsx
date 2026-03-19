// ProtectedRoute
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../store/slices/authSlice.js";

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // If not logged in → redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in → render the child route
  return <Outlet />;
};

export default ProtectedRoute;
