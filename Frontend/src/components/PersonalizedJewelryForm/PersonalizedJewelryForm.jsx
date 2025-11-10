import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import divider from "../../assets/Formdesignadd.png";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const typeOptions = [
  { value: "rings", label: "Ring" },
  { value: "necklace", label: "Necklace" },
  { value: "bracelet", label: "Bracelet" },
  { value: "earrings", label: "Earrings" },
  { value: "pendantset", label: "Pendantset" },
];

const metalOptions = [
  {
    label: "Silver",
    options: [
      { value: "silver-925", label: "Silver 925" },
      { value: "silver-yellow-gold-plated", label: "Silver Yellow Gold Plated" },
      { value: "silver-rose-gold-plated", label: "Silver Rose Gold Plated" },
    ],
  },
  {
    label: "Gold - Yellow",
    options: [
      { value: "gold-yellow-18kt", label: "Gold Yellow 18kt" },
      { value: "gold-yellow-14kt", label: "Gold Yellow 14kt" },
      { value: "gold-yellow-10kt", label: "Gold Yellow 10kt" },
      { value: "gold-yellow-9kt", label: "Gold Yellow 9kt" },
    ],
  },
  {
    label: "Gold - Rose",
    options: [
      { value: "gold-rose-18kt", label: "Gold Rose 18kt" },
      { value: "gold-rose-14kt", label: "Gold Rose 14kt" },
      { value: "gold-rose-10kt", label: "Gold Rose 10kt" },
      { value: "gold-rose-9kt", label: "Gold Rose 9kt" },
    ],
  },
  {
    label: "Gold - White",
    options: [
      { value: "gold-white-18kt", label: "Gold White 18kt" },
      { value: "gold-white-14kt", label: "Gold White 14kt" },
      { value: "gold-white-10kt", label: "Gold White 10kt" },
      { value: "gold-white-9kt", label: "Gold White 9kt" },
    ],
  },
  {
    label: "Platinum",
    options: [{ value: "platinum", label: "Platinum" }],
  },
];

const PersonalizedJewelryForm = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedMetal, setSelectedMetal] = useState(null);
    const [file, setFile] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [loading, setLoading] = useState(false);
    const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedType || !selectedMetal) return alert("Please select Type and Metal.");
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("phone", form.phone);
    fd.append("email", form.email);
    fd.append("notes", form.notes);
    fd.append("type", selectedType.value);
    fd.append("metal", selectedMetal.value);
    if (file) fd.append("file", file);

        try {
      setLoading(true);
      await axios.post(`${API}/forms/personalized`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Thanks! Your request has been submitted.");
      setForm({ name: "", phone: "", email: "", notes: "" });
      setSelectedType(null); setSelectedMetal(null); setFile(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Submit failed");
    } finally { setLoading(false); }
  };


  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Divider Image */}
      <div className="flex items-center justify-center mb-8">
        <img src={divider} alt="divider" className="h-8 w-90" />
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Name*"
            required
            className="w-full border rounded-md px-4 py-3 focus:ring-2 focus:ring-yellow-900 outline-none placeholder-gray-500"
          />
          <input
            type="tel"
            name="phone" 
            value={form.phone} 
            onChange={onChange}
            placeholder="Mobile Number*"
            required
            className="w-full border rounded-md px-4 py-3 focus:ring-2 focus:ring-yellow-900 outline-none placeholder-gray-500"
          />
        </div>

        {/* Row 2 */}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="Email Address*"
          required
          className="w-full border rounded-md px-4 py-3 focus:ring-2 focus:ring-yellow-900 outline-none placeholder-gray-500"
        />

        {/* Row 3 - Type */}
        <Select
          options={typeOptions}
          placeholder="Choose Type"
          value={selectedType}
          onChange={setSelectedType}
          menuPlacement="bottom"   // 👈 hamesha niche open hoga
          menuPosition="fixed"     // 👈 scroll hone par bhi niche hi rahega
          className="w-full"
        />

        {/* Row 4 - Metal Type */}
        <Select
          options={metalOptions}
          placeholder="Select Metal Type"
          value={selectedMetal}
          onChange={setSelectedMetal}
          menuPlacement="bottom"
          menuPosition="fixed"
          className="w-full"
        />

        {/* File Upload */}
        <div>
          <label
            htmlFor="fileUpload"
            className="block w-full border rounded-md px-4 py-3 text-gray-500 cursor-pointer hover:bg-purple-50"
          >
            <input
              id="fileUpload"
              type="file"
              accept=".pdf, .jpg, .png, .jpeg, .doc, .docx"
              className="hidden"
              onChange={(e)=>setFile(e.target.files?.[0] || null)}
            />
            <span className="text-gray-500 font-medium">{file ? file.name : "Choose File"}</span>
          </label>
          <p className="text-gray-500 text-sm mt-2">
            Allowed types: pdf, jpg, png, jpeg, doc, docx.
          </p>
        </div>

        {/* Textarea */}
        <textarea
        name="notes"
        value={form.notes} 
        onChange={onChange}
          rows="4"
          placeholder="Please describe your idea for this Custom Project..."
          className="w-full border rounded-md px-4 py-3 focus:ring-2 focus:ring-yellow-900 outline-none placeholder-gray-500"
        ></textarea>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#CEBB98] text-white px-6 py-3 rounded-md shadow hover:bg-black transition w-full md:w-auto"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default PersonalizedJewelryForm;
