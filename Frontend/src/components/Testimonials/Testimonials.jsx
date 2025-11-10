// // import React from "react";
// // import leftImg from "../../assets/testimonial-left.png";
// // import rightImg from "../../assets/testimonial-right.png";

// // // Star SVG component for decoration
// // const StarIcon = ({ className }) => (
// //   <svg
// //     className={className}
// //     xmlns="http://www.w3.org/2000/svg"
// //     viewBox="0 0 100 100"
// //     fill="currentColor"
// //     aria-hidden="true"
// //   >
// //     <polygon points="50,0 61.8,38.2 100,38.2 69.1,61.8 79.3,100 50,76.4 20.7,100 30.9,61.8 0,38.2 38.2,38.2" />
// //   </svg>
// // );

// // const TestimonialSection = () => {
// //   return (
// //     <div className="bg-white font-serif">
// //       {/* Header */}
// //       <div className="text-center pt-16 pb-8 bg-white">
// //         <h2
// //           className="text-4xl md:text-5xl font-medium text-[#CEBB98]"
// //           style={{ fontFamily: "'Garamond', 'Times New Roman', serif" }}
// //         >
// //           Customer Testimonials
// //         </h2>
// //         <p className="text-lg md:text-xl mt-2 text-[#8b5e83]">
// //           See what our clients have to say
// //         </p>
// //       </div>

// //       {/* Testimonials Section */}
// //       <section className="w-full bg-[#CEBB98] text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-[623px] flex items-center justify-center">
// //         {/* === Border Lines === */}
// //         <div className="absolute inset-0 z-0 pointer-events-none">
// //           {/* Top Horizontal */}
// //           <div className="absolute top-0 left-0 w-full h-px bg-white"></div>
// //           {/* Bottom Horizontal */}
// //           <div className="absolute bottom-0 left-0 w-full h-px bg-white"></div>
// //           {/* Left Vertical */}
// //           <div className="absolute top-0 left-0 h-full w-px bg-white"></div>
// //           {/* Right Vertical */}
// //           <div className="absolute top-0 right-0 h-full w-px bg-white"></div>
// //         </div>

// //         {/* Left Image */}
// //         <div className="absolute z-10 left-[10%] bottom-[15%]">
// //           <img
// //             src={leftImg}
// //             alt="A satisfied customer wearing jewelry"
// //             className="w-40 h-40 md:w-40 md:h-40 object-cover rounded-md shadow-2xl border-2 border-white"
// //           />
// //         </div>

// //         {/* Right Image */}
// //         <div className="absolute z-10 right-[10%] top-[15%]">
// //           <img
// //             src={rightImg}
// //             alt="Another satisfied customer showcasing a product"
// //             className="w-40 h-40 md:w-40 md:h-40 object-cover rounded-md shadow-2xl border-2 border-white"
// //           />
// //         </div>

// //         {/* Testimonial Text */}
// //         <div className="relative z-20 text-center flex flex-col items-center max-w-2xl">
// //           <p
// //             className="text-2xl md:text-3xl lg:text-4xl leading-snug px-4"
// //             style={{ fontFamily: "'Garamond', 'Times New Roman', serif" }}
// //           >
// //             “Beautiful Jewellery and amazing
// //             <br />
// //             Quality I would definitely
// //             <br />
// //             purchase more!”
// //           </p>

// //           {/* Slider Dots */}
// //           <div className="flex justify-center mt-12 space-x-2">
// //             <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
// //             <span className="w-2.5 h-2.5 bg-white/40 rounded-full"></span>
// //             <span className="w-2.5 h-2.5 bg-white/40 rounded-full"></span>
// //           </div>
// //         </div>

// //         {/* Decorative Stars */}
// //         <div className="absolute top-[30%] left-[25%] z-10">
// //           <StarIcon className="w-8 h-8 text-white opacity-90" />
// //         </div>
// //         <div className="absolute bottom-[30%] right-[25%] z-10">
// //           <StarIcon className="w-6 h-6 text-white opacity-40" />
// //         </div>
// //         <div className="absolute bottom-[10%] right-[10%] z-10">
// //           <StarIcon className="w-12 h-12 text-white opacity-20" />
// //         </div>
// //       </section>
// //     </div>
// //   );
// // };

// // export default TestimonialSection;

// // import React from "react";
// // import leftImg from "../../assets/testimonial-left.png";
// // import rightImg from "../../assets/testimonial-right.png";

// // // Star SVG component
// // const StarIcon = ({ className }) => (
// //   <svg
// //     className={className}
// //     xmlns="http://www.w3.org/2000/svg"
// //     viewBox="0 0 100 100"
// //     fill="currentColor"
// //     aria-hidden="true"
// //   >
// //     <polygon points="50,0 61.8,38.2 100,38.2 69.1,61.8 79.3,100 50,76.4 20.7,100 30.9,61.8 0,38.2 38.2,38.2" />
// //   </svg>
// // );

