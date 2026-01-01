import User from "../models/User.model.js";
import Transaction from "../models/Transaction.model.js";
import Withdrawal from "../models/Withdrawal.model.js";
import Commission from "../models/Commission.model.js";
import Package from "../models/Package.model.js";
import AdminLog from "../models/AdminLog.model.js";
import Admin from "../models/Admin.model.js";
import { calculateCommissions } from "../utils/commission.service.js";

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id)
      .select("-password -twoFactorSecret")
      .populate("roleId", "name permissions");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error("Get admin profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get admin profile",
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {
      // Include all users (including deleted ones)
      ...(search && {
        $or: [
          { email: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
          { refCode: { $regex: search, $options: "i" } },
        ],
      }),
    };

    const users = await User.find(filter)
      .select("-password -twoFactorSecret")
      .populate("parentId", "username email refCode")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    // Get purchased package names for each user (from transactions)
    const userIds = users.map((u) => u._id);
    const purchasedPackages = await Transaction.find({
      userId: { $in: userIds },
      type: "payment",
      status: "completed",
    })
      .populate("packageId", "name")
      .select("userId packageId");

    // Get assigned packages
    const usersWithAssignedPackages = await User.find({
      _id: { $in: userIds },
      assignedPackageId: { $ne: null },
    })
      .populate("assignedPackageId", "name")
      .select("_id assignedPackageId isPackageAssigned");

    // Create a map of userId -> packageName and isAssigned
    const packageMap = {};
    purchasedPackages.forEach((tx) => {
      if (tx.packageId) {
        packageMap[tx.userId.toString()] = {
          name: tx.packageId.name,
          isAssigned: false,
        };
      }
    });

    usersWithAssignedPackages.forEach((user) => {
      if (user.assignedPackageId) {
        packageMap[user._id.toString()] = {
          name: user.assignedPackageId.name,
          isAssigned: true,
        };
      }
    });

    // Add purchasedPackageName and isPackageAssigned to each user
    const usersWithPackages = users.map((user) => {
      const userObj = user.toObject();
      const packageInfo = packageMap[user._id.toString()];
      userObj.purchasedPackageName = packageInfo?.name || null;
      userObj.isPackageAssigned = packageInfo?.isAssigned || false;
      return userObj;
    });

    res.json({
      success: true,
      data: {
        users: usersWithPackages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get users",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -twoFactorSecret")
      .populate("parentId", "username email refCode");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get all user's transactions (all types: payment, commission, withdrawal)
    const transactions = await Transaction.find({
      userId: user._id,
    })
      .populate("packageId", "name price")
      .sort({ createdAt: -1 });

    // Get user's commissions (earned from referrals)
    const commissions = await Commission.find({ userId: user._id })
      .populate("buyerId", "username email refCode")
      .populate("packageId", "name")
      .populate("transactionId", "transactionHash amount")
      .sort({ createdAt: -1 });

    // Get referral tree (F1 and F2) - exclude deleted users
    const directReferrals = await User.find({ 
      parentId: user._id,
      isDeleted: { $ne: true }
    })
      .select("username email refCode createdAt totalEarnings walletBalance")
      .sort({ createdAt: -1 });

    const f2UserIds = directReferrals.map((ref) => ref._id);
    const f2Referrals = await User.find({ 
      parentId: { $in: f2UserIds },
      isDeleted: { $ne: true }
    })
      .select("username email refCode createdAt totalEarnings walletBalance parentId")
      .populate("parentId", "username refCode")
      .sort({ createdAt: -1 });

    // Get purchased package names for F1 and F2 referrals
    const allReferralIds = [...directReferrals.map((r) => r._id), ...f2Referrals.map((r) => r._id)];
    const referralPackages = await Transaction.find({
      userId: { $in: allReferralIds },
      type: "payment",
      status: "completed",
    })
      .populate("packageId", "name")
      .select("userId packageId");

    const referralPackageMap = {};
    referralPackages.forEach((tx) => {
      if (tx.packageId) {
        referralPackageMap[tx.userId.toString()] = tx.packageId.name;
      }
    });

    // Add purchasedPackageName to referrals
    const f1WithPackages = directReferrals.map((ref) => {
      const refObj = ref.toObject();
      refObj.purchasedPackageName = referralPackageMap[ref._id.toString()] || null;
      return refObj;
    });

    const f2WithPackages = f2Referrals.map((ref) => {
      const refObj = ref.toObject();
      refObj.purchasedPackageName = referralPackageMap[ref._id.toString()] || null;
      return refObj;
    });

    // Get withdrawals
    const withdrawals = await Withdrawal.find({ userId: user._id }).sort({ createdAt: -1 });

    // Get purchased package (from completed payment transaction or assigned package)
    const purchasedPackage = await Transaction.findOne({
      userId: user._id,
      type: "payment",
      status: "completed",
    })
      .populate("packageId", "name price description")
      .sort({ createdAt: -1 });

    // Check if user has assigned package (if no purchased package)
    let assignedPackage = null;
    if (!purchasedPackage && user.assignedPackageId) {
      assignedPackage = await Package.findById(user.assignedPackageId).select("name price description");
    }

    res.json({
      success: true,
      data: {
        user,
        transactions,
        commissions,
        referrals: {
          f1: f1WithPackages,
          f2: f2WithPackages,
        },
        withdrawals,
        purchasedPackage: purchasedPackage?.packageId || assignedPackage || null,
        isPackageAssigned: user.isPackageAssigned || false,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "User is already deleted",
      });
    }

    // Find all children of the user being deleted
    const children = await User.find({ 
      parentId: user._id,
      isDeleted: { $ne: true }
    });

    // Get the parent of the user being deleted (if exists and not deleted)
    let grandParent = null;
    let grandParentId = null;
    if (user.parentId) {
      grandParent = await User.findById(user.parentId);
      if (grandParent && !grandParent.isDeleted) {
        grandParentId = grandParent._id;
      }
    }

    // Update children: move them up to become children of the deleted user's parent
    if (children.length > 0) {
      for (const child of children) {
        // Update parentId: set to grandParentId (or null if deleted user has no parent)
        child.parentId = grandParentId || null;
        
        // Update ancestors: remove deleted user from ancestors array
        // ancestors format: [parentId, ...parentAncestors]
        // After deletion: [grandParentId, ...grandParentAncestors] (if grandParent exists)
        if (grandParentId && grandParent) {
          child.ancestors = [grandParentId, ...(grandParent.ancestors || [])];
        } else {
          // If deleted user has no parent, children become root (no ancestors)
          child.ancestors = [];
        }
        
        await child.save();
      }

      // Update directReferrals count of grandparent (if exists)
      // Before: grandParent has 1 child (the deleted user)
      // After: grandParent has children.length children (moved up from deleted user)
      // Net change: children.length - 1
      if (grandParentId && grandParent) {
        grandParent.directReferrals = Math.max(0, (grandParent.directReferrals || 0) - 1 + children.length);
        await grandParent.save();
      }
    } else {
      // No children, just decrease parent's directReferrals count
      if (grandParentId && grandParent) {
        grandParent.directReferrals = Math.max(0, (grandParent.directReferrals || 0) - 1);
        await grandParent.save();
      }
    }

    // Soft delete: set isDeleted and deletedAt only
    // Keep all unique fields unchanged - they will be available for reuse
    // because duplicate checks exclude deleted users
    user.isDeleted = true;
    user.deletedAt = new Date();
    // Reset directReferrals to 0 since user is deleted
    user.directReferrals = 0;
    await user.save();

    // Log admin action
    await AdminLog.create({
      adminId: req.admin._id,
      action: "delete_user",
      entityType: "user",
      entityId: user._id,
      details: { 
        userId: user._id, 
        username: user.username,
        email: user.email,
        childrenMovedUp: children.length,
        newParentId: grandParentId || null,
        note: `User soft deleted. ${children.length} children moved up to parent (${grandParentId ? 'has parent' : 'no parent'}). Unique fields available for reuse.`
      },
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

export const updateUserWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({
        success: false,
        message: "Invalid BEP20 wallet address format",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const oldWallet = user.walletAddress;
    user.walletAddress = walletAddress.trim();
    await user.save();

    // Log admin action
    await AdminLog.create({
      adminId: req.admin._id,
      action: "update_user_wallet",
      entityType: "user",
      entityId: user._id,
      details: {
        userId: user._id,
        username: user.username,
        oldWallet,
        newWallet: walletAddress,
      },
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    res.json({
      success: true,
      message: "User wallet address updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update user wallet error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user wallet address",
    });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const { username, email, walletAddress, fullName, phoneNumber, identityNumber } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Store old values for logging
    const oldValues = {
      username: user.username,
      email: user.email,
      walletAddress: user.walletAddress,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      identityNumber: user.identityNumber,
    };

    const changes = {};

    // Update fields if provided
    if (username !== undefined && username !== user.username) {
      // Normalize username to lowercase
      const normalizedUsername = username.trim().toLowerCase();
      
      // Check if username is already taken (exclude deleted users)
      const existingUser = await User.findOne({ 
        username: normalizedUsername, 
        _id: { $ne: user._id },
        isDeleted: { $ne: true }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
      user.username = normalizedUsername;
      changes.username = { old: oldValues.username, new: normalizedUsername };
    }

    if (email !== undefined && email !== user.email) {
      // Check if email is already taken (exclude deleted users)
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: user._id },
        isDeleted: { $ne: true }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already taken",
        });
      }
      user.email = email.trim().toLowerCase();
      changes.email = { old: oldValues.email, new: email.trim().toLowerCase() };
    }

    if (fullName !== undefined && fullName !== user.fullName) {
      // fullName can be duplicated, no need to check
      user.fullName = fullName.trim();
      changes.fullName = { old: oldValues.fullName, new: fullName.trim() };
    }

    if (phoneNumber !== undefined && phoneNumber !== user.phoneNumber) {
      // Check if phoneNumber is already taken (exclude deleted users)
      if (phoneNumber && phoneNumber.trim()) {
        const existingUser = await User.findOne({
          phoneNumber: phoneNumber.trim(),
          _id: { $ne: user._id },
          isDeleted: { $ne: true },
        });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Phone number already taken",
          });
        }
      }
      user.phoneNumber = phoneNumber.trim();
      changes.phoneNumber = { old: oldValues.phoneNumber, new: phoneNumber.trim() };
    }

    if (identityNumber !== undefined && identityNumber !== user.identityNumber) {
      // Check if identityNumber is already taken (exclude deleted users)
      if (identityNumber && identityNumber.trim()) {
        const existingUser = await User.findOne({
          identityNumber: identityNumber.trim(),
          _id: { $ne: user._id },
          isDeleted: { $ne: true },
        });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Identity number already taken",
          });
        }
      }
      user.identityNumber = identityNumber.trim();
      changes.identityNumber = { old: oldValues.identityNumber, new: identityNumber.trim() };
    }

    if (walletAddress !== undefined && walletAddress !== user.walletAddress) {
      if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        return res.status(400).json({
          success: false,
          message: "Invalid BEP20 wallet address format",
        });
      }
      // Check if walletAddress is already taken (exclude deleted users)
      const existingUser = await User.findOne({
        walletAddress: walletAddress.trim(),
        _id: { $ne: user._id },
        isDeleted: { $ne: true },
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Wallet address already taken",
        });
      }
      user.walletAddress = walletAddress.trim();
      changes.walletAddress = { old: oldValues.walletAddress, new: walletAddress.trim() };
    }

    // If no changes, return early
    if (Object.keys(changes).length === 0) {
      return res.json({
        success: true,
        message: "No changes detected",
        data: user,
      });
    }

    await user.save();

    // Log admin action with all changes
    await AdminLog.create({
      adminId: req.admin._id,
      action: "update_user_info",
      entityType: "user",
      entityId: user._id,
      details: {
        userId: user._id,
        username: user.username,
        changes,
      },
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    res.json({
      success: true,
      message: "User information updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update user info error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user information",
    });
  }
};

