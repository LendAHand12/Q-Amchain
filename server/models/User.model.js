import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+$/, "Username must be lowercase alphanumeric, no spaces"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    refCode: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      minlength: 6,
      match: [/^[a-z0-9]{6,}$/, "RefCode must be lowercase alphanumeric, minimum 6 characters"],
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    ancestors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    twoFactorSecret: {
      type: String,
      default: null,
    },
    isTwoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    walletBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    directReferrals: {
      type: Number,
      default: 0,
    },
    packagesPurchased: {
      type: Number,
      default: 0,
    },
    walletAddress: {
      type: String,
      required: true,
      trim: true,
      match: [/^0x[a-fA-F0-9]{40}$/, "Invalid BEP20 wallet address format"],
    },
    fullName: {
      type: String,
      trim: true,
      default: "",
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },
    identityNumber: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ parentId: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Generate refCode if not exists (lowercase, min 6 chars, alphanumeric only)
userSchema.pre("save", async function (next) {
  if (!this.refCode) {
    let generatedCode = "";
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      // Generate random lowercase alphanumeric code (min 6 chars)
      // Use username + random string, ensure at least 6 characters
      const randomPart = Math.random().toString(36).substring(2, 8); // 6 random lowercase chars
      const baseCode = this.username.toLowerCase();
      
      // Combine username and random part, ensure min 6 chars
      if (baseCode.length + randomPart.length >= 6) {
        generatedCode = (baseCode + randomPart).substring(0, 12); // Max 12 chars
      } else {
        // If too short, add more random chars
        const extraChars = Math.random().toString(36).substring(2, 6 - (baseCode.length + randomPart.length) + 2);
        generatedCode = (baseCode + randomPart + extraChars).substring(0, 12);
      }
      
      // Ensure minimum 6 characters
      if (generatedCode.length < 6) {
        const padding = Math.random().toString(36).substring(2, 6 - generatedCode.length + 2);
        generatedCode = generatedCode + padding;
      }
      
      // Remove any non-alphanumeric characters (just in case)
      generatedCode = generatedCode.replace(/[^a-z0-9]/g, '');
      
      // Check uniqueness
      const existing = await this.constructor.findOne({ refCode: generatedCode });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return next(new Error("Failed to generate unique refCode"));
    }

    this.refCode = generatedCode;
  }
  next();
});

export default mongoose.model("User", userSchema);
