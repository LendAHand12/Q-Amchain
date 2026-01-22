import { useState, useEffect } from "react";
import { getRoles, deleteRole } from "../../api/roleApi";
import { useAuthStore } from "../../store/authStore";
import PermissionGuard from "../../components/PermissionGuard";
import RoleFormModal from "../../components/RoleFormModal";

const Roles = () => {
    const { admin } = useAuthStore();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getRoles();
            if (response.success) {
                setRoles(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch roles");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Are you sure you want to delete role "${name}"?`)) {
            return;
        }

        try {
            const response = await deleteRole(id);
            if (response.success) {
                setSuccess("Role deleted successfully");
                fetchRoles();
                setTimeout(() => setSuccess(""), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete role");
            setTimeout(() => setError(""), 3000);
        }
    };

    const handleEdit = (role) => {
        setSelectedRole(role);
        setShowEditModal(true);
    };

    const handleModalClose = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setSelectedRole(null);
        fetchRoles();
    };

    const groupPermissionsByCategory = (permissions) => {
        const grouped = {};
        permissions.forEach((perm) => {
            const [category] = perm.split(".");
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(perm);
        });
        return grouped;
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
                    <p className="text-gray-600 mt-1">Manage roles and permissions</p>
                </div>
                <PermissionGuard admin={admin} permission="roles.create">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        + Create Role
                    </button>
                </PermissionGuard>
            </div>

            {/* Alerts */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    {success}
                </div>
            )}

            {/* Roles Grid */}
            {loading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : roles.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No roles found</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role) => {
                        const groupedPermissions = groupPermissionsByCategory(role.permissions);
                        const permissionCount = role.permissions.length;

                        return (
                            <div
                                key={role._id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
                                        {role.description && (
                                            <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                                        )}
                                    </div>
                                    <div className="flex space-x-1">
                                        {role.isDefault && (
                                            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                                Default
                                            </span>
                                        )}
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-full ${role.isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {role.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="mb-4 pb-4 border-b border-gray-200">
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">{permissionCount}</span> permissions
                                    </div>
                                </div>

                                {/* Permissions Preview */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions:</h4>
                                    <div className="space-y-2">
                                        {Object.keys(groupedPermissions)
                                            .slice(0, 3)
                                            .map((category) => (
                                                <div key={category} className="text-sm">
                                                    <span className="font-medium text-gray-700 capitalize">
                                                        {category}:
                                                    </span>
                                                    <span className="text-gray-600 ml-1">
                                                        {groupedPermissions[category].length} permissions
                                                    </span>
                                                </div>
                                            ))}
                                        {Object.keys(groupedPermissions).length > 3 && (
                                            <div className="text-sm text-gray-500">
                                                +{Object.keys(groupedPermissions).length - 3} more categories
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                                    <PermissionGuard admin={admin} permission="roles.update">
                                        <button
                                            onClick={() => handleEdit(role)}
                                            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                    </PermissionGuard>
                                    {!role.isDefault && (
                                        <PermissionGuard admin={admin} permission="roles.delete">
                                            <button
                                                onClick={() => handleDelete(role._id, role.name)}
                                                className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </PermissionGuard>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
            {showCreateModal && (
                <RoleFormModal onClose={handleModalClose} onSuccess={handleModalClose} />
            )}
            {showEditModal && selectedRole && (
                <RoleFormModal
                    role={selectedRole}
                    onClose={handleModalClose}
                    onSuccess={handleModalClose}
                />
            )}
        </div>
    );
};

export default Roles;
