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

// src/pages/Checkout.jsx
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { useSearchParams } from "react-router-dom";
// import logoPng from "../../public/logo.png";

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
// const VERIFY_URL = `${API_BASE}/payment2/verify`; // single endpoint

// function paiseToRupeesStr(paise) {
//   if (paise == null) return "0.00";
//   const n = Number(paise);
//   if (!Number.isFinite(n)) return String(paise);
//   return (n / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// }

// export default function Checkout() {
//   const [params] = useSearchParams();
//   const queryOrderId = params.get("orderId") || params.get("order_id") || null;
//   const queryAuctionId = params.get("auctionId") || params.get("auction") || null;

//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [checkoutInfo, setCheckoutInfo] = useState(null);
//   const [form, setForm] = useState({ fullName: "", mobile: "", line1: "", city: "", state: "", pincode: "" });

//   // read token from localStorage (if user is logged in)
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     let cancelled = false;

//     async function fetchInfo() {
//       setLoading(true);
//       try {
//         if (!queryOrderId && !queryAuctionId) {
//           throw new Error("Missing orderId or auctionId in the URL.");
//         }

//         const body = { action: "fetch", orderId: queryOrderId, auctionId: queryAuctionId };

//         const headers = token ? { Authorization: `Bearer ${token}` } : {};
//         const res = await axios.post(VERIFY_URL, body, { headers });

//         if (!res?.data?.success) {
//           throw new Error(res?.data?.message || "Failed to fetch checkout info");
//         }

//         const d = res.data.data || {};
//         const info = {
//           razorpayOrderId: d.razorpayOrderId || d.orderId || null,
//           paymentRecordId: d.paymentRecordId || d.orderDbId || d.paymentId || null,
//           amountPaise: Number(d.amountPaise ?? d.amountDuePaise ?? d.amount ?? 0),
//           productName: d.productName || d.product || "Product",
//           auctionId: d.auctionId || d.auction || queryAuctionId || null,
//           checkoutUrl: d.checkoutUrl || null,
//           depositPaise: Number(d.depositPaise ?? 0),
//         };

//         if (!cancelled) {
//           console.log("✅ checkoutInfo:", info);
//           setCheckoutInfo(info);
//         }
//       } catch (err) {
//         console.error("Checkout fetch error:", err);
//         toast.error(err?.response?.data?.message || err?.message || "Failed to load checkout info");
//         setCheckoutInfo(null);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     fetchInfo();
//     return () => (cancelled = true);
//   }, [queryOrderId, queryAuctionId, token]);

//   const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

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
//     if (!checkoutInfo) return toast.error("Checkout info not loaded");

//     const { fullName, mobile, line1, city, state, pincode } = form;
//     if (!fullName || !mobile || !line1 || !city || !state || !pincode) return toast.error("Please fill all address fields");

//     const { razorpayOrderId, amountPaise, productName, auctionId, paymentRecordId, depositPaise } = checkoutInfo;
//     const amountDuePaise = Math.max(0, Number(amountPaise) - Number(depositPaise || 0));
//     if (!razorpayOrderId || amountDuePaise <= 0) return toast.error("No payment required or server order missing");

//     setProcessing(true);
//     const loaded = await loadRazorpayScript();
//     if (!loaded) {
//       toast.error("Razorpay SDK failed to load");
//       setProcessing(false);
//       return;
//     }

//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
//       amount: amountDuePaise,
//       currency: "INR",
//       name: "SPARKLE & SHINE",
//       description: productName,
//       image: logoPng,
//       order_id: razorpayOrderId,
//       handler: async function (response) {
//         try {
//           setProcessing(true);
//           const body = {
//             action: "verify",
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_signature: response.razorpay_signature,
//             address: form,
//             auctionId,
//             paymentRecordId,
//           };
//           const headers = token ? { Authorization: `Bearer ${token}` } : {};
//           const verifyRes = await axios.post(VERIFY_URL, body, { headers });

