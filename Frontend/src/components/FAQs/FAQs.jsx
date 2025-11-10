// src/components/FAQs.jsx
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqList = [
    {
      question: "What are lab-grown diamonds?",
      answer:
        "Lab-grown diamonds are real diamonds created in controlled environments using advanced technological processes. They are chemically, physically, and optically identical to natural diamonds."
    },
    {
      question: "Are lab-grown diamonds ethical?",
      answer:
        "Yes! Lab diamonds are mined-free, environmentally friendly, and ethically sourced without exploiting workers or communities."
    },
    {
      question: "How can I tell the difference between lab and natural diamonds?",
      answer:
        "Lab-grown diamonds are identical to natural diamonds in every physical and chemical property. Only specialized labs can distinguish them using advanced equipment."
    },
    {
      question: "Do lab-grown diamonds have the same brilliance as natural diamonds?",
      answer:
        "Absolutely! Lab diamonds possess the same sparkle, hardness, and durability as natural diamonds."
    },
    {
      question: "Are lab-grown diamonds more affordable?",
      answer:
        "Typically, yes. Lab-grown diamonds usually cost 20-40% less than natural diamonds of similar size and quality."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-6 md:px-20 bg-white text-black">
      <h2 className="text-4xl font-bold mb-10 text-center border-b-2 border-[#CEBB40]  pb-2">
        Frequently Asked Questions
      </h2>
      <div className="max-w-4xl mx-auto space-y-4">
        {faqList.map((faq, index) => (
          <div
            key={index}
            className="border border-[#CEBB40] rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center p-4 bg-[#FFF8E1] font-semibold text-black text-lg"
            >
              {faq.question}
              <span className="ml-2">
                {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>
            {activeIndex === index && (
              <div className="p-4 bg-white text-gray-800 border-t border-[#CEBB40]">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQs;
