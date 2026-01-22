import Admin from "../models/Admin.model.js";
import Role from "../models/Role.model.js";

/**
 * Middleware to check if the authenticated admin is a Super Admin
 * Super Admin is identified by having a role with name "Super Admin"
 */
export const isSuperAdmin = async (req, res, next) => {
    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Admin authentication required",
            });
        }

        // Get admin with populated role
        const admin = await Admin.findById(req.admin._id).populate("roleId");

        if (!admin || !admin.isActive) {
            return res.status(401).json({
                success: false,
                message: "Admin not found or inactive",
            });
        }

        if (!admin.roleId) {
            return res.status(403).json({
                success: false,
                message: "Admin role not found",
            });
        }

        // Check if role name is "Super Admin"
        if (admin.roleId.name !== "Super Admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Super Admin privileges required.",
            });
        }

        // Attach role to request for later use
        req.adminRole = admin.roleId;
        next();
    } catch (error) {
        console.error("Super admin check error:", error);
        return res.status(500).json({
            success: false,
            message: "Super admin verification failed",
        });
    }
};
