import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import Loading from "./Loading";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      await checkAuth();
      setIsLoading(false);
    };
    verify();
  }, []);

  if (isLoading) {
    return <Loading fullScreen text="Verifying access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
