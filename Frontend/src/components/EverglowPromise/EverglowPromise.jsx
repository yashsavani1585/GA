import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import certifiedImg from "../../assets/Certified.png";
import exchangeImg from "../../assets/LifeTime-Exchange.png";
import moneybackImg from "../../assets/30day-moneyBack.png";
import transparencyImg from "../../assets/Transperncy.png";
import shippingImg from "../../assets/FreeShiping.png";
import designsImg from "../../assets/world-Design.png";
import ethicsImg from "../../assets/No-Compromise.png";
import videoImg from "../../assets/Personalized-video.png";

const promises = [
  { img: certifiedImg, text: "100% Certified Jewellery" },
  { img: exchangeImg, text: "Lifetime Exchange & Buyback" },
  { img: moneybackImg, text: "30 Days Money Back" },
  { img: transparencyImg, text: "100% Transparency" },
  { img: shippingImg, text: "Free Shipping" },
  { img: designsImg, text: "A world of designs" },
  { img: ethicsImg, text: "No Compromise On Ethics" },
  { img: videoImg, text: "Personalized Video Consultations" },
];

const EverglowPromise = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });

  return (
    <section
      ref={ref}
      /* ↓↓↓ No full-height on mobile/tablet; center only on lg+ ↓↓↓ */
      className="w-full bg-white px-6 md:px-20 py-10 md:py-14 lg:py-16 min-h-0 lg:min-h-screen flex items-start lg:items-center"
    >
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ type: "spring", stiffness: 70, damping: 20, duration: 1 }}
        className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center gap-8 lg:gap-12 w-full"
      >
        {/* Left Heading (desktop) */}
        <div className="hidden md:block w-full lg:w-1/3 text-center lg:text-left relative">
          <h3 className="text-4xl md:text-5xl font-serif text-black" style={{ fontFamily: "'Garamond', serif" }}>
            SPARKLE & SHINE 
          </h3>
          <h1
            className="text-6xl md:text-7xl font-serif font-bold text-black leading-tight"
            style={{ fontFamily: "'Garamond', serif" }}
          >
            Promise
          </h1>
          <div className="hidden md:block absolute top-[70%] right-0 w-28 border-t-2  border-yellow-700 "></div>
        </div>

        {/* Mobile heading */}
        <h4
          className="block md:hidden text-3xl font-serif font-bold text-black leading-tight text-center mb-4"
          style={{ fontFamily: "'Garamond', serif" }}
        >
          SPARKLE & SHINE Promise
        </h4>

        {/* Right Grid */}
        <div className="w-full lg:w-2/3 border-2 border-black rounded-md p-6 md:p-10">
          <div className="grid grid-cols-3 gap-6 sm:gap-8 md:gap-10 text-center">
            {promises.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-[#CEBB98]">
                  <img
                    src={item.img}
                    alt={item.text}
                    className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain"
                  />
                </div>
                <p className="mt-3 text-xs sm:text-sm md:text-base font-medium text-black">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default EverglowPromise;
