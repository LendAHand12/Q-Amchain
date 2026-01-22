import api from "../utils/api";

/**
 * Get all roles
 */
export const getRoles = async () => {
    const response = await api.get("/roles");
    return response.data;
};

/**
 * Get role by ID
 */
export const getRoleById = async (id) => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
};

/**
 * Create new role
 */
export const createRole = async (data) => {
    const response = await api.post("/roles", data);
    return response.data;
};

/**
 * Update role
 */
export const updateRole = async (id, data) => {
    const response = await api.put(`/roles/${id}`, data);
    return response.data;
};

/**
 * Delete role
 */
export const deleteRole = async (id) => {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
};
