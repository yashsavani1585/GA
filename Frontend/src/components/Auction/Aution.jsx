

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SOCKET_URL = "http://localhost:4000";

const statusColors = {
  live: "bg-green-500",
  upcoming: "bg-blue-500",
  ended: "bg-gray-500",
};

const Auction = () => {
  const navigate = useNavigate();
  const [auctionItems, setAuctionItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ------------------ FETCH AUCTIONS ------------------
  const fetchAuctions = async () => {
    try {
      const res = await axios.get(`${SOCKET_URL}/api/auction/all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const mapped = res.data.data.map((item) => ({
        ...item,
        image: item.productImage || "https://via.placeholder.com/400x300",
        status: item.status || "upcoming",
      }));
      setAuctionItems(mapped);
    } catch (err) {
      console.error("Error fetching auctions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAuctions();
  }, [token, navigate]);

  // ------------------ HANDLE ITEM CLICK ------------------
  const handleItemClick = (item) => {
    navigate(`/auction/${item._id}`, { state: { item } });
  };

  // ------------------ UI ------------------
  if (loading) return <p className="text-center mt-10">Loading auctions...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-10 text-yellow-900">
        Live Auctions
      </h1>

      {auctionItems.length === 0 ? (
        <p className="text-center text-gray-500">No auctions available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {auctionItems.map((item) => (
            <div
              key={item._id}
              className="relative border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              {/* ---------------- STATUS BADGE ---------------- */}
              <span
                className={`absolute top-2 left-2 text-white px-2 py-1 rounded text-sm font-semibold ${statusColors[item.status]}`}
              >
                {item.status.toUpperCase()}
              </span>

              <img
                src={item.image}
                alt={item.productName || "Auction Item"}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold text-xl mb-2">
                  {item.productName || "Unnamed Item"}
                </h2>
                <p className="font-bold mb-1">
                  Current Bid: ₹{item.currentPrice?.toLocaleString() || 0}
                </p>
                <p className="text-gray-600 mb-3">
                  Highest Bidder: {item.highestBidder?.name || "—"}
                </p>
                <button
                  className={`w-full font-semibold py-2 px-4 rounded ${
                    item.status === "live"
                      ? "bg-yellow-700 hover:bg-yellow-800 text-white"
                      : "bg-gray-400 cursor-not-allowed text-gray-800"
                  }`}
                  disabled={item.status !== "live"}
                >
                  {item.status === "live" ? "Place Bid" : "Unavailable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Auction;
