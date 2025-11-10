// import mongoose from "mongoose";

// const auctionSchema = new mongoose.Schema({
//   productName: { type: String, required: true, trim: true },
//   productDescription: { type: String, trim: true },
//   productImage: { type: String, default: null },
//   startingPrice: { type: Number, required: true, min: 0 },
//   currentPrice: { type: Number, default: 0 },
//   highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
//   duration: { type: Number, default: 5, min: 1 },          // minutes
//   startAt: { type: Date, default: Date.now },
//   endTime: { type: Date },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
//   status: { type: String, enum: ["upcoming", "live", "ended"], default: "upcoming" },
//   minIncrement: { type: Number, default: 1, min: 0 },
//   bidsCount: { type: Number, default: 0 },
//   bids: [
//     {
//       bidder: { type: mongoose.Schema.Types.ObjectId, ref: "Bid", required: true },
//       amount: { type: Number, required: true },
//       time: { type: Date, default: Date.now },
//     }
//   ]
// }, { timestamps: true });

// // Auto-calc endTime based on startAt + duration
// auctionSchema.pre("save", function(next) {
//   if (this.duration && this.startAt && !this.endTime) {
//     this.endTime = new Date(new Date(this.startAt).getTime() + this.duration * 60 * 1000);
//   }
//   next();
// });

// const Auction = mongoose.models.Auction || mongoose.model("Auction", auctionSchema);
// export default Auction;

import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  productName: { type: String, required: true, trim: true },
  productDescription: { type: String, trim: true },
  productImage: { type: String, default: null },
  startingPrice: { type: Number, required: true, min: 0 },
  currentPrice: { type: Number, default: 0 },
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  duration: { type: Number, required: true, min: 1 }, // hours
  startAt: { type: Date, default: Date.now },
  endTime: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: { type: String, enum: ["upcoming", "live", "ended", "cancelled"], default: "upcoming" },
  minIncrement: { type: Number, default: 100, min: 0 },
  bidsCount: { type: Number, default: 0 },
  lastBidAt: { type: Date },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bid" }],
  isActive: { type: Boolean, default: true },
  
  // Payment fields
  paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  paymentId: { type: String },
  paidAt: { type: Date }
}, { timestamps: true });

// Auto-calc endTime based on startAt + duration
auctionSchema.pre("save", function(next) {
  if (this.duration && this.startAt && !this.endTime) {
    this.endTime = new Date(new Date(this.startAt).getTime() + this.duration * 60 * 60 * 1000);
  }
  next();
});

const Auction = mongoose.models.Auction || mongoose.model("Auction", auctionSchema);
export default Auction;