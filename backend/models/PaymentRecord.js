// server/models/PaymentRecord.js
import mongoose from "mongoose";

const PaymentRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  auction: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true },
  order_id: { type: String, required: true },

  // Razorpay details
  razorpayOrderId: { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
  razorpaySignature: { type: String, default: null },

  // paymentLink short url saved here
  paymentLinkUrl: { type: String, default: null },

  paymentRef: { type: String, default: null },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId },
      name: String,
      quantity: Number,
      price: Number,
      image: String,
    },
  ],

  amountPaise: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" },

  // full provider response (store for debugging)
  providerResponse: { type: Object, default: null },

  receipt: { type: String, default: null },

  address: {
    fullName: String,
    line1: String,
    city: String,
    state: String,
    pincode: String,
  },
  mobile: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  depositPercent: { type: Number, default: null },
  depositPaise: { type: Number, default: 0 },
  depositAmountPaise: { type: Number, default: null },
  amountDuePaise: { type: Number, required: true },
});

PaymentRecordSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.PaymentRecord || mongoose.model("PaymentRecord", PaymentRecordSchema);
