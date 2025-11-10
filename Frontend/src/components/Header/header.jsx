// import React, { useState, useRef, useEffect } from "react";
// import {
//   FaHeart,
//   FaShoppingCart,
//   FaSearch,
//   FaCamera,
//   FaUser,
// } from "react-icons/fa";
// import Logo from "../Logo/Logo";
// import NavBar from "../NavBar/NavBar";
// import { Link } from "react-router-dom";

// import ProfileImg from "../../assets/profile.png";
// import OrdersImg from "../../assets/orders.png";
// import TermsImg from "../../assets/terms.png";
// import PrivacyImg from "../../assets/privacy.png";
// import ContactImg from "../../assets/contact.png";
// import LogoutImg from "../../assets/logout.png";

// const Header = () => {
//   const [accountOpen, setAccountOpen] = useState(false);
//   const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
//   const accountRef = useRef(null);

//   useEffect(() => {
//     const handler = (e) => {
//       if (accountRef.current && !accountRef.current.contains(e.target)) {
//         setAccountOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const handleLinkClick = () => {
//     setAccountOpen(false);
//   };

//   return (
//     <header className="w-full bg-white border-b border-gray-200 relative">
//       {/* 🔹 Top Row */}
//       <div className="max-w-7xl mx-auto flex items-center justify-between px-3 py-2">
//         {/* Logo */}
//         <div className="flex-shrink-0">
//           <Link to="/">
//             <Logo />
//           </Link>
//         </div>

//         {/* Search Bar (Desktop Only) */}
//         <div className="hidden md:flex flex-1 justify-center px-4">
//           <div className="flex items-center w-full max-w-xl border border-[#CEBB98] rounded-lg h-12 px-4">
//             <input
//               type="text"
//               placeholder="Search..."
//               className="flex-grow outline-none text-[#CEBB98] placeholder-[#CEBB98] text-base"
//             />
//             <button className="text-[#CEBB98]">
//               <FaCamera />
//             </button>
//             <button className="ml-2 text-[#CEBB98]">
//               <FaSearch />
//             </button>
//           </div>
//         </div>

//         {/* Action Icons */}
//         <div className="flex items-center space-x-5 text-[#CEBB98]">
//           {/* Mobile Search Icon */}
//           <button
//             onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
//             className="md:hidden text-xl"
//           >
//             <FaSearch />
//           </button>

//           <Link to="/Wishlist">
//             <div className="flex flex-col items-center cursor-pointer">
//               <FaHeart className="text-xl" />
//               <span className="hidden sm:block text-xs">Wishlist</span>
//             </div>
//           </Link>
//           <Link to="/cart">
//             <div className="flex flex-col items-center cursor-pointer">
//               <FaShoppingCart className="text-xl" />
//               <span className="hidden sm:block text-xs">Cart</span>
//             </div>
//           </Link>

//           {/* Account Dropdown */}
//           <div
//             className="flex flex-col items-center cursor-pointer relative"
//             ref={accountRef}
//           >
//             <div
//               onClick={() => setAccountOpen(!accountOpen)}
//               className="flex flex-col items-center"
//             >
//               <FaUser className="text-xl" />
//               <span className="hidden sm:block text-xs">Account</span>
//             </div>

//             {accountOpen && (
//               <div className="absolute top-12 right-0 w-64 bg-white border shadow-lg rounded-md p-4 z-20">
//                 <p className="font-medium text-gray-700 mb-3">
//                   Welcome To Everglow Jewels !
//                 </p>
//                 <ul className="space-y-3 text-gray-700">
//                   <Link to="/profile" onClick={handleLinkClick}>
//                     <li className="flex items-center gap-2 hover:text-[#CEBB98]">
//                       <img
//                         src={ProfileImg}
//                         alt="Profile"
//                         className="w-5 h-5 m-2"
//                       />
//                       Your Profile
//                     </li>
//                   </Link>
//                   <Link to="/MyOrder" onClick={handleLinkClick}>
//                     <li className="flex items-center gap-2 hover:text-[#CEBB98]">
//                       <img
//                         src={OrdersImg}
//                         alt="Orders"
//                         className="w-5 h-5 m-2"
//                       />
//                       My Orders
//                     </li>
//                   </Link>
//                   <Link to="/terms" onClick={handleLinkClick}>
//                     <li className="flex items-center gap-2 hover:text-[#CEBB98]">
//                       <img
//                         src={TermsImg}
//                         alt="Terms"
//                         className="w-5 h-5 m-2"
//                       />
//                       Terms & Conditions
//                     </li>
//                   </Link>
//                   <Link to="/privacy" onClick={handleLinkClick}>
//                     <li className="flex items-center gap-2 hover:text-[#CEBB98]">
//                       <img
//                         src={PrivacyImg}
//                         alt="Privacy"
//                         className="w-5 h-5 m-2"
//                       />
//                       Privacy Policy
//                     </li>
//                   </Link>
//                   <Link to="/contact" onClick={handleLinkClick}>
//                     <li className="flex items-center gap-2 hover:text-[#CEBB98]">
//                       <img
//                         src={ContactImg}
//                         alt="Contact"
//                         className="w-5 h-5 m-2"
//                       />
//                       Contact Us
//                     </li>
//                   </Link>
//                   <Link to="/logout" onClick={handleLinkClick}>
//                     <li className="flex items-center gap-2 hover:text-red-600">
//                       <img
//                         src={LogoutImg}
//                         alt="Logout"
//                         className="w-5 h-5 m-2"
//                       />
//                       Logout
//                     </li>
//                   </Link>
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Search Box (Open When Clicked) */}
//       {mobileSearchOpen && (
//         <div className="px-3 pb-3 md:hidden">
//           <div className="flex items-center w-full border border-[#CEBB98] rounded-lg h-12 px-4">
//             <input
//               type="text"
//               placeholder="Search..."
//               className="flex-grow outline-none text-[#CEBB98] placeholder-[#CEBB98] text-base"
//             />
//             <button className="text-[#CEBB98]">
//               <FaCamera />
//             </button>
//             <button className="ml-2 text-[#CEBB98]">
//               <FaSearch />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Navbar (unchanged) */}
//       <div className="border-t border-gray-200">
//         <NavBar />
//       </div>
//     </header>
//   );
// };

// export default Header;

// import React, { useState, useRef, useEffect } from "react";
// import {
//   FaHeart,
//   FaShoppingCart,
//   FaSearch,
//   FaCamera,
//   FaUser,
//   FaBars,
// } from "react-icons/fa";
// import { Drawer } from "@mui/material";
// import Logo from "../Logo/Logo";
// import NavBar from "../NavBar/NavBar";
// import { Link } from "react-router-dom";

