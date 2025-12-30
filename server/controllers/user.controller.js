import User from "../models/User.model.js";
import Transaction from "../models/Transaction.model.js";
import Commission from "../models/Commission.model.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password -twoFactorSecret")
      .populate("parentId", "username email refCode");

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true, runValidators: true }
    ).select("-password -twoFactorSecret");

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export const updateRefCode = async (req, res) => {
  try {
    const { refCode } = req.body;

    if (!refCode || !refCode.trim()) {
      return res.status(400).json({
        success: false,
        message: "RefCode is required",
      });
    }

    // Validate format: lowercase alphanumeric, min 6 chars
    const refCodeRegex = /^[a-z0-9]{6,}$/;
    const normalizedRefCode = refCode.trim().toLowerCase();

    if (!refCodeRegex.test(normalizedRefCode)) {
      return res.status(400).json({
        success: false,
        message: "RefCode must be lowercase alphanumeric and at least 6 characters",
      });
    }

    // Check if refCode is already taken by another user
    const existingUser = await User.findOne({
      refCode: normalizedRefCode,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This RefCode is already taken. Please choose another one.",
      });
    }

    // Update refCode
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { refCode: normalizedRefCode },
      { new: true, runValidators: true }
    ).select("-password -twoFactorSecret");

    res.json({
      success: true,
      message: "RefCode updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update refCode error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update RefCode",
    });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "walletBalance totalEarnings directReferrals packagesPurchased refCode username"
    );

    // Count actual direct referrals (F1)
    const actualDirectReferrals = await User.countDocuments({ parentId: req.user._id });

    // Get F1 and F2 earnings from commissions
    const f1Commissions = await Commission.aggregate([
      { $match: { userId: req.user._id, level: 1, status: "credited" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const f2Commissions = await Commission.aggregate([
      { $match: { userId: req.user._id, level: 2, status: "credited" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const f1Earnings = f1Commissions[0]?.total || 0;
    const f2Earnings = f2Commissions[0]?.total || 0;

    // Get recent transactions
    const recentTransactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("packageId", "name");

    // Get recent commissions
    const recentCommissions = await Commission.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("buyerId", "username")
      .populate("packageId", "name");

    // Get purchased package name
    const purchasedPackage = await Transaction.findOne({
      userId: req.user._id,
      type: "payment",
      status: "completed",
    })
      .populate("packageId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        walletBalance: user.walletBalance,
        totalEarnings: user.totalEarnings,
        directReferrals: actualDirectReferrals, // Use actual count instead of stored value
        packagesPurchased: user.packagesPurchased,
        refCode: user.refCode,
        f1Earnings,
        f2Earnings,
        recentTransactions,
        recentCommissions,
        purchasedPackageName: purchasedPackage?.packageId?.name || null,
      },
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get dashboard",
    });
  }
};

export const getReferralTree = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get direct referrals (F1)
    const directReferrals = await User.find({ parentId: user._id })
      .select("username email refCode createdAt totalEarnings")
      .sort({ createdAt: -1 });

    // Get F2 referrals
    const f2UserIds = directReferrals.map((ref) => ref._id);
    const f2Referrals = await User.find({ parentId: { $in: f2UserIds } })
      .select("username email refCode createdAt totalEarnings parentId")
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

    res.json({
      success: true,
      data: {
        f1: f1WithPackages,
        f2: f2WithPackages,
      },
    });
  } catch (error) {
    console.error("Get referral tree error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get referral tree",
    });
  }
};

export const getMyPackages = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user._id,
      type: "payment",
      status: "completed",
    })
      .populate("packageId", "name description price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: transactions.map((tx) => ({
        ...tx.toObject(),
        package: tx.packageId,
      })),
    });
  } catch (error) {
    console.error("Get my packages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get packages",
    });
  }
};

export const getCommissions = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const commissions = await Commission.find({ userId: req.user._id })
      .populate("buyerId", "username email")
      .populate("packageId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Commission.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: {
        commissions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Get commissions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get commissions",
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .populate("packageId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get transactions",
    });
  }
};
