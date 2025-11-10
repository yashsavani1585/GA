// import React, { useState, useRef, useEffect } from "react";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { Link } from "react-router-dom";

// const NavBar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Close dropdown on menu item click
//   const handleMenuClick = () => {
//     setIsOpen(false);
//   };

//   return (
//     <nav className="max-w-6xl mx-auto flex justify-center space-x-12 mt-0 text-[#CEBB98] font-medium h-16 items-center relative">
//       {/* Shop by Category with Dropdown */}
//       <div className="relative" ref={dropdownRef}>
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="flex items-center space-x-1 hover:underline focus:outline-none"
//         >
//           <span>Shop by Category</span>
//           {isOpen ? (
//             <FaChevronUp className="text-xs" />
//           ) : (
//             <FaChevronDown className="text-xs" />
//           )}
//         </button>

//         {/* Dropdown */}
//         {isOpen && (
//           <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg border rounded-md z-20">
//             <ul className="flex flex-col text-[#CEBB98] font-semibold">
//               <li
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={handleMenuClick}
//               >
//                 <Link to="/rings">RINGS</Link>
//               </li>
//               <li
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={handleMenuClick}
//               >
//                 <Link to="/earrings">EARRINGS</Link>
//               </li>
//               <li
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={handleMenuClick}
//               >
//                 <Link to="/bracelet">BRACELET</Link>
//               </li>
//               <li
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={handleMenuClick}
//               >
//                 <Link to="/necklace">NECKLACE</Link>
//               </li>
//               <li
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={handleMenuClick}
//               >
//                 <Link to="/pendantset">PENDANT SET</Link>
//               </li>
//             </ul>
//           </div>
//         )}
//       </div>

//       {/* Other Menu Items */}
//       <Link to="/giftstore" className="hover:underline">
//         Gift Store
//       </Link>
//       <Link to="/personalized" className="hover:underline">
//         Personalized Jewelry
//       </Link>
//       <Link to="/collections" className="hover:underline">
//         Latest Collections
//       </Link>
//     </nav>
//   );
// };

// export default NavBar;


import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const NavBar = ({ onLinkClick, mobile = false }) => {
  const [isOpen, setIsOpen] = useState(false); // Desktop dropdown
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false); // Mobile dropdown
  const dropdownRef = useRef(null);
  const location = useLocation();

  const categories = [
    { name: "RINGS", path: "/rings" },
    { name: "EARRINGS", path: "/earrings" },
    { name: "BRACELET", path: "/bracelet" },
    { name: "NECKLACE", path: "/necklace" },
    { name: "PENDANT SET", path: "/pendantset" },
  ];

  // ----- Desktop Hover Handlers -----
  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsOpen(false);
    }, 200); // smoother UX
    setHoverTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

  const isActivePath = (paths) =>
    paths.includes(location.pathname) ? "text-yellow-900" : "hover:text-yellow-700";

  return (
    <nav className="w-full text-black font-medium">
      {/* -------------------- Desktop Navbar -------------------- */}
      {!mobile && (
        <div className="flex justify-center items-center space-x-12 p-4 md:px-10">
          <Link
            to="/"
            className={`transition-colors ${isActivePath(["/"])}`}
            onClick={onLinkClick}
          >
            Home
          </Link>

          {/* Shop by Category Dropdown */}
          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`flex items-center space-x-1 transition-colors ${isActivePath(
                categories.map((c) => c.path)
              )}`}
            >
              <span>Shop by Category</span>
              {isOpen ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
            </button>

            {isOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg border rounded-md z-20 animate-fadeIn">
                <ul className="flex flex-col text-yellow-700 font-semibold">
                  {categories.map((item, i) => (
                    <li
                      key={i}
                      className={`hover:bg-gray-100 ${location.pathname === item.path ? "text-yellow-900" : ""}`}
                    >
                      <Link
                        to={item.path}
                        onClick={() => {
                          onLinkClick?.();
                          setIsOpen(false); // close dropdown
                        }}
                        className="block px-4 py-2 w-full"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Static Links */}
          <Link to="/giftstore" className={`transition-colors ${isActivePath(["/giftstore"])}`} onClick={onLinkClick}>
            Gift Store
          </Link>
          <Link
            to="/personalized"
            className={`transition-colors ${isActivePath(["/personalized"])}`}
            onClick={onLinkClick}
          >
            Personalized Jewelry
          </Link>
          <Link
            to="/collections"
            className={`transition-colors ${isActivePath(["/collections"])}`}
            onClick={onLinkClick}
          >
            Latest Collections
          </Link>
          <Link
            to="/auction"
            className={`transition-colors ${isActivePath(["/auction"])}`}
            onClick={onLinkClick}
          >
            Auction
          </Link>
          <Link
            to="/blog"
            className={`transition-colors ${isActivePath(["/blog"])}`}
            onClick={onLinkClick}
          >
            Blog
          </Link>
        </div>
      )}

      {/* -------------------- Mobile Drawer Navbar -------------------- */}
      {mobile && (
        <div className="relative w-full bg-white h-full overflow-y-auto p-4">
          <button
            onClick={onLinkClick}
            className="absolute top-3 right-3 text-gray-600 hover:text-black transition-colors z-30"
          >
            <FaTimes size={22} />
          </button>

          <ul className="pt-12 space-y-5 font-semibold">
            <li>
              <Link to="/" onClick={onLinkClick} className={isActivePath(["/"])}>
                Home
              </Link>
            </li>

            {/* Mobile Collapsible Dropdown */}
            <li>
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full flex justify-between items-center font-bold"
              >
                <span>Shop by Category</span>
                {isCategoryOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {isCategoryOpen && (
                <ul className="flex flex-col text-yellow-700 font-semibold mt-2">
                  {categories.map((item, i) => (
                    <li
                      key={i}
                      className={`px-4 py-2 hover:bg-gray-100 ${
                        location.pathname === item.path ? "text-yellow-900" : ""
                      }`}
                    >
                      <Link
                        to={item.path}
                        onClick={() => {
                          onLinkClick?.();
                          setIsCategoryOpen(false); // close dropdown
                        }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Mobile Static Links */}
            <li>
              <Link to="/giftstore" onClick={onLinkClick} className={isActivePath(["/giftstore"])}>
                Gift Store
              </Link>
            </li>
            <li>
              <Link
                to="/personalized"
                onClick={onLinkClick}
                className={isActivePath(["/personalized"])}
              >
                Personalized Jewelry
              </Link>
            </li>
            <li>
              <Link
                to="/collections"
                onClick={onLinkClick}
                className={isActivePath(["/collections"])}
              >
                Latest Collections
              </Link>
            </li>
            <li>
              <Link to="/auction" onClick={onLinkClick} className={isActivePath(["/auction"])}>
                Auction
              </Link>
            </li>
            <li>
              <Link to="/blog" onClick={onLinkClick} className={isActivePath(["/blog"])}>
                Blog
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
