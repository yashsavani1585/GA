// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

const PAYMENT_BASE =
  import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/payment2`
    : "https://ga-inx6.onrender.com/api/payment2";

function toRupeesFromPaise(paise) {
  if (paise == null) return "0.00";
  const n = Number(paise || 0);
  return (n / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const paymentRef = searchParams.get("paymentRef");
  const paymentId = searchParams.get("paymentId");

  useEffect(() => {
    let cancelled = false;
    const fetchPaymentDetails = async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        const idToFetch = paymentId || paymentRef;
        if (!idToFetch) {
          setErrorMsg("Missing payment identifier");
          return;
        }

        const res = await axios.get(`${PAYMENT_BASE}/details/${encodeURIComponent(idToFetch)}`, { timeout: 10000 });

        // backend returns { success: true, payment: { ... } }
        if (res?.data?.success && res.data.payment) {
          if (!cancelled) setOrderData(res.data.payment);
        } else {
          if (!cancelled) setErrorMsg(res?.data?.message || "Payment not found");
        }
      } catch (err) {
        console.error("Error fetching payment details:", err);
        const msg = err?.response?.data?.message || err?.message || "Failed to fetch payment details";
        if (!cancelled) setErrorMsg(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (paymentId || paymentRef) fetchPaymentDetails();
    else setLoading(false);

    return () => (cancelled = true);
  }, [paymentId, paymentRef]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-600 text-lg">
        Verifying payment...
      </div>
    );

  if (errorMsg)
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-600 text-lg">
        <p className="mb-4">Error: {errorMsg}</p>
        <Link to="/" className="text-blue-500">Go home</Link>
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
        <p><b>Payment ID:</b> {orderData.razorpayPaymentId || orderData.razorpayPaymentId || orderData.order_id}</p>
        <p><b>Order ID:</b> {orderData.order_id || orderData.razorpayOrderId}</p>
        <p><b>Amount:</b> ₹{orderData.amount || toRupeesFromPaise(orderData.amountPaise)}</p>
        <p><b>Status:</b> {orderData.status}</p>

        {orderData.paymentLinkUrl && (
          <p><b>Payment Link:</b> <a className="text-blue-600" href={orderData.paymentLinkUrl} target="_blank" rel="noreferrer">{orderData.paymentLinkUrl}</a></p>
        )}

        {orderData.address && (
          <div className="mt-4">
            <h2 className="font-semibold text-gray-700 mb-1">Delivery Address:</h2>
            <p>{orderData.address.fullName}</p>
            {orderData.address.line1 && <p>{orderData.address.line1}</p>}
            <p>{orderData.address.city}, {orderData.address.state} - {orderData.address.pincode}</p>
            {orderData.mobile && <p>Mobile: {orderData.mobile}</p>}
          </div>
        )}

        {orderData.items && orderData.items.length > 0 && (
          <div className="mt-4">
            <h2 className="font-semibold text-gray-700 mb-1">Items:</h2>
            {orderData.items.map((it, idx) => (
              <div key={idx} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                <img src={it.image || "https://placehold.co/80x80?text=No+Image"} alt={it.name} className="w-16 h-16 object-cover rounded" />
                <div className="text-left">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-500">Qty: {it.quantity || 1}</div>
                </div>
              </div>
            ))}
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
