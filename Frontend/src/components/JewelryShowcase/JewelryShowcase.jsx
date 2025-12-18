// import React from "react";

// import product1 from "../../assets/productImg.png";
// import product2 from "../../assets/EverglowPost2.png";
// import product3 from "../../assets/EverglowPost3.png";

// import new1 from "../../assets/EverglowPost1.png";
// import new2 from "../../assets/EverglowPost2.png";
// import new3 from "../../assets/EverglowPost3.png";
// import new4 from "../../assets/EverglowPost4.png";

// import PromotionalBanner from "../../assets/productAds0.png";
// import ProductCard from "../ProductCard/ProductCard";

// /* 🔹 DiscoverBlock */
// const DiscoverBlock = ({ title, subtitle, buttonText }) => (
//   <div className="flex flex-col justify-center items-start max-w-[220px]">
//     <p className="text-gray-600 text-sm font-medium">{title}</p>
//     <h3 className="text-lg sm:text-xl md:text-2xl text-gray-900 font-semibold leading-snug my-2 uppercase tracking-wide whitespace-nowrap">
//       {subtitle}
//     </h3>
//     <button className="border border-gray-700 text-gray-800 font-medium py-2 px-6 mt-4 text-sm uppercase tracking-wide rounded-lg transition-colors hover:bg-gray-900 hover:text-white">
//       {buttonText}
//     </button>
//   </div>
// );