// // const TestimonialSection = () => {
// //   return (
// //     <div className="bg-white font-serif">
// //       {/* Header */}
// //       <div className="text-center pt-12 pb-8 px-4">
// //         <h2
// //           className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#CEBB98]"
// //           style={{ fontFamily: "'Garamond', 'Times New Roman', serif" }}
// //         >
// //           Customer Testimonials
// //         </h2>
// //         <p className="text-base sm:text-lg md:text-xl mt-2 text-[#8b5e83]">
// //           See what our clients have to say
// //         </p>
// //       </div>

// //       {/* Testimonials Section */}
// //       <section className="relative w-full bg-[#CEBB98] text-white py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-12 overflow-hidden">
// //         {/* Border Lines */}
// //         <div className="absolute inset-0 z-0 pointer-events-none">
// //           <div className="absolute top-0 left-0 w-full h-px bg-white"></div>
// //           <div className="absolute bottom-0 left-0 w-full h-px bg-white"></div>
// //           <div className="absolute top-0 left-0 h-full w-px bg-white"></div>
// //           <div className="absolute top-0 right-0 h-full w-px bg-white"></div>
// //         </div>

// //         {/* Main Content */}
// //         <div className="relative z-20 flex flex-col items-center text-center sm:max-w-xl md:max-w-2xl mx-auto">
// //           {/* Right Image (mobile: show above text, right aligned) */}
// //           <div className="w-full flex justify-end mb-6 sm:mb-10 md:hidden">
// //             <img
// //               src={rightImg}
// //               alt="Another satisfied customer showcasing a product"
// //               className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md shadow-2xl border-2 border-white"
// //             />
// //           </div>

// //           {/* Testimonial Text */}
// //           <p
// //             className="text-lg sm:text-xl md:text-3xl lg:text-4xl leading-relaxed sm:leading-snug"
// //             style={{ fontFamily: "'Garamond', 'Times New Roman', serif" }}
// //           >
// //             “Beautiful Jewellery and amazing
// //             <br className="hidden sm:block" />
// //             Quality I would definitely
// //             <br className="hidden sm:block" />
// //             purchase more!”
// //           </p>

// //           {/* Left Image (mobile: show below text, left aligned) */}
// //           <div className="w-full flex justify-start mt-6 sm:mt-10 md:hidden">
// //             <img
// //               src={leftImg}
// //               alt="A satisfied customer wearing jewelry"
// //               className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md shadow-2xl border-2 border-white"
// //             />
// //           </div>

// //           {/* Slider Dots */}
// //           <div className="flex justify-center mt-8 sm:mt-8 space-x-2">
// //             <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full"></span>
// //             <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/40 rounded-full"></span>
// //             <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/40 rounded-full"></span>
// //           </div>
// //         </div>

// //         {/* Desktop / Tablet Images (absolute positioned) */}
// //         <div className="hidden md:block absolute z-10 left-[10%] bottom-[15%]">
// //           <img
// //             src={leftImg}
// //             alt="A satisfied customer wearing jewelry"
// //             className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-md shadow-2xl border-2 border-white"
// //           />
// //         </div>
// //         <div className="hidden md:block absolute z-10 right-[10%] top-[15%]">
// //           <img
// //             src={rightImg}
// //             alt="Another satisfied customer showcasing a product"
// //             className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-md shadow-2xl border-2 border-white"
// //           />
// //         </div>

// //         {/* Decorative Stars */}
// //         <div className="absolute top-[25%] left-[20%] sm:left-[25%] z-10">
// //           <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white opacity-90" />
// //         </div>
// //         <div className="absolute bottom-[25%] right-[20%] sm:right-[25%] z-10">
// //           <StarIcon className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white opacity-40" />
// //         </div>
// //         <div className="absolute bottom-[8%] right-[8%] z-10">
// //           <StarIcon className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white opacity-20" />
// //         </div>
// //       </section>
// //     </div>
// //   );
// // };

// // export default TestimonialSection;


// // import React from "react";
// // import leftImg from "../../assets/testimonial-left.png";
// // import rightImg from "../../assets/testimonial-right.png";

// // const TestimonialSection = () => {
// //   return (
// //     <section className="relative bg-purple-900 text-white py-16 px-4 md:px-16 overflow-hidden">
// //       {/* Decorative Lines */}
// //       <div className="absolute inset-0 pointer-events-none">
// //         <div className="absolute w-px h-full bg-white/20 left-1/6 top-0"></div>
// //         <div className="absolute w-px h-[85%] bg-white/20 right-1/4 top-0"></div>
// //         <div className="absolute h-px w-[85%] bg-white/20 top-1/6 left-0"></div>
// //         <div className="absolute h-px w-[85%] bg-white/20 bottom-1/4 left-0"></div>
// //       </div>

// //       {/* Decorative Stars */}
// //       <div className="absolute top-10 left-10 text-white text-2xl">✦</div>
// //       <div className="absolute bottom-20 right-20 text-white text-2xl">✦</div>
// //       <div className="absolute bottom-0 right-0 text-white text-4xl opacity-40">✦</div>

