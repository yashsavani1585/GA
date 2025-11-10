// import { useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

// export default function Checkout() {
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const params = new URLSearchParams(window.location.search);
//     const orderId = params.get("order_id");
//     const amount = parseFloat(params.get("amount")) || 0;
//     const product = decodeURIComponent(params.get("product") || "");

//     if (!orderId || !amount) {
//       toast.error("❌ Invalid payment details!");
//       return;
//     }

//     const loadRazorpay = () =>
//       new Promise((resolve) => {
//         if (window.Razorpay) return resolve(true);
//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.async = true;
//         script.onload = () => resolve(true);
//         script.onerror = () => resolve(false);
//         document.body.appendChild(script);
//       });

//     async function openRazorpayCheckout() {
//       const loaded = await loadRazorpay();
//       if (!loaded) {
//         toast.error("⚠️ Razorpay SDK failed to load.");
//         return;
//       }

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_z8VHG8l7lxwyLF",
//         amount: Math.round(amount * 100),
//         currency: "INR",
//         name: "Auction Payment",
//         description: product || "Auction Item",
//         order_id: orderId,
//         image: "/logo.png",
//         handler: async function (response) {
//           try {
//             const verifyRes = await axios.post(`${API_BASE}/payment2/verify`, {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//             });

//             if (verifyRes.data.success) {
//               toast.success("✅ Payment verified successfully!");
//               window.location.href = `/payment-success?paymentId=${response.razorpay_payment_id}`;
//             } else {
//               toast.error("❌ Payment verification failed!");
//               window.location.href = "/payment-failed";
//             }
//           } catch (err) {
//             console.error("⚠️ Verification error:", err);
//             toast.error("⚠️ Server verification failed.");
//             window.location.href = "/payment-failed";
//           }
//         },
//         prefill: {
//           name: "Auction User",
//           email: "user@example.com",
//           contact: "9999999999",
//         },
//         theme: {
//           color: "#3399cc",
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.on("payment.failed", (res) => {
//         toast.error(res.error?.description || "Payment failed!");
//         window.location.href = "/payment-failed";
//       });
//       rzp.open();
//     }

//     openRazorpayCheckout();
//   }, []);

//   return (
//     <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
//       <h2 className="text-xl font-semibold text-gray-700">🕒 Opening Payment Gateway...</h2>
//       <p className="text-gray-500 mt-2">Please don’t refresh or close this page.</p>
//     </div>
//   );
// }

// src/pages/Checkout.jsx
// import { useState } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

// export default function Checkout() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     address: "",
//     city: "",
//     pincode: "",
//     amount: "",
//     product: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const loadRazorpayScript = () =>
//     new Promise((resolve) => {
//       if (window.Razorpay) return resolve(true);
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     const { name, email, mobile, address, city, pincode, amount, product } = form;

//     if (!name || !email || !mobile || !address || !city || !pincode || !amount || !product) {
//       toast.error("⚠️ Please fill all fields!");
//       return;
//     }

//     try {
//       setLoading(true);
//       // 🔹 Step 1: Create Order on backend
//       const { data } = await axios.post(`${API_BASE}/payment2/create`, {
//         amount,
//         product,
//         address: { name, email, mobile, address, city, pincode },
//       });

//       if (!data?.success || !data?.order?.id) {
//         toast.error("❌ Failed to create payment order.");
//         setLoading(false);
//         return;
//       }

//       const loaded = await loadRazorpayScript();
//       if (!loaded) {
//         toast.error("⚠️ Razorpay SDK failed to load!");
//         setLoading(false);
//         return;
//       }

//       // 🔹 Step 2: Open Razorpay Checkout
//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_z8VHG8l7lxwyLF",
//         amount: data.order.amount,
//         currency: data.order.currency,
//         name: "Auction Payment",
//         description: product,
//         image: "/logo.png",
//         order_id: data.order.id,
//         handler: async function (response) {
//           try {
//             // 🔹 Step 3: Verify payment
//             const verifyRes = await axios.post(`${API_BASE}/payment2/verify`, {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//             });

//             if (verifyRes.data.success) {
//               toast.success("✅ Payment verified successfully!");
//               window.location.href = `/payment-success?paymentId=${response.razorpay_payment_id}`;
//             } else {
//               toast.error("❌ Payment verification failed!");
//               window.location.href = "/payment-failed";
//             }
//           } catch (err) {
//             console.error("⚠️ Verification error:", err);
//             toast.error("⚠️ Server verification failed.");
//             window.location.href = "/payment-failed";
//           }
//         },
//         prefill: {
//           name,
//           email,
//           contact: mobile,
//         },
//         theme: {
//           color: "#3399cc",
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.on("payment.failed", (res) => {
//         toast.error(res.error?.description || "Payment failed!");
//         window.location.href = "/payment-failed";
//       });
//       rzp.open();
//     } catch (err) {
//       console.error(err);
//       toast.error("❌ Failed to initialize payment.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
//       <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 space-y-4">
//         <h2 className="text-2xl font-bold text-gray-700 text-center">🧾 Checkout</h2>
//         <form onSubmit={handlePayment} className="space-y-3">
//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             value={form.name}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-2"
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-2"
//           />
//           <input
//             type="tel"
//             name="mobile"
//             placeholder="Mobile Number"
//             value={form.mobile}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-2"
//           />
//           <input
//             type="text"
//             name="address"
//             placeholder="Address"
//             value={form.address}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-2"
//           />
//           <div className="grid grid-cols-2 gap-2">
//             <input
//               type="text"
//               name="city"
//               placeholder="City"
//               value={form.city}
//               onChange={handleChange}
//               className="w-full border rounded-lg p-2"
//             />
//             <input
//               type="text"
//               name="pincode"
//               placeholder="Pincode"
//               value={form.pincode}
//               onChange={handleChange}
//               className="w-full border rounded-lg p-2"
//             />
//           </div>
//           <input
//             type="text"
//             name="product"
//             placeholder="Product Name"
//             value={form.product}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-2"
//           />
//           <input
//             type="number"
//             name="amount"
//             placeholder="Amount (INR)"
//             value={form.amount}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-2"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
//           >
//             {loading ? "Processing..." : "Pay Now"}
//           </button>
//         </form>
//         <p className="text-sm text-gray-500 text-center">
//           Secure payments powered by <span className="font-semibold">Razorpay</span>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import logoPng from "../../public/logo.png";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export default function Checkout() {
  const [params] = useSearchParams();

  // These will come from payment link (e.g. /checkout?order_id=order_abc&amount=5000&auction=123&product=Gold+Ring)
  const orderId = params.get("order_id");
  const amount = params.get("amount");
  const product = decodeURIComponent(params.get("product") || "");
  const auctionId = params.get("auction");

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Load Razorpay SDK
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    const { fullName, mobile, line1, city, state, pincode } = form;
    if (!fullName || !mobile || !line1 || !city || !state || !pincode) {
      toast.error("⚠️ Please fill all address details!");
      return;
    }

    if (!orderId || !amount) {
      toast.error("⚠️ Missing payment order details!");
      return;
    }

    setLoading(true);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("⚠️ Razorpay SDK failed to load!");
      setLoading(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_z8VHG8l7lxwyLF",
      amount: Number(amount) * 100, // Convert to paise
      currency: "INR",
      name: "SPARKLE & SHINE",
      description: product || "SPARKLE & SHINE Product",
      image: logoPng,
      order_id: orderId,
      handler: async function (response) {
        try {
          // Verify payment on backend
          const verifyRes = await axios.post(`${API_BASE}/payment2/verify`, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            address: form,
            auctionId,
          });

          if (verifyRes.data.success) {
            toast.success("✅ Payment verified successfully!");
            window.location.href = `/payment-success?paymentId=${response.razorpay_payment_id}`;
          } else {
            toast.error("❌ Payment verification failed!");
            window.location.href = "/payment-failed";
          }
        } catch (err) {
          console.error("Verification error:", err);
          toast.error("⚠️ Server verification failed.");
          window.location.href = "/payment-failed";
        }
      },
      prefill: {
        name: form.fullName,
        contact: form.mobile,
      },
      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (res) => {
      toast.error(res.error?.description || "Payment failed!");
      window.location.href = "/payment-failed";
    });
    rzp.open();

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-700 text-center">🧾 Checkout</h2>
        <p className="text-center text-gray-500">
          Product: <span className="font-semibold">{product}</span>
        </p>
        <p className="text-center text-gray-700 text-lg">
          Amount to Pay: <span className="font-bold text-blue-600">₹{amount}</span>
        </p>

        <form onSubmit={handlePayment} className="space-y-3">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
          <input
            type="text"
            name="line1"
            placeholder="Address Line"
            value={form.line1}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center">
          Secure payments powered by <span className="font-semibold">Razorpay</span>
        </p>
      </div>
    </div>
  );
}
