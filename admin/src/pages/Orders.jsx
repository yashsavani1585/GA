import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";
const currency = "₹";

const STATUSES = [
  "Order Placed",
  "Processing",
  "Quality Check",
  "Packing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Canceled",
];

const statusClasses = {
  "Order Placed": "bg-yellow-100 text-yellow-800 ring-yellow-200",
  Processing: "bg-blue-100 text-blue-800 ring-blue-200",
  "Quality Check": "bg-indigo-100 text-indigo-800 ring-indigo-200",
  Packing: "bg-purple-100 text-purple-800 ring-purple-200",
  Shipped: "bg-cyan-100 text-cyan-800 ring-cyan-200",
  "Out for Delivery": "bg-orange-100 text-orange-800 ring-orange-200",
  Delivered: "bg-green-100 text-green-800 ring-green-200",
  Canceled: "bg-red-100 text-red-800 ring-red-200",
};

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState({});

  // 🔹 Fetch All Orders
  const fetchOrders = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/order/list`,
        {},
        { headers: { token } }
      );
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update Order Status
  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdating((p) => ({ ...p, [orderId]: true }));
      const { data } = await axios.post(
        `${backendUrl}/order/status`,
        { orderId, status: newStatus },
        { headers: { token } }
      );
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === orderId ? { ...o, deliveryStatus: newStatus } : o
          )
        );
        toast.success("Order status updated!");
      } else toast.error(data.message || "Update failed");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error updating order");
    } finally {
      setUpdating((p) => ({ ...p, [orderId]: false }));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  // 🔍 Advanced Search (OrderID, UserID, PaymentID, Name, Phone)
  const filtered = orders.filter((o) => {
    const q = query.toLowerCase();
    return (
      o.order_id?.toLowerCase().includes(q) ||
      o.userId?.toLowerCase().includes(q) ||
      o.paymentRef?.toLowerCase().includes(q) ||
      o.razorpayPaymentId?.toLowerCase().includes(q) ||
      o.razorpayOrderId?.toLowerCase().includes(q) ||
      o.address?.recipientName?.toLowerCase().includes(q) ||
      o.address?.recipientMobile?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full font-sans">
      <div className="bg-white rounded-2xl shadow ring-1 ring-purple-100 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-[#4f1c51]">
            Orders Management
          </h3>
          <button
            onClick={fetchOrders}
            className="rounded-xl bg-[#CEBB98] text-white px-4 py-2 shadow hover:shadow-md"
          >
            Refresh
          </button>
        </div>

        {/* Search */}
        <input
          className="w-full sm:max-w-lg mb-4 rounded-xl border px-3 py-2 focus:ring-4 focus:ring-pink-200"
          placeholder="Search by Order ID, User ID, Payment ID, Name, or Phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Orders List */}
        {loading ? (
          <p className="text-gray-500 text-center">Loading orders...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center">No orders found.</p>
        ) : (
          filtered.map((order) => (
            <div
              key={order._id}
              onClick={() => setSelectedOrder(order)}
              className="cursor-pointer border p-3 rounded-xl mb-2 hover:shadow-sm transition grid grid-cols-1 md:grid-cols-[1.2fr_1.8fr_1.2fr_1fr_1.3fr] gap-3"
            >
              {/* Order Info */}
              <div>
                <p className="font-semibold text-gray-800">
                  #{order.order_id.slice(-8)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Customer */}
              <div>
                <p className="font-semibold">
                  {order.address?.recipientName || "—"}
                </p>
                <p className="text-xs text-gray-600">
                  {order.address?.street}, {order.address?.locality}
                </p>
                <p className="text-xs text-gray-500">
                  📞 {order.address?.recipientMobile || "—"}
                </p>
              </div>

              {/* Amount */}
              <p className="text-sm font-medium">
                {currency}
                {order.amount.toLocaleString("en-IN")}
              </p>

              {/* Status Dropdown */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-lg text-xs ring-1 ${
                    statusClasses[order.deliveryStatus] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.deliveryStatus}
                </span>
                <select
                  onChange={(e) =>
                    updateStatus(order.order_id, e.target.value)
                  }
                  value={order.deliveryStatus}
                  disabled={!!updating[order.order_id]}
                  className="rounded-lg border px-2 py-1 text-sm focus:ring-2 focus:ring-pink-200"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment */}
              <div className="text-xs">
                <p
                  className={`font-semibold ${
                    order.paymentStatus === "SUCCESS"
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {order.paymentStatus}
                </p>
                <p>ID: {order.razorpayPaymentId || "—"}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal (Full Details) */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-3xl shadow-xl max-w-4xl w-full relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-5 top-4 text-gray-500 text-xl hover:text-red-500"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-[#4f1c51] mb-4">
              Order #{selectedOrder.order_id.slice(-8)}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5 text-sm text-gray-700">
              <div>
                <p><strong>User ID:</strong> {selectedOrder.userId}</p>
                <p><strong>Payment Ref:</strong> {selectedOrder.paymentRef}</p>
                <p><strong>Ref Model:</strong> {selectedOrder.paymentRefModel}</p>
                <p><strong>Razorpay Order:</strong> {selectedOrder.razorpayOrderId}</p>
                <p><strong>Razorpay Payment:</strong> {selectedOrder.razorpayPaymentId}</p>
                <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
              </div>
              <div>
                <p><strong>Status:</strong> {selectedOrder.deliveryStatus}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p><strong>Amount:</strong> ₹{selectedOrder.amount.toLocaleString("en-IN")}</p>
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-2">Delivery Address:</h3>
            <p className="text-gray-600 mb-4">
              {selectedOrder.address?.recipientName} <br />
              {selectedOrder.address?.houseNo}, {selectedOrder.address?.street},{" "}
              {selectedOrder.address?.locality}, {selectedOrder.address?.landmark}{" "}
              - {selectedOrder.address?.pincode}
            </p>

            <h3 className="font-semibold text-lg mb-2">Items:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedOrder.items.map((it, i) => (
                <div
                  key={i}
                  className="border p-3 rounded-xl flex flex-col items-center shadow-sm"
                >
                  <img
                    src={it.image}
                    className="w-28 h-28 object-cover rounded-xl mb-2"
                    alt={it.name}
                  />
                  <p className="font-medium">{it.name}</p>
                  <p className="text-sm text-gray-600">
                    Qty: {it.quantity} | ₹{it.price}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-right text-xl font-bold text-[#4f1c51]">
              Total: ₹{selectedOrder.amount.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