// const JewelryShowcase = () => {
//   const products = [
//     {
//       id: 1,
//       title: "Brilliant Round cut Everglow jewels",
//       oldPrice: "₹3299",
//       price: "₹2699",
//       image: product1,
//       hoverImg: product2, // 🔹 Add hover image
//       discount: "10%",
//     },
//     {
//       id: 2,
//       title: "Elegant Gold Necklace",
//       oldPrice: "₹4999",
//       price: "₹4599",
//       image: product2,
//       hoverImg: product3, // 🔹 Add hover image
//       discount: "10%",
//     },
//     {
//       id: 3,
//       title: "Classic Diamond Ring",
//       oldPrice: "₹5999",
//       price: "₹5599",
//       image: product3,
//       hoverImg: product1,
//       discount: "10%",
//     },
//     {
//       id: 4,
//       title: "Brilliant Round cut Everglow jewels",
//       oldPrice: "₹3299",
//       price: "₹2699",
//       image: product1,
//       hoverImg: product2, // 🔹 Add hover image
//       discount: "10%",
//     },
//     {
//       id: 5,
//       title: "Elegant Gold Necklace",
//       oldPrice: "₹4999",
//       price: "₹4599",
//       image: product2,
//       hoverImg: product3, // 🔹 Add hover image
//       discount: "10%",
//     },
//     {
//       id: 6,
//       title: "Classic Diamond Ring",
//       oldPrice: "₹5999",
//       price: "₹5599",
//       image: product3,
//       hoverImg: product1,
//       discount: "10%",
//     },
//     {
//       id: 7,
//       title: "Brilliant Round cut Everglow jewels",
//       oldPrice: "₹3299",
//       price: "₹2699",
//       image: product1,
//       hoverImg: product2, // 🔹 Add hover image
//       discount: "10%",
//     },
//     {
//       id: 8,
//       title: "Elegant Gold Necklace",
//       oldPrice: "₹4999",
//       price: "₹4599",
//       image: product2,
//       hoverImg: product3, // 🔹 Add hover image
//       discount: "10%",
//     },
//     {
//       id: 9,
//       title: "Classic Diamond Ring",
//       oldPrice: "₹5999",
//       price: "₹5599",
//       image: product3,
//       hoverImg: product1,
//       discount: "10%",
//     },
//     {
//       id: 10,
//       title: "Brilliant Round cut Everglow jewels",
//       oldPrice: "₹3299",
//       price: "₹2699",
//       image: product1,
//       hoverImg: product2, // 🔹 Add hover image
//       discount: "10%",
//     },
//     {
//       id: 11,
//       title: "Elegant Gold Necklace",
//       oldPrice: "₹4999",
//       price: "₹4599",
//       image: product2,
//       hoverImg: product3, // 🔹 Add hover image
//       discount: "10%",
//     },
//     {
//       id: 12,
//       title: "Classic Diamond Ring",
//       oldPrice: "₹5999",
//       price: "₹5599",
//       image: product3,
//       hoverImg: product1,
//       discount: "10%",
//     },
//     {
//       id: 13,
//       title: "Brilliant Round cut Everglow jewels",
//       oldPrice: "₹3299",
//       price: "₹2699",
//       image: product1,
//       hoverImg: product2, // 🔹 Add hover image
//       discount: "10%",
//     },
//     {
//       id: 14,
//       title: "Elegant Gold Necklace",
//       oldPrice: "₹4999",
//       price: "₹4599",
//       image: product2,
//       hoverImg: product3, // 🔹 Add hover image
//       discount: "10%",
//     },
//     {
//       id: 15,
//       title: "Classic Diamond Ring",
//       oldPrice: "₹5999",
//       price: "₹5599",
//       image: product3,
//       hoverImg: product1,
//       discount: "10%",
//     },
//     {
//       id: 16,
//       title: "Brilliant Round cut Everglow jewels",
//       oldPrice: "₹3299",
//       price: "₹2699",
//       image: product1,
//       hoverImg: product2, // 🔹 Add hover image
//       discount: "10%",
//     },
//     {
//       id: 17,
//       title: "Elegant Gold Necklace",
//       oldPrice: "₹4999",
//       price: "₹4599",
//       image: product2,
//       hoverImg: product3, // 🔹 Add hover image
//       discount: "10%",
//     },
//     {
//       id: 18,
//       title: "Classic Diamond Ring",
//       oldPrice: "₹5999",
//       price: "₹5599",
//       image: product3,
//       hoverImg: product1,
//       discount: "10%",
//     }, {
//       id: 19,
//       title: "Brilliant Round cut Everglow jewels",
//       oldPrice: "₹3299",
//       price: "₹2699",
//       image: product1,
//       hoverImg: product2, // 🔹 Add hover image
//       discount: "10%",
//     },
//     {
//       id: 20,
//       title: "Elegant Gold Necklace",
//       oldPrice: "₹4999",
//       price: "₹4599",
//       image: product2,
//       hoverImg: product3, // 🔹 Add hover image
//       discount: "10%",
//     },
//     {
//       id: 21,
//       title: "Classic Diamond Ring",
//       oldPrice: "₹5999",
//       price: "₹5599",
//       image: product3,
//       hoverImg: product1,
//       discount: "10%",
//     },
//     {
//       id: 22,
//       title: "Brilliant Round cut Everglow jewels",
//       oldPrice: "₹3299",
//       price: "₹2699",
//       image: product1,
//       hoverImg: product2, // 🔹 Add hover image
//       discount: "10%",
//     },
//     {
//       id: 23,
//       title: "Elegant Gold Necklace",
//       oldPrice: "₹4999",
//       price: "₹4599",
//       image: product2,
//       hoverImg: product3, // 🔹 Add hover image
//       discount: "10%",
//     },
//     {
//       id: 24,
//       title: "Classic Diamond Ring",
//       oldPrice: "₹5999",
//       price: "₹5599",
//       image: product3,
//       hoverImg: product1,
//       discount: "10%",
//     },
//     {
//       id: 25,
//       title: "Brilliant Round cut Everglow jewels",
//       oldPrice: "₹3299",
//       price: "₹2699",
//       image: product1,
//       hoverImg: product2, // 🔹 Add hover image
//       discount: "10%",
//     },
//   ];


//   return (
//     <div className="px-4 sm:px-6 md:px-10 lg:px-16 py-12 space-y-16 max-w-7xl mx-auto">

