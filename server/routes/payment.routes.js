import express from "express";
import * as paymentController from "../controllers/payment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get payment address
router.get("/address", authenticate, (req, res) => {
  const paymentAddress = process.env.MAIN_WALLET_ADDRESS;
  if (!paymentAddress) {
    return res.status(500).json({
      success: false,
      message: "Payment address not configured",
    });
  }
  res.json({
    success: true,
    data: { address: paymentAddress },
  });
});

// Verify payment
router.post("/verify", authenticate, paymentController.verifyPayment);

export default router;
