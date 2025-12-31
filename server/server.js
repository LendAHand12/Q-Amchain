import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// Import routes
import authRoutes from "./routes/auth.routes.js";
import adminAuthRoutes from "./routes/adminAuth.routes.js";
import userRoutes from "./routes/user.routes.js";
import packageRoutes from "./routes/package.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import commissionRoutes from "./routes/commission.routes.js";
import withdrawalRoutes from "./routes/withdrawal.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import roleRoutes from "./routes/role.routes.js";
import blogRoutes from "./routes/blog.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy - Required when behind reverse proxy (nginx, load balancer, cloudflare, etc.)
// This allows Express to correctly identify the client's IP address from X-Forwarded-For header
app.set("trust proxy", true);

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/q-amchain")
  .then(() => {
    console.log("✅ MongoDB connected");
    // Create admin user if not exists
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/commissions", commissionRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/blogs", blogRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Q-Amchain API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