//       {/* 🔹 First 8 Products */}
//       <section>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.slice(0, 8).map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       </section>

//       {/* 🔹 New Collection */}
//       <section className="bg-white py-12">
//         <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Title */}
//           <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-12 tracking-wide uppercase">
//             New Collection
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
//             {/* ===== Left Column ===== */}
//             <div className="flex flex-col gap-10">
//               {/* Top Large Image */}
//               <img
//                 src={new1}
//                 alt="Jewelry"
//                 className="w-full h-[465px] object-cover shadow-md rounded-lg"
//               />

//               {/* Bottom Section: Discover Block + Image */}
//               <div className="flex flex-col sm:flex-row items-center gap-6">
//                 {/* Discover Block (Text + Button) */}
//                 <div className="flex-1 w-full">
//                   <DiscoverBlock
//                     title="Jewelry Tells"
//                     subtitle="A Great Story"
//                     buttonText="Discover more"
//                   />
//                 </div>

//                 {/* Small Image */}
//                 <img
//                   src={new3}
//                   alt="Bracelet"
//                   className="w-full  h-[465px] object-cover shadow-md rounded-lg"
//                 />
//               </div>
//             </div>

//             {/* ===== Right Column ===== */}
//             <div className="flex flex-col gap-10">
//               {/* Top Section: Image + Discover Text */}
//               <div className="flex flex-col sm:flex-row items-center gap-6">
//                 {/* Image */}
//                 <img
//                   src={new2}
//                   alt="Bracelet"
//                   className="w-full  h-[465px] object-cover shadow-md rounded-lg"

//                 />
//                 {/* Discover Text Block */}
//                 <DiscoverBlock
//                   title="Discover"
//                   subtitle="New Arrivals"
//                   buttonText="Discover more"
//                 />
//               </div>

//               {/* Bottom Large Image */}
//               <img
//                 src={new4}
//                 alt="Pendant"
//                 className="w-full h-[465px] object-cover shadow-md rounded-lg"
//               />
//             </div>
//           </div>
//         </div>

//       </section>

//       {/* 🔹 Next 8 Products */}
//       <section>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.slice(8, 16).map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       </section>

//       {/* 🔹 Banner + Right Single Product */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
//         {/* Banner */}
//         <div className="md:col-span-2 rounded-2xl overflow-hidden shadow-lg">
//           <img
//             src={PromotionalBanner}
//             alt="Promotional Banner"
//             className="w-full h-[260px] sm:h-[320px] md:h-[400px] object-cover"
//             loading="lazy"
//             decoding="async"
//           />
//         </div>
//         {/* Featured Product */}
//         <div>
//           <ProductCard product={products[0]} imageH="h-[180px] md:h-[250px]" />
//         </div>
//       </section>

//       {/* 🔹 Last 9 Products */}
//       <section>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.slice(16, 25).map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default JewelryShowcase;


// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";

// import new1 from "../../assets/EverglowPost1.png";
// import new2 from "../../assets/EverglowPost2.png";
// import new3 from "../../assets/EverglowPost3.png";
// import new4 from "../../assets/EverglowPost4.png";

// import PromotionalBanner from "../../assets/productAds0.png";
// import ProductCard from "../ProductCard/ProductCard";

// /* 🔹 config */
// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

// /* 🔹 DiscoverBlock */
// const DiscoverBlock = ({ title, subtitle, buttonText }) => (
//   <div className="flex flex-col justify-center items-start max-w-[220px]">
//     <p className="text-gray-600 text-sm font-medium">{title}</p>
//     <h3 className="text-lg sm:text-xl md:text-2xl text-gray-900 font-semibold leading-snug my-2 uppercase tracking-wide whitespace-nowrap">
//       {subtitle}
//     </h3>
//     <button className="border border-gray-700 text-gray-800 font-medium py-2 px-6 mt-4 text-sm uppercase tracking-wide rounded-lg transition-colors hover:bg-gray-900 hover:text-white">
//       {buttonText}
//     </button>
//   </div>
// );

