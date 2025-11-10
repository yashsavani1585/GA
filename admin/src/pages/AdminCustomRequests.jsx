import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

const statusOpts = [
  { v: "new", t: "New" },
  { v: "in_progress", t: "In Progress" },
  { v: "quoted", t: "Quoted" },
  { v: "closed", t: "Closed" },
];

export default function AdminCustomRequests() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("all");
  const token = localStorage.getItem("token");

  const authHeaders = token
    ? { Authorization: `Bearer ${token}` }
    : { token }; // fallback if you still store it this way

  const fetchData = async () => {
    const qs = filter === "all" ? "" : `?status=${filter}`;
    const { data } = await axios.get(`${API}/forms/admin/personalized${qs}`, {
      headers: authHeaders,
    });
    if (data.success) setRows(data.data);
  };

  useEffect(() => { fetchData(); }, [filter]);

  const updateRow = async (id, payload) => {
    await axios.patch(`${API}/forms/admin/personalized/${id}`, payload, {
      headers: authHeaders,
    });
    fetchData();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Custom Requests</h2>

      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm">Status:</label>
        <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="border rounded px-2 py-1">
          <option value="all">All</option>
          {statusOpts.map(o => <option key={o.v} value={o.v}>{o.t}</option>)}
        </select>
      </div>

      <div className="overflow-auto border rounded">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Metal</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Notes</th>
              <th className="p-3 text-left">File</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Admin Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r._id} className="border-t">
                <td className="p-3">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="p-3">{r.name}</td>
                <td className="p-3 capitalize">{r.type}</td>
                <td className="p-3">{r.metal}</td>
                <td className="p-3">
                  <div>{r.email}</div>
                  <div className="text-gray-500">{r.phone}</div>
                </td>
                <td className="p-3 max-w-[240px] truncate" title={r.notes}>{r.notes}</td>
                <td className="p-3">
                  {r.fileUrl ? <a className="text-indigo-600 underline" href={r.fileUrl} target="_blank" rel="noreferrer">view</a> : "-"}
                </td>
                <td className="p-3">
                  <select
                    value={r.status}
                    onChange={(e)=>updateRow(r._id, { status: e.target.value })}
                    className="border rounded px-2 py-1"
                  >
                    {statusOpts.map(o => <option key={o.v} value={o.v}>{o.t}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  <textarea
                    defaultValue={r.adminNotes || ""}
                    onBlur={(e)=>updateRow(r._id, { adminNotes: e.target.value })}
                    className="border rounded px-2 py-1 w-56 h-16"
                  />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td className="p-6 text-center text-gray-500" colSpan={9}>No requests yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
