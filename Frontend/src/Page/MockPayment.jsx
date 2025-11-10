// src/pages/MockPayment.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export default function MockPayment() {
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const paymentId = searchParams.get("paymentId");
    const orderDbId = searchParams.get("orderDbId");
    const amount = searchParams.get("amount");
    const product = searchParams.get("product");

    if (!paymentId || !orderDbId || !amount) {
      toast.error("Invalid fallback payment link.");
      navigate("/");
      return;
    }

    setPaymentInfo({ paymentId, orderDbId, amount, product });
    setLoading(false);
  }, [searchParams]);

  const completePayment = async () => {
    try {
      setLoading(true);

      // ⚡ Optional: call backend to mark as paid (mock)
      await axios.post(`${API_BASE}/payment2/mock-complete`, {
        paymentId: paymentInfo.paymentId,
        orderDbId: paymentInfo.orderDbId,
      });

      toast.success("✅ Mock payment completed!");
      setCompleted(true);

      // Redirect to success page
      setTimeout(() => {
        navigate(`/payment-success?paymentRef=${paymentInfo.paymentId}&paymentId=${paymentInfo.paymentId}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to complete mock payment.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  if (completed)
    return <div className="text-center mt-20 text-green-600 font-bold">Payment Completed!</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">Mock Payment</h1>
        <p className="mb-2">Product: {paymentInfo.product}</p>
        <p className="mb-4 font-bold text-xl">Amount: ₹{paymentInfo.amount}</p>
        <button
          onClick={completePayment}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
        >
          Complete Payment
        </button>
      </div>
    </div>
  );
}
