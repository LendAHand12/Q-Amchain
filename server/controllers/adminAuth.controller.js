import Admin from "../models/Admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateSecret, verifyToken, generateQRCode } from "../utils/twoFactor.service.js";

// Generate JWT tokens for admin
const generateAdminTokens = (adminId) => {
  const accessToken = jwt.sign({ adminId, type: "admin" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "1d",
  });
  const refreshToken = jwt.sign({ adminId, type: "admin" }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
  });
  return { accessToken, refreshToken };
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).populate("roleId");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Admin account is inactive",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // If 2FA is enabled, require 2FA verification
    if (admin.isTwoFactorEnabled) {
      return res.status(200).json({
        success: true,
        requires2FA: true,
        message: "2FA verification required",
        tempToken: jwt.sign(
          { adminId: admin._id, type: "admin", temp: true },
          process.env.JWT_SECRET,
          {
            expiresIn: "5m",
          }
        ),
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateAdminTokens(admin._id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
        admin: {
          id: admin._id,
          email: admin.email,
          username: admin.username,
          role: admin.roleId,
          isTwoFactorEnabled: admin.isTwoFactorEnabled,
        },
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

export const verify2FA = async (req, res) => {
  try {
    const { token, tempToken } = req.body;

    if (!tempToken) {
      return res.status(400).json({
        success: false,
        message: "Temporary token required",
      });
    }

    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    if (!decoded.temp || decoded.type !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Invalid temporary token",
      });
    }

    const admin = await Admin.findById(decoded.adminId).populate("roleId");

    if (!admin || !admin.isTwoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: "2FA not enabled for this admin",
      });
    }

    const isValid = verifyToken(admin.twoFactorSecret, token);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid 2FA token",
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateAdminTokens(admin._id);

    res.json({
      success: true,
      message: "2FA verification successful",
      data: {
        accessToken,
        refreshToken,
        admin: {
          id: admin._id,
          email: admin.email,
          username: admin.username,
          role: admin.roleId,
          isTwoFactorEnabled: admin.isTwoFactorEnabled,
        },
      },
    });
  } catch (error) {
    console.error("Admin 2FA verification error:", error);
    res.status(500).json({
      success: false,
      message: "2FA verification failed",
    });
  }
};

export const setup2FA = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (admin.isTwoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: "2FA is already enabled",
      });
    }

    const secret = generateSecret(admin.username);
    // Save secret but don't enable 2FA yet - wait for verification
    admin.twoFactorSecret = secret.base32;
    // Don't set isTwoFactorEnabled = true yet
    await admin.save();

    const qrCode = await generateQRCode(secret.otpauth_url);

    res.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode,
        manualEntryKey: secret.base32,
      },
    });
  } catch (error) {
    console.error("Admin 2FA setup error:", error);
    res.status(500).json({
      success: false,
      message: "2FA setup failed",
    });
  }
};

export const verify2FASetup = async (req, res) => {
  try {
    const { token } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (!admin.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: "2FA setup not initiated. Please setup 2FA first.",
      });
    }

    if (admin.isTwoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: "2FA is already enabled",
      });
    }

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "2FA token is required",
      });
    }

    // Verify the token
    const isValid = verifyToken(admin.twoFactorSecret, token);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid 2FA token. Please try again.",
      });
    }

    // Enable 2FA after successful verification
    admin.isTwoFactorEnabled = true;
    await admin.save();

    res.json({
      success: true,
      message: "2FA enabled successfully",
    });
  } catch (error) {
    console.error("Admin 2FA setup verification error:", error);
    res.status(500).json({
      success: false,
      message: "2FA setup verification failed",
    });
  }
};

export const disable2FA = async (req, res) => {
  try {
    const { password, token } = req.body;

    const admin = await Admin.findById(req.admin._id);

    if (!admin.isTwoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: "2FA is not enabled",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Verify 2FA token
    const isValid = verifyToken(admin.twoFactorSecret, token);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid 2FA token",
      });
    }

    admin.isTwoFactorEnabled = false;
    admin.twoFactorSecret = null;
    await admin.save();

    res.json({
      success: true,
      message: "2FA disabled successfully",
    });
  } catch (error) {
    console.error("Admin 2FA disable error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to disable 2FA",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (decoded.type !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const { accessToken } = generateAdminTokens(decoded.adminId);

    res.json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

export const logout = async (req, res) => {
  res.json({
    success: true,
    message: "Logout successful",
  });
};
