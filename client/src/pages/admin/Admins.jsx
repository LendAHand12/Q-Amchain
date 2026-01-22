import { useState, useEffect } from "react";
import { getAdmins, deleteAdmin, resetAdminPassword } from "../../api/adminApi";
import { getRoles } from "../../api/roleApi";
import { useAuthStore } from "../../store/authStore";
import { hasPermission } from "../../utils/permissions";
import PermissionGuard from "../../components/PermissionGuard";
import AdminFormModal from "../../components/AdminFormModal";

const Admins = () => {
    const { admin } = useAuthStore();
    const [admins, setAdmins] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        fetchAdmins();
    }, [currentPage, searchTerm, selectedRole, statusFilter]);

    const fetchRoles = async () => {
        try {
            const response = await getRoles();
            if (response.success) {
                setRoles(response.data);
            }
        } catch (err) {
            console.error("Failed to fetch roles:", err);
        }
    };

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAdmins({
                page: currentPage,
                limit: 20,
                search: searchTerm,
                roleId: selectedRole,
                isActive: statusFilter,
            });

            if (response.success) {
                setAdmins(response.data.admins);
                setTotalPages(response.data.pagination.pages);
                setTotal(response.data.pagination.total);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch admins");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, username) => {
        if (!confirm(`Are you sure you want to delete admin "${username}"?`)) {
            return;
        }

        try {
            const response = await deleteAdmin(id);
            if (response.success) {
                setSuccess("Admin deleted successfully");
                fetchAdmins();
                setTimeout(() => setSuccess(""), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete admin");
            setTimeout(() => setError(""), 3000);
        }
    };

    const handleResetPassword = async (id, username) => {
        const newPassword = prompt(`Enter new password for "${username}" (min 6 characters):`);
        if (!newPassword) return;

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        try {
            const response = await resetAdminPassword(id, newPassword);
            if (response.success) {
                alert(`Password reset successfully!\nNew password: ${response.data.newPassword}\n\nPlease save this password.`);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password");
            setTimeout(() => setError(""), 3000);
        }
    };

    const handleEdit = (admin) => {
        setSelectedAdmin(admin);
        setShowEditModal(true);
    };

    const handleModalClose = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setSelectedAdmin(null);
        fetchAdmins();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
                <p className="text-gray-600 mt-1">Manage sub-admin accounts and permissions</p>
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

            {/* Filters and Actions */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                        <input
                            type="text"
                            placeholder="Search by email or username..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Role Filter */}
                    <div>
                        <select
                            value={selectedRole}
                            onChange={(e) => {
                                setSelectedRole(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Roles</option>
                            {roles.map((role) => (
                                <option key={role._id} value={role._id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>

                    {/* Create Button */}
                    <div>
                        <PermissionGuard admin={admin} permission="admins.create">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                + Create Admin
                            </button>
                        </PermissionGuard>
                    </div>
                </div>
            </div>

            {/* Admins Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : admins.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No admins found</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Admin
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created By
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Last Login
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {admins.map((adminItem) => (
                                        <tr key={adminItem._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">{adminItem.username}</div>
                                                    <div className="text-sm text-gray-500">{adminItem.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                    {adminItem.roleId?.name || "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${adminItem.isActive
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {adminItem.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {adminItem.createdBy?.username || "System"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {adminItem.lastLogin ? formatDate(adminItem.lastLogin) : "Never"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <PermissionGuard admin={admin} permission="admins.update">
                                                        <button
                                                            onClick={() => handleEdit(adminItem)}
                                                            className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                            </svg>
                                                            Edit
                                                        </button>
                                                    </PermissionGuard>
                                                    <PermissionGuard admin={admin} permission="admins.update">
                                                        <button
                                                            onClick={() => handleResetPassword(adminItem._id, adminItem.username)}
                                                            className="px-3 py-1.5 bg-yellow-600 text-white text-sm font-medium rounded hover:bg-yellow-700 transition-colors flex items-center gap-1"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                            </svg>
                                                            Reset Password
                                                        </button>
                                                    </PermissionGuard>
                                                    <PermissionGuard admin={admin} permission="admins.delete">
                                                        <button
                                                            onClick={() => handleDelete(adminItem._id, adminItem.username)}
                                                            className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </PermissionGuard>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Showing {admins.length} of {total} admins
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-4 py-2">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            {showCreateModal && (
                <AdminFormModal
                    roles={roles}
                    onClose={handleModalClose}
                    onSuccess={handleModalClose}
                />
            )}
            {showEditModal && selectedAdmin && (
                <AdminFormModal
                    admin={selectedAdmin}
                    roles={roles}
                    onClose={handleModalClose}
                    onSuccess={handleModalClose}
                />
            )}
        </div>
    );
};

export default Admins;
