import Role from "../models/Role.model.js";
import Admin from "../models/Admin.model.js";
import AdminLog from "../models/AdminLog.model.js";

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: roles,
    });
  } catch (error) {
    console.error("Get roles error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get roles",
    });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // Get admins with this role
    const admins = await Admin.find({ roleId: role._id }).select("username email isActive");

    res.json({
      success: true,
      data: {
        role,
        admins,
      },
    });
  } catch (error) {
    console.error("Get role error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get role",
    });
  }
};

export const createRole = async (req, res) => {
  try {
    const { name, description, permissions, isDefault } = req.body;

    // Check if role name exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: "Role name already exists",
      });
    }

    const role = new Role({
      name,
      description: description || "",
      permissions: permissions || [],
      isDefault: isDefault || false,
    });

    await role.save();

    // Log admin action
    await AdminLog.create({
      adminId: req.admin._id,
      action: "create_role",
      entityType: "other",
      entityId: role._id,
      details: { name, permissions },
    });

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: role,
    });
  } catch (error) {
    console.error("Create role error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create role",
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    const { name, description, permissions, isActive } = req.body;

    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: "Role name already exists",
        });
      }
      role.name = name;
    }

    if (description !== undefined) role.description = description;
    if (permissions) role.permissions = permissions;
    if (isActive !== undefined) role.isActive = isActive;

    await role.save();

    // Log admin action
    await AdminLog.create({
      adminId: req.admin._id,
      action: "update_role",
      entityType: "other",
      entityId: role._id,
      details: { name: role.name, permissions: role.permissions },
    });

    res.json({
      success: true,
      message: "Role updated successfully",
      data: role,
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update role",
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // Check if role is default
    if (role.isDefault) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete default role",
      });
    }

    // Check if any admin is using this role
    const adminsWithRole = await Admin.countDocuments({ roleId: role._id });
    if (adminsWithRole > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role. ${adminsWithRole} admin(s) are using this role`,
      });
    }

    // Soft delete
    role.isActive = false;
    await role.save();

    // Log admin action
    await AdminLog.create({
      adminId: req.admin._id,
      action: "delete_role",
      entityType: "other",
      entityId: role._id,
      details: { name: role.name },
    });

    res.json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    console.error("Delete role error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete role",
    });
  }
};

