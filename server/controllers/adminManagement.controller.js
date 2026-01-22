import Admin from "../models/Admin.model.js";
import Role from "../models/Role.model.js";
import AdminLog from "../models/AdminLog.model.js";
import bcrypt from "bcryptjs";

/**
 * Get all admins with pagination and search
 */
export const getAdmins = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = "", roleId = "", isActive = "" } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const filter = {};

        // Search by email or username
        if (search) {
            filter.$or = [
                { email: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } },
            ];
        }

        // Filter by role
        if (roleId) {
            filter.roleId = roleId;
        }

        // Filter by active status
        if (isActive !== "") {
            filter.isActive = isActive === "true";
        }

        const admins = await Admin.find(filter)
            .select("-password -twoFactorSecret")
            .populate("roleId", "name description permissions")
            .populate("createdBy", "username email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Admin.countDocuments(filter);

        res.json({
            success: true,
            data: {
                admins,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit)),
                },
            },
        });
    } catch (error) {
        console.error("Get admins error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get admins",
        });
    }
};

/**
 * Get admin by ID with detailed information
 */
export const getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id)
            .select("-password -twoFactorSecret")
            .populate("roleId", "name description permissions")
            .populate("createdBy", "username email");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        // Get logs for this admin
        const logs = await AdminLog.find({ adminId: admin._id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            data: {
                admin,
                logs,
            },
        });
    } catch (error) {
        console.error("Get admin error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get admin",
        });
    }
};

/**
 * Create a new sub-admin (Super Admin only)
 */
export const createSubAdmin = async (req, res) => {
    try {
        const { email, username, password, roleId } = req.body;

        // Validation
        if (!email || !username || !password || !roleId) {
            return res.status(400).json({
                success: false,
                message: "Email, username, password, and role are required",
            });
        }

        // Check if email already exists
        const existingEmail = await Admin.findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        // Check if username already exists
        const existingUsername = await Admin.findOne({ username: username.toLowerCase() });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already exists",
            });
        }

        // Validate role exists and is active
        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        if (!role.isActive) {
            return res.status(400).json({
                success: false,
                message: "Cannot assign inactive role",
            });
        }

        // Prevent creating another Super Admin
        if (role.name === "Super Admin") {
            return res.status(400).json({
                success: false,
                message: "Cannot create another Super Admin via this endpoint",
            });
        }

        // Create new admin
        const admin = new Admin({
            email: email.toLowerCase().trim(),
            username: username.toLowerCase().trim(),
            password, // Will be hashed by pre-save hook
            roleId,
            createdBy: req.admin._id,
            isEmailVerified: true,
            isActive: true,
        });

        await admin.save();

        // Populate role and createdBy for response
        await admin.populate("roleId", "name description");
        await admin.populate("createdBy", "username email");

        // Log admin action
        await AdminLog.create({
            adminId: req.admin._id,
            action: "create_admin",
            entityType: "admin",
            entityId: admin._id,
            details: {
                email: admin.email,
                username: admin.username,
                role: role.name,
            },
            ipAddress: req.ip || req.connection.remoteAddress,
        });

        res.status(201).json({
            success: true,
            message: "Sub-admin created successfully",
            data: {
                admin: {
                    id: admin._id,
                    email: admin.email,
                    username: admin.username,
                    role: admin.roleId,
                    createdBy: admin.createdBy,
                    isActive: admin.isActive,
                    createdAt: admin.createdAt,
                },
            },
        });
    } catch (error) {
        console.error("Create sub-admin error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create sub-admin",
        });
    }
};

/**
 * Update admin information
 */
export const updateAdminInfo = async (req, res) => {
    try {
        const { email, username, isActive } = req.body;

        const admin = await Admin.findById(req.params.id).populate("roleId");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        // Prevent modifying Super Admin
        if (admin.roleId.name === "Super Admin") {
            return res.status(400).json({
                success: false,
                message: "Cannot modify Super Admin account",
            });
        }

        // Prevent self-modification
        if (admin._id.toString() === req.admin._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Cannot modify your own account",
            });
        }

        const changes = {};

        // Update email if provided and different
        if (email && email !== admin.email) {
            const existingEmail = await Admin.findOne({
                email: email.toLowerCase(),
                _id: { $ne: admin._id },
            });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists",
                });
            }
            changes.email = { old: admin.email, new: email.toLowerCase() };
            admin.email = email.toLowerCase().trim();
        }

        // Update username if provided and different
        if (username && username !== admin.username) {
            const existingUsername = await Admin.findOne({
                username: username.toLowerCase(),
                _id: { $ne: admin._id },
            });
            if (existingUsername) {
                return res.status(400).json({
                    success: false,
                    message: "Username already exists",
                });
            }
            changes.username = { old: admin.username, new: username.toLowerCase() };
            admin.username = username.toLowerCase().trim();
        }

        // Update active status
        if (isActive !== undefined && isActive !== admin.isActive) {
            changes.isActive = { old: admin.isActive, new: isActive };
            admin.isActive = isActive;
        }

        if (Object.keys(changes).length === 0) {
            return res.json({
                success: true,
                message: "No changes detected",
                data: admin,
            });
        }

        await admin.save();

        // Log admin action
        await AdminLog.create({
            adminId: req.admin._id,
            action: "update_admin",
            entityType: "admin",
            entityId: admin._id,
            details: {
                targetAdmin: admin.username,
                changes,
            },
            ipAddress: req.ip || req.connection.remoteAddress,
        });

        res.json({
            success: true,
            message: "Admin updated successfully",
            data: admin,
        });
    } catch (error) {
        console.error("Update admin error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update admin",
        });
    }
};

