import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// Example images (replace with real ones)
import ring1 from "../../assets/img6.png";
import bracelet from "../../assets/img7.png";
import ring2 from "../../assets/img8.png";
import ring3 from "../../assets/img6.png";
import ring4 from "../../assets/img7.png";
import ring5 from "../../assets/img8.png";

const products = [
  { id: 1, img: ring1 },
  { id: 2, img: bracelet },
  { id: 3, img: ring2 },
  { id: 4, img: ring3 },
  { id: 5, img: ring4 },
  { id: 6, img: ring5 },
];

const NewInStore = () => {
  return (
    <section className="w-full bg-white py-12 overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black">
          NEW IN STORE
        </h2>
      </div>

      {/* Slider */}
      <div className="w-full flex justify-center">
        <Swiper
          modules={[Autoplay]}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1.3, // show part of next img
              spaceBetween: 12,
            },
            640: {
              slidesPerView: 2.2,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
          className="w-full max-w-6xl"
        >
          {products.map((product) => (
            <SwiperSlide
              key={product.id}
              className="flex justify-center items-center"
            >
              {({ isActive }) => (
                <div
                  className={`transition-all duration-500 ease-in-out flex justify-center items-center ${
                    isActive
                      ? "scale-110 opacity-100 z-10" // active (center) image bigger
                      : "scale-90 opacity-70"
                  }`}
                >
                  <img
                    src={product.img}
                    alt="product"
                    className="w-[400px] md:w-[420px] 
                               h-[400px] sm:h-[340px] md:h-[420px]
                               object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default NewInStore;
