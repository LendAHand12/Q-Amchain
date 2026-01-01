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
    body("email").isEmail().trim(),
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .matches(/^[a-z0-9]+$/)
      .withMessage("Username must be lowercase alphanumeric only (a-z, 0-9)")
      .isLength({ min: 6, max: 20 })
      .withMessage("Username must be between 6 and 20 characters"),
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
    body("fullName")
      .notEmpty()
      .withMessage("Full name is required")
      .trim()
      .isLength({ max: 100 })
      .withMessage("Full name must be less than 100 characters"),
    body("phoneNumber")
      .notEmpty()
      .withMessage("Phone number is required")
      .trim()
      .isLength({ max: 20 })
      .withMessage("Phone number must be less than 20 characters"),
    body("identityNumber")
      .notEmpty()
      .withMessage("Identity number is required")
      .trim()
      .isLength({ max: 50 })
      .withMessage("Identity number must be less than 50 characters"),
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

// Forgot Password
router.post(
  "/forgot-password",
  [body("email").isEmail().trim()],
  handleValidationErrors,
  authController.forgotPassword
);

// Reset Password
router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Token is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  handleValidationErrors,
  authController.resetPassword
);

// Login
router.post(
  "/login",
  [body("email").isEmail().trim(), body("password").notEmpty()],
  handleValidationErrors,
  authController.login
);

// 2FA Setup
router.post("/2fa/setup", authenticate, authController.setup2FA);

// 2FA Verify Setup (after scanning QR code)
router.post(
  "/2fa/verify-setup",
  authenticate,
  [body("token").notEmpty().withMessage("2FA token is required")],
  handleValidationErrors,
  authController.verify2FASetup
);

// 2FA Verify (during login)
router.post("/2fa/verify", authController.verify2FA);

// 2FA Disable
router.post("/2fa/disable", authenticate, authController.disable2FA);

// Refresh Token
router.post("/refresh", authController.refreshToken);

// Logout
router.post("/logout", authenticate, authController.logout);

export default router;
