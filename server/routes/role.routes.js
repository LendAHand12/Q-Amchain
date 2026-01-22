import express from "express";
import { body } from "express-validator";
import * as roleController from "../controllers/role.controller.js";
import { authenticateAdmin } from "../middleware/auth.middleware.js";
import { isSuperAdmin } from "../middleware/superAdmin.middleware.js";

const router = express.Router();

// All routes require admin authentication AND super admin privileges
router.use(authenticateAdmin);
router.use(isSuperAdmin);

// Get all roles
router.get("/", roleController.getRoles);

// Get role by ID
router.get("/:id", roleController.getRoleById);

// Create role
router.post(
  "/",
  [
    body("name").notEmpty().trim(),
    body("permissions").isArray(),
  ],
  roleController.createRole
);

// Update role
router.put(
  "/:id",
  roleController.updateRole
);

// Delete role
router.delete(
  "/:id",
  roleController.deleteRole
);

export default router;

