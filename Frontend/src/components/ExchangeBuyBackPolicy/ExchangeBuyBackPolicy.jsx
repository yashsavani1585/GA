import React from "react";

const ExchangeBuyBackPolicy = () => {
  return (
    <div className="bg-white py-12 px-6 md:px-20 w-full">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Exchange & Buy Back Policy
      </h1>

      {/* Order Cancellation Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Order Cancellation
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Orders can be cancelled within <strong>24 hours</strong> of placement. 
          Once the order has been processed or manufacturing has started, 
          cancellations will no longer be accepted.
        </p>
      </section>

      {/* Sizing & Replacement Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Sizing & Replacement
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
          <li>
            If you experience any sizing issues, you may request a replacement 
            within <strong>7 days</strong> of receiving the product.
          </li>
          <li>
            The product must be unused, in original condition, and returned with 
            proof of purchase.
          </li>
          <li>
            Ring sizes are provided in <strong>U.S. (US) standard sizing</strong>. 
            Please ensure accurate measurement before placing your order.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default ExchangeBuyBackPolicy;