// //       {/* Testimonial Content */}
// //       <div className="relative z-10 flex flex-col items-center text-center">
// //         <p className="text-xl md:text-3xl font-serif max-w-2xl">
// //           “Beautiful Jewellery and amazing Quality I Would definitely Purchase More!”
// //         </p>

// //         {/* Dots */}
// //         <div className="flex gap-2 mt-6">
// //           <span className="w-3 h-3 rounded-full bg-white"></span>
// //           <span className="w-3 h-3 rounded-full bg-white/50"></span>
// //           <span className="w-3 h-3 rounded-full bg-white/50"></span>
// //         </div>
// //       </div>

// //       {/* Images */}
// //       <img
// //         src={leftImg}
// //         alt="Customer 1"
// //         className="absolute top-1/4 left-12 w-24 h-24 object-cover rounded-md border-2 border-white"
// //       />
// //       <img
// //         src={rightImg}
// //         alt="Customer 2"
// //         className="absolute top-1/4 right-12 w-24 h-24 object-cover rounded-md border-2 border-white"
// //       />
// //     </section>
// //   );
// // };

// // export default TestimonialSection;

// // import React from 'react';
// // import leftImg from "../../assets/testimonial-left.png";
// // import rightImg from "../../assets/testimonial-right.png";

// // const TestimonialSection = () => {
// //   return (
// //     <section className="relative flex flex-col items-center justify-center min-h-screen p-8 overflow-hidden bg-[#4C1242] font-['Inter']">
// //       {/* Grid Lines */}
// //       <div className="absolute top-[20%] left-0 h-px w-full bg-white/20"></div>
// //       <div className="absolute bottom-[20%] left-0 h-px w-full bg-white/20"></div>
// //       <div className="absolute top-0 left-[20%] w-px h-full bg-white/20 hidden md:block"></div>
// //       <div className="absolute top-0 right-[20%] w-px h-full bg-white/20 hidden md:block"></div>

// //       {/* Decorative Stars */}
// //       <svg className="absolute top-16 left-16 w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
// //         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
// //       </svg>
// //       <svg className="absolute bottom-32 right-32 w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
// //         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
// //       </svg>
// //       <svg className="absolute bottom-0 right-0 w-40 h-40 text-white translate-x-1/2 translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
// //         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
// //       </svg>

// //       {/* Main Content */}
// //       <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center">

// //         {/* LEFT IMAGE → bottom left */}
// //         <div className="hidden md:block absolute right-200 top-50">
// //           <img
// //             src={leftImg}
// //             alt="Customer wearing jewelry"
// //             className="w-40 h-40 object-cover rounded-md shadow-2xl border-2 border-white"
// //           />
// //         </div>

// //         {/* QUOTE */}
// //         <blockquote className="max-w-3xl mb-8">
// //           <p className="text-white text-2xl sm:text-3xl md:text-4xl font-serif leading-relaxed font-semibold">
// //             “Beautiful Jewellery and amazing Quality I Would definitely Purchase More!”
// //           </p>
// //         </blockquote>

// //         {/* DOTS */}
// //         <div className="flex gap-2">
// //           <span className="w-2 h-2 rounded-full bg-white"></span>
// //           <span className="w-2 h-2 rounded-full bg-white opacity-50"></span>
// //           <span className="w-2 h-2 rounded-full bg-white opacity-50"></span>
// //         </div>

// //         {/* RIGHT IMAGE → top right */}
// //         <div className="hidden md:block absolute left-200 bottom-50">
// //           <img
// //             src={rightImg}
// //             alt="Customer wearing jewelry"
// //             className="w-40 h-40 object-cover rounded-md shadow-2xl border-2 border-white"
// //           />
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default TestimonialSection;

// // import React from 'react';
// // import leftImg from "../../assets/testimonial-left.png";
// // import rightImg from "../../assets/testimonial-right.png";

// // const TestimonialSection = () => {
// //   return (
// //     <section className="relative flex flex-col items-center justify-center min-h-screen p-8 overflow-hidden bg-[#4C1242] font-['Inter']">
// //       {/* Grid Lines */}
// //       <div className="absolute top-[20%] left-0 h-px w-full bg-white/20"></div>
// //       <div className="absolute bottom-[20%] left-0 h-px w-full bg-white/20"></div>
// //       <div className="absolute top-0 left-[20%] w-px h-full bg-white/20 hidden md:block"></div>
// //       <div className="absolute top-0 right-[20%] w-px h-full bg-white/20 hidden md:block"></div>

// //       {/* Decorative Stars */}
// //       <svg className="absolute top-16 left-16 w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
// //         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
// //       </svg>
// //       <svg className="absolute bottom-32 right-32 w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
// //         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
// //       </svg>
// //       <svg className="absolute bottom-0 right-0 w-40 h-40 text-white translate-x-1/2 translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
// //         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
// //       </svg>

