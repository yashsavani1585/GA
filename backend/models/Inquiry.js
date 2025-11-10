import mongoose from "mongoose";


const DiamondSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    photo: { type: String, trim: true }, // optional CDN path
  },
  { _id: false }
);

const inquirySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", default: null },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    diamond: { type: DiamondSchema, default: null },
    diamondQuantity: { type: Number, default: 1, min: 1, max: 50 },
    topic: { type: String, default: "general" },
    status: { type: String, enum: ["new","read","resolved"], default: "new" },
    adminNotes: { type: String, default: "" }
  },
  { timestamps: true }
);

inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ email: 1, createdAt: -1 });

export default mongoose.models.inquiry ||
  mongoose.model("inquiry", inquirySchema);
