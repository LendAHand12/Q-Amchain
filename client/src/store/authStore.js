import { create } from "zustand";
import api from "../utils/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authStore = create((set, get) => ({
  // User state
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: false,

  // Admin state
  admin: null,
  adminAccessToken: localStorage.getItem("adminAccessToken"),
  adminRefreshToken: localStorage.getItem("adminRefreshToken"),
  isAdminAuthenticated: false,

  // User methods
  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    set({ user, accessToken, refreshToken, isAuthenticated: true });
  },

  // Admin methods
  setAdminAuth: (admin, accessToken, refreshToken) => {
    localStorage.setItem("adminAccessToken", accessToken);
    localStorage.setItem("adminRefreshToken", refreshToken);
    set({
      admin,
      adminAccessToken: accessToken,
      adminRefreshToken: refreshToken,
      isAdminAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },

  adminLogout: () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    set({
      admin: null,
      adminAccessToken: null,
      adminRefreshToken: null,
      isAdminAuthenticated: false,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return false;
    }

    try {
      const response = await api.get("/users/me");
      set({ user: response.data.data, isAuthenticated: true });
      return true;
    } catch (error) {
      get().logout();
      return false;
    }
  },

  checkAdminAuth: async () => {
    const token = localStorage.getItem("adminAccessToken");
    if (!token) {
      set({ isAdminAuthenticated: false, admin: null });
      return false;
    }

    try {
      const response = await api.get("/admin/me");
      set({ admin: response.data.data, isAdminAuthenticated: true });
      return true;
    } catch (error) {
      get().adminLogout();
      return false;
    }
  },
}));

// Note: Interceptors are now registered in api.js to work with the axios instance

export const useAuthStore = authStore;
