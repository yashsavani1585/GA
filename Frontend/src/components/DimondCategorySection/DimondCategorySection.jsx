

import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";


// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// Import images
import Round from "../../assets/Round.jpg";
import Princess from "../../assets/Princess.svg";
import Emerald from "../../assets/Emerald.jpg";
import Oval from "../../assets/Oval.jpg";
import Pear from "../../assets/Pear.svg";
import Heart from "../../assets/Heart.jpg";
import Asscher from "../../assets/Asscher.jpg";
import Marquise from "../../assets/Marquise.svg";
import Hybrid from "../../assets/Hybrid.jpg";
import Antique from "../../assets/Antique.jpg";
import Radiant from "../../assets/Radiant.jpg";
import Cushion from "../../assets/Cushion.jpg";

const categories = [
  { id: 1, img: Round, name: "Round", link: "/inquiry" },
  { id: 2, img: Princess, name: "Princess", link: "/inquiry" },
  { id: 3, img: Emerald, name: "Emerald", link: "/inquiry" },
  { id: 4, img: Oval, name: "Oval", link: "/inquiry" },
  { id: 5, img: Pear, name: "Pear", link: "/inquiry" },
  { id: 6, img: Heart, name: "Heart", link: "/inquiry" },
  { id: 7, img: Asscher, name: "Asscher", link: "/inquiry" },
  { id: 8, img: Marquise, name: "Marquise", link: "/inquiry" },
  { id: 9, img: Hybrid, name: "Hybrid", link: "/inquiry" },
  { id: 10, img: Antique, name: "Antique", link: "/inquiry" },
  { id: 11, img: Radiant, name: "Radiant", link: "/inquiry" },
  { id: 12, img: Cushion, name: "Cushion", link: "/inquiry" },
];

const DimondCategorySection = () => {
  return (
    <section className="w-full bg-white pt-0 pb-10 px-4 sm:px-6 md:px-12">
      {/* Heading */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold text-black">
          DISCOVER SHAPES
        </h2>
        <p className="text-sm sm:text-base md:text-xl text-gray-600 font-bold mt-2">
          Explore our curated selection, categorized by diamond shape, to find
          your perfect expression of elegance.
        </p>
      </div>

      {/* Swiper Slider */}
      <div className="max-w-6xl mx-auto">
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          loop={true}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 10 },  // small phones
            480: { slidesPerView: 2, spaceBetween: 15 },  // larger phones
            562: { slidesPerView: 3, spaceBetween: 15 },  // small tablets (custom width you gave)
            640: { slidesPerView: 3, spaceBetween: 20 },  // tablets portrait
            709: { slidesPerView: 4, spaceBetween: 20 },  // mid tablets
            768: { slidesPerView: 4, spaceBetween: 25 },  // tablets landscape
            900: { slidesPerView: 4, spaceBetween: 25 },  // small laptops
            1024: { slidesPerView: 5, spaceBetween: 30 },  // standard laptops
            1280: { slidesPerView: 5, spaceBetween: 35 },  // desktops
            1440: { slidesPerView: 6, spaceBetween: 40 },  // large desktops
            1600: { slidesPerView: 6, spaceBetween: 45 },  // wide monitors
            1920: { slidesPerView: 7, spaceBetween: 50 },  // full HD screens
          }}

          className="pb-10"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat.id}>
              <div className="flex flex-col items-center text-center">
                <Link to={cat.link}>
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 overflow-hidden rounded-xl shadow-md">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                </Link>
                <p className="mt-2 text-sm md:text-base font-medium text-gray-700">
                  {cat.name}
                </p>
              </div>
            </SwiperSlide>
          ))}

          {/* Custom Arrows */}
          <div className="flex justify-center gap-6 mt-6">
            <button className="custom-prev bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow">
              <FaChevronLeft />
            </button>
            <button className="custom-next bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow">
              <FaChevronRight />
            </button>
          </div>
        </Swiper>
      </div>
    </section>
  );
};

export default DimondCategorySection;
