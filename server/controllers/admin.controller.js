import User from "../models/User.model.js";
import Transaction from "../models/Transaction.model.js";
import Withdrawal from "../models/Withdrawal.model.js";
import Commission from "../models/Commission.model.js";
import Package from "../models/Package.model.js";
import AdminLog from "../models/AdminLog.model.js";
import Admin from "../models/Admin.model.js";
import { calculateCommissions } from "../utils/commission.service.js";
import mongoose from "mongoose";

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
      .select("userId packageId packageInfo");

    // Get users with assigned packages to check isPackageAssigned flag
    const usersWithAssignedPackages = await User.find({
      _id: { $in: userIds },
      assignedPackageId: { $ne: null },
    })
      .select("_id assignedPackageId isPackageAssigned");

    // Create a map of userId -> isPackageAssigned
    const isAssignedMap = {};
    usersWithAssignedPackages.forEach((user) => {
      isAssignedMap[user._id.toString()] = user.isPackageAssigned || false;
    });

    // Create a map of userId -> packageName and isAssigned
    // Use packageInfo if available (stored at purchase/assignment time), otherwise use populated packageId
    const packageMap = {};
    purchasedPackages.forEach((tx) => {
      const txObj = tx.toObject();
      const isAssigned = isAssignedMap[txObj.userId.toString()] || false;
      
      // Use packageInfo if available (stored at purchase/assignment time), otherwise use populated packageId
      if (txObj.packageInfo && txObj.packageInfo.name) {
        packageMap[txObj.userId.toString()] = {
          name: txObj.packageInfo.name,
          isAssigned: isAssigned,
        };
      } else if (txObj.packageId) {
        packageMap[txObj.userId.toString()] = {
          name: txObj.packageId.name,
          isAssigned: isAssigned,
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
    // Use packageInfo if available (stored at purchase time), otherwise populate from Package
    const transactions = await Transaction.find({
      userId: user._id,
    })
      .populate("packageId", "name price description")
      .sort({ createdAt: -1 });
    
    // Map transactions to use packageInfo if available
    const transactionsWithPackageInfo = transactions.map((tx) => {
      const txObj = tx.toObject();
      if (txObj.packageInfo && txObj.packageInfo.name) {
        // Use stored package info (snapshot at purchase time)
        txObj.packageId = {
          _id: txObj.packageId?._id || null,
          name: txObj.packageInfo.name,
          price: txObj.packageInfo.price,
          description: txObj.packageInfo.description,
        };
      }
      return txObj;
    });

    // Get user's commissions (earned from referrals)
    // Use packageInfo if available (stored at purchase time), otherwise populate from Package
    const commissions = await Commission.find({ userId: user._id })
      .populate("buyerId", "username email refCode")
      .populate("packageId", "name price description")
      .populate("transactionId", "transactionHash amount")
      .sort({ createdAt: -1 });
    
    // Map commissions to use packageInfo if available
    const commissionsWithPackageInfo = commissions.map((commission) => {
      const commObj = commission.toObject();
      if (commObj.packageInfo && commObj.packageInfo.name) {
        // Use stored package info (snapshot at purchase time)
        commObj.packageId = {
          _id: commObj.packageId?._id || null,
          name: commObj.packageInfo.name,
          price: commObj.packageInfo.price,
          description: commObj.packageInfo.description,
        };
      }
      return commObj;
    });

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
      .select("userId packageId packageInfo");

    const referralPackageMap = {};
    referralPackages.forEach((tx) => {
      const txObj = tx.toObject();
      // Use packageInfo if available (stored at purchase time), otherwise use populated packageId
      if (txObj.packageInfo && txObj.packageInfo.name) {
        referralPackageMap[txObj.userId.toString()] = txObj.packageInfo.name;
      } else if (txObj.packageId) {
        referralPackageMap[txObj.userId.toString()] = txObj.packageId.name;
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

    // Use packageInfo if available (stored at purchase time), otherwise use populated packageId
    let purchasedPackageData = null;
    if (purchasedPackage) {
      if (purchasedPackage.packageInfo && purchasedPackage.packageInfo.name) {
        // Use stored package info (snapshot at purchase time)
        purchasedPackageData = {
          _id: purchasedPackage.packageId?._id || null,
          name: purchasedPackage.packageInfo.name,
          price: purchasedPackage.packageInfo.price,
          description: purchasedPackage.packageInfo.description,
        };
      } else {
        // Fallback to populated packageId
        purchasedPackageData = purchasedPackage.packageId;
      }
    }

    // Check if user has assigned package (if no purchased package)
    let assignedPackage = null;
    if (!purchasedPackage && user.assignedPackageId) {
      assignedPackage = await Package.findById(user.assignedPackageId).select("name price description");
    }

    res.json({
      success: true,
      data: {
        user,
        transactions: transactionsWithPackageInfo,
        commissions: commissionsWithPackageInfo,
        referrals: {
          f1: f1WithPackages,
          f2: f2WithPackages,
        },
        withdrawals,
        purchasedPackage: purchasedPackageData || assignedPackage || null,
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

export const transferUser = async (req, res) => {
  try {
    const { newParentRefCode, moveWithChildren } = req.body;
    const userId = req.params.id;

    // Validation
    if (!newParentRefCode || !newParentRefCode.trim()) {
      return res.status(400).json({
        success: false,
        message: "New parent refCode is required",
      });
    }

    // Get User A (user to transfer)
    const userA = await User.findById(userId);
    if (!userA) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (userA.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Cannot transfer deleted user",
      });
    }

    // Get User C (new parent)
    const userC = await User.findOne({
      $or: [
        { refCode: newParentRefCode.trim().toLowerCase() },
        { username: newParentRefCode.trim().toLowerCase() },
      ],
      isDeleted: { $ne: true },
    });

    if (!userC) {
      return res.status(404).json({
        success: false,
        message: "New parent not found",
      });
    }

    // Check if User C is the same as User A
    if (userC._id.toString() === userA._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot transfer user to themselves",
      });
    }

    // Check if User A already has User C as parent
    if (userA.parentId && userA.parentId.toString() === userC._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "User already has this parent",
      });
    }

    // Check circular reference: User C cannot be a descendant of User A
    const userAAncestors = userA.ancestors || [];
    if (userAAncestors.some((ancestorId) => ancestorId.toString() === userC._id.toString())) {
      return res.status(400).json({
        success: false,
        message: "Cannot transfer user to their descendant (circular reference)",
      });
    }

    // Get User B (current parent, if exists)
    let userB = null;
    if (userA.parentId) {
      userB = await User.findById(userA.parentId);
    }

    // Get all direct children of User A
    const childrenOfA = await User.find({
      parentId: userA._id,
      isDeleted: { $ne: true },
    });

    const moveWithChildrenFlag = moveWithChildren === true || moveWithChildren === "true";

    // Calculate new ancestors for User A
    const newAncestorsForA = [userC._id, ...(userC.ancestors || [])];

    if (moveWithChildrenFlag) {
      // Option 1: Move with children
      // Update User A
      userA.parentId = userC._id;
      userA.ancestors = newAncestorsForA;
      await userA.save();

      // Update all children of User A (their parentId stays the same, but ancestors change)
      if (childrenOfA.length > 0) {
        const childrenUpdates = childrenOfA.map((child) => ({
          updateOne: {
            filter: { _id: child._id },
            update: {
              $set: {
                ancestors: [userA._id, ...newAncestorsForA],
              },
            },
          },
        }));
        await User.bulkWrite(childrenUpdates);
      }

      // Update directReferrals counts
      // User B: decrease by (1 + number of A's children)
      if (userB) {
        userB.directReferrals = Math.max(0, (userB.directReferrals || 0) - 1 - childrenOfA.length);
        await userB.save();
      }

      // User C: increase by (1 + number of A's children)
      userC.directReferrals = (userC.directReferrals || 0) + 1 + childrenOfA.length;
      await userC.save();
    } else {
      // Option 2: Move without children
      // Update User A
      userA.parentId = userC._id;
      userA.ancestors = newAncestorsForA;
      await userA.save();

      // Update all children of User A: they become children of User B
      if (childrenOfA.length > 0) {
        const newAncestorsForChildren = userB
          ? [userB._id, ...(userB.ancestors || [])]
          : [];

        const childrenUpdates = childrenOfA.map((child) => ({
          updateOne: {
            filter: { _id: child._id },
            update: {
              $set: {
                parentId: userB ? userB._id : null,
                ancestors: newAncestorsForChildren,
              },
            },
          },
        }));
        await User.bulkWrite(childrenUpdates);
      }

      // Update directReferrals counts
      // User B: decrease by 1 (loses User A), increase by number of A's children
      if (userB) {
        userB.directReferrals = Math.max(0, (userB.directReferrals || 0) - 1 + childrenOfA.length);
        await userB.save();
      } else if (childrenOfA.length > 0) {
        // If User B doesn't exist, children become root users (no parent)
        // No need to update any parent's directReferrals
      }

      // User C: increase by 1 (gains User A)
      userC.directReferrals = (userC.directReferrals || 0) + 1;
      await userC.save();
    }

    // Log admin action
    await AdminLog.create({
      adminId: req.admin._id,
      action: "transfer_user",
      entityType: "user",
      entityId: userA._id,
      details: {
        userId: userA._id,
        username: userA.username,
        email: userA.email,
        oldParentId: userB ? userB._id : null,
        oldParentUsername: userB ? userB.username : null,
        newParentId: userC._id,
        newParentUsername: userC.username,
        moveWithChildren: moveWithChildrenFlag,
        childrenCount: childrenOfA.length,
        childrenMoved: moveWithChildrenFlag ? childrenOfA.length : 0,
        childrenLeftBehind: moveWithChildrenFlag ? 0 : childrenOfA.length,
      },
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    res.json({
      success: true,
      message: `User transferred successfully. ${moveWithChildrenFlag ? "Moved with children." : "Moved without children."}`,
      data: {
        user: {
          _id: userA._id,
          username: userA.username,
          newParentId: userC._id,
          newParentUsername: userC.username,
        },
        childrenAffected: childrenOfA.length,
        moveWithChildren: moveWithChildrenFlag,
      },
    });
  } catch (error) {
    console.error("Transfer user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to transfer user",
      error: error.message,
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
    // Store package info at time of assignment to prevent issues if package is modified/deleted
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
      packageInfo: {
        name: packageData.name,
        price: packageData.price,
        description: packageData.description || null,
        commissionLv1: packageData.commissionLv1,
        commissionLv2: packageData.commissionLv2,
      },
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
