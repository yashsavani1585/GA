import React, { useMemo } from "react";
import ProductCard from "../ProductCard/ProductCard";
import PromotionalBanner2 from "../../assets/productAds4.png";
import PromotionalBanner3 from "../../assets/productAds5.png";
import PromotionalBanner1 from "../../assets/productAds6.png";
import useForHimProducts from "../../hooks/useForHimProducts";

const ForHimProductSection = () => {
  const { items: products = [], loading } = useForHimProducts();

  // Memoize products for performance
  const memoizedProducts = useMemo(() => products, [products]);

  // Skeleton loader while fetching
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-full h-[250px] bg-gray-200 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  // Show message if no products
  if (memoizedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          No products found for him
        </h2>
        <p className="text-gray-500">
          Check back later for our latest collection of men's jewelry.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-1 py-10 space-y-10">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          For Him Collection
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our sophisticated collection of men's jewelry, designed for
          the modern gentleman.
        </p>
      </div>

    <div className="max-w-7xl mx-auto px-1 py-1 space-y-16">
      {/* 🔹 First 6 Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-6">
        {memoizedProducts.slice(0, 6).map((p) => (
          <ProductCard key={p._id || p.id} product={p} />
        ))}
      </div>

      {/* 🔹 Banner + Side Products */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <div className="md:col-span-2 rounded-2xl overflow-hidden">
          <img
            src={PromotionalBanner2}
            alt="Promotional Banner"
            className="w-full h-[280px] sm:h-[350px] md:h-[690px] object-fit"
            loading="lazy"
          />
        </div>
        <div className="hidden md:flex flex-col gap-6">
          {memoizedProducts.slice(6, 8).map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 🔹 Next 6 Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-6">
        {memoizedProducts.slice(8, 14).map((p) => (
          <ProductCard key={p._id || p.id} product={p} />
        ))}
      </div>

      {/* 🔹 Banner + Side Products */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <div className="hidden md:flex flex-col gap-6">
          {memoizedProducts.slice(14, 16).map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
        <div className="md:col-span-2 rounded-2xl overflow-hidden">
          <img
            src={PromotionalBanner3}
            alt="Ad Banner"
            className="w-full h-[280px] sm:h-[350px] md:h-[690px] object-fit"
            loading="lazy"
          />
        </div>
      </section>

      {/* 🔹 Next 6 Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-6">
        {memoizedProducts.slice(16, 22).map((p) => (
          <ProductCard key={p._id || p.id} product={p} />
        ))}
      </div>

      {/* 🔹 Banner + Side Products */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <div className="md:col-span-2 rounded-2xl overflow-hidden">
          <img
            src={PromotionalBanner1}
            alt="Promotional Banner"
            className="w-full h-[280px] sm:h-[350px] md:h-[690px] object-fit"
            loading="lazy"
          />
        </div>
        <div className="hidden md:flex flex-col gap-6">
          {memoizedProducts.slice(22, 24).map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 🔹 Remaining Products */}
      <div className="space-y-6">
        {/* 🔹 Mobile view → groups of 4 (only remaining products after 24th) */}
        {Array.from(
          { length: Math.ceil((memoizedProducts.length - 24) / 4) }, // sirf 24 ke baad count hoga
          (_, i) => (
            <div
              key={i}
              className="grid grid-cols-2 sm:grid-cols-2 md:hidden gap-2 sm:gap-6"
            >
              {memoizedProducts
                .slice(24 + i * 4, 24 + i * 4 + 4) // start hamesha 24 ke baad se
                .map((p) => (
                  <ProductCard key={p._id || p.id} product={p} />
                ))}
            </div>
          )
        )}

        {/* 🔹 Desktop view → continuous 3-column grid (only remaining after 24th) */}
        <div className="hidden md:grid grid-cols-3 gap-4 sm:gap-6">
          {memoizedProducts.slice(24).map((p) => (   // 24 ke baad sab dikhao
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      </div>

    </div>
    </div>
  );
};

export default ForHimProductSection;
