// src/components/CollectionSection.jsx
import React from "react";
import collectionImg from "../../assets/EverGlowJewellers.png"; // replace with actual image
import { Link } from "react-router-dom"; // 👈 React Router use ho raha hai

const CollectionSection = () => {
  const galleryLinks = [
    { label: "Bracelets", path: "/bracelet" },
    { label: "Rings", path: "/rings" },
    { label: "Earrings", path: "/earrings" },
  ];

  return (
    <section className="w-full bg-white pt-0 pb-10 px-4 sm:px-6 md:px-12 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12">
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={collectionImg}
            alt="Exquisite diamond necklace and earrings set"
            className="w-[669px] h-[560px] object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/669x628/cccccc/ffffff?text=Image+Not+Found";
            }}
          />
        </div>

        {/* Right Side: Text Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h2
            className="text-2xl font-bold uppercase tracking-wide text-black"
            style={{ fontFamily: "'Garamond', 'Times New Roman', serif" }}
          >
            COLLECTION
          </h2>

          <h3
            className="mt-3 text-4xl sm:text-5xl font-normal leading-snug text-black"
            style={{ fontFamily: "'Garamond', 'Times New Roman', serif" }}
          >
            Discover The Beauty In
            <br />
            Our Gallery
          </h3>

          {/* Description + Links with Left Border */}
          <div className="mt-8 border-l-[1.5px] border-[#CEBB98] pl-4">
            <p className="text-gray-500 text-base leading-relaxed max-w-md">
              Explore our exquisite necklace collection, designed to elevate any
              outfit with delicate chains and bold pieces, all crafted with
              quality.
            </p>

            <ul className="mt-6 space-y-3">
              {galleryLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="text-lg text-black hover:underline"
                    style={{ fontFamily: "'Garamond', 'Times New Roman', serif" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
