import express from "express";
import * as adminExportController from "../controllers/adminExport.controller.js";
import { authenticateAdmin } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";

const router = express.Router();

// All routes require admin authentication
router.use(authenticateAdmin);

// Export Users
router.get("/users", checkPermission("users.view"), adminExportController.exportUsers);

// Export Transactions
router.get("/transactions", checkPermission("transactions.view"), adminExportController.exportTransactions);

export default router;