// /* 🔹 Small adapter so ProductCard receives consistent props */
// const toCardShape = (p) => {
//   const images = Array.isArray(p?.image) ? p.image : [];
//   const primary = images[0] || "";
//   const hover = images[1] || primary || "";

//   const rupee = (n) =>
//     typeof n === "number" ? `${n.toLocaleString("en-IN")}` : n;

//   return {
//     // keep originals
//     ...p,

//     // common ids/titles
//     id: p?._id,
//     _id: p?._id,
//     title: p?.name,
//     name: p?.name,

//     // prices (strings for display + raw values kept as well)
//     price: rupee(p?.discountPrice ?? p?.price),
//     oldPrice: p?.discountPrice ? rupee(p?.price) : undefined,
//     discountPrice: p?.discountPrice,
//     discountPercentage: p?.discountPercentage,

//     // images
//     image: primary,     // many ProductCard variants read `image` as a single src
//     images,             // keep full array if your card uses thumbnails
//     hoverImg: hover,    // hover support like your mock data

//     // misc
//     discount: p?.discountPercentage
//       ? `${p.discountPercentage}%`
//       : undefined,
//   };
// };

// const JewelryShowcase = () => {
//   const [allProducts, setAllProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     let isMounted = true;

//     (async () => {
//       try {
//         setLoading(true);
//         setErr("");
//         // If you have a dedicated endpoint, prefer:
//         // const { data } = await axios.get(`${API}/product/list?bestseller=true`);
//         const { data } = await axios.get(`${API}/product/list`);
//         if (isMounted) {
//           const items = Array.isArray(data?.products) ? data.products : [];
//           setAllProducts(items);
//         }
//       } catch (e) {
//         if (isMounted) setErr(e?.response?.data?.message || e.message || "Failed to load products");
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     })();

//     return () => { isMounted = false; };
//   }, []);

//   // Only bestsellers
//   const bestsellerCards = useMemo(() => {
//     return allProducts
//       .filter((p) => p?.bestseller === true)
//       // optional: stable sort newest first
//       .sort((a, b) => (b?.date || 0) - (a?.date || 0))
//       .map(toCardShape);
//   }, [allProducts]);

//   // Slice into your three blocks (render whatever is available)
//   const first8 = bestsellerCards.slice(0, 8);
//   const next8 = bestsellerCards.slice(8, 16);
//   const last9 = bestsellerCards.slice(16, 25);

//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-20">
//         <p className="text-center text-gray-600">Loading bestsellers…</p>
//       </div>
//     );
//   }

//   if (err) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-20">
//         <p className="text-center text-red-600">Error: {err}</p>
//       </div>
//     );
//   }

//   if (bestsellerCards.length === 0) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-20">
//         <p className="text-center text-gray-600">
//           No bestseller products yet. Mark some items as <span className="font-medium">bestseller</span> in your backend to have them appear here.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="px-1 sm:px-2 md:px-10 lg:px-16 py-12 space-y-16 max-w-7xl mx-auto">
//       {/* 🔹 First 8 Products (bestsellers) */}
//       {first8.length > 0 && (
//         <section>
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-6">
//             {first8.map((product) => (
//               <ProductCard key={product._id || product.id} product={product} />
//             ))}
//           </div>
//         </section>
//       )}

//       {/* 🔹 New Collection (unchanged visuals) */}
//       <section className="bg-white py-12">
//         <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-12 tracking-wide uppercase">
//             New Collection
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
//             {/* Left */}
//             <div className="flex flex-col gap-10">
//               <img
//                 src={new1}
//                 alt="Jewelry"
//                 className="w-full h-[465px] object-cover shadow-md rounded-lg"
//               />

