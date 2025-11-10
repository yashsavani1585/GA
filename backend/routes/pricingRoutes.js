// backend/routes/pricingRoutes.js
import express from "express";
import { 
  getCurrentPrices, 
  getPriceByKarat, 
  setGoldPrice, 
  getPriceHistory, 
  deletePrice 
} from "../controllers/goldPriceController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Public routes (for frontend components)
router.get("/gold-rate", getPriceByKarat); // Backward compatibility: ?carat=14
router.get("/gold-prices", getCurrentPrices); // Get all current prices

// Admin routes (protected)
router.post("/admin/set-price", adminAuth, setGoldPrice); // Set new 24K price
router.get("/admin/price-history", adminAuth, getPriceHistory); // Get price history
router.delete("/admin/delete-price", adminAuth, deletePrice); // Delete price entry

export default router;
