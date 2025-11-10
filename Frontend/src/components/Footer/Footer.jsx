
// import {
//   FaInstagram,
//   FaWhatsapp,
//   FaFacebookF,
//   FaLinkedinIn,
//   FaPinterestP,
// } from "react-icons/fa";
// import { IoIosArrowForward } from "react-icons/io";
// import bgurl from "../../assets/bgurl.png";
// import logoUrl from "../../assets/EverGlow2.png";

// export default function Footer() {
//   return (
//     <footer
//       className="text-black py-8 sm:py-10 px-4 sm:px-6 bg-cover bg-center text-1xl sm:text-1xl md:text-1xl lg:text-1xl"
//       style={{ backgroundImage: `url(${bgurl})` }}
//     >
//       {/* Main Grid */}
//       <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 text-center md:text-left">

//         {/* 1. About + Logo + Social */}
// <div className="flex flex-col items-center md:items-start">
//   <div className="w-[190px] h-[80px] flex items-center justify-center">
//     <img
//       src={logoUrl}
//       alt="EverGlow Logo"
//       className="w-[250%] h-[300%] object-contain bg-transparent mix-blend-normal"
//     />
//   </div>
//   <p className="text-1xl sm:text-1xl leading-relaxed mb-3 max-w-[220px]">
//     At  we believe that Jewellery is more than adornment.
//     Founded in 2023, our passion for quality drives us to create unique
//     pieces.
//   </p>
//   <div className="flex justify-center md:justify-start gap-3 text-base sm:text-lg">
//     {[FaInstagram, FaWhatsapp, FaFacebookF, FaLinkedinIn, FaPinterestP].map(
//       (Icon, i) => (
//         <Icon
//           key={i}
//           className="cursor-pointer hover:text-white transition-colors"
//         />
//       )
//     )}
//   </div>
// </div>

//         {/* 2. Policies */}
//         <div>
//           <h3 className="font-serif text-sm sm:text-base mb-2 border-b border-white/40 pb-1">
//             POLICIES
//           </h3>
//           <ul className="space-y-1">
//             {[
//              { label: "Exchange & Buy Back Policy", href: "/exchange-policy" },
//               { label: "Shipping Policy", href: "/shipping-policy" },
//               { label: "Privacy Policy", href: "/privacy" },
//               { label: "Terms and Conditions", href: "/terms" },
//             ].map((item, i) => (
//               <li
//                 key={i}
//                 className="hover:underline cursor-pointer hover:text-white transition"
//               >
//                  <a
//                   href={item.href}
//                   className="hover:underline cursor-pointer hover:text-white transition"
//                 >
//                   {item.label}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* 3. Categories */}
//         <div>
//           <h3 className="font-serif text-sm sm:text-base mb-2 border-b border-white/40 pb-1">
//             CATEGORIES
//           </h3>
//           <ul className="space-y-1">
//             {
//             [
//               { label: "Rings", href: "/rings" },
//               { label: "Earrings", href: "/earrings" },
//               { label: "Bracelets", href: "/bracelet" },
//               { label: "Pendants", href: "/pendantset" },
//               { label: "necklace", href: "/necklace" },
//             ].map(
//               (item, i) => (
//                 <li
//                   key={i}
//                   className="hover:underline cursor-pointer hover:text-white transition"
//                 >
//                  <a
//                   href={item.href}
//                   className="hover:underline cursor-pointer hover:text-white transition"
//                 >
//                   {item.label}
//                 </a>
//                 </li>
//               )
//             )}
//           </ul>
//         </div>

//         {/* 4. Our Company */}
//         <div>
//           <h3 className="font-serif text-sm sm:text-base mb-2 border-b border-white/40 pb-1">
//             OUR COMPANY
//           </h3>
//           <ul className="space-y-1">
//             {[
//               "Custom Jewellery",
//               "About Us",
//               "About Lab Diamonds",
//               "Ring Size Guide",
//               "FAQs",
//               "Blogs",
//               "Store Locator",
//               "Contact Us",
//             ].map((item, i) => (
//               <li
//                 key={i}
//                 className="hover:underline cursor-pointer hover:text-white transition"
//               >
//                 {item}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* 5. Newsletter */}
//         <div className="flex flex-col items-center md:items-start">
//           <h3 className="uppercase text-[10px] sm:text-xs tracking-widest mb-1">Newsletter</h3>
//           <h2 className="text-2xl sm:text-2xl md:text-3xl font-serif mb-4 text-nowrap">Join Today</h2>

