import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import { authenticateAdmin } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";

const router = express.Router();

// All routes require admin authentication
router.use(authenticateAdmin);

// Get admin profile
router.get("/me", adminController.getAdminProfile);

// User management
router.get("/users", checkPermission("users.view"), adminController.getUsers);
router.get("/users/:id", checkPermission("users.view"), adminController.getUserById);
router.delete("/users/:id", checkPermission("users.delete"), adminController.deleteUser);
router.put("/users/:id/reset-2fa", checkPermission("users.reset_2fa"), adminController.reset2FA);
router.put("/users/:id/verify-email", checkPermission("users.update"), adminController.verifyUserEmail);
router.put("/users/:id/transfer", checkPermission("users.update"), adminController.transferUser);
router.put("/users/:id/wallet", checkPermission("users.update_wallet"), adminController.updateUserWallet);
router.put("/users/:id/assign-package", checkPermission("users.update"), adminController.assignPackage);
router.put("/users/:id", checkPermission("users.update"), adminController.updateUserInfo);

// Statistics
router.get("/stats", checkPermission("stats.view"), adminController.getStats);

// Transactions (Payments)
router.get("/transactions", checkPermission("transactions.view"), adminController.getTransactions);

// Logs
router.get("/logs", checkPermission("logs.view"), adminController.getLogs);

export default router;
