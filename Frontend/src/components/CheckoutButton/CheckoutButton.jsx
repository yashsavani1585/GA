import React from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "https://ga-inx6.onrender.com/api";

const CheckoutButton = ({ cartTotal, paymentId }) => {
  const handleCheckout = async () => {
    try {
      // 1️⃣ Call backend to create order
      const { data } = await axios.post(`${API}/payment/create`, {
        amount: cartTotal,
        email: "test@example.com",
        mobileNumber: "9876543210",
        deliveryType: "home",
        recipientName: "Yash",
        pincode: "395006",
        houseNo: "12A",
        street: "Ring Road",
        locality: "Surat",
      }, { withCredentials: true });

      if (!data.success) {
        alert("Failed to create order");
        return;
      }

      // 2️⃣ Open Razorpay checkout
      const options = {
        key: data.key, // from backend
        amount: data.amount,
        currency: data.currency,
        name: "EverGlow Store",
        description: "Cart Payment",
        order_id: data.orderId,
        handler: async function (response) {
          // 3️⃣ On success, send to verify API
          const verifyRes = await axios.post(`${API}/payment/verify`, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            alert("✅ Payment Successful!");
            window.location.href = "/order-success";
          } else {
            alert("❌ Payment Verification Failed");
          }
        },
        prefill: {
          name: "Yash Savani",
          email: "test@example.com",
          contact: "9876543210",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Payment init failed");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      style={{
        padding: "10px 20px",
        background: "#3399cc",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
      }}
    >
      Pay with Razorpay
    </button>
  );
};

export default CheckoutButton;
