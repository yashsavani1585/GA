import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { useCart } from "../../context/cartContext";
import { isAuthenticated } from "../../utils/auth";
import axios from "axios";

const backendUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const formatIN = (n) => Number(n || 0).toLocaleString("en-IN");

// ---- shared 60s cache for 14k rate ----
const RATE_TTL_MS = 60_000;
let rateCache = { ts: 0, rate: null, promise: null };

function fetch14kRate() {
  const now = Date.now();
  if (rateCache.rate && now - rateCache.ts < RATE_TTL_MS) {
    return Promise.resolve(rateCache.rate);
  }
  if (rateCache.promise) return rateCache.promise;

  rateCache.promise = axios
    .get(`${backendUrl}/pricing/gold-rate`, { params: { carat: 14 } })
    .then(({ data }) => {
      const r = data?.success ? Number(data.ratePerGram) : null;
      rateCache.rate = r;
      rateCache.ts = Date.now();
      return r ?? 0;
    })
    .catch(() => 0)
    .finally(() => {
      rateCache.promise = null;
    });

  return rateCache.promise;
}

const RelatedProductCard = ({
  product,
  imageH = "h-[200px] sm:h-[220px] md:h-[240px]",
}) => {
  const { wishHas, wishToggle } = useCart();
  const pid = product?._id || product?.id;
  const wished = wishHas(pid);

  const [live14k, setLive14k] = useState(null);
  useEffect(() => {
    let mounted = true;
    fetch14kRate().then((r) => mounted && setLive14k(r || null));
    return () => {
      mounted = false;
    };
  }, []);

  // ---------- pricing inputs ----------
  const [goldWeight, setGoldWeight] = useState(
    Number(product?.specs?.goldWeight ?? 0)
  );
  const [gstPercent, setGstPercent] = useState(product?.gstPercent ?? 3);
  const [makingPerGram, setMakingPerGram] = useState(
    product?.makingChargePerGram ?? 0
  );
  const [discountPct, setDiscountPct] = useState(
    product?.discountPercentage ?? product?.discount ?? 0
  );
  const [numDiamonds, setNumDiamonds] = useState(
    Number(product?.specs?.numberOfDiamonds ?? 0)
  );
  const [pricePerDiamond, setPricePerDiamond] = useState(
    Number(product?.specs?.pricePerDiamond ?? 0)
  );

  // re-sync when product changes
  useEffect(() => {
    setGoldWeight(Number(product?.specs?.goldWeight ?? 0));
    setGstPercent(product?.gstPercent ?? 3);
    setMakingPerGram(product?.makingChargePerGram ?? 0);
    setDiscountPct(product?.discountPercentage ?? product?.discount ?? 0);
    setNumDiamonds(Number(product?.specs?.numberOfDiamonds ?? 0));
    setPricePerDiamond(Number(product?.specs?.pricePerDiamond ?? 0));
  }, [product?._id]);

  // fetch extra product data if missing
  useEffect(() => {
    let mounted = true;
    if (!pid) return;

    const needs =
      product?.specs?.goldWeight == null ||
      product?.gstPercent == null ||
      product?.makingChargePerGram == null ||
      product?.discountPercentage == null ||
      product?.specs?.pricePerDiamond == null ||
      product?.specs?.numberOfDiamonds == null;

    if (!needs) return;

    (async () => {
      try {
        const { data } = await axios.post(`${backendUrl}/product/single`, {
          productId: pid,
        });
        const p = data?.product;
        if (!mounted || !p) return;

        setGoldWeight(Number(p?.specs?.goldWeight ?? 0));
        setGstPercent(p?.gstPercent ?? 3);
        setMakingPerGram(p?.makingChargePerGram ?? 0);
        setDiscountPct(p?.discountPercentage ?? 0);
        setNumDiamonds(Number(p?.specs?.numberOfDiamonds ?? 0));
        setPricePerDiamond(Number(p?.specs?.pricePerDiamond ?? 0));
      } catch {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, [pid]);

  // Normalize images
  const normalize = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string") return [val];
    return [];
  };

  const { finalTotal, totalBeforeDiscount } = useMemo(() => {
    if (!live14k || !goldWeight) {
      return { finalTotal: null, totalBeforeDiscount: null };
    }

    const metalCost = live14k * goldWeight;
    const makingCost = (makingPerGram || 0) * goldWeight;
    const diamondCost = (pricePerDiamond || 0) * (numDiamonds || 0);

    const base = makingCost + diamondCost;

    const dp = Math.max(0, Math.min(100, Number(discountPct || 0)));
    const discounted = base * (1 - dp / 100);

    const gst = Math.round(
      (metalCost + makingCost + diamondCost) *
        (Number(gstPercent || 3) / 100)
    );
    const final = metalCost + discounted + gst;

    const gstOnBase = Math.round(
      (metalCost + makingCost + diamondCost) *
        (Number(gstPercent || 3) / 100)
    );
    const oldTotal = metalCost + base + gstOnBase;

    return {
      finalTotal: Math.round(final),
      totalBeforeDiscount: Math.round(oldTotal),
    };
  }, [
    live14k,
    goldWeight,
    makingPerGram,
    pricePerDiamond,
    numDiamonds,
    discountPct,
    gstPercent,
  ]);

  // Images
  const images = [
    ...normalize(product?.image),
    ...normalize(product?.images),
  ].filter(Boolean);
  const firstImg = images[0] || product?.thumbnail || "/fallback.png";
  const secondImg = images[1] || firstImg;

  const onWish = () => {
    if (!isAuthenticated()) return;
    wishToggle(pid);
  };

  const title = product?.title || product?.name || "—";

  return (
    <div className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col relative group cursor-pointer">
      {/* Image section (clickable) */}
      <Link to={`/moreinfo2?id=${pid}`} className="block">
        <div
          className={`relative w-full ${imageH} overflow-hidden bg-gray-50`}
        >
          {/* Discount & Wishlist */}
          <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10">
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow">
              {product.discountPercentage
                ? `${product.discountPercentage}% OFF`
                : "Sale"}
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

          {/* First image */}
          <img
            src={firstImg}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = "/fallback.png")}
          />

          {/* Second image on hover */}
          <img
            src={secondImg}
            alt={`${title}-hover`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = "/fallback.png")}
          />
        </div>
      </Link>

      {/* Product info */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 text-center sm:text-left">
          {title}
        </h3>

        {/* Price */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 text-center sm:text-left gap-1">
          <span className="text-lg font-semibold text-black">
            ₹
            {finalTotal != null
              ? formatIN(finalTotal)
              : formatIN(product?.price)}
          </span>
          {Number(discountPct) > 0 && totalBeforeDiscount != null && (
            <span className="text-sm line-through text-gray-500">
              ₹{formatIN(totalBeforeDiscount)}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-auto flex flex-col sm:flex-row gap-2">
          <button className="w-full sm:flex-1 border border-[#CEBB98] text-black text-xs font-medium py-2 px-3 rounded-xl hover:bg-[#CEBB98] hover:text-white transition">
            Add to Cart
          </button>

          {/* ✅ FIX: no nested <a> inside <Link>, just make button itself a Link */}
          <Link
            to={`/moreinfo2?id=${pid}`}
            className="w-full sm:flex-1 border border-[#CEBB98] text-black text-xs font-medium py-2 px-3 rounded-xl hover:bg-[#CEBB98] hover:text-white transition flex items-center justify-center"
          >
            More Info
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RelatedProductCard;
