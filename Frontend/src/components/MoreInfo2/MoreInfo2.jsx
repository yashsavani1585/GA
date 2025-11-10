import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/cartContext";
import { usePricing } from "../../context/pricingContext";
import { isAuthenticated } from "../../utils/auth";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/thumbs";
import { Thumbs, Autoplay } from "swiper/modules";

import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";

import img1 from "../../assets/productImg.png"; // fallback
import ProductCard from "../ProductCard/ProductCard";
import RelatedProductCard from "../RelatedProductCard/RelatedProductCard";

/* -------------------- helpers -------------------- */
const normalize = (c) => String(c || "").trim().toLowerCase();
const formatIN = (n) => Number(n || 0).toLocaleString("en-IN");

// UI chip -> canonical API color
const mapUiToColor = (v) => {
  const k = normalize(v);
  if (k === "rose" || k === "rosegold" || k === "rose-gold") return "rose-gold";
  if (k === "white" || k === "whitegold" || k === "white-gold") return "white-gold";
  if (k === "yellow" || k === "gold") return "gold";
  return k || null;
};

// canonical API color -> UI chip
const mapApiToUi = (v) => {
  const k = normalize(v);
  if (k === "rose-gold") return "rose";
  if (k === "white-gold") return "white";
  return "yellow"; // default to yellow/gold
};

const CHIP_CLASS = {
  rose: "bg-[#b76e79]",
  white: "bg-gray-300",
  yellow: "bg-yellow-400",
};

const backendUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

