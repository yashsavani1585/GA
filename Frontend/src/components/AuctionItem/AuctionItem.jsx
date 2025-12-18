

// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
// import axios from "axios";

// const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// const AuctionItem = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [item, setItem] = useState(null);
//   const [bids, setBids] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [ads, setAds] = useState({ left: null, right: null });
//   const socketRef = useRef(null);

//   const token = localStorage.getItem("token");
//   const bidIncrements = [100, 200, 500, 1000, 2000];

//   useEffect(() => {
//     if (!token) return;
//     const socket = io(SOCKET_URL, { auth: { token }, withCredentials: true });
//     socketRef.current = socket;

//     socket.on("auctionUpdated", (updated) => {
//       if (!updated || updated._id !== id) return;
//       setItem(transformAuctionForUI(updated));
//       setBids(transformBidsForUI(updated.bids || []));
//     });
//     socket.on("auctionEnded", (payload) => {
//       if (!payload || payload.auctionId !== id) return;
//       fetchAuction();
//       alert(`Auction ended. Winner: ${payload.winner?.name || "N/A"} - ₹${payload.finalPrice}`);
//     });
//     return () => { socket.disconnect(); socketRef.current = null; };
//   }, [id, token]);

//   useEffect(() => { fetchAuction(); fetchBids(); fetchAds(); }, [id]);

//   const fetchAuction = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${SOCKET_URL}/api/auction/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
//       setItem(transformAuctionForUI(res.data.data));
//     } catch (err) { console.error(err); }
//     finally { setLoading(false); }
//   };

//   const fetchBids = async () => {
//     try {
//       const res = await axios.get(`${SOCKET_URL}/api/auction/${id}/bids`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
//       setBids(transformBidsForUI(res.data.data));
//     } catch (err) { console.error(err); }
//   };

//   const fetchAds = async () => {
//     try {
//       const res = await axios.get(`${SOCKET_URL}/api/ads`);
//       setAds({
//         left: res.data.leftAd || "https://via.placeholder.com/120x600",
//         right: res.data.rightAd || "https://via.placeholder.com/120x600",
//       });
//     } catch (err) { console.error("Ads fetch error:", err); }
//   };

//   const transformAuctionForUI = (a) => ({
//     ...a,
//     image: a.productImage || "https://via.placeholder.com/800x450",
//     highestBidderName: a.highestBidder?.name || null,
//     currentPrice: a.currentPrice || a.startingPrice || 0,
//     status: a.status || "live"
//   });

//   const transformBidsForUI = (rawBids) => (rawBids || []).map(b => ({
//     bidder: b.bidder?.name || b.bidder || "Unknown",
//     amount: b.amount,
//     time: b.placedAt || b.createdAt
//   })).sort((x, y) => new Date(y.time) - new Date(x.time));

//   const handlePlaceBid = async (increment) => {
//     if (!token) return alert("Login required");
//     if (!item) return;

//     try {
//       const latest = await axios.get(`${SOCKET_URL}/api/auction/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//       const latestPrice = latest.data.data.currentPrice || latest.data.data.startingPrice || 0;
//       const bidAmount = latestPrice + increment;

//       const res = await axios.post(`${SOCKET_URL}/api/auction/bid`, { auctionId: id, amount: bidAmount }, { headers: { Authorization: `Bearer ${token}` } });

//       if (res.data.success) {
//         const updated = res.data.data;
//         setItem(transformAuctionForUI(updated));
//         setBids(transformBidsForUI(updated.bids || []));
//       } else alert(res.data.message || "Bid failed");
//     } catch (err) { console.error(err); alert(err.response?.data?.message || "Bid failed"); }
//   };

//   if (loading) return <p className="text-center mt-10">Loading...</p>;
//   if (!item) return <p className="text-center mt-10">Auction not found</p>;

//   return (
//     <div className="flex flex-col lg:flex-row justify-between gap-10 p-4">
//       {/* Left Ad */}
//       <div className="hidden lg:block w-[400px] flex-shrink-0">
//         <div className="sticky top-50">
//           <img src={ads.left} alt="Left Ad" className="w-full h-[500px] rounded shadow" />
//         </div>
//       </div>

