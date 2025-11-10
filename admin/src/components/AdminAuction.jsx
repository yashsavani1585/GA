// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function AdminAuction() {
//   const [auctions, setAuctions] = useState([]);
//   const [form, setForm] = useState({
//     productName: "",
//     productDescription: "",
//     productImageFile: null,
//     startingPrice: "",
//     durationMinutes: 5,
//     minIncrement: 1,
//     startAt: "", // ✅ schedule start time support
//   });
//   const [previewImage, setPreviewImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem("token");

//   const axiosInstance = axios.create({
//     baseURL: "http://localhost:4000/api/auction",
//     headers: token ? { Authorization: `Bearer ${token}` } : {},
//   });

//   // --------------------------
//   // Fetch all auctions
//   // --------------------------
//   const fetchAuctions = async () => {
//     try {
//       const res = await axiosInstance.get("/all");
//       setAuctions(res.data.data || []);
//     } catch (err) {
//       console.error("Fetch auctions error:", err.response?.data || err.message);
//     }
//   };

//   // --------------------------
//   // Create Auction
//   // --------------------------
//   const handleCreate = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const { productName, startingPrice, productImageFile, durationMinutes, minIncrement, startAt } = form;

//       if (!productName || !startingPrice || !productImageFile) {
//         alert("Please fill all required fields and upload an image");
//         setLoading(false);
//         return;
//       }

//       const formData = new FormData();
//       formData.append("productName", productName);
//       formData.append("productDescription", form.productDescription);
//       formData.append("startingPrice", startingPrice);
//       formData.append("durationMinutes", durationMinutes);
//       formData.append("minIncrement", minIncrement);
//       if (startAt) formData.append("startAt", startAt);
//       formData.append("productImage", productImageFile);

//       await axiosInstance.post("/create", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("Auction created successfully!");
//       setForm({
//         productName: "",
//         productDescription: "",
//         productImageFile: null,
//         startingPrice: "",
//         durationMinutes: 5,
//         minIncrement: 1,
//         startAt: "",
//       });
//       setPreviewImage(null);
//       fetchAuctions();
//     } catch (err) {
//       console.error("Create auction error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------
//   // Start / End / Delete Auction
//   // --------------------------
//   const handleAction = async (id, action) => {
//     setLoading(true);
//     try {
//       if (action === "delete") await axiosInstance.delete(`/delete/${id}`);
//       if (action === "start") await axiosInstance.post(`/start/${id}`);
//       if (action === "end") await axiosInstance.post(`/end/${id}`);
//       fetchAuctions();
//     } catch (err) {
//       console.error(`${action} auction error:`, err.response?.data || err.message);
//       alert(err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------
//   // Handle image upload and preview
//   // --------------------------
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setForm({ ...form, productImageFile: file });
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setPreviewImage(reader.result);
//       reader.readAsDataURL(file);
//     } else {
//       setPreviewImage(null);
//     }
//   };

//   useEffect(() => {
//     fetchAuctions();
//   }, []);

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6 text-center">Auction Admin Panel</h1>

//       {/* -------------------------- */}
//       {/* Create Auction Form */}
//       {/* -------------------------- */}
//       <form
//         onSubmit={handleCreate}
//         className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
//       >
//         <input
//           type="text"
//           placeholder="Product Name"
//           value={form.productName}
//           onChange={(e) => setForm({ ...form, productName: e.target.value })}
//           className="border p-2 rounded"
//           required
//         />

//         <input
//           type="text"
//           placeholder="Description"
//           value={form.productDescription}
//           onChange={(e) => setForm({ ...form, productDescription: e.target.value })}
//           className="border p-2 rounded"
//         />

//         {/* ✅ Upload Image Button (not choose file) */}
//         <div className="col-span-1 md:col-span-2 flex flex-col items-start">
//           <label
//             htmlFor="fileUpload"
//             className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer"
//           >
//             {form.productImageFile ? "Change Image" : "Upload Image"}
//           </label>
//           <input
//             id="fileUpload"
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="hidden"
//           />
//         </div>

