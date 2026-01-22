import express from "express";
import { body } from "express-validator";
import * as adminManagementController from "../controllers/adminManagement.controller.js";
import { authenticateAdmin } from "../middleware/auth.middleware.js";
import { isSuperAdmin } from "../middleware/superAdmin.middleware.js";

const router = express.Router();

// All routes require admin authentication AND super admin privileges
router.use(authenticateAdmin);
router.use(isSuperAdmin);

// Get all admins
router.get("/admins", adminManagementController.getAdmins);

// Get admin by ID
router.get("/admins/:id", adminManagementController.getAdminById);

// Create sub-admin
router.post(
    "/admins",
    [
        body("email").isEmail().normalizeEmail(),
        body("username").notEmpty().trim(),
        body("password").isLength({ min: 6 }),
        body("roleId").notEmpty(),
    ],
    adminManagementController.createSubAdmin
);

// Update admin info
router.put(
    "/admins/:id",
    adminManagementController.updateAdminInfo
);

// Update admin role
router.put(
    "/admins/:id/role",
    [body("roleId").notEmpty()],
    adminManagementController.updateAdminRole
);

// Delete admin
router.delete(
    "/admins/:id",
    adminManagementController.deleteAdmin
);

// Reset admin password
router.post(
    "/admins/:id/reset-password",
    [body("password").isLength({ min: 6 })],
    adminManagementController.resetAdminPassword
);

export default router;