//       {/* Main Auction Content */}
//       <div className="flex-1 max-w-3xl overflow-y-auto border p-6 rounded-lg shadow">
//         <button onClick={() => navigate(-1)} className="mb-6 text-indigo-700 hover:underline">← Back</button>
//         {item.status === "ended" && (
//           <div className="bg-green-100 border border-green-300 px-4 py-3 rounded mb-4">
//             🎉 Auction Ended — Winner: <strong>{item.highestBidderName || "No winner"}</strong>
//             {' '}| Final Price: <strong>₹{Number(item.currentPrice).toLocaleString()}</strong>
//           </div>
//         )}
//         <img src={item.image} alt={item.productName} className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg mb-4" />
//         <h1 className="text-2xl font-bold mb-2">{item.productName}</h1>
//         <p className="mb-1">Current Bid: <strong>₹{Number(item.currentPrice).toLocaleString()}</strong></p>
//         <p className="mb-4 text-sm text-gray-600">Highest Bidder: {item.highestBidderName || "No bids yet"}</p>
//         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
//           { bidIncrements.map(inc => (
//             <button key={inc} onClick={() => handlePlaceBid(inc)} className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded">+₹{inc.toLocaleString()}</button>
//           )) }
//         </div>
//         <div>
//           <h2 className="text-lg font-semibold mb-2">Bidding History</h2>
//           <ul className="space-y-2 max-h-[400px] overflow-y-auto">
//             { bids.length === 0 ? <li className="text-gray-500">No bids yet</li> :
//               bids.map((b,i)=>(
//                 <li key={i} className="flex justify-between items-center border-b pb-2">
//                   <span className="font-medium">{b.bidder}</span>
//                   <span className="text-indigo-700 font-semibold">₹{Number(b.amount).toLocaleString()}</span>
//                 </li>
//               ))
//             }
//           </ul>
//         </div>
//       </div>

//       {/* Right Ad */}
//       <div className="hidden lg:block w-[400px] flex-shrink-0">
//         <div className="sticky top-50">
//           <img src={ads.right} alt="Right Ad" className="w-full h-[500px] rounded shadow" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuctionItem;

// src/pages/AuctionItem.jsx
// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
// import axios from "axios";

// /**
//  * CONFIG
//  * Make sure VITE_BACKEND_URL is set in .env (e.g. http://localhost:4000)
//  */
// const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
// const AUCTION_API = `${BASE}/api/auction`;
// const PAYMENT_API = `${BASE}/api/payment2`;

// /** Load Razorpay SDK */
// const loadRazorpayScript = () =>
//   new Promise((resolve, reject) => {
//     if (window.Razorpay) return resolve(true);
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     script.onload = () => resolve(true);
//     script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
//     document.body.appendChild(script);
//   });

// const paiseToRupees = (paise) =>
//   (Number(paise || 0) / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });

// /** Decode JWT payload (non-secure, just to read userId if not stored separately) */
// function decodeJwtPayload(token) {
//   try {
//     const payload = token.split(".")[1];
//     const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
//     return JSON.parse(json);
//   } catch {
//     return null;
//   }
// }

// /** helper: normalize backend order object */
// function pickOrderFromResponse(createResData) {
//   if (!createResData) return null;
//   if (createResData.order && createResData.order.id) return createResData.order;
//   if (createResData.orderDb && createResData.orderDb.providerResponse && createResData.orderDb.providerResponse.id)
//     return createResData.orderDb.providerResponse;
//   if (createResData.providerResponse && createResData.providerResponse.id) return createResData.providerResponse;
//   if (createResData.rzpOrder && createResData.rzpOrder.id) return createResData.rzpOrder;
//   if (createResData.id && createResData.amount) return createResData; // sometimes direct razorpay object returned
//   return null;
// }

// export default function AuctionItem() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [item, setItem] = useState(null);
//   const [bids, setBids] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [depositPaid, setDepositPaid] = useState(false);
//   const [depositChecking, setDepositChecking] = useState(false);
//   const [depositProcessing, setDepositProcessing] = useState(false);
//   const [depositAmountPaise, setDepositAmountPaise] = useState(null);
//   const [pendingDeposit, setPendingDeposit] = useState(null);

//   // robust token read
//   const rawToken = localStorage.getItem("token");
//   const token = rawToken && rawToken !== "undefined" && rawToken !== "null" ? rawToken : null;

//   // userId: prefer explicit localStorage, otherwise decode token
//   let userId = localStorage.getItem("userId");
//   if ((!userId || userId === "undefined" || userId === "null") && token) {
//     const payload = decodeJwtPayload(token);
//     if (payload && (payload.id || payload._id || payload.userId)) {
//       userId = payload.id || payload._id || payload.userId;
//     }
//   }

//   const bidIncrements = [100, 200, 500, 1000, 2000]; // rupee increments
//   const socketRef = useRef(null);

//   // Socket — only if logged in (optional)
//   useEffect(() => {
//     if (!token) return;
//     const socket = io(BASE, { auth: { token }, withCredentials: true });
//     socketRef.current = socket;

//     socket.on("auctionUpdated", (updated) => {
//       if (!updated || updated._id !== id) return;
//       setItem(transformAuctionForUI(updated));
//       setBids(transformBidsForUI(updated.bids || []));
//     });

