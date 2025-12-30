import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token to headers
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminAccessToken");
    const userToken = localStorage.getItem("accessToken");
    const isInAdminPanel = window.location.pathname.includes("/admin");

    // Check if it's an admin route
    const isAdminRoute = 
      config.url?.includes("/admin/") || 
      config.url?.includes("admin/") ||
      // If in admin panel and making requests to protected routes, use admin token
      (isInAdminPanel && 
       (config.url?.includes("/packages") || 
        config.url?.includes("/withdrawals") ||
        config.url?.includes("/orders") ||
        config.url?.includes("/users")));

    if (isAdminRoute && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken && !isAdminRoute) {
      // User routes
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const isInAdminPanel = window.location.pathname.includes("/admin");
      const isAdminRoute = 
        originalRequest.url?.includes("/admin/") || 
        originalRequest.url?.includes("admin/") ||
        // If in admin panel and making requests to protected routes, treat as admin route
        (isInAdminPanel && 
         (originalRequest.url?.includes("/packages") || 
          originalRequest.url?.includes("/withdrawals") ||
          originalRequest.url?.includes("/orders") ||
          originalRequest.url?.includes("/users")));

      if (isAdminRoute) {
        // Admin token refresh
        const refreshToken = localStorage.getItem("adminRefreshToken");
        if (refreshToken) {
          try {
            const response = await axios.post(`${API_URL}/admin/auth/refresh`, { refreshToken });
            const newToken = response.data.data.accessToken;
            localStorage.setItem("adminAccessToken", newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem("adminAccessToken");
            localStorage.removeItem("adminRefreshToken");
            window.location.href = "/admin/login";
            return Promise.reject(refreshError);
          }
        } else {
          localStorage.removeItem("adminAccessToken");
          localStorage.removeItem("adminRefreshToken");
          window.location.href = "/admin/login";
        }
      } else {
        // User token refresh
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
            const newToken = response.data.data.accessToken;
            localStorage.setItem("accessToken", newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

