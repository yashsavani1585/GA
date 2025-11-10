import React, { useState, useMemo, useEffect } from "react";
import ProductCard from "../ProductCard/ProductCard";
import useFilteredProducts from "../../hooks/useFilteredProducts";
import { usePricing } from "../../context/pricingContext";
import { FiSliders } from "react-icons/fi";


export default function EARRINGSProductionSection() {
  const { items: products = [], loading, applyFilters } = useFilteredProducts("earrings");
  const { calculateProductPricing, goldRates } = usePricing();

  // ---- FILTER STATE ----
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000000,
    forHim: false,
    forHer: false,
    bestseller: false,
  });

  // ---- SORT STATE ----
  const [sortBy, setSortBy] = useState("az");

  // ---- MOBILE DRAWER STATE ----
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ---- HANDLERS ----
  const handlePriceChange = (values) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1],
    }));
  };

  const handleCheckbox = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Apply backend filters (excluding price which is handled client-side)
  useEffect(() => {
    const backendFilters = {};

    if (filters.forHim) backendFilters.forHim = 'true';
    if (filters.forHer) backendFilters.forHer = 'true';
    if (filters.bestseller) backendFilters.bestseller = 'true';
    

    applyFilters(backendFilters);
  }, [filters.forHim, filters.forHer, filters.bestseller, applyFilters]);

  // ---- FILTERED PRODUCTS ----
  const filteredProducts = useMemo(() => {
    if (!products.length) return [];

    return products.filter((p) => {
      // Calculate dynamic price for price filtering
      let productPrice = 0;
      if (goldRates && calculateProductPricing && p.specs?.goldWeight > 0) {
        const pricing = calculateProductPricing(p, "14K");
        if (pricing && !pricing.loading && pricing.finalTotal) {
          productPrice = pricing.finalTotal;
        }
      }

      if (productPrice === 0) {
        productPrice = Number(p.price) || 0;
      }

      const priceMatch = productPrice >= filters.minPrice && productPrice <= filters.maxPrice;

      const genderMatch =
        (filters.forHim && p.forHim === true) ||
        (filters.forHer && p.forHer === true) ||
        (!filters.forHim && !filters.forHer);

      const bestsellerMatch = !filters.bestseller || p.bestseller === true;

      return priceMatch && genderMatch && bestsellerMatch;
    });
  }, [products, filters, goldRates, calculateProductPricing]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-full h-[250px] bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-1 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 🔹 LEFT FILTER SIDEBAR (Desktop) */}
        <aside className="hidden md:block md:col-span-1">
          <div className="sticky top-45 h-140 overflow-y-auto border-r bg-white p-6 space-y-8">
            <FilterContent
              filters={filters}
              handlePriceChange={handlePriceChange}
              handleCheckbox={handleCheckbox}
              products={products}
            />
          </div>
        </aside>

        {/* 🔹 MOBILE FILTER BUTTON + SORT */}
        <div className="md:hidden mb-4 flex justify-between items-center w-full">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#CEBB98] text-white rounded-lg"
            onClick={() => setDrawerOpen(true)}
          >
            <FiSliders className="text-lg" />
            <span>Filters</span>
          </button>


          {/* Sort dropdown for mobile */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CEBB98]"
          >
            <option value="az">Alphabetically, A–Z</option>
            <option value="za">Alphabetically, Z–A</option>
          </select>
        </div>

        {/* 🔹 Drawer (Mobile Only) */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
            <div className="relative bg-white w-3/4 max-w-xs h-full shadow-lg p-6 overflow-y-auto">
              {/* Close Button fix */}
              <button
                className="absolute top-0 right-4 mb-15 text-gray-700 text-2xl font-bold hover:text-black"
                onClick={() => setDrawerOpen(false)}
              >
                &times;
              </button>

              <hr className="mt-3 mb-3" />

              {/* Drawer content niche rahega */}
              <FilterContent
                filters={filters}
                handlePriceChange={handlePriceChange}
                handleCheckbox={handleCheckbox}
                products={products}
              />
            </div>
          </div>
        )}

        {/* 🔹 PRODUCTS LIST (Common for Mobile + Desktop) */}
        <main className="col-span-1 md:col-span-3">
          {/* Desktop sort dropdown */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <p className="text-gray-700 font-medium"></p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CEBB98]"
            >
              <option value="az">Alphabetically, A–Z</option>
              <option value="za">Alphabetically, Z–A</option>
            </select>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-1 sm:gap-6">
            {filteredProducts
              .sort((a, b) => {
                if (sortBy === "az") {
                  return (a.name || "").localeCompare(b.name || "");
                } else if (sortBy === "za") {
                  return (b.name || "").localeCompare(a.name || "");
                }
                return 0;
              })
              .map((p) => (
                <ProductCard key={p._id || p.id} product={p} />
              ))}
          </div>
        </main>
      </div>
    </div>
  );
}

// 🔹 Collapsible Filter Section
const FilterSection = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b pb-3">
      <button
        className="w-full flex justify-between items-center text-gray-800 font-semibold mb-2"
        onClick={() => setOpen(!open)}
      >
        {title}
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && <div className="pl-1">{children}</div>}
    </div>
  );
};

// 🔹 Filter Content Component (Desktop + Mobile)
const FilterContent = ({ filters, handlePriceChange, handleCheckbox, products }) => {
  const forHimCount = products.filter((p) => p.forHim === true).length;
  const forHerCount = products.filter((p) => p.forHer === true).length;
  const bestsellerCount = products.filter((p) => p.bestseller === true).length;

  return (
    <>
      {/* Gender */}
      <FilterSection title="Gender">
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer text-gray-700">
            <input
              type="checkbox"
              checked={filters.forHim}
              onChange={() => handleCheckbox("forHim")}
              className="w-4 h-4 accent-[#CEBB98]"
            />
            <span className="text-sm">For Him ({forHimCount})</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer text-gray-700">
            <input
              type="checkbox"
              checked={filters.forHer}
              onChange={() => handleCheckbox("forHer")}
              className="w-4 h-4 accent-[#CEBB98]"
            />
            <span className="text-sm">For Her ({forHerCount})</span>
          </label>
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price">
        <p className="text-sm text-gray-600 mb-3">Set your price range</p>
        <div className="flex gap-3 items-center">
          <input
            type="number"
            min={0}
            value={filters.minPrice}
            onChange={(e) => handlePriceChange([Number(e.target.value), filters.maxPrice])}
            placeholder="From"
            className="w-24 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-[#CEBB98] outline-none"
          />
          <input
            type="number"
            min={filters.minPrice}
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange([filters.minPrice, Number(e.target.value)])}
            placeholder="To"
            className="w-24 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-[#CEBB98] outline-none"
          />
        </div>
      </FilterSection>

      {/* Bestsellers */}
      <FilterSection title="Special Collections">
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer text-gray-700">
            <input
              type="checkbox"
              checked={filters.bestseller}
              onChange={() => handleCheckbox("bestseller")}
              className="w-4 h-4 accent-[#CEBB98]"
            />
            <span className="text-sm">Bestsellers ({bestsellerCount})</span>
          </label>
        </div>
      </FilterSection>
    </>
  );
};
