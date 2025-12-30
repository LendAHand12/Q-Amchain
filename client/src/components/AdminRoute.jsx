import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAdminAuthenticated || !admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

