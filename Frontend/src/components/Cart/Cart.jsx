import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "../../context/cartContext";
import { usePricing } from "../../context/pricingContext";
import { useOrder } from "../../context/orderContext";
import { FaTrash, FaHeart, FaCheckCircle, FaGift } from "react-icons/fa";
import emptyCartImg from "../../assets/Empty.png";
import { Link, useNavigate } from "react-router-dom";


const Cart = () => {
  const { items, update, remove, moveToWishlist, refresh } = useCart();
  const { calculateProductPricing, refreshRates, goldRates } = usePricing();
  const { setOrder } = useOrder();
  const navigate = useNavigate();

  // Summarize diamonds from the new structure
  const summarizeDiamonds = (specs = {}) => {
    // New data structure
    if (Array.isArray(specs.diamondTypes)) {
      let count = 0;
      let caratTotal = 0;
      for (const d of specs.diamondTypes) {
        const n = Number(d?.numberOfDiamonds) || 0;
        const c = Number(d?.carat) || 0; // per-diamond carat
        count += n;
        caratTotal += n * c;
      }
      return {
        count,
        carat: Number(caratTotal.toFixed(4)), // keep 4-decimal precision like your UI example
      };
    }

    // Fallback to old fields if diamondTypes absent
    const count = Number(specs.numberOfDiamonds || 0);
    const carat = Number(specs.totalCaratWeight || 0);
    return {
      count,
      carat: Number(carat.toFixed(4)),
    };
  };


  // Force refresh cart data from database when component mounts
  useEffect(() => {
    if (refresh) {
      refresh();
    }
  }, [refresh]);

  // Refresh gold rates when component mounts to get latest pricing
  useEffect(() => {
    refreshRates();
  }, [refreshRates]);

  // Filter products that are properly loaded from database
  const products = useMemo(() => {
    if (!items || items.length === 0) return [];

    return items;
  }, [items]);

  // State for cart item customizations
  const [itemCustomizations, setItemCustomizations] = useState({});

  const formatIN = (n) => Number(n ?? 0).toLocaleString("en-IN");

  // Helper functions for cart item customizations
  const getItemCustomization = (itemKey, field) => {
    return itemCustomizations[itemKey]?.[field];
  };

  const updateItemCustomization = (itemKey, field, value) => {
    setItemCustomizations(prev => ({
      ...prev,
      [itemKey]: {
        ...prev[itemKey],
        [field]: value
      }
    }));
  };

  // Update cart item with customizations
  const updateWithCustomization = (itemKey, qty, customization = {}) => {
    // Ensure we preserve existing values and only update what's provided
    const item = products.find(p => p.key === itemKey);
    const product = item?.product || {};
    
    const updatedData = {
      // Only include ringSize for rings category
      ringSize: product.category === "rings" 
        ? (customization.ringSize !== undefined ? customization.ringSize : (item?.ringSize || 14))
        : null,
      goldCarat: item?.goldCarat || null, // Keep existing goldCarat from MoreInfo2, no fallback
      sku: customization.sku !== undefined ? customization.sku : item?.sku
    };
    update(itemKey, qty, updatedData);
  };

  // Get pricing for a cart item - Always recalculate based on current gold rates
  const getItemPricing = useMemo(() => {
    return (item) => {
      const product = item.product || {};

      // Calculate SKU from product data or use stored SKU
      let sku = item.sku || product?.sku || product?.skuId;

      // If we have color and skuByColor mapping, use that
      if (item.color && product.skuByColor && product.skuByColor[item.color]) {
        sku = product.skuByColor[item.color];
      }

      // Fallback to product code or ID
      if (!sku) {
        sku = product?.productCode || product?._id;
      }

      // Always use current pricing calculations to reflect admin changes
      const pricingResult = calculateProductPricing(product, item.goldCarat || "14K");

      if (pricingResult) {
        return {
          originalPrice: Math.round(pricingResult.totalBeforeDiscount || 0),
          finalPrice: Math.round(pricingResult.finalTotal || 0),
          discountAmount: Math.round(pricingResult.discountAmount || 0),
          discountPercentage: Math.round(pricingResult.discountPercentage || 0),
          sku: sku,
          material: item.goldCarat || null,
          hasStoredPricing: false, // Always using current pricing
          gstAmount: Math.round(pricingResult.gstAmount || 0),
          metalCost: Math.round(pricingResult.metalCost || 0),
          makingCost: Math.round(pricingResult.makingCost || 0),
          diamondCost: Math.round(pricingResult.diamondCost || 0)
        };
      }

      // Last resort fallback if context pricing fails
      return {
        originalPrice: 0,
        finalPrice: 0,
        discountAmount: 0,
        discountPercentage: 0,
        sku: sku,
        material: item.goldCarat || null,
        hasStoredPricing: false,
        gstAmount: 0
      };
    };
  }, [calculateProductPricing, goldRates]); // eslint-disable-line react-hooks/exhaustive-deps

  const total = useMemo(() => {
    return products.reduce((sum, item) => {
      const pricing = getItemPricing(item);
      return sum + (pricing.finalPrice * Number(item.qty || 1));
    }, 0);
  }, [products, getItemPricing]);

  const totalSavings = useMemo(() => {
    return products.reduce((sum, item) => {
      const pricing = getItemPricing(item);
      const savings = pricing.discountAmount * Number(item.qty || 1);
      return sum + savings;
    }, 0);
  }, [products, getItemPricing]);

  // Handle place order - pass cart data to order context and navigate
  const handlePlaceOrder = () => {
    const orderSummary = {
      total,
      totalItems: products.length,
      totalSavings,
      items: products.map(item => ({
        ...item,
        pricing: getItemPricing(item)
      }))
    };

    setOrder(products, orderSummary);
    navigate('/orderConfirmation');
  };

  // ---- UI bits ----
  const renderFeatures = () => (
    <div className="border bg-gray-50 rounded-md px-4 py-3 mt-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-6">
        <div className="flex items-center text-gray-700 text-sm md:text-base">
          <FaCheckCircle className="text-gray-500 mr-2 text-lg" />
          <span>7 Day Replacement</span>
        </div>
        <div className="flex items-center text-gray-700 text-sm md:text-base">
          <FaCheckCircle className="text-gray-500 mr-2 text-lg" />
          <span>Eligible for Lifetime exchange &amp; Buy back</span>
        </div>
        <div className="flex items-center text-gray-700 text-sm md:text-base">
          <FaCheckCircle className="text-gray-500 mr-2 text-lg" />
          <span>Free &amp; Insured Delivery</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen py-8 px-  4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {products.length === 0 ? (
          // Empty Cart
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <img
              src={emptyCartImg}
              alt="Empty Cart"
              className="w-full max-w-xl object-contain"
            />
            <h2 className="text-2xl font-semibold text-gray-800">
              Your Cart is Empty
            </h2>
            <p className="text-gray-500 max-w-md">
              "Looks like your bag is feeling lonely. Time to fill it with something
              beautiful!"
            </p>
            <Link to="/">
              <button className="px-6 py-3 bg-[#CEBB98] text-white font-medium rounded-lg shadow hover:bg-[#421543] transition">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="lg:flex lg:items-start lg:gap-8">
            {/* ---------------- LEFT SECTION ---------------- */}
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  My Shopping Cart{" "}
                  <span className="text-gray-500">({products.length} Items)</span>
                </h2>
              </div>

              {/* Product Loop */}
              {products.map((item) => {
                const product = item.product || {};
                const pricing = getItemPricing(item);

                // Get selected color image
                const selectedImage = (() => {
                  if (item.color && product.imagesByColor) {
                    const colorImages = product.imagesByColor[item.color];
                    if (colorImages && colorImages.length > 0) {
                      return colorImages[0];
                    }
                  }

                  // Fallback to first available image
                  if (product.image) {
                    return Array.isArray(product.image) ? product.image[0] : product.image;
                  }

                  return "/api/placeholder/300/300";
                })();

                return (
                  <div
                    key={item.key}
                    className="p-4 w-full border rounded-lg shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Product Image */}
                      <div className="w-full md:w-[25%]">
                        <Link to={`/moreinfo2?id=${product._id || product.id}`}>
                          <img
                            src={selectedImage}
                            alt={product.name || "Product"}
                            className="w-full h-48 md:h-full object-cover rounded-lg border"
                            loading="lazy"
                          />
                        </Link>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 bg-white flex flex-col">
                        <div className="p-2 sm:p-4 flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div>
                              <h3 className="text-base md:text-lg font-semibold text-gray-800">
                                <Link to={`/moreinfo2?id=${product._id || product.id}`} className="hover:underline">
                                  {product.name || "Product"}
                                </Link>
                                {item.color && (
                                  <span className="ml-2 text-sm font-normal text-gray-600 capitalize">
                                    ({item.color.replace("-", " ")})
                                  </span>
                                )}
                              </h3>

                              <p className="text-xs md:text-sm text-gray-500 mt-1">
                                Product Code: {product.productCode || product._id}
                              </p>
                              {/* Display SKU */}
                              <p className="text-xs md:text-sm text-gray-500 mt-1">
                                SKU: {pricing.sku}
                              </p>
                            </div>
                            <div className="text-left sm:text-right">
                              {pricing.originalPrice > pricing.finalPrice && (
                                <p className="text-xs text-gray-400 line-through">
                                  ₹{formatIN(pricing.originalPrice * Number(item.qty || 1))}
                                </p>
                              )}
                              <p className="text-lg font-semibold text-gray-900">
                                ₹{formatIN(pricing.finalPrice * Number(item.qty || 1))}
                              </p>
                              {pricing.discountPercentage > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                  ({pricing.discountPercentage}% OFF)
                                </p>
                              )}
                              {Number(item.qty || 1) > 1 && (
                                <p className="text-xs text-gray-500 mt-1">
                                  ₹{formatIN(pricing.finalPrice)} each
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Responsive Info Section */}
                          <div className="mt-4 border rounded-md text-xs sm:text-sm text-gray-700">
                            {/* Conditional Ring Size & Quantity */}
                            <div className="flex flex-col sm:flex-row">
                              {/* Only show Ring Size for rings category */}
                              {product.category === "rings" && (
                                <div className="flex items-center flex-1 border-b sm:border-b-0">
                                  <span className="bg-gray-100 px-3 py-2 w-28 shrink-0">
                                    Ring Size
                                  </span>
                                  <select 
                                    className="flex-1 px-2 py-2 border-l border-gray-200 focus:outline-none"
                                    value={item.ringSize || getItemCustomization(item.key, 'ringSize') || 14}
                                    onChange={(e) => {
                                      const ringSize = parseInt(e.target.value);
                                      updateItemCustomization(item.key, 'ringSize', ringSize);
                                      updateWithCustomization(item.key, item.qty, { 
                                        ringSize,
                                        sku: item.sku || pricing.sku
                                      });
                                    }}
                                  >
                                    {Array.from({length: 13}, (_, i) => i + 6).map(size => (
                                      <option key={size} value={size}>{size}</option>
                                    ))}
                                  </select>
                                </div>
                              )}
                              <div className={`flex items-center flex-1 ${product.category === "rings" ? "border-t sm:border-t-0 sm:border-l" : ""} border-gray-200`}>
                                <span className="px-3 py-2 w-24 shrink-0">Quantity</span>
                                <select
                                  className="flex-1 px-2 py-2 border-l border-gray-200 focus:outline-none"
                                  value={item.qty}
                                  onChange={(e) => {
                                    const qty = parseInt(e.target.value);
                                    updateWithCustomization(item.key, qty, {
                                      ringSize: product.category === "rings" ? (item.ringSize || getItemCustomization(item.key, 'ringSize') || 14) : null,
                                      sku: item.sku || pricing.sku
                                    });
                                  }}
                                >
                                  {Array.from({ length: 10 }, (_, i) => i + 1).map(qty => (
                                    <option key={qty} value={qty}>{qty}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Metal */}
                            <div className="flex flex-col sm:flex-row border-t">
                              <span className="bg-gray-100 px-3 py-2 w-28 shrink-0">
                                Metal
                              </span>
                              <span className="px-3 py-2 flex-1">
                                {item.goldCarat ? `${item.goldCarat} Gold, ` : ""}{product.specs?.goldWeight || '1.23'} gram
                                {!item.goldCarat && item.product?._id && (
                                  <span className="text-xs text-gray-400 ml-1">(loading material...)</span>
                                )}
                              </span>
                            </div>

                            {/* Stone */}
                            <div className="flex flex-col sm:flex-row border-t">
                              <span className="bg-gray-100 px-3 py-2 w-28 shrink-0">Stone</span>
                              <span className="px-3 py-2 flex-1">
                                {(() => {
                                  const specs = product.specs || {};
                                  const d = summarizeDiamonds(specs);
                                  const clarity = specs.clarity || "SI";
                                  const color = specs.colorGrade || "IJ";
                                  if (d.count > 0) {
                                    return `${d.count} Diamond${d.count > 1 ? "s" : ""}, ${d.carat} Carat, ${clarity} ${color}`;
                                  }
                                  // If nothing available, keep a friendly default
                                  return "—";
                                })()}
                              </span>
                            </div>

                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="border-t flex flex-col sm:flex-row text-xs sm:text-sm">
                          <button
                            onClick={() => remove(item.key)}
                            className="flex items-center justify-center gap-2 flex-1 py-3 text-gray-700 hover:text-red-600 font-medium"
                          >
                            <FaTrash /> REMOVE
                          </button>
                          <button
                            onClick={() => moveToWishlist(item.key)}
                            className="flex items-center justify-center gap-2 flex-1 py-3 text-gray-700 hover:text-purple-700 font-medium border-t sm:border-t-0 sm:border-l"
                          >
                            <FaHeart /> MOVE TO WISHLIST
                            <span className="hidden sm:inline text-xs text-gray-500">
                              (Need login first)
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    {renderFeatures()}
                  </div>
                );
              })}
            </div>

            {/* ---------------- RIGHT SECTION ---------------- */}
            <div className="lg:w-[350px] w-full lg:sticky lg:top-50 h-fit">
              <div className="rounded-lg p-6 border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  ORDER SUMMARY
                </h3>
                <div className="flex justify-between text-sm text-gray-700 mb-2">
                  <span>Total ({products.length} Items)</span>
                  <span>₹{formatIN(total)}</span>
                </div>
                <div className="border-t border-dotted border-gray-400 my-4"></div>
                <div className="flex justify-between font-medium text-gray-900 mb-2">
                  <span>Total Payable</span>
                  <span>₹{formatIN(total)}</span>
                </div>
                {totalSavings > 0 && (
                  <p className="text-green-600 text-sm mb-6">You Save ₹{formatIN(totalSavings)}</p>
                )}
                <div className="mb-6 flex items-center justify-between border rounded-md px-3 py-2 bg-gray-50">
                  <div className="flex items-center text-sm text-gray-700">
                    <FaGift className="text-gray-500 mr-2" />
                    <span>Gift Message (Optional)</span>
                  </div>
                  <button className="text-text-[#CEBB98] font-medium text-sm hover:underline">
                    Add
                  </button>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-[#CEBB98] hover:bg-black text-white py-3 rounded-md text-base md:text-lg font-medium mb-6 shadow-md cursor-pointer"
                >
                  Place Order
                </button>
                <p className="text-sm text-gray-600 mb-6 flex items-center gap-2">
                  <span className="text-gray-500">⚙</span> Apply Voucher / Gift Card
                </p>
                <p className="text-sm text-gray-600">
                  Any Questions?
                  <br />
                  Please call us at{" "}
                  <a href="tel:18004190066" className="text-[#CEBB98] font-medium">
                    18004190066
                  </a>{" "}
                  or{" "}
                  <a href="#" className="text-[#CEBB98] font-medium hover:underline">
                    Chat with us
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;