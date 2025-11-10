// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

const PAYMENT_BASE =
  import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/payment2`
    : "http://localhost:4000/api/payment2";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const paymentRef = searchParams.get("paymentRef");
  const paymentId = searchParams.get("paymentId");

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const res = await axios.get(`${PAYMENT_BASE}/details/${paymentId || paymentRef}`);
        if (res.data?.success) setOrderData(res.data.payment);
      } catch (err) {
        console.error("Error fetching payment details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (paymentId || paymentRef) fetchPaymentDetails();
  }, [paymentId, paymentRef]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-600 text-lg">
        Verifying payment...
      </div>
    );

  if (!orderData)
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-600 text-lg">
        Payment not found.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto text-center py-20 px-4">
      <img
        src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
        alt="success"
        className="w-28 mx-auto mb-6"
      />
      <h1 className="text-3xl font-bold text-green-700 mb-2">
        Payment Successful 🎉
      </h1>

      <p className="text-gray-600 mb-6">
        Your payment was verified successfully.
      </p>

      <div className="bg-gray-50 border rounded-lg p-5 text-left space-y-2">
        <p><b>Payment ID:</b> {orderData.razorpayPaymentId}</p>
        <p><b>Order ID:</b> {orderData.order_id}</p>
        <p><b>Amount:</b> ₹{orderData.amount}</p>
        <p><b>Status:</b> {orderData.status}</p>

        {orderData.address && (
          <div className="mt-4">
            <h2 className="font-semibold text-gray-700 mb-1">Delivery Address:</h2>
            <p>{orderData.address.fullName}</p>
            <p>{orderData.address.line1}</p>
            <p>{orderData.address.city}, {orderData.address.state} - {orderData.address.pincode}</p>
            <p>Mobile: {orderData.mobile}</p>
          </div>
        )}
      </div>

      <Link
        to="/myorder"
        className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Go to My Orders
      </Link>
    </div>
  );
}
