import React from "react";
import mainImage from "../../assets/EverGlowOffer1.png";
import elegantRing from "../../assets/EverGlowOffer2.png";
import diamondRing from "../../assets/EverGlowOffer3.png";

const LatestOffers = () => {
  return (
        <section className="w-full bg-white pt-0 pb-10 px-4 sm:px-6 md:px-12">
      {/* Heading */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold text-black">
          LATEST OFFERS
        </h2>
      </div>

      {/* Flex Layout - Always Side by Side */}
      <div className="max-w-7xl mx-auto flex flex-row gap-3 sm:gap-6">
        
        {/* Left Big Image */}
        <div className="flex-1">
          <img
            src={mainImage}
            alt="New Jewelry Collection"
            className="w-full h-[180px] xs:h-[220px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-fit rounded-lg transition-transform duration-500 hover:scale-105 cursor-pointer"
          />
        </div>

        {/* Right Two Small Images */}
        <div className="flex-1 flex flex-col gap-3 sm:gap-3">
          {/* Top */}
          <img
            src={elegantRing}
            alt="Elegant Jewellery"
            className="w-full h-[80px] xs:h-[110px] sm:h-[190px] md:h-[190px] lg:h-[240px] object-fit rounded-lg transition-transform duration-500 hover:scale-105 cursor-pointer"
          />

          {/* Bottom */}
          <img
            src={diamondRing}
            alt="Diamond Rings"
            className="w-full h-[80px] xs:h-[110px] sm:h-[160px] md:h-[190px] lg:h-[240px] mt-1 object-fit rounded-lg transition-transform duration-500 hover:scale-105 cursor-pointer"
          />
        </div>
      </div>
    </section>
  );
};

export default LatestOffers;
