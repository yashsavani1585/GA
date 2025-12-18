


import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import PromotionalBanner from "../../assets/productAds1.png"; // local banner
import ProductCard from "../ProductCard/ProductCard";

const API = import.meta.env.VITE_API_BASE_URL || "https://ga-inx6.onrender.com/api";

/* ---------- Helpers ---------- */
const allowedCats = new Set([
  "rings",
  "earrings",
  "necklace",
  "pendantset",
  "bracelet",
]);

// Fisher-Yates shuffle
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Shape product for ProductCard
const toCardShape = (p) => {
  const imgs = Array.isArray(p?.image) ? p.image : [];
  const primary = imgs[0] || "";
  const hover = imgs[1] || primary || "";
  const rupee = (n) =>
    typeof n === "number" ? `${n.toLocaleString("en-IN")}` : n;

  return {
    ...p,
    id: p?._id || p?.id,
    _id: p?._id || p?.id,
    title: p?.name,
    name: p?.name,
    price: rupee(p?.discountPrice ?? p?.price),
    oldPrice: p?.discountPrice ? rupee(p?.price) : undefined,
    discount: p?.discountPercentage ? `${p.discountPercentage}%` : undefined,
    discountPrice: p?.discountPrice,
    discountPercentage: p?.discountPercentage,
    image: primary,
    images: imgs,
    hoverImg: hover,
  };
};

/* ---------- Main ---------- */
const EverglowCollection = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await axios.get(`${API}/product/list`);
        if (!ok) return;
        const items = Array.isArray(data?.products) ? data.products : [];
        setAllProducts(items);
      } catch (e) {
        if (ok)
          setErr(
            e?.response?.data?.message || e.message || "Failed to load products"
          );
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  // Process data
  const cards = useMemo(() => {
    const filtered = allProducts.filter((p) =>
      allowedCats.has(String(p?.category || "").trim().toLowerCase())
    );
    return shuffle(filtered).map(toCardShape);
  }, [allProducts]);

  const bannerH = "h-[220px] sm:h-[300px] md:h-[380px] lg:h-[420px]";

  /* ---------- States ---------- */
  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-[250px] bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </section>
    );
  }

  if (err) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-red-600">
          {err}
        </div>
      </section>
    );
  }

  if (cards.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          No products found for rings, earrings, necklace, pendantset, or
          bracelet.
        </div>
      </section>
    );
  }

  /* ---------- Layout ---------- */
  const first6 = cards.slice(0, 6);
  const featured = cards[6] || cards[0]; // fallback
  const remainder = cards.length > 7 ? cards.slice(7) : [];

  return (
    <section
      className="py-10 sm:py-14 lg:py-16"
      aria-labelledby="everglow-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid wrapper */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {/* First 6 Products */}
          {first6.map((p) => (
            <div key={p._id || p.id} className="h-full">
              <ProductCard product={p} />
            </div>
          ))}

          {/* Banner + Featured Product */}
          <div className="col-span-full my-6 flex flex-col md:flex-row gap-6 items-stretch">
            {/* Left banner */}
            <div
              className={`w-full md:w-2/3 rounded-2xl overflow-hidden border-2 border-[#4B2A4B] ${bannerH}`}
            >
              <img
                src={PromotionalBanner}
                alt="Promotional Banner"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Right featured product */}
            <div
              className={`hidden md:flex w-full md:w-1/3 items-stretch ${bannerH}`}
            >
              <div className="w-full">
                <ProductCard
                  product={featured}
                  imageH="h-[160px] sm:h-[200px] md:h-[260px]"
                />
              </div>
            </div>
          </div>

          {/* Remaining Products */}
          {remainder.map((p) => (
            <div key={(p._id || p.id) + "-rest"} className="h-full">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EverglowCollection;