// //       {/* Main Content */}
// //       <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center">

// //         {/* LEFT IMAGE → bottom left corner */}
// //         <div className="hidden md:block absolute left-[10%] bottom-[20%]">
// //           <img
// //             src={leftImg}
// //             alt="Customer wearing jewelry"
// //             className="w-40 h-40 object-cover rounded-md shadow-2xl border-2 border-white"
// //           />
// //         </div>

// //         {/* QUOTE */}
// //         <blockquote className="max-w-3xl mb-8">
// //           <p className="text-white text-2xl sm:text-3xl md:text-4xl font-serif leading-relaxed font-semibold">
// //             “Beautiful Jewellery and amazing Quality I Would definitely Purchase More!”
// //           </p>
// //         </blockquote>

// //         {/* DOTS */}
// //         <div className="flex gap-2">
// //           <span className="w-2 h-2 rounded-full bg-white"></span>
// //           <span className="w-2 h-2 rounded-full bg-white opacity-50"></span>
// //           <span className="w-2 h-2 rounded-full bg-white opacity-50"></span>
// //         </div>

// //         {/* RIGHT IMAGE → top right corner */}
// //         <div className="hidden md:block absolute right-[10%] top-[20%]">
// //           <img
// //             src={rightImg}
// //             alt="Customer wearing jewelry"
// //             className="w-40 h-40 object-cover rounded-md shadow-2xl border-2 border-white"
// //           />
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default TestimonialSection;

// // import React from 'react';
// // import leftImg from "../../assets/testimonial-left.png";
// // import rightImg from "../../assets/testimonial-right.png";

// // const TestimonialSection = () => {
// //   return (
// //     <section className="relative flex flex-col items-center justify-center min-h-screen p-8 overflow-hidden bg-[#4C1242] font-['Inter']">
// //       {/* Grid Lines */}
// //       <div className="absolute top-[20%] left-0 h-px w-[90%] bg-white/20"></div>
// //       <div className="absolute bottom-[20%] ml-26 left-0 h-px w-full bg-white/20"></div>
// //       <div className="absolute top-36 left-[22%] w-px h-full bg-white/20 hidden md:block"></div>
// //       <div className="absolute bottom-36 right-[22%] w-px h-full bg-white/20 hidden md:block"></div>

// //       {/* Decorative Stars */}
// //       <svg className="absolute top-16 left-16 w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
// //         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
// //       </svg>
// //       <svg className="absolute bottom-32 right-32 w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
// //         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
// //       </svg>
// //       <svg className="absolute bottom-0 right-0 w-40 h-40 text-white translate-x-1/2 translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
// //         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
// //       </svg>

// //       {/* Main Content */}
// //       <div className="relative z-10 flex flex-col items-center justify-center p-10 text-center">

// //         {/* LEFT IMAGE → exactly at left grid cross (bottom) */}
// //         <div className="hidden md:block absolute mr-[80%] top-[75%] -translate-x-1/2 translate-y-1/2">
// //           <img
// //             src={leftImg}
// //             alt="Customer wearing jewelry"
// //             className="w-40 h-40 object-cover rounded-md shadow-2xl border-2 border-white"
// //           />
// //         </div>

// //         {/* QUOTE */}
// //         <blockquote className="max-w-3xl mb-8">
// //           <p className="text-white text-2xl sm:text-3xl md:text-4xl font-serif leading-relaxed font-semibold">
// //             “Beautiful Jewellery and amazing Quality I Would definitely Purchase More!”
// //           </p>
// //         </blockquote>

// //         {/* DOTS */}
// //         <div className="flex gap-2">
// //           <span className="w-2 h-2 rounded-full bg-white"></span>
// //           <span className="w-2 h-2 rounded-full bg-white opacity-50"></span>
// //           <span className="w-2 h-2 rounded-full bg-white opacity-50"></span>
// //         </div>

// //         {/* RIGHT IMAGE → exactly at right grid cross (top) */}
// //         <div className="hidden md:block absolute ml-[80%] bottom-[80%] translate-x-1/2 -translate-y-1/2">
// //           <img
// //             src={rightImg}
// //             alt="Customer wearing jewelry"
// //             className="w-40 h-40 object-cover rounded-md shadow-2xl border-2 border-white"
// //           />
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default TestimonialSection;

// // import React from "react";
// // import leftImg from "../../assets/testimonial-left.png";
// // import rightImg from "../../assets/testimonial-right.png";

// // const TestimonialSection = () => {
// //   return (
// //     <section className="relative flex flex-col items-center justify-center min-h-screen p-6 sm:p-8 lg:p-12 overflow-hidden bg-[#4C1242] font-['Inter']">
// //       {/* Grid Lines */}
// //       <div className="absolute top-[20%] left-0 h-px w-[90%] bg-white"></div>
// //       <div className="absolute bottom-[20%] left-0 h-px ml-25 w-full bg-white"></div>
// //       <div className="absolute top-36 left-[22%] w-px h-full bg-white hidden md:block"></div>
// //       <div className="absolute bottom-36 right-[22%] w-px h-full bg-white hidden md:block"></div>