/* ================================================== */
const MoreInfo2 = () => {
  const params = useParams();
  const [qs] = useSearchParams();

  // accept /:id or ?id=... or ?productId=...
  const productId = params.id || qs.get("id") || qs.get("productId");

  const [product, setProduct] = useState(null);
  const [variant, setVariant] = useState("rose"); // UI chip: 'rose' | 'white' | 'yellow'
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState("");

  const materials = ["10K", "14K", "18K"];
  const [selectedMaterial, setSelectedMaterial] = useState("14K");

  const mainSwiperRef = useRef(null);
  const navigate = useNavigate();
  const { add } = useCart();
  const { calculateProductPricing, error: pricingError, refreshRates, goldRates } = usePricing();

  /* ---------- actions ---------- */
  const addToCartLogic = async () => {
    if (!isAuthenticated()) return navigate("/auth");
    if (loading || !product?._id) return; // guard

    // Get the correct SKU based on selected color (same logic as display)
    const skuMap = product?.skuByColor || {};
    const actualSku = (selectedColor && skuMap[selectedColor]) ||
      skuMap[product?.defaultColor] ||
      product?.sku ||
      product?.productCode ||
      product?._id;

    // Calculate discount percentage for pricing
    const discountPct = Number(product?.discountPercentage ?? 0);

    // Prepare pricing object with calculated values from MoreInfo2
    const pricingData = {
      originalPrice: Math.round(totalBeforeDiscount),
      finalPrice: Math.round(finalTotal),
      discountAmount: Math.round(discountAmount),
      discountPercentage: discountPct > 0 ? Math.round(discountPct) : 0,
      metalCost: Math.round(metalCost),
      makingCost: Math.round(makingCost),
      diamondCost: Math.round(diamondCost),
      gstAmount: Math.round(gstAmount)
    };

    // Pass configuration data AND pricing to cart
    const extraData = {
      goldCarat: selectedMaterial,
      sku: actualSku,
      // Only include ringSize for rings category
      ...(product.category === "rings" && { ringSize: 14 }), // Default ring size only for rings
      pricing: pricingData // Pass calculated pricing from MoreInfo2
    };

    await add(product._id, 1, selectedColor || null, extraData);
  };

  const handleAddToCart = async () => {
    await addToCartLogic();
  };

  const handleBuyNow = async () => {
    await addToCartLogic();
    navigate("/cart"); // redirect to cart for Buy Now
  };

  /* ---------- fetch live gold rate for selected material ---------- */
  // Gold rate fetching is now handled by pricing context

  /* ---------- refresh gold rates ---------- */
  useEffect(() => {
    refreshRates();
  }, [refreshRates]);

  /* ---------- fetch product ---------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setFetchErr("");
        setProduct(null);

        if (!productId) {
          setFetchErr("No product id found in route/query.");
          return;
        }

        // Primary: POST body { productId }
        const { data } = await axios.post(`${backendUrl}/product/single`, {
          productId,
          _id: productId,
        });
        if (!mounted) return;

        const maybeProduct =
          data?.product ??
          data?.data?.product ??
          (data?.success ? data.product : null);

        if (!maybeProduct) {
          console.warn("[MoreInfo2] Unexpected response for product/single:", data);
          setFetchErr("Product not found.");
          setProduct(null);
          return;
        }

        setProduct(maybeProduct);
      } catch (err) {
        console.error("[MoreInfo2] Fetch error:", err);
        setFetchErr(err?.message || "Failed to load product.");
        setProduct(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [productId]);

  // default chip from backend color (if present)
  useEffect(() => {
    if (product?.defaultColor) {
      setVariant(mapApiToUi(mapUiToColor(product.defaultColor)));
    }
  }, [product?.defaultColor]);

  /* ---------- derived fields ---------- */
  const name = product?.name || "—";
  const desc = product?.description || "";
  const specs = product?.specs || {};

  // dynamic inputs
  const discountPct = Number(product?.discountPercentage ?? 0);

  // colors available (canonical)
  const availableColors = useMemo(() => {
    const src = product?.imagesByColor;
    if (!src || typeof src !== "object") return [];
    const keys = Object.keys(src).map(mapUiToColor).filter(Boolean);
    return Array.from(new Set(keys));
  }, [product]);

  // selected canonical color (if available)
  const selectedColor = useMemo(() => {
    const want = mapUiToColor(variant);
    return availableColors.includes(want) ? want : null;
  }, [variant, availableColors]);

  // purity label
  const purity = useMemo(() => {
    const map = product?.caratByColor || {};
    const fromColor = selectedColor && map[selectedColor];
    if (selectedMaterial) {
      return `${selectedMaterial} ${product?.defaultColor ? `(${product.defaultColor})` : ""}`;
    }
    return fromColor || map.gold || "14K Yellow Gold";
  }, [product?.caratByColor, selectedColor, selectedMaterial, product?.defaultColor]);

  // Normalize image field to array
  const rawImages = useMemo(() => {
    if (!product?.image) return [];
    return Array.isArray(product.image) ? product.image : [product.image];
  }, [product]);

  const allImages = useMemo(
    () => (rawImages.length ? rawImages : [img1]),
    [rawImages]
  );

  // normalize imagesByColor
  const imagesByColorFromApi = useMemo(() => {
    const src = product?.imagesByColor;
    if (!src || typeof src !== "object") return null;

    const out = { gold: [], "rose-gold": [], "white-gold": [] };
    for (const [rawKey, arr] of Object.entries(src)) {
      const key = mapUiToColor(rawKey);
      if (!key || !Array.isArray(arr)) continue;
      out[key].push(...arr.filter(Boolean));
    }
    return out;
  }, [product]);

  // buckets for ordering
  const buckets = useMemo(() => {
    const out = { gold: [], "rose-gold": [], "white-gold": [], others: [] };
    if (imagesByColorFromApi) {
      out.gold = imagesByColorFromApi.gold;
      out["rose-gold"] = imagesByColorFromApi["rose-gold"];
      out["white-gold"] = imagesByColorFromApi["white-gold"];
      const used = new Set([...out.gold, ...out["rose-gold"], ...out["white-gold"]]);
      out.others = allImages.filter((src) => !used.has(src));
      return out;
    }
    out.others = allImages;
    return out;
  }, [imagesByColorFromApi, allImages]);

  // images to show
  const imagesToShow = useMemo(() => {
    const want = selectedColor || mapUiToColor(variant);
    const primary = want && buckets[want] ? buckets[want] : [];
    const order = ["gold", "rose-gold", "white-gold", "others"].filter((k) => k !== want);
    const rest = order.flatMap((k) => buckets[k] || []);
    const result = [...primary, ...rest];
    return result.length ? result : allImages;
  }, [buckets, selectedColor, variant, allImages]);

  // UI-visible color chips
  const uiChips = useMemo(() => {
    const fromApi = availableColors.length
      ? availableColors.map(mapApiToUi).filter((x) => ["rose", "white", "yellow"].includes(x))
      : ["rose", "white", "yellow"];
    return ["rose", "white", "yellow"].filter((c) => fromApi.includes(c));
  }, [availableColors]);

  // related products
  const [related, setRelated] = useState([]);
  useEffect(() => {
    if (!productId) return;
    (async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/product/related/${productId}`);
        if (data?.success) setRelated(data.products || []);
      } catch (err) {
        console.error("Failed to fetch related:", err);
      }
    })();
  }, [productId]);

  // reset main swiper on color change
  useEffect(() => {
    if (mainSwiperRef.current) {
      mainSwiperRef.current.slideTo(0);
    }
  }, [selectedColor]);

  /* ---------- dynamic price calculation (with fallback) ---------- */
  const pricingResult = useMemo(() => {
    if (!product) return null;

    return calculateProductPricing(product, selectedMaterial);
  }, [calculateProductPricing, product, selectedMaterial, goldRates]); // eslint-disable-line react-hooks/exhaustive-deps

  const diamondTotals = useMemo(() => {
    const arr = product?.specs?.diamondTypes;
    if (!Array.isArray(arr) || arr.length === 0) {
      return { totalCarat: 0, totalCount: 0, totalPrice: 0 };
    }
    return arr.reduce(
      (acc, d) => {
        const count = Number(d?.numberOfDiamonds ?? 0) || 0;
        const carat = Number(d?.carat ?? 0) || 0; // per stone
        const pricePer = Number(d?.pricePerDiamond ?? 0) || 0;

        acc.totalCount += count;
        acc.totalCarat += carat * count;         // aggregate carat
        acc.totalPrice += pricePer * count;      // aggregate price
        return acc;
      },
      { totalCarat: 0, totalCount: 0, totalPrice: 0 }
    );
  }, [product]);

  const {
    metalCost = 0,
    makingCost = 0,
    diamondCost = 0,
    discountAmount = 0,
    gstAmount = 0,
    finalTotal = 0,
    totalBeforeDiscount = 0
  } = pricingResult || {};

  /* ---------- loading ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#CEBB98] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If fetch finished but we still have no product, show a friendly state
  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-2">Product not found</h2>
        <p className="text-gray-600 mb-6">
          {fetchErr || "We couldn’t load this product."}
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-5 py-3 rounded-md bg-black text-white"
        >
          Go back
        </button>
      </div>
    );
  }

  /* ================================================== */
  return (
    <>
      {/* MAIN PRODUCT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT SIDE IMAGES */}
        <div className="flex flex-col w-full">
          {/* Main Swiper with Zoom */}
          <Swiper
            modules={[Autoplay, Thumbs]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop
            slidesPerView={1}
            onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
            thumbs={{
              swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
            }}
            className="w-full rounded-xl"
          >
            {imagesToShow.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="flex justify-center items-center px-1 py-1 w-full h-[400px] sm:h-[500px] md:h-[600px]">
                  <InnerImageZoom
                    src={img}
                    zoomSrc={img}
                    zoomType="hover"
                    zoomScale={1}
                    alt={`Product Image ${index + 1}`}
                    className="rounded-md w-full h-full object-contain shadow-md"
                    zoomPreload
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnails */}
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            watchSlidesProgress
            slidesPerView="auto"
            freeMode
            modules={[Thumbs, Autoplay]}
            className="mt-4 w-full flex"
          >
            {imagesToShow.map((img, index) => (
              <SwiperSlide key={index} className="!w-20 sm:!w-24">
                <img
                  src={img}
                  alt={`thumb-${index}`}
                  className="w-full h-20 sm:h-24 object-cover rounded-md cursor-pointer border hover:border-yellow-600 transition"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div className="w-full flex flex-col space-y-6">
          {/* Info */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold leading-snug">
              {name}
            </h2>
            <div className="mt-1 text-sm text-gray-700">
              {(() => {
                const skuMap = product?.skuByColor || {};
                const sku =
                  (selectedColor && skuMap[selectedColor]) ||
                  skuMap[product?.defaultColor] ||
                  "";
                return sku ? <>SKU: <span className="font-semibold">{sku}</span></> : "SKU: —";
              })()}
              <span className="ml-3 border border-black px-2 py-0.5 rounded-md text-[#CEBB98]">IN STOCK</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="text-lg sm:text-2xl font-bold">
                ₹{formatIN(finalTotal)}
              </span>

              {Number(discountPct) > 0 && totalBeforeDiscount > finalTotal && (
                <>
                  <span className="text-gray-500 line-through text-sm sm:text-base">
                    ₹{formatIN(totalBeforeDiscount)}
                  </span>
                  <span className="bg-gray-100 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full border">
                    Sale {Math.round(Number(discountPct))}%
                  </span>
                </>
              )}
            </div>

            {pricingError && <p className="text-xs text-red-500 mt-1">{pricingError}</p>}

            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              {desc}
            </p>
          </div>

          <div className="flex flex-col gap-2 mb-2">
            <span className="font-semibold">Color:</span>

            <div className="flex gap-2">
              {uiChips.map((key) => (
                <button
                  key={key}
                  onClick={() => setVariant(key)}
                  className={`w-8 h-8 rounded-full ${CHIP_CLASS[key]} border transition ${variant === key ? "ring-2 ring-[#CEBB98] scale-110" : "hover:scale-110"
                    }`}
                  title={key}
                  aria-label={`Select ${key} color`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-semibold">Jewelry Material:</span>

            <div className="flex gap-3">
              {materials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`px-4 py-1 rounded-md border transition ${selectedMaterial === mat
                      ? "border-black bg-black text-white"
                      : "border-gray-400 hover:bg-gray-100"
                    }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
              <button
                onClick={handleBuyNow}
                disabled={!product?._id}
                className={`w-full py-3 rounded-md font-semibold transition ${product?._id ? "bg-[#CEBB98] text-white hover:bg-black" : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
              >
                Buy Now
              </button>

              <button
                onClick={handleAddToCart}
                disabled={!product?._id}
                className={`w-full py-3 rounded-md font-semibold transition ${product?._id ? "bg-[#CEBB98] text-white hover:bg-black" : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
              >
                Add to Cart
              </button>
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/917201004243?text=${encodeURIComponent(
                `Hi, I'm interested in ${name} (${productId}).`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center bg-[#CEBB98] text-white py-3 rounded-md font-semibold hover:bg-black transition"
            >
              Order on WhatsApp
            </a>

          </div>

          {/* Offers */}
          <div className="bg-[#CEBB98] text-white rounded-lg p-5 space-y-4">
            <h3 className="font-semibold text-lg">Offers For You</h3>
            {["FLAT 100 off", "GEMS GLOBAL "].map((offer, idx) => (
              <div key={idx} className="bg-white text-black rounded-md p-4 shadow-sm">
                <p className="font-bold">{offer}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Comes with authenticity & guarantee certificate of GEMS
                  GLOBAL  with lifetime exchange guarantee.
                </p>
              </div>
            ))}
          </div>

          {/* Shipping & Return */}
          <div className="space-y-3">
            {["Shipping", "Return Policy"].map((policy, idx) => (
              <details key={idx} className="border rounded-md px-4 py-3 cursor-pointer">
                <summary className="font-semibold">{policy}</summary>
                {policy === "Shipping" ? (
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                    <li>All confirmed orders will be dispatched within 25–30 business days.</li>
                    <li>Custom or made-to-order products require 8–10 business days for manufacturing before shipment.</li>
                  </ul>
                ) : (
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                    <li>Orders can be cancelled within 24 hours of placement.</li>
                    <li>If you face sizing issues, you may request a replacement within 7 days of receiving the product.</li>
                  </ul>
                )}
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Product Details</h2>
        <hr className="mb-6 border-gray-300" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {/* Left */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-yellow-700 mb-2">Weight</h3>
              <p className="text-sm text-gray-700">Gross (Product) - {specs.productWeight ?? "N/A"} gm</p>
              <p className="text-sm text-gray-700">Net (Gold) - {specs.goldWeight ?? "N/A"} gm</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-yellow-700 mb-2">Purity</h3>
              <p className="text-sm text-gray-700">{purity}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:col-span-2">
              <h3 className="text-lg font-semibold text-yellow-700 mb-2">Diamond and Gemstones</h3>
              <p className="text-sm text-gray-700 mb-2">Diamonds - Lab Grown Diamonds</p>

              {Array.isArray(product?.specs?.diamondTypes) && product.specs.diamondTypes.length > 0 ? (
                <div>
                  <table className="w-full border-collapse text-sm text-gray-700">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="py-1 text-left">Shape</th>
                        <th className="py-1 text-left">Carat</th>
                        <th className="py-1 text-left">Count</th>
                        <th className="py-1 text-left">Price/Diamond</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.specs.diamondTypes.map((diamond, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-1">
                            <span>{diamond?.shape || "—"}</span>
                            {diamond?.placement && (
                              <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 capitalize">
                                ({diamond.placement})
                              </span>
                            )}
                          </td>
                          <td className="py-1">{diamond?.carat ?? "—"}</td>
                          <td className="py-1">{diamond?.numberOfDiamonds ?? "—"}</td>
                          <td className="py-1">₹{formatIN(Number(diamond?.pricePerDiamond ?? 0))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div className="flex justify-between sm:block">
                      <span className="font-medium">Carat Total:</span>
                      <span className="sm:ml-2">{diamondTotals.totalCarat.toFixed(4)} ct</span>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="font-medium">Diamonds:</span>
                      <span className="sm:ml-2">{diamondTotals.totalCount}</span>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="font-medium">Diamonds Value:</span>
                      <span className="sm:ml-2">₹{formatIN(diamondTotals.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No diamond information available</p>
              )}
            </div>


          </div>

          {/* Right: Price Breakup */}
          <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg text-yellow-700 mb-3">Price Breakup</h3>

              <div className="flex justify-between text-sm text-gray-700 mb-1">
                <span>
                  Gold Rate ({selectedMaterial}) × Gold Wt ({Number(specs?.goldWeight || 0)} g)
                </span>
                <span>₹{formatIN(metalCost)}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-700 mb-1">
                <span>
                  Making (₹{formatIN(Number(product?.makingChargePerGram || 0))}/g × {Number(specs?.goldWeight || 0)} g)
                </span>
                <span>₹{formatIN(makingCost)}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-700 mb-1">
                <span>Diamonds</span>
                <span>₹{formatIN(diamondCost)}</span>
              </div>

              {Number(discountPct) > 0 && (
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>Discount ({Math.round(discountPct)}%)</span>
                  <span>-₹{formatIN(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-700 mb-1">
                <span>GST ({Number(product?.gstPercent ?? 3)}%)</span>
                <span>₹{formatIN(gstAmount)}</span>
              </div>
            </div>

            <div>
              <hr className="my-2 border-gray-300" />
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{formatIN(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-xl font-semibold mb-6 text-center">Related Products</h3>
        {related.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {related.slice(0, 3).map((p) => (
              <Link
                key={p.id || p._id}
                to={`/moreinfo2?id=${p.id || p._id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} // scroll to top
              >
                <RelatedProductCard product={p} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No related products found.</p>
        )}
      </div>
    </>
  );
};

export default MoreInfo2;
