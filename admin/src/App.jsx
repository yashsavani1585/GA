import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Edit from "./pages/Edit";
import AdminCustomRequests from "./pages/AdminCustomRequests";
import AdminInquiries from "./pages/AdminInquiries";
import GoldPrices from "./pages/GoldPrices";
import BlogList from "./pages/BlogList";
import AddBlog from "./components/AddBlog";
import EditBlog from "./components/EditBlog";
import AdminAuction from "./components/AdminAuction";
import AdminVerification from "./components/AdminVerification";
import AdsForm from "./components/AdminAdd";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "₹";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  if (token === "") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ToastContainer />
        <Login setToken={setToken} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <ToastContainer position="top-right" />

      {/* Sidebar */}
      <div className="hidden md:block w-[18%] bg-[#CEBB98] shadow-lg">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar setToken={setToken} />

        <main
          className="flex-1 overflow-y-auto px-6 py-8"
          style={{
            background:
              "linear-gradient(180deg, #f9f9f9 0%, #fffdf7 100%)",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-sm ring-1 ring-gray-100">
            <Routes>
              {/* Core Admin Pages */}
              <Route path="/add" element={<Add token={token} />} />
              <Route path="/list" element={<List token={token} />} />
              <Route path="/orders" element={<Orders token={token} />} />
              <Route path="/edit" element={<Edit token={token} />} />

              {/* Requests & Inquiries */}
              <Route
                path="/custom-requests"
                element={<AdminCustomRequests token={token} />}
              />
              <Route
                path="/inquiries"
                element={<AdminInquiries token={token} />}
              />
              <Route
                path="/gold-prices"
                element={<GoldPrices token={token} />}
              />

              {/* Blog Management */}
              <Route path="/blog/list" element={<BlogList token={token} />} />
              <Route path="/addBlog" element={<AddBlog token={token} />} />
              <Route path="/edit/:id" element={<EditBlog token={token} />} />

              {/* Auction Management */}
              <Route
                path="/admin/auctions"
                element={<AdminAuction token={token} />}
              />
              <Route
                path="/admin/verifications"
                element={<AdminVerification token={token} />}
              />
              <Route
                path="/admin/add"
                element={<AdsForm token={token} />}
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
