// src/components/.../ProductCard.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { isAuthenticated } from "../../utils/auth";
import { useCart } from "../../context/cartContext";
import { usePricing } from "../../context/pricingContext";

const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
const formatIN = (n) => Number(n || 0).toLocaleString("en-IN");
const fullCache = new Map();

const ProductCard = ({ product, imageH = "h-[150px] md:h-[200px]" }) => {
  const navigate = useNavigate();
  const { wishHas, wishToggle } = useCart();
  const { calculateProductPricing, goldRates, loading: rateLoading, fetchGoldRates } = usePricing();

  const pid = product?._id || product?.id;
  const wished = wishHas(pid);

  useEffect(() => {
    if (!goldRates) fetchGoldRates();
  }, [goldRates, fetchGoldRates]);

  const [full, setFull] = useState(() => (pid && fullCache.get(pid)) || null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!pid) return;

    if (fullCache.has(pid)) {
      setFull(fullCache.get(pid));
      return;
    }

    const hasWeight = Number(product?.specs?.goldWeight ?? 0) > 0;
    if (!hasWeight) {
      setFetching(true);
      axios
        .post(`${backendUrl}/product/single`, { productId: pid })
        .then(({ data }) => {
          if (!alive) return;
          const p = data?.product || null;
          if (p) {
            fullCache.set(pid, p);
            setFull(p);
          }
        })
        .catch(() => {})
        .finally(() => alive && setFetching(false));
    }
    return () => { alive = false; };
  }, [pid, product]);

  // Merge: keep display fields from list item if full is missing them
  // (especially `hoverImg`, which your full response may not include)
  const effective = useMemo(() => {
    if (!full) return product || {};
    return {
      ...product,         // start with list item
      ...full,            // overlay fetched fields
      hoverImg: full?.hoverImg ?? product?.hoverImg, // preserve hover
    };
  }, [product, full]);

  const title = effective?.name || effective?.title || "—";

  const cover =
    (Array.isArray(effective?.images) && effective.images[0]) ||
    (Array.isArray(effective?.image) && effective.image[0]) ||
    effective?.image ||
    "/fallback.png";

  const hoverImg = effective?.hoverImg || null;

  const { finalPrice, mrpPrice, discountPct, isLoading } = useMemo(() => {
    const out = {
      finalPrice: null,
      mrpPrice: null,
      discountPct: Number.isFinite(Number(effective?.discountPercentage))
        ? Number(effective.discountPercentage)
        : 0,
      isLoading: true,
    };
    if (!effective) return out;
    if (fetching || rateLoading || !goldRates) return out;

    const hasWeight = Number(effective?.specs?.goldWeight ?? 0) > 0;
    if (!hasWeight) return { ...out, isLoading: false };

    const r = calculateProductPricing(effective, "14K");
    if (!r?.loading && Number(r?.finalTotal) > 0) {
      return {
        finalPrice: r.finalTotal,
        mrpPrice: Number(r.totalBeforeDiscount) > Number(r.finalTotal)
          ? r.totalBeforeDiscount
          : null,
        discountPct: out.discountPct,
        isLoading: false,
      };
    }
    return { ...out, isLoading: false };
  }, [effective, fetching, rateLoading, goldRates, calculateProductPricing]);

  const onWish = () => {
    if (!isAuthenticated()) return navigate("/auth");
    wishToggle(pid);
  };

  return (
    <div className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col relative group">
      <Link to={`/moreinfo2?id=${pid}`} className="block">
        <div className={`relative w-full ${imageH} overflow-hidden bg-gray-50 flex items-center justify-center`}>
          <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10">
{/* <<<<<<< HEAD
                      <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow">
                        {product.discountPercentage ? `${product.discountPercentage}% OFF` : "Sale"}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onWish();
                        }}
                        className="p-2 bg-white rounded-full shadow hover:bg-red-500 transition-colors"
                        aria-label="Toggle wishlist"
                      >
                        <CiHeart
                          size={16}
                          className={`transition-colors ${
                            wished ? "text-red-500" : "text-black"
                          } group-hover:text-white`}
                        />
                      </button>
                    </div>
======= */}
            {Number(discountPct) > 0 ? (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow">
                {Math.round(Number(discountPct))}% OFF
              </span>
            ) : <span />}

            <button
              onClick={(e) => { e.preventDefault(); onWish(); }}
              className="p-2 bg-white rounded-full shadow hover:bg-red-500 transition-colors"
              aria-label="Toggle wishlist"
            >
              <CiHeart
                size={16}
                className={`transition-colors ${wished ? "text-red-500" : "text-gray-700"} group-hover:text-white`}
              />
            </button>
          </div>

          {/* primary */}
          <img
            src={cover}
            alt={title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${hoverImg ? "group-hover:opacity-0" : ""}`}
            loading="lazy"
            onError={(e) => (e.currentTarget.src = "/fallback.png")}
          />

          {/* hover (preserved from list if full lacks it) */}
          {hoverImg && (
            <img
              src={hoverImg}
              alt={`${title}-hover`}
              className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              loading="lazy"
              onError={(e) => { e.currentTarget.src = "/fallback.png"; }}
            />
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 text-center">{title}</h3>

        <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center mb-3 text-center gap-1 min-h-[24px]">
          {isLoading ? (
            <span className="inline-flex items-center justify-center text-sm text-gray-500">
              <span className="w-4 h-4 mr-2 border-2 border-[#CEBB98] border-t-transparent rounded-full animate-spin" />
              loading...
            </span>
          ) : finalPrice != null ? (
            <>
              <span className="text-lg font-semibold text-black">₹{formatIN(finalPrice)}</span>
              {mrpPrice && (
                <span className="text-sm line-through text-gray-500">₹{formatIN(mrpPrice)}</span>
              )}
            </>
          ) : (
            <span className="text-sm text-gray-500">Price unavailable</span>
          )}
        </div>

        <div className="mt-auto flex flex-col sm:flex-row gap-2">
          <button className="w-full sm:flex-1 bg-[#CEBB98] border border-[#CEBB98] text-white text-xs font-medium py-2 px-3 rounded-xl hover:opacity-90 transition">
            Add to Cart
          </button>
          <Link to={`/moreinfo2?id=${pid}`} className="w-full sm:flex-1">
            <button className="w-full border border-[#CEBB98] text-black text-xs font-medium py-2 px-3 rounded-xl hover:bg-[#CEBB98] hover:text-white transition">
              More Info
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