//           <form className="flex items-center w-full max-w-[220px] sm:max-w-xs border border-black rounded-full overflow-hidden">
//             <input
//               type="email"
//               placeholder="Enter your Email"
//               className="bg-transparent flex-1 px-3 py-2 text-[11px] sm:text-xs placeholder-white outline-none"
//             />
//             <button
//               type="submit"
//               className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 mr-1 m-1 rounded-full bg-black text-white  hover:text-white transition"
//             >
//               <IoIosArrowForward size={16} />
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* Bottom Copyright */}
//       <div className="mt-8 border-t border-white/40 pt-3 text-center text-[10px] sm:text-xs">
//         © {new Date().getFullYear()} EverGlow. All Rights Reserved.
//       </div>
//     </footer>
//   );
// }

// import React, { useState } from "react";
// import {
//   FaInstagram,
//   FaWhatsapp,
//   FaFacebookF,
//   FaLinkedinIn,
//   FaPinterestP,
//   FaYoutube
// } from "react-icons/fa";
// import { IoIosArrowForward, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
// import bgurl from "../../assets/bgurl.png";
// import logoUrl from "../../assets/EVERGLOWLOGO.png";

// export default function Footer() {
//   const [activeIndex, setActiveIndex] = useState(null);

//   const toggleAccordion = (index) => {
//     setActiveIndex(activeIndex === index ? null : index);
//   };

//   const socialLinks = [
//     { icon: FaInstagram, href: "https://www.instagram.com/gemsglobal_official?igsh=bTZ6bm9iaTVrMWFw" },
//     { icon: FaWhatsapp, href: "https://wa.me/7201004243" },
//     { icon: FaFacebookF, href: "https://www.facebook.com/share/1R6EAEVksR/" },
//     { icon: FaYoutube, href: "www.youtube.com/@gemsglobaljewels" },
//     { icon: FaPinterestP, href: "https://in.pinterest.com/gemsglobaljewel" },
//   ];


//   const accordionItems = [
//     {
//       title: "POLICIES",
//       content: [
//         { label: "Exchange & Buy Back Policy", href: "/exchange-policy" },
//         { label: "Shipping Policy", href: "/shipping-policy" },
//         { label: "Privacy Policy", href: "/privacy" },
//         { label: "Terms and Conditions", href: "/terms" },
//       ],
//     },

//     {
//       title: "CATEGORIES",
//       content: [
//         { label: "Rings", href: "/rings" },
//         { label: "Earrings", href: "/earrings" },
//         { label: "Bracelets", href: "/bracelet" },
//         { label: "Pendants", href: "/pendantset" },
//         { label: "Necklace", href: "/necklace" },
//       ],
//     },
//     {
//       title: "OUR COMPANY",
//       content: [
//         { label: "Custom Jewellery", href: "/personalized" },
//         { label: "About Us", href: "/" },
//         { label: "About Lab Diamonds", href: "/" },

//         { label: "Ring Size Guide", href: "/Ring-Guide" },

//         { label: "FAQs", href: "/" },
//         { label: "Blogs", href: "/" },
//         { label: "Contact Us", href: "/contact" },
//       ],
//     },
//   ];

//   return (
//     <footer
//       className="text-black py-10 px-4 sm:px-6 bg-cover bg-center"
//       style={{ backgroundImage: `url(${bgurl})` }}
//     >
//       {/* Desktop / Tablet Grid */}
//       <div className="hidden md:grid max-w-7xl mx-auto grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-10 text-left bg-white">
//         {/* 1. Logo + About */}
//         <div className="flex flex-col items-center md:items-start">
//           <div className="w-[190px] h-[80px] flex items-center justify-center">
//             <img
//               src={logoUrl}
//               alt="EverGlow Logo"
//               className="w-[250%] h-[290%] object-contain bg-transparent mix-blend-normal"
//             />
//           </div>
//          <p className="text-1xl sm:text-1xl leading-relaxed mb-2 mt-2 sm:mb-2 max-w-[220px]"> At we believe that Jewellery is more than adornment. Founded in 2023, our passion for quality drives us to create unique pieces. </p>


//           <div className="flex justify-center mt-3 md:justify-start gap-3 text-base sm:text-lg">
//             <div className="flex justify-center gap-6 text-2xl">
//               {socialLinks.map(({ icon: Icon, href }, i) => (
//                 <a
//                   key={i}
//                   href={href}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="cursor-pointer hover:text-white transition-colors"
//                 >
//                   <Icon />
//                 </a>
//               ))}
//             </div>

//           </div>
//         </div>