/**
 * Update admin role
 */
export const updateAdminRole = async (req, res) => {
    try {
        const { roleId } = req.body;

        if (!roleId) {
            return res.status(400).json({
                success: false,
                message: "Role ID is required",
            });
        }

        const admin = await Admin.findById(req.params.id).populate("roleId");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        // Prevent modifying Super Admin
        if (admin.roleId.name === "Super Admin") {
            return res.status(400).json({
                success: false,
                message: "Cannot modify Super Admin role",
            });
        }

        // Prevent self-modification
        if (admin._id.toString() === req.admin._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Cannot modify your own role",
            });
        }

        // Validate new role
        const newRole = await Role.findById(roleId);
        if (!newRole) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        if (!newRole.isActive) {
            return res.status(400).json({
                success: false,
                message: "Cannot assign inactive role",
            });
        }

        // Prevent assigning Super Admin role
        if (newRole.name === "Super Admin") {
            return res.status(400).json({
                success: false,
                message: "Cannot assign Super Admin role",
            });
        }

        const oldRole = admin.roleId;
        admin.roleId = roleId;
        await admin.save();

        await admin.populate("roleId", "name description permissions");

        // Log admin action
        await AdminLog.create({
            adminId: req.admin._id,
            action: "update_admin_role",
            entityType: "admin",
            entityId: admin._id,
            details: {
                targetAdmin: admin.username,
                oldRole: oldRole.name,
                newRole: newRole.name,
            },
            ipAddress: req.ip || req.connection.remoteAddress,
        });

        res.json({
            success: true,
            message: "Admin role updated successfully",
            data: admin,
        });
    } catch (error) {
        console.error("Update admin role error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update admin role",
        });
    }
};

/**
 * Delete/deactivate admin (soft delete)
 */
export const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).populate("roleId");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        // Prevent deleting Super Admin
        if (admin.roleId.name === "Super Admin") {
            return res.status(400).json({
                success: false,
                message: "Cannot delete Super Admin account",
            });
        }

        // Prevent self-deletion
        if (admin._id.toString() === req.admin._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete your own account",
            });
        }

        // Soft delete by setting isActive to false
        admin.isActive = false;
        await admin.save();

        // Log admin action
        await AdminLog.create({
            adminId: req.admin._id,
            action: "delete_admin",
            entityType: "admin",
            entityId: admin._id,
            details: {
                targetAdmin: admin.username,
                email: admin.email,
            },
            ipAddress: req.ip || req.connection.remoteAddress,
        });

        res.json({
            success: true,
            message: "Admin deleted successfully",
        });
    } catch (error) {
        console.error("Delete admin error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete admin",
        });
    }
};

/**
 * Reset admin password (Super Admin only)
 */
export const resetAdminPassword = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        const admin = await Admin.findById(req.params.id).populate("roleId");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        // Prevent resetting Super Admin password
        if (admin.roleId.name === "Super Admin") {
            return res.status(400).json({
                success: false,
                message: "Cannot reset Super Admin password",
            });
        }

        // Prevent self-password reset (should use change password endpoint)
        if (admin._id.toString() === req.admin._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Cannot reset your own password via this endpoint",
            });
        }

        // Update password (will be hashed by pre-save hook)
        admin.password = password;
        await admin.save();

        // Log admin action
        await AdminLog.create({
            adminId: req.admin._id,
            action: "reset_admin_password",
            entityType: "admin",
            entityId: admin._id,
            details: {
                targetAdmin: admin.username,
            },
            ipAddress: req.ip || req.connection.remoteAddress,
        });

        res.json({
            success: true,
            message: "Password reset successfully",
            data: {
                newPassword: password, // Return to super admin
            },
        });
    } catch (error) {
        console.error("Reset admin password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reset password",
        });
    }
};
