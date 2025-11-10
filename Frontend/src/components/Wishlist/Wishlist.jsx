import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import { usePricing } from "../../context/pricingContext";
import { isAuthenticated } from "../../utils/auth";
import emptyImg from "../../assets/Empty.png";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const formatIN = (n) => Number(n || 0).toLocaleString("en-IN");
const parseKey = (k) => {
  const [id, c] = String(k).split(":");
  return { id, color: c && c !== "-" ? c : null };
};

const Wishlist = () => {
  const { wishlist, wishRemove } = useCart();
  const { calculateProductPricing, refreshRates, goldRates } = usePricing();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Refresh gold rates when component mounts to get latest pricing
  useEffect(() => {
    refreshRates();
  }, [refreshRates]);

  // Load products for each wishlist key
  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      try {
        const detailed = await Promise.all(
          wishlist.map(async (key) => {
            const { id, color } = parseKey(key);
            try {
              const { data } = await axios.post(`${API}/product/single`, { productId: id });
              const p = data?.product || { _id: id, name: "Product" };
              return { key, product: p, color };
            } catch {
              return { key, product: { _id: id, name: "Product" }, color };
            }
          })
        );
        if (alive) setRows(detailed);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, [wishlist]);

  // const handleAddToCart = async (row) => {
  //   if (!isAuthenticated()) return navigate("/auth");
  //   await add(row.product._id, 1, row.color);
  //   await wishRemove(row.product._id, row.color);
  // };

  const handleRemove = async (row) => {
    if (!isAuthenticated()) return navigate("/auth");
    await wishRemove(row.product._id, row.color);
  };

  // Build render rows with dynamic pricing
  const viewRows = useMemo(() => {
    return rows.map((r) => {
      const p = r.product || {};

      // prefer color-specific cover if available
      const coverFromColor =
        r.color && p.imagesByColor && Array.isArray(p.imagesByColor[r.color]) && p.imagesByColor[r.color][0];
      const fallbackImage =
        (Array.isArray(p.image) && p.image[0]) ||
        (Array.isArray(p.images) && p.images[0]) ||
        p.thumbnail ||
        coverFromColor ||
        "https://placehold.co/600x600?text=Product";

        // discount percentage: use explicit only (no derivation)
const discountPct =
  Number.isFinite(Number(p.discountPercentage)) ? Number(p.discountPercentage) : 0;

// Use pricing context for calculations
const pricingResult = calculateProductPricing(p, "14K"); // Wishlist uses 14K as default

let finalTotal = pricingResult?.finalTotal || null;
let preDiscountTotal = pricingResult?.totalBeforeDiscount || null;
let pctBadge = discountPct;

// return row with formatted price text (or “No price calc”)
return {
  ...r,
  name: p.name || "—",
  desc: p.description || "",
  image: coverFromColor || fallbackImage,
  priceFormatted:
    finalTotal != null ? `₹${formatIN(finalTotal)}` : "No price calc",
  mrpFormatted:
    finalTotal != null && preDiscountTotal > finalTotal
      ? `₹${formatIN(preDiscountTotal)}`
      : "",
  pct: finalTotal != null ? pctBadge : 0,
};

    });
  }, [rows, calculateProductPricing, goldRates]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#4F1c51] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!viewRows.length) {
    return (
      <div className="max-w-7xl mx-auto py-14 px-4 text-center">
        <img
          src={emptyImg}
          alt="Empty Wishlist"
          className="mx-auto mb-6 w-[724px] h-[524px] opacity-50"
        />
        <p className="text-gray-500 mt-2">
          Your wishlist is waiting! Browse our collections and add the pieces you love.
        </p>
        <Link to="/" className="inline-block mt-6 px-6 py-3 bg-[#CEBB98] text-white rounded-lg">
          View collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Wishlist ({viewRows.length} Items)</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {viewRows.map((row) => (
          <div key={row.key} className="border rounded-2xl overflow-hidden shadow-sm bg-white">
            <div className="relative">
              <img src={row.image} alt={row.name} className="w-full h-48 object-cover" />
              {row.pct > 0 && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                  {row.pct}% OFF
                </span>
              )}
            </div>

            <div className="p-3">
              <div className="text-sm font-semibold text-gray-800">
                {row.name}
                {row.color && <span className="ml-2 text-xs text-gray-500">({row.color})</span>}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-base font-bold">{row.priceFormatted}</span>
                {row.mrpFormatted && row.pct > 0 && (
                  <span className="text-xs text-gray-400 line-through">{row.mrpFormatted}</span>
                )}
              </div>

              <div className="mt-3 flex gap-2 cursor-pointer">
                <button
                  onClick={() => navigate(`/moreinfo2?id=${row.product._id}`)}
                  className="flex-1 border border-[#CEBB98] text-black  text-sm font-medium py-2 px-3 rounded-xl hover:bg-[#CEBB98] transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(row)}
                  className="flex-1 border border-[#CEBB98] text-black text-sm font-medium py-2 px-3 rounded-xl hover:bg-[#CEBB98] transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
