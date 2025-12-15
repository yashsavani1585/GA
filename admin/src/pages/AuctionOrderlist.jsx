import React, { useEffect, useState } from "react";
import axios from "axios";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

const AuctionOrderlist = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/order/payment-records`
      );

      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading auction orders...
      </p>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#4f1c51]">
        Auction Orders
      </h1>

      {/* LIST */}
      <div className="space-y-4">
        {orders.map((order) => {
          const p = order.paymentRecord;

          return (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row gap-6 cursor-pointer hover:shadow-lg"
              onClick={() => setSelected(order)}
            >
              {/* PRODUCT */}
              <img
                src={p?.items?.[0]?.image}
                alt="product"
                className="w-28 h-28 rounded-xl object-cover"
              />

              {/* DETAILS */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  {p?.auction?.productName}
                </h2>

                <p className="text-sm text-gray-500">
                  Order ID: <b>{order.order_id}</b>
                </p>

                <p className="text-sm mt-1">
                  Buyer:{" "}
                  <span className="font-medium">
                    {p?.user?.name}
                  </span>
                </p>

                <p className="text-sm">
                  Payment Status:{" "}
                  <span
                    className={`font-semibold ${
                      p?.status === "SUCCESS"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {p?.status}
                  </span>
                </p>
              </div>

              {/* AMOUNT */}
              <div className="text-right">
                <p className="text-xl font-bold text-[#4f1c51]">
                  ₹{p?.amountRupees}
                </p>
                <p className="text-xs text-gray-500">
                  Deposit: ₹{p?.depositRupees}
                </p>
                <p className="text-xs text-gray-500">
                  Due: ₹{p?.amountDueRupees}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white max-w-3xl w-full rounded-3xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-5 text-xl"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>

            {(() => {
              const p = selected.paymentRecord;
              return (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-[#4f1c51]">
                    {p?.auction?.productName}
                  </h2>

                  <img
                    src={p?.items?.[0]?.image}
                    className="w-40 h-40 rounded-xl mb-4"
                    alt="product"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><b>Order ID:</b> {selected.order_id}</p>
                      <p><b>Payment ID:</b> {p?.razorpayPaymentId}</p>
                      <p><b>Razorpay Order:</b> {p?.razorpayOrderId}</p>
                      <p><b>Status:</b> {p?.status}</p>
                    </div>

                    <div>
                      <p><b>Buyer:</b> {p?.user?.name}</p>
                      <p><b>Email:</b> {p?.user?.email}</p>
                      <p><b>Amount:</b> ₹{p?.amountRupees}</p>
                      <p><b>Deposit:</b> ₹{p?.depositRupees}</p>
                      <p><b>Due:</b> ₹{p?.amountDueRupees}</p>
                    </div>
                  </div>

                  <h3 className="font-semibold mt-4 mb-2">
                    Delivery Address
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {p?.address?.fullName} <br />
                    {p?.address?.line1} <br />
                    {p?.address?.city}, {p?.address?.state} -{" "}
                    {p?.address?.pincode}
                  </p>

                  <h3 className="font-semibold mt-4 mb-2">
                    Items
                  </h3>
                  {p?.items?.map((it) => (
                    <div
                      key={it._id}
                      className="flex items-center gap-4 border rounded-xl p-3 mb-2"
                    >
                      <img
                        src={it.image}
                        className="w-16 h-16 rounded-lg"
                        alt={it.name}
                      />
                      <div>
                        <p className="font-medium">{it.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {it.quantity} | ₹{it.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionOrderlist;