// const Header = () => {
//   const [accountOpen, setAccountOpen] = useState(false);
//   const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const accountRef = useRef(null);

//   useEffect(() => {
//     const handler = (e) => {
//       if (accountRef.current && !accountRef.current.contains(e.target)) {
//         setAccountOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const handleLinkClick = () => {
//     setDrawerOpen(false);
//     setAccountOpen(false);
//   };

//   return (
//     <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
//       <div className="max-w-7xl mx-auto flex items-center justify-between px-3 py-2">
//         {/* Left Side: Mobile Menu + Logo */}
//         <div className="flex items-center space-x-3">
//           <button
//             className="md:hidden text-2xl text-[#CEBB98]"
//             onClick={() => setDrawerOpen(true)}
//           >
//             <FaBars />
//           </button>

//           <Link to="/">
//             <Logo />
//           </Link>
//         </div>

//         {/* Search (Desktop Only) */}
//         <div className="hidden md:flex flex-1 justify-center px-4">
//           <div className="flex items-center w-full max-w-xl border border-[#CEBB98] rounded-lg h-12 px-4">
//             <input
//               type="text"
//               placeholder="Search..."
//               className="flex-grow outline-none text-[#CEBB98] placeholder-[#CEBB98] text-base"
//             />
//             <button className="text-[#CEBB98] hover:text-[#a02ca5] transition-colors">
//               <FaCamera />
//             </button>
//             <button className="ml-2 text-[#CEBB98] hover:text-[#a02ca5] transition-colors">
//               <FaSearch />
//             </button>
//           </div>
//         </div>

//         {/* Right Side Icons */}
//         <div className="flex items-center space-x-5 text-[#CEBB98]">
//           {/* Mobile search toggle */}
//           <button
//             onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
//             className="md:hidden text-xl"
//           >
//             <FaSearch />
//           </button>

//           <Link to="/wishlist">
//             <div className="flex flex-col items-center cursor-pointer hover:text-[#a02ca5] transition-colors">
//               <FaHeart className="text-xl" />
//               <span className="hidden sm:block text-xs">Wishlist</span>
//             </div>
//           </Link>
//           <Link to="/cart">
//             <div className="flex flex-col items-center cursor-pointer hover:text-[#a02ca5] transition-colors">
//               <FaShoppingCart className="text-xl" />
//               <span className="hidden sm:block text-xs">Cart</span>
//             </div>
//           </Link>

//           {/* Account Dropdown */}
//           <div
//             className="flex flex-col items-center cursor-pointer relative"
//             ref={accountRef}
//           >
//             <div
//               onClick={() => setAccountOpen(!accountOpen)}
//               className="flex flex-col items-center hover:text-[#a02ca5] transition-colors"
//             >
//               <FaUser className="text-xl" />
//               <span className="hidden sm:block text-xs">Account</span>
//             </div>
//             {accountOpen && (
//               <div className="absolute top-12 right-0 w-64 bg-white border shadow-lg rounded-md p-4 z-20 animate-fadeIn">
//                 <p className="font-medium text-gray-700 mb-3">
//                   Welcome To Everglow Jewels!
//                 </p>
//                 <ul className="space-y-3 text-gray-700">
//                   <Link to="/profile" onClick={handleLinkClick}><li className="hover:text-[#CEBB98] mb-2">Your Profile</li></Link>
//                   <Link to="/myorder" onClick={handleLinkClick}><li className="hover:text-[#CEBB98] mb-2">My Orders</li></Link>
//                   <Link to="/terms" onClick={handleLinkClick}><li className="hover:text-[#CEBB98] mb-2">Terms & Conditions</li></Link>
//                   <Link to="/privacy" onClick={handleLinkClick}><li className="hover:text-[#CEBB98] mb-2">Privacy Policy</li></Link>
//                   <Link to="/contact" onClick={handleLinkClick}><li className="hover:text-[#CEBB98] mb-2">Contact Us</li></Link>
//                   <Link to="/logout" onClick={handleLinkClick}><li className="hover:text-red-600 mb-2">Logout</li></Link>
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Search Box */}
//       {mobileSearchOpen && (
//         <div className="px-3 pb-3 md:hidden animate-fadeIn">
//           <div className="flex items-center w-full border border-[#CEBB98] rounded-lg h-12 px-4">
//             <input
//               type="text"
//               placeholder="Search..."
//               className="flex-grow outline-none text-[#CEBB98] placeholder-[#CEBB98] text-base"
//             />
//             <button className="text-[#CEBB98]"><FaCamera /></button>
//             <button className="ml-2 text-[#CEBB98]"><FaSearch /></button>
//           </div>
//         </div>
//       )}

//       {/* Desktop Navbar */}
//       <div className="border-t border-gray-200 hidden md:block">
//         <NavBar onLinkClick={handleLinkClick} />
//       </div>

//       {/* Mobile Drawer */}
//       <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
//         <div className="w-64 h-full p-5 bg-white">
//           <NavBar onLinkClick={handleLinkClick} mobile />
//         </div>
//       </Drawer>
//     </header>
//   );
// };

// export default Header;

// import React, { useState, useRef, useEffect } from "react";
// import {
//   FaHeart,
//   FaShoppingCart,
//   FaSearch,
//   FaCamera,
//   FaUser,
//   FaBars,
// } from "react-icons/fa";
// import { Drawer } from "@mui/material";
// import Logo from "../Logo/Logo";
// import NavBar from "../NavBar/NavBar";
// import { Link, useNavigate } from "react-router-dom";

// const Header = () => {
//   const [accountOpen, setAccountOpen] = useState(false);
//   const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false); // ✅ auth state
//   const accountRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handler = (e) => {
//       if (accountRef.current && !accountRef.current.contains(e.target)) {
//         setAccountOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const handleLinkClick = () => {
//     setDrawerOpen(false);
//     setAccountOpen(false);
//   };

//   return (
//     <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
//       <div className="max-w-7xl mx-auto flex items-center justify-between px-3 py-2">
//         {/* Left Side: Mobile Menu + Logo */}
//         <div className="flex items-center space-x-3">
//           <button
//             className="md:hidden text-2xl text-[#CEBB98]"
//             onClick={() => setDrawerOpen(true)}
//           >
//             <FaBars />
//           </button>

//           <Link to="/">
//             <Logo />
//           </Link>
//         </div>

