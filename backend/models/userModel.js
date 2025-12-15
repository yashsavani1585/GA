

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Basic info
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return this.authProvider === 'jwt'; } },

  // Verification fields
  verified: { type: Boolean, default: false },

  // ✅ Remove enum restriction, allow any string or null
  documentType: { 
    type: String, 
    default: null 
  },
  documentFile: { type: String, default: null },
  verificationSubmittedAt: { type: Date, default: null },
  verifiedAt: { type: Date, default: null },
  verificationRejected: { type: Boolean, default: false },
  rejectionReason: { type: String, default: null },

  // Contact info
  phone: { type: String },
  address: { type: String },
  apartment: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: String },
  dob: { type: String },
  gender: { type: String },

  // Cart & wishlist
  cartData: { type: Object, default: {} }, // { productId: quantity }
  wishlist: { type: [String], default: [] },

  // Google OAuth
  googleId: { type: String, unique: true, sparse: true, index: true },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  photo: { type: String, default: null },

  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: Date.now },
  authProvider: { type: String, enum: ['jwt', 'google'], default: 'jwt' }
}, { minimize: false, timestamps: true });


userSchema.index({ googleId: 1, email: 1 });
userSchema.index({ verified: 1, documentFile: 1 }); // For pending verification queries

// Virtual: fullName
userSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) return `${this.firstName} ${this.lastName}`.trim();
  return this.name || '';
});

userSchema.virtual('verificationStatus').get(function() {
  if (this.verified) return 'verified';
  if (this.documentFile && !this.verified) return 'pending';
  return 'not_submitted';
});

// Include virtuals in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
