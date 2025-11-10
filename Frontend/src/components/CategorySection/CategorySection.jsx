


import React from "react";
import { Link } from "react-router-dom";

import ringImg from "../../assets/Rings.png";
import earringImg from "../../assets/Earrings.png";
import braceletImg from "../../assets/Bracelet.png";
import necklaceImg from "../../assets/Necklace.png";
import pendantImg from "../../assets/PandaleSet.png";

const categories = [
  { id: 1, title: "RINGS", img: ringImg, link: "/rings" },
  { id: 2, title: "EARRINGS", img: earringImg, link: "/earrings" },
  { id: 3, title: "BRACELET", img: braceletImg, link: "/bracelet" },
  { id: 4, title: "NECKLACE", img: necklaceImg, link: "/necklace" },
  { id: 5, title: "PENDANT", img: pendantImg, link: "/pendantset" },
];

const CategorySection = () => {
  return (
    <section className="w-full bg-white py-10 px-3 sm:px-6 md:px-12">
      {/* Heading */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold text-black">
          Find Your Perfect Match
        </h2>
        <p className="text-sm sm:text-base md:text-xl text-gray-600 font-bold mt-2">
          Radiance Fits for Everyone
        </p>
      </div>

      {/* Categories - Always 5 Columns */}
      <div className="max-w-6xl mx-auto grid grid-cols-5 gap-3 sm:gap-6 md:gap-8">
        {categories.map((cat) => (
          <div key={cat.id} className="flex flex-col items-center text-center">
            <Link to={cat.link}>
              <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 overflow-hidden rounded-xl shadow-md">
                <picture>
                  {/* Mobile Image */}
                  <source srcSet={cat.img} media="(max-width: 640px)" />
                  {/* Desktop Image */}
                  <source srcSet={cat.img} media="(min-width: 641px)" />
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    fetchpriority="auto"
                  />
                </picture>
              </div>

              <p className="mt-2 text-[10px] sm:text-xs md:text-sm lg:text-base font-medium text-black">
                {cat.title}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
