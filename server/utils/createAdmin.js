import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.model.js";
import Role from "../models/Role.model.js";

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    // Create default super admin role if not exists
    let superAdminRole = await Role.findOne({ name: "Super Admin" });
    if (!superAdminRole) {
      superAdminRole = new Role({
        name: "Super Admin",
        description: "Full access to all features",
        permissions: [
          "users.view",
          "users.create",
          "users.update",
          "users.delete",
          "users.lock",
          "users.unlock",
          "users.reset_2fa",
          "packages.view",
          "packages.create",
          "packages.update",
          "packages.delete",
          "transactions.view",
          "withdrawals.view",
          "withdrawals.approve",
          "withdrawals.reject",
          "withdrawals.complete",
          "commissions.view",
          "commissions.update",
          "admins.view",
          "admins.create",
          "admins.update",
          "admins.delete",
          "roles.view",
          "roles.create",
          "roles.update",
          "roles.delete",
          "blogs.view",
          "blogs.create",
          "blogs.update",
          "blogs.delete",
          "stats.view",
          "logs.view",
        ],
        isDefault: true,
      });
      await superAdminRole.save();
      console.log("✅ Super Admin role created");
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@q-amchain.com";
    const adminName = process.env.ADMIN_NAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (!existingAdmin) {
      // Don't hash password here - let the pre-save hook in Admin model handle it
      const admin = new Admin({
        email: adminEmail,
        username: adminName,
        password: adminPassword, // Plain password - will be hashed by pre-save hook
        roleId: superAdminRole._id,
        isEmailVerified: true,
        isActive: true,
      });

      await admin.save();
      console.log("✅ Admin user created successfully!");
      console.log("   Email:", adminEmail);
      console.log("   Username:", adminName);
      console.log("   Password:", adminPassword);
      console.log("   Role: Super Admin");
    } else {
      console.log("ℹ️ Admin already exists:", adminEmail);
      console.log("   Username:", existingAdmin.username);
      console.log("   Role:", superAdminRole.name);
      console.log("\n💡 To reset password, delete the admin first or use a different email.");
    }
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    throw error;
  }
};

// Run the script
const run = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/q-amchain");
    console.log("✅ MongoDB connected");

    // Create admin user
    await createAdminUser();

    console.log("✅ Script completed successfully");
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");
  }
};

// Run the script
run();
