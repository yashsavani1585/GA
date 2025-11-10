// // models/bidModel.js
// import mongoose from "mongoose";

// const bidSchema = new mongoose.Schema(
//   {
//     auction: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Auction",    // must match Auction model name
//       required: true,
//       index: true,
//     },
//     bidder: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",       // must match User model name
//       required: true,
//       index: true,
//     },
//     amount: {
//       type: Number,
//       required: true,
//       min: [0, "Bid amount must be positive"],
//     },
//     placedAt: {
//       type: Date,
//       default: Date.now,
//     },
//     isWinningBid: {
//       type: Boolean,
//       default: false,
//     },
//     bidType: {
//       type: String,
//       enum: ["manual", "auto"],
//       default: "manual",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// bidSchema.index({ auction: 1, amount: -1 });
// bidSchema.index({ bidder: 1, auction: 1 });

// // Optional: populate bidder details automatically (edit or remove if expensive)
// bidSchema.pre(/^find/, function (next) {
//   this.populate("bidder", "name email photo");
//   next();
// });

// const Bid = mongoose.models.Bid || mongoose.model("Bid", bidSchema);
// export default Bid;

import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
      index: true,
    },
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Bid amount must be positive"],
    },
    placedAt: {
      type: Date,
      default: Date.now,
    },
    isWinningBid: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

bidSchema.index({ auction: 1, amount: -1 });
bidSchema.index({ bidder: 1, auction: 1 });

const Bid = mongoose.models.Bid || mongoose.model("Bid", bidSchema);
export default Bid;