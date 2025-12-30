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

