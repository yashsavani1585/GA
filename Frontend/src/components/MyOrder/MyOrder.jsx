// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { getUserIdFromToken } from "../../utils/auth.js"; 


// const formatIN = (n) => Number(n || 0).toLocaleString("en-IN");

// const USER_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/order`
//   : "http://localhost:4000/api/order";
// const MyOrder = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//    useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const userId = getUserIdFromToken();
//         if (!userId) {
//           console.error("User not logged in");
//           setLoading(false);
//           return;
//         }

//                const res = await axios.get(`${USER_BASE}/my-orders/${userId}`);


//         if (res.data.success) {
//           setOrders(res.data.orders);
//         }
//       } catch (err) {
//         console.error("Error fetching orders:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);


//   if (loading) {
//     return <p className="text-center py-20">Loading orders...</p>;
//   }

//   return (
//     <div className="max-w-5xl mx-auto my-10 px-4">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>

//       {orders.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-lg shadow-md">
//           <img
//             src="https://placehold.co/300x200?text=No+Orders"
//             alt="No Orders"
//             className="mx-auto mb-4"
//           />
//           <p className="text-gray-500 text-lg">
//             You have not placed any orders yet.
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => (
//             <div
//               key={order._id}
//               className="bg-white shadow-md rounded-lg p-4"
//             >
//               {/* Items */}
//               {order.items.map((item, idx) => {
//                 const pricing = JSON.parse(item.pricing || "{}");
//                 return (
//                   <div
//                     key={idx}
//                     className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0"
//                   >
//                     {/* Product Image & Name */}
//                     <div className="flex items-center space-x-4">
//                       <img
//                         src={item.image}
//                         alt={item.sku}
//                         className="w-24 h-24 object-cover rounded-lg"
//                       />
//                       <div>
//                         <h2 className="text-lg font-semibold text-gray-800">
//                           SKU: {item.sku}
//                         </h2>
//                         <p className="text-gray-500">
//                           Qty: {item.quantity} | Size: {item.ringSize} |{" "}
//                           {item.goldCarat}
//                         </p>
//                         <p className="text-gray-500">Order ID: {order._id}</p>
//                       </div>
//                     </div>

//                     {/* Payment & Delivery Status */}
//                     <div className="mt-4 md:mt-0 text-right space-y-1">
//                       <p className="text-lg font-bold text-gray-800">
//                         ₹{formatIN(pricing.finalPrice)}
//                       </p>
//                       <p
//                         className={`font-medium ${
//                           order.status === "SUCCESS"
//                             ? "text-green-600"
//                             : order.status === "FAILED"
//                             ? "text-red-600"
//                             : "text-yellow-600"
//                         }`}
//                       >
//                         Payment: {order.status}
//                       </p>
//                       <p className="font-medium text-blue-600">
//                         Delivery: {order.deliveryStatus || "Order Placed"}
//                       </p>
//                       <p className="text-gray-400 text-sm">
//                         Placed On: {new Date(order.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}

//               {/* Delivery & Price Summary */}
//               <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Delivery Details */}
//                 <div className="bg-gray-50 rounded-lg shadow p-4">
//                   <h2 className="text-lg font-semibold mb-2">
//                     Delivery Details
//                   </h2>
//                   <p className="font-bold text-gray-800">
//                     {order.address.recipientName}
//                   </p>
//                   <p className="text-gray-600">
//                     {order.address.houseNo}, {order.address.street},{" "}
//                     {order.address.locality} - {order.address.pincode}
//                   </p>
//                   <p className="mt-1 text-gray-700">
//                     <span className="font-medium">Mobile:</span>{" "}
//                     {order.address.mobile}
//                   </p>
//                 </div>

//                 {/* Price Summary */}
//                 <div className="bg-gray-50 rounded-lg shadow p-4">
//                   <h2 className="text-lg font-semibold mb-2">Price Summary</h2>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span>Item Total</span>
//                       <span>₹{formatIN(JSON.parse(order.items[0].pricing).originalPrice)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Delivery Charge</span>
//                       <span>Free</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>GST & Taxes</span>
//                       <span>
//                         ₹{formatIN(JSON.parse(order.items[0].pricing).gstAmount)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between mt-2 font-bold text-gray-800 border-t pt-2">
//                       <span>Total Payable</span>
//                       <span>₹{formatIN(order.amount)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyOrder;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { getUserIdFromToken } from "../../utils/auth.js";
// import ReCAPTCHA from "react-google-recaptcha";

// const formatIN = (n) => Number(n || 0).toLocaleString("en-IN");

// const USER_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/order`
//   : "http://localhost:4000/api/order";

// const PAYMENT_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/payment`
//   : "http://localhost:4000/api/payment";

// // ✅ Use proper reCAPTCHA site key
// const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LfRQc8rAAAAAIU4Ytl3Lnl0vvAWO0m0HeXwt2ci";

// const MyOrder = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cancelModal, setCancelModal] = useState({ open: false, order: null });
//   const [captchaValue, setCaptchaValue] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const fetchOrders = async () => {
//     try {
//       const userId = getUserIdFromToken();
//       if (!userId) {
//         console.error("User not logged in");
//         setLoading(false);
//         return;
//       }

//       const res = await axios.get(`${USER_BASE}/my-orders/${userId}`);
//       if (res.data.success && Array.isArray(res.data.orders)) setOrders(res.data.orders);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const openCancelModal = (order) => {
//     setCaptchaValue(null);
//     setCancelModal({ open: true, order });
//   };

//   const closeCancelModal = () => {
//     setCancelModal({ open: false, order: null });
//     setIsProcessing(false);
//   };

//   const handleConfirmCancel = async () => {
//     const order = cancelModal.order;
//     if (!order) return;

//     const hoursPassed = (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;
//     if (hoursPassed > 24) {
//       alert("Cannot cancel order after 24 hours.");
//       closeCancelModal();
//       return;
//     }

//     if (!captchaValue) {
//       alert("Please verify you are not a robot.");
//       return;
//     }

//     try {
//       setIsProcessing(true);
//       const res = await axios.post(`${PAYMENT_BASE}/refund`, {
//         order_id: order.order_id,
//         token: captchaValue,
//       });

//       if (res.data.success) {
//         alert("Order canceled and payment refunded successfully!");
//         fetchOrders();
//         closeCancelModal();
//       } else {
//         alert("Failed to cancel order: " + res.data.message);
//         setIsProcessing(false);
//       }
//     } catch (err) {
//       console.error("Error canceling order:", err);
//       alert("Failed to cancel order: " + (err.response?.data?.message || err.message));
//       setIsProcessing(false);
//     }
//   };

//   if (loading) return <p className="text-center py-20">Loading orders...</p>;

//   return (
//     <div className="max-w-5xl mx-auto my-10 px-4">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>

//       {orders.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-lg shadow-md">
//           <img src="https://placehold.co/300x200?text=No+Orders" alt="No Orders" className="mx-auto mb-4" />
//           <p className="text-gray-500 text-lg">You have not placed any orders yet.</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => {
//             const hoursPassed = (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;
//             const canCancel = order.status === "SUCCESS" && hoursPassed <= 24;

//             return (
//               <div key={order._id} className="bg-white shadow-md rounded-lg p-4">
//                 {order.items.map((item, idx) => {
//                   let pricing = {};
//                   if (item.pricing) {
//                     try {
//                       pricing = typeof item.pricing === "string" ? JSON.parse(item.pricing) : item.pricing;
//                     } catch {
//                       pricing = {};
//                     }
//                   }

//                   return (
//                     <div key={idx} className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
//                       <div className="flex items-center space-x-4">
//                         <img src={item.image} alt={item.sku} className="w-24 h-24 object-cover rounded-lg" />
//                         <div>
//                           <h2 className="text-lg font-semibold text-gray-800">SKU: {item.sku}</h2>
//                           <p className="text-gray-500">Qty: {item.quantity} | Size: {item.ringSize} | {item.goldCarat}</p>
//                           <p className="text-gray-500">Order ID: {order._id}</p>
//                         </div>
//                       </div>

//                       <div className="mt-4 md:mt-0 text-right space-y-1">
//                         <p className="text-lg font-bold text-gray-800">₹{formatIN(pricing.finalPrice)}</p>
//                         <p className={`font-medium ${order.status === "SUCCESS" ? "text-green-600" : order.status === "FAILED" ? "text-red-600" : "text-yellow-600"}`}>
//                           Payment: {order.status}
//                         </p>
//                         <p className="font-medium text-blue-600">Delivery: {order.deliveryStatus || "Order Placed"}</p>
//                         <p className="text-gray-400 text-sm">Placed On: {new Date(order.createdAt).toLocaleDateString()}</p>

//                         {canCancel && (
//                           <button
//                             onClick={() => openCancelModal(order)}
//                             className="mt-2 px-3 py-1 rounded-md text-white font-semibold bg-red-600 hover:bg-red-700"
//                           >
//                             Cancel Order
//                           </button>
//                         )}
//                         {!canCancel && order.status === "SUCCESS" && (
//                           <p className="mt-2 text-gray-500 text-sm">Cancel unavailable (24 hours passed)</p>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {cancelModal.open && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">Confirm Order Cancellation</h2>
//             <p className="mb-2">Please verify you are not a robot:</p>
//             <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={(value) => setCaptchaValue(value)} />
//             <div className="flex justify-end space-x-2 mt-4">
//               <button onClick={closeCancelModal} className="px-4 py-2 rounded-md bg-gray-400 text-white" disabled={isProcessing}>Close</button>
//               <button onClick={handleConfirmCancel} className="px-4 py-2 rounded-md bg-red-600 text-white" disabled={!captchaValue || isProcessing}>
//                 {isProcessing ? "Processing..." : "Confirm"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyOrder;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { getUserIdFromToken } from "../../utils/auth.js";
// import ReCAPTCHA from "react-google-recaptcha";

// const formatIN = (n) => Number(n || 0).toLocaleString("en-IN");

// const USER_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/order`
//   : "http://localhost:4000/api/order";

// const PAYMENT_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/payment`
//   : "http://localhost:4000/api/payment";

// const RECAPTCHA_SITE_KEY =
//   import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LfRQc8rAAAAAIU4Ytl3Lnl0vvAWO0m0HeXwt2ci";

// // Status badge colors mapping
// const statusClasses = {
//   "Order Placed": "bg-yellow-100 text-yellow-800 ring-yellow-200",
//   Processing: "bg-blue-100 text-blue-800 ring-blue-200",
//   "Quality Check": "bg-indigo-100 text-indigo-800 ring-indigo-200",
//   Packing: "bg-purple-100 text-purple-800 ring-purple-200",
//   Shipped: "bg-cyan-100 text-cyan-800 ring-cyan-200",
//   "Out for Delivery": "bg-orange-100 text-orange-800 ring-orange-200",
//   Delivered: "bg-green-100 text-green-800 ring-green-200",
//   Failed: "bg-red-100 text-red-800 ring-red-200",
//   SUCCESS: "bg-green-50 text-green-800 ring-green-200",
//   PENDING: "bg-gray-100 text-gray-700 ring-gray-200",
// };

// const MyOrder = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cancelModal, setCancelModal] = useState({ open: false, order: null });
//   const [captchaValue, setCaptchaValue] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const fetchOrders = async () => {
//     try {
//       const userId = getUserIdFromToken();
//       if (!userId) {
//         setLoading(false);
//         return;
//       }

//       const res = await axios.get(`${USER_BASE}/my-orders/${userId}`);
//       if (res.data.success && Array.isArray(res.data.orders)) {
//         setOrders(res.data.orders);
//       }
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const openCancelModal = (order) => {
//     setCaptchaValue(null);
//     setCancelModal({ open: true, order });
//   };

//   const closeCancelModal = () => {
//     setCancelModal({ open: false, order: null });
//     setIsProcessing(false);
//   };

//   const handleConfirmCancel = async () => {
//     const order = cancelModal.order;
//     if (!order) return;

//     const hoursPassed = (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;
//     if (hoursPassed > 24) {
//       alert("Cannot cancel order after 24 hours.");
//       closeCancelModal();
//       return;
//     }

//     if (!captchaValue) {
//       alert("Please verify you are not a robot.");
//       return;
//     }

//     try {
//       setIsProcessing(true);
//       const res = await axios.post(`${PAYMENT_BASE}/refund`, {
//         order_id: order.order_id,
//         token: captchaValue,
//       });

//       if (res.data.success) {
//         alert("Order canceled and payment refunded successfully!");
//         fetchOrders();
//         closeCancelModal();
//       } else {
//         alert("Failed to cancel order: " + res.data.message);
//         setIsProcessing(false);
//       }
//     } catch (err) {
//       console.error("Error canceling order:", err);
//       alert("Failed to cancel order: " + (err.response?.data?.message || err.message));
//       setIsProcessing(false);
//     }
//   };

//   if (loading) return <p className="text-center py-20">Loading orders...</p>;

//   return (
//     <div className="max-w-6xl mx-auto my-10 px-4">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>

//       {orders.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-lg shadow-md">
//           <img
//             src="https://placehold.co/300x200?text=No+Orders"
//             alt="No Orders"
//             className="mx-auto mb-4"
//           />
//           <p className="text-gray-500 text-lg">You have not placed any orders yet.</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => {
//             const hoursPassed =
//               (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;

//             // ✅ Cancel button sirf 24 hours ke andar show hoga
//             const canCancel = hoursPassed <= 24;

//             return (
//               <div
//                 key={order.order_id}
//                 className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row md:justify-between md:items-start"
//               >
//                 {/* Left: Items */}
//                 <div className="flex-1 space-y-4">
//                   {order.items.map((item, idx) => (
//                     <div key={idx} className="flex items-center space-x-4">
//                       <img
//                         src={item.image}
//                         alt={item.sku}
//                         className="w-24 h-24 object-cover rounded-lg"
//                       />
//                       <div>
//                         <h2 className="text-lg font-semibold text-gray-800">
//                           SKU: {item.sku}
//                         </h2>
//                         <p className="text-gray-500">
//                           Qty: {item.quantity} | Size: {item.ringSize} |{" "}
//                           {item.goldCarat}
//                         </p>
//                         <p className="text-gray-500">Order ID: {order.order_id}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Right: Summary */}
//                 <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-start md:items-end space-y-2">
//                   <p className="text-xl font-bold text-gray-800">
//                     ₹{formatIN(order.amount)}
//                   </p>
//                   <p
//                     className={`font-medium ${
//                       statusClasses[order.paymentStatus] ||
//                       "bg-gray-100 text-gray-700 ring-gray-200"
//                     } px-3 py-1 rounded-lg ring-1 inline-block`}
//                   >
//                     Payment: {order.paymentStatus}
//                   </p>
//                   <p
//                     className={`font-medium ${
//                       statusClasses[order.deliveryStatus] ||
//                       "bg-gray-100 text-gray-700 ring-gray-200"
//                     } px-3 py-1 rounded-lg ring-1 inline-block`}
//                   >
//                     Delivery: {order.deliveryStatus}
//                   </p>
//                   <p className="text-gray-400 text-sm">
//                     Placed On: {new Date(order.createdAt).toLocaleDateString()}
//                   </p>

//                   {/* ✅ 24 hours ke andar hi Cancel button dikhega */}
//                   {canCancel && (
//                     <button
//                       onClick={() => openCancelModal(order)}
//                       className="mt-2 px-4 py-1 rounded-md text-white bg-red-600 hover:bg-red-700"
//                     >
//                       Cancel Order
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Cancel Modal */}
//       {cancelModal.open && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">Confirm Order Cancellation</h2>
//             <p className="mb-2">Please verify you are not a robot:</p>
//             <ReCAPTCHA
//               sitekey={RECAPTCHA_SITE_KEY}
//               onChange={(value) => setCaptchaValue(value)}
//             />
//             <div className="flex justify-end space-x-2 mt-4">
//               <button
//                 onClick={closeCancelModal}
//                 className="px-4 py-2 rounded-md bg-gray-400 text-white"
//                 disabled={isProcessing}
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleConfirmCancel}
//                 className="px-4 py-2 rounded-md bg-red-600 text-white"
//                 disabled={!captchaValue || isProcessing}
//               >
//                 {isProcessing ? "Processing..." : "Confirm"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyOrder;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { getUserIdFromToken } from "../../utils/auth.js";
// import ReCAPTCHA from "react-google-recaptcha";

