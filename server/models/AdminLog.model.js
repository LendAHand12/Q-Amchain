import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      enum: ["user", "package", "transaction", "withdrawal", "commission", "other"],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

adminLogSchema.index({ adminId: 1 });
adminLogSchema.index({ entityType: 1, entityId: 1 });
adminLogSchema.index({ createdAt: -1 });

export default mongoose.model("AdminLog", adminLogSchema);