// //       {/* Decorative Stars */}
// //       <svg
// //         className="absolute top-8 left-8 w-12 h-12 text-white sm:w-16 sm:h-16"
// //         viewBox="0 0 24 24"
// //         fill="none"
// //         stroke="currentColor"
// //         strokeWidth="1"
// //       >
// //         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
// //       </svg>

// //       <svg
// //         className="absolute bottom-16 right-16 w-8 h-8 text-white sm:w-12 sm:h-12"
// //         viewBox="0 0 24 24"
// //         fill="none"
// //         stroke="currentColor"
// //         strokeWidth="1"
// //       >
// //         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
// //       </svg>

// //       <svg
// //         className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 text-white translate-x-1/2 translate-y-1/2"
// //         viewBox="0 0 24 24"
// //         fill="none"
// //         stroke="currentColor"
// //         strokeWidth="1"
// //       >
// //         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
// //       </svg>

// //       {/* Main Content */}
// //       <div className="relative z-10 flex flex-col items-center justify-center text-center px-1 sm:px-6 lg:px-50 py-10 sm:py-16">
// //         {/* LEFT IMAGE → bottom left grid cross */}
// // <div className="hidden md:block absolute left-0 bottom-0 transform -translate-x-1/2 translate-y-1/2 sm:left-[10%] lg:left-[15%] sm:bottom-[25%] lg:bottom-[30%]">
// //           <img
// //             src={leftImg}
// //             alt="Customer wearing jewelry"
// //             className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 mt-70 object-cover rounded-md shadow-2xl border-2 border-white"
// //           />
// //         </div>

// //         {/* QUOTE */}
// //         <blockquote className="max-w-3xl mb-8 px-4 sm:px-6">
// //           <p className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed font-semibold">
// //             “Beautiful Jewellery and amazing Quality I Would definitely Purchase More!”
// //           </p>
// //         </blockquote>

// //         {/* DOTS */}
// //         <div className="flex gap-2 justify-center mb-6">
// //           <span className="w-2 h-2 rounded-full bg-white"></span>
// //           <span className="w-2 h-2 rounded-full bg-white opacity-50"></span>
// //           <span className="w-2 h-2 rounded-full bg-white opacity-50"></span>
// //         </div>

// //         {/* RIGHT IMAGE → top right grid cross */}
// // <div className="hidden md:block absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2 sm:right-[10%] lg:right-[15%] sm:top-[20%] lg:top-[15%]">
// //           <img
// //             src={rightImg}
// //             alt="Customer wearing jewelry"
// //             className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 mb-50 object-cover rounded-md shadow-2xl border-2 border-white"
// //           />
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default TestimonialSection;

// // import React, { useState, useEffect } from "react";
// // import leftImg from "../../assets/testimonial-left.png";
// // import rightImg from "../../assets/testimonial-right.png";

// // const reviews = [
// //   "Beautiful Jewellery and amazing Quality! I would definitely purchase more!",
// //   "Amazing designs and excellent customer service. Highly recommended!",
// //   "The quality is top-notch and delivery was super fast. Loved it!"
// // ];

// // const TestimonialSection = () => {
// //   const [currentReview, setCurrentReview] = useState(0);

// //   useEffect(() => {
// //     const interval = setInterval(() => {
// //       setCurrentReview((prev) => (prev + 1) % reviews.length);
// //     }, 4000); // change review every 4 sec
// //     return () => clearInterval(interval);
// //   }, []);

// //   return (
// //     <section className="relative flex flex-col items-center justify-center min-h-screen p-6 sm:p-8 lg:p-12 overflow-hidden bg-[#4C1242] font-['Inter']">
// //       {/* Grid Lines */}
// //       <div className="absolute top-[20%] left-0 h-px w-[90%] bg-white"></div>
// //       <div className="absolute bottom-[20%] left-0 h-px w-full bg-white"></div>
// //       <div className="absolute top-36 left-[22%] w-px h-full bg-white hidden md:block"></div>
// //       <div className="absolute bottom-36 right-[22%] w-px h-full bg-white hidden md:block"></div>

// //       {/* Decorative Stars */}
// //       <svg
// //         className="absolute top-8 left-8 w-12 h-12 text-white sm:w-16 sm:h-16"
// //         viewBox="0 0 24 24"
// //         fill="none"
// //         stroke="currentColor"
// //         strokeWidth="1"
// //       >
// //         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
// //       </svg>

// //       <svg
// //         className="absolute bottom-16 right-16 w-8 h-8 text-white sm:w-12 sm:h-12"
// //         viewBox="0 0 24 24"
// //         fill="none"
// //         stroke="currentColor"
// //         strokeWidth="1"
// //       >
// //         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
// //       </svg>