//         {/* Search (Desktop Only) */}
//         <div className="hidden md:flex flex-1 justify-center px-4">
//           <div className="flex items-center w-full max-w-xl border border-[#CEBB98] rounded-lg h-12 px-4">
//             <input
//               type="text"
//               placeholder="Search..."
//               className="flex-grow outline-none text-[#CEBB98] placeholder-[#CEBB98] text-base"
//             />
//             <button className="ml-2 text-[#CEBB98] hover:text-[#a02ca5] transition-colors">
//               <FaSearch />
//             </button>
//           </div>
//         </div>

//         {/* Right Side Icons */}
//         <div className="flex items-center space-x-5 text-[#CEBB98]">
//           {/* Mobile search toggle */}
//           <button
//             onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
//             className="md:hidden text-xl"
//           >
//             <FaSearch />
//           </button>

//           <Link to="/wishlist">
//             <div className="flex flex-col items-center cursor-pointer hover:text-[#a02ca5] transition-colors">
//               <FaHeart className="text-xl" />
//               <span className="hidden sm:block text-xs">Wishlist</span>
//             </div>
//           </Link>
//           <Link to="/cart">
//             <div className="flex flex-col items-center cursor-pointer hover:text-[#a02ca5] transition-colors">
//               <FaShoppingCart className="text-xl" />
//               <span className="hidden sm:block text-xs">Cart</span>
//             </div>
//           </Link>

//           {/* Account Dropdown */}
//           <div
//             className="flex flex-col items-center cursor-pointer relative"
//             ref={accountRef}
//           >
//             <div
//               onClick={() => {
//                 if (!isAuthenticated) {
//                   navigate("/auth"); // 🚀 agar login nahi hai → auth page
//                 } else {
//                   setAccountOpen(!accountOpen);
//                 }
//               }}
//               className="flex flex-col items-center hover:text-[#a02ca5] transition-colors"
//             >
//               <FaUser className="text-xl" />
//               <span className="hidden sm:block text-xs">Account</span>
//             </div>

//             {/* Dropdown only if logged in */}
//             {isAuthenticated && accountOpen && (
//               <div className="absolute top-12 right-0 w-64 bg-white border shadow-lg rounded-md p-4 z-20 animate-fadeIn">
//                 <p className="font-medium text-gray-700 mb-3">
//                   Welcome To Everglow Jewels!
//                 </p>
//                 <ul className="space-y-3 text-gray-700">
//                   <Link to="/profile" onClick={handleLinkClick}>
//                     <li className="hover:text-[#CEBB98] mb-2">Your Profile</li>
//                   </Link>
//                   <Link to="/myorder" onClick={handleLinkClick}>
//                     <li className="hover:text-[#CEBB98] mb-2">My Orders</li>
//                   </Link>
//                   <Link to="/terms" onClick={handleLinkClick}>
//                     <li className="hover:text-[#CEBB98] mb-2">
//                       Terms & Conditions
//                     </li>
//                   </Link>
//                   <Link to="/privacy" onClick={handleLinkClick}>
//                     <li className="hover:text-[#CEBB98] mb-2">Privacy Policy</li>
//                   </Link>
//                   <Link to="/contact" onClick={handleLinkClick}>
//                     <li className="hover:text-[#CEBB98] mb-2">Contact Us</li>
//                   </Link>
//                   <li
//                     onClick={() => {
//                       setIsAuthenticated(false); // logout
//                       handleLinkClick();
//                     }}
//                     className="hover:text-red-600 mb-2 cursor-pointer"
//                   >
//                     Logout
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Search Box */}
//       {mobileSearchOpen && (
//         <div className="px-3 pb-3 md:hidden animate-fadeIn">
//           <div className="flex items-center w-full border border-[#CEBB98] rounded-lg h-12 px-4">
//             <input
//               type="text"
//               placeholder="Search..."
//               className="flex-grow outline-none text-[#CEBB98] placeholder-[#CEBB98] text-base"
//             />
//             <button className="text-[#CEBB98]">
//               <FaCamera />
//             </button>
//             <button className="ml-2 text-yellow-700">
//               <FaSearch />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Desktop Navbar */}
//       <div className="border-t border-gray-200 hidden md:block">
//         <NavBar onLinkClick={handleLinkClick} />
//       </div>

//       {/* Mobile Drawer */}
//       <Drawer
//         anchor="left"
//         open={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//       >
//         <div className="w-64 h-full p-5 bg-white">
//           <NavBar onLinkClick={handleLinkClick} mobile />
//         </div>
//       </Drawer>
//     </header>
//   );
// };

// export default Header;

// import React, { useState, useRef, useEffect } from "react";
// import {
//   FaHeart,
//   FaShoppingCart,
//   FaSearch,
//   FaUser,
//   FaBars,
// } from "react-icons/fa";
// import { Drawer } from "@mui/material";
// import Logo from "../Logo/Logo";
// import NavBar from "../NavBar/NavBar";
// import { Link, useNavigate } from "react-router-dom";
// import SearchOverlay from "../SearchOverlay/SearchOverlay";

// const Header = () => {
//   const [accountOpen, setAccountOpen] = useState(false);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(true);
//   const [searchOpen, setSearchOpen] = useState(false); // 🔑 search overlay state
//   const accountRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handler = (e) => {
//       if (accountRef.current && !accountRef.current.contains(e.target)) {
//         setAccountOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const handleLinkClick = () => {
//     setDrawerOpen(false);
//     setAccountOpen(false);
//   };

//   return (
//     <>
//     <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
//       <div className="max-w-7xl mx-auto flex items-center justify-between px-3 py-2">

//         {/* Left: Logo */}
//         <div className="flex items-center">
//           <Link to="/" className="block w-20 md:w-auto">
//             {/* Mobile me chhota logo, desktop me normal */}
//             <Logo />
//           </Link>
//         </div>

//         {/* Search Bar */}
//         {/* Search Bar */}
//           <div className="flex flex-1 justify-center px-2 md:px-4">
//           <div
//           onClick={() => setSearchOpen(true)}
//             className="
//               flex items-center w-full
//               max-w-[140px] h-7
//               sm:max-w-[200px] sm:h-8
//               md:max-w-md md:h-10
//               lg:max-w-xl lg:h-12
//               border border-yellow-700 rounded-lg
//               overflow-hidden bg-white
//             "
//           >
//             <input
//               type="text"
//               placeholder="Search..."
//               className="flex-grow outline-none text-yellow-700 placeholder-[#CEBB98]
//                          text-[11px] sm:text-xs md:text-sm lg:text-base px-2"
//             />
//             <button
//               className="flex items-center justify-center px-2
//                          text-yellow-700 hover:text-yellow-900 transition-colors
//                          bg-transparent border-none"
//             >
//               <FaSearch className="text-xs sm:text-sm md:text-base" />
//             </button>
//           </div>
//         </div>


