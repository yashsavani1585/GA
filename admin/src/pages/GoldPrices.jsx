import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";
import axios from "axios";
import PropTypes from "prop-types";

const GoldPrices = ({ token }) => {
  const [price24K, setPrice24K] = useState("");
  const [currentPrices, setCurrentPrices] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch current prices
  const fetchCurrentPrices = async () => {
    try {
      const response = await axios.get(`${backendUrl}/pricing/gold-prices`);
      if (response.data.success) {
        setCurrentPrices(response.data.prices);
      }
    } catch (error) {
      console.error("Error fetching current prices:", error);
    }
  };

  // Fetch price history
  const fetchPriceHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await axios.get(`${backendUrl}/pricing/admin/price-history`, {
        headers: { token }
      });
      if (response.data.success) {
        setPriceHistory(response.data.history);
      }
    } catch (error) {
      console.error("Error fetching price history:", error);
      toast.error("Failed to load price history");
    } finally {
      setLoadingHistory(false);
    }
  };

  // Set new gold price
  const handleSetPrice = async (e) => {
    e.preventDefault();
    
    if (!price24K || parseFloat(price24K) <= 0) {
      toast.error("Please enter a valid 24K gold price");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/pricing/admin/set-price`, {
        price24K: parseFloat(price24K)
      }, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success("Gold prices updated successfully!");
        setPrice24K("");
        await fetchCurrentPrices();
        await fetchPriceHistory();
      } else {
        toast.error(response.data.message || "Failed to update prices");
      }
    } catch (error) {
      console.error("Error setting price:", error);
      toast.error("Failed to update gold prices");
    } finally {
      setLoading(false);
    }
  };

  // Delete price entry
  const handleDeletePrice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this price entry?")) {
      return;
    }

    try {
      const response = await axios.delete(`${backendUrl}/pricing/admin/delete-price`, {
        data: { id },
        headers: { token }
      });

      if (response.data.success) {
        toast.success("Price entry deleted successfully");
        await fetchCurrentPrices();
        await fetchPriceHistory();
      } else {
        toast.error(response.data.message || "Failed to delete price entry");
      }
    } catch (error) {
      console.error("Error deleting price:", error);
      toast.error("Failed to delete price entry");
    }
  };

  // Calculate preview prices
  const calculatePreviews = (base24K) => {
    if (!base24K || parseFloat(base24K) <= 0) return null;
    
    const base = parseFloat(base24K);
    return {
      "24K": Math.round(base),
      "18K": Math.round((18/24) * base),
      "14K": Math.round((14/24) * base),
      "10K": Math.round((10/24) * base)
    };
  };

  const previewPrices = calculatePreviews(price24K);

  useEffect(() => {
    fetchCurrentPrices();
    fetchPriceHistory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gold Price Management</h1>
        <p className="text-gray-600">Manage 24K gold prices. Other karat prices are calculated automatically.</p>
      </div>

      {/* Current Prices Display */}
      {currentPrices && (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-6 mb-8 border border-yellow-200">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4">Current Gold Prices (per gram)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(currentPrices).map(([karat, price]) => (
              <div key={karat} className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-sm font-medium text-gray-600">{karat} Gold</div>
                <div className="text-2xl font-bold text-yellow-600">{currency}{price.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Set New Price Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Gold Prices</h2>
        
        <form onSubmit={handleSetPrice} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              24K Gold Price (per gram) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price24K}
              onChange={(e) => setPrice24K(e.target.value)}
              placeholder="Enter 24K gold price per gram"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This is the base price. Other karat prices will be calculated automatically.
            </p>
          </div>

          {/* Price Preview */}
          {previewPrices && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Price Preview:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(previewPrices).map(([karat, price]) => (
                  <div key={karat} className="text-center">
                    <div className="text-xs text-gray-500">{karat}</div>
                    <div className="font-semibold text-gray-800">{currency}{price.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !price24K}
            className={`w-full py-2 px-4 rounded-md font-medium transition ${
              loading || !price24K
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-yellow-600 text-white hover:bg-yellow-700"
            }`}
          >
            {loading ? "Updating..." : "Update Gold Prices"}
          </button>
        </form>
      </div>

      {/* Price History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Price History</h2>
          <button
            onClick={fetchPriceHistory}
            className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
          >
            Refresh
          </button>
        </div>

        {loadingHistory ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            <p className="text-gray-500 mt-2">Loading history...</p>
          </div>
        ) : priceHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2">Date</th>
                  <th className="text-left py-3 px-2">24K Price</th>
                  <th className="text-left py-3 px-2">18K Price</th>
                  <th className="text-left py-3 px-2">14K Price</th>
                  <th className="text-left py-3 px-2">10K Price</th>
                  <th className="text-left py-3 px-2">Updated By</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {priceHistory.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      {new Date(entry.createdAt).toLocaleDateString()}
                      <br />
                      <span className="text-xs text-gray-500">
                        {new Date(entry.createdAt).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-medium">{currency}{entry.price24K.toLocaleString()}</td>
                    <td className="py-3 px-2">{currency}{entry.price18K.toLocaleString()}</td>
                    <td className="py-3 px-2">{currency}{entry.price14K.toLocaleString()}</td>
                    <td className="py-3 px-2">{currency}{entry.price10K.toLocaleString()}</td>
                    <td className="py-3 px-2">{entry.updatedBy}</td>
                    <td className="py-3 px-2">
                      {entry.isActive ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {!entry.isActive && (
                        <button
                          onClick={() => handleDeletePrice(entry.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No price history found</p>
            <p className="text-sm">Set your first gold price above to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

GoldPrices.propTypes = {
  token: PropTypes.string.isRequired
};

export default GoldPrices;