//         {previewImage && (
//           <img
//             src={previewImage}
//             alt="Preview"
//             className="col-span-1 md:col-span-2 w-full h-48 object-contain rounded border mt-2"
//           />
//         )}

//         <input
//           type="number"
//           placeholder="Starting Price"
//           value={form.startingPrice}
//           onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="number"
//           placeholder="Duration (minutes)"
//           value={form.durationMinutes}
//           onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="number"
//           placeholder="Min Increment"
//           value={form.minIncrement}
//           onChange={(e) => setForm({ ...form, minIncrement: e.target.value })}
//           className="border p-2 rounded"
//           required
//         />

//         {/* ✅ Future Date & Time Input */}
//         <label className="col-span-1 md:col-span-2 text-sm font-semibold text-gray-600">
//           Schedule Start Time (optional)
//         </label>
//         <input
//           type="datetime-local"
//           value={form.startAt}
//           onChange={(e) => setForm({ ...form, startAt: e.target.value })}
//           className="border p-2 rounded col-span-1 md:col-span-2"
//         />

//         <button
//           type="submit"
//           className={`bg-green-600 text-white p-2 rounded col-span-1 md:col-span-2 hover:bg-green-700 ${
//             loading ? "opacity-70 cursor-not-allowed" : ""
//           }`}
//           disabled={loading}
//         >
//           {loading ? "Processing..." : "Create Auction"}
//         </button>
//       </form>

