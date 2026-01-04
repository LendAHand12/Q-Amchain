import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import Loading from "./Loading";

export default function AdminRoute({ children }) {
  const { admin, isAdminAuthenticated, checkAdminAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

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

  return children;
}

