import express from "express";
import { body } from "express-validator";
import * as adminAuthController from "../controllers/adminAuth.controller.js";
import { authenticateAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin Login
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty(),
  ],
  adminAuthController.login
);

// Admin 2FA Verify
router.post("/2fa/verify", adminAuthController.verify2FA);

// Admin 2FA Setup
router.post("/2fa/setup", authenticateAdmin, adminAuthController.setup2FA);

// Admin 2FA Disable
router.post("/2fa/disable", authenticateAdmin, adminAuthController.disable2FA);

// Refresh Token
router.post("/refresh", adminAuthController.refreshToken);

// Logout
router.post("/logout", authenticateAdmin, adminAuthController.logout);

export default router;

