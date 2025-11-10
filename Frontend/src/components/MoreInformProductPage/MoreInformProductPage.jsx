import React, { useEffect, useState } from "react";
import mainImg from "../../assets/EverglowPost1.png";
import img1 from "../../assets/EverglowPost2.png";
import img2 from "../../assets/EverglowPost3.png";
import img3 from "../../assets/EverglowPost4.png";
import product1 from "../../assets/EverglowPost1.png";
import product2 from "../../assets/EverglowPost2.png";
import product3 from "../../assets/EverglowPost3.png";
import ProductCard from "../ProductCard/ProductCard";

const MoreInformProductPage = () => {
  const [loading, setLoading] = useState(true);

  // Related Products Array
  const products = [
    {
      id: 1,
      title: "Brilliant Round cut Everglow jewels",
      oldPrice: "₹3299",
      price: "₹2699",
      image: product1,
    },
    {
      id: 2,
      title: "Elegant Gold Necklace",
      oldPrice: "₹4999",
      price: "₹4599",
      image: product2,
    },
    {
      id: 3,
      title: "Classic Diamond Ring",
      oldPrice: "₹5999",
      price: "₹5599",
      image: product3,
    },
  ];

  // Fake loader (simulate API call)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); // 1.2 sec loading
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#CEBB98] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-10 flex flex-col gap-10">
      {/* Product Detail Section */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* LEFT: Product Images */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full md:w-1/2">
          <div className="rounded-lg overflow-hidden bg-gray-100">
            <img
              src={mainImg}
              alt="Product 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden bg-gray-100">
            <img
              src={img1}
              alt="Product 2"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden bg-gray-100">
            <img
              src={img2}
              alt="Product 3"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden bg-gray-100">
            <img
              src={img3}
              alt="Product 4"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="w-full md:w-1/2 flex flex-col space-y-6">
          <div>
            <h2 className="text-2xl font-bold leading-snug">
              Celestial Grace: Channel-set silver Diamond Earrings
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-2xl font-bold">₹2299</span>
              <span className="text-gray-500 line-through">₹2299</span>
              <span className="bg-gray-100 text-sm px-3 py-1 rounded-full border">
                Sale 10%
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              Earrings are jewelry that can be worn on one's ears. Earrings are
              commonly worn in a piercing in the earlobe or another external
              part of the ear, or by some other means, such as stickers or
              clip-ons.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <button className="flex-1 bg-[#CEBB98] text-white py-3 rounded-md font-semibold hover:bg-purple-950 transition">
                Buy Now
              </button>
              <button className="flex-1 bg-[#CEBB98] text-white py-3 rounded-md font-semibold hover:bg-purple-950 transition">
                Add to Cart
              </button>
            </div>
            <button className="w-full bg-[#CEBB98] text-white py-3 rounded-md font-semibold hover:bg-purple-950 transition">
              Order On Whatsapp
            </button>
          </div>

          {/* Offers Section */}
          <div className="bg-[#CEBB98] text-white rounded-lg p-5 space-y-4">
            <h3 className="font-semibold text-lg">Offers For You</h3>
            <div className="bg-white text-black rounded-md p-4 shadow-sm">
              <p className="font-bold">FLAT 100 off</p>
              <p className="text-sm text-gray-600 mt-1">
                It comes with the authenticity and guarantee certificate of
                Everglow jewels with lifetime exchange guarantee.
              </p>
            </div>
            <div className="bg-white text-black rounded-md p-4 shadow-sm">
              <p className="font-bold">Everglow Jewels</p>
              <p className="text-sm text-gray-600 mt-1">
                It comes with the authenticity and guarantee certificate of
                Everglow jewels with lifetime exchange guarantee.
              </p>
            </div>
          </div>

          {/* Shipping & Return Policy */}
          <div className="space-y-3">
            <details className="border rounded-md px-4 py-3 cursor-pointer">
              <summary className="font-semibold">Shipping</summary>
              <p className="text-sm text-gray-600 mt-2">
                Free shipping on all orders above ₹1000. Delivery in 4-6
                business days.
              </p>
            </details>
            <details className="border rounded-md px-4 py-3 cursor-pointer">
              <summary className="font-semibold">Return Policy</summary>
              <p className="text-sm text-gray-600 mt-2">
                Easy 7-day return & exchange policy with 100% refund guarantee.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-6 text-center">Related Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoreInformProductPage;
