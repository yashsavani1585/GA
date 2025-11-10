// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     // Existing fields
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: function() { return this.authProvider === 'jwt'; } },

//     phone: { type: String },
//     address: { type: String },
//     apartment: { type: String },
//     city: { type: String },
//     state: { type: String },
//     zip: { type: String },
//     dob: { type: String },
//     gender: { type: String },
//     cartData: { type: Object, default: {} },
//     wishlist: { type: [String], default: [] },


//     // Google OAuth integration fields
//     googleId: {              // New field for Google user ID
//         type: String,
//         unique: true,
//         sparse: true,
//         index: true
//     },
//     firstName: { type: String, trim: true },
//     lastName: { type: String, trim: true },
//     photo: { type: String, default: null },

//     isActive: { type: Boolean, default: true },
//     lastLogin: { type: Date, default: Date.now },
//     authProvider: {
//         type: String,
//         enum: ['jwt', 'google'],
//         default: 'jwt'
//     }
// }, { minimize: false, timestamps: true });

// // Index for better performance
// userSchema.index({ googleId: 1, email: 1 });

// // Virtual for full name
// userSchema.virtual('fullName').get(function() {
//     if (this.firstName && this.lastName) {
//         return `${this.firstName} ${this.lastName}`.trim();
//     }
//     return this.name || '';
// });

// // Ensure virtual fields are serialized
// userSchema.set('toJSON', { virtuals: true });
// userSchema.set('toObject', { virtuals: true });

// const userModel = mongoose.models.user || mongoose.model('user', userSchema);

// export default userModel;











// // import mongoose from "mongoose";

// // const userSchema = new mongoose.Schema({
// //     // Existing fields - preserved for backward compatibility
// //     name: {type: String , required:true},
// //     email: {type: String , required:true, unique:true},
// //     password: { type: String, required: function() { return this.authProvider === 'jwt'; } },

// //     phone: {type: String},
// //     address: {type: String},
// //     apartment: {type: String},
// //     city: {type: String},
// //     state: {type: String},
// //     zip: {type: String},
// //     dob: {type: String},
// //     gender: {type: String},
// //     cartData: {type: Object, default: {}}, // { productId: quantity }
    
// //     // Clerk integration fields - optional for backward compatibility
// //     clerkId: {
// //         type: String,
// //         unique: true,
// //         sparse: true, // Allows null values while maintaining uniqueness
// //         index: true, // Add index for better query performance
// //     },
// //     firstName: {
// //         type: String,
// //         trim: true,
// //     },
// //     lastName: {
// //         type: String,
// //         trim: true,
// //     },
// //     photo: {
// //         type: String,
// //         default: null,
// //     },
// //     isActive: {
// //         type: Boolean,
// //         default: true,
// //     },
// //     lastLogin: {
// //         type: Date,
// //         default: Date.now,
// //     },
// //     authProvider: {
// //         type: String,
// //         enum: ['jwt', 'clerk'],
// //         default: 'jwt' // Default to JWT for existing users
// //     }
// // },{minimize:false, timestamps: true}) // Add timestamps for createdAt and updatedAt

// // // Create compound index for better query performance
// // userSchema.index({ clerkId: 1, email: 1 });

// // // Virtual for full name (works with both existing 'name' field and new firstName/lastName)
// // userSchema.virtual('fullName').get(function() {
// //     if (this.firstName && this.lastName) {
// //         return `${this.firstName} ${this.lastName}`.trim();
// //     }
// //     return this.name || '';
// // });

// // // Ensure virtual fields are serialized
// // userSchema.set('toJSON', { virtuals: true });
// // userSchema.set('toObject', { virtuals: true });

// // const userModel = mongoose.models.user || mongoose.model('user', userSchema);

// // export default userModel


// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: function() { return this.authProvider === 'jwt'; } },
  
//   // Verification fields
//   verified: { type: Boolean, default: false },
//   documentType: { 
//     type: String, 
//     enum: ["aadhar", "pan", "driving_license", "passport", "voter_id", null],
//     default: null 
//   },
//   documentFile: { type: String, default: null },
//   verificationSubmittedAt: { type: Date, default: null },
//   verifiedAt: { type: Date, default: null },
//   verificationRejected: { type: Boolean, default: false },
//   rejectionReason: { type: String, default: null },

//   phone: { type: String },
//   address: { type: String },
//   apartment: { type: String },
//   city: { type: String },
//   state: { type: String },
//   zip: { type: String },
//   dob: { type: String },
//   gender: { type: String },
//   cartData: { type: Object, default: {} },
//   wishlist: { type: [String], default: [] },

//   // Google OAuth
//   googleId: { type: String, unique: true, sparse: true, index: true },
//   firstName: { type: String, trim: true },
//   lastName: { type: String, trim: true },
//   photo: { type: String, default: null },

//   isActive: { type: Boolean, default: true },
//   lastLogin: { type: Date, default: Date.now },
//   authProvider: { type: String, enum: ['jwt', 'google'], default: 'jwt' }
// }, { minimize: false, timestamps: true });

// // Index for faster queries
// userSchema.index({ googleId: 1, email: 1 });
// userSchema.index({ verified: 1, documentFile: 1 }); // For pending verifications query

// // Virtual for full name
// userSchema.virtual('fullName').get(function() {
//   if (this.firstName && this.lastName) return `${this.firstName} ${this.lastName}`.trim();
//   return this.name || '';
// });

// // Virtual for verification status
// userSchema.virtual('verificationStatus').get(function() {
//   if (this.verified) return 'verified';
//   if (this.documentFile && !this.verified) return 'pending';
//   return 'not_submitted';
// });

// // Ensure virtuals are included in JSON
// userSchema.set('toJSON', { virtuals: true });
// userSchema.set('toObject', { virtuals: true });

// // ✅ Important: Use capitalized model name "User"
// const User = mongoose.models.User || mongoose.model("User", userSchema);
// export default User;

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

// Indexes
userSchema.index({ googleId: 1, email: 1 });
userSchema.index({ verified: 1, documentFile: 1 }); // For pending verification queries

// Virtual: fullName
userSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) return `${this.firstName} ${this.lastName}`.trim();
  return this.name || '';
});

// Virtual: verificationStatus
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
