


// backend/models/Payment.js
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    order_id: { type: String, default: () => uuidv4(), unique: true, index: true },

    email: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true },

    deliveryType: { type: String, enum: ["Home Delivery", "Store Pickup"], required: true },
    recipientName: { type: String, required: true },
    recipientMobile: { type: String },
    pincode: { type: String, required: true },
    houseNo: { type: String, required: true },
    street: { type: String, required: true },
    locality: { type: String, required: true },
    landmark: { type: String },
    gstNumber: { type: String },

    cartData: { type: Object, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"], default: "PENDING", index: true },

    razorpayOrderId: { type: String, index: true, default: null },
    razorpayPaymentId: { type: String, index: true, default: "N/A" },
    razorpaySignature: { type: String, default: null },
    providerResponse: { type: Object, default: {} },
    paymentVerifiedAt: { type: Date },

    // link to order (if you want a direct pointer)
    orderRef: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },

    // support dynamic ref naming if you need
    paymentRefModel: { type: String, enum: ["Payment", "Payment2"], default: "Payment" },
  },
  { timestamps: true }
);

paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.pre("save", function (next) {
  if (!this.recipientMobile) this.recipientMobile = this.mobileNumber;
  next();
});

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
