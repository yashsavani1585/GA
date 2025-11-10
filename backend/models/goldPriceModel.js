// models/goldPriceModel.js
import mongoose from "mongoose";

const goldPriceSchema = new mongoose.Schema({
  // Base 24K price per gram (input from admin)
  price24K: { 
    type: Number, 
    required: true,
    min: 0
  },
  
  // Auto-calculated prices per gram for other karats
  price18K: { 
    type: Number, 
    required: false, // Auto-calculated in pre-save
    min: 0
  },
  price14K: { 
    type: Number, 
    required: false, // Auto-calculated in pre-save
    min: 0
  },
  price10K: { 
    type: Number, 
    required: false, // Auto-calculated in pre-save
    min: 0
  },
  
  // Metadata
  updatedBy: { 
    type: String, 
    default: "admin" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  
  // Mark as active price (only one active at a time)
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate other karat prices
goldPriceSchema.pre('save', function(next) {
  if (this.isModified('price24K')) {
    // Calculate based on karat purity ratios
    this.price18K = Math.round((18/24) * this.price24K);
    this.price14K = Math.round((14/24) * this.price24K);
    this.price10K = Math.round((10/24) * this.price24K);
  }
  this.updatedAt = new Date();
  next();
});

// Ensure only one active price at a time
goldPriceSchema.pre('save', async function(next) {
  if (this.isActive && this.isNew) {
    // Set all other prices to inactive
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

// Static method to get current active price
goldPriceSchema.statics.getCurrentPrice = async function() {
  return await this.findOne({ isActive: true }).sort({ createdAt: -1 });
};

// Static method to get price by karat
goldPriceSchema.statics.getPriceByKarat = async function(karat) {
  const currentPrice = await this.getCurrentPrice();
  if (!currentPrice) return null;
  
  switch(karat) {
    case '24': case 24: return currentPrice.price24K;
    case '18': case 18: return currentPrice.price18K;
    case '14': case 14: return currentPrice.price14K;
    case '10': case 10: return currentPrice.price10K;
    default: return currentPrice.price14K; // default to 14K
  }
};

const goldPriceModel = mongoose.models.goldPrice || mongoose.model("goldPrice", goldPriceSchema);
export default goldPriceModel;