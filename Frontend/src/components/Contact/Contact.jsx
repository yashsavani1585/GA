import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <section className="bg-gradient-to-b from-yellow-50 to-white py-16 px-6 md:px-20 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Contact Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center border-b pb-10">
          {/* Phone */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <div className="bg-yellow-100 w-14 h-14 flex items-center justify-center rounded-full shadow-sm mb-2">
              <FaPhoneAlt className="text-yellow-700 text-xl" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900">
              Phone Number
            </h3>
            <p className="text-gray-600">+91 99092 88061</p>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <div className="bg-yellow-100 w-14 h-14 flex items-center justify-center rounded-full shadow-sm mb-2">
              <FaEnvelope className="text-yellow-700 text-xl" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900">
              Email Address
            </h3>
            <p className="text-gray-600"></p>
          </div>

          {/* Address */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <div className="bg-yellow-100 w-14 h-14 flex items-center justify-center rounded-full shadow-sm mb-2">
              <FaMapMarkerAlt className="text-yellow-700 text-xl" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900">
              Office Address
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {/* B-714 IT Park, Opp. AR Mall, <br />
              Mota Varachha, Surat - 394101 */}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Text */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900 leading-snug">
              Have Queries? <br /> We’re Here to Help!
            </h2>
            <p className="text-gray-600 mb-4 text-base leading-relaxed">
              Have questions, feedback, or need assistance? Connect with us, and
              we'll ensure you get the support you need.
            </p>
            <p className="text-gray-600 mb-6 text-base leading-relaxed">
              Your trust and satisfaction are our treasures. Reach out to us
              anytime, and let us help you shine! Whether you have a question,
              need assistance, or want to share feedback, we'd love to hear from
              you. Let’s make your jewellery shopping experience exceptional.
            </p>

            {/* Highlighted Box */}
            <div className="bg-yellow-100 text-gray-800 p-5 rounded-lg border-l-4 border-yellow-600 shadow-sm">
              <p className="font-medium leading-relaxed">
                Engagement rings, wedding bands, and anniversary gifts
                commemorate milestones, making the jewellery a lifelong symbol
                of love and commitment.
              </p>
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <form className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="border-b border-gray-400 w-full py-2 focus:outline-none focus:border-yellow-600 transition"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="border-b border-gray-400 w-full py-2 focus:outline-none focus:border-yellow-600 transition"
                />
              </div>

              {/* Email */}
              <input
                type="email"
                placeholder="Email Address"
                className="border-b border-gray-400 w-full py-2 focus:outline-none focus:border-yellow-600 transition"
              />

              {/* Phone */}
              <input
                type="text"
                placeholder="Phone Number"
                className="border-b border-gray-400 w-full py-2 focus:outline-none focus:border-yellow-600 transition"
              />

              {/* Message */}
              <textarea
                rows="4"
                placeholder="Your message here..."
                className="border-b border-gray-400 w-full py-2 focus:outline-none focus:border-yellow-600 transition resize-none"
              ></textarea>

              {/* Button */}
              <button
                type="submit"
                className="bg-[#CEBB98] hover:bg-black text-white px-8 py-3 rounded-md shadow-md w-full md:w-auto transition"
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
