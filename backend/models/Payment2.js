



import mongoose from "mongoose";

const payment2Schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order_id: { type: String, required: true },

    // 🔹 Razorpay details
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    paymentRef: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    // 🔹 Status flags
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      default: "PENDING",
    },

    // 🔹 Images
    image: { type: String },
    productImage: { type: String },
    auctionImage: { type: String },

    // 🔹 Item details
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId },
        name: String,
        quantity: Number,
        price: Number,
        image: String,
      },
    ],

    // 🔹 Razorpay response snapshot
    providerResponse: { type: Object, default: {} },

    // 🔹 Address Info
    address: {
      fullName: String,
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },
    mobile: String,
  },
  { timestamps: true }
);

const Payment2 =
  mongoose.models.Payment2 || mongoose.model("Payment2", payment2Schema);

export default Payment2;
