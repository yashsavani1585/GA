import React, { useState } from "react";

export default function ProductFilter({ filters, setFilters }) {
  const handlePriceChange = (e) => {
    setFilters({ ...filters, maxPrice: Number(e.target.value) });
  };

  const handleGenderChange = (e) => {
    const { name, checked } = e.target;
    setFilters({ ...filters, [name]: checked });
  };

  return (
    <aside className="w-full sm:w-64 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/* Price */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Price: ₹{filters.maxPrice}
        </label>
        <input
          type="range"
          min="0"
          max="100000"
          step="500"
          value={filters.maxPrice}
          onChange={handlePriceChange}
          className="w-full accent-emerald-600"
        />
      </div>

      {/* Gender */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Category</p>
        <label className="flex items-center space-x-2 mb-1">
          <input
            type="checkbox"
            name="forHim"
            checked={filters.forHim}
            onChange={handleGenderChange}
            className="accent-emerald-600"
          />
          <span>For Him</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="forHer"
            checked={filters.forHer}
            onChange={handleGenderChange}
            className="accent-emerald-600"
          />
          <span>For Her</span>
        </label>
      </div>
    </aside>
  );
}
