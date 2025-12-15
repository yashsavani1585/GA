import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  productName: { type: String, required: true, trim: true },
  productDescription: { type: String, trim: true },
  productImage: { type: String, default: null },
  startingPricePaise: { type: Number, required: true, min: 0 }, // paise
  currentPricePaise: { type: Number, default: 0 }, // paise
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  durationHours: { type: Number, required: true }, // hours
  durationMinutes: {
  type: Number,
  required: true,
},

  startAt: { type: Date, default: Date.now },
  endAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: { type: String, enum: ["upcoming", "live", "ended", "completed", "cancelled"], default: "upcoming" },
  minIncrementPaise: { type: Number, default: 10000, min: 0 }, // default 100.00 INR => 10000 paise
  bidsCount: { type: Number, default: 0 },
  lastBidAt: { type: Date },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bid" }],
  isActive: { type: Boolean, default: true },
  depositPercent: { type: Number, default: 25 }, // percent
  // Payment/finalization
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  finalPricePaise: { type: Number, default: null },
  pendingPaymentUntil: { type: Date,
    default: null,
  },
  secondBidderNotified: { type: Boolean, default: false },
}, { timestamps: true });

// Auto-calc endAt
auctionSchema.pre("save", function(next) {
  if (this.durationHours && this.startAt && !this.endAt) {
    this.endAt = new Date(new Date(this.startAt).getTime() + this.durationHours * 60 * 60 * 1000);
  }
  next();
});

export default mongoose.models.Auction || mongoose.model("Auction", auctionSchema);