export const reset2FA = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isTwoFactorEnabled = false;
    user.twoFactorSecret = null;
    await user.save();

    // Log admin action
    await AdminLog.create({
      adminId: req.admin._id,
      action: "reset_2fa",
      entityType: "user",
      entityId: user._id,
      details: { userId: user._id, username: user.username },
    });

    res.json({
      success: true,
      message: "2FA reset successfully",
    });
  } catch (error) {
    console.error("Reset 2FA error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset 2FA",
    });
  }
};

export const verifyUserEmail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "User email is already verified",
      });
    }

    const oldStatus = user.isEmailVerified;
    user.isEmailVerified = true;
    user.emailVerificationToken = null; // Clear verification token if exists
    await user.save();

    // Log admin action
    await AdminLog.create({
      adminId: req.admin._id,
      action: "verify_user_email",
      entityType: "user",
      entityId: user._id,
      details: {
        userId: user._id,
        username: user.username,
        email: user.email,
        oldStatus,
        newStatus: true,
      },
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    res.json({
      success: true,
      message: "User email verified successfully",
      data: user,
    });
  } catch (error) {
    console.error("Verify user email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify user email",
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isDeleted: { $ne: true } });
    const totalTransactions = await Transaction.countDocuments({
      type: "payment",
      status: "completed",
    });
    const totalRevenue = await Transaction.aggregate([
      { $match: { type: "payment", status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: "pending" });
    const totalCommissions = await Commission.aggregate([
      { $match: { status: "credited" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
        },
        transactions: {
          total: totalTransactions,
        },
        revenue: totalRevenue[0]?.total || 0,
        pendingWithdrawals,
        totalCommissions: totalCommissions[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get stats",
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {
      type: "payment",
      ...(status && status !== "all" ? { status } : {}),
    };

    const transactions = await Transaction.find(filter)
      .populate("userId", "username email")
      .populate("packageId", "name price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get transactions",
    });
  }
};

export const getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await AdminLog.find()
      .populate("adminId", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AdminLog.countDocuments();

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Get logs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get logs",
    });
  }
};

export const assignPackage = async (req, res) => {
  try {
    const { packageId } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user already has a package (either purchased or assigned)
    const hasPurchasedPackage = await Transaction.findOne({
      userId: user._id,
      type: "payment",
      status: "completed",
    });

    if (hasPurchasedPackage || user.assignedPackageId) {
      return res.status(400).json({
        success: false,
        message: "User already has a package. Each user can only have one package.",
      });
    }

    // Validate package
    const packageData = await Package.findById(packageId);
    if (!packageData || packageData.status !== "active" || packageData.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Package not found or inactive",
      });
    }

    // Update user
    user.assignedPackageId = packageData._id;
    user.isPackageAssigned = true;
    user.packagesPurchased = (user.packagesPurchased || 0) + 1;
    await user.save();

    // Create transaction record with empty hash (no commission will be created)
    await Transaction.create({
      userId: user._id,
      packageId: packageData._id,
      type: "payment",
      amount: packageData.price,
      currency: "USDT",
      status: "completed",
      transactionHash: "", // Empty hash for assigned packages
      fromAddress: null,
      toAddress: null,
      description: `Package assigned by admin: ${packageData.name}`,
    });

    // Note: We do NOT call calculateCommissions() here
    // Assigned packages should not generate commissions

    // Log admin action
    await AdminLog.create({
      adminId: req.admin._id,
      action: "assign_package",
      entityType: "user",
      entityId: user._id,
      details: {
        userId: user._id,
        username: user.username,
        packageId: packageData._id,
        packageName: packageData.name,
        packagePrice: packageData.price,
        note: "Package assigned by admin (transaction created with empty hash, no commission)",
      },
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    res.json({
      success: true,
      message: "Package assigned successfully",
      data: {
        package: packageData,
        isAssigned: true,
      },
    });
  } catch (error) {
    console.error("Assign package error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to assign package",
    });
  }
};
