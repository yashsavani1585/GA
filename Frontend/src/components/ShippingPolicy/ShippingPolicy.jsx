import React from "react";

const ShippingPolicy = () => {
  return (
    <div className="bg-white py-12 px-6 md:px-20 w-full">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Shipping Policy
      </h1>

      {/* Shipping Timelines */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Shipping Timelines
        </h2>
        <p className="text-gray-700 leading-relaxed">
          We offer standard shipping within Canada on all orders. 
          Your order will be shipped within{" "}
          <strong>25–30 business days</strong> from the date of order placement. 
          We kindly request all customers to inspect the package for any damage 
          or tampering before receiving or signing for delivery.
        </p>
      </section>

      {/* Manufacturing Time */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Manufacturing Time
        </h2>
        <p className="text-gray-700 leading-relaxed">
          All custom or made-to-order products require{" "}
          <strong>8–10 business days</strong> for manufacturing before shipment.
        </p>
      </section>

      {/* Packaging */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Packaging</h2>
        <p className="text-gray-700 leading-relaxed">
          Every jewellery package is shipped in secure, durable, and tamper-proof 
          packaging. Each item will be delivered in an exclusive branded box 
          along with the relevant certificates and warranty card (if applicable).
        </p>
      </section>

      {/* Policy Updates */}
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Policy Updates
        </h2>
        <p className="text-gray-700 leading-relaxed">
          We reserve the right to modify this Shipping & Order Policy at any time. 
          Changes will take effect immediately upon posting on our website. 
          If significant updates are made, we will notify you here so you remain informed.
        </p>
      </section>
    </div>
  );
};

export default ShippingPolicy;
