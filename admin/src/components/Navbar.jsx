import React from "react";
import everglowlogo from "../assets/EverGlow2.png";

const Navbar = ({ setToken }) => {
  return (
    <nav
      className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="h-30 w-20 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={everglowlogo}
                alt="Everglow Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-black">
              SPARKLE & SHINE ADMIN
            </h1>
          </div>

          {/* Logout Button */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setToken("")}
              className="rounded-full bg-[#CEBB98] text-black px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base shadow hover:shadow-md active:scale-95 transition-transform duration-150"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
