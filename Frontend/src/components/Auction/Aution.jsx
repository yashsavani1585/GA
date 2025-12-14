

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const SOCKET_URL = "http://localhost:4000";

// const statusColors = {
//   live: "bg-green-500",
//   upcoming: "bg-blue-500",
//   ended: "bg-gray-500",
// };

// const Auction = () => {
//   const navigate = useNavigate();
//   const [auctionItems, setAuctionItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("token");

//   // ------------------ FETCH AUCTIONS ------------------
//   const fetchAuctions = async () => {
//     try {
//       const res = await axios.get(`${SOCKET_URL}/api/auction/all`, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });

//       const mapped = res.data.data.map((item) => ({
//         ...item,
//         image: item.productImage || "https://via.placeholder.com/400x300",
//         status: item.status || "upcoming",
//       }));
//       setAuctionItems(mapped);
//     } catch (err) {
//       console.error("Error fetching auctions:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     fetchAuctions();
//   }, [token, navigate]);

//   // ------------------ HANDLE ITEM CLICK ------------------
//   const handleItemClick = (item) => {
//     navigate(`/auction/${item._id}`, { state: { item } });
//   };

//   // ------------------ UI ------------------
//   if (loading) return <p className="text-center mt-10">Loading auctions...</p>;

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-4xl font-bold text-center mb-10 text-yellow-900">
//         Live Auctions
//       </h1>

//       {auctionItems.length === 0 ? (
//         <p className="text-center text-gray-500">No auctions available</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//           {auctionItems.map((item) => (
//             <div
//               key={item._id}
//               className="relative border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
//               onClick={() => handleItemClick(item)}
//             >
//               {/* ---------------- STATUS BADGE ---------------- */}
//               <span
//                 className={`absolute top-2 left-2 text-white px-2 py-1 rounded text-sm font-semibold ${statusColors[item.status]}`}
//               >
//                 {item.status.toUpperCase()}
//               </span>

//               <img
//                 src={item.image}
//                 alt={item.productName || "Auction Item"}
//                 className="w-full h-48 object-cover"
//               />
//               <div className="p-4">
//                 <h2 className="font-semibold text-xl mb-2">
//                   {item.productName || "Unnamed Item"}
//                 </h2>
//                 <p className="font-bold mb-1">
//                   Current Bid: ₹{item.currentPrice?.toLocaleString() || 0}
//                 </p>
//                 <p className="text-gray-600 mb-3">
//                   Highest Bidder: {item.highestBidder?.name || "—"}
//                 </p>
//                 <button
//                   className={`w-full font-semibold py-2 px-4 rounded ${
//                     item.status === "live"
//                       ? "bg-yellow-700 hover:bg-yellow-800 text-white"
//                       : "bg-gray-400 cursor-not-allowed text-gray-800"
//                   }`}
//                   disabled={item.status !== "live"}
//                 >
//                   {item.status === "live" ? "Place Bid" : "Unavailable"}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Auction;

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Upgraded Auction component
 * - Filters: All | Live | Upcoming | Ended
 * - Uses backend fields when possible (derivedStatus, timeRemaining, minNextBidPaise)
 * - Falls back to client-side derivation using startAt/endAt
 * - Live countdown (1s tick)
 *
 * Usage: replace your existing Auction.jsx with this file
 */

const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const API_BASE = `${BASE}/api/auction`;

const statusColors = {
  live: "bg-green-500",
  upcoming: "bg-blue-500",
  ended: "bg-gray-500",
  all: "bg-indigo-500",
};

