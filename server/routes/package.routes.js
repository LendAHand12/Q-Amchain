import express from "express";
import * as packageController from "../controllers/package.controller.js";
import { authenticateAdmin } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";

const router = express.Router();

// Public routes
router.get("/", packageController.getPackages);
router.get("/:id", packageController.getPackageById);

// Admin routes
router.post(
  "/",
  authenticateAdmin,
  checkPermission("packages.create"),
  packageController.createPackage
);
router.put(
  "/:id",
  authenticateAdmin,
  checkPermission("packages.update"),
  packageController.updatePackage
);
router.delete(
  "/:id",
  authenticateAdmin,
  checkPermission("packages.delete"),
  packageController.deletePackage
);

export default router;
