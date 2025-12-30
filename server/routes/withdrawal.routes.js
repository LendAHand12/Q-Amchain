import express from "express";
import { body } from "express-validator";
import * as withdrawalController from "../controllers/withdrawal.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authenticateAdmin } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";

const router = express.Router();

// User routes
router.post(
  "/request",
  authenticate,
  [
    body("amount").isFloat({ min: 1 }),
  ],
  withdrawalController.requestWithdrawal
);

router.get("/my-requests", authenticate, withdrawalController.getMyWithdrawals);

// Admin routes
router.get(
  "/",
  authenticateAdmin,
  checkPermission("withdrawals.view"),
  withdrawalController.getAllWithdrawals
);
router.put(
  "/:id/approve",
  authenticateAdmin,
  checkPermission("withdrawals.approve"),
  withdrawalController.approveWithdrawal
);
router.put(
  "/:id/reject",
  authenticateAdmin,
  checkPermission("withdrawals.reject"),
  [body("reason").notEmpty()],
  withdrawalController.rejectWithdrawal
);
router.put(
  "/:id/complete",
  authenticateAdmin,
  checkPermission("withdrawals.complete"),
  [body("transactionHash").notEmpty()],
  withdrawalController.completeWithdrawal
);

export default router;

