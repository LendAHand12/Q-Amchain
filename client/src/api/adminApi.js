import api from "../utils/api";

/**
 * Get all admins with pagination and filters
 */
export const getAdmins = async (params = {}) => {
    const { page = 1, limit = 20, search = "", roleId = "", isActive = "" } = params;
    const response = await api.get("/admin/management/admins", {
        params: { page, limit, search, roleId, isActive },
    });
    return response.data;
};

/**
 * Get admin by ID
 */
export const getAdminById = async (id) => {
    const response = await api.get(`/admin/management/admins/${id}`);
    return response.data;
};

/**
 * Create new sub-admin
 */
export const createAdmin = async (data) => {
    const response = await api.post("/admin/management/admins", data);
    return response.data;
};

/**
 * Update admin information
 */
export const updateAdmin = async (id, data) => {
    const response = await api.put(`/admin/management/admins/${id}`, data);
    return response.data;
};

/**
 * Update admin role
 */
export const updateAdminRole = async (id, roleId) => {
    const response = await api.put(`/admin/management/admins/${id}/role`, { roleId });
    return response.data;
};

/**
 * Delete admin (soft delete)
 */
export const deleteAdmin = async (id) => {
    const response = await api.delete(`/admin/management/admins/${id}`);
    return response.data;
};

/**
 * Reset admin password
 */
export const resetAdminPassword = async (id, password) => {
    const response = await api.post(`/admin/management/admins/${id}/reset-password`, { password });
    return response.data;
};