//     socket.on("auctionEnded", (payload) => {
//       if (!payload || payload.auctionId !== id) return;
//       fetchAuction();
//       alert(`Auction ended. Winner: ${payload.winner?.name || "N/A"} - ₹${payload.finalPrice}`);
//     });

//     return () => {
//       try { socket.disconnect(); } catch {}
//       socketRef.current = null;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id, token]);

//   useEffect(() => {
//     fetchAuction();
//     fetchBids();
//     checkDepositStatus();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const transformAuctionForUI = (a) => ({
//     ...a,
//     image: a.productImage || "https://via.placeholder.com/800x450",
//     highestBidderName: a.highestBidder?.name || null,
//     currentPrice: (a.currentPricePaise ?? a.currentPrice ?? 0) / 100,
//     status: a.status || "live",
//   });

//   const transformBidsForUI = (rawBids) =>
//     (rawBids || [])
//       .map((b) => ({
//         bidder: b.bidder?.name || b.bidder || "Unknown",
//         amount: b.amountPaise ? b.amountPaise / 100 : b.amount || 0,
//         time: b.placedAt || b.createdAt,
//       }))
//       .sort((x, y) => new Date(y.time) - new Date(x.time));

//   /* ---------- fetchers ---------- */
//   const fetchAuction = async () => {
//     setLoading(true);
//     try {
//       const headers = token ? { Authorization: `Bearer ${token}` } : {};
//       const res = await axios.get(`${AUCTION_API}/${id}`, { headers });
//       if (res.data && res.data.data) {
//         setItem(transformAuctionForUI(res.data.data));
//         const depositPaise = computeDepositPaise(res.data.data);
//         setDepositAmountPaise(depositPaise);
//       } else {
//         console.warn("fetchAuction: unexpected response", res.data);
//       }
//     } catch (err) {
//       console.error("fetchAuction err", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchBids = async () => {
//     try {
//       const headers = token ? { Authorization: `Bearer ${token}` } : {};
//       const res = await axios.get(`${AUCTION_API}/${id}/bids`, { headers });
//       if (res.data) setBids(transformBidsForUI(res.data.data || res.data));
//     } catch (err) {
//       console.error("fetchBids err", err);
//     }
//   };

//   /* ---------- deposit helpers ---------- */
//   const computeDepositPaise = (auctionObj) => {
//     if (!auctionObj) return null;
//     const spPaise =
//       auctionObj.startingPricePaise ??
//       (auctionObj.startingPrice ? Math.round(Number(auctionObj.startingPrice) * 100) : undefined);
//     const fallback =
//       auctionObj.currentPricePaise ??
//       (auctionObj.currentPrice ? Math.round(Number(auctionObj.currentPrice) * 100) : undefined);
//     const basePaise = spPaise ?? fallback ?? 0;
//     const depositPercent = auctionObj.depositPercent ?? 25;
//     return Math.ceil((basePaise * depositPercent) / 100);
//   };

//   const checkDepositStatus = async () => {
//     if (!userId || !token) {
//       setDepositPaid(false);
//       setPendingDeposit(null);
//       return;
//     }
//     setDepositChecking(true);
//     try {
//       const res = await axios.get(`${PAYMENT_API}/name?userId=${userId}`, { headers: { Authorization: `Bearer ${token}` } });
//       const deposits = res.data?.deposits || res.data?.data || res.data?.deposit || [];
//       const my = (deposits || []).find((d) => {
//         const auctionId = d.auction?._id || d.auction;
//         return auctionId && String(auctionId) === String(id);
//       });
//       if (my) {
//         setPendingDeposit(my.status === "pending" ? my : null);
//         setDepositPaid(my.status === "paid");
//         const ap = my.amountPaise ?? my.amount ?? my.amount_paise;
//         if (ap) setDepositAmountPaise(ap);
//       } else {
//         setPendingDeposit(null);
//         setDepositPaid(false);
//       }
//     } catch (err) {
//       console.error("checkDepositStatus err", err);
//       setDepositPaid(false);
//       setPendingDeposit(null);
//     } finally {
//       setDepositChecking(false);
//     }
//   };

//   /* open razorpay checkout for a given order */
//   const openRazorpayForOrder = async ({ order, depositId, key }) => {
//     if (!order || !order.id) throw new Error("Invalid order from server");
//     setDepositAmountPaise(order.amount || order.amount_paise || depositAmountPaise || null);
//     await loadRazorpayScript();

