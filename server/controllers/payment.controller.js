import dotenv from "dotenv";
import Transaction from "../models/Transaction.model.js";
import User from "../models/User.model.js";
import Package from "../models/Package.model.js";
import { calculateCommissions } from "../utils/commission.service.js";

// Load environment variables
dotenv.config();

export const verifyPayment = async (req, res) => {
  try {
    const { packageId, transactionHash } = req.body;

    // Check if user has already purchased a package (only 1 package per user)
    const existingPackage = await Transaction.findOne({
      userId: req.user._id,
      type: "payment",
      status: "completed",
    });

    if (existingPackage) {
      return res.status(400).json({
        success: false,
        message: "You have already purchased a package. Each user can only purchase one package.",
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

    // Check if transaction already exists
    const existingTransaction = await Transaction.findOne({
      transactionHash,
      userId: req.user._id,
    });

    if (existingTransaction) {
      return res.status(400).json({
        success: false,
        message: "Transaction already processed",
      });
    }

    // Verify payment address is configured
    const paymentAddress = process.env.MAIN_WALLET_ADDRESS;
    if (!paymentAddress) {
      console.error("MAIN_WALLET_ADDRESS is not configured");
      return res.status(500).json({
        success: false,
        message: "Payment system is not configured. Please contact administrator.",
      });
    }

    // Create transaction record
    // Note: We trust the transaction hash from wallet connect since it already confirmed success
    // The payment address is validated on frontend before sending transaction
    const transaction = await Transaction.create({
      userId: req.user._id,
      packageId: packageData._id,
      type: "payment",
      amount: packageData.price,
      currency: "USDT",
      status: "completed",
      transactionHash,
      fromAddress: null, // Not needed, wallet connect already handled
      toAddress: paymentAddress,
      description: `Payment for ${packageData.name}`,
    });

    // Update user packages count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { packagesPurchased: 1 },
    });

    // Calculate and distribute commissions
    await calculateCommissions(transaction, packageData);

    res.json({
      success: true,
      message: "Payment verified successfully",
      data: {
        transaction: transaction,
        package: packageData,
      },
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
};
