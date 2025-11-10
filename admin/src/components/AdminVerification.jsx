// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";

// const SOCKET_URL = "http://localhost:4000";

// const AdminVerification = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("token"); // Admin JWT token from login
//   const [socket, setSocket] = useState(null);

//   // Fetch all users pending verification
//   const fetchPending = async () => {
//     if (!token) {
//       alert("You are not logged in. Please login as admin first.");
//       window.location.href = "/login";
//       return;
//     }

//     try {
//       const res = await axios.get(`${SOCKET_URL}/api/verify/pending`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setUsers(res.data.users || []);
//     } catch (err) {
//       console.error("Error fetching pending verifications:", err);
//       if (err.response?.status === 401) {
//         alert("Session expired or unauthorized access. Please log in again.");
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPending();

//     // Setup socket for live updates
//     const newSocket = io(SOCKET_URL, { transports: ["websocket"] });
//     setSocket(newSocket);

//     // When a user is verified by admin (even from another session), update locally
//     newSocket.on("userVerified", (verifiedUser) => {
//       setUsers((prev) =>
//         prev.filter((u) => u._id !== verifiedUser._id)
//       );
//     });

//     return () => newSocket.disconnect();
//   }, []);

//   // Handle verification approve click
//   const handleVerify = async (userId) => {
//     if (!token) {
//       alert("Unauthorized! Please log in first.");
//       window.location.href = "/login";
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `${SOCKET_URL}/api/verify/verify/${userId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       alert(res.data.message || "✅ User verified!");

//       // Emit via socket to notify other clients (auction frontend)
//       // if (socket) {
//       //   socket.emit("userVerified", res.data.user);
//       // }

//       fetchPending(); // refresh pending users list
//     } catch (err) {
//       console.error("Error verifying user:", err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         alert("Unauthorized access. Admin login required.");
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//       } else {
//         alert(err.response?.data?.message || "❌ Failed to verify user.");
//       }
//     }
//   };

//   if (loading)
//     return (
//       <p className="text-center mt-10 text-gray-600">
//         Loading pending verifications...
//       </p>
//     );

//   if (users.length === 0)
//     return (
//       <p className="text-center mt-10 text-gray-600">
//         No users pending verification.
//       </p>
//     );

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-bold text-center mb-6 text-yellow-900">
//         Admin Verification Dashboard
//       </h1>

//       <div className="overflow-x-auto shadow-md rounded-lg border">
//         <table className="min-w-full border-collapse">
//           <thead className="bg-yellow-700 text-white">
//             <tr>
//               <th className="py-2 px-4">#</th>
//               <th className="py-2 px-4">Name</th>
//               <th className="py-2 px-4">Email</th>
//               <th className="py-2 px-4">Document Type</th>
//               <th className="py-2 px-4">Document</th>
//               <th className="py-2 px-4">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user, index) => (
//               <tr
//                 key={user._id}
//                 className="text-center border-t hover:bg-gray-50 transition-colors"
//               >
//                 <td className="py-2 px-4">{index + 1}</td>
//                 <td className="py-2 px-4">{user.name}</td>
//                 <td className="py-2 px-4">{user.email}</td>
//                 <td className="py-2 px-4">{user.documentType || "N/A"}</td>
//                 <td className="py-2 px-4">
//                   {user.documentFile ? (
//                     <a
//                       href={user.documentFile}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 underline"
//                     >
//                       View Document
//                     </a>
//                   ) : (
//                     "No file"
//                   )}
//                 </td>
//                 <td className="py-2 px-4">
//                   <button
//                     onClick={() => handleVerify(user._id)}
//                     className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded transition-colors"
//                   >
//                     Verify
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminVerification;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";

// const SOCKET_URL = "http://localhost:4000";

// const AdminVerification = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [socket, setSocket] = useState(null);

//   const token = localStorage.getItem("token");

//   // Fetch all users pending verification
//   const fetchPending = async () => {
//     if (!token) {
//       alert("You are not logged in. Please login as admin first.");
//       window.location.href = "/login";
//       return;
//     }

//     try {
//       const res = await axios.get(`${SOCKET_URL}/api/verify/pending`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setUsers(res.data.users || []);
//     } catch (err) {
//       console.error("Error fetching pending verifications:", err);
//       if (err.response?.status === 401) {
//         alert("Session expired or unauthorized access. Please log in again.");
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPending();

//     // Setup socket for live updates
//     const newSocket = io(SOCKET_URL, { 
//       transports: ["websocket"],
//       auth: { token }
//     });
//     setSocket(newSocket);

//     // Listen for new verification submissions
//     newSocket.on("newVerification", (newUser) => {
//       console.log("New verification received:", newUser);
//       setUsers(prev => {
//         // Avoid duplicates
//         const exists = prev.find(u => u._id === newUser.userId);
//         if (!exists) {
//           return [...prev, {
//             _id: newUser.userId,
//             name: newUser.name,
//             email: newUser.email,
//             documentType: newUser.documentType,
//             documentFile: newUser.documentFile,
//             verificationSubmittedAt: newUser.submittedAt
//           }];
//         }
//         return prev;
//       });
//     });

//     // When a user is verified (from any admin session), remove from list
//     newSocket.on("userVerified", (verifiedUser) => {
//       setUsers((prev) => prev.filter((u) => u._id !== verifiedUser.userId));
//     });

//     newSocket.on("connect", () => {
//       console.log("Admin connected to server");
//     });

//     return () => newSocket.disconnect();
//   }, [token]);

//   // Handle verification approve click
//   const handleVerify = async (userId) => {
//     if (!token) {
//       alert("Unauthorized! Please log in first.");
//       window.location.href = "/login";
//       return;
//     }

//     if (!window.confirm("Are you sure you want to verify this user?")) {
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `${SOCKET_URL}/api/verify/verify/${userId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       alert(res.data.message || "✅ User verified!");

//       // Remove from local list immediately
//       setUsers(prev => prev.filter(u => u._id !== userId));

//       // Emit via socket to notify all clients
//       if (socket) {
//         socket.emit("userVerified", { userId, verified: true });
//       }

//     } catch (err) {
//       console.error("Error verifying user:", err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         alert("Unauthorized access. Admin login required.");
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//       } else {
//         alert(err.response?.data?.message || "❌ Failed to verify user.");
//       }
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString();
//   };

//   if (loading)
//     return (
//       <p className="text-center mt-10 text-gray-600">
//         Loading pending verifications...
//       </p>
//     );

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-bold text-center mb-6 text-yellow-900">
//         Admin Verification Dashboard
//       </h1>

//       <div className="mb-4 text-sm text-gray-600">
//         Total Pending: {users.length}
//       </div>

//       {users.length === 0 ? (
//         <p className="text-center mt-10 text-gray-600">
//           No users pending verification.
//         </p>
//       ) : (
//         <div className="overflow-x-auto shadow-md rounded-lg border">
//           <table className="min-w-full border-collapse">
//             <thead className="bg-yellow-700 text-white">
//               <tr>
//                 <th className="py-2 px-4">#</th>
//                 <th className="py-2 px-4">Name</th>
//                 <th className="py-2 px-4">Email</th>
//                 <th className="py-2 px-4">Document Type</th>
//                 <th className="py-2 px-4">Submitted At</th>
//                 <th className="py-2 px-4">Document</th>
//                 <th className="py-2 px-4">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user, index) => (
//                 <tr
//                   key={user._id}
//                   className="text-center border-t hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="py-2 px-4">{index + 1}</td>
//                   <td className="py-2 px-4">{user.name}</td>
//                   <td className="py-2 px-4">{user.email}</td>
//                   <td className="py-2 px-4">{user.documentType || "N/A"}</td>
//                   <td className="py-2 px-4 text-sm">
//                     {user.verificationSubmittedAt ? formatDate(user.verificationSubmittedAt) : "N/A"}
//                   </td>
//                   <td className="py-2 px-4">
//                     {user.documentFile ? (
//                       <a
//                         href={user.documentFile}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline hover:text-blue-800"
//                       >
//                         View Document
//                       </a>
//                     ) : (
//                       "No file"
//                     )}
//                   </td>
//                   <td className="py-2 px-4">
//                     <button
//                       onClick={() => handleVerify(user._id)}
//                       className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded transition-colors"
//                     >
//                       Verify
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminVerification;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000";

const AdminVerification = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch pending verifications
  const fetchPending = async () => {
    try {
      const res = await axios.get(`${SOCKET_URL}/api/verify/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching pending:", err);
      if (err.response?.status === 401) {
        alert("Unauthorized, please log in again.");
        localStorage.clear();
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
    });
    setSocket(newSocket);

    newSocket.on("newVerification", (data) => {
      setUsers((prev) => [...prev, data.user]);
    });

    newSocket.on("userVerified", (data) => {
      setUsers((prev) => prev.filter((u) => u._id !== data.userId));
    });

    return () => newSocket.disconnect();
  }, [token]);

  const handleVerify = async (userId) => {
    if (!window.confirm("Verify this user?")) return;

    try {
      const res = await axios.post(
        `${SOCKET_URL}/api/verify/verify/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "✅ User verified successfully!");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      socket.emit("userVerified", { userId });
    } catch (err) {
      console.error("Verification failed:", err);
      alert(err.response?.data?.message || "Failed to verify user.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading users...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-yellow-900">
        Admin Verification Dashboard
      </h1>

      {users.length === 0 ? (
        <p className="text-center text-gray-600">No pending verifications.</p>
      ) : (
        <table className="min-w-full border">
          <thead className="bg-yellow-700 text-white">
            <tr>
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Document Type</th>
              <th className="py-2 px-4">Document</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id} className="border-t text-center">
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.documentType}</td>
                <td>
                  <a
                    href={u.documentFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </td>
                <td>
                  <button
                    onClick={() => handleVerify(u._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Verify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminVerification;