//     const options = {
//       key: key || import.meta.env.VITE_RAZORPAY_KEY || "", // backend should ideally return key
//       amount: order.amount,
//       currency: order.currency || "INR",
//       name: item?.productName || "Auction Deposit",
//       description: `Security deposit for ${item?.productName || id}`,
//       order_id: order.id,
//       handler: async function (resp) {
//         setDepositProcessing(true);
//         try {
//           // verify payment on server
//           const verifyRes = await axios.post(
//             `${PAYMENT_API}/verify-deposit`,
//             {
//               depositId,
//               razorpay_payment_id: resp.razorpay_payment_id,
//               razorpay_order_id: resp.razorpay_order_id,
//               razorpay_signature: resp.razorpay_signature,
//             },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );

//           if (verifyRes.data?.success) {
//             setDepositPaid(true);
//             setPendingDeposit(null);
//             alert("Deposit successful — you can now bid.");
//             fetchAuction();
//             fetchBids();
//           } else {
//             console.error("verify deposit failed", verifyRes.data);
//             alert("Deposit verification failed. Check console.");
//           }
//         } catch (err) {
//           console.error("verify deposit error", err);
//           alert("Error verifying deposit. See console.");
//         } finally {
//           setDepositProcessing(false);
//         }
//       },
//       modal: {
//         ondismiss: function () {
//           // user closed checkout
//           setDepositProcessing(false);
//         },
//       },
//       prefill: {
//         name: localStorage.getItem("userName") || "",
//         email: localStorage.getItem("userEmail") || "",
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   /** create / resume deposit flow */
//   const handlePayDeposit = async () => {
//     if (!token || !userId) {
//       if (window.confirm("You must be logged in to pay deposit. Go to login?")) navigate("/login");
//       return;
//     }

//     setDepositProcessing(true);
//     try {
//       const depositPaiseCalc = computeDepositPaise(item ?? {});

//       // if pending deposit exists, resume checkout
//       if (pendingDeposit && pendingDeposit.razorpayOrderId) {
//         const orderObj = {
//           id: pendingDeposit.razorpayOrderId,
//           amount: pendingDeposit.amountPaise || pendingDeposit.amount || depositPaiseCalc,
//           currency: "INR",
//         };
//         const key = pendingDeposit.key || pendingDeposit.razorpayKey || import.meta.env.VITE_RAZORPAY_KEY || "";
//         await openRazorpayForOrder({ order: orderObj, depositId: pendingDeposit._id || pendingDeposit.id, key });
//         return;
//       }

//       // create deposit order on backend (protected endpoint)
//       const payload = { userId, auctionId: id, amountPaise: depositPaiseCalc };
//       const createRes = await axios.post(`${PAYMENT_API}/create-deposit-order`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const order = pickOrderFromResponse(createRes.data);
//       const depositId = createRes.data?.depositId || createRes.data?.deposit?._id;
//       const key = createRes.data?.key || createRes.data?.razorpayKey || import.meta.env.VITE_RAZORPAY_KEY || "";

//       if (!order || !depositId) {
//         console.error("create-deposit-order response", createRes.data);
//         throw new Error("Server did not return order or deposit id");
//       }

//       // record pending deposit in UI to allow resume
//       setPendingDeposit({ _id: depositId, razorpayOrderId: order.id, amountPaise: order.amount, status: "pending", key });

//       // open checkout
//       await openRazorpayForOrder({ order, depositId, key });
//     } catch (err) {
//       console.error("create deposit error", err);
//       alert(err?.response?.data?.error || err?.response?.data?.message || err.message || "Failed to create deposit order");
//       setDepositProcessing(false);
//     }
//   };

//   /* place bid (requires depositPaid true) */
//   const handlePlaceBid = async (incrementRupees) => {
//     if (!token || !userId) {
//       if (window.confirm("Login required to bid. Go to login?")) navigate("/login");
//       return;
//     }
//     if (!depositPaid) {
//       alert("Please pay security deposit before bidding.");
//       return;
//     }
//     if (!item) return;

//     try {
//       // get latest auction price then submit bid
//       const res = await axios.get(`${AUCTION_API}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//       const latestPriceRupees = (res.data?.data?.currentPricePaise || res.data?.data?.currentPrice || 0) / 100;
//       const bidPaise = Math.round((Number(latestPriceRupees) + Number(incrementRupees)) * 100);

//       // send rupees (server earlier expected rupees in amount)
//       const bidRes = await axios.post(`${AUCTION_API}/bid`, { auctionId: id, amount: bidPaise / 100 }, { headers: { Authorization: `Bearer ${token}` } });

//       if (bidRes.data?.success) {
//         setItem(transformAuctionForUI(bidRes.data.data));
//         setBids(transformBidsForUI(bidRes.data.data.bids || []));
//       } else {
//         alert(bidRes.data?.message || "Bid failed");
//       }
//     } catch (err) {
//       console.error("place bid error", err);
//       alert(err?.response?.data?.message || err.message || "Bid failed");
//       const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
//       if (serverMsg && /deposit/i.test(serverMsg)) setDepositPaid(false);
//     }
//   };