// //       {/* Main Content */}
// //       <div className="relative z-10 flex flex-col items-center justify-center text-center px-1 sm:px-6 lg:px-50 py-10 sm:py-16 gap-10">
// //         {/* Left Image */}
// //         <div className="hidden md:block absolute left-0 bottom-0 transform -translate-x-1/2 translate-y-1/2 sm:left-[10%] lg:left-[15%] sm:bottom-[25%] lg:bottom-[30%]">
// //           <img
// //             src={leftImg}
// //             alt="Customer"
// //             className="w-28 h-28 sm:w-36 mt-70 sm:h-36 lg:w-40 lg:h-40 object-cover rounded-md shadow-2xl border-2 border-white"
// //           />
// //         </div>


// //         {/* Quote */}
// //         <blockquote className="max-w-3xl px-4 sm:px-6">
// //           <p className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed font-semibold">
// //             {reviews[currentReview]}
// //           </p>
// //         </blockquote>

// //         {/* Right Image */}
// //         <div className="hidden md:block absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2 sm:right-[10%] lg:right-[15%] sm:top-[20%] lg:top-[15%]">
// //           <img
// //             src={rightImg}
// //             alt="Customer"
// //             className="w-28 h-28 mb-50 sm:w-36 sm:h-36 lg:w-40 lg:h-40 object-cover rounded-md shadow-2xl border-2 border-white"
// //           />
// //         </div>


// //         {/* Dots */}
// //         <div className="flex gap-2 justify-center mt-6">
// //           {reviews.map((_, index) => (
// //             <span
// //               key={index}
// //               className={`w-2 h-2 rounded-full ${currentReview === index ? "bg-white" : "bg-white opacity-50"
// //                 }`}
// //             ></span>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default TestimonialSection;

// import React, { useState, useEffect } from "react";
// import leftImg from "../../assets/testimonial-left.png";
// import rightImg from "../../assets/testimonial-right.png";

// const reviews = [
//   "The design is elegant and build quality feels really sturdy!",
//   "The service was quick and the packaging came neat and safe!",
//   "The quality is top-notch and delivery was super fast. Loved it!"
// ];

// const TestimonialSection = () => {
//   const [currentReview, setCurrentReview] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentReview((prev) => (prev + 1) % reviews.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//       <div className="text-center pt-1 pb-2 bg-white">
//         <h1
//           className="text-4xl md:text-5xl font-bold text-black"
//           style={{ fontFamily: "'Garamond', 'Times New Roman', serif" }}
//         >
//           Customer Testimonials
//         </h1>
//         <p className="text-lg md:text-xl mt-2 font-bold text-gray-600">
//           See what our clients have to say
//         </p>
//       </div>
//       <section className="relative flex flex-col items-center justify-center min-h-screen w-full p-6 sm:p-8 lg:p-12 overflow-hidden bg-[#CEBB98] font-['Inter']">

//         {/* ==== GRID LINES (only desktop) ==== */}
//         <div className="hidden lg:block absolute top-[20%] left-0 h-px w-[90%] bg-black"></div>
//         <div className="hidden lg:block absolute bottom-[20%] left-0 h-px w-full bg-black"></div>
//         <div className="hidden lg:block absolute top-36  left-[22%] w-px h-full bg-black"></div>
//         <div className="hidden lg:block absolute  bottom-36 right-[22%] w-px h-full bg-black"></div>

//         {/* ==== Decorative Stars ==== */}
//         <svg
//           className="absolute top-8 left-8 w-12 h-12 text-white sm:w-16 sm:h-16"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1"
//         >
//           <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//         </svg>

//         <svg
//           className="absolute bottom-16 right-16 w-8 h-8 text-white sm:w-12 sm:h-12"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1"
//         >
//           <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//         </svg>

//         {/* ==== Main Content ==== */}
//         <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-10 sm:py-16 w-full">

//           {/* ==== MOBILE/TABLET LAYOUT ==== */}
//           <div className="flex flex-col items-center gap-6 lg:hidden">
//             <img
//               src={leftImg}
//               alt="Customer Left"
//               className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md shadow-2xl border-2 border-white"
//             />

//             <blockquote className="max-w-2xl px-4">
//               <p className="text-white text-lg sm:text-xl md:text-2xl font-serif leading-relaxed font-semibold">
//                 {reviews[currentReview]}
//               </p>
//             </blockquote>

//             <img
//               src={rightImg}
//               alt="Customer Right"
//               className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md shadow-2xl border-2 border-white"
//             />
//           </div>

//           {/* ==== DESKTOP QUOTE ==== */}
//           <blockquote className="hidden lg:block max-w-3xl px-6">
//             <p className="text-white text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed font-semibold">
//               {reviews[currentReview]}
//             </p>
//           </blockquote>

