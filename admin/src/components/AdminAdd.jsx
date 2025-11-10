import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdsForm() {
  const [leftAd, setLeftAd] = useState(null);
  const [rightAd, setRightAd] = useState(null);
  const [previewLeft, setPreviewLeft] = useState(null);
  const [previewRight, setPreviewRight] = useState(null);
  const [ads, setAds] = useState({ leftAd: "", rightAd: "" });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token"); // Make sure user is logged in

  useEffect(() => {
    fetchAds();
  }, []);

  // Fetch current ads
  const fetchAds = async () => {
    if (!token) return alert("You must be logged in to view ads.");

    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAds(res.data);
      setPreviewLeft(res.data.leftAd);
      setPreviewRight(res.data.rightAd);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        alert("Unauthorized. Please login again.");
      } else {
        alert("Failed to fetch ads.");
      }
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return alert("You must be logged in to update ads.");

    const formData = new FormData();
    if (leftAd) formData.append("leftAd", leftAd);
    if (rightAd) formData.append("rightAd", rightAd);

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ads`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Ads updated successfully!");
      setLeftAd(null);
      setRightAd(null);
      fetchAds(); // Refresh previews
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        alert("Unauthorized. Please login again.");
      } else {
        alert("Failed to update ads.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Update Ads</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Left Ad */}
        <div>
          <label className="block mb-2 font-medium">Left Ad</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setLeftAd(e.target.files[0]);
              setPreviewLeft(URL.createObjectURL(e.target.files[0]));
            }}
          />
          {previewLeft && (
            <img
              src={previewLeft}
              alt="Left Ad Preview"
              className="mt-2 w-full max-w-xs rounded border"
            />
          )}
        </div>

        {/* Right Ad */}
        <div>
          <label className="block mb-2 font-medium">Right Ad</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setRightAd(e.target.files[0]);
              setPreviewRight(URL.createObjectURL(e.target.files[0]));
            }}
          />
          {previewRight && (
            <img
              src={previewRight}
              alt="Right Ad Preview"
              className="mt-2 w-full max-w-xs rounded border"
            />
          )}
        </div>

        <button
          type="submit"
          className={`bg-indigo-600 text-white px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Ads"}
        </button>
      </form>
    </div>
  );
}