//         {/* Right: Account + Drawer */}
//         <div className="flex items-center space-x-4 text-[#CEBB98]">
//                     <div className="hidden md:flex items-center space-x-5">
//             <Link to="/wishlist">
//               <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
//                 <FaHeart className="text-xl" />
//                 <span className="hidden sm:block text-xs">Wishlist</span>
//               </div>
//             </Link>
//             <Link to="/cart">
//               <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
//                 <FaShoppingCart className="text-xl" />
//                 <span className="hidden sm:block text-xs">Cart</span>
//               </div>
//             </Link>
//           </div>
//           {/* Account */}
//           <div
//             className="flex flex-col items-center cursor-pointer relative"
//             ref={accountRef}
//           >
//             <div
//               onClick={() => {
//                 if (!isAuthenticated) {
//                   navigate("/auth");
//                 } else {
//                   setAccountOpen(!accountOpen);
//                 }
//               }}
//               className="flex flex-col items-center hover:text-black transition-colors"
//             >
//               <FaUser className="text-lg md:text-xl" />
//               <span className="hidden sm:block text-xs">Account</span>
//             </div>

//             {isAuthenticated && accountOpen && (
//               <div className="absolute top-12 right-0 w-64 bg-white border shadow-lg rounded-md p-4 z-20 animate-fadeIn">
//                 <p className="font-medium text-[#CEBB98] mb-3">
//                   Welcome To Everglow Jewels!
//                 </p>
//                 <ul className="space-y-3 text-[#c0a87a]">
//                   <Link to="/profile" onClick={handleLinkClick}>
//                     <li className="hover:text- yellow-700 mb-2">Your Profile</li>
//                   </Link>
//                   <Link to="/myorder" onClick={handleLinkClick}>
//                     <li className="hover:text-yellow-700 mb-2">My Orders</li>
//                   </Link>
//                   <Link to="/terms" onClick={handleLinkClick}>
//                     <li className="hover:text-yellow-700 mb-2">
//                       Terms & Conditions
//                     </li>
//                   </Link>
//                   <Link to="/privacy" onClick={handleLinkClick}>
//                     <li className="hover:text-yellow-700 mb-2">Privacy Policy</li>
//                   </Link>
//                   <Link to="/contact" onClick={handleLinkClick}>
//                     <li className="hover:text-yellow-700 mb-2">Contact Us</li>
//                   </Link>
//                   <li
//                     onClick={() => {
//                       setIsAuthenticated(false);
//                       handleLinkClick();
//                     }}
//                     className="hover:text-red-600 mb-2 cursor-pointer"
//                   >
//                     Logout
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Drawer Button */}
//           <button
//             className="text-xl md:hidden"
//             onClick={() => setDrawerOpen(true)}
//           >
//             <FaBars />
//           </button>

//           {/* Wishlist + Cart (desktop only) */}

//         </div>
//       </div>

//       {/* Desktop Navbar */}
//       <div className="border-t border-gray-200 hidden md:block">
//         <NavBar onLinkClick={handleLinkClick} />
//       </div>

//       {/* Mobile Drawer */}
//       <Drawer
//         anchor="right"
//         open={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//       >
//         <div className="w-64 h-full flex flex-col justify-between bg-white">
//           {/* Top: Nav Links */}
//           <div className="p-5">
//             <NavBar onLinkClick={handleLinkClick} mobile />
//           </div>

//           {/* Bottom: Wishlist + Cart */}
//           <div className="border-t p-5 flex justify-around text-[#CEBB98]">
//             <Link to="/wishlist" onClick={handleLinkClick}>
//               <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
//                 <FaHeart className="text-xl" />
//                 <span className="text-xs">Wishlist</span>
//               </div>
//             </Link>
//             <Link to="/cart" onClick={handleLinkClick}>
//               <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
//                 <FaShoppingCart className="text-xl" />
//                 <span className="text-xs">Cart</span>
//               </div>
//             </Link>
//           </div>
//         </div>
//       </Drawer>
//     </header>

//     <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
//     </>

//   );
// };

// export default Header;

// import React, { useState, useRef, useEffect } from "react";
// import {
//   FaHeart,
//   FaShoppingCart,
//   FaSearch,
//   FaUser,
//   FaBars,
// } from "react-icons/fa";
// import { Drawer } from "@mui/material";
// import Logo from "../Logo/Logo";
// import NavBar from "../NavBar/NavBar";
// import { Link, useNavigate } from "react-router-dom";
// import SearchOverlay from "../SearchOverlay/SearchOverlay";

// const Header = () => {
//   const [accountOpen, setAccountOpen] = useState(false);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(true);
//   const [searchOpen, setSearchOpen] = useState(false); // search overlay state
//   const accountRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handler = (e) => {
//       if (accountRef.current && !accountRef.current.contains(e.target)) {
//         setAccountOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const handleLinkClick = () => {
//     setDrawerOpen(false);
//     setAccountOpen(false);
//   };

//   return (
//     <>
//       <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto flex items-center justify-between px-3 py-2">

//           {/* Left: Logo */}
//           <div className="flex items-center">
//             <Link to="/" className="block w-20 md:w-auto">
//               <Logo />
//             </Link>
//           </div>

//           {/* Search Bar */}
//           <div className="flex flex-1 justify-center px-2 md:px-4">
//             <div
//               onClick={() => setSearchOpen(true)}
//               className="
//                 flex items-center w-full
//                 max-w-[140px] h-7
//                 sm:max-w-[200px] sm:h-8
//                 md:max-w-md md:h-10
//                 lg:max-w-xl lg:h-12
//                 border border-yellow-700 rounded-lg
//                 overflow-hidden bg-white cursor-pointer
//               "
//             >
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="flex-grow outline-none text-yellow-700 placeholder-[#CEBB98]
//                            text-[11px] sm:text-xs md:text-sm lg:text-base px-2 pointer-events-none"
//                 readOnly
//               />
//               <button
//                 className="flex items-center justify-center px-2
//                            text-yellow-700 hover:text-yellow-900 transition-colors
//                            bg-transparent border-none"
//               >
//                 <FaSearch className="text-xs sm:text-sm md:text-base" />
//               </button>
//             </div>
//           </div>

