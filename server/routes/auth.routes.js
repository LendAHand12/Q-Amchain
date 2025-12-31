import express from "express";
import { body } from "express-validator";
import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { handleValidationErrors } from "../middleware/validation.middleware.js";

const router = express.Router();

// Register
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("username")
      .matches(/^[a-z0-9]+$/)
      .isLength({ min: 3, max: 20 }),
    body("password").isLength({ min: 6 }),
    body("referrerCode")
      .notEmpty()
      .withMessage("Referrer code is required")
      .trim()
      .customSanitizer((value) => value.toLowerCase()),
    body("walletAddress")
      .notEmpty()
      .withMessage("Wallet address is required")
      .matches(/^0x[a-fA-F0-9]{40}$/)
      .withMessage("Invalid BEP20 wallet address format"),
    body("fullName").optional().trim().isLength({ max: 100 }),
    body("phoneNumber").optional().trim().isLength({ max: 20 }),
    body("identityNumber").optional().trim().isLength({ max: 50 }),
  ],
  handleValidationErrors,
  authController.register
);

// Check Referrer Code
router.get("/check-referrer", authController.checkReferrerCode);

// Verify Email
router.get("/verify-email", authController.verifyEmail);

// Resend Verification Email
router.post("/resend-verification", authController.resendVerification);

// Login
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  handleValidationErrors,
  authController.login
);

// 2FA Setup
router.post("/2fa/setup", authenticate, authController.setup2FA);

// 2FA Verify (during login)
router.post("/2fa/verify", authController.verify2FA);

// 2FA Disable
router.post("/2fa/disable", authenticate, authController.disable2FA);

// Refresh Token
router.post("/refresh", authController.refreshToken);

// Logout
router.post("/logout", authenticate, authController.logout);

export default router;