//   /* ---------- UI ---------- */
//   if (loading) return <p className="text-center mt-10">Loading...</p>;
//   if (!item) return <p className="text-center mt-10">Auction not found</p>;

//   const uiDepositPaise = depositAmountPaise ?? computeDepositPaise(item);

//   return (
//     <div className="flex flex-col lg:flex-row justify-between gap-10 p-4">
//       <div className="flex-1 max-w-3xl overflow-y-auto border p-6 rounded-lg shadow">
//         <button onClick={() => navigate(-1)} className="mb-6 text-indigo-700 hover:underline">← Back</button>

//         {item.status === "ended" && (
//           <div className="bg-green-100 border border-green-300 px-4 py-3 rounded mb-4">
//             🎉 Auction Ended — Winner: <strong>{item.highestBidderName || "No winner"}</strong> | Final Price: <strong>₹{paiseToRupees(item.finalPricePaise || item.currentPricePaise || 0)}</strong>
//           </div>
//         )}

//         <img src={item.image} alt={item.productName} className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg mb-4" />
//         <h1 className="text-2xl font-bold mb-2">{item.productName}</h1>
//         <p className="mb-1">Current Bid: <strong>₹{(item.currentPrice).toLocaleString()}</strong></p>
//         <p className="mb-4 text-sm text-gray-600">Highest Bidder: {item.highestBidderName || "No bids yet"}</p>

//         <div className="mb-6">
//           {depositChecking ? (
//             <div>Checking deposit status...</div>
//           ) : depositPaid ? (
//             <div className="mb-3 text-sm text-green-700">✅ Security deposit paid — you can bid.</div>
//           ) : (
//             <div className="mb-3 text-sm text-red-700">⚠️ You must pay a security deposit ({item.depositPercent ?? 25}%) before bidding.</div>
//           )}

//           {!depositPaid && (
//             <div className="mb-4">
//               <button
//                 onClick={handlePayDeposit}
//                 disabled={depositProcessing}
//                 className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded mr-3"
//               >
//                 {depositProcessing ? "Processing..." : `Pay Security Deposit ₹${paiseToRupees(uiDepositPaise || 0)}`}
//               </button>
//             </div>
//           )}

//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//             {bidIncrements.map((inc) => (
//               <button
//                 key={inc}
//                 onClick={() => handlePlaceBid(inc)}
//                 className={`py-2 px-4 rounded text-white ${depositPaid ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}
//                 disabled={!depositPaid}
//               >
//                 +₹{inc.toLocaleString()}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h2 className="text-lg font-semibold mb-2">Bidding History</h2>
//           <ul className="space-y-2 max-h-[400px] overflow-y-auto">
//             {bids.length === 0 ? <li className="text-gray-500">No bids yet</li> : bids.map((b, i) => (
//               <li key={i} className="flex justify-between items-center border-b pb-2">
//                 <span className="font-medium">{b.bidder}</span>
//                 <span className="text-indigo-700 font-semibold">₹{Number(b.amount).toLocaleString()}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       <div className="hidden lg:block w-[400px] flex-shrink-0">
//         <div className="sticky top-50">
//           <div className="border rounded p-4">
//             <h3 className="font-semibold">Auction Details</h3>
//             <p className="text-sm">Starts: {item.startAt ? new Date(item.startAt).toLocaleString() : "-"}</p>
//             <p className="text-sm">Ends: {item.endAt ? new Date(item.endAt).toLocaleString() : "-"}</p>
//             <p className="text-sm">Deposit %: {item.depositPercent ?? 25}%</p>
//             <p className="text-sm">Min Increment: ₹{paiseToRupees(item.minIncrementPaise || item.minIncrement || 10000)}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const BASE = import.meta.env.VITE_BACKEND_URL || "https://ga-inx6.onrender.com";
const AUCTION_API = `${BASE}/api/auction`;
const PAYMENT_API = `${BASE}/api/payment2`;
const ADS_API = `${BASE}/api/ads`;

const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
    document.body.appendChild(script);
  });