//           if (verifyRes?.data?.success) {
//             toast.success("Payment verified");
//             window.location.href = `/payment-success?paymentId=${encodeURIComponent(response.razorpay_payment_id)}`;
//           } else {
//             console.error("verify failed", verifyRes?.data);
//             toast.error(verifyRes?.data?.message || "Payment verification failed");
//             window.location.href = "/payment-failed";
//           }
//         } catch (err) {
//           console.error("Verification error:", err);
//           toast.error("Server verification failed");
//           window.location.href = "/payment-failed";
//         } finally {
//           setProcessing(false);
//         }
//       },
//       prefill: { name: form.fullName, contact: form.mobile },
//       theme: { color: "#2563eb" },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.on("payment.failed", (res) => {
//       console.error("Payment failed:", res);
//       toast.error(res.error?.description || "Payment failed");
//       window.location.href = "/payment-failed";
//     });

//     try {
//       rzp.open();
//     } catch (err) {
//       console.error("Razorpay open error:", err);
//       toast.error("Unable to open payment window");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const handleFinalizeNoPay = async (e) => {
//     e?.preventDefault();
//     if (!checkoutInfo) return;
//     const { paymentRecordId, auctionId } = checkoutInfo;
//     const { fullName, mobile, line1, city, state, pincode } = form;
//     if (!fullName || !mobile || !line1 || !city || !state || !pincode) return toast.error("Please fill all address fields");

//     setProcessing(true);
//     try {
//       const body = { action: "finalizeNoPay", auctionId, paymentRecordId, address: form };
//       const headers = token ? { Authorization: `Bearer ${token}` } : {};
//       const res = await axios.post(VERIFY_URL, body, { headers });
//       if (res?.data?.success) {
//         toast.success("Order finalized (no payment)");
//         window.location.href = "/payment-success?mode=nopay";
//       } else {
//         console.error("finalizeNoPay failed:", res?.data);
//         toast.error(res?.data?.message || "Finalize failed");
//       }
//     } catch (err) {
//       console.error("Finalize error:", err);
//       toast.error("Server finalize failed");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   if (loading) return <div className="min-h-screen flex items-center justify-center p-6">Loading checkout...</div>;
//   if (!checkoutInfo) return <div className="min-h-screen flex items-center justify-center p-6">Checkout info not found</div>;

//   const { amountPaise, productName, depositPaise } = checkoutInfo;
//   const amountRupees = paiseToRupeesStr(amountPaise);
//   const depositRupees = paiseToRupeesStr(depositPaise || 0);
//   const amountDuePaise = Math.max(0, Number(amountPaise) - Number(depositPaise || 0));
//   const amountDueRupees = paiseToRupeesStr(amountDuePaise);

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
//       <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 space-y-4">
//         <h2 className="text-2xl font-bold text-gray-700 text-center">🧾 Checkout</h2>
//         <p className="text-center text-gray-500">Product: <span className="font-semibold">{productName}</span></p>
//         <div className="text-center">
//           <div className="text-sm text-gray-600">Final price</div>
//           <div className="text-lg font-bold">₹{amountRupees}</div>
//           <div className="text-sm text-gray-500">Deposit applied: ₹{depositRupees}</div>
//           <div className="mt-2 text-lg font-semibold text-blue-600">Amount to pay: ₹{amountDueRupees}</div>
//         </div>

//         {Number(amountDuePaise) <= 0 ? (
//           <form onSubmit={handleFinalizeNoPay} className="space-y-3">
//             <input required name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className="w-full border rounded-lg p-2" />
//             <input required name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} className="w-full border rounded-lg p-2" />
//             <input required name="line1" placeholder="Address Line" value={form.line1} onChange={handleChange} className="w-full border rounded-lg p-2" />
//             <div className="grid grid-cols-2 gap-2">
//               <input required name="city" placeholder="City" value={form.city} onChange={handleChange} className="w-full border rounded-lg p-2" />
//               <input required name="state" placeholder="State" value={form.state} onChange={handleChange} className="w-full border rounded-lg p-2" />
//             </div>
//             <input required name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className="w-full border rounded-lg p-2" />
//             <button type="submit" disabled={processing} className="w-full bg-green-600 text-white py-2 rounded-lg">{processing ? "Processing..." : "Confirm (No Payment)"}</button>
//           </form>
//         ) : (
//           <form onSubmit={handlePayment} className="space-y-3">
//             <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className="w-full border rounded-lg p-2" />
//             <input name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} className="w-full border rounded-lg p-2" />
//             <input name="line1" placeholder="Address Line" value={form.line1} onChange={handleChange} className="w-full border rounded-lg p-2" />
//             <div className="grid grid-cols-2 gap-2">
//               <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="w-full border rounded-lg p-2" />
//               <input name="state" placeholder="State" value={form.state} onChange={handleChange} className="w-full border rounded-lg p-2" />
//             </div>
//             <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className="w-full border rounded-lg p-2" />
//             <button type="submit" disabled={processing} className="w-full bg-blue-600 text-white py-2 rounded-lg">{processing ? "Opening payment..." : "Pay Now"}</button>
//           </form>
//         )}