// const formatIN = (n) => Number(n || 0).toLocaleString("en-IN");

// const USER_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/order`
//   : "http://localhost:4000/api/order";

// const PAYMENT_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/payment`
//   : "http://localhost:4000/api/payment";

// const RECAPTCHA_SITE_KEY =
//   import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LfRQc8rAAAAAIU4Ytl3Lnl0vvAWO0m0HeXwt2ci";

// // Status badge colors mapping
// const statusClasses = {
//   "Order Placed": "bg-yellow-100 text-yellow-800 ring-yellow-200",
//   Processing: "bg-blue-100 text-blue-800 ring-blue-200",
//   "Quality Check": "bg-indigo-100 text-indigo-800 ring-indigo-200",
//   Packing: "bg-purple-100 text-purple-800 ring-purple-200",
//   Shipped: "bg-cyan-100 text-cyan-800 ring-cyan-200",
//   "Out for Delivery": "bg-orange-100 text-orange-800 ring-orange-200",
//   Delivered: "bg-green-100 text-green-800 ring-green-200",
//   Failed: "bg-red-100 text-red-800 ring-red-200",
//   SUCCESS: "bg-green-50 text-green-800 ring-green-200",
//   PENDING: "bg-gray-100 text-gray-700 ring-gray-200",
// };

// const MyOrder = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cancelModal, setCancelModal] = useState({ open: false, order: null });
//   const [captchaValue, setCaptchaValue] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const fetchOrders = async () => {
//     try {
//       const userId = getUserIdFromToken();
//       if (!userId) {
//         setLoading(false);
//         return;
//       }

//       const res = await axios.get(`${USER_BASE}/my-orders/${userId}`);
//       if (res.data.success && Array.isArray(res.data.orders)) {
//         setOrders(res.data.orders);
//       }
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const openCancelModal = (order) => {
//     setCaptchaValue(null);
//     setCancelModal({ open: true, order });
//   };

//   const closeCancelModal = () => {
//     setCancelModal({ open: false, order: null });
//     setIsProcessing(false);
//   };

// const handleConfirmCancel = async () => {
//   const order = cancelModal.order;
//   if (!order) return;

//   // ✅ Check 24-hour cancellation limit
//   const hoursPassed = (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;
//   if (hoursPassed > 24) {
//     alert("Cannot cancel order after 24 hours.");
//     closeCancelModal();
//     return;
//   }

//   // ✅ Check reCAPTCHA
//   if (!captchaValue) {
//     alert("Please verify you are not a robot.");
//     return;
//   }

//   // ✅ Check Payment ID exists
//   const paymentId = order.payment_id || order.razorpayPaymentId || razorpayPaymentId;
//   if (!paymentId) {
//     alert("Payment ID not found. Cannot process refund.");
//     return;
//   }

//   try {
//     setIsProcessing(true);

//     // ✅ Call backend refund API
//     const res = await axios.post(`${PAYMENT_BASE}/refund`, {
//       order_id: order.order_id,       // internal order ID
//       payment_id: paymentId,          // Razorpay payment ID
//       token: captchaValue,            // reCAPTCHA token
//     });

//     if (res.data.success) {
//       alert(`Order canceled and payment refunded successfully! Refund ID: ${res.data.refund_id}`);
//       fetchOrders();       // refresh orders list
//       closeCancelModal();
//     } else {
//       alert("Failed to cancel order: " + res.data.message);
//       setIsProcessing(false);
//     }
//   } catch (err) {
//     console.error("Error canceling order:", err);
//     alert("Failed to cancel order: " + (err.response?.data?.message || err.message));
//     setIsProcessing(false);
//   }
// };


//   if (loading) return <p className="text-center py-20">Loading orders...</p>;

//   return (
//     <div className="max-w-6xl mx-auto my-10 px-4">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>

//       {orders.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-lg shadow-md">
//           <img
//             src="https://placehold.co/300x200?text=No+Orders"
//             alt="No Orders"
//             className="mx-auto mb-4"
//           />
//           <p className="text-gray-500 text-lg">You have not placed any orders yet.</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => {
//             const hoursPassed =
//               (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;

//             const canCancel = hoursPassed <= 24;

//             return (
//               <div
//                 key={order.order_id}
//                 className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row md:justify-between md:items-start"
//               >
//                 {/* Left: Items */}
//                 <div className="flex-1 space-y-4">
//                   {order.items.map((item, idx) => (
//                     <div key={idx} className="flex items-center space-x-4">
//                       <img
//                         src={item.image}
//                         alt={item.sku}
//                         className="w-24 h-24 object-cover rounded-lg"
//                       />
//                       <div>
//                         <h2 className="text-lg font-semibold text-gray-800">
//                           SKU: {item.sku}
//                         </h2>
//                         <p className="text-gray-500">
//                           Qty: {item.quantity} | Size: {item.ringSize} | {item.goldCarat}
//                         </p>
//                         <p className="text-gray-500">Order ID: {order.order_id}</p>
//                         <p className="text-gray-500">
//                           Payment ID: {order.payment_id || "N/A"}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Right: Summary */}
//                 <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-start md:items-end space-y-2">
//                   <p className="text-xl font-bold text-gray-800">
//                     ₹{formatIN(order.amount)}
//                   </p>
//                   <p
//                     className={`font-medium ${
//                       statusClasses[order.paymentStatus] ||
//                       "bg-gray-100 text-gray-700 ring-gray-200"
//                     } px-3 py-1 rounded-lg ring-1 inline-block`}
//                   >
//                     Payment: {order.paymentStatus}
//                   </p>
//                   <p
//                     className={`font-medium ${
//                       statusClasses[order.deliveryStatus] ||
//                       "bg-gray-100 text-gray-700 ring-gray-200"
//                     } px-3 py-1 rounded-lg ring-1 inline-block`}
//                   >
//                     Delivery: {order.deliveryStatus}
//                   </p>
//                   <p className="text-gray-400 text-sm">
//                     Placed On: {new Date(order.createdAt).toLocaleDateString()}
//                   </p>

//                   {canCancel && (
//                     <button
//                       onClick={() => openCancelModal(order)}
//                       className="mt-2 px-4 py-1 rounded-md text-white bg-red-600 hover:bg-red-700"
//                     >
//                       Cancel Order
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Cancel Modal */}
//       {cancelModal.open && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">Confirm Order Cancellation</h2>
//             <p className="mb-2">Please verify you are not a robot:</p>
//             <ReCAPTCHA
//               sitekey={RECAPTCHA_SITE_KEY}
//               onChange={(value) => setCaptchaValue(value)}
//             />
//             <div className="flex justify-end space-x-2 mt-4">
//               <button
//                 onClick={closeCancelModal}
//                 className="px-4 py-2 rounded-md bg-gray-400 text-white"
//                 disabled={isProcessing}
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleConfirmCancel}
//                 className="px-4 py-2 rounded-md bg-red-600 text-white"
//                 disabled={!captchaValue || isProcessing}
//               >
//                 {isProcessing ? "Processing..." : "Confirm"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyOrder;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { getUserIdFromToken } from "../../utils/auth.js";
// import ReCAPTCHA from "react-google-recaptcha";

// const formatIN = (n) => Number(n || 0).toLocaleString("en-IN");

// const USER_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/order`
//   : "http://localhost:4000/api/order";

// const PAYMENT_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/payment`
//   : "http://localhost:4000/api/payment";

// const RECAPTCHA_SITE_KEY =
//   import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LfRQc8rAAAAAIU4Ytl3Lnl0vvAWO0m0HeXwt2ci";