const paiseToRupees = (paise) =>
  (Number(paise || 0) / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function pickOrderFromResponse(createResData) {
  if (!createResData) return null;
  if (createResData.order && createResData.order.id) return createResData.order;
  if (
    createResData.orderDb &&
    createResData.orderDb.providerResponse &&
    createResData.orderDb.providerResponse.id
  )
    return createResData.orderDb.providerResponse;
  if (createResData.providerResponse && createResData.providerResponse.id) return createResData.providerResponse;
  if (createResData.rzpOrder && createResData.rzpOrder.id) return createResData.rzpOrder;
  if (createResData.id && createResData.amount) return createResData;
  return null;
}

export default function AuctionItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const [ads, setAds] = useState({ left: null, right: null });

  const [depositPaid, setDepositPaid] = useState(false);
  const [depositChecking, setDepositChecking] = useState(false);
  const [depositProcessing, setDepositProcessing] = useState(false);
  const [depositAmountPaise, setDepositAmountPaise] = useState(null);
  const [pendingDeposit, setPendingDeposit] = useState(null);

  const rawToken = localStorage.getItem("token");
  const token = rawToken && rawToken !== "undefined" && rawToken !== "null" ? rawToken : null;

  let userId = localStorage.getItem("userId");
  if ((!userId || userId === "undefined" || userId === "null") && token) {
    const payload = decodeJwtPayload(token);
    if (payload && (payload.id || payload._id || payload.userId)) {
      userId = payload.id || payload._id || payload.userId;
    }
  }

  const bidIncrements = [100, 200, 500, 1000, 2000];
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    const socket = io(BASE, { auth: { token }, withCredentials: true });
    socketRef.current = socket;

    socket.on("auctionUpdated", (updated) => {
      if (!updated || updated._id !== id) return;
      setItem(transformAuctionForUI(updated));
      setBids(transformBidsForUI(updated.bids || []));
    });

    socket.on("auctionEnded", (payload) => {
      if (!payload || payload.auctionId !== id) return;
      fetchAuction();
      alert(`Auction ended. Winner: ${payload.winner?.name || "N/A"} - ₹${payload.finalPrice}`);
    });

    return () => {
      try {
        socket.disconnect();
      } catch {}
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  useEffect(() => {
    fetchAuction();
    fetchBids();
    fetchAds();
    checkDepositStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const transformAuctionForUI = (a) => ({
    ...a,
    image: a.productImage || "https://via.placeholder.com/800x450",
    highestBidderName: a.highestBidder?.name || null,
    currentPrice: (a.currentPricePaise ?? a.currentPrice ?? 0) / 100,
    status: a.status || "live",
  });

  const transformBidsForUI = (rawBids) =>
    (rawBids || [])
      .map((b) => ({
        bidder: b.bidder?.name || b.bidder || "Unknown",
        amount: b.amountPaise ? b.amountPaise / 100 : b.amount || 0,
        time: b.placedAt || b.createdAt,
      }))
      .sort((x, y) => new Date(y.time) - new Date(x.time));

  const fetchAuction = async () => {
    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${AUCTION_API}/${id}`, { headers });
      if (res.data && res.data.data) {
        setItem(transformAuctionForUI(res.data.data));
        const depositPaise = computeDepositPaise(res.data.data);
        setDepositAmountPaise(depositPaise);
      } else {
        console.warn("fetchAuction: unexpected response", res.data);
      }
    } catch (err) {
      console.error("fetchAuction err", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${AUCTION_API}/${id}/bids`, { headers });
      if (res.data) setBids(transformBidsForUI(res.data.data || res.data));
    } catch (err) {
      console.error("fetchBids err", err);
    }
  };

  const fetchAds = async () => {
    try {
      const res = await axios.get(ADS_API);
      setAds({
        left: res.data.leftAd || "https://via.placeholder.com/300x600",
        right: res.data.rightAd || "https://via.placeholder.com/300x600",
      });
    } catch (err) {
      console.error("fetchAds err", err);
      setAds({ left: "https://via.placeholder.com/300x600", right: "https://via.placeholder.com/300x600" });
    }
  };

  const computeDepositPaise = (auctionObj) => {
    if (!auctionObj) return null;
    const spPaise =
      auctionObj.startingPricePaise ??
      (auctionObj.startingPrice ? Math.round(Number(auctionObj.startingPrice) * 100) : undefined);
    const fallback =
      auctionObj.currentPricePaise ??
      (auctionObj.currentPrice ? Math.round(Number(auctionObj.currentPrice) * 100) : undefined);
    const basePaise = spPaise ?? fallback ?? 0;
    const depositPercent = auctionObj.depositPercent ?? 25;
    return Math.ceil((basePaise * depositPercent) / 100);
  };

  const checkDepositStatus = async () => {
    if (!userId || !token) {
      setDepositPaid(false);
      setPendingDeposit(null);
      return;
    }
    setDepositChecking(true);
    try {
      const res = await axios.get(`${PAYMENT_API}/name?userId=${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      const deposits = res.data?.deposits || res.data?.data || res.data?.deposit || [];
      const my = (deposits || []).find((d) => {
        const auctionId = d.auction?._id || d.auction;
        return auctionId && String(auctionId) === String(id);
      });
      if (my) {
        setPendingDeposit(my.status === "pending" ? my : null);
        setDepositPaid(my.status === "paid");
        const ap = my.amountPaise ?? my.amount ?? my.amount_paise;
        if (ap) setDepositAmountPaise(ap);
      } else {
        setPendingDeposit(null);
        setDepositPaid(false);
      }
    } catch (err) {
      console.error("checkDepositStatus err", err);
      setDepositPaid(false);
      setPendingDeposit(null);
    } finally {
      setDepositChecking(false);
    }
  };

  const openRazorpayForOrder = async ({ order, depositId, key }) => {
    if (!order || !order.id) throw new Error("Invalid order from server");
    setDepositAmountPaise(order.amount || order.amount_paise || depositAmountPaise || null);
    await loadRazorpayScript();

    const options = {
      key: key || import.meta.env.VITE_RAZORPAY_KEY || "",
      amount: order.amount,
      currency: order.currency || "INR",
      name: item?.productName || "Auction Deposit",
      description: `Security deposit for ${item?.productName || id}`,
      order_id: order.id,
      handler: async function (resp) {
        setDepositProcessing(true);
        try {
          const verifyRes = await axios.post(
            `${PAYMENT_API}/verify-deposit`,
            {
              depositId,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_signature: resp.razorpay_signature,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verifyRes.data?.success) {
            setDepositPaid(true);
            setPendingDeposit(null);
            alert("Deposit successful — you can now bid.");
            fetchAuction();
            fetchBids();
          } else {
            console.error("verify deposit failed", verifyRes.data);
            alert("Deposit verification failed. Check console.");
          }
        } catch (err) {
          console.error("verify deposit error", err);
          alert("Error verifying deposit. See console.");
        } finally {
          setDepositProcessing(false);
        }
      },
      modal: {
        ondismiss: function () {
          setDepositProcessing(false);
        },
      },
      prefill: {
        name: localStorage.getItem("userName") || "",
        email: localStorage.getItem("userEmail") || "",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePayDeposit = async () => {
    if (!token || !userId) {
      if (window.confirm("You must be logged in to pay deposit. Go to login?")) navigate("/login");
      return;
    }

    setDepositProcessing(true);
    try {
      const depositPaiseCalc = computeDepositPaise(item ?? {});

      if (pendingDeposit && pendingDeposit.razorpayOrderId) {
        const orderObj = {
          id: pendingDeposit.razorpayOrderId,
          amount: pendingDeposit.amountPaise || pendingDeposit.amount || depositPaiseCalc,
          currency: "INR",
        };
        const key = pendingDeposit.key || pendingDeposit.razorpayKey || import.meta.env.VITE_RAZORPAY_KEY || "";
        await openRazorpayForOrder({ order: orderObj, depositId: pendingDeposit._id || pendingDeposit.id, key });
        return;
      }

      const payload = { userId, auctionId: id, amountPaise: depositPaiseCalc };
      const createRes = await axios.post(`${PAYMENT_API}/create-deposit-order`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const order = pickOrderFromResponse(createRes.data);
      const depositId = createRes.data?.depositId || createRes.data?.deposit?._id;
      const key = createRes.data?.key || createRes.data?.razorpayKey || import.meta.env.VITE_RAZORPAY_KEY || "";

      if (!order || !depositId) {
        console.error("create-deposit-order response", createRes.data);
        throw new Error("Server did not return order or deposit id");
      }

      setPendingDeposit({ _id: depositId, razorpayOrderId: order.id, amountPaise: order.amount, status: "pending", key });

      await openRazorpayForOrder({ order, depositId, key });
    } catch (err) {
      console.error("create deposit error", err);
      alert(err?.response?.data?.error || err?.response?.data?.message || err.message || "Failed to create deposit order");
      setDepositProcessing(false);
    }
  };

  const handlePlaceBid = async (incrementRupees) => {
    if (!token || !userId) {
      if (window.confirm("Login required to bid. Go to login?")) navigate("/login");
      return;
    }
    if (!depositPaid) {
      alert("Please pay security deposit before bidding.");
      return;
    }
    if (!item) return;

    try {
      const res = await axios.get(`${AUCTION_API}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const latestPriceRupees = (res.data?.data?.currentPricePaise || res.data?.data?.currentPrice || 0) / 100;
      const bidPaise = Math.round((Number(latestPriceRupees) + Number(incrementRupees)) * 100);

      const bidRes = await axios.post(`${AUCTION_API}/bid`, { auctionId: id, amount: bidPaise / 100 }, { headers: { Authorization: `Bearer ${token}` } });

      if (bidRes.data?.success) {
        setItem(transformAuctionForUI(bidRes.data.data));
        setBids(transformBidsForUI(bidRes.data.data.bids || []));
      } else {
        alert(bidRes.data?.message || "Bid failed");
      }
    } catch (err) {
      console.error("place bid error", err);
      alert(err?.response?.data?.message || err.message || "Bid failed");
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
      if (serverMsg && /deposit/i.test(serverMsg)) setDepositPaid(false);
    }
  };

  // ----- Timer: shows start countdown in mm:ss if auction not started -----
  const [startTimer, setStartTimer] = useState("-");
  useEffect(() => {
    let tId = null;
    function updateTimer() {
      if (!item || !item.startAt) return setStartTimer("-");
      const start = new Date(item.startAt).getTime();
      const now = Date.now();
      const diff = Math.max(0, start - now); // ms until start
      if (diff <= 0) return setStartTimer("00:00");
      const totalSec = Math.floor(diff / 1000);
      const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
      const ss = String(totalSec % 60).padStart(2, "0");
      setStartTimer(`${mm}:${ss}`);
    }
    updateTimer();
    tId = setInterval(updateTimer, 1000);
    return () => clearInterval(tId);
  }, [item]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!item) return <p className="text-center mt-10">Auction not found</p>;

  const uiDepositPaise = depositAmountPaise ?? computeDepositPaise(item);

  return (
    <div className="min-h-[70vh] px-4 py-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 items-start">
        {/* Left ad - hidden on small screens */}
        <div className="col-span-12 lg:col-span-2 hidden lg:block">
          <div className="sticky top-24">
            <img src={ads.left} alt="Left Ad" className="w-full h-220 rounded shadow" />
          </div>
        </div>

        {/* Main center column */}
        <div className="col-span-12 lg:col-span-8">
          <div className="max-w-3xl mx-auto bg-white border rounded-lg p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => navigate(-1)} className="text-indigo-700 hover:underline">← Back</button>
              <div className="text-sm text-gray-600">Starts in: <span className="font-medium">{startTimer}</span></div>
            </div>

            {item.status === "ended" && (
              <div className="bg-green-100 border border-green-300 px-4 py-3 rounded mb-4">
                🎉 Auction Ended — Winner: <strong>{item.highestBidderName || "No winner"}</strong> | Final Price: <strong>₹{paiseToRupees(item.finalPricePaise || item.currentPricePaise || 0)}</strong>
              </div>
            )}

            <img src={item.image} alt={item.productName} className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg mb-4" />

            <h1 className="text-2xl font-bold mb-2">{item.productName}</h1>
            <p className="mb-1">Current Bid: <strong>₹{(item.currentPrice).toLocaleString()}</strong></p>
            <p className="mb-2 text-sm text-gray-600">Highest Bidder: {item.highestBidderName || "No bids yet"}</p>

            <div className="mb-6">
              {depositChecking ? (
                <div>Checking deposit status...</div>
              ) : depositPaid ? (
                <div className="mb-3 text-sm text-green-700">✅ Security deposit paid — you can bid.</div>
              ) : (
                <div className="mb-3 text-sm text-red-700">⚠️ You must pay a security deposit ({item.depositPercent ?? 25}%) before bidding.</div>
              )}

              {!depositPaid && (
                <div className="mb-4">
                  <button
                    onClick={handlePayDeposit}
                    disabled={depositProcessing}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded mr-3"
                  >
                    {depositProcessing ? "Processing..." : `Pay Security Deposit ₹${paiseToRupees(uiDepositPaise || 0)}`}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {bidIncrements.map((inc) => (
                  <button
                    key={inc}
                    onClick={() => handlePlaceBid(inc)}
                    className={`py-2 px-4 rounded text-white ${depositPaid ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}
                    disabled={!depositPaid}
                  >
                    +₹{inc.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Bidding History</h2>
              <ul className="space-y-2 max-h-[400px] overflow-y-auto">
                {bids.length === 0 ? <li className="text-gray-500">No bids yet</li> : bids.map((b, i) => (
                  <li key={i} className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">{b.bidder}</span>
                    <span className="text-indigo-700 font-semibold">₹{Number(b.amount).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right ad - hidden on small screens */}
        <div className="col-span-12 lg:col-span-2 hidden lg:block">
          <div className="sticky top-24">
            <img src={ads.right} alt="Right Ad" className="w-full h-220 rounded shadow" />
          </div>
        </div>
      </div>

      {/* Mobile: small ad strip below center content (optional) */}
      <div className="lg:hidden max-w-3xl mx-auto mt-6">
        <img src={ads.left} alt="Mobile Ad" className="w-full h-20 object-cover rounded shadow" />
      </div>
    </div>
  );
}
