import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { ROUTE_PERMISSIONS } from "../config/permissions";
import { canAccessRoute } from "../utils/permissions";
import Loading from "./Loading";

export default function AdminRoute({ children }) {
  const { admin, isAdminAuthenticated, checkAdminAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      await checkAdminAuth();
      setLoading(false);
    };
    verify();
  }, []);

  if (loading) {
    return <Loading fullScreen text="Checking admin privileges..." />;
  }

  if (!isAdminAuthenticated || !admin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check if admin has permission to access this route
  const currentPath = location.pathname;
  if (!canAccessRoute(admin, currentPath, ROUTE_PERMISSIONS)) {
    // Redirect to dashboard if no permission
    return <Navigate to="/admin" replace />;
  }

  return children;
}
