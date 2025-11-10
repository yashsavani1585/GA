import React from "react";
import heroSection from "../../assets/HeroSection4.png";

const HeroSection4 = () => {
  return (
    <section
      className="
        relative w-full 
        h-[180px] sm:h-[250px] md:h-[350px] lg:h-[450px] xl:h-[550px] 2xl:h-[650px] 
        max-w-full mx-auto
      "
    >
      {/* ✅ Direct image for fast load */}
      <img
        src={heroSection}
        alt="Hero Banner"
        loading="eager"
        fetchpriority="high"
        decoding="sync"
        className="w-full h-full object-cover"
      />

      {/* ✅ Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
    </section>
  );
};

export default HeroSection4;
