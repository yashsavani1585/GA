import mongoose from 'mongoose';

const DepositSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
  amountPaise: { type: Number, required: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  status: { type: String, enum: ['pending','paid','forfeited','refunded'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

DepositSchema.index({ user:1, auction:1 }, { unique: true }); // one deposit per user/auction

export default mongoose.models.Deposit || mongoose.model('Deposit', DepositSchema);