//         {/* 2-4 Sections */}
//         {accordionItems.map((section, i) => (
//           <div key={i}>
//             <h3 className="font-serif text-base mb-3 border-b border-black/40 pb-1">
//               {section.title}
//             </h3>
//             <ul className="space-y-1 text-sm">
//               {section.content.map((item, idx) => (
//                 <li
//                   key={idx}
//                   className="hover:underline cursor-pointer hover:text-white transition"
//                 >
//                   <a href={item.href}>{item.label}</a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}

//         {/* 5. Newsletter */}
//         <div>
//           <h3 className="uppercase text-xs tracking-widest mb-1">Newsletter</h3>
//           <h2 className="text-2xl font-serif mb-4">Join Today</h2>
//           <form className="flex items-center border border-black rounded-full overflow-hidden max-w-xs">
//             <input
//               type="email"
//               placeholder="Enter your Email"
//               className="bg-transparent flex-1 px-3 py-2 text-xs placeholder-black outline-none"
//             />
//             <button
//               type="submit"
//               className="flex items-center justify-center w-9 h-9 m-1 rounded-full bg-black text-white"
//             >
//               <IoIosArrowForward size={16} />
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* Mobile Accordion */}
//       <div className="md:hidden max-w-lg mx-auto">
//         {/* Logo + Social */}
//         <div className="flex flex-col items-center mb-8">
//           <div className="w-[190px] h-[80px] flex items-center justify-center">
//             <img
//               src={logoUrl}
//               alt="EverGlow Logo"
//               className="w-[250%] h-[300%] object-contain bg-transparent mix-blend-normal"
//             />
//           </div>
//           <p className="text-sm text-center mb-4 leading-relaxed mt-4 text-black/80">
//             At EverGlow we believe that Jewellery is more than adornment.
//           </p>
//           <div className="flex justify-center gap-6 text-2xl">
//             {socialLinks.map(({ icon: Icon, href }, i) => (
//               <a
//                 key={i}
//                 href={href}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="cursor-pointer hover:text-white transition-colors"
//               >
//                 <Icon />
//               </a>
//             ))}
//           </div>
//         </div>


//         {/* Accordion Sections */}
//         {accordionItems.map((section, i) => (
//           <div key={i} className="border-b border-black/30">
//             <button
//               onClick={() => toggleAccordion(i)}
//               className="w-full flex justify-between items-center py-3 text-left font-semibold"
//             >
//               {section.title}
//               {activeIndex === i ? <IoIosArrowUp /> : <IoIosArrowDown />}
//             </button>
//             {activeIndex === i && (
//               <ul className="space-y-1 pb-3 pl-2 text-sm">
//                 {section.content.map((item, idx) => (
//                   <li
//                     key={idx}
//                     className="hover:underline cursor-pointer hover:text-white transition"
//                   >
//                     <a href={item.href}>{item.label}</a>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         ))}

//         {/* Newsletter */}
//         <div className="mt-6">
//           <h3 className="uppercase text-xs tracking-widest mb-1 text-center">
//             Newsletter
//           </h3>
//           <h2 className="text-2xl font-serif mb-4 text-center">Join Today</h2>

//           <form className="flex items-center border border-black rounded-full overflow-hidden max-w-sm mx-auto">
//             <input
//               type="email"
//               placeholder="Enter your Email"
//               className="bg-transparent flex-1 px-3 py-2 text-xs placeholder-black outline-none"
//             />
//             <button
//               type="submit"
//               className="flex items-center justify-center w-9 h-9 m-1 rounded-full bg-black text-white"
//             >
//               <IoIosArrowForward size={16} />
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* Bottom Copyright */}
//       <div className="mt-8 border-t border-black/40 pt-3 text-center text-xs">
//         © {new Date().getFullYear()} GEMS-GLOBAL JEWELS. All Rights Reserved.
//       </div>
//     </footer>
//   );
// }

