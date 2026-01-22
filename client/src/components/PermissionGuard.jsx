import { hasPermission } from "../utils/permissions";

/**
 * Higher-order component to conditionally render children based on permission
 * @param {Object} props
 * @param {Object} props.admin - Admin object
 * @param {string} props.permission - Required permission
 * @param {React.ReactNode} props.children - Children to render if has permission
 * @param {React.ReactNode} props.fallback - Fallback to render if no permission (optional)
 */
export default function PermissionGuard({ admin, permission, children, fallback = null }) {
    if (!hasPermission(admin, permission)) {
        return fallback;
    }

    return children;
}
