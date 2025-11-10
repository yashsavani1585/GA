import mongoose from "mongoose";

const personalizedRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", default: null },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    type: { type: String, enum: ["rings","necklace","bracelet","earrings","pendantset"], required: true },
    metal: { type: String, required: true }, // e.g. "gold-yellow-14kt"
    notes: { type: String, default: "" },    // user’s description
    fileUrl: { type: String, default: null }, // uploaded design/reference
    status: { type: String, enum: ["new","in_progress","quoted","closed"], default: "new" },
    adminNotes: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.models.personalized_request ||
  mongoose.model("personalized_request", personalizedRequestSchema);