//           {/* ==== DESKTOP FLOATING IMAGES ==== */}
//           <div className="hidden lg:block">
//             {/* Left Image */}
//             <div className="absolute left-[20%] -bottom-[55%] translate-x-[-50%]">
//               <img
//                 src={leftImg}
//                 alt="Customer Left"
//                 className="w-28 h-28 lg:w-36 lg:h-36 object-cover rounded-md shadow-2xl border-2 border-white"
//               />
//             </div>
//             {/* Right Image */}
//             <div className="absolute right-[20%] -top-[55%] translate-x-[50%]">
//               <img
//                 src={rightImg}
//                 alt="Customer Right"
//                 className="w-28 h-28 lg:w-36 lg:h-36 object-cover rounded-md shadow-2xl border-2 border-white"
//               />
//             </div>
//           </div>

//           {/* ==== DOTS ==== */}
//           <div className="flex gap-2 justify-center mt-6">
//             {reviews.map((_, index) => (
//               <span
//                 key={index}
//                 className={`w-2 h-2 rounded-full ${currentReview === index
//                     ? "bg-white"
//                     : "bg-white opacity-50"
//                   }`}
//               ></span>
//             ))}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default TestimonialSection;















// import React, { useState, useEffect } from "react";
// import leftImg from "../../assets/testimonial-left.png";
// import rightImg from "../../assets/testimonial-right.png";

// const reviews = [
//   "The design is elegant and build quality feels really sturdy!",
//   "The service was quick and the packaging came neat and safe!",
//   "The quality is top-notch and delivery was super fast. Loved it!"
// ];

// const TestimonialSection = () => {
//   const [currentReview, setCurrentReview] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentReview((prev) => (prev + 1) % reviews.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//       <div className="text-center pt-1 pb-2 bg-white">
//         <h1
//           className="text-4xl md:text-5xl font-bold text-black"
//           style={{ fontFamily: "'Garamond', 'Times New Roman', serif" }}
//         >
//           Customer Testimonials
//         </h1>
//         <p className="text-lg md:text-xl mt-2 font-bold text-gray-600">
//           See what our clients have to say
//         </p>
//       </div>
//       <section className="relative flex flex-col items-center justify-center min-h-screen w-full p-6 sm:p-8 lg:p-12 overflow-hidden bg-[#CEBB98] font-['Inter']">

//         {/* ==== GRID LINES (only desktop) ==== */}
//         <div className="hidden lg:block absolute top-[20%] left-0 h-px w-[90%] bg-black"></div>
//         <div className="hidden lg:block absolute bottom-[20%] left-0 h-px w-full bg-black"></div>
//         <div className="hidden lg:block absolute top-36  left-[22%] w-px h-full bg-black"></div>
//         <div className="hidden lg:block absolute  bottom-36 right-[22%] w-px h-full bg-black"></div>

//         {/* ==== Decorative Stars ==== */}
//         <svg
//           className="absolute top-8 left-8 w-12 h-12 text-white sm:w-16 sm:h-16"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1"
//         >
//           <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//         </svg>

//         <svg
//           className="absolute bottom-16 right-16 w-8 h-8 text-white sm:w-12 sm:h-12"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1"
//         >
//           <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//         </svg>

//         {/* ==== Main Content ==== */}
//         <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-10 sm:py-16 w-full">

//           {/* ==== MOBILE/TABLET LAYOUT ==== */}
//           <div className="flex flex-col items-center gap-6 lg:hidden">
//             <img
//               src={leftImg}
//               alt="Customer Left"
//               className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md shadow-2xl border-2 border-white"
//             />

//             <blockquote className="max-w-2xl px-4">
//               <p className="text-white text-lg sm:text-xl md:text-2xl font-serif leading-relaxed font-semibold">
//                 {reviews[currentReview]}
//               </p>
//             </blockquote>

//             <img
//               src={rightImg}
//               alt="Customer Right"
//               className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md shadow-2xl border-2 border-white"
//             />
//           </div>

//           {/* ==== DESKTOP QUOTE ==== */}
//           <blockquote className="hidden lg:block max-w-3xl px-6">
//             <p className="text-white text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed font-semibold">
//               {reviews[currentReview]}
//             </p>
//           </blockquote>

//           {/* ==== DESKTOP FLOATING IMAGES ==== */}
//           <div className="hidden lg:block">
//             {/* Left Image */}
//             <div className="absolute left-[20%] -bottom-[55%] translate-x-[-50%]">
//               <img
//                 src={leftImg}
//                 alt="Customer Left"
//                 className="w-28 h-28 lg:w-36 lg:h-36 object-cover rounded-md shadow-2xl border-2 border-white"
//               />
//             </div>
//             {/* Right Image */}
//             <div className="absolute right-[20%] -top-[55%] translate-x-[50%]">
//               <img
//                 src={rightImg}
//                 alt="Customer Right"
//                 className="w-28 h-28 lg:w-36 lg:h-36 object-cover rounded-md shadow-2xl border-2 border-white"
//               />
//             </div>
//           </div>

