import Withdrawal from '../models/Withdrawal.model.js';
import User from '../models/User.model.js';
import Transaction from '../models/Transaction.model.js';
import BalanceHistory from '../models/BalanceHistory.model.js';
import AdminLog from '../models/AdminLog.model.js';
import { verifyToken } from '../utils/twoFactor.service.js';
import bcrypt from 'bcryptjs';

export const requestWithdrawal = async (req, res) => {
  try {
    const { amount, password, token } = req.body;

    const user = await User.findById(req.user._id);

    // Check if user has wallet address
    if (!user.walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address not set. Please contact admin to set your wallet address.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Verify 2FA if enabled
    if (user.isTwoFactorEnabled) {
      if (!token) {
        return res.status(400).json({
          success: false,
          message: '2FA token required'
        });
      }
      const isValid = verifyToken(user.twoFactorSecret, token);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid 2FA token'
        });
      }
    }

    // Check balance
    if (user.walletBalance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Store balance before withdrawal
    const balanceBefore = user.walletBalance;

    // Create withdrawal request using user's wallet address
    const withdrawal = new Withdrawal({
      userId: user._id,
      amount,
      walletAddress: user.walletAddress, // Use wallet address from user model
      status: 'pending'
    });

    await withdrawal.save();

    // Deduct from balance (will be refunded if rejected)
    user.walletBalance -= amount;
    await user.save();

    // Save balance history
    await BalanceHistory.create({
      userId: user._id,
      type: 'withdrawal',
      amount: -amount, // Negative for withdrawal
      balanceBefore,
      balanceAfter: user.walletBalance,
      description: `Withdrawal request: ${amount} USDT`,
      relatedId: withdrawal._id,
      relatedType: 'withdrawal'
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted',
      data: withdrawal
    });
  } catch (error) {
    console.error('Request withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to request withdrawal'
    });
  }
};

export const getMyWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: withdrawals
    });
  } catch (error) {
    console.error('Get withdrawals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get withdrawals'
    });
  }
};

export const getAllWithdrawals = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const filter = status ? { status } : {};

    const withdrawals = await Withdrawal.find(filter)
      .populate('userId', 'username email')
      .populate('adminId', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Withdrawal.countDocuments(filter);

    res.json({
      success: true,
      data: {
        withdrawals,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      }
    });
  } catch (error) {
    console.error('Get all withdrawals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get withdrawals'
    });
  }
};

export const approveWithdrawal = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id)
      .populate('userId', 'username email walletAddress');

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Withdrawal already processed'
      });
    }

    // Store userId before save (populate might be lost after save)
    const userId = withdrawal.userId?._id || withdrawal.userId;

    withdrawal.status = 'approved';
    withdrawal.adminId = req.admin._id;
    withdrawal.approvedAt = new Date();
    await withdrawal.save();

    // Log admin action
    await AdminLog.create({
      adminId: req.admin._id,
      action: 'approve_withdrawal',
      entityType: 'withdrawal',
      entityId: withdrawal._id,
      details: { amount: withdrawal.amount, userId: userId }
    });

    // Populate userId again to ensure we have full user info for response
    await withdrawal.populate('userId', 'username email walletAddress');
    
    res.json({
      success: true,
      message: 'Withdrawal approved',
      data: withdrawal
    });
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve withdrawal'
    });
  }
};

export const rejectWithdrawal = async (req, res) => {
  try {
    const { reason } = req.body;
    const withdrawal = await Withdrawal.findById(req.params.id)
      .populate('userId');

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Withdrawal already processed'
      });
    }

    withdrawal.status = 'rejected';
    withdrawal.adminId = req.admin._id;
    withdrawal.rejectionReason = reason;
    withdrawal.rejectedAt = new Date();
    await withdrawal.save();

    // Refund to user balance
    const user = await User.findById(withdrawal.userId._id);
    const balanceBefore = user.walletBalance;
    user.walletBalance += withdrawal.amount;
    await user.save();

    // Save balance history for refund
    await BalanceHistory.create({
      userId: user._id,
      type: 'refund',
      amount: withdrawal.amount,
      balanceBefore,
      balanceAfter: user.walletBalance,
      description: `Withdrawal rejected - refund: ${withdrawal.amount} USDT. Reason: ${reason}`,
      relatedId: withdrawal._id,
      relatedType: 'withdrawal'
    });

    // Log admin action
    await AdminLog.create({
      adminId: req.admin._id,
      action: 'reject_withdrawal',
      entityType: 'withdrawal',
      entityId: withdrawal._id,
      details: { reason, amount: withdrawal.amount, userId: withdrawal.userId._id }
    });

    res.json({
      success: true,
      message: 'Withdrawal rejected',
      data: withdrawal
    });
  } catch (error) {
    console.error('Reject withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject withdrawal'
    });
  }
};

export const completeWithdrawal = async (req, res) => {
  try {
    const { transactionHash } = req.body;
    const withdrawal = await Withdrawal.findById(req.params.id)
      .populate('userId');

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    if (withdrawal.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Withdrawal must be approved first'
      });
    }

    if (!transactionHash) {
      return res.status(400).json({
        success: false,
        message: 'Transaction hash is required'
      });
    }

    withdrawal.status = 'completed';
    withdrawal.transactionHash = transactionHash;
    withdrawal.completedAt = new Date();
    await withdrawal.save();

    // Create transaction record
    await Transaction.create({
      userId: withdrawal.userId._id,
      type: 'withdrawal',
      amount: withdrawal.amount,
      status: 'completed',
      transactionHash,
      toAddress: withdrawal.walletAddress,
      description: 'Withdrawal completed'
    });

    // Log admin action
    await AdminLog.create({
      adminId: req.admin._id,
      action: 'complete_withdrawal',
      entityType: 'withdrawal',
      entityId: withdrawal._id,
      details: { transactionHash, amount: withdrawal.amount, userId: withdrawal.userId._id }
    });

    res.json({
      success: true,
      message: 'Withdrawal completed',
      data: withdrawal
    });
  } catch (error) {
    console.error('Complete withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete withdrawal'
    });
  }
};

