import React, { useEffect, useRef } from "react";
import ring from "../../assets/Rings.png";
import necklace from "../../assets/Necklace.png";
import earring from "../../assets/Earrings.png";
import bracelet from "../../assets/Bracelet.png";
import Pendant from "../../assets/PandaleSet.png";
import { Link } from "react-router-dom";

const SearchOverlay = ({ open, onClose, anchorRef, query, setQuery }) => {
  const overlayRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        open &&
        overlayRef.current &&
        !overlayRef.current.contains(e.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose, anchorRef]);

  // Close on ESC key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const products = [
    { name: "Ring", img: ring, link: "/rings" },
    { name: "Necklace", img: necklace, link: "/necklace" },
    { name: "Earrings", img: earring, link: "/earrings" },
    { name: "Bracelet", img: bracelet, link: "/bracelet" },
    { name: "Pendant Set", img: Pendant, link: "/pendantset" },
  ];

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div
      ref={overlayRef}
      className="absolute top-full left-1/2 -translate-x-1/2 
                 w-full sm:w-[95%] lg:w-[70%] 
                 mt-3 bg-white border rounded-xl 
                 shadow-2xl z-50 p-4
                 max-h-[70vh] overflow-y-auto"
    >
      {/* Trending section when no query */}
      {!query && (
        <>
          <h3 className="font-semibold mb-3 text-gray-800">Trending</h3>
          <div className="flex flex-nowrap gap-2 mb-6 overflow-x-auto scrollbar-hide">
            {[
              "Rings",
              "bracelet",
              "Pendant-Sets",
              "Men's Products",
              "earring",
              "necklace",
              "WoMen's Products",
            ].map((item, i) => (
              <span
                key={i}
                onClick={() => setQuery(item)}
                className="px-3 py-1 border border-gray-300 whitespace-nowrap rounded-full text-sm cursor-pointer hover:bg-gray-100 transition"
              >
                {item}
              </span>
            ))}
          </div>
        </>
      )}

      {/* What's new / search results */}
      <h3 className="font-semibold mb-3 text-gray-800">
        {query ? "Results" : "What's New"}
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.length ? (
          filtered.map((p, i) => (
            <Link
              key={i}
              to={p.link}
              onClick={onClose}
              className="flex flex-col items-center bg-gray-50 rounded-lg p-4 hover:shadow-lg transition"
            >
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-3"
              />
              <p className="text-sm sm:text-base font-medium text-center line-clamp-2 text-gray-700">
                {p.name}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-sm sm:text-base col-span-full text-center py-6">
            No results found
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
