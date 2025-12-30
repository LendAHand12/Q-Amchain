import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.model.js";

dotenv.config();

const createRootUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/q-amchain");
    console.log("✅ MongoDB connected");

    const rootEmail = process.env.ROOT_USER_EMAIL || "root@q-amchain.com";
    const rootUsername = process.env.ROOT_USER_USERNAME || "root";
    const rootPassword = process.env.ROOT_USER_PASSWORD || "root123";
    const rootRefCode = (process.env.ROOT_USER_REFCODE || "root001").toLowerCase();
    const rootWalletAddress = process.env.ROOT_USER_WALLET || "0x0000000000000000000000000000000000000000";

    const existingUser = await User.findOne({
      $or: [
        { email: rootEmail }, 
        { username: rootUsername }, 
        { refCode: rootRefCode }
      ],
    });

    if (!existingUser) {
      const rootUser = new User({
        email: rootEmail,
        username: rootUsername,
        password: rootPassword, // Will be hashed by pre-save hook
        refCode: rootRefCode, // Fixed refCode for root user (lowercase)
        walletAddress: rootWalletAddress, // Wallet address for root user
        isEmailVerified: true,
        isActive: true,
        walletBalance: 0,
        totalEarnings: 0,
        directReferrals: 0,
        packagesPurchased: 0,
      });

      await rootUser.save();
      console.log("✅ Root user created:");
      console.log("   Email:", rootEmail);
      console.log("   Username:", rootUsername);
      console.log("   Password:", rootPassword);
      console.log("   RefCode:", rootRefCode);
      console.log("\n📝 Users can now register with refCode:", rootRefCode);
    } else {
      console.log("ℹ️ Root user already exists:");
      console.log("   Email:", existingUser.email);
      console.log("   Username:", existingUser.username);
      console.log("   RefCode:", existingUser.refCode);
    }
  } catch (error) {
    console.error("❌ Error creating root user:", error);
  } finally {
    mongoose.disconnect();
  }
};

createRootUser();
