import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    permissions: [
      {
        type: String,
        enum: [
          // User management
          "users.view",
          "users.create",
          "users.update",
          "users.delete",
          "users.lock",
          "users.unlock",
          "users.reset_2fa",
          // Package management
          "packages.view",
          "packages.create",
          "packages.update",
          "packages.delete",
          // Transaction management
          "transactions.view",
          // Withdrawal management
          "withdrawals.view",
          "withdrawals.approve",
          "withdrawals.reject",
          "withdrawals.complete",
          // Commission management
          "commissions.view",
          "commissions.update",
          // Admin management
          "admins.view",
          "admins.create",
          "admins.update",
          "admins.delete",
          // Role management
          "roles.view",
          "roles.create",
          "roles.update",
          "roles.delete",
          // Blog management
          "blogs.view",
          "blogs.create",
          "blogs.update",
          "blogs.delete",
          // Statistics
          "stats.view",
          // Logs
          "logs.view",
        ],
      },
    ],
    isDefault: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

roleSchema.index({ isActive: 1 });

export default mongoose.model("Role", roleSchema);
