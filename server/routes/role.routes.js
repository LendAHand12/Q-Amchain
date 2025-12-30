import express from "express";
import { body } from "express-validator";
import * as roleController from "../controllers/role.controller.js";
import { authenticateAdmin } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";

const router = express.Router();

// All routes require admin authentication
router.use(authenticateAdmin);

// Get all roles
router.get("/", checkPermission("roles.view"), roleController.getRoles);

// Get role by ID
router.get("/:id", checkPermission("roles.view"), roleController.getRoleById);

// Create role
router.post(
  "/",
  checkPermission("roles.create"),
  [
    body("name").notEmpty().trim(),
    body("permissions").isArray(),
  ],
  roleController.createRole
);

// Update role
router.put(
  "/:id",
  checkPermission("roles.update"),
  roleController.updateRole
);

// Delete role
router.delete(
  "/:id",
  checkPermission("roles.delete"),
  roleController.deleteRole
);

export default router;

