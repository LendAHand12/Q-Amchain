/**
 * Permission utility functions
 */

/**
 * Check if admin has a specific permission
 * @param {Object} admin - Admin object with roleId populated
 * @param {string} permission - Permission to check (e.g., 'users.view')
 * @returns {boolean}
 */
export const hasPermission = (admin, permission) => {
    if (!admin || !admin.roleId) return false;

    // Super Admin has all permissions
    if (admin.roleId.name === 'Super Admin') return true;

    // No permission required
    if (!permission) return true;

    // Check if role has the permission
    const permissions = admin.roleId.permissions || [];
    return permissions.includes(permission);
};

/**
 * Check if admin has any of the specified permissions
 * @param {Object} admin - Admin object with roleId populated
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean}
 */
export const hasAnyPermission = (admin, permissions) => {
    if (!admin || !admin.roleId) return false;

    // Super Admin has all permissions
    if (admin.roleId.name === 'Super Admin') return true;

    // Check if role has any of the permissions
    const rolePermissions = admin.roleId.permissions || [];
    return permissions.some(permission => rolePermissions.includes(permission));
};

/**
 * Check if admin has all of the specified permissions
 * @param {Object} admin - Admin object with roleId populated
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean}
 */
export const hasAllPermissions = (admin, permissions) => {
    if (!admin || !admin.roleId) return false;

    // Super Admin has all permissions
    if (admin.roleId.name === 'Super Admin') return true;

    // Check if role has all of the permissions
    const rolePermissions = admin.roleId.permissions || [];
    return permissions.every(permission => rolePermissions.includes(permission));
};

/**
 * Check if admin is Super Admin
 * @param {Object} admin - Admin object with roleId populated
 * @returns {boolean}
 */
export const isSuperAdmin = (admin) => {
    if (!admin || !admin.roleId) return false;
    return admin.roleId.name === 'Super Admin';
};

/**
 * Get filtered menu items based on admin permissions
 * @param {Object} admin - Admin object with roleId populated
 * @param {Array} menuItems - Array of menu items with permission property
 * @returns {Array} Filtered menu items
 */
export const getVisibleMenuItems = (admin, menuItems) => {
    if (!admin || !admin.roleId) return [];

    return menuItems.filter(item => {
        // Super admin only items
        if (item.superAdminOnly && !isSuperAdmin(admin)) {
            return false;
        }

        // Check permission
        if (item.permission) {
            return hasPermission(admin, item.permission);
        }

        // No permission required
        return true;
    });
};

/**
 * Check if admin can access a route
 * @param {Object} admin - Admin object with roleId populated
 * @param {string} path - Route path
 * @param {Object} routePermissions - Route permissions mapping
 * @returns {boolean}
 */
export const canAccessRoute = (admin, path, routePermissions) => {
    if (!admin || !admin.roleId) return false;

    const requiredPermission = routePermissions[path];

    // No permission required for this route
    if (!requiredPermission) return true;

    return hasPermission(admin, requiredPermission);
};