//           {/* ==== DOTS ==== */}
//           <div className="flex gap-2 justify-center mt-6">
//             {reviews.map((_, index) => (
//               <span
//                 key={index}
//                 className={`w-2 h-2 rounded-full ${currentReview === index
//                     ? "bg-white"
//                     : "bg-white opacity-50"
//                   }`}
//               ></span>
//             ))}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default TestimonialSection;



import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import img1 from "../../assets/review1.webp";
import img2 from "../../assets/review2.jpeg";
import img3 from "../../assets/review3.jpeg";
import img4 from "../../assets/review4.jpeg";
import img5 from "../../assets/review5.jpeg";
import img6 from "../../assets/review6.jpeg";
import img7 from "../../assets/review7.jpeg";
import img8 from "../../assets/review8.jpeg";
import img9 from "../../assets/review9.jpeg";
import img10 from "../../assets/review10.jpeg";

const reviews = [
  {
    text: "The design is elegant and build quality feels really sturdy!",
    author: "Ravi Sharma",
    role: "Product Designer",
    img: img1,
  },
  {
    text: "The service was quick and the packaging came neat and safe!",
    author: "Ananya Gupta",
    role: "Entrepreneur",
    img: img2,
  },
  {
    text: "The quality is top-notch and delivery was super fast. Loved it!",
    author: "Vikram Patel",
    role: "Software Engineer",
    img: img3,
  },
  {
    text: "Amazing customer support, really happy with the purchase.",
    author: "Sneha Verma",
    role: "Startup Founder",
    img: img4,
  },
  {
    text: "Delivery was faster than expected, packaging was perfect.",
    author: "Karan Mehta",
    role: "Freelancer",
    img: img5,
  },
  {
    text: "I’ve never had such a smooth shopping experience online.",
    author: "Priya Iyer",
    role: "Marketing Manager",
    img: img6,
  },
  {
    text: "Top-notch quality at affordable price. Recommended!",
    author: "Arjun Singh",
    role: "Consultant",
    img: img7,
  },
  {
    text: "The attention to detail is simply amazing. 5 stars!",
    author: "Neha Kapoor",
    role: "Fashion Blogger",
    img: img8,
  },
  {
    text: "Website was super easy to use, checkout was smooth.",
    author: "Rahul Nair",
    role: "Data Analyst",
    img: img9,
  },
  {
    text: "Products are authentic and worth the price!",
    author: "Aditi Joshi",
    role: "Interior Designer",
    img: img10,
  },
];

const TestimonialSection = () => {
  return (
    <>
      {/* Heading */}
      <div className="text-center mb-10">
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black"
          style={{ fontFamily: "'Garamond', 'Times New Roman', serif" }}
        >
          Customer Testimonials
        </h1>
        <p className="text-base sm:text-lg md:text-xl mt-3 font-medium text-black/90">
          See what our clients have to say
        </p>
      </div>
      <section className="relative flex flex-col items-center justify-center min-h-[30vh] w-full px-6 py-16 bg-gradient-to-br from-[#CEBB98] to-[#b9a476] font-['Inter'] overflow-hidden">



        {/* Swiper Slider */}
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={30}
          breakpoints={{
            0: { slidesPerView: 1 },     // Mobile small (default)
            480: { slidesPerView: 1 },   // Mobile large
            640: { slidesPerView: 2 },   // Small tablets
            768: { slidesPerView: 2 },   // Tablets
            1024: { slidesPerView: 3 },  // Laptops
            1280: { slidesPerView: 4 },  // Desktops
            1536: { slidesPerView: 4 },  // Large screens
          }}
            className="w-full max-w-6xl pb-16" // padding-bottom for dots space
            >
            {
              reviews.map((review, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-md p-6 text-center hover:scale-105 transition-transform duration-300 w-full h-[260px] flex flex-col justify-between">
                    <p className="text-base text-white font-serif leading-relaxed mb-4 line-clamp-3">
                      "{review.text}"
                    </p>
                    <div className="flex flex-col items-center">
                      <img
                        src={review.img}
                        alt={review.author}
                        className="w-14 h-14 object-cover rounded-full shadow-md border-2 border-white mb-2"
                      />
                      <h3 className="text-white text-sm font-semibold">
                        {review.author}
                      </h3>
                      <p className="text-white/70 text-xs">{review.role}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            }
      </Swiper>

      {/* Custom Swiper pagination styling */}
      <style>
        {`
    .swiper-pagination {
      position: static !important;   /* default absolute ko override kiya */
      margin-top: 20px;             /* cards ke neeche gap */
      text-align: center;           /* center me dots */
    }
    .swiper-pagination-bullet {
      background: black !important;
      opacity: 0.6;
      width: 10px;
      height: 10px;
      margin: 0 6px !important;     /* thoda space between dots */
    }
    .swiper-pagination-bullet-active {
      opacity: 1;
    }
  `}
      </style>
    </section >
    </>
  );
};

export default TestimonialSection;