//               <div className="flex flex-col sm:flex-row items-center gap-6">
//                 <div className="flex-1 w-full">
//                   <DiscoverBlock
//                     title="Jewelry Tells"
//                     subtitle="A Great Story"
//                     buttonText="Discover more"
//                   />
//                 </div>

//                 <img
//                   src={new3}
//                   alt="Bracelet"
//                   className="w-full h-[465px] object-cover shadow-md rounded-lg"
//                 />
//               </div>
//             </div>

//             {/* Right */}
//             <div className="flex flex-col gap-10">
//               <div className="flex flex-col sm:flex-row items-center gap-6">
//                 <img
//                   src={new2}
//                   alt="Bracelet"
//                   className="w-full h-[465px] object-cover shadow-md rounded-lg"
//                 />
//                 <DiscoverBlock
//                   title="Discover"
//                   subtitle="New Arrivals"
//                   buttonText="Discover more"
//                 />
//               </div>

//               <img
//                 src={new4}
//                 alt="Pendant"
//                 className="w-full h-[465px] object-cover shadow-md rounded-lg"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 🔹 Next 8 Products */}
//       {next8.length > 0 && (
//         <section>
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-6">
//             {next8.map((product) => (
//               <ProductCard key={(product._id || product.id) + "-mid"} product={product} />
//             ))}
//           </div>
//         </section>
//       )}

//       {/* 🔹 Banner + Right Single Product */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
//         <div className="md:col-span-2 rounded-2xl overflow-hidden shadow-lg">
//           <img
//             src={PromotionalBanner}
//             alt="Promotional Banner"
//             className="w-full h-[260px] sm:h-[320px] md:h-[400px] object-cover"
//             loading="lazy"
//             decoding="async"
//           />
//         </div>

//         {/* Featured Product: first bestseller if available */}
//         <div className="hidden md:block">
//           <ProductCard
//             product={bestsellerCards[0]}
//             imageH="h-[180px] md:h-[250px]"
//           />
//         </div>

//       </section>

//       {/* 🔹 Last 9 Products */}
//       {last9.length > 0 && (
//         <section>
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-6">
//             {last9.map((product) => (
//               <ProductCard key={(product._id || product.id) + "-last"} product={product} />
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// };

// export default JewelryShowcase;

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import new1 from "../../assets/EverglowPost1.png";
import new2 from "../../assets/EverglowPost2.png";
import new3 from "../../assets/EverglowPost3.png";
import new4 from "../../assets/EverglowPost4.png";

import PromotionalBanner from "../../assets/productAds0.png";
import ProductCard from "../ProductCard/ProductCard";

/* 🔹 config */
const API = import.meta.env.VITE_API_BASE_URL || "https://ga-inx6.onrender.com/api";

/* 🔹 DiscoverBlock */
const DiscoverBlock = ({ title, subtitle, buttonText }) => (
  <div className="flex flex-col justify-center items-start max-w-[220px]">
    <p className="text-gray-600 text-sm font-medium">{title}</p>
    <h3 className="text-lg sm:text-xl md:text-2xl text-gray-900 font-semibold leading-snug my-2 uppercase tracking-wide whitespace-nowrap">
      {subtitle}
    </h3>
    <button className="border border-gray-700 text-gray-800 font-medium py-2 px-6 mt-4 text-sm uppercase tracking-wide rounded-lg transition-colors hover:bg-gray-900 hover:text-white">
      {buttonText}
    </button>
  </div>
);

/* 🔹 Adapt products for ProductCard */
const toCardShape = (p) => {
  const images = Array.isArray(p?.image) ? p.image : [];
  const primary = images[0] || "";
  const hover = images[1] || primary || "";

  const rupee = (n) =>
    typeof n === "number" ? `${n.toLocaleString("en-IN")}` : n;

  return {
    ...p,
    id: p?._id,
    _id: p?._id,
    title: p?.name,
    name: p?.name,
    price: rupee(p?.discountPrice ?? p?.price),
    oldPrice: p?.discountPrice ? rupee(p?.price) : undefined,
    discountPrice: p?.discountPrice,
    discountPercentage: p?.discountPercentage,
    image: primary,
    images,
    hoverImg: hover,
    discount: p?.discountPercentage
      ? `${p.discountPercentage}%`
      : undefined,
  };
};