//           {/* Right: Account + Drawer */}
//           <div className="flex items-center space-x-4 text-[#CEBB98]">
//             <div className="hidden md:flex items-center space-x-5">
//               <Link to="/wishlist">
//                 <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
//                   <FaHeart className="text-xl" />
//                   <span className="hidden sm:block text-xs">Wishlist</span>
//                 </div>
//               </Link>
//               <Link to="/cart">
//                 <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
//                   <FaShoppingCart className="text-xl" />
//                   <span className="hidden sm:block text-xs">Cart</span>
//                 </div>
//               </Link>
//             </div>

//             {/* Account */}
//             <div
//               className="flex flex-col items-center cursor-pointer relative"
//               ref={accountRef}
//             >
//               <div
//                 onClick={() => {
//                   if (!isAuthenticated) {
//                     navigate("/auth");
//                   } else {
//                     setAccountOpen(!accountOpen);
//                   }
//                 }}
//                 className="flex flex-col items-center hover:text-black transition-colors"
//               >
//                 <FaUser className="text-lg md:text-xl" />
//                 <span className="hidden sm:block text-xs">Account</span>
//               </div>

//               {isAuthenticated && accountOpen && (
//                 <div className="absolute top-12 right-0 w-64 bg-white border shadow-lg rounded-md p-4 z-20 animate-fadeIn">
//                   <p className="font-medium text-[#CEBB98] mb-3">
//                     Welcome To Everglow Jewels!
//                   </p>
//                   <ul className="space-y-3 text-[#c0a87a]">
//                     <Link to="/profile" onClick={handleLinkClick}>
//                       <li className="hover:text-yellow-700 mb-2">Your Profile</li>
//                     </Link>
//                     <Link to="/myorder" onClick={handleLinkClick}>
//                       <li className="hover:text-yellow-700 mb-2">My Orders</li>
//                     </Link>
//                     <Link to="/terms" onClick={handleLinkClick}>
//                       <li className="hover:text-yellow-700 mb-2">
//                         Terms & Conditions
//                       </li>
//                     </Link>
//                     <Link to="/privacy" onClick={handleLinkClick}>
//                       <li className="hover:text-yellow-700 mb-2">Privacy Policy</li>
//                     </Link>
//                     <Link to="/contact" onClick={handleLinkClick}>
//                       <li className="hover:text-yellow-700 mb-2">Contact Us</li>
//                     </Link>
//                     <li
//                       onClick={() => {
//                         setIsAuthenticated(false);
//                         handleLinkClick();
//                       }}
//                       className="hover:text-red-600 mb-2 cursor-pointer"
//                     >
//                       Logout
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>

//             {/* Drawer Button */}
//             <button
//               className="text-xl md:hidden"
//               onClick={() => setDrawerOpen(true)}
//             >
//               <FaBars />
//             </button>
//           </div>
//         </div>

//         {/* Desktop Navbar */}
//         <div className="border-t border-gray-200 hidden md:block">
//           <NavBar onLinkClick={handleLinkClick} />
//         </div>

//         {/* Mobile Drawer */}
//         <Drawer
//           anchor="right"
//           open={drawerOpen}
//           onClose={() => setDrawerOpen(false)}
//         >
//           <div className="w-64 h-full flex flex-col justify-between bg-white">
//             <div className="p-5">
//               <NavBar onLinkClick={handleLinkClick} mobile />
//             </div>

//             <div className="border-t p-5 flex justify-around text-[#CEBB98]">
//               <Link to="/wishlist" onClick={handleLinkClick}>
//                 <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
//                   <FaHeart className="text-xl" />
//                   <span className="text-xs">Wishlist</span>
//                 </div>
//               </Link>
//               <Link to="/cart" onClick={handleLinkClick}>
//                 <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
//                   <FaShoppingCart className="text-xl" />
//                   <span className="text-xs">Cart</span>
//                 </div>
//               </Link>
//             </div>
//           </div>
//         </Drawer>
//       </header>

//       <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
//     </>
//   );
// };

// export default Header;

// import React, { useState, useRef, useEffect } from "react";
// import {
//   FaHeart,
//   FaShoppingCart,
//   FaSearch,
//   FaUser,
//   FaBars,
// } from "react-icons/fa";
// import { Drawer } from "@mui/material";
// import Logo from "../Logo/Logo";
// import NavBar from "../NavBar/NavBar";
// import { Link, useNavigate } from "react-router-dom";
// import SearchOverlay from "../SearchOverlay/SearchOverlay";

// const Header = () => {
//   const [accountOpen, setAccountOpen] = useState(false);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(true);

//   const [searchOpen, setSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState(""); // controlled search

//   const accountRef = useRef(null);
//   const searchRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handler = (e) => {
//       if (accountRef.current && !accountRef.current.contains(e.target)) {
//         setAccountOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const handleLinkClick = () => {
//     setDrawerOpen(false);
//     setAccountOpen(false);
//   };

//   return (
//     <>
//       <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto flex items-center justify-between px-3 py-2">

//           {/* Left: Logo */}
//           <div className="flex items-center">
//             <Link to="/" className="block w-20 md:w-auto">
//               <Logo />
//             </Link>
//           </div>

//           {/* Search Bar */}
//           <div className="flex flex-1 justify-center px-2 md:px-4 relative" ref={searchRef}>
//             <div
//               className="flex items-center w-full
//                 max-w-[140px] h-7
//                 sm:max-w-[200px] sm:h-8
//                 md:max-w-md md:h-10
//                 lg:max-w-xl lg:h-12
//                 border border-yellow-700 rounded-lg
//                 overflow-hidden bg-white cursor-text"
//             >
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onFocus={() => setSearchOpen(true)}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setSearchOpen(true);
//                 }}
//                 placeholder="Search..."
//                 className="flex-grow outline-none text-yellow-700 placeholder-[#CEBB98]
//                            text-[11px] sm:text-xs md:text-sm lg:text-base px-2"
//               />
//               <button
//                 className="flex items-center justify-center px-2
//                            text-yellow-700 hover:text-yellow-900 transition-colors
//                            bg-transparent border-none"
//               >
//                 <FaSearch className="text-xs sm:text-sm md:text-base" />
//               </button>
//             </div>

//             {/* Search Dropdown Overlay */}
//             <SearchOverlay
//               open={searchOpen}
//               onClose={() => setSearchOpen(false)}
//               anchorRef={searchRef}
//               query={searchQuery}
//               setQuery={setSearchQuery}
//             />
//           </div>

