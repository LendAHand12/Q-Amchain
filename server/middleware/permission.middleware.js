import Admin from "../models/Admin.model.js";
import Role from "../models/Role.model.js";

export const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.admin) {
        return res.status(401).json({
          success: false,
          message: "Admin authentication required",
        });
      }

      // Get admin with role and permissions
      const admin = await Admin.findById(req.admin._id).populate("roleId");
      if (!admin || !admin.isActive) {
        return res.status(401).json({
          success: false,
          message: "Admin not found or inactive",
        });
      }

      const role = await Role.findById(admin.roleId._id);
      if (!role || !role.isActive) {
        return res.status(403).json({
          success: false,
          message: "Role not found or inactive",
        });
      }

      // Check if role has the required permission
      if (!role.permissions.includes(requiredPermission)) {
        return res.status(403).json({
          success: false,
          message: `Permission denied. Required: ${requiredPermission}`,
        });
      }

      req.adminRole = role;
      next();
    } catch (error) {
      console.error("Permission check error:", error);
      return res.status(500).json({
        success: false,
        message: "Permission check failed",
      });
    }
  };
};

export const checkAnyPermission = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      if (!req.admin) {
        return res.status(401).json({
          success: false,
          message: "Admin authentication required",
        });
      }

      const admin = await Admin.findById(req.admin._id).populate("roleId");
      if (!admin || !admin.isActive) {
        return res.status(401).json({
          success: false,
          message: "Admin not found or inactive",
        });
      }

      const role = await Role.findById(admin.roleId._id);
      if (!role || !role.isActive) {
        return res.status(403).json({
          success: false,
          message: "Role not found or inactive",
        });
      }

      // Check if role has any of the required permissions
      const hasPermission = requiredPermissions.some((permission) =>
        role.permissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: "Permission denied",
        });
      }

      req.adminRole = role;
      next();
    } catch (error) {
      console.error("Permission check error:", error);
      return res.status(500).json({
        success: false,
        message: "Permission check failed",
      });
    }
  };
};