//         <p className="text-sm text-gray-500 text-center">Secure payments powered by <span className="font-semibold">Razorpay</span></p>
//       </div>
//     </div>
//   );
// }

// src/pages/Checkout.jsx
// src/pages/Checkout.jsx
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSearchParams, useNavigate } from "react-router-dom";
import logoPng from "/logo.png"; // adjust path if needed

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
const VERIFY_URL = `${API_BASE}/payment2/verify`; // server endpoint (must be server-side)

function paiseToRupeesStr(paise) {
  if (paise == null) return "0.00";
  const n = Number(paise);
  if (!Number.isFinite(n)) return String(paise);
  return (n / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Safe loader for Razorpay checkout.js — avoids duplicate script tag creation.
 * Resolves true on success, false on failure.
 */
function loadRazorpaySdk() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    // check if a loader is already in progress
    const existing = document.querySelector('script[data-razorpay="checkout-sdk"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.setAttribute("data-razorpay", "checkout-sdk");
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const queryOrderId = params.get("orderId") || params.get("order_id") || params.get("order") || null;
  const queryAuctionId = params.get("auctionId") || params.get("auction") || params.get("auction_id") || null;

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState(null);
  const [form, setForm] = useState({ fullName: "", mobile: "", line1: "", city: "", state: "", pincode: "" });
  const sdkLoadedRef = useRef(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    let cancelled = false;

    async function fetchInfo() {
      setLoading(true);
      try {
        if (!queryOrderId && !queryAuctionId) throw new Error("Missing orderId or auctionId in the URL.");

        const body = { action: "fetch", orderId: queryOrderId, auctionId: queryAuctionId };
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await axios.post(VERIFY_URL, body, { headers, timeout: 10000 });

        if (!res?.data?.success) {
          throw new Error(res?.data?.message || "Failed to fetch checkout info");
        }

        const d = res.data.data || {};
        const info = {
          razorpayOrderId: d.razorpayOrderId || d.orderId || null,
          paymentRecordId: d.paymentRecordId || d.orderDbId || d.paymentId || null,
          // amountPaise is the final amount; amountDuePaise is included by server as well
          amountPaise: Number(d.amountPaise ?? d.amount ?? 0),
          amountDuePaise: Number(d.amountDuePaise ?? d.amountDue ?? Math.max(0, Number(d.amountPaise ?? d.amount ?? 0) - Number(d.depositPaise ?? 0))),
          productName: d.productName || d.product || "Product",
          auctionId: d.auctionId || d.auction || queryAuctionId || null,
          checkoutUrl: d.checkoutUrl || null, // frontend route if server provides
          paymentLinkUrl: d.paymentLinkUrl || d.paymentLinkUrl || null, // direct razorpay short_url if present
          depositPaise: Number(d.depositPaise ?? 0),
        };

        if (!cancelled) {
          setCheckoutInfo(info);

          // If server returned an explicit frontend checkout URL and you prefer auto-redirect,
          // uncomment below to auto navigate:
          // if (info.checkoutUrl) {
          //   window.location.href = info.checkoutUrl;
          //   return;
          // }

          // If server returned a direct razorpay paymentLinkUrl and you prefer auto-redirect,
          // you can auto-redirect as well. For safety, we're not auto-redirecting — we show a button.
        }
      } catch (err) {
        console.error("Checkout fetch error:", err);
        // Distinguish network error (backend down) vs server application error
        if (err?.code === "ERR_NETWORK" || (err?.request && !err?.response)) {
          toast.error("Cannot reach server — please ensure backend is running and VITE_API_BASE_URL is correct.");
        } else {
          toast.error(err?.response?.data?.message || err?.message || "Failed to load checkout info");
        }
        setCheckoutInfo(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchInfo();
    return () => (cancelled = true);
  }, [queryOrderId, queryAuctionId, token]);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  // Open Razorpay popup using order_id (server-created)
  const openRazorpayPopup = async () => {
    const { razorpayOrderId, amountDuePaise, productName, auctionId, paymentRecordId } = checkoutInfo || {};
    if (!razorpayOrderId) return toast.error("Server did not provide order id for popup checkout");

    // ensure form fields filled
    const { fullName, mobile, line1, city, state, pincode } = form;
    if (!fullName || !mobile || !line1 || !city || !state || !pincode) return toast.error("Please fill all address fields");

    setProcessing(true);
    try {
      if (!sdkLoadedRef.current) {
        const ok = await loadRazorpaySdk();
        sdkLoadedRef.current = ok;
      }
      if (!sdkLoadedRef.current) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_z8VHG8l7lxwyLF", // public key only
        amount: amountDuePaise,
        currency: "INR",
        name: "SPARKLE & SHINE",
        description: productName,
        image: logoPng,
        order_id: razorpayOrderId,
        handler: async function (response) {
          // Called on successful payment in popup
          try {
            setProcessing(true);
            const body = {
              action: "verify",
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              address: form,
              auctionId,
              paymentRecordId,
            };
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const verifyRes = await axios.post(VERIFY_URL, body, { headers, timeout: 10000 });

            if (verifyRes?.data?.success) {
              toast.success("Payment verified");
              // redirect to success page (you can change to your route)
              window.location.href = `/payment-success?paymentId=${encodeURIComponent(response.razorpay_payment_id)}`;
            } else {
              console.error("verify failed", verifyRes?.data);
              toast.error(verifyRes?.data?.message || "Payment verification failed");
              window.location.href = "/payment-failed";
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Server verification failed");
            window.location.href = "/payment-failed";
          } finally {
            setProcessing(false);
          }
        },
        prefill: { name: form.fullName, contact: form.mobile },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (res) => {
        console.error("Payment failed:", res);
        toast.error(res.error?.description || "Payment failed");
        window.location.href = "/payment-failed";
      });
      rzp.open();
    } catch (err) {
      console.error("Razorpay open error:", err);
      toast.error("Unable to open payment window");
    } finally {
      setProcessing(false);
    }
  };

  // Redirect to Razorpay-hosted payment link (short_url) returned by server
  const redirectToPaymentLink = () => {
    const { paymentLinkUrl } = checkoutInfo || {};
    if (!paymentLinkUrl) return toast.error("Payment link not available");
    // Use window.location.assign so browser navigates to external page
    window.location.assign(paymentLinkUrl);
  };

  // If amount due is zero -> finalize without payment
  const handleFinalizeNoPay = async (e) => {
    e?.preventDefault();
    if (!checkoutInfo) return;
    const { paymentRecordId, auctionId } = checkoutInfo;
    const { fullName, mobile, line1, city, state, pincode } = form;
    if (!fullName || !mobile || !line1 || !city || !state || !pincode) return toast.error("Please fill all address fields");

    setProcessing(true);
    try {
      const body = { action: "finalizeNoPay", auctionId, paymentRecordId, address: form };
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(VERIFY_URL, body, { headers, timeout: 10000 });
      if (res?.data?.success) {
        toast.success("Order finalized (no payment)");
        window.location.href = "/payment-success?mode=nopay";
      } else {
        console.error("finalizeNoPay failed:", res?.data);
        toast.error(res?.data?.message || "Finalize failed");
      }
    } catch (err) {
      console.error("Finalize error:", err);
      if (err?.code === "ERR_NETWORK" || (err?.request && !err?.response)) {
        toast.error("Cannot reach server — please ensure backend is running.");
      } else {
        toast.error("Server finalize failed");
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center p-6">Loading checkout...</div>;
  if (!checkoutInfo) return <div className="min-h-screen flex items-center justify-center p-6">Checkout info not found</div>;

  const { amountPaise, productName, depositPaise, amountDuePaise, paymentLinkUrl, checkoutUrl } = checkoutInfo;
  const amountRupees = paiseToRupeesStr(amountPaise);
  const depositRupees = paiseToRupeesStr(depositPaise || 0);
  const duePaise = typeof amountDuePaise === "number" ? amountDuePaise : Math.max(0, Number(amountPaise || 0) - Number(depositPaise || 0));
  const amountDueRupees = paiseToRupeesStr(duePaise);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-700 text-center">🧾 Checkout</h2>
        <p className="text-center text-gray-500">Product: <span className="font-semibold">{productName}</span></p>

        <div className="text-center">
          <div className="text-sm text-gray-600">Final price</div>
          <div className="text-lg font-bold">₹{amountRupees}</div>
          <div className="text-sm text-gray-500">Deposit applied: ₹{depositRupees}</div>
          <div className="mt-2 text-lg font-semibold text-blue-600">Amount to pay: ₹{amountDueRupees}</div>
        </div>

        {Number(duePaise) <= 0 ? (
          <form onSubmit={handleFinalizeNoPay} className="space-y-3">
            <input required name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className="w-full border rounded-lg p-2" />
            <input required name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} className="w-full border rounded-lg p-2" />
            <input required name="line1" placeholder="Address Line" value={form.line1} onChange={handleChange} className="w-full border rounded-lg p-2" />
            <div className="grid grid-cols-2 gap-2">
              <input required name="city" placeholder="City" value={form.city} onChange={handleChange} className="w-full border rounded-lg p-2" />
              <input required name="state" placeholder="State" value={form.state} onChange={handleChange} className="w-full border rounded-lg p-2" />
            </div>
            <input required name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className="w-full border rounded-lg p-2" />
            <button type="submit" disabled={processing} className="w-full bg-green-600 text-white py-2 rounded-lg">{processing ? "Processing..." : "Confirm (No Payment)"}</button>
          </form>
        ) : (
          <div>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className="w-full border rounded-lg p-2" />
              <input name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} className="w-full border rounded-lg p-2" />
              <input name="line1" placeholder="Address Line" value={form.line1} onChange={handleChange} className="w-full border rounded-lg p-2" />
              <div className="grid grid-cols-2 gap-2">
                <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="w-full border rounded-lg p-2" />
                <input name="state" placeholder="State" value={form.state} onChange={handleChange} className="w-full border rounded-lg p-2" />
              </div>
              <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className="w-full border rounded-lg p-2" />

              {/* Choose the most appropriate action based on what backend returned */}
              {paymentLinkUrl ? (
                // If backend provided a direct Razorpay-hosted short_url, show redirect button
                <button onClick={redirectToPaymentLink} disabled={processing} className="w-full bg-blue-600 text-white py-2 rounded-lg">
                  {processing ? "Redirecting..." : "Pay on Razorpay"}
                </button>
              ) : (
                // Otherwise use popup flow with order_id
                <button onClick={openRazorpayPopup} disabled={processing} className="w-full bg-blue-600 text-white py-2 rounded-lg">
                  {processing ? "Opening payment..." : "Pay Now"}
                </button>
              )}
            </form>
            {/* If you want to show frontend checkout URL (your own UI route) */}
            {checkoutUrl ? (
              <div className="mt-2 text-center">
                <button
                  onClick={() => (window.location.href = checkoutUrl)}
                  className="text-sm text-gray-600 underline"
                >
                  Continue to checkout page
                </button>
              </div>
            ) : null}
          </div>
        )}

        <p className="text-sm text-gray-500 text-center">Secure payments powered by <span className="font-semibold">Razorpay</span></p>
      </div>
    </div>
  );
}
