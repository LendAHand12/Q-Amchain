import User from "../models/User.model.js";
import Transaction from "../models/Transaction.model.js";
import Withdrawal from "../models/Withdrawal.model.js";
import Commission from "../models/Commission.model.js";
import AdminLog from "../models/AdminLog.model.js";
import Admin from "../models/Admin.model.js";

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

    // Get purchased package names for each user
    const userIds = users.map((u) => u._id);
    const purchasedPackages = await Transaction.find({
      userId: { $in: userIds },
      type: "payment",
      status: "completed",
    })
      .populate("packageId", "name")
      .select("userId packageId");

    // Create a map of userId -> packageName
    const packageMap = {};
    purchasedPackages.forEach((tx) => {
      if (tx.packageId) {
        packageMap[tx.userId.toString()] = tx.packageId.name;
      }
    });

    // Add purchasedPackageName to each user
    const usersWithPackages = users.map((user) => {
      const userObj = user.toObject();
      userObj.purchasedPackageName = packageMap[user._id.toString()] || null;
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

    // Get referral tree (F1 and F2)
    const directReferrals = await User.find({ parentId: user._id })
      .select("username email refCode createdAt totalEarnings walletBalance")
      .sort({ createdAt: -1 });

    const f2UserIds = directReferrals.map((ref) => ref._id);
    const f2Referrals = await User.find({ parentId: { $in: f2UserIds } })
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

    // Get purchased package (from completed payment transaction)
    const purchasedPackage = await Transaction.findOne({
      userId: user._id,
      type: "payment",
      status: "completed",
    })
      .populate("packageId", "name price description")
      .sort({ createdAt: -1 });

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
        purchasedPackage: purchasedPackage?.packageId || null,
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

export const lockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = false;
    await user.save();

    // Log admin action
    await AdminLog.create({
      adminId: req.admin._id,
      action: "lock_user",
      entityType: "user",
      entityId: user._id,
      details: { userId: user._id, username: user.username },
    });

    res.json({
      success: true,
      message: "User locked successfully",
    });
  } catch (error) {
    console.error("Lock user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to lock user",
    });
  }
};

export const unlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = true;
    await user.save();

    // Log admin action
    await AdminLog.create({
      adminId: req.admin._id,
      action: "unlock_user",
      entityType: "user",
      entityId: user._id,
      details: { userId: user._id, username: user.username },
    });

    res.json({
      success: true,
      message: "User unlocked successfully",
    });
  } catch (error) {
    console.error("Unlock user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to unlock user",
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
      // Check if username is already taken
      const existingUser = await User.findOne({ username, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
      user.username = username.trim();
      changes.username = { old: oldValues.username, new: username.trim() };
    }

    if (email !== undefined && email !== user.email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
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
      user.fullName = fullName.trim();
      changes.fullName = { old: oldValues.fullName, new: fullName.trim() };
    }

    if (phoneNumber !== undefined && phoneNumber !== user.phoneNumber) {
      user.phoneNumber = phoneNumber.trim();
      changes.phoneNumber = { old: oldValues.phoneNumber, new: phoneNumber.trim() };
    }

    if (identityNumber !== undefined && identityNumber !== user.identityNumber) {
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

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
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
          active: activeUsers,
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