//           {/* Right: Account + Drawer */}
//           <div className="flex items-center space-x-4 text-[#CEBB98]">
//             <div className="hidden md:flex items-center space-x-5">
//               <Link to="/wishlist">
//                 <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
//                   <FaHeart className="text-xl" />
//                   <span className="hidden sm:block text-xs">Wishlist</span>
//                 </div>
//               </Link>
//               <Link to="/cart">
//                 <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
//                   <FaShoppingCart className="text-xl" />
//                   <span className="hidden sm:block text-xs">Cart</span>
//                 </div>
//               </Link>
//             </div>

//             {/* Account */}
//             <div
//               className="flex flex-col items-center cursor-pointer relative"
//               ref={accountRef}
//             >
//               <div
//                 onClick={() => {
//                   if (!isAuthenticated) {
//                     navigate("/auth");
//                   } else {
//                     setAccountOpen(!accountOpen);
//                   }
//                 }}
//                 className="flex flex-col items-center hover:text-black transition-colors"
//               >
//                 <FaUser className="text-lg md:text-xl" />
//                 <span className="hidden sm:block text-xs">Account</span>
//               </div>

//               {isAuthenticated && accountOpen && (
//                 <div className="absolute top-12 right-0 w-64 bg-white border shadow-lg rounded-md p-4 z-20 animate-fadeIn">
//                   <p className="font-medium text-[#CEBB98] mb-3">
//                     Welcome To Everglow Jewels!
//                   </p>
//                   <ul className="space-y-3 text-[#c0a87a]">
//                     <Link to="/profile" onClick={handleLinkClick}>
//                       <li className="hover:text-yellow-700 mb-2">Your Profile</li>
//                     </Link>
//                     <Link to="/myorder" onClick={handleLinkClick}>
//                       <li className="hover:text-yellow-700 mb-2">My Orders</li>
//                     </Link>
//                     <Link to="/terms" onClick={handleLinkClick}>
//                       <li className="hover:text-yellow-700 mb-2">
//                         Terms & Conditions
//                       </li>
//                     </Link>
//                     <Link to="/privacy" onClick={handleLinkClick}>
//                       <li className="hover:text-yellow-700 mb-2">Privacy Policy</li>
//                     </Link>
//                     <Link to="/contact" onClick={handleLinkClick}>
//                       <li className="hover:text-yellow-700 mb-2">Contact Us</li>
//                     </Link>
//                     <li
//                       onClick={() => {
//                         setIsAuthenticated(false);
//                         handleLinkClick();
//                       }}
//                       className="hover:text-red-600 mb-2 cursor-pointer"
//                     >
//                       Logout
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>

//             {/* Drawer Button */}
//             <button
//               className="text-xl md:hidden"
//               onClick={() => setDrawerOpen(true)}
//             >
//               <FaBars />
//             </button>
//           </div>
//         </div>

//         {/* Desktop Navbar */}
//         <div className="border-t border-gray-200 hidden md:block">
//           <NavBar onLinkClick={handleLinkClick} />
//         </div>

//         {/* Mobile Drawer */}
//         <Drawer
//           anchor="right"
//           open={drawerOpen}
//           onClose={() => setDrawerOpen(false)}
//         >
//           <div className="w-64 h-full flex flex-col justify-between bg-white">
//             <div className="p-5">
//               <NavBar onLinkClick={handleLinkClick} mobile />
//             </div>

//             <div className="border-t p-5 flex justify-around text-[#CEBB98]">
//               <Link to="/wishlist" onClick={handleLinkClick}>
//                 <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
//                   <FaHeart className="text-xl" />
//                   <span className="text-xs">Wishlist</span>
//                 </div>
//               </Link>
//               <Link to="/cart" onClick={handleLinkClick}>
//                 <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
//                   <FaShoppingCart className="text-xl" />
//                   <span className="text-xs">Cart</span>
//                 </div>
//               </Link>
//             </div>
//           </div>
//         </Drawer>
//       </header>
//     </>
//   );
// };

// export default Header;

// import React, { useState, useRef, useEffect } from "react";
// import {
//   FaHeart,
//   FaShoppingCart,
//   FaSearch,
//   FaUser,
//   FaBars,
// } from "react-icons/fa";
// import { Drawer } from "@mui/material";
// import Logo from "../Logo/Logo";
// import NavBar from "../NavBar/NavBar";
// import { Link, useNavigate } from "react-router-dom";
// import SearchOverlay from "../SearchOverlay/SearchOverlay";
// import { logout } from "../../utils/auth";
// import { useCart } from "../../context/cartContext";

// const Header = () => {
//   const [accountOpen, setAccountOpen] = useState(false);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(true);

//   const [searchOpen, setSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState(""); // controlled search

//   const accountRef = useRef(null);
//   const searchRef = useRef(null);
//   const { count, wishCount, clear, clearWishlist } = useCart();
//   const navigate = useNavigate();

//   // dummy counts (backend se laa sakte ho)
//   const wishlistCount = 2;
//   const cartCount = 3;

//   useEffect(() => {
//     const handler = (e) => {
//       if (accountRef.current && !accountRef.current.contains(e.target)) {
//         setAccountOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     const onAuth = () => setIsAuthenticated(!!localStorage.getItem("token"));
//     window.addEventListener("auth-change", onAuth);
//     window.addEventListener("storage", onAuth); // cross-tab
//     return () => {
//       document.removeEventListener("mousedown", handler);
//       window.removeEventListener("auth-change", onAuth);
//       window.removeEventListener("storage", onAuth);
//     };
//   }, []);

//   const handleLinkClick = () => {
//     setDrawerOpen(false);
//     setAccountOpen(false);
//   };

//   return (
//     <>
//       <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto flex items-center justify-between px-3 py-2">
//           {/* Left: Logo */}
//           <div className="flex items-center">
//             <Link to="/" className="block w-20 md:w-auto">
//               <Logo />
//             </Link>
//           </div>

//           {/* Search Bar */}
//           <div
//             className="flex flex-1 justify-center px-2 md:px-4 relative"
//             ref={searchRef}
//           >
//             <div
//               className="flex items-center w-full
//                 max-w-[140px] h-7
//                 sm:max-w-[200px] sm:h-8
//                 md:max-w-md md:h-10
//                 lg:max-w-xl lg:h-12
//                 border border-black rounded-lg
//                 overflow-hidden bg-white cursor-text"
//             >
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onFocus={() => setSearchOpen(true)}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setSearchOpen(true);
//                 }}
//                 placeholder="Search..."
//                 className="flex-grow outline-none text-black placeholder-[#CEBB98]
//                            text-[11px] sm:text-xs md:text-sm lg:text-base px-2"
//               />
//               <button
//                 className="flex items-center justify-center px-2
//                            text-black hover:text-yellow-900 transition-colors
//                            bg-transparent border-none"
//               >
//                 <FaSearch className="text-xs sm:text-sm md:text-base" />
//               </button>
//             </div>

