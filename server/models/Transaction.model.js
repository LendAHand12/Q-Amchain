import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    default: null
  },
  // Store package info at time of purchase to prevent issues if package is modified/deleted
  packageInfo: {
    name: {
      type: String,
      default: null
    },
    price: {
      type: Number,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    commissionLv1: {
      type: Number,
      default: null
    },
    commissionLv2: {
      type: Number,
      default: null
    }
  },
  type: {
    type: String,
    enum: ['payment', 'commission', 'withdrawal', 'refund'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USDT'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  transactionHash: {
    type: String,
    default: null
  },
  fromAddress: {
    type: String,
    default: null
  },
  toAddress: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

transactionSchema.index({ userId: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ transactionHash: 1 });

export default mongoose.model('Transaction', transactionSchema);

