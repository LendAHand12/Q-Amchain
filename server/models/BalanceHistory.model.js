import mongoose from 'mongoose';

const balanceHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['withdrawal', 'commission', 'refund', 'payment'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  balanceBefore: {
    type: Number,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  relatedType: {
    type: String,
    enum: ['withdrawal', 'commission', 'transaction', null],
    default: null
  }
}, {
  timestamps: true
});

balanceHistorySchema.index({ userId: 1, createdAt: -1 });
balanceHistorySchema.index({ type: 1 });

export default mongoose.model('BalanceHistory', balanceHistorySchema);