const JewelryShowcase = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        // Get all products without pagination limit
        const { data } = await axios.get(`${API}/product/list?all=true`);
        if (isMounted) {
          const items = Array.isArray(data?.products) ? data.products : [];
          setAllProducts(items);
        }
      } catch (e) {
        if (isMounted)
          setErr(
            e?.response?.data?.message || e.message || "Failed to load products"
          );
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Adapt + filter bestsellers
  const bestsellerCards = useMemo(() => {
    const bestsellers = allProducts
      .filter((p) => p?.bestseller === true)
      .sort((a, b) => (b?.date || 0) - (a?.date || 0)) // newest first
      .map(toCardShape);
    return bestsellers;
  }, [allProducts]);


  // Dynamic slicing based on available products

  const remaining = bestsellerCards.slice(16); // All remaining products instead of limiting to 9


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-20">
        <p className="text-center text-gray-600">Loading bestsellers…</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-20">
        <p className="text-center text-red-600">Error: {err}</p>
      </div>
    );
  }

  if (bestsellerCards.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-20">
        <p className="text-center text-gray-600">
          No bestseller products yet. Mark some items as{" "}
          <span className="font-medium">bestseller</span> in your backend to
          have them appear here.
        </p>
      </div>
    );
  }

  /* ---------- Layout ---------- */
  const firstBlock = bestsellerCards.slice(0, 8);

  return (
    <div className="px-1 sm:px-2 md:px-10 lg:px-16 py-12 space-y-16 max-w-7xl mx-auto">
      {/* 🔹 First 8 Products */}
      {firstBlock.length > 0 && (
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-1 sm:gap-6">
            {firstBlock.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
              />
            ))}
          </div>
        </section>
      )}

      {/* 🔹 New Collection Section */}
      <section className="bg-white py-12">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-12 tracking-wide uppercase">
            New Collection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Left */}
            <div className="flex flex-col gap-10">
              <img
                src={new1}
                alt="Jewelry"
                className="w-full h-[465px] object-cover shadow-md rounded-lg"
              />

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1 w-full">
                  <DiscoverBlock
                    title="Jewelry Tells"
                    subtitle="A Great Story"
                    buttonText="Discover more"
                  />
                </div>

                <img
                  src={new3}
                  alt="Bracelet"
                  className="w-full h-[465px] object-cover shadow-md rounded-lg"
                />
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-10">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={new2}
                  alt="Bracelet"
                  className="w-full h-[465px] object-cover shadow-md rounded-lg"
                />
                <DiscoverBlock
                  title="Discover"
                  subtitle="New Arrivals"
                  buttonText="Discover more"
                />
              </div>

              <img
                src={new4}
                alt="Pendant"
                className="w-full h-[465px] object-cover shadow-md rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 Banner + Right Featured Product */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <div className="md:col-span-2 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={PromotionalBanner}
            alt="Promotional Banner"
            className="w-full h-[260px] sm:h-[320px] md:h-[400px] object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Featured Product */}
        {bestsellerCards[8] && (
          <div className="hidden md:block">
            <ProductCard
              product={bestsellerCards[8]}
              imageH="h-[180px] md:h-[250px]"
            />
          </div>
        )}
      </section>



      {/* 🔹 Remaining Products - Display all remaining bestsellers dynamically */}
      {remaining.length > 0 && (
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-1 sm:gap-6">
            {remaining.map((product, index) => (
              <ProductCard key={(product._id || product.id) + "-remaining-" + index} product={product} />

            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default JewelryShowcase;
