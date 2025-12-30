import express from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get current user profile
router.get("/me", authenticate, userController.getProfile);

// Update profile
router.put("/me", authenticate, userController.updateProfile);

// Update refCode
router.put("/refcode", authenticate, userController.updateRefCode);

// Get dashboard stats
router.get("/dashboard", authenticate, userController.getDashboard);

// Get referral tree
router.get("/referral-tree", authenticate, userController.getReferralTree);

// Get my packages
router.get("/packages", authenticate, userController.getMyPackages);

// Get commission history
router.get("/commissions", authenticate, userController.getCommissions);

// Get transaction history
router.get("/transactions", authenticate, userController.getTransactions);

export default router;