//       {/* -------------------------- */}
//       {/* Auctions List */}
//       {/* -------------------------- */}
//       <div className="overflow-x-auto">
//         <table className="w-full bg-white rounded-xl shadow overflow-hidden text-sm">
//           <thead className="bg-gray-200 text-gray-700">
//             <tr>
//               <th className="p-2 text-left">Product</th>
//               <th>Current Price</th>
//               <th>Status</th>
//               <th>Ends At</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {auctions.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="text-center p-4 text-gray-500">
//                   No auctions available
//                 </td>
//               </tr>
//             ) : (
//               auctions.map((a) => (
//                 <tr key={a._id} className="border-b hover:bg-gray-50 transition">
//                   <td className="p-2 flex items-center gap-2">
//                     {a.productImage && (
//                       <img
//                         src={a.productImage}
//                         alt={a.productName}
//                         className="w-12 h-12 object-cover rounded"
//                       />
//                     )}
//                     <span>{a.productName}</span>
//                   </td>
//                   <td className="text-center">{a.currentPrice}</td>
//                   <td className="text-center capitalize">{a.status}</td>
//                   <td className="text-center">
//                     {a.endTime ? new Date(a.endTime).toLocaleString() : "-"}
//                   </td>
//                   <td className="flex gap-2 p-2 flex-wrap justify-center">
//                     {a.status !== "live" && (
//                       <button
//                         onClick={() => handleAction(a._id, "start")}
//                         className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                       >
//                         Start
//                       </button>
//                     )}
//                     {a.status === "live" && (
//                       <button
//                         onClick={() => handleAction(a._id, "end")}
//                         className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                       >
//                         End
//                       </button>
//                     )}
//                     <button
//                       onClick={() => handleAction(a._id, "delete")}
//                       className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function AdminAuction() {
  const [auctions, setAuctions] = useState([]);
  const [form, setForm] = useState({
    productName: "",
    productDescription: "",
    productImageFile: null,
    startingPrice: "",
    durationMinutes: 60,
    minIncrement: 1,
    startAt: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Setup toast notifications globally
  useEffect(() => {
    toast.dismiss(); // clear any old toasts
  }, []);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:4000/api/auction",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // ✅ Fetch all auctions
  const fetchAuctions = async () => {
    try {
      const res = await axiosInstance.get("/all");
      setAuctions(res.data.data || []);
    } catch (err) {
      console.error("Fetch auctions error:", err);
      toast.error("Failed to fetch auctions");
    }
  };

  // ✅ Create new auction
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { productName, startingPrice, productImageFile, durationMinutes, minIncrement, startAt } = form;

    if (!productName || !startingPrice || !productImageFile) {
      toast.error("Please fill all required fields and upload an image");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("productDescription", form.productDescription || "");
      formData.append("startingPrice", Number(startingPrice));
      formData.append("durationMinutes", Number(durationMinutes));
      formData.append("minIncrement", Number(minIncrement));
      if (startAt) formData.append("startAt", startAt);
      formData.append("productImage", productImageFile);

      await axiosInstance.post("/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Auction created successfully!");
      setForm({
        productName: "",
        productDescription: "",
        productImageFile: null,
        startingPrice: "",
        durationMinutes: 60,
        minIncrement: 1,
        startAt: "",
      });
      setPreviewImage(null);
      fetchAuctions();
    } catch (err) {
      console.error("Create auction error:", err);
      toast.error(err.response?.data?.message || "Error creating auction");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Perform actions on auction (start, end, delete)
  const handleAction = async (id, action) => {
    setLoading(true);
    try {
      if (action === "delete") await axiosInstance.delete(`/delete/${id}`);
      if (action === "start") await axiosInstance.post(`/start/${id}`);
      if (action === "end") await axiosInstance.post(`/end/${id}`);

      toast.success(`Auction ${action}ed successfully`);
      fetchAuctions();
    } catch (err) {
      console.error(`${action} auction error:`, err);
      toast.error(err.response?.data?.message || `Failed to ${action} auction`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, productImageFile: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        🛍️ Admin Auction Dashboard
      </h1>

      {/* Auction Creation Form */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Product Name"
          value={form.productName}
          onChange={(e) => setForm({ ...form, productName: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={form.productDescription}
          onChange={(e) => setForm({ ...form, productDescription: e.target.value })}
          className="border p-2 rounded"
        />

        {/* Upload Image */}
        <div className="col-span-1 md:col-span-2 flex flex-col items-start">
          <label
            htmlFor="fileUpload"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded cursor-pointer"
          >
            {form.productImageFile ? "Change Image" : "Upload Image"}
          </label>
          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="col-span-1 md:col-span-2 w-full h-48 object-contain rounded border mt-2"
          />
        )}

        <input
          type="number"
          placeholder="Starting Price"
          value={form.startingPrice}
          onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Duration (minutes)"
          value={form.durationMinutes}
          onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Min Increment"
          value={form.minIncrement}
          onChange={(e) => setForm({ ...form, minIncrement: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <label className="col-span-1 md:col-span-2 text-sm font-semibold text-gray-600">
          Schedule Start Time (optional)
        </label>
        <input
          type="datetime-local"
          value={form.startAt}
          onChange={(e) => setForm({ ...form, startAt: e.target.value })}
          className="border p-2 rounded col-span-1 md:col-span-2"
        />

        <button
          type="submit"
          className={`bg-green-600 text-white p-2 rounded col-span-1 md:col-span-2 hover:bg-green-700 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Create Auction"}
        </button>
      </form>

      {/* Auction Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-2 text-left">Product</th>
              <th>Current Price</th>
              <th>Status</th>
              <th>Ends At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {auctions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No auctions available
                </td>
              </tr>
            ) : (
              auctions.map((a) => (
                <tr key={a._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-2 flex items-center gap-2">
                    {a.productImage && (
                      <img
                        src={a.productImage}
                        alt={a.productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <span>{a.productName}</span>
                  </td>
                  <td className="text-center font-semibold text-gray-700">
                    ₹{a.currentPrice?.toLocaleString()}
                  </td>
                  <td
                    className={`text-center font-semibold capitalize ${
                      a.status === "live"
                        ? "text-green-600"
                        : a.status === "ended"
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {a.status}
                  </td>
                  <td className="text-center">
                    {a.endTime ? new Date(a.endTime).toLocaleString() : "-"}
                  </td>
                  <td className="flex gap-2 p-2 flex-wrap justify-center">
                    {a.status !== "live" && (
                      <button
                        onClick={() => handleAction(a._id, "start")}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Start
                      </button>
                    )}
                    {a.status === "live" && (
                      <button
                        onClick={() => handleAction(a._id, "end")}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        End
                      </button>
                    )}
                    <button
                      onClick={() => handleAction(a._id, "delete")}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
