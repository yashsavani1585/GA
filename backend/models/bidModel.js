

import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    auction: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true, index: true },
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amountPaise: { type: Number, required: true, min: [0, "Bid amount must be positive"] },
    placedAt: { type: Date, default: Date.now },
    isWinningBid: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

bidSchema.index({ auction: 1, amountPaise: -1 });
bidSchema.index({ bidder: 1, auction: 1 });

export default mongoose.models.Bid || mongoose.model("Bid", bidSchema);
