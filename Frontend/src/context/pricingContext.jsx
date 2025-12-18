// context/pricingContext.jsx
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const backendUrl = import.meta.env.VITE_API_BASE_URL || "https://ga-inx6.onrender.com/api";

// Shared cache for gold rates
const RATE_TTL_MS = 60_000; // 60 seconds
let goldRateCache = { ts: 0, rates: null, promise: null };

const PricingContext = createContext();

export const usePricing = () => {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error("usePricing must be used within a PricingProvider");
  }
  return context;
};

export const PricingProvider = ({ children }) => {
  const [goldRates, setGoldRates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all gold rates from database
  const fetchGoldRates = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    
    // Use cache if valid and not forcing refresh
    if (!forceRefresh && goldRateCache.rates && now - goldRateCache.ts < RATE_TTL_MS) {
      setGoldRates(goldRateCache.rates);
      return goldRateCache.rates;
    }

    // Return existing promise if already fetching
    if (goldRateCache.promise) {
      return goldRateCache.promise;
    }

    goldRateCache.promise = (async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data } = await axios.get(`${backendUrl}/pricing/gold-prices`);
        
        if (data?.success && data.prices) {
          const rates = {
            "24K": data.prices["24K"],
            "18K": data.prices["18K"], 
            "14K": data.prices["14K"],
            "10K": data.prices["10K"]
          };
          
          goldRateCache.rates = rates;
          goldRateCache.ts = Date.now();
          setGoldRates(rates);
          return rates;
        } else {
          throw new Error("No gold prices found");
        }
      } catch (err) {
        console.error("Error fetching gold rates:", err);
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
        goldRateCache.promise = null;
      }
    })();

    return goldRateCache.promise;
  }, []);

  // Get specific karat rate
  const getGoldRate = useCallback((karat) => {
    if (!goldRates) return null;
    // Remove 'K' if present and add it back
    const karatNumber = String(karat).replace('K', '');
    const karatKey = `${karatNumber}K`;
    return goldRates[karatKey] || goldRates["14K"]; // default to 14K
  }, [goldRates]);

  // Calculate complete pricing for a product
  const calculateProductPricing = useCallback((product, selectedMaterial = "14K") => {
    const goldRate = getGoldRate(selectedMaterial);
    
    if (!goldRate || !product) {
      return {
        metalCost: 0,
        makingCost: 0,
        diamondCost: 0,
        subtotal: 0,
        discountAmount: 0,
        gstAmount: 0,
        finalTotal: 0,
        totalBeforeDiscount: 0,
        loading: !goldRates,
        error: error
      };
    }

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
      discountPercentage,
      loading: false,
      error: null
    };
  }, [goldRates, getGoldRate, error]);

  // Calculate pricing for cart items
  const calculateCartItemPricing = useCallback((cartItem) => {
    const { product, goldCarat = "14K", quantity = 1 } = cartItem;
    const itemPricing = calculateProductPricing(product, goldCarat);
    
    return {
      ...itemPricing,
      quantity,
      itemTotal: itemPricing.finalTotal * quantity,
      itemSubtotal: itemPricing.subtotal * quantity,
      itemDiscountAmount: itemPricing.discountAmount * quantity,
      itemGstAmount: itemPricing.gstAmount * quantity
    };
  }, [calculateProductPricing]);

  // Initialize gold rates on mount
  useEffect(() => {
    fetchGoldRates();
  }, [fetchGoldRates]);

  const value = useMemo(() => ({
    goldRates,
    loading,
    error,
    fetchGoldRates,
    getGoldRate,
    calculateProductPricing,
    calculateCartItemPricing,
    refreshRates: () => fetchGoldRates(true)
  }), [
    goldRates,
    loading,
    error,
    fetchGoldRates,
    getGoldRate,
    calculateProductPricing,
    calculateCartItemPricing
  ]);

  return (
    <PricingContext.Provider value={value}>
      {children}
    </PricingContext.Provider>
  );
};

PricingProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default PricingContext;