// const statusClasses = {
//   "Order Placed": "bg-yellow-100 text-yellow-800 ring-yellow-200",
//   Processing: "bg-blue-100 text-blue-800 ring-blue-200",
//   "Quality Check": "bg-indigo-100 text-indigo-800 ring-indigo-200",
//   Packing: "bg-purple-100 text-purple-800 ring-purple-200",
//   Shipped: "bg-cyan-100 text-cyan-800 ring-cyan-200",
//   "Out for Delivery": "bg-orange-100 text-orange-800 ring-orange-200",
//   Delivered: "bg-green-100 text-green-800 ring-green-200",
//   Failed: "bg-red-100 text-red-800 ring-red-200",
//   SUCCESS: "bg-green-50 text-green-800 ring-green-200",
//   PENDING: "bg-gray-100 text-gray-700 ring-gray-200",
// };

// const MyOrder = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cancelModal, setCancelModal] = useState({ open: false, order: null });
//   const [captchaValue, setCaptchaValue] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const fetchOrders = async () => {
//     try {
//       const userId = getUserIdFromToken();
//       if (!userId) return setLoading(false);

//       const res = await axios.get(`${USER_BASE}/my-orders/${userId}`);
//       if (res.data.success && Array.isArray(res.data.orders)) {
//         setOrders(res.data.orders);
//       }
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const openCancelModal = (order) => {
//     setCaptchaValue(null);
//     setCancelModal({ open: true, order });
//   };

//   const closeCancelModal = () => {
//     setCancelModal({ open: false, order: null });
//     setIsProcessing(false);
//   };

//   const handleConfirmCancel = async () => {
//     const order = cancelModal.order;
//     if (!order) return;

//     const hoursPassed = (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;
//     if (hoursPassed > 24) {
//       alert("Cannot cancel order after 24 hours.");
//       closeCancelModal();
//       return;
//     }

//     if (!captchaValue) {
//       alert("Please verify you are not a robot.");
//       return;
//     }

//     // Use order.payment_id OR order.payment?.paymentId
//     const paymentId = order.payment_id || order.payment?.paymentId;
//     if (!paymentId) {
//       alert("Payment ID not found. Cannot process refund.");
//       return;
//     }

//     try {
//       setIsProcessing(true);

//       const res = await axios.post(`${PAYMENT_BASE}/refund`, {
//         order_id: order.order_id,
//         payment_id: paymentId,
//         token: captchaValue,
//       });

//       if (res.data.success) {
//         alert(`Order canceled and payment refunded successfully! Refund ID: ${res.data.refund_id}`);
//         fetchOrders();
//         closeCancelModal();
//       } else {
//         alert("Failed to cancel order: " + res.data.message);
//         setIsProcessing(false);
//       }
//     } catch (err) {
//       console.error("Error canceling order:", err);
//       alert("Failed to cancel order: " + (err.response?.data?.message || err.message));
//       setIsProcessing(false);
//     }
//   };

//   if (loading) return <p className="text-center py-20">Loading orders...</p>;

//   return (
//     <div className="max-w-6xl mx-auto my-10 px-4">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>

//       {orders.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-lg shadow-md">
//           <img
//             src="https://placehold.co/300x200?text=No+Orders"
//             alt="No Orders"
//             className="mx-auto mb-4"
//           />
//           <p className="text-gray-500 text-lg">You have not placed any orders yet.</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => {
//             const hoursPassed = (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;
//             const canCancel = hoursPassed <= 24;

//             return (
//               <div
//                 key={order.order_id}
//                 className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row md:justify-between md:items-start"
//               >
//                 <div className="flex-1 space-y-4">
//                   {order.items.map((item, idx) => (
//                     <div key={idx} className="flex items-center space-x-4">
//                       <img
//                         src={item.image}
//                         alt={item.sku}
//                         className="w-24 h-24 object-cover rounded-lg"
//                       />
//                       <div>
//                         <h2 className="text-lg font-semibold text-gray-800">
//                           SKU: {item.sku}
//                         </h2>
//                         <p className="text-gray-500">
//                           Qty: {item.quantity} | Size: {item.ringSize} | {item.goldCarat}
//                         </p>
//                         <p className="text-gray-500">Order ID: {order.order_id}</p>
//                         <p className="text-gray-500">
//                           Payment ID: {order.payment_id || order.payment?.paymentId || "N/A"}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-start md:items-end space-y-2">
//                   <p className="text-xl font-bold text-gray-800">₹{formatIN(order.amount)}</p>
//                   <p
//                     className={`font-medium ${
//                       statusClasses[order.paymentStatus] || "bg-gray-100 text-gray-700 ring-gray-200"
//                     } px-3 py-1 rounded-lg ring-1 inline-block`}
//                   >
//                     Payment: {order.paymentStatus}
//                   </p>
//                   <p
//                     className={`font-medium ${
//                       statusClasses[order.deliveryStatus] || "bg-gray-100 text-gray-700 ring-gray-200"
//                     } px-3 py-1 rounded-lg ring-1 inline-block`}
//                   >
//                     Delivery: {order.deliveryStatus}
//                   </p>
//                   <p className="text-gray-400 text-sm">
//                     Placed On: {new Date(order.createdAt).toLocaleDateString()}
//                   </p>

//                   {canCancel && (
//                     <button
//                       onClick={() => openCancelModal(order)}
//                       className="mt-2 px-4 py-1 rounded-md text-white bg-red-600 hover:bg-red-700"
//                     >
//                       Cancel Order
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {cancelModal.open && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">Confirm Order Cancellation</h2>
//             <p className="mb-2">Please verify you are not a robot:</p>
//             <ReCAPTCHA
//               sitekey={RECAPTCHA_SITE_KEY}
//               onChange={(value) => setCaptchaValue(value)}
//             />
//             <div className="flex justify-end space-x-2 mt-4">
//               <button
//                 onClick={closeCancelModal}
//                 className="px-4 py-2 rounded-md bg-gray-400 text-white"
//                 disabled={isProcessing}
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleConfirmCancel}
//                 className="px-4 py-2 rounded-md bg-red-600 text-white"
//                 disabled={!captchaValue || isProcessing}
//               >
//                 {isProcessing ? "Processing..." : "Confirm"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyOrder;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { getUserIdFromToken } from "../../utils/auth.js";
// import ReCAPTCHA from "react-google-recaptcha";

// const formatIN = (n) => Number(n || 0).toLocaleString("en-IN");

// const USER_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/order`
//   : "http://localhost:4000/api/order";

// const PAYMENT_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/payment`
//   : "http://localhost:4000/api/payment";

// const RECAPTCHA_SITE_KEY =
//   import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LfRQc8rAAAAAIU4Ytl3Lnl0vvAWO0m0HeXwt2ci";

// const statusClasses = {
//   "Order Placed": "bg-yellow-100 text-yellow-800 ring-yellow-200",
//   Processing: "bg-blue-100 text-blue-800 ring-blue-200",
//   "Quality Check": "bg-indigo-100 text-indigo-800 ring-indigo-200",
//   Packing: "bg-purple-100 text-purple-800 ring-purple-200",
//   Shipped: "bg-cyan-100 text-cyan-800 ring-cyan-200",
//   "Out for Delivery": "bg-orange-100 text-orange-800 ring-orange-200",
//   Delivered: "bg-green-100 text-green-800 ring-green-200",
//   Failed: "bg-red-100 text-red-800 ring-red-200",
//   SUCCESS: "bg-green-50 text-green-800 ring-green-200",
//   PENDING: "bg-gray-100 text-gray-700 ring-gray-200",
// };

// const MyOrder = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cancelModal, setCancelModal] = useState({ open: false, order: null });
//   const [captchaValue, setCaptchaValue] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Fetch orders
//   const fetchOrders = async () => {
//     try {
//       const userId = getUserIdFromToken();
//       if (!userId) return setLoading(false);

//       const res = await axios.get(`${USER_BASE}/my-orders/${userId}`);
//       if (res.data.success && Array.isArray(res.data.orders)) {
//         setOrders(res.data.orders);
//       }
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // Cancel Modal Open
//   const openCancelModal = (order) => {
//     setCaptchaValue(null);
//     setCancelModal({ open: true, order });
//   };

//   // Cancel Modal Close
//   const closeCancelModal = () => {
//     setCancelModal({ open: false, order: null });
//     setIsProcessing(false);
//   };

//   // Confirm Cancel
//   const handleConfirmCancel = async () => {
//     const order = cancelModal.order;
//     if (!order) return;

//     // Check 24 hours limit
//     const hoursPassed =
//       (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;
//     if (hoursPassed > 24) {
//       alert("❌ Cannot cancel order after 24 hours.");
//       closeCancelModal();
//       return;
//     }

//     if (!captchaValue) {
//       alert("⚠️ Please verify you are not a robot.");
//       return;
//     }

//     // ✅ Use order._id as Payment ID
//     const paymentId = order._id;
//     if (!paymentId) {
//       alert("Payment ID not found. Cannot process refund.");
//       return;
//     }

//     try {
//       setIsProcessing(true);

//       const res = await axios.post(`${PAYMENT_BASE}/refund`, {
//         order_id: order.order_id,
//         payment_id: order.paymentId,
//         token: captchaValue,
//       });

//       if (res.data.success) {
//         alert(
//           `✅ Order canceled and payment refunded successfully! Refund ID: ${res.data.refund_id}`
//         );
//         fetchOrders();
//         closeCancelModal();
//       } else {
//         alert("❌ Failed to cancel order: " + res.data.message);
//         setIsProcessing(false);
//       }
//     } catch (err) {
//       console.error("Error canceling order:", err);
//       alert("❌ Failed to cancel order: " + (err.response?.data?.message || err.message));
//       setIsProcessing(false);
//     }
//   };

//   if (loading) return <p className="text-center py-20">Loading orders...</p>;

//   return (
//     <div className="max-w-6xl mx-auto my-10 px-4">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>

//       {orders.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-lg shadow-md">
//           <img
//             src="https://placehold.co/300x200?text=No+Orders"
//             alt="No Orders"
//             className="mx-auto mb-4"
//           />
//           <p className="text-gray-500 text-lg">
//             You have not placed any orders yet.
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => {
//             const hoursPassed =
//               (Date.now() - new Date(order.createdAt).getTime()) /
//               1000 /
//               60 /
//               60;
//             const canCancel = hoursPassed <= 24;

//             return (
//               <div
//                 key={order.order_id}
//                 className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row md:justify-between md:items-start"
//               >
//                 {/* Order Items */}
//                 <div className="flex-1 space-y-4">
//                   {order.items.map((item, idx) => (
//                     <div key={idx} className="flex items-center space-x-4">
//                       <img
//                         src={item.image}
//                         alt={item.sku}
//                         className="w-24 h-24 object-cover rounded-lg"
//                       />
//                       <div>
//                         <h2 className="text-lg font-semibold text-gray-800">
//                           SKU: {item.sku}
//                         </h2>
//                         <p className="text-gray-500">
//                           Qty: {item.quantity} | Size: {item.ringSize} |{" "}
//                           {item.goldCarat}
//                         </p>
//                         <p className="text-gray-500">
//                           Order ID: {order.order_id}
//                         </p>
//                         {/* ✅ Show MongoDB _id instead of paymentId */}
//                         <p className="text-gray-500">Payment ID: {order._id}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Order Info */}
//                 <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-start md:items-end space-y-2">
//                   <p className="text-xl font-bold text-gray-800">
//                     ₹{formatIN(order.amount)}
//                   </p>
//                   <p
//                     className={`font-medium ${
//                       statusClasses[order.paymentStatus] ||
//                       "bg-gray-100 text-gray-700 ring-gray-200"
//                     } px-3 py-1 rounded-lg ring-1 inline-block`}
//                   >
//                     Payment: {order.paymentStatus}
//                   </p>
//                   <p
//                     className={`font-medium ${
//                       statusClasses[order.deliveryStatus] ||
//                       "bg-gray-100 text-gray-700 ring-gray-200"
//                     } px-3 py-1 rounded-lg ring-1 inline-block`}
//                   >
//                     Delivery: {order.deliveryStatus}
//                   </p>
//                   <p className="text-gray-400 text-sm">
//                     Placed On:{" "}
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </p>

//                   {/* ✅ Only show cancel button if within 24 hrs */}
//                   {canCancel && (
//                     <button
//                       onClick={() => openCancelModal(order)}
//                       className="mt-2 px-4 py-1 rounded-md text-white bg-red-600 hover:bg-red-700"
//                     >
//                       Cancel Order
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Cancel Modal */}
//       {cancelModal.open && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">
//               Confirm Order Cancellation
//             </h2>
//             <p className="mb-2">Please verify you are not a robot:</p>
//             <ReCAPTCHA
//               sitekey={RECAPTCHA_SITE_KEY}
//               onChange={(value) => setCaptchaValue(value)}
//             />
//             <div className="flex justify-end space-x-2 mt-4">
//               <button
//                 onClick={closeCancelModal}
//                 className="px-4 py-2 rounded-md bg-gray-400 text-white"
//                 disabled={isProcessing}
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleConfirmCancel}
//                 className="px-4 py-2 rounded-md bg-red-600 text-white"
//                 disabled={!captchaValue || isProcessing}
//               >
//                 {isProcessing ? "Processing..." : "Confirm"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyOrder;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { getUserIdFromToken } from "../../utils/auth.js";
// import ReCAPTCHA from "react-google-recaptcha";

// const formatIN = (n) => Number(n || 0).toLocaleString("en-IN");

// const USER_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/order`
//   : "http://localhost:4000/api/order";

// const PAYMENT_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/payment`
//   : "http://localhost:4000/api/payment";

// const RECAPTCHA_SITE_KEY =
//   import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LfRQc8rAAAAAIU4Ytl3Lnl0vvAWO0m0HeXwt2ci";

// const statusClasses = {
//   "Order Placed": "bg-yellow-100 text-yellow-800 ring-yellow-200",
//   Processing: "bg-blue-100 text-blue-800 ring-blue-200",
//   "Quality Check": "bg-indigo-100 text-indigo-800 ring-indigo-200",
//   Packing: "bg-purple-100 text-purple-800 ring-purple-200",
//   Shipped: "bg-cyan-100 text-cyan-800 ring-cyan-200",
//   "Out for Delivery": "bg-orange-100 text-orange-800 ring-orange-200",
//   Delivered: "bg-green-100 text-green-800 ring-green-200",
//   Failed: "bg-red-100 text-red-800 ring-red-200",
//   SUCCESS: "bg-green-50 text-green-800 ring-green-200",
//   PENDING: "bg-gray-100 text-gray-700 ring-gray-200",
// };

// const MyOrder = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cancelModal, setCancelModal] = useState({ open: false, order: null });
//   const [captchaValue, setCaptchaValue] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Fetch orders
//   const fetchOrders = async () => {
//     try {
//       const userId = getUserIdFromToken();
//       if (!userId) return setLoading(false);

//       const res = await axios.get(`${USER_BASE}/my-orders/${userId}`);
//       if (res.data.success && Array.isArray(res.data.orders)) {
//         setOrders(res.data.orders);
//       }
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const openCancelModal = (order) => {
//     setCaptchaValue(null);
//     setCancelModal({ open: true, order });
//   };

//   const closeCancelModal = () => {
//     setCancelModal({ open: false, order: null });
//     setIsProcessing(false);
//   };

//   const handleConfirmCancel = async () => {
//     const order = cancelModal.order;
//     if (!order) return;

//     // 24 hours cancellation check
//     const hoursPassed =
//       (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;
//     if (hoursPassed > 24) {
//       alert("❌ Cannot cancel order after 24 hours.");
//       closeCancelModal();
//       return;
//     }

//     if (!captchaValue) {
//       alert("⚠️ Please verify you are not a robot.");
//       return;
//     }

//     try {
//       setIsProcessing(true);

//       const res = await axios.post(`${PAYMENT_BASE}/refund`, {
//         order_id: order.order_id,
//         payment_id: order._id, // use MongoDB order _id for refund
//         token: captchaValue,
//       });

//       if (res.data.success) {
//         alert(
//           `✅ Order canceled and payment refunded successfully! Refund ID: ${res.data.refund_id}`
//         );
//         fetchOrders();
//         closeCancelModal();
//       } else {
//         alert("❌ Failed to cancel order: " + res.data.message);
//         setIsProcessing(false);
//       }
//     } catch (err) {
//       console.error("Error canceling order:", err);
//       alert("❌ Failed to cancel order: " + (err.response?.data?.message || err.message));
//       setIsProcessing(false);
//     }
//   };

//   if (loading) return <p className="text-center py-20">Loading orders...</p>;

//   return (
//     <div className="max-w-6xl mx-auto my-10 px-4">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>

//       {orders.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-lg shadow-md">
//           <img
//             src="https://placehold.co/300x200?text=No+Orders"
//             alt="No Orders"
//             className="mx-auto mb-4"
//           />
//           <p className="text-gray-500 text-lg">
//             You have not placed any orders yet.
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => {
//             const hoursPassed =
//               (Date.now() - new Date(order.createdAt).getTime()) /
//               1000 /
//               60 /
//               60;
//             const canCancel = hoursPassed <= 24;

//             return (
//               <div
//                 key={order._id}
//                 className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row md:justify-between md:items-start"
//               >
//                 <div className="flex-1 space-y-4">
//                   {order.items.map((item, idx) => (
//                     <div key={idx} className="flex items-center space-x-4">
//                       <img
//                         src={item.image}
//                         alt={item.sku || "Product"}
//                         className="w-24 h-24 object-cover rounded-lg"
//                       />
//                       <div>
//                         <h2 className="text-lg font-semibold text-gray-800">
//                           SKU: {item.sku || item.productId}
//                         </h2>
//                         <p className="text-gray-500">
//                           Qty: {item.quantity} | Size: {item.ringSize || "-"} |{" "}
//                           {item.goldCarat || "-"}
//                         </p>
//                         <p className="text-gray-500">Order ID: {order.order_id}</p>
//                         <p className="text-gray-500">Payment ID: {order._id}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-start md:items-end space-y-2">
//                   <p className="text-xl font-bold text-gray-800">
//                     ₹{formatIN(order.amount)}
//                   </p>
//                   <p
//                     className={`font-medium ${
//                       statusClasses[order.paymentStatus] ||
//                       "bg-gray-100 text-gray-700 ring-gray-200"
//                     } px-3 py-1 rounded-lg ring-1 inline-block`}
//                   >
//                     Payment: {order.paymentStatus}
//                   </p>
//                   <p
//                     className={`font-medium ${
//                       statusClasses[order.deliveryStatus] ||
//                       "bg-gray-100 text-gray-700 ring-gray-200"
//                     } px-3 py-1 rounded-lg ring-1 inline-block`}
//                   >
//                     Delivery: {order.deliveryStatus}
//                   </p>
//                   <p className="text-gray-400 text-sm">
//                     Placed On: {new Date(order.createdAt).toLocaleDateString()}
//                   </p>

//                   {canCancel && (
//                     <button
//                       onClick={() => openCancelModal(order)}
//                       className="mt-2 px-4 py-1 rounded-md text-white bg-red-600 hover:bg-red-700"
//                     >
//                       Cancel Order
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {cancelModal.open && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">
//               Confirm Order Cancellation
//             </h2>
//             <p className="mb-2">Please verify you are not a robot:</p>
//             <ReCAPTCHA
//               sitekey={RECAPTCHA_SITE_KEY}
//               onChange={(value) => setCaptchaValue(value)}
//             />
//             <div className="flex justify-end space-x-2 mt-4">
//               <button
//                 onClick={closeCancelModal}
//                 className="px-4 py-2 rounded-md bg-gray-400 text-white"
//                 disabled={isProcessing}
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleConfirmCancel}
//                 className="px-4 py-2 rounded-md bg-red-600 text-white"
//                 disabled={!captchaValue || isProcessing}
//               >
//                 {isProcessing ? "Processing..." : "Confirm"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyOrder;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { getUserIdFromToken } from "../../utils/auth.js";

// const formatIN = (n) => Number(n || 0).toLocaleString("en-IN");

// const USER_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/order`
//   : "http://localhost:4000/api/order";

// const PAYMENT_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/payment`
//   : "http://localhost:4000/api/payment";

// const statusClasses = {
//   "Order Placed": "bg-yellow-100 text-yellow-800 ring-yellow-200",
//   Processing: "bg-blue-100 text-blue-800 ring-blue-200",
//   "Quality Check": "bg-indigo-100 text-indigo-800 ring-indigo-200",
//   Packing: "bg-purple-100 text-purple-800 ring-purple-200",
//   Shipped: "bg-cyan-100 text-cyan-800 ring-cyan-200",
//   "Out for Delivery": "bg-orange-100 text-orange-800 ring-orange-200",
//   Delivered: "bg-green-100 text-green-800 ring-green-200",
//   Failed: "bg-red-100 text-red-800 ring-red-200",
//   SUCCESS: "bg-green-50 text-green-800 ring-green-200",
//   PENDING: "bg-gray-100 text-gray-700 ring-gray-200",
// };

// const MyOrder = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cancelModal, setCancelModal] = useState({ open: false, order: null });
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Fetch orders
//   const fetchOrders = async () => {
//     try {
//       const userId = getUserIdFromToken();
//       if (!userId) return setLoading(false);

//       const res = await axios.get(`${USER_BASE}/my-orders/${userId}`);
//       if (res.data.success && Array.isArray(res.data.orders)) {
//         setOrders(res.data.orders);
//       }
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const openCancelModal = (order) => {
//     setCancelModal({ open: true, order });
//   };

//   const closeCancelModal = () => {
//     setCancelModal({ open: false, order: null });
//     setIsProcessing(false);
//   };

//   const handleConfirmCancel = async () => {
//     const order = cancelModal.order;
//     if (!order) return;

//     // 24 hours cancellation check
//     const hoursPassed =
//       (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;
//     if (hoursPassed > 24) {
//       alert("❌ Cannot cancel order after 24 hours.");
//       closeCancelModal();
//       return;
//     }

//     try {
//       setIsProcessing(true);

//       const res = await axios.post(`${PAYMENT_BASE}/refund`, {
//         order_id: order.order_id,
//         payment_id: order._id, // use MongoDB order _id for refund
//       });

//       if (res.data.success) {
//         alert(
//           `✅ Order canceled and payment refunded successfully! Refund ID: ${res.data.refund_id}`
//         );
//         fetchOrders();
//         closeCancelModal();
//       } else {
//         alert("❌ Failed to cancel order: " + res.data.message);
//         setIsProcessing(false);
//       }
//     } catch (err) {
//       console.error("Error canceling order:", err);
//       alert("❌ Failed to cancel order: " + (err.response?.data?.message || err.message));
//       setIsProcessing(false);
//     }
//   };

//   if (loading) return <p className="text-center py-20">Loading orders...</p>;

//   return (
//     <div className="max-w-6xl mx-auto my-10 px-4">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>

//       {orders.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-lg shadow-md">
//           <img
//             src="https://placehold.co/300x200?text=No+Orders"
//             alt="No Orders"
//             className="mx-auto mb-4"
//           />
//           <p className="text-gray-500 text-lg">
//             You have not placed any orders yet.
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => {
//             const hoursPassed =
//               (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;
//             const canCancel = hoursPassed <= 24;

//             return (
//               <div
//                 key={order._id}
//                 className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row md:justify-between md:items-start"
//               >
//                 <div className="flex-1 space-y-4">
//                   {order.items.map((item, idx) => (
//                     <div key={idx} className="flex items-center space-x-4">
//                       <img
//                         src={item.image}
//                         alt={item.sku || "Product"}
//                         className="w-24 h-24 object-cover rounded-lg"
//                       />
//                       <div>
//                         <h2 className="text-lg font-semibold text-gray-800">
//                           SKU: {item.sku || item.productId}
//                         </h2>
//                         <p className="text-gray-500">
//                           Qty: {item.quantity} | Size: {item.ringSize || "-"} |{" "}
//                           {item.goldCarat || "-"}
//                         </p>
//                         <p className="text-gray-500">Order ID: {order.order_id}</p>
//                         <p className="text-gray-500">Payment ID: {order._id}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-start md:items-end space-y-2">
//                   <p className="text-xl font-bold text-gray-800">
//                     ₹{formatIN(order.amount)}
//                   </p>
//                   <p
//                     className={`font-medium ${
//                       statusClasses[order.paymentStatus] ||
//                       "bg-gray-100 text-gray-700 ring-gray-200"
//                     } px-3 py-1 rounded-lg ring-1 inline-block`}
//                   >
//                     Payment: {order.paymentStatus}
//                   </p>
//                   <p
//                     className={`font-medium ${
//                       statusClasses[order.deliveryStatus] ||
//                       "bg-gray-100 text-gray-700 ring-gray-200"
//                     } px-3 py-1 rounded-lg ring-1 inline-block`}
//                   >
//                     Delivery: {order.deliveryStatus}
//                   </p>
//                   <p className="text-gray-400 text-sm">
//                     Placed On: {new Date(order.createdAt).toLocaleDateString()}
//                   </p>

//                   {canCancel && (
//                     <button
//                       onClick={() => openCancelModal(order)}
//                       className="mt-2 px-4 py-1 rounded-md text-white bg-red-600 hover:bg-red-700"
//                     >
//                       Cancel Order
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {cancelModal.open && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">
//               Confirm Order Cancellation
//             </h2>

//             <div className="flex justify-end space-x-2 mt-4">
//               <button
//                 onClick={closeCancelModal}
//                 className="px-4 py-2 rounded-md bg-gray-400 text-white"
//                 disabled={isProcessing}
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleConfirmCancel}
//                 className="px-4 py-2 rounded-md bg-red-600 text-white"
//                 disabled={isProcessing}
//               >
//                 {isProcessing ? "Processing..." : "Confirm"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyOrder;

// src/components/orders/MyOrder.jsx
// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { getUserIdFromToken } from "../../utils/auth.js";
// import ReCAPTCHA from "react-google-recaptcha";

// const formatIN = (n) => Number(n || 0).toLocaleString("en-IN");

// const USER_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/order`
//   : "http://localhost:4000/api/order";

// const PAYMENT_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/payment`
//   : "http://localhost:4000/api/payment";

// const RECAPTCHA_SITE_KEY =
//   import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LfRQc8rAAAAAIU4Ytl3Lnl0vvAWO0m0HeXwt2ci";

// const statusClasses = {
//   "Order Placed": "bg-yellow-100 text-yellow-800 ring-yellow-200",
//   Processing: "bg-blue-100 text-blue-800 ring-blue-200",
//   "Quality Check": "bg-indigo-100 text-indigo-800 ring-indigo-200",
//   Packing: "bg-purple-100 text-purple-800 ring-purple-200",
//   Shipped: "bg-cyan-100 text-cyan-800 ring-cyan-200",
//   "Out for Delivery": "bg-orange-100 text-orange-800 ring-orange-200",
//   Delivered: "bg-green-100 text-green-800 ring-green-200",
//   Failed: "bg-red-100 text-red-800 ring-red-200",
//   SUCCESS: "bg-green-50 text-green-800 ring-green-200",
//   PENDING: "bg-gray-100 text-gray-700 ring-gray-200",
//   refunded: "bg-gray-200 text-gray-700 ring-gray-300",
// };

// export default function MyOrder() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cancelModal, setCancelModal] = useState({ open: false, order: null });
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [captchaToken, setCaptchaToken] = useState(null);
//   const [errorMsg, setErrorMsg] = useState("");
//   const recaptchaRef = useRef(null);

//   // Fetch orders
//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const userId = getUserIdFromToken();
//       if (!userId) {
//         setOrders([]);
//         return;
//       }
//       const res = await axios.get(`${USER_BASE}/my-orders/${userId}`);
//       if (res.data?.success && Array.isArray(res.data.orders)) {
//         setOrders(res.data.orders);
//       } else {
//         setOrders([]);
//       }
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const openCancelModal = (order) => {
//     setErrorMsg("");
//     setCaptchaToken(null);
//     if (recaptchaRef.current) recaptchaRef.current.reset();
//     setCancelModal({ open: true, order });
//   };

//   const closeCancelModal = () => {
//     setCancelModal({ open: false, order: null });
//     setIsProcessing(false);
//     setCaptchaToken(null);
//     setErrorMsg("");
//     if (recaptchaRef.current) recaptchaRef.current.reset();
//   };

//   const onCaptchaChange = (token) => {
//     setCaptchaToken(token);
//     setErrorMsg("");
//   };

//   // const handleConfirmCancel = async () => {
//   //   const order = cancelModal.order;
//   //   if (!order) return;

//   //   const hoursPassed =
//   //     (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;
//   //   if (hoursPassed > 24) {
//   //     setErrorMsg("❌ Cannot cancel order after 24 hours.");
//   //     return;
//   //   }

//   //   if (!captchaToken) {
//   //     setErrorMsg("⚠️ Please complete the captcha to confirm cancellation.");
//   //     return;
//   //   }

//   //   try {
//   //     setIsProcessing(true);
//   //     setErrorMsg("");

//   //     const res = await axios.post(`${PAYMENT_BASE}/refund`, {
//   //       order_id: order.order_id,
//   //       payment_id: order.paymentRef,
//   //       token: captchaToken,
//   //     });

//   //     if (res.data?.success) {
//   //       await fetchOrders();
//   //       closeCancelModal();
//   //       alert(`✅ ${res.data.message}${res.data.refund_id ? ` Refund ID: ${res.data.refund_id}` : ""}`);
//   //     } else {
//   //       setErrorMsg("❌ Failed to cancel order: " + (res.data?.message || "Unknown error"));
//   //       setIsProcessing(false);
//   //     }
//   //   } catch (err) {
//   //     console.error("Error canceling order:", err);
//   //     const serverMsg = err.response?.data?.message || err.message || "Server error";
//   //     setErrorMsg("❌ Failed to cancel order: " + serverMsg);
//   //     setIsProcessing(false);
//   //   }
//   // };

// const handleConfirmCancel = async () => {
//   const order = cancelModal?.order;
//   if (!order) {
//     setErrorMsg("⚠️ No order selected for cancellation.");
//     return;
//   }

//   // ---- 24-hour cancellation check ----
//   const hoursPassed =
//     (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;
//   if (hoursPassed > 24) {
//     setErrorMsg("❌ Cannot cancel order after 24 hours.");
//     return;
//   }

//   // ---- CAPTCHA validation ----
//   if (!captchaToken) {
//     setErrorMsg("⚠️ Please complete the captcha to confirm cancellation.");
//     return;
//   }

//   try {
//     setIsProcessing(true);
//     setErrorMsg("");

//     // ---- Make refund API call ----
//     const res = await axios.post(
//       `${PAYMENT_BASE}/refund`,
//       {
//         order_id: order.order_id,
//         payment_id: order.paymentRef, // must match backend payment _id
//         token: captchaToken,
//       },
//       { headers: { "Content-Type": "application/json" } }
//     );

//     if (res.data?.success) {
//       // ---- Immediately update frontend orders state ----
//       setOrders((prevOrders) =>
//         prevOrders.map((o) =>
//           o.order_id === order.order_id
//             ? {
//                 ...o,
//                 status: "Canceled",       // deliveryStatus update
//                 payment: false,           // mark as refunded
//                 refundId: res.data.refund_id || null,
//               }
//             : o
//         )
//       );

//       closeCancelModal();

//       toast.success(
//         `✅ ${res.data.message}${
//           res.data.refund_id ? ` Refund ID: ${res.data.refund_id}` : ""
//         }`
//       );
//     } else {
//       setErrorMsg(
//         "❌ Failed to cancel order: " + (res.data?.message || "Unknown error")
//       );
//       setIsProcessing(false);
//     }
//   } catch (err) {
//     console.error("Error canceling order:", err);

//     // ---- Extract server error message safely ----
//     const serverMsg =
//       err.response?.data?.message ||
//       err.response?.data?.error ||
//       err.message ||
//       "Server error";

//     setErrorMsg("❌ Failed to cancel order: " + serverMsg);
//     setIsProcessing(false);
//   }
// };



//   if (loading) {
//     return (
//       <div className="max-w-6xl mx-auto my-10 px-4">
//         <p className="text-center py-20 text-gray-600 text-lg">Loading orders...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto my-10 px-4">
//       <h1 className="text-3xl font-bold mb-8 text-gray-900">My Orders</h1>

//       {orders.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-xl shadow-md">
//           <img
//             src="https://placehold.co/300x200?text=No+Orders"
//             alt="No Orders"
//             className="mx-auto mb-4 rounded-lg"
//           />
//           <p className="text-gray-500 text-lg">You haven’t placed any orders yet.</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => {
//             const hoursPassed =
//               (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;
//             const canCancel = hoursPassed <= 24 && order.paymentStatus !== "refunded";

//             return (
//               <div
//                 key={order._id}
//                 className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all"
//               >
//                 {/* Order header */}
//                 <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-4 mb-4">
//                   <div>
//                     <p className="text-gray-500 text-sm">Order ID: {order.order_id}</p>
//                     <p className="text-gray-500">Payment ID: {order._id}</p>
//                     <p className="text-gray-400 text-sm">Placed On: {new Date(order.createdAt).toLocaleString()}</p>
//                   </div>
//                   <p className="text-xl font-bold text-gray-800 mt-3 md:mt-0">
//                     ₹{formatIN(order.amount)}
//                   </p>
//                 </div>

//                 {/* Items */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {Array.isArray(order.items) && order.items.length ? (
//                     order.items.map((item, idx) => (
//                       <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50">
//                         <img
//                           src={item.image || "https://placehold.co/200x200?text=No+Image"}
//                           alt={item.sku || item.productId || "Product"}
//                           className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
//                         />
//                         <div>
//                           <h3 className="font-semibold text-gray-800">{item.sku || item.name}</h3>
//                           <p className="text-sm text-gray-500">
//                             Qty: {item.quantity} • Size: {item.ringSize || "-"} • {item.goldCarat || "-"}
//                           </p>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-500">No items found for this order.</p>
//                   )}
//                 </div>

//                 {/* Footer */}
//                 <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
//                   <div className="flex flex-wrap gap-2">
//                     <span
//                       className={`font-medium px-3 py-1 rounded-full ring-1 ${statusClasses[order.paymentStatus]}`}
//                     >
//                       Payment: {order.paymentStatus}
//                     </span>
//                     <span
//                       className={`font-medium px-3 py-1 rounded-full ring-1 ${statusClasses[order.deliveryStatus]}`}
//                     >
//                       Delivery: {order.deliveryStatus || "Processing"}
//                     </span>
//                   </div>

//                   {canCancel ? (
//                     <button
//                       onClick={() => openCancelModal(order)}
//                       className="px-5 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 shadow-md"
//                     >
//                       Cancel Order
//                     </button>
//                   ) : (
//                     <button
//                       disabled
//                       className="px-5 py-2 rounded-lg text-white bg-gray-400 cursor-not-allowed"
//                     >
//                       Cannot Cancel
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Cancel Modal */}
//       {cancelModal.open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
//           <div className="absolute inset-0 bg-black opacity-50" onClick={closeCancelModal} />
//           <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto p-6">
//             <h2 className="text-xl font-semibold mb-3">Confirm Order Cancellation</h2>
//             <p className="text-sm text-gray-600 mb-4">
//               Cancelling will attempt a refund. Refunds are only allowed within 24 hours of placing an order.
//             </p>

//             {errorMsg && <div className="mb-3 text-sm text-red-600">{errorMsg}</div>}

//             <ReCAPTCHA
//               ref={recaptchaRef}
//               sitekey={RECAPTCHA_SITE_KEY}
//               onChange={onCaptchaChange}
//               className="mb-4"
//             />

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={closeCancelModal}
//                 className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
//                 disabled={isProcessing}
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleConfirmCancel}
//                 className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
//                 disabled={isProcessing || !captchaToken}
//               >
//                 {isProcessing ? "Processing..." : "Confirm Cancel"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { getUserIdFromToken } from "../../utils/auth.js";
// import ReCAPTCHA from "react-google-recaptcha";
// import { toast } from "react-hot-toast";

// const formatIN = (n) => Number(n || 0).toLocaleString("en-IN");

// const USER_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/order`
//   : "http://localhost:4000/api/order";

// const PAYMENT_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/payment`
//   : "http://localhost:4000/api/payment";

// const RECAPTCHA_SITE_KEY =
//   import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LfRQc8rAAAAAIU4Ytl3Lnl0vvAWO0m0HeXwt2ci";

// export default function MyOrder() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cancelModal, setCancelModal] = useState({ open: false, order: null });
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [captchaToken, setCaptchaToken] = useState(null);
//   const [errorMsg, setErrorMsg] = useState("");
//   const recaptchaRef = useRef(null);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const userId = getUserIdFromToken();
//       if (!userId) return setOrders([]);
//       const res = await axios.get(`${USER_BASE}/my-orders/${userId}`);
//       if (res.data?.success) setOrders(res.data.orders);
//       else setOrders([]);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const openCancelModal = (order) => {
//     setErrorMsg("");
//     setCaptchaToken(null);
//     recaptchaRef.current?.reset();
//     setCancelModal({ open: true, order });
//   };

//   const closeCancelModal = () => {
//     setCancelModal({ open: false, order: null });
//     setIsProcessing(false);
//     setCaptchaToken(null);
//     setErrorMsg("");
//     recaptchaRef.current?.reset();
//   };

//   const onCaptchaChange = (token) => {
//     setCaptchaToken(token);
//     setErrorMsg("");
//   };

// const handleConfirmCancel = async () => {
//   const order = cancelModal?.order;
//   if (!order) {
//     setErrorMsg("⚠️ No order selected.");
//     return;
//   }

//   // 24-hour cancellation check
//   const hoursPassed = (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;
//   if (hoursPassed > 24) {
//     setErrorMsg("❌ Cannot cancel order after 24 hours.");
//     return;
//   }

//   if (!captchaToken) {
//     setErrorMsg("⚠️ Complete the captcha first.");
//     return;
//   }

//   if (!order.paymentRef) {
//     setErrorMsg("❌ Payment information not found for this order.");
//     return;
//   }

//   try {
//     setIsProcessing(true);
//     setErrorMsg("");

//     const token = localStorage.getItem("token"); // or your auth storage
// if (!token) {
//   setErrorMsg("⚠️ You must be logged in to cancel an order.");
//   return;
// }

//     // Refund API call — always send paymentRef
//     const res = await axios.post(
//       `${PAYMENT_BASE}/refund`,
//       {
//         order_id: order.order_id,
//         payment_id: order.paymentRef, // ✅ must use paymentRef from backend

//         token: captchaToken,
//       },
//   {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`, // ✅ auth header
//     },
//   }
//     );

//     if (res.data?.success) {
//       // Update order immediately in frontend
//       setOrders((prevOrders) =>
//         prevOrders.map((o) =>
//           o.order_id === order.order_id
//             ? {
//                 ...o,
//                 deliveryStatus: "Canceled",
//                 paymentStatus: "refunded",
//                 refundId: res.data.refund_id || null,
//               }
//             : o
//         )
//       );

//       closeCancelModal();
//       toast.success(
//         `✅ ${res.data.message}${res.data.refund_id ? ` Refund ID: ${res.data.refund_id}` : ""}`
//       );
//     } else {
//       setErrorMsg("❌ Failed to cancel order: " + (res.data?.message || "Unknown error"));
//       setIsProcessing(false);
//     }
//   } catch (err) {
//     console.error("Error canceling order:", err);
//     const serverMsg =
//       err.response?.data?.message || err.response?.data?.error || err.message || "Server error";
//     setErrorMsg("❌ Failed to cancel order: " + serverMsg);
//     setIsProcessing(false);
//   }
// };


//   return (
//     <div className="max-w-6xl mx-auto my-10 px-4">
//       <h1 className="text-3xl font-bold mb-8 text-gray-900">My Orders</h1>

//       {loading ? (
//         <p className="text-center py-20 text-gray-600 text-lg">Loading orders...</p>
//       ) : orders.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-xl shadow-md">
//           <img src="https://placehold.co/300x200?text=No+Orders" alt="No Orders" className="mx-auto mb-4 rounded-lg"/>
//           <p className="text-gray-500 text-lg">You haven’t placed any orders yet.</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => {
//             const hoursPassed = (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;
//             const canCancel = hoursPassed <= 24 && order.paymentStatus !== "refunded";
//             return (
//               <div key={order._id} className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all">
//                 <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-4 mb-4">
//                   <div>
//                     <p className="text-gray-500 text-sm">Order ID: {order.order_id}</p>
//                     <p className="text-gray-500">Payment ID: {order.paymentRef || order.order_id }</p>
//                     <p className="text-gray-400 text-sm">Placed On: {new Date(order.createdAt).toLocaleString()}</p>
//                   </div>
//                   <p className="text-xl font-bold text-gray-800 mt-3 md:mt-0">₹{formatIN(order.amount)}</p>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {order.items.map((item, idx) => (
//                     <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50">
//                       <img src={item.image || "https://placehold.co/200x200?text=No+Image"} alt={item.sku || item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"/>
//                       <div>
//                         <h3 className="font-semibold text-gray-800">{item.sku || item.name}</h3>
//                         <p className="text-sm text-gray-500">Qty: {item.quantity} • Size: {item.ringSize || "-"} • {item.goldCarat || "-"}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
//                   <div className="flex flex-wrap gap-2">
//                     <span className="font-medium px-3 py-1 rounded-full ring-1 bg-gray-100">{order.paymentStatus}</span>
//                     <span className="font-medium px-3 py-1 rounded-full ring-1 bg-yellow-100">{order.deliveryStatus || "Processing"}</span>
//                   </div>
//                   {canCancel ? (
//                     <button onClick={() => openCancelModal(order)} className="px-5 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 shadow-md">Cancel Order</button>
//                   ) : (
//                     <button disabled className="px-5 py-2 rounded-lg text-white bg-gray-400 cursor-not-allowed">Cannot Cancel</button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {cancelModal.open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
//           <div className="absolute inset-0 bg-black opacity-50" onClick={closeCancelModal} />
//           <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto p-6">
//             <h2 className="text-xl font-semibold mb-3">Confirm Order Cancellation</h2>
//             {errorMsg && <div className="mb-3 text-sm text-red-600">{errorMsg}</div>}
//             <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} onChange={onCaptchaChange} className="mb-4"/>
//             <div className="flex justify-end gap-3">
//               <button onClick={closeCancelModal} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800" disabled={isProcessing}>Close</button>
//               <button onClick={handleConfirmCancel} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white" disabled={isProcessing || !captchaToken}>
//                 {isProcessing ? "Processing..." : "Confirm Cancel"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { getUserIdFromToken } from "../../utils/auth.js";
// import ReCAPTCHA from "react-google-recaptcha";
// import { toast } from "react-hot-toast";

// const formatIN = (n) => Number(n || 0).toLocaleString("en-IN");

// const USER_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/order`
//   : "http://localhost:4000/api/order";

// const PAYMENT_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/payment`
//   : "http://localhost:4000/api/payment";

// const RECAPTCHA_SITE_KEY =
//   import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LfRQc8rAAAAAIU4Ytl3Lnl0vvAWO0m0HeXwt2ci";

// export default function MyOrder() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cancelModal, setCancelModal] = useState({ open: false, order: null });
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [captchaToken, setCaptchaToken] = useState(null);
//   const [errorMsg, setErrorMsg] = useState("");
//   const recaptchaRef = useRef(null);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const userId = getUserIdFromToken();
//       if (!userId) return setOrders([]);

//       const res = await axios.get(`${USER_BASE}/my-orders/${userId}`);

//       if (res.data?.success) {
//         setOrders(
//           res.data.orders.map((o) => {
//             // ✅ Fix image fallback for frontend
//             const mainImage =
//               o.image ||
//               o.productImage ||
//               o.auctionImage ||
//               (o.items?.length ? o.items[0].image : null) ||
//               "https://placehold.co/600x600?text=No+Image";

//             return {
//               ...o,
//               mainImage,
//               items: o.items?.map((i) => ({
//                 ...i,
//                 image:
//                   i.image ||
//                   o.productImage ||
//                   o.auctionImage ||
//                   mainImage ||
//                   "https://placehold.co/600x600?text=No+Image",
//               })),
//             };
//           })
//         );
//       } else setOrders([]);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };


//     useEffect(() => {
//   // 🔹 Refresh orders if redirected after payment
//   const params = new URLSearchParams(window.location.search);
//   const justPaid = params.get("paymentRef");
//   if (justPaid) {
//     fetchOrders();
//     toast.success("Payment verified successfully!");
//     window.history.replaceState({}, document.title, "/my-orders");
//   }
// }, []);

//   useEffect(() => {
//     fetchOrders();
//   }, []);



//   const openCancelModal = (order) => {
//     setErrorMsg("");
//     setCaptchaToken(null);
//     recaptchaRef.current?.reset();
//     setCancelModal({ open: true, order });
//   };

//   const closeCancelModal = () => {
//     setCancelModal({ open: false, order: null });
//     setIsProcessing(false);
//     setCaptchaToken(null);
//     setErrorMsg("");
//     recaptchaRef.current?.reset();
//   };

//   const onCaptchaChange = (token) => {
//     setCaptchaToken(token);
//     setErrorMsg("");
//   };

//   const handleConfirmCancel = async () => {
//     const order = cancelModal?.order;
//     if (!order) {
//       setErrorMsg("No order selected.");
//       return;
//     }

//     // ✅ 24 hour limit
//     const hoursPassed =
//       (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;

//     if (hoursPassed > 24) {
//       setErrorMsg("Cannot cancel order after 24 hours.");
//       return;
//     }

//     if (!captchaToken) {
//       setErrorMsg("Complete the Captcha first.");
//       return;
//     }

//     if (!order.paymentRef) {
//       setErrorMsg("PaymentRef missing (cannot refund).");
//       return;
//     }

//     try {
//       setIsProcessing(true);

//       const token = localStorage.getItem("token");
//       if (!token) {
//         setErrorMsg("You must be logged in.");
//         return;
//       }

//       const res = await axios.post(
//         `${PAYMENT_BASE}/refund`,
//         {
//           order_id: order.order_id,
//           payment_id: order.paymentRef, // ✅ Correct
//           token: captchaToken,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (res.data?.success) {
//         // ✅ Instantly update frontend
//         setOrders((prev) =>
//           prev.map((o) =>
//             o.order_id === order.order_id
//               ? {
//                   ...o,
//                   deliveryStatus: "Canceled",
//                   paymentStatus: "refunded",
//                 }
//               : o
//           )
//         );

//         closeCancelModal();
//         toast.success("Order canceled successfully.");
//       } else {
//         setErrorMsg(res.data?.message || "Failed to cancel");
//       }

//       setIsProcessing(false);
//     } catch (err) {
//       console.error("Cancel error:", err);
//       setErrorMsg(
//         err.response?.data?.message || "Server error while canceling."
//       );
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto my-10 px-4">
//       <h1 className="text-3xl font-bold mb-8 text-gray-900">My Orders</h1>

//       {loading ? (
//         <p className="text-center py-20 text-gray-600 text-lg">
//           Loading orders...
//         </p>
//       ) : orders.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-xl shadow-md">
//           <img
//             src="https://placehold.co/300x200?text=No+Orders"
//             className="mx-auto mb-4 rounded-lg"
//           />
//           <p className="text-gray-500 text-lg">
//             You haven’t placed any orders yet.
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => {
//             const hoursPassed =
//               (Date.now() - new Date(order.createdAt).getTime()) /
//               1000 /
//               60 /
//               60;

//             const canCancel =
//               hoursPassed <= 24 && order.paymentStatus !== "refunded";

//             return (
//               <div
//                 key={order._id}
//                 className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-xl transition"
//               >
//                 {/* HEADER */}
//                 <div className="flex flex-col md:flex-row justify-between border-b pb-4 mb-4">
//                   <div>
//                     <p className="text-gray-500 text-sm">
//                       Order ID: {order.order_id}
//                     </p>
//                     <p className="text-gray-500 text-sm">
//                       PaymentRef: {order.paymentRef || "N/A"}
//                     </p>
//                     <p className="text-gray-400 text-sm">
//                       Placed On:{" "}
//                       {new Date(order.createdAt).toLocaleString()}
//                     </p>
//                   </div>

//                   <p className="text-xl font-bold text-gray-900 mt-3 md:mt-0">
//                     ₹{formatIN(order.amount)}
//                   </p>
//                 </div>

//                 {/* ITEMS */}
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   {order.items.map((item, idx) => (
//                     <div
//                       key={idx}
//                       className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50"
//                     >
//                       <img
//                         src={item.image}
//                         className="w-24 h-24 object-cover rounded-lg"
//                       />
//                       <div>
//                         <h3 className="font-semibold text-gray-800">
//                           {item.name}
//                         </h3>
//                         <p className="text-sm text-gray-500">
//                           Qty: {item.quantity}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* FOOTER */}
//                 <div className="mt-4 flex justify-between items-center">
//                   <div className="flex gap-2">
//                     <span className="px-3 py-1 rounded-full bg-gray-100">
//                       {order.paymentStatus}
//                     </span>
//                     <span className="px-3 py-1 rounded-full bg-yellow-100">
//                       {order.deliveryStatus}
//                     </span>
//                   </div>

//                   {canCancel ? (
//                     <button
//                       onClick={() => openCancelModal(order)}
//                       className="px-5 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700"
//                     >
//                       Cancel Order
//                     </button>
//                   ) : (
//                     <button className="px-5 py-2 rounded-lg bg-gray-400 text-white cursor-not-allowed">
//                       Cannot Cancel
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* MODAL */}
//       {cancelModal.open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
//           <div
//             className="absolute inset-0 bg-black opacity-40"
//             onClick={closeCancelModal}
//           />

//           <div className="relative bg-white w-full max-w-md p-6 rounded-xl shadow-2xl">
//             <h2 className="text-xl font-semibold mb-3">
//               Confirm Order Cancellation
//             </h2>

//             {errorMsg && (
//               <div className="text-red-600 text-sm mb-2">{errorMsg}</div>
//             )}

//             <ReCAPTCHA
//               ref={recaptchaRef}
//               sitekey={RECAPTCHA_SITE_KEY}
//               onChange={onCaptchaChange}
//               className="mb-4"
//             />

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={closeCancelModal}
//                 className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//                 disabled={isProcessing}
//               >
//                 Close
//               </button>

//               <button
//                 onClick={handleConfirmCancel}
//                 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
//                 disabled={isProcessing || !captchaToken}
//               >
//                 {isProcessing ? "Processing..." : "Confirm Cancel"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { getUserIdFromToken } from "../../utils/auth.js";
// import ReCAPTCHA from "react-google-recaptcha";
// import { toast } from "react-hot-toast";

// const formatIN = (n) => Number(n || 0).toLocaleString("en-IN");

// // API BASES
// const ORDER_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/order`
//   : "http://localhost:4000/api/order";

// const PAYMENT_BASE = import.meta.env.VITE_API_BASE_URL
//   ? `${import.meta.env.VITE_API_BASE_URL}/payment`
//   : "http://localhost:4000/api/payment";

// const RECAPTCHA_SITE_KEY =
//   import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
//   "6LfRQc8rAAAAAIU4Ytl3Lnl0vvAWO0m0HeXwt2ci";

// export default function MyOrder() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cancelModal, setCancelModal] = useState({ open: false, order: null });
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [captchaToken, setCaptchaToken] = useState(null);
//   const [errorMsg, setErrorMsg] = useState("");
//   const recaptchaRef = useRef(null);

//   // ✅ Fetch user orders
//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const userId = getUserIdFromToken();
//       if (!userId) return setOrders([]);

//       // Fetch user's order list
//       const res = await axios.get(`${ORDER_BASE}/my-orders/${userId}`);

//       if (res.data?.success && res.data.orders?.length > 0) {
//         const formattedOrders = res.data.orders.map((o) => {
//           const mainImage =
//             o.image ||
//             o.productImage ||
//             o.auctionImage ||
//             (o.items?.[0]?.image ?? "https://placehold.co/600x600?text=No+Image");

//           return {
//             ...o,
//             mainImage,
//             items: o.items?.map((i) => ({
//               ...i,
//               image:
//                 i.image ||
//                 o.productImage ||
//                 o.auctionImage ||
//                 mainImage ||
//                 "https://placehold.co/600x600?text=No+Image",
//             })),
//           };
//         });

//         setOrders(formattedOrders);
//       } else {
//         setOrders([]);
//       }
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Payment success redirect handler
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const paymentRef = params.get("paymentRef");

//     if (paymentRef) {
//       const fetchPaymentDetails = async () => {
//         try {
//           const res = await axios.get(`${PAYMENT_BASE}/details/${paymentRef}`);
//           if (res.data?.success && res.data.payment) {
//             toast.success("Payment verified successfully!");
//             await fetchOrders(); // Refresh orders after verification
//           }
//         } catch (err) {
//           console.error("Payment detail fetch error:", err);
//           toast.error("Error verifying payment details.");
//         } finally {
//           // Clean URL
//           window.history.replaceState({}, document.title, "/my-orders");
//         }
//       };

//       fetchPaymentDetails();
//     }
//   }, []);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // 🔹 Cancel modal controls
//   const openCancelModal = (order) => {
//     setErrorMsg("");
//     setCaptchaToken(null);
//     recaptchaRef.current?.reset();
//     setCancelModal({ open: true, order });
//   };

//   const closeCancelModal = () => {
//     setCancelModal({ open: false, order: null });
//     setIsProcessing(false);
//     setCaptchaToken(null);
//     setErrorMsg("");
//     recaptchaRef.current?.reset();
//   };

//   const onCaptchaChange = (token) => {
//     setCaptchaToken(token);
//     setErrorMsg("");
//   };

//   // 🔹 Handle order cancel
//   const handleConfirmCancel = async () => {
//     const order = cancelModal?.order;
//     if (!order) return setErrorMsg("No order selected.");

//     const hoursPassed =
//       (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;

//     if (hoursPassed > 24)
//       return setErrorMsg("Cannot cancel order after 24 hours.");

//     if (!captchaToken) return setErrorMsg("Complete the Captcha first.");

//     if (!order.paymentRef && !order.razorpayPaymentId)
//       return setErrorMsg("Missing payment reference.");

//     try {
//       setIsProcessing(true);

//       const token = localStorage.getItem("token");
//       if (!token) return setErrorMsg("You must be logged in.");

//       const res = await axios.post(
//         `${PAYMENT_BASE}/refund`,
//         {
//           order_id: order.order_id,
//           payment_id: order.paymentRef || order.razorpayPaymentId,
//           token: captchaToken,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (res.data?.success) {
//         setOrders((prev) =>
//           prev.map((o) =>
//             o._id === order._id
//               ? { ...o, deliveryStatus: "Canceled", paymentStatus: "refunded" }
//               : o
//           )
//         );
//         closeCancelModal();
//         toast.success("Order canceled successfully!");
//       } else {
//         setErrorMsg(res.data?.message || "Failed to cancel order.");
//       }
//     } catch (err) {
//       console.error("Cancel error:", err);
//       setErrorMsg(
//         err.response?.data?.message || "Server error while canceling order."
//       );
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // ✅ UI Rendering
//   return (
//     <div className="max-w-6xl mx-auto my-10 px-4">
//       <h1 className="text-3xl font-bold mb-8 text-gray-900">My Orders</h1>

//       {loading ? (
//         <p className="text-center py-20 text-gray-600 text-lg">
//           Loading your orders...
//         </p>
//       ) : orders.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-xl shadow-md">
//           <img
//             src="https://placehold.co/300x200?text=No+Orders"
//             className="mx-auto mb-4 rounded-lg"
//           />
//           <p className="text-gray-500 text-lg">
//             You haven’t placed any orders yet.
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => {
//             const hoursPassed =
//               (Date.now() - new Date(order.createdAt).getTime()) / 3600000;
//             const canCancel =
//               hoursPassed <= 24 && order.paymentStatus !== "refunded";

//             return (
//               <div
//                 key={order._id}
//                 className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-xl transition"
//               >
//                 {/* HEADER */}
//                 <div className="flex flex-col md:flex-row justify-between border-b pb-4 mb-4">
//                   <div>
//                     <p className="text-gray-500 text-sm">
//                       Order ID: {order.order_id}
//                     </p>
//                     <p className="text-gray-500 text-sm">
//                       PaymentRef: {order.paymentRef || "N/A"}
//                     </p>
//                     <p className="text-gray-400 text-sm">
//                       Placed On: {new Date(order.createdAt).toLocaleString()}
//                     </p>
//                   </div>
//                   <p className="text-xl font-bold text-gray-900 mt-3 md:mt-0">
//                     ₹{formatIN(order.amount)}
//                   </p>
//                 </div>

//                 {/* ITEMS */}
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   {order.items.map((item, idx) => (
//                     <div
//                       key={idx}
//                       className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50"
//                     >
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className="w-24 h-24 object-cover rounded-lg"
//                       />
//                       <div>
//                         <h3 className="font-semibold text-gray-800">
//                           {item.name}
//                         </h3>
//                         <p className="text-sm text-gray-500">
//                           Qty: {item.quantity}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* FOOTER */}
//                 <div className="mt-4 flex justify-between items-center flex-wrap gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     <span className="px-3 py-1 rounded-full bg-gray-100 capitalize">
//                       {order.paymentStatus}
//                     </span>
//                     <span className="px-3 py-1 rounded-full bg-yellow-100 capitalize">
//                       {order.deliveryStatus}
//                     </span>
//                   </div>

//                   {canCancel ? (
//                     <button
//                       onClick={() => openCancelModal(order)}
//                       className="px-5 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700"
//                     >
//                       Cancel Order
//                     </button>
//                   ) : (
//                     <button className="px-5 py-2 rounded-lg bg-gray-400 text-white cursor-not-allowed">
//                       Cannot Cancel
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* CANCEL MODAL */}
//       {cancelModal.open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
//           <div
//             className="absolute inset-0 bg-black opacity-40"
//             onClick={closeCancelModal}
//           />
//           <div className="relative bg-white w-full max-w-md p-6 rounded-xl shadow-2xl">
//             <h2 className="text-xl font-semibold mb-3">
//               Confirm Order Cancellation
//             </h2>
//             {errorMsg && (
//               <div className="text-red-600 text-sm mb-2">{errorMsg}</div>
//             )}
//             <ReCAPTCHA
//               ref={recaptchaRef}
//               sitekey={RECAPTCHA_SITE_KEY}
//               onChange={onCaptchaChange}
//               className="mb-4"
//             />
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={closeCancelModal}
//                 className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//                 disabled={isProcessing}
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleConfirmCancel}
//                 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
//                 disabled={isProcessing || !captchaToken}
//               >
//                 {isProcessing ? "Processing..." : "Confirm Cancel"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// src/pages/MyOrderMerged.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getUserIdFromToken } from "../../utils/auth.js";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-hot-toast";

const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LfRQc8rAAAAAIU4Ytl3Lnl0vvAWO0m0HeXwt2ci";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ga-inx6.onrender.com/api";
const ORDER_BASE = `${API_BASE}/order`;
const PAYMENT_RECORD_BASE = `${API_BASE}/order`; // my-orders2 lives under same route: /order/my-orders2/:userId
const PAYMENT_BASE = `${API_BASE}/payment`; // for /details or refund

const rupeesFromPaise = (paise) => {
  if (paise == null) return "0.00";
  const n = Number(paise || 0) / 100;
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatIN = (n) =>
  Number(n || 0)
    .toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function MyOrderMerged() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState({ open: false, order: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const recaptchaRef = useRef(null);

  // Fetch both endpoints and merge
  const fetchMergedOrders = async () => {
    setLoading(true);
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        setOrders([]);
        return;
      }

      // parallel requests
      const [ordersRes, prRes] = await Promise.allSettled([
        axios.get(`${ORDER_BASE}/my-orders/${encodeURIComponent(userId)}`),
        axios.get(`${PAYMENT_RECORD_BASE}/my-orders2/${encodeURIComponent(userId)}`),
      ]);

      const ordersData = ordersRes.status === "fulfilled" && ordersRes.value.data?.orders ? ordersRes.value.data.orders : [];
      const prData = prRes.status === "fulfilled" && prRes.value.data?.records ? prRes.value.data.records : [];

      // build lookup maps from PaymentRecord side by keys
      const prByPaymentRef = new Map();
      const prByRazorpayOrder = new Map();
      const prByRazorpayPayment = new Map();
      const prByOrderId = new Map();

      prData.forEach((r) => {
        if (r.paymentRef) prByPaymentRef.set(String(r.paymentRef), r);
        if (r.order_id) prByOrderId.set(String(r.order_id), r);
        if (r.razorpayOrderId) prByRazorpayOrder.set(String(r.razorpayOrderId), r);
        if (r.razorpayPaymentId) prByRazorpayPayment.set(String(r.razorpayPaymentId), r);
      });

      // merge: for each order prefer PaymentRecord (by order.paymentRef / razorpay ids / order_id)
      const merged = ordersData.map((o) => {
        // try to find a matching PR
        let pr = null;

        if (o.paymentRef && prByPaymentRef.has(String(o.paymentRef))) pr = prByPaymentRef.get(String(o.paymentRef));
        if (!pr && o.order_id && prByOrderId.has(String(o.order_id))) pr = prByOrderId.get(String(o.order_id));
        if (!pr && o.razorpayOrderId && prByRazorpayOrder.has(String(o.razorpayOrderId))) pr = prByRazorpayOrder.get(String(o.razorpayOrderId));
        if (!pr && o.razorpayPaymentId && prByRazorpayPayment.has(String(o.razorpayPaymentId))) pr = prByRazorpayPayment.get(String(o.razorpayPaymentId));

        // fallback: try matching by paymentRef string to PR.paymentRef
        if (!pr && o.paymentRef) {
          const p = prData.find((x) => x.paymentRef === o.paymentRef);
          if (p) pr = p;
        }

        // decide final display values preferring PR when available
        const amountPaise = pr?.amountPaise ?? (o.amountPaise ?? (o.amount ? Math.round(Number(o.amount) * 100) : null));
        const amountDisplay = amountPaise != null ? rupeesFromPaise(amountPaise) : (o.amount ? formatIN(o.amount) : "0.00");
        const depositPaise = pr?.depositPaise ?? (o.depositPaise ?? 0);
        const depositDisplay = rupeesFromPaise(depositPaise);
        const amountDuePaise = pr?.amountDuePaise ?? (o.amountDuePaise ?? Math.max(0, (amountPaise || 0) - (depositPaise || 0)));
        const amountDueDisplay = rupeesFromPaise(amountDuePaise);
        const paymentLinkUrl = pr?.paymentLinkUrl ?? (pr?.paymentLinkUrl === undefined ? null : null);

        return {
          ...o,
          // overlay PR fields
          paymentRecord: pr || null,
          paymentLinkUrl: pr?.paymentLinkUrl || null,
          providerResponse: pr?.providerResponse || (o.providerResponse || null),
          amountPaise,
          amountDisplay,
          depositPaise,
          depositDisplay,
          amountDuePaise,
          amountDueDisplay,
        };
      });

      // Also include any PaymentRecords that do NOT have an Order in ordersData (optional - useful if you want to show standalone paymentRecords)
      // Add PR-only items keyed by paymentRef if not present in merged list
      const existingOrderIds = new Set(merged.map((m) => String(m.order_id || m._id)));
      prData.forEach((r) => {
        const key = String(r.order_id || r.paymentRef || r._id);
        if (!existingOrderIds.has(key)) {
          merged.push({
            _id: `pr_${r._id}`,
            order_id: r.order_id || r.paymentRef || null,
            items: r.items || [],
            createdAt: r.createdAt,
            amountPaise: r.amountPaise,
            amountDisplay: rupeesFromPaise(r.amountPaise),
            depositPaise: r.depositPaise || 0,
            depositDisplay: rupeesFromPaise(r.depositPaise),
            amountDuePaise: r.amountDuePaise || 0,
            amountDueDisplay: rupeesFromPaise(r.amountDuePaise || 0),
            paymentRef: r.paymentRef,
            paymentRecord: r,
            paymentLinkUrl: r.paymentLinkUrl || null,
            providerResponse: r.providerResponse || null,
            paymentStatus: r.status || "PENDING",
            deliveryStatus: "N/A",
          });
        }
      });

      // sort by createdAt desc
      merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setOrders(merged);
    } catch (err) {
      console.error("fetchMergedOrders error:", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMergedOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Payment success handling via query param (existing flow)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentRef = params.get("paymentRef");
    if (paymentRef) {
      (async () => {
        try {
          const res = await axios.get(`${PAYMENT_BASE}/details/${encodeURIComponent(paymentRef)}`);
          if (res.data?.success && res.data.payment) {
            toast.success("Payment verified successfully!");
            await fetchMergedOrders();
          } else {
            toast.error("Payment verification failed.");
          }
        } catch (err) {
          console.error("Payment detail fetch error:", err);
          toast.error("Error verifying payment details.");
        } finally {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cancel modal + refund logic (same as before)
  const openCancelModal = (order) => {
    setErrorMsg("");
    setCaptchaToken(null);
    recaptchaRef.current?.reset?.();
    setCancelModal({ open: true, order });
  };
  const closeCancelModal = () => {
    setCancelModal({ open: false, order: null });
    setIsProcessing(false);
    setCaptchaToken(null);
    setErrorMsg("");
    recaptchaRef.current?.reset?.();
  };
  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
    setErrorMsg("");
  };

  const handleConfirmCancel = async () => {
    const order = cancelModal?.order;
    if (!order) return setErrorMsg("No order selected.");
    const hoursPassed = (Date.now() - new Date(order.createdAt).getTime()) / 3600000;
    if (hoursPassed > 24) return setErrorMsg("Cannot cancel order after 24 hours.");
    if (!captchaToken) return setErrorMsg("Complete the Captcha first.");

    // Determine payment id to refund: prefer paymentRecord.razorpayPaymentId or paymentRef or order.razorpayPaymentId
    const paymentId =
      order.paymentRecord?.razorpayPaymentId || order.paymentRecord?.paymentRef || order.paymentRef || order.razorpayPaymentId;

    if (!paymentId) return setErrorMsg("Missing payment reference.");

    try {
      setIsProcessing(true);
      const token = localStorage.getItem("token");
      if (!token) return setErrorMsg("You must be logged in.");

      const res = await axios.post(
        `${PAYMENT_BASE}/refund`,
        {
          order_id: order.order_id,
          payment_id: paymentId,
          token: captchaToken,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        toast.success("Order canceled/refund initiated");
        // refresh
        await fetchMergedOrders();
        closeCancelModal();
      } else {
        setErrorMsg(res.data?.message || "Failed to cancel order.");
      }
    } catch (err) {
      console.error("Cancel error:", err);
      setErrorMsg(err.response?.data?.message || "Server error while canceling order.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Open payment link in new tab (if paymentLinkUrl exists), else open frontend checkout if available
  const openPayment = (order) => {
    if (order.paymentLinkUrl) {
      window.open(order.paymentLinkUrl, "_blank");
      return;
    }
    // try to open frontend checkout if paymentRecord has order id or frontendCheckoutUrl
    const r = order.paymentRecord;
    if (r && r.frontendCheckoutUrl) {
      window.location.href = r.frontendCheckoutUrl;
      return;
    }
    toast.error("Payment link not available");
  };

  return (
    <div className="max-w-6xl mx-auto my-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Orders (Merged)</h1>

      {loading ? (
        <p className="text-center py-20 text-gray-600 text-lg">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <img src="https://placehold.co/300x200?text=No+Orders" className="mx-auto mb-4 rounded-lg" />
          <p className="text-gray-500 text-lg">You haven’t placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const hoursPassed = (Date.now() - new Date(order.createdAt).getTime()) / 3600000;
            const canCancel = hoursPassed <= 24 && order.paymentStatus !== "refunded";

            return (
              <div key={order._id} className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-xl transition">
                {/* header */}
                <div className="flex flex-col md:flex-row justify-between border-b pb-4 mb-4">
                  <div>
                    <p className="text-gray-500 text-sm">Order ID: {order.order_id || order._id}</p>
                    <p className="text-gray-500 text-sm">PaymentRef: {order.paymentRef || order.paymentRecord?.paymentRef || "N/A"}</p>
                    <p className="text-gray-400 text-sm">Placed On: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">₹{order.amountDisplay || formatIN(order.amount)}</div>
                    <div className="text-sm text-gray-500">Due: ₹{order.amountDueDisplay || "0.00"}</div>
                  </div>
                </div>

                {/* items */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50">
                      <img src={item.image || "https://placehold.co/120x120?text=No+Image"} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        {item.pricePaise && <p className="text-sm text-gray-600">Price: ₹{rupeesFromPaise(item.pricePaise)}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* payment info */}
                <div className="mt-3">
                  <div className="text-sm mb-2">
                    <span className="font-medium">Status: </span>
                    <span className="text-gray-700">{(order.paymentStatus || order.paymentRecord?.status || "PENDING").toUpperCase()}</span>
                  </div>

                  {order.paymentLinkUrl && (
                    <div className="text-sm mb-2">
                      <span className="font-medium">Payment Link: </span>
                      <a className="text-blue-600" href={order.paymentLinkUrl} target="_blank" rel="noreferrer">{order.paymentLinkUrl}</a>
                    </div>
                  )}

                  {order.paymentRecord && (
                    <div className="text-xs text-gray-500">
                      <div>PaymentRecord ID: {order.paymentRecord._id}</div>
                      <div>Razorpay Order ID: {order.paymentRecord.razorpayOrderId}</div>
                      <div>Razorpay Payment ID: {order.paymentRecord.razorpayPaymentId}</div>
                    </div>
                  )}
                </div>

                {/* footer actions */}
                <div className="mt-4 flex justify-between items-center flex-wrap gap-2">
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-gray-100 capitalize">{(order.paymentStatus || order.paymentRecord?.status || "PENDING").toLowerCase()}</span>
                    <span className="px-3 py-1 rounded-full bg-yellow-100 capitalize">{order.deliveryStatus || "Order Placed"}</span>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => openPayment(order)} className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                      {order.paymentLinkUrl ? `Pay ₹${order.amountDueDisplay}` : "Pay"}
                    </button>

                    {canCancel ? (
                      <button onClick={() => openCancelModal(order)} className="px-5 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700">Cancel Order</button>
                    ) : (
                      <button className="px-5 py-2 rounded-lg bg-gray-400 text-white cursor-not-allowed">Cannot Cancel</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* cancel modal */}
      {cancelModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black opacity-40" onClick={closeCancelModal} />
          <div className="relative bg-white w-full max-w-md p-6 rounded-xl shadow-2xl">
            <h2 className="text-xl font-semibold mb-3">Confirm Order Cancellation</h2>
            {errorMsg && <div className="text-red-600 text-sm mb-2">{errorMsg}</div>}
            <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} onChange={onCaptchaChange} className="mb-4" />
            <div className="flex justify-end gap-3">
              <button onClick={closeCancelModal} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300" disabled={isProcessing}>Close</button>
              <button onClick={handleConfirmCancel} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg" disabled={isProcessing || !captchaToken}>
                {isProcessing ? "Processing..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
