
import userModel from "../models/userModel.js";
import connectRedis from "../config/redis.js";
import productModel from "../models/productModel.js";
import goldPriceModel from "../models/goldPriceModel.js";

// 🔹 Initialize Redis client once
const redisClient = await connectRedis();

// 🔹 Normalize color key
const normColorKey = (c) => {
  const k = String(c || "").trim().toLowerCase();
  if (!k || k === "-" || k === "null" || k === "undefined") return "-";
  if (["rosegold", "rose-gold", "rose"].includes(k)) return "rose-gold";
  if (["whitegold", "white-gold", "white"].includes(k)) return "white-gold";
  if (["yellow", "gold"].includes(k)) return "gold";
  return k;
};

// 🔹 Helper to get userId safely
const getUID = (req) => {
  if (req.user?.id) return req.user.id;        // from auth middleware
  if (req.body?.userId) return req.body.userId; // fallback
  return null;
};

// 🔹 Helper: save cart to Redis + MongoDB
const saveCart = async (userId, cart) => {
  await redisClient.setEx(`cart:${userId}`, 60 * 60, JSON.stringify(cart)); // cache 1 hour
  await userModel.findByIdAndUpdate(userId, { cartData: cart }, { new: true });
};

// 🔹 Calculate product pricing (same logic as frontend)
const calculateProductPricing = (product, selectedMaterial = "14K", goldRates) => {
  if (!goldRates || !product) {
    return null;
  }

  // Get gold rate for selected material
  const goldRate = goldRates[selectedMaterial] || goldRates["14K"];
  if (!goldRate) return null;

  // Extract product data with defaults
  const goldWeight = Number(product?.specs?.goldWeight || 0);
  const makingChargePerGram = Number(product?.makingChargePerGram || 0);
  const gstPercent = Number(product?.gstPercent || 3);
  const discountPercentage = Number(product?.discountPercentage || 0);

  // Calculate costs
  const metalCost = Math.round(goldRate * goldWeight);
  const makingCost = Math.round(makingChargePerGram * goldWeight);
  
  // Calculate diamond cost from diamondTypes array
  let diamondCost = 0;
  if (product?.specs?.diamondTypes && Array.isArray(product.specs.diamondTypes)) {
    diamondCost = product.specs.diamondTypes.reduce((total, diamond) => {
      const numDiamonds = Number(diamond.numberOfDiamonds) || 0;
      const pricePerDiamond = Number(diamond.pricePerDiamond) || 0;
      return total + (numDiamonds * pricePerDiamond);
    }, 0);
    diamondCost = Math.round(diamondCost);
  }

  // Calculate subtotals
  const subtotal = metalCost + makingCost + diamondCost;
  
  // Apply discount on making cost and diamond cost only (not metal cost)
  const discountableAmount = makingCost + diamondCost;
  const discountAmount = Math.round(discountableAmount * (discountPercentage / 100));
  const discountedSubtotal = subtotal - discountAmount;

  // Calculate GST on original amounts (before discount)
  const gstAmount = Math.round(subtotal * (gstPercent / 100));
  
  // Final totals
  const finalTotal = Math.round(discountedSubtotal + gstAmount);
  const totalBeforeDiscount = Math.round(subtotal + gstAmount);

  return {
    metalCost,
    makingCost,
    diamondCost,
    subtotal,
    discountAmount,
    gstAmount,
    finalTotal,
    totalBeforeDiscount,
    goldRate,
    goldWeight,
    makingChargePerGram,
    gstPercent,
    discountPercentage
  };
};