//             {/* Search Dropdown Overlay */}
//             <SearchOverlay
//               open={searchOpen}
//               onClose={() => setSearchOpen(false)}
//               anchorRef={searchRef}
//               query={searchQuery}
//               setQuery={setSearchQuery}
//             />
//           </div>

//           {/* Right: Account + Drawer */}
//           <div className="flex items-center space-x-4 text-[#CEBB98]">
//             <div className="hidden md:flex items-center space-x-5">
//               {/* Wishlist with Badge */}
//               <Link to="/wishlist" className="relative">
//                 <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
//                   <FaHeart className="text-xl" />
//                   {wishCount > 0 && (
//                     <span className="absolute -top-0 -right-0 bg-yellow-900 text-white text-[10px] px-1.5 rounded-full">
//                       {wishCount}
//                     </span>
//                   )}
//                   <span className="hidden sm:block text-xs text-black">
//                     Wishlist
//                   </span>
//                 </div>
//               </Link>

//               {/* Cart with Badge */}
//               <Link to="/cart" className="relative">
//                 <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
//                   <FaShoppingCart className="text-xl" />
//                   {count > 0 && (
//                     <span className="absolute -top-0 -right-2 bg-yellow-900 text-white text-[10px] px-1.5 rounded-full">
//                       {count}
//                     </span>
//                   )}
//                   <span className="hidden sm:block text-xs text-black">
//                     Cart
//                   </span>
//                 </div>
//               </Link>
//             </div>

//             {/* Account */}
//             <div
//               className="flex flex-col items-center cursor-pointer relative"
//               ref={accountRef}
//             >
//               <div
//                 onClick={() => {
//                   if (!isAuthenticated) {
//                     navigate("/auth");
//                   } else {
//                     setAccountOpen(!accountOpen);
//                   }
//                 }}
//                 className="flex flex-col items-center hover:text-black transition-colors"
//               >
//                 <FaUser className="text-lg md:text-xl" />
//                 <span className="hidden sm:block text-xs text-black">
//                   Account
//                 </span>
//               </div>

//               {isAuthenticated && accountOpen && (
//                 <div className="absolute top-12 right-0 w-64 bg-white border shadow-lg rounded-md p-4 z-20 animate-fadeIn">
//                   <p className="font-medium text-yellow-900 mb-3">
//                     Welcome To Everglow Jewels!
//                   </p>
//                   <ul className="space-y-3 text-black">
//                     <Link to="/profile" onClick={handleLinkClick}>
//                       <li className="hover:text-yellow-700 mb-2">Your Profile</li>
//                     </Link>
//                     <Link to="/myorder" onClick={handleLinkClick}>
//                       <li className="hover:text-yellow-700 mb-2">My Orders</li>
//                     </Link>
//                     <Link to="/terms" onClick={handleLinkClick}>
//                       <li className="hover:text-yellow-700 mb-2">
//                         Terms & Conditions
//                       </li>
//                     </Link>
//                     <Link to="/privacy" onClick={handleLinkClick}>
//                       <li className="hover:text-yellow-700 mb-2">Privacy Policy</li>
//                     </Link>
//                     <Link to="/contact" onClick={handleLinkClick}>
//                       <li className="hover:text-yellow-700 mb-2">Contact Us</li>
//                     </Link>
//                     <li
//                       onClick={() => {
//                         logout();
//                         clearWishlist();
//                         setIsAuthenticated(false);
//                         handleLinkClick();
//                         navigate("/auth");
//                       }}
//                       className="hover:text-red-600 mb-2 cursor-pointer"
//                     >
//                       Logout
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>

//             {/* Drawer Button */}
//             <button
//               className="text-xl md:hidden"
//               onClick={() => setDrawerOpen(true)}
//             >
//               <FaBars />
//             </button>
//           </div>
//         </div>

//         {/* Desktop Navbar */}
//         <div className="border-t border-gray-200 hidden md:block">
//           <NavBar onLinkClick={handleLinkClick} />
//         </div>

//         {/* Mobile Drawer */}
//         <Drawer
//           anchor="right"
//           open={drawerOpen}
//           onClose={() => setDrawerOpen(false)}
//         >
//           <div className="w-64 h-full flex flex-col justify-between bg-white">
//             <div className="p-5">
//               <NavBar onLinkClick={handleLinkClick} mobile />
//             </div>

//             <div className="border-t p-5 flex justify-around text-yellow-900">
//               <Link to="/wishlist" onClick={handleLinkClick} className="relative">
//                 <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
//                   <FaHeart className="text-xl" />
//                   {wishlistCount > 0 && (
//                     <span className="absolute -top-2 -right-3 bg-yellow-900 text-white text-[10px] px-1.5 rounded-full">
//                       {wishlistCount}
//                     </span>
//                   )}
//                   <span className="text-xs text-black">Wishlist</span>
//                 </div>
//               </Link>

//               <Link to="/cart" onClick={handleLinkClick} className="relative">
//                 <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
//                   <FaShoppingCart className="text-xl" />
//                   {cartCount > 0 && (
//                     <span className="absolute -top-2 -right-3 bg-yellow-900 text-white text-[10px] px-1.5 rounded-full">
//                       {cartCount}
//                     </span>
//                   )}
//                   <span className="text-xs text-black">Cart</span>
//                 </div>
//               </Link>
//             </div>
//           </div>
//         </Drawer>
//       </header>
//     </>
//   );
// };

// export default Header;

import React, { useState, useRef, useEffect } from "react";
import {
  FaHeart,
  FaShoppingCart,
  FaSearch,
  FaUser,
  FaBars,
} from "react-icons/fa";
import { Drawer } from "@mui/material";
import Logo from "../Logo/Logo";
import NavBar from "../NavBar/NavBar";
import { Link, useNavigate } from "react-router-dom";
import SearchOverlay from "../SearchOverlay/SearchOverlay";
import { logout } from "../../utils/auth";
import { useCart } from "../../context/cartContext";

