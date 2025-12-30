import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USDT',
    enum: ['USDT']
  },
  commissionLv1: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  commissionLv2: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  features: [{
    type: String
  }],
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

packageSchema.index({ status: 1, isDeleted: 1 });

export default mongoose.model('Package', packageSchema);