// 🔹 Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = getUID(req);
    if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });

    const { itemId, color = null, quantity = 1, ringSize, goldCarat, sku, pricing } = req.body;
    if (!itemId) return res.status(400).json({ success: false, message: "Missing itemId" });

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    let cart = {};
    const cached = await redisClient.get(`cart:${userId}`);
    cart = cached ? JSON.parse(cached) : user.cartData || {};

    const ckey = normColorKey(color);
    cart[itemId] = cart[itemId] || {};

    if (!cart[itemId][ckey]) {
      cart[itemId][ckey] = {
        quantity: Number(quantity),
        ringSize: ringSize || null,
        goldCarat: goldCarat || null,
        sku: sku || null,
        pricing: pricing || null
      };
    } else {
      cart[itemId][ckey].quantity += Number(quantity);
      if (ringSize) cart[itemId][ckey].ringSize = ringSize;
      if (goldCarat) cart[itemId][ckey].goldCarat = goldCarat;
      if (sku) cart[itemId][ckey].sku = sku;
      if (pricing) cart[itemId][ckey].pricing = pricing;
    }

    await saveCart(userId, cart);
    res.json({ success: true, message: "Added to cart", cartData: cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Update cart item
const updateCart = async (req, res) => {
  try {
    const userId = getUID(req);
    if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });

    const { itemId, color = null, quantity, ringSize, goldCarat, sku, pricing } = req.body;
    if (!itemId || typeof quantity !== "number") return res.status(400).json({ success: false, message: "Missing or invalid fields" });

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    let cart = {};
    const cached = await redisClient.get(`cart:${userId}`);
    cart = cached ? JSON.parse(cached) : user.cartData || {};

    const ckey = normColorKey(color);
    cart[itemId] = cart[itemId] || {};

    if (quantity <= 0) {
      delete cart[itemId][ckey];
      if (!Object.keys(cart[itemId]).length) delete cart[itemId];
    } else {
      cart[itemId][ckey] = {
        quantity,
        ringSize: ringSize ?? cart[itemId][ckey]?.ringSize ?? null,
        goldCarat: goldCarat ?? cart[itemId][ckey]?.goldCarat ?? null,
        sku: sku ?? cart[itemId][ckey]?.sku ?? null,
        pricing: pricing ?? cart[itemId][ckey]?.pricing ?? null
      };
    }

    await saveCart(userId, cart);
    res.json({ success: true, message: "Cart updated", cartData: cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Get user cart
const getUserCart = async (req, res) => {
  try {
    const userId = getUID(req);
    if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    let cart = {};
    const cached = await redisClient.get(`cart:${userId}`);
    cart = cached ? JSON.parse(cached) : user.cartData || {};

    // Save to Redis if not cached
    if (!cached) await redisClient.setEx(`cart:${userId}`, 60 * 60, JSON.stringify(cart));

    res.json({ success: true, cartData: cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Remove from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = getUID(req);
    if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });

    const { itemId, color = null } = req.body;
    if (!itemId) return res.status(400).json({ success: false, message: "Missing itemId" });

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    let cart = {};
    const cached = await redisClient.get(`cart:${userId}`);
    cart = cached ? JSON.parse(cached) : user.cartData || {};

    const ckey = normColorKey(color);
    if (cart[itemId]?.[ckey]) {
      delete cart[itemId][ckey];
      if (!Object.keys(cart[itemId]).length) delete cart[itemId];
    }

    await saveCart(userId, cart);
    res.json({ success: true, message: "Removed from cart", cartData: cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Clear full cart
const clearCart = async (req, res) => {
  try {
    const userId = getUID(req);
    if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });

    await saveCart(userId, {});
    res.json({ success: true, message: "Cart cleared", cartData: {} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Internal function to update all cart prices (can be called directly)
const updateAllCartPricesInternal = async () => {
  try {
    console.log("Starting bulk cart price update...");
    
    // Get current gold rates
    const currentPrices = await goldPriceModel.getCurrentPrice();
    if (!currentPrices) {
      return { 
        success: false, 
        message: "No current gold prices found. Please set prices in admin panel first." 
      };
    }

    const goldRates = {
      "24K": currentPrices.price24K,
      "18K": currentPrices.price18K,
      "14K": currentPrices.price14K,
      "10K": currentPrices.price10K
    };

    // Get all users with cart data
    const usersWithCarts = await userModel.find({ 
      cartData: { $exists: true, $ne: {} } 
    }).select('_id cartData');

    let updatedUsersCount = 0;
    let updatedItemsCount = 0;

    // Process each user's cart
    for (const user of usersWithCarts) {
      const cart = user.cartData || {};
      let cartUpdated = false;

      // Process each product in the cart
      for (const [productId, colorVariants] of Object.entries(cart)) {
        // Get product details
        const product = await productModel.findById(productId);
        if (!product) continue;

        // Process each color variant
        for (const [colorKey, cartItem] of Object.entries(colorVariants)) {
          if (typeof cartItem === 'object' && cartItem.goldCarat) {
            // Recalculate pricing with current gold rates
            const newPricing = calculateProductPricing(
              product, 
              cartItem.goldCarat, 
              goldRates
            );

            if (newPricing) {
              // Update the stored pricing using the original schema format
              cart[productId][colorKey].pricing = {
                originalPrice: Math.round(newPricing.totalBeforeDiscount),
                finalPrice: Math.round(newPricing.finalTotal),
                discountAmount: Math.round(newPricing.discountAmount),
                discountPercentage: Math.round(newPricing.discountPercentage),
                metalCost: Math.round(newPricing.metalCost),
                makingCost: Math.round(newPricing.makingCost),
                diamondCost: Math.round(newPricing.diamondCost),
                gstAmount: Math.round(newPricing.gstAmount)
              };
              
              cartUpdated = true;
              updatedItemsCount++;
            }
          }
        }
      }

      // Save updated cart if changes were made
      if (cartUpdated) {
        await saveCart(user._id.toString(), cart);
        updatedUsersCount++;
      }
    }

    console.log(`Bulk cart price update completed: ${updatedUsersCount} users, ${updatedItemsCount} items updated`);
    
    return {
      success: true,
      message: "Cart prices updated successfully",
      stats: {
        usersUpdated: updatedUsersCount,
        itemsUpdated: updatedItemsCount
      }
    };
  } catch (err) {
    console.error("updateAllCartPricesInternal error:", err);
    return { success: false, message: err.message };
  }
};

export { addToCart, updateCart, getUserCart, removeFromCart, clearCart, updateAllCartPricesInternal };
