// AdminInquiries.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

import Round from "../assets/Round.jpg";
import Princess from "../assets/Princess.svg";
import Emerald from "../assets/Emerald.jpg";
import Oval from "../assets/Oval.jpg";
import Pear from "../assets/Pear.svg";
import Heart from "../assets/Heart.jpg";
import Asscher from "../assets/Asscher.jpg";
import Marquise from "../assets/Marquise.svg";
import Hybrid from "../assets/Hybrid.jpg";
import Antique from "../assets/Antique.jpg";
import Radiant from "../assets/Radiant.jpg";
import Cushion from "../assets/Cushion.jpg";

const DIAMOND_ASSET = {
  Round,
  Princess,
  Emerald,
  Oval,
  Pear,
  Heart,
  Asscher,
  Marquise,
  Hybrid,
  Antique,
  Radiant,
  Cushion,
};
const getDiamondImg = (name) => (name && DIAMOND_ASSET[name]) || null;

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

export default function AdminInquiries() {
  const [rows, setRows] = useState([]);
  const token = localStorage.getItem("token");

  const headers = token
    ? { Authorization: `Bearer ${token}` } // if your backend expects Bearer
    : {}; // fallback to empty

  const fetchData = async () => {
    const { data } = await axios.get(`${API}/forms/admin/inquiries`, {
      headers,
    });
    if (data.success) setRows(data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateRow = async (id, payload) => {
    await axios.patch(`${API}/forms/admin/inquiries/${id}`, payload, {
      headers,
    });
    fetchData();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Inquiries</h2>
      <div className="overflow-auto border rounded">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email / Phone</th>
              <th className="p-3 text-left">Topic</th>
              <th className="p-3 text-left">Diamond</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Admin Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id} className="border-t align-top">
                <td className="p-3 whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
                <td className="p-3">{r.name}</td>
                <td className="p-3">
                  <div>{r.email}</div>
                  <div className="text-gray-500">{r.phone || "-"}</div>
                </td>
                <td className="p-3">{r.topic}</td>
                <td className="p-3">
                  {r.diamond ? (
                    <div className="flex items-center gap-2">
                      {getDiamondImg(r.diamond.name) ? (
                        <img
                          src={getDiamondImg(r.diamond.name)}
                          alt={r.diamond.name}
                          className="w-7 h-7 rounded object-cover border"
                        />
                      ) : (
                        // fallback if name not found
                        <div className="w-7 h-7 rounded bg-gray-200 grid place-items-center text-xs">
                          {r.diamond.name?.[0] || "?"}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{r.diamond.name}</div>
                        <div className="text-gray-500">
                          Qty: {r.diamondQuantity ?? 1}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>

                <td className="p-3 max-w-[360px] whitespace-pre-wrap">
                  {r.message}
                </td>
                <td className="p-3">
                  <select
                    value={r.status}
                    onChange={(e) =>
                      updateRow(r._id, { status: e.target.value })
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
                <td className="p-3">
                  <textarea
                    defaultValue={r.adminNotes || ""}
                    onBlur={(e) =>
                      updateRow(r._id, { adminNotes: e.target.value })
                    }
                    className="border rounded px-2 py-1 w-56 h-16"
                  />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={8}>
                  No inquiries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
