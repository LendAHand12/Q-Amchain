import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Admin from "../models/Admin.model.js";

// Authenticate user (for user routes)
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's a user token
    if (decoded.type === "admin") {
      return res.status(403).json({ success: false, message: "Admin token not allowed here" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "User not found or inactive" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Authenticate admin (for admin routes)
export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's an admin token
    if (decoded.type !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const admin = await Admin.findById(decoded.adminId).select("-password").populate("roleId");

    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: "Admin not found or inactive" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const require2FA = (req, res, next) => {
  const user = req.user || req.admin;
  if (user.isTwoFactorEnabled && !user.twoFactorVerified) {
    return res.status(403).json({ success: false, message: "2FA verification required" });
  }
  next();
};
