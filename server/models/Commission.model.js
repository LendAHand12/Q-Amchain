import mongoose from 'mongoose';

const commissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    default: null
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
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
  level: {
    type: Number,
    required: true,
    enum: [1, 2]
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  percentage: {
    type: Number,
    required: true
  },
  orderAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'credited', 'withdrawn'],
    default: 'pending'
  },
  creditedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

commissionSchema.index({ userId: 1 });
commissionSchema.index({ transactionId: 1 });
commissionSchema.index({ buyerId: 1 });
commissionSchema.index({ status: 1 });

export default mongoose.model('Commission', commissionSchema);

