// src/pages/AboutLabDiamonds.jsx
import React from "react";

const AboutLabDiamonds = () => {
  return (
    <div className="min-h-screen font-sans bg-white text-black">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#CEBB40] to-[#CEBB80] text-black py-24 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-pulse">
          About Lab Diamonds
        </h1>
        <p className="text-lg md:text-2xl max-w-3xl mx-auto">
          Discover the brilliance of lab-grown diamonds—luxury, ethical, and eco-friendly, without compromising quality or sparkle.
        </p>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 md:px-20 bg-white text-black">
        <h2 className="text-4xl font-bold mb-6 text-center border-b-2 border-[#CEBB40]  pb-2">
          What are Lab Diamonds?
        </h2>
        <p className="max-w-3xl mx-auto text-center text-gray-800 text-lg leading-relaxed">
          Lab-grown diamonds are real diamonds produced in controlled environments using advanced technology. Chemically, physically, and visually identical to mined diamonds, they are sustainable, ethical, and of premium quality.
        </p>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6 md:px-20 bg-gray-50 text-black">
        <h2 className="text-4xl font-bold mb-10 text-center border-b-2 border-[#CEBB40]  pb-2">
          Benefits of Lab Diamonds
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-[#CEBB40] transition-shadow duration-300 border border-[#CEBB40]">
            <h3 className="text-2xl font-semibold mb-3 text-[#CEBB40]">Eco-Friendly</h3>
            <p className="text-gray-700 text-lg">
              Lab diamonds have a significantly lower environmental impact compared to mined diamonds.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-[#CEBB40] transition-shadow duration-300 border border-[#CEBB40]">
            <h3 className="text-2xl font-semibold mb-3 text-[#CEBB40]">Ethically Sourced</h3>
            <p className="text-gray-700 text-lg">
              No mining exploitation, ensuring fair and ethical production practices.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-[#CEBB40] transition-shadow duration-300 border border-[#CEBB40]">
            <h3 className="text-2xl font-semibold mb-3 text-[#CEBB40]">High Quality</h3>
            <p className="text-gray-700 text-lg">
              Identical to natural diamonds in brilliance, hardness, and durability.
            </p>
          </div>
        </div>
      </section>

      {/* How They Are Made */}
      <section className="py-16 px-6 md:px-20 bg-white text-black">
        <h2 className="text-4xl font-bold mb-6 text-center border-b-2 border-[#CEBB40]  pb-2">
          How Lab Diamonds Are Created
        </h2>
        <p className="max-w-4xl mx-auto text-gray-800 text-lg leading-relaxed text-center mb-8">
          Lab diamonds are grown using High Pressure High Temperature (HPHT) and Chemical Vapor Deposition (CVD) methods, replicating natural diamond formation with precision and quality.
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-[#CEBB40] transition-shadow duration-300 w-64 border border-[#CEBB40]">
            <h3 className="text-xl font-semibold mb-2 text-[#CEBB40]">HPHT Method</h3>
            <p className="text-gray-700 text-sm">
              Diamonds are formed under high pressure and temperature, mimicking natural conditions.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-[#CEBB40] transition-shadow duration-300 w-64 border border-[#CEBB40]">
            <h3 className="text-xl font-semibold mb-2 text-[#CEBB40]">CVD Method</h3>
            <p className="text-gray-700 text-sm">
              Diamonds grow from carbon-rich gas plasma, producing flawless, high-purity diamonds.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 text-center bg-gradient-to-r from-[#CEBB40] to-[#CEBB80] text-black">
        <h2 className="text-4xl font-bold mb-4">Explore Lab Diamond Collection</h2>
        <p className="mb-6 max-w-2xl mx-auto text-lg">
          Browse our exquisite selection of lab-grown diamonds and jewelry—luxury, ethical, and sustainable.
        </p>
        <a
          href="/collections"
          className="bg-white text-[#CEBB40] font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-all duration-300"
        >
          View Collection
        </a>
      </section>
    </div>
  );
};

export default AboutLabDiamonds;