const Header = () => {
  const [accountOpen, setAccountOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // controlled search

  const accountRef = useRef(null);
  const searchRef = useRef(null);
  const { count, wishCount, clear, clearWishlist } = useCart();
  const navigate = useNavigate();

  // dummy counts (backend se laa sakte ho)
  const wishlistCount = 2;
  const cartCount = 3;

  useEffect(() => {
    const handler = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);

    const onAuth = () => setIsAuthenticated(!!localStorage.getItem("token"));
    window.addEventListener("auth-change", onAuth);
    window.addEventListener("storage", onAuth); // cross-tab sync

    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("auth-change", onAuth);
      window.removeEventListener("storage", onAuth);
    };
  }, []);

  const handleLinkClick = () => {
    setDrawerOpen(false);
    setAccountOpen(false);
  };


  const handleAccountClick = () => {

    if (!isAuthenticated) {
      // Agar token nahi hai → auth page par redirect
      navigate("/auth");
    } else {
      // Agar login hai → account menu toggle
      setAccountOpen((prev) => !prev);
    }
  };

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 py-2">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/" className="block w-20 md:w-auto">
              <Logo />
            </Link>
          </div>

          {/* Search Bar */}
          <div
            className="flex flex-1 justify-center px-2 md:px-4 relative"
            ref={searchRef}
          >
            <div
              className="flex items-center w-full
                max-w-[140px] h-7
                sm:max-w-[200px] sm:h-8
                md:max-w-md md:h-10
                lg:max-w-xl lg:h-12
                border border-black rounded-lg
                overflow-hidden bg-white cursor-text"
            >
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                placeholder="Search..."
                className="flex-grow outline-none text-black placeholder-[#CEBB98]
                           text-[11px] sm:text-xs md:text-sm lg:text-base px-2"
              />
              <button
                className="flex items-center justify-center px-2
                           text-black hover:text-yellow-900 transition-colors
                           bg-transparent border-none"
              >
                <FaSearch className="text-xs sm:text-sm md:text-base" />
              </button>
            </div>

            {/* Search Dropdown Overlay */}
            <SearchOverlay
              open={searchOpen}
              onClose={() => setSearchOpen(false)}
              anchorRef={searchRef}
              query={searchQuery}
              setQuery={setSearchQuery}
            />
          </div>

          {/* Right: Account + Drawer */}
          <div className="flex items-center space-x-4 text-[#CEBB98]">
            <div className="hidden md:flex items-center space-x-5">
              {/* Wishlist with Badge */}
              <Link to="/wishlist" className="relative">
                <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
                  <FaHeart className="text-xl" />
                  {wishCount > 0 && (
                    <span className="absolute -top-0 -right-0 bg-yellow-900 text-white text-[10px] px-1.5 rounded-full">
                      {wishCount}
                    </span>
                  )}
                  <span className="hidden sm:block text-xs text-black">
                    Wishlist
                  </span>
                </div>
              </Link>
              <Link to="/cart" className="relative">
                <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
                  <FaShoppingCart className="text-xl" />
                  {count > 0 && (
                    <span className="absolute -top-0 -right-2 bg-yellow-900 text-white text-[10px] px-1.5 rounded-full">
                      {count}
                    </span>
                  )}
                  <span className="hidden sm:block text-xs text-black">
                    Cart
                  </span>
                </div>
              </Link>

            </div>

            {/* Account */}
            <div
              className="flex flex-col items-center cursor-pointer relative"
              ref={accountRef}
            >
              <div
                onClick={handleAccountClick}
                className="flex flex-col items-center hover:text-black transition-colors"
              >
                <FaUser className="text-lg md:text-xl" />
                <span className="hidden sm:block text-xs text-black">
                  Account
                </span>
              </div>

              {/* Account Dropdown */}
              {isAuthenticated && accountOpen && (
                <div className="absolute top-12 right-0 w-64 bg-white border shadow-lg rounded-md p-4 z-20 animate-fadeIn">
                  <p className="font-medium text-yellow-900 mb-3">
                    Welcome To SPARKLE & SHINE Jewels!
                  </p>
                  <ul className="space-y-3 text-black">
                    <Link to="/profile" onClick={handleLinkClick}>
                      <li className="hover:text-yellow-700 mb-2">Your Profile</li>
                    </Link>
                    <Link to="/myorder" onClick={handleLinkClick}>
                      <li className="hover:text-yellow-700 mb-2">My Orders</li>
                    </Link>
                    <Link to="/terms" onClick={handleLinkClick}>
                      <li className="hover:text-yellow-700 mb-2">
                        Terms & Conditions
                      </li>
                    </Link>
                    <Link to="/privacy" onClick={handleLinkClick}>
                      <li className="hover:text-yellow-700 mb-2">
                        Privacy Policy
                      </li>
                    </Link>
                    <Link to="/contact" onClick={handleLinkClick}>
                      <li className="hover:text-yellow-700 mb-2">Contact Us</li>
                    </Link>
                    <li
                      onClick={() => {
                        logout();
                        clearWishlist();
                        setIsAuthenticated(false);
                        handleLinkClick();
                        navigate("/auth");
                      }}
                      className="hover:text-red-600 mb-2 cursor-pointer"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Drawer Button */}
            <button
              className="text-xl md:hidden"
              onClick={() => setDrawerOpen(true)}
            >
              <FaBars />
            </button>
          </div>
        </div>

        {/* Desktop Navbar */}
        <div className="border-t border-gray-200 hidden md:block">
          <NavBar onLinkClick={handleLinkClick} />
        </div>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <div className="w-64 h-full flex flex-col justify-between bg-white">
            <div className="p-5">
              <NavBar onLinkClick={handleLinkClick} mobile />
            </div>

            <div className="border-t p-5 flex justify-around text-yellow-900">
              <Link to="/wishlist" className="relative">
                <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
                  <FaHeart className="text-xl" />
                  {wishCount > 0 && (


                    <span className="absolute -top-1 -right-3 bg-yellow-900 text-white text-[10px] px-1.5 rounded-full">

                      {wishCount}
                    </span>
                  )}
                  <span className="hidden sm:block text-xs text-black">
                    Wishlist
                  </span>
                </div>
              </Link>
             <Link to="/cart" className="relative">
                <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors">
                  <FaShoppingCart className="text-xl" />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-3 bg-yellow-900 text-white text-[10px] px-1.5 rounded-full">
                      {count}
                    </span>
                  )}
                  <span className="hidden sm:block text-xs text-black">
                    Cart
                  </span>
                </div>
              </Link>



            </div>
          </div>
        </Drawer>
      </header>
    </>
  );
};

export default Header;
