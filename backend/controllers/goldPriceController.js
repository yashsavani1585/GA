// controllers/goldPriceController.js
import goldPriceModel from "../models/goldPriceModel.js";

// Helper function to trigger cart price updates
const triggerCartPriceUpdate = async () => {
  try {
    // Import the function dynamically to avoid circular imports
    const { updateAllCartPricesInternal } = await import("./cartController.js");
    const result = await updateAllCartPricesInternal();
    
    if (result?.success) {
      console.log(`Cart prices updated: ${result.stats?.usersUpdated || 0} users, ${result.stats?.itemsUpdated || 0} items`);
      return result.stats;
    } else {
      console.error("Failed to update cart prices:", result?.message);
      return null;
    }
  } catch (error) {
    console.error("Error triggering cart price update:", error.message);
    return null;
  }
};

// Get current active gold prices
const getCurrentPrices = async (req, res) => {
  try {
    const currentPrice = await goldPriceModel.getCurrentPrice();
    
    if (!currentPrice) {
      return res.json({ 
        success: false, 
        message: "No gold prices found. Please set prices in admin panel." 
      });
    }

    res.json({
      success: true,
      prices: {
        "24K": currentPrice.price24K,
        "18K": currentPrice.price18K,
        "14K": currentPrice.price14K,
        "10K": currentPrice.price10K
      },
      lastUpdated: currentPrice.updatedAt
    });
  } catch (error) {
    console.error("getCurrentPrices error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get price by specific karat (for backward compatibility)
const getPriceByKarat = async (req, res) => {
  try {
    const { carat } = req.query;
    
    if (!carat) {
      return res.json({ success: false, message: "Carat parameter required" });
    }

    const price = await goldPriceModel.getPriceByKarat(carat);
    
    if (price === null) {
      return res.json({ 
        success: false, 
        message: "No gold prices found. Please set prices in admin panel." 
      });
    }

    res.json({
      success: true,
      carat: carat,
      ratePerGram: price,
      lastUpdated: (await goldPriceModel.getCurrentPrice())?.updatedAt
    });
  } catch (error) {
    console.error("getPriceByKarat error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Admin: Set new gold price (24K base)
const setGoldPrice = async (req, res) => {
  try {
    const { price24K, updatedBy = "admin" } = req.body;

    if (!price24K || price24K <= 0) {
      return res.json({ 
        success: false, 
        message: "Valid 24K price per gram is required" 
      });
    }

    // Create new price entry (pre-save hook will calculate other karats)
    const newPrice = new goldPriceModel({
      price24K: Number(price24K),
      updatedBy
    });

    await newPrice.save();

    // Trigger cart price updates in background
    // Don't await this to avoid delaying the response
    triggerCartPriceUpdate()
      .then(stats => {
        if (stats) {
          console.log(`Gold price updated successfully. Cart update stats:`, stats);
        }
      })
      .catch(err => {
        console.error("Background cart price update failed:", err);
      });

    res.json({
      success: true,
      message: "Gold prices updated successfully. Cart prices will be updated automatically.",
      prices: {
        "24K": newPrice.price24K,
        "18K": newPrice.price18K,
        "14K": newPrice.price14K,
        "10K": newPrice.price10K
      }
    });
  } catch (error) {
    console.error("setGoldPrice error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Admin: Get price history
const getPriceHistory = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const history = await goldPriceModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      history: history.map(price => ({
        id: price._id,
        price24K: price.price24K,
        price18K: price.price18K,
        price14K: price.price14K,
        price10K: price.price10K,
        updatedBy: price.updatedBy,
        createdAt: price.createdAt,
        isActive: price.isActive
      }))
    });
  } catch (error) {
    console.error("getPriceHistory error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Admin: Delete price entry
const deletePrice = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.json({ success: false, message: "Price ID is required" });
    }

    const deletedPrice = await goldPriceModel.findByIdAndDelete(id);

    if (!deletedPrice) {
      return res.json({ success: false, message: "Price entry not found" });
    }

    // If we deleted the active price, make the latest one active
    if (deletedPrice.isActive) {
      const latestPrice = await goldPriceModel
        .findOne({})
        .sort({ createdAt: -1 });
        
      if (latestPrice) {
        latestPrice.isActive = true;
        await latestPrice.save();
      }
    }

    res.json({
      success: true,
      message: "Price entry deleted successfully"
    });
  } catch (error) {
    console.error("deletePrice error:", error);
    res.json({ success: false, message: error.message });
  }
};

export {
  getCurrentPrices,
  getPriceByKarat,
  setGoldPrice,
  getPriceHistory,
  deletePrice
};