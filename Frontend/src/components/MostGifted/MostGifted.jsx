// import React from "react";
// import earringImg from "../../assets/earrings1.png";
// import necklaceImg from "../../assets/necklace1.png";
// import ringImg from "../../assets/weddingRing1.png";

// const MostGifted = () => {
//   return (
//     <section className="w-full py-16 px-6 md:px-20 bg-white">
//       {/* Title */}
//       <h2 className="text-center text-[42px] font-bold text-[#CEBB98] mb-14 uppercase">
//         MOST GIFTED
//       </h2>

//       {/* Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
//         {/* Left Top Image */}
//         <div>
//           <img
//             src={earringImg}
//             alt="Elegant Earrings"
//             className="w-full object-cover"
//           />
//         </div>

//         {/* Right Top Text */}
//         <div className="flex flex-col justify-center">
//           <p className="text-sm text-gray-500 uppercase">Timeless Beauty</p>
//           <h3 className="mt-2 text-[24px] font-semibold text-[#CEBB98] uppercase">
//             Elegant Earrings
//           </h3>
//           <p className="mt-3 text-gray-600 text-[15px] leading-relaxed">
//             Discover our exquisite collection of elegant earrings.
//           </p>
//           <a
//             href="#"
//             className="mt-4 text-sm text-[#CEBB98] underline"
//           >
//             Discover more
//           </a>
//         </div>

//         {/* Left Middle Text */}
//         <div className="flex flex-col justify-center">
//           <p className="text-sm text-gray-500 uppercase">New Collection</p>
//           <h3 className="mt-2 text-[24px] font-semibold text-[#CEBB98] uppercase">
//             Wedding Rings
//           </h3>
//           <p className="mt-3 text-gray-600 text-[15px] leading-relaxed">
//             Celebrate your love with our stunning collection.
//           </p>
//           <a
//             href="#"
//             className="mt-4 text-sm text-[#CEBB98] underline"
//           >
//             Discover more
//           </a>
//         </div>

//         {/* Right Middle Image */}
//         <div>
//           <img
//             src={ringImg}
//             alt="Wedding Rings"
//             className="w-full object-cover"
//           />
//         </div>

//         {/* Left Bottom Image */}
//         <div>
//           <img
//             src={necklaceImg}
//             alt="Luxury Necklace"
//             className="w-full object-cover"
//           />
//         </div>

//         {/* Right Bottom Text */}
//         <div className="flex flex-col justify-center">
//           <p className="text-sm text-gray-500 uppercase">Modern Charm</p>
//           <h3 className="mt-2 text-[24px] font-semibold text-[#CEBB98] uppercase">
//             Luxury Necklace
//           </h3>
//           <p className="mt-3 text-gray-600 text-[15px] leading-relaxed">
//             Elevate your elegance with our luxurious necklaces.
//           </p>
//           <a
//             href="#"
//             className="mt-4 text-sm text-[#CEBB98] underline"
//           >
//             Discover more
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default MostGifted;



// import React from 'react';

// // --- Component Definition ---
// // This version uses a more specific grid layout to match the user's image exactly.
// // All images are now set to a uniform height to create a balanced look.

// // Helper component for the text blocks to avoid repetition.
// const GiftTextCard = ({ preHeading, heading, description, className = '' }) => (
//   <div className={`flex flex-col text-center md:text-left p-6 ${className}`}>
//     <p className="text-xs font-medium tracking-wider uppercase text-gray-400 mb-2">
//       {preHeading}
//     </p>
//     <h3 style={{fontFamily: "'Playfair Display', serif"}} className="text-3xl lg:text-4xl text-[#4B2A4B] font-semibold mb-4">
//       {heading}
//     </h3>
//     <p className="text-base text-gray-600 leading-relaxed mb-5">
//       {description}
//     </p>
//     <a href="#" className="text-sm text-[#4B2A4B] font-medium underline hover:no-underline transition-colors">
//       Discover more
//     </a>
//   </div>
// );

// // Main App component that renders the section
// export default function MostGifted() {
//   // Image URLs - replace these with your actual product images
//   const images = {
//     earrings: 'https://i.ibb.co/6P68Q1W/earrings.jpg',
//     necklace: 'https://i.ibb.co/3s8sXbN/necklace.jpg',
//     ring: 'https://i.ibb.co/3k5fS4c/ring.jpg',
//   };

//   return (
//     <div style={{fontFamily: "'Montserrat', sans-serif"}} className="bg-white">
//       <section className="py-16 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-5xl mx-auto">
//           {/* Section Title */}
//           <h2 
//             style={{fontFamily: "'Playfair Display', serif"}} 
//             className="text-center text-[#4B2A4B] text-3xl sm:text-4xl font-semibold tracking-widest mb-12"
//           >
//             MOST GIFTED
//           </h2>

//           {/* Responsive Grid Layout to match the image */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

//             {/* --- Left Column --- */}
//             <div className="flex flex-col gap-8">
//               {/* Block 1: Earrings (Image + Text) */}
//               <div className="flex flex-col sm:flex-row items-center">
//                 {/* Image container with fixed height */}
//                 <div className="w-full sm:w-1/2 h-72">
//                     <img src={images.earrings} alt="Elegant diamond earrings" className="w-full h-full object-cover" />
//                 </div>
//                 <div className="w-full sm:w-1/2">
//                     <GiftTextCard
//                       preHeading="Timeless Beauty"
//                       heading="Elegant Earrings"
//                       description="Discover our exquisite collection of elegant earrings."
//                     />
//                 </div>
//               </div>

//               {/* Block 2: Wedding Rings (Text Only) */}
//               <div className="flex items-end">
//                 <GiftTextCard
//                     preHeading="New Collection"
//                     heading="Wedding Rings"
//                     description="Celebrate your love with our stunning collection discover more."
//                 />
//               </div>
//             </div>

//             {/* --- Right Column --- */}
//             <div className="flex flex-col gap-8">
//                 {/* Block 3: Necklace (Image only) */}
//                 {/* Image container with fixed height */}
//                 <div className="h-72">
//                     <img src={images.necklace} alt="Luxury diamond necklace" className="w-full h-full object-cover" />
//                 </div>

//                 {/* Block 4: Ring and Necklace Text */}
//                 <div className="flex flex-col sm:flex-row items-center">
//                     {/* Image container with fixed height */}
//                     <div className="w-full sm:w-1/2 h-72">
//                         <img src={images.ring} alt="Modern two-stone diamond ring" className="w-full h-full object-cover" />
//                     </div>
//                     <div className="w-full sm:w-1/2">
//                         <GiftTextCard
//                           preHeading="Modern Charm"
//                           heading="Luxury Necklace"
//                           description="Elevate your elegance with our luxurious necklaces."
//                         />
//                     </div>
//                 </div>
//             </div>

//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }


// import React from "react";
// import earringImg from "../../assets/earrings1.png";
// import necklaceImg from "../../assets/necklace1.png";
// import ringImg from "../../assets/weddingRing1.png";

// /** Reusable text block */
// const GiftTextCard = ({ preHeading, heading, description }) => (
//   <div className="flex flex-col justify-center p-4 sm:p-6 text-center md:text-left">
//     <p className="uppercase text-xs tracking-widest text-gray-500 mb-2">
//       {preHeading}
//     </p>
//     <h3
//       style={{ fontFamily: "'Playfair Display', serif" }}
//       className="text-[26px] sm:text-[30px] lg:text-[34px] leading-tight font-semibold text-[#4B2A4B] mb-3"
//     >
//       {heading}
//     </h3>
//     <p className="text-[15px] sm:text-base text-gray-600 leading-relaxed mb-4">
//       {description}
//     </p>
//     <a
//       href="#"
//       className="text-sm text-[#4B2A4B] underline underline-offset-4 hover:no-underline"
//     >
//       Discover more
//     </a>
//   </div>
// );

// const MostGifted = () => {
//   return (
//     <section
//       aria-labelledby="most-gifted-title"
//       className="bg-white py-12 sm:py-16"
//       style={{ fontFamily: "'Montserrat', sans-serif" }}
//     >
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Title */}
//         <h2
//           id="most-gifted-title"
//           style={{ fontFamily: "'Playfair Display', serif" }}
//           className="text-center text-[#4B2A4B] tracking-[0.2em] text-3xl sm:text-4xl font-bold mb-10 sm:mb-14"
//         >
//           MOST GIFTED
//         </h2>
//         <div className="w-[939px] [633px] mx-auto">
//         {/* ===== Row 1: Image | Text | Image ===== */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-12">
//           {/* Left Image */}
//           <figure className="w-full">
//             <img
//               src={earringImg}
//               alt="Elegant diamond earrings"
//               loading="lazy"
//               decoding="async"
//               sizes="(max-width: 768px) 100vw, 33vw"
//               className="w-full aspect-[4/3] object-cover rounded"
//             />
//           </figure>

//           {/* Center Text */}
//           <GiftTextCard
//             preHeading="Timeless Beauty"
//             heading="Elegant Earrings"
//             description="Discover our exquisite collection of elegant earrings."
//           />

//           {/* Right Image */}
//           <figure className="w-full">
//             <img
//               src={necklaceImg}
//               alt="Luxury diamond necklace"
//               loading="lazy"
//               decoding="async"
//               sizes="(max-width: 768px) 100vw, 33vw"
//               className="w-full aspect-[4/3] object-cover rounded"
//             />
//           </figure>
//         </div>

//         {/* ===== Row 2: Text | Image | Text ===== */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8  items-center">
//           {/* Left Text */}
//           <GiftTextCard
//             preHeading="New Collection"
//             heading="Wedding Rings"
//             description="Celebrate your love with our stunning collection discover more."
//           />

//           {/* Center Image */}
//           <figure className="w-full">
//             <img
//               src={ringImg}
//               alt="Modern diamond ring"
//               loading="lazy"
//               decoding="async"
//               sizes="(max-width: 768px) 100vw, 33vw"
//               className="w-full aspect-[4/3] object-cover rounded"
//             />
//           </figure>

//           {/* Right Text */}
//           <GiftTextCard
//             preHeading="Modern Charm"
//             heading="Luxury Necklace"
//             description="Elevate your elegance with our luxurious necklaces."
//           />
//         </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default MostGifted;

import React from "react";
import earringImg from "../../assets/earrings1.png";
import necklaceImg from "../../assets/necklace1.png";
import ringImg from "../../assets/weddingRing1.png";

/** Reusable text block */
const GiftTextCard = ({ preHeading, heading, description, link }) => (
  <div className="flex flex-col justify-center p-4 sm:p-6 text-center md:text-left">
    <p className="uppercase text-xs sm:text-sm tracking-widest text-gray-500 mb-2">
      {preHeading}
    </p>
    <h3
      style={{ fontFamily: "'Playfair Display', serif" }}
      className="text-lg sm:text-2xl lg:text-[34px] leading-tight font-semibold text-black mb-3"
    >
      {heading}
    </h3>
    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
      {description}
    </p>
    <a
      href={link}
      className="text-xs sm:text-sm text-black underline underline-offset-4 hover:no-underline"
    >
      Discover more
    </a>
  </div>
);

const MostGifted = () => {
  return (
    <section
      aria-labelledby="most-gifted-title"
      className="bg-white py-10 sm:py-14 md:py-20"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2
          id="most-gifted-title"
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-center text-black tracking-[0.2em] text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 md:mb-16"
        >
          MOST GIFTED
        </h2>

        {/* ===== Row 1: Image | Text | Image ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center mb-1">
          {/* Left Image */}
          <figure className="w-full">
            <img
              src={ringImg}
              alt="Elegant diamond earrings"
              loading="lazy"
              decoding="async"
              className="w-full aspect-[4/3] object-fit rounded"
            />
          </figure>

          {/* Center Text */}
          <GiftTextCard
            preHeading="Timeless Beauty"
            heading="Elegant Earrings"
            description="Discover our exquisite collection of elegant earrings."
            link="/earrings"
          />

          {/* Right Image */}
          <figure className="w-full">
            <img
              src={earringImg}
              alt="Luxury diamond necklace"
              loading="lazy"
              decoding="async"
              className="w-full aspect-[4/3] object-fit rounded"
            />
          </figure>
        </div>

        {/* ===== Row 2: Text | Image | Text ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center">
          {/* Left Text */}
          <GiftTextCard
            preHeading="New Collection"
            heading="Wedding Rings"
            description="Celebrate your love with our stunning collection discover more."
            link="/rings"
          />

          {/* Center Image */}
          <figure className="w-full">
            <img
              src={necklaceImg}
              alt="Modern diamond ring"
              loading="lazy"
              decoding="async"
              className="w-full aspect-[4/3] object-fit rounded"
            />
          </figure>

          {/* Right Text */}
          <GiftTextCard
            preHeading="Modern Charm"
            heading="Luxury Necklace"
            description="Elevate your elegance with our luxurious necklaces."
            link="/necklace"
          />
        </div>
      </div>
    </section>
  );
};

export default MostGifted;
