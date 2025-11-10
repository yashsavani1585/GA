import React from "react";

// Import images for promises
import buybackImg from "../../assets/80-buyback-2.png";
import exchangeImg from "../../assets/100-exchange-2.png";
import returnImg from "../../assets/Free-shipping-insurance-1.png";
import certifiedImg from "../../assets/Certified-jewelery.png";
import hallmarkedImg from "../../assets/Hallmarked-Gold.png";
import shippingImg from "../../assets/Free-shipping.png";

const promises = [
    {
        id: 1,
        img: buybackImg,
        title: "80% Buyback",
    },
    {
        id: 2,
        img: exchangeImg,
        title: "100% Exchange",
    },
    {
        id: 3,
        img: returnImg,
        title: "Easy 15 Days Return",
    },
    {
        id: 4,
        img: certifiedImg,
        title: "Certified Jewellery",
    },
    {
        id: 5,
        img: hallmarkedImg,
        title: "Hallmarked Gold",
    },
    {
        id: 6,
        img: shippingImg,
        title: "Free Shipping & Insurance",
    },
];

const PromiseSection = () => {
    return (
        <section className="w-full bg-white pt-0 pb-10 px-4 sm:px-6 md:px-12">
            {/* Heading */}
            <div className="text-center mb-8 md:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold text-black">
                    OUR PROMISE
                </h2>
                <p className="text-sm sm:text-base md:text-xl text-gray-600 font-bold mt-2">
                    Our commitment to you: quality, trust, and satisfaction in every piece.
                </p>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center text-center">
                {promises.map((item) => (
                    <div key={item.id} className="flex flex-col items-center justify-center">
                        <img src={item.img} alt={item.title} className="w-10 h-10 mb-2 object-contain" />
                        <h3 className="text-sm sm:text-base font-semibold">{item.title}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PromiseSection;