function paiseToRupeesDisplay(paise) {
  if (paise === undefined || paise === null) return "0.00";
  const rupees = Number(paise) / 100;
  if (Number.isNaN(rupees)) return "0.00";
  return rupees.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function safeParseDate(x) {
  if (!x) return null;
  const d = new Date(x);
  return isNaN(d.getTime()) ? null : d;
}

function deriveStatusFromDates(startAt, endAt) {
  const now = Date.now();
  const s = startAt ? startAt.getTime() : null;
  const e = endAt ? endAt.getTime() : null;
  if (s && now < s) return "upcoming";
  if (e && now >= e) return "ended";
  if ((!s || now >= s) && (!e || now < e)) return "live";
  return "upcoming";
}

function formatTimeRemainingMs(ms) {
  if (ms == null) return "-";
  if (ms <= 0) return "Ended";
  const totalSeconds = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) return `${hrs}h ${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
  return `${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
}

export default function Auction() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all | live | upcoming | ended
  const [tick, setTick] = useState(Date.now());
  const pollRef = useRef(null);

  const token = localStorage.getItem("token");

  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: API_BASE,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }, [token]);

  const fetchAuctions = async (opts = {}) => {
    try {
      setLoading(true);
      setError(null);

      // pass status filter to server if not 'all' so server can prefilter
      const params = {};
      if (opts.serverStatus) params.status = opts.serverStatus;

      const res = await axiosInstance.get("/all", { params });
      const data = res.data?.data || [];
      // Normalize each item: ensure startAt/endAt and numeric paise fields exist for easier UI logic
      const normalized = data.map((it) => {
        const startAt = safeParseDate(it.startAt ?? it.startTime ?? it.startAt);
        const endAt = safeParseDate(it.endAt ?? it.endTime ?? it.endAt);
        const currentPricePaise =
          it.currentPricePaise ??
          (it.currentPrice != null ? Math.round(Number(it.currentPrice) * 100) : null) ??
          it.startingPricePaise ??
          (it.startingPrice != null ? Math.round(Number(it.startingPrice) * 100) : null) ??
          0;
        const minNextBidPaise = it.minNextBidPaise ?? (it.minNextBid ? Math.round(Number(it.minNextBid) * 100) : null) ?? null;
        const minIncrementPaise = it.minIncrementPaise ?? (it.minIncrement ? Math.round(Number(it.minIncrement) * 100) : 100);
        const derivedStatus = it.derivedStatus ?? deriveStatusFromDates(startAt, endAt);
        const timeRemainingMs = it.timeRemaining ?? (endAt ? Math.max(0, endAt.getTime() - Date.now()) : null);

        return {
          ...it,
          image: it.productImage || "https://via.placeholder.com/400x300?text=No+Image",
          startAt,
          endAt,
          currentPricePaise,
          minNextBidPaise,
          minIncrementPaise,
          derivedStatus,
          timeRemainingMs,
        };
      });

      setAuctions(normalized);
    } catch (err) {
      console.error("fetchAuctions error:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch auctions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions({ serverStatus: filter === "all" ? undefined : filter });

    // tick every second for countdowns
    const t = setInterval(() => setTick(Date.now()), 1000);

    // poll server every 30s for fresher data
    pollRef.current = setInterval(() => fetchAuctions({ serverStatus: filter === "all" ? undefined : filter }), 30_000);

    return () => {
      clearInterval(t);
      clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // filtered view by derivedStatus (client-side) — allows switching filters instantly
  const visible = auctions.filter((a) => (filter === "all" ? true : a.derivedStatus === filter));

  const handleNavigate = (it) => {
    // let user enter detail page regardless of status, but disable bidding inside detail if not live
    navigate(`/auction/${it._id}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-6 text-yellow-900">Auctions</h1>

      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex space-x-2">
          {["all", "live", "upcoming", "ended"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === s ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchAuctions({ serverStatus: filter === "all" ? undefined : filter })}
            className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading auctions...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-10">{error}</div>
      ) : visible.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No auctions available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {visible.map((it) => {
            // recompute dynamic remaining each render tick
            const dynTimeRemainingMs = it.timeRemainingMs != null ? Math.max(0, it.endAt ? it.endAt.getTime() - Date.now() : it.timeRemainingMs) : null;
            const timeRemainingStr = it.timeRemainingMs != null || it.endAt ? formatTimeRemainingMs(dynTimeRemainingMs) : "-";
            const status = it.derivedStatus || "upcoming";
            const isLive = status === "live";

            return (
              <article
                key={it._id}
                className="relative border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleNavigate(it)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleNavigate(it)}
              >
                <span
                  className={`absolute top-3 left-3 text-white px-2 py-1 rounded text-sm font-semibold ${
                    statusColors[status] ?? "bg-gray-500"
                  }`}
                >
                  {status.toUpperCase()}
                </span>

                <img src={it.image} alt={it.productName || "Auction Item"} className="w-full h-48 object-cover" />

                <div className="p-4">
                  <h2 className="font-semibold text-lg mb-1">{it.productName || "Unnamed Item"}</h2>

                  <div className="text-sm text-gray-600 mb-2 line-clamp-2">{it.productDescription || ""}</div>

                  <div className="mb-3">
                    <div className="text-xs text-gray-500">Current Bid</div>
                    <div className="font-bold text-lg">₹{paiseToRupeesDisplay(it.currentPricePaise)}</div>
                    {it.minNextBidPaise != null && (
                      <div className="text-xs text-gray-500">Min Next: ₹{paiseToRupeesDisplay(it.minNextBidPaise)}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-sm mb-3">
                    <div>
                      <div className="text-xs text-gray-500">Ends</div>
                      <div className="font-mono text-sm">{it.endAt ? it.endAt.toLocaleString() : "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Remaining</div>
                      <div className="font-mono text-sm">{timeRemainingStr}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(it);
                      }}
                      className={`flex-1 py-2 rounded font-semibold ${
                        isLive ? "bg-yellow-700 hover:bg-yellow-800 text-white" : "bg-gray-200 text-gray-600 cursor-pointer"
                      }`}
                    >
                      {isLive ? "Open Auction" : status === "upcoming" ? "View Details" : "View Result"}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // quick action: copy item id or share link
                        const url = `${window.location.origin}/auction/${it._id}`;
                        navigator.clipboard?.writeText(url).then(() => {
                          // minimal feedback: small alert (can replace with toast)
                          alert("Link copied to clipboard");
                        }).catch(()=>{ alert("Copy failed") });
                      }}
                      className="px-3 py-2 rounded bg-white border text-sm"
                      title="Copy auction link"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
