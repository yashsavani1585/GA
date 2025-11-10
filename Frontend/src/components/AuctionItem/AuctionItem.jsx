

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const AuctionItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState({ left: null, right: null });
  const socketRef = useRef(null);

  const token = localStorage.getItem("token");
  const bidIncrements = [100, 200, 500, 1000, 2000];

  useEffect(() => {
    if (!token) return;
    const socket = io(SOCKET_URL, { auth: { token }, withCredentials: true });
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
    return () => { socket.disconnect(); socketRef.current = null; };
  }, [id, token]);

  useEffect(() => { fetchAuction(); fetchBids(); fetchAds(); }, [id]);

  const fetchAuction = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${SOCKET_URL}/api/auction/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      setItem(transformAuctionForUI(res.data.data));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchBids = async () => {
    try {
      const res = await axios.get(`${SOCKET_URL}/api/auction/${id}/bids`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      setBids(transformBidsForUI(res.data.data));
    } catch (err) { console.error(err); }
  };

  const fetchAds = async () => {
    try {
      const res = await axios.get(`${SOCKET_URL}/api/ads`);
      setAds({
        left: res.data.leftAd || "https://via.placeholder.com/120x600",
        right: res.data.rightAd || "https://via.placeholder.com/120x600",
      });
    } catch (err) { console.error("Ads fetch error:", err); }
  };

  const transformAuctionForUI = (a) => ({
    ...a,
    image: a.productImage || "https://via.placeholder.com/800x450",
    highestBidderName: a.highestBidder?.name || null,
    currentPrice: a.currentPrice || a.startingPrice || 0,
    status: a.status || "live"
  });

  const transformBidsForUI = (rawBids) => (rawBids || []).map(b => ({
    bidder: b.bidder?.name || b.bidder || "Unknown",
    amount: b.amount,
    time: b.placedAt || b.createdAt
  })).sort((x, y) => new Date(y.time) - new Date(x.time));

  const handlePlaceBid = async (increment) => {
    if (!token) return alert("Login required");
    if (!item) return;

    try {
      const latest = await axios.get(`${SOCKET_URL}/api/auction/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const latestPrice = latest.data.data.currentPrice || latest.data.data.startingPrice || 0;
      const bidAmount = latestPrice + increment;

      const res = await axios.post(`${SOCKET_URL}/api/auction/bid`, { auctionId: id, amount: bidAmount }, { headers: { Authorization: `Bearer ${token}` } });

      if (res.data.success) {
        const updated = res.data.data;
        setItem(transformAuctionForUI(updated));
        setBids(transformBidsForUI(updated.bids || []));
      } else alert(res.data.message || "Bid failed");
    } catch (err) { console.error(err); alert(err.response?.data?.message || "Bid failed"); }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!item) return <p className="text-center mt-10">Auction not found</p>;

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-10 p-4">
      {/* Left Ad */}
      <div className="hidden lg:block w-[400px] flex-shrink-0">
        <div className="sticky top-50">
          <img src={ads.left} alt="Left Ad" className="w-full h-[500px] rounded shadow" />
        </div>
      </div>

      {/* Main Auction Content */}
      <div className="flex-1 max-w-3xl overflow-y-auto border p-6 rounded-lg shadow">
        <button onClick={() => navigate(-1)} className="mb-6 text-indigo-700 hover:underline">← Back</button>
        {item.status === "ended" && (
          <div className="bg-green-100 border border-green-300 px-4 py-3 rounded mb-4">
            🎉 Auction Ended — Winner: <strong>{item.highestBidderName || "No winner"}</strong>
            {' '}| Final Price: <strong>₹{Number(item.currentPrice).toLocaleString()}</strong>
          </div>
        )}
        <img src={item.image} alt={item.productName} className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg mb-4" />
        <h1 className="text-2xl font-bold mb-2">{item.productName}</h1>
        <p className="mb-1">Current Bid: <strong>₹{Number(item.currentPrice).toLocaleString()}</strong></p>
        <p className="mb-4 text-sm text-gray-600">Highest Bidder: {item.highestBidderName || "No bids yet"}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          { bidIncrements.map(inc => (
            <button key={inc} onClick={() => handlePlaceBid(inc)} className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded">+₹{inc.toLocaleString()}</button>
          )) }
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Bidding History</h2>
          <ul className="space-y-2 max-h-[400px] overflow-y-auto">
            { bids.length === 0 ? <li className="text-gray-500">No bids yet</li> :
              bids.map((b,i)=>(
                <li key={i} className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">{b.bidder}</span>
                  <span className="text-indigo-700 font-semibold">₹{Number(b.amount).toLocaleString()}</span>
                </li>
              ))
            }
          </ul>
        </div>
      </div>

      {/* Right Ad */}
      <div className="hidden lg:block w-[400px] flex-shrink-0">
        <div className="sticky top-50">
          <img src={ads.right} alt="Right Ad" className="w-full h-[500px] rounded shadow" />
        </div>
      </div>
    </div>
  );
};

export default AuctionItem;
