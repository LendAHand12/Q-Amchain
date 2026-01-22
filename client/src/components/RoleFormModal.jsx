import { useState } from "react";
import { createRole, updateRole } from "../api/roleApi";

// Available permissions grouped by category
const PERMISSION_CATEGORIES = {
    "User Management": [
        { value: "users.view", label: "View Users" },
        { value: "users.update", label: "Update Users" },
        { value: "users.delete", label: "Delete Users" },
    ],
    "Package Management": [
        { value: "packages.view", label: "View Packages" },
        { value: "packages.create", label: "Create Packages" },
        { value: "packages.update", label: "Update Packages" },
        { value: "packages.delete", label: "Delete Packages" },
    ],
    "Transaction Management": [
        { value: "transactions.view", label: "View Transactions" },
    ],
    "Withdrawal Management": [
        { value: "withdrawals.view", label: "View Withdrawals" },
        { value: "withdrawals.approve", label: "Approve Withdrawals" },
        { value: "withdrawals.reject", label: "Reject Withdrawals" },
    ],
    "Admin Management": [
        { value: "admins.view", label: "View Admins" },
        { value: "admins.create", label: "Create Admins" },
        { value: "admins.update", label: "Update Admins" },
        { value: "admins.delete", label: "Delete Admins" },
    ],
    "Role Management": [
        { value: "roles.view", label: "View Roles" },
        { value: "roles.create", label: "Create Roles" },
        { value: "roles.update", label: "Update Roles" },
        { value: "roles.delete", label: "Delete Roles" },
    ],
    "Blog Management": [
        { value: "blogs.view", label: "View Blogs" },
        { value: "blogs.create", label: "Create Blogs" },
        { value: "blogs.update", label: "Update Blogs" },
        { value: "blogs.delete", label: "Delete Blogs" },
    ],
    "Logs": [
        { value: "logs.view", label: "View Logs" },
    ],
};

const RoleFormModal = ({ role = null, onClose, onSuccess }) => {
    const isEdit = !!role;

    const [formData, setFormData] = useState({
        name: role?.name || "",
        description: role?.description || "",
        permissions: role?.permissions || [],
        isActive: role?.isActive ?? true,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.permissions.length === 0) {
            setError("Please select at least one permission");
            return;
        }

        setLoading(true);

        try {
            if (isEdit) {
                await updateRole(role._id, formData);
            } else {
                await createRole(formData);
            }

            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isEdit ? "update" : "create"} role`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handlePermissionToggle = (permission) => {
        setFormData((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter((p) => p !== permission)
                : [...prev.permissions, permission],
        }));
    };

    const handleCategoryToggle = (category) => {
        const categoryPermissions = PERMISSION_CATEGORIES[category].map((p) => p.value);
        const allSelected = categoryPermissions.every((p) =>
            formData.permissions.includes(p)
        );

        if (allSelected) {
            // Deselect all in category
            setFormData((prev) => ({
                ...prev,
                permissions: prev.permissions.filter((p) => !categoryPermissions.includes(p)),
            }));
        } else {
            // Select all in category
            setFormData((prev) => ({
                ...prev,
                permissions: [...new Set([...prev.permissions, ...categoryPermissions])],
            }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEdit ? "Edit Role" : "Create New Role"}
                    </h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-4">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={role?.isDefault}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                            placeholder="e.g., Content Manager, Accountant"
                        />
                        {role?.isDefault && (
                            <p className="mt-1 text-xs text-gray-500">
                                Default role name cannot be changed
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Brief description of this role"
                        />
                    </div>

                    {/* Permissions */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Permissions * ({formData.permissions.length} selected)
                        </label>

                        <div className="space-y-4 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                            {Object.entries(PERMISSION_CATEGORIES).map(([category, permissions]) => {
                                const allSelected = permissions.every((p) =>
                                    formData.permissions.includes(p.value)
                                );
                                const someSelected = permissions.some((p) =>
                                    formData.permissions.includes(p.value)
                                );

                                return (
                                    <div key={category} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                                        {/* Category Header */}
                                        <div className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                checked={allSelected}
                                                onChange={() => handleCategoryToggle(category)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label className="ml-2 text-sm font-semibold text-gray-900">
                                                {category}
                                            </label>
                                            {someSelected && !allSelected && (
                                                <span className="ml-2 text-xs text-blue-600">(partial)</span>
                                            )}
                                        </div>

                                        {/* Permissions in Category */}
                                        <div className="ml-6 space-y-2">
                                            {permissions.map((permission) => (
                                                <label
                                                    key={permission.value}
                                                    className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.permissions.includes(permission.value)}
                                                        onChange={() => handlePermissionToggle(permission.value)}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">
                                                        {permission.label}
                                                    </span>
                                                    <code className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                        {permission.value}
                                                    </code>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Active Status (only for edit) */}
                    {isEdit && !role?.isDefault && (
                        <div className="mb-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700">
                                    Active
                                </span>
                            </label>
                            <p className="mt-1 ml-6 text-xs text-gray-500">
                                Inactive roles cannot be assigned to admins
                            </p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : isEdit ? "Update Role" : "Create Role"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoleFormModal;