import React, { useState } from "react";
import {
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
  FaLinkedinIn,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import bgurl from "../../assets/bgurl.png";
import logoUrl from "../../assets/EVERGLOWLOGO.png";

export default function Footer() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const socialLinks = [
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/gemsglobal_official?igsh=bTZ6bm9iaTVrMWFw",
    },
    { icon: FaWhatsapp, href: "https://wa.me/7201004243" },
    { icon: FaFacebookF, href: "https://www.facebook.com/share/1R6EAEVksR/" },
    { icon: FaYoutube, href: "https://www.youtube.com/@gemsglobaljewels" },
    { icon: FaPinterestP, href: "https://in.pinterest.com/gemsglobaljewel" },
    { icon: FaLinkedinIn, href: "https://www.linkedin.com/company/gemsglobal" },
  ];

  const accordionItems = [
    {
      title: "POLICIES",
      content: [
        { label: "Exchange & Buy Back Policy", href: "/exchange-policy" },
        { label: "Shipping Policy", href: "/shipping-policy" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms and Conditions", href: "/terms" },
      ],
    },
    {
      title: "CATEGORIES",
      content: [
        { label: "Rings", href: "/rings" },
        { label: "Earrings", href: "/earrings" },
        { label: "Bracelets", href: "/bracelet" },
        { label: "Pendants", href: "/pendantset" },
        { label: "Necklaces", href: "/necklace" },
      ],
    },
    {
      title: "OUR COMPANY",
      content: [
        { label: "Custom Jewellery", href: "/personalized" },
        { label: "About Us", href: "/about" },
        { label: "About Lab Diamonds", href: "/lab-diamonds" },
        { label: "Ring Size Guide", href: "/ring-guide" },
        { label: "FAQs", href: "/faqs" },
        { label: "Blogs", href: "/blog" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
  ];

  return (
    <footer
      className="text-black py-10 px-4 sm:px-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgurl})` }}
    >
      {/* Desktop / Tablet Grid */}
      <div className="hidden md:grid max-w-10xl mx-auto grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-10 text-left bg-white rounded-lg shadow-md p-8">
        {/* Logo + About */}
        <div>
          <img
            src={logoUrl}
            alt="EverGlow Logo"
            className="w-[180px] object-contain mb-4"
          />
          <p className="text-sm text-gray-700 leading-relaxed mb-4 max-w-xs">
                       At we believe that Jewellery is more than adornment. Founded in 2025, our passion for quality drives us to create unique pieces.

          </p>
          <div className="flex gap-4 text-xl text-gray-700">
            {socialLinks.map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-700 transition-colors"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Accordion Sections */}
        {accordionItems.map((section, i) => (
          <div key={i}>
            <h3 className="font-semibold text-base mb-3 border-b border-black/20 pb-1">
              {section.title}
            </h3>
            <ul className="space-y-1 text-sm">
              {section.content.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    className="hover:underline hover:text-yellow-700 transition"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter */}
        <div>
          <h3 className="uppercase text-xs tracking-widest mb-1">Newsletter</h3>
          <h2 className="text-2xl font-serif mb-4">Join Today</h2>
          <form className="flex items-center border border-gray-400 rounded-full overflow-hidden max-w-xs">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent flex-1 px-3 py-2 text-sm placeholder-gray-500 outline-none"
            />
            <button
              type="submit"
              className="flex items-center justify-center w-9 h-9 m-1 rounded-full bg-black text-white hover:bg-gray-800"
            >
              <IoIosArrowForward size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Accordion */}
      <div className="md:hidden max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-8">
          <img
            src={logoUrl}
            alt="EverGlow Logo"
            className="w-[150px] object-contain mb-4"
          />
          <p className="text-sm text-center text-gray-700 mb-4">
            At we believe that Jewellery is more than adornment. Founded in 2025, our passion for quality drives us to create unique pieces.
          </p>
          <div className="flex gap-5 text-xl">
            {socialLinks.map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-700 transition-colors"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Accordion Sections */}
        {accordionItems.map((section, i) => (
          <div key={i} className="border-b border-black/20">
            <button
              onClick={() => toggleAccordion(i)}
              className="w-full flex justify-between items-center py-3 text-left font-medium"
            >
              {section.title}
              {activeIndex === i ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
            {activeIndex === i && (
              <ul className="space-y-1 pb-3 pl-2 text-sm">
                {section.content.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.href}
                      className="hover:underline hover:text-yellow-700 transition"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Newsletter */}
        <div className="mt-6 text-center">
          <h3 className="uppercase text-xs tracking-widest mb-1">Newsletter</h3>
          <h2 className="text-2xl font-serif mb-4">Join Today</h2>
          <form className="flex items-center border border-gray-400 rounded-full overflow-hidden max-w-sm mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent flex-1 px-3 py-2 text-sm placeholder-gray-500 outline-none"
            />
            <button
              type="submit"
              className="flex items-center justify-center w-9 h-9 m-1 rounded-full bg-black text-white hover:bg-gray-800"
            >
              <IoIosArrowForward size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-8 border-t border-black/20 pt-3 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} SPARKLE & SHINE. All Rights Reserved.
      </div>
    </footer>
  );
}
