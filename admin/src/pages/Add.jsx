


import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const MAX_PER_COLOR = 10;

const COLOR_KEYS = [
  { id: "gold", label: "Gold", dot: "#d4af37" },
  { id: "rose-gold", label: "Rose Gold", dot: "#e6b2a6" },
  { id: "white-gold", label: "White Gold", dot: "#d9d9d9" },
];

const SHAPES = [
  "round", "princess", "oval", "emerald", "pear", "marquise",
  "heart", "baguette", "cushion", "radiant", "asscher", "other"
];

// ===================================================================
// 1. DEFINED THE ColorUploader COMPONENT OUTSIDE OF THE Add COMPONENT
// ===================================================================
const ColorUploader = ({
  id,
  label,
  dot,
  files,
  skuValue,
  activeColor,
  defaultColor,
  onActiveChange,
  onDefaultChange,
  onFilesChange,
  onFileRemove,
  onSkuChange,
}) => {
  const isDefaultDisabled = files.length === 0;

  return (
    <div className="rounded-2xl border border-purple-200 p-3 bg-purple-50/40">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="activeUpload"
            checked={activeColor === id}
            onChange={() => onActiveChange(id)}
          />
          <span className="flex items-center gap-2 font-medium">
            <span className="inline-block w-3.5 h-3.5 rounded-full" style={{ background: dot }} />
            {label}
          </span>
        </label>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <input
              type="radio"
              name="defaultColor"
              checked={defaultColor === id}
              onChange={() => onDefaultChange(id)}
              disabled={isDefaultDisabled}
            />
            Default
          </label>

          <label className={`inline-flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-sm shadow cursor-pointer ring-1 ring-purple-100 ${activeColor !== id ? "opacity-50 cursor-not-allowed" : ""}`}>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={activeColor !== id}
              onChange={(e) => onFilesChange(id, e)}
            />
            <span className="text-[#4f1c51]">Choose Files</span>
          </label>
        </div>
      </div>

      <div className="mt-2">
        <label className="text-xs text-gray-600">SKU ({label})</label>
        <input
          type="text"
          value={skuValue}
          onChange={(e) => onSkuChange(e.target.value)} // Use the passed-in handler
          placeholder={`e.g., ${label === "Gold" ? "SKU-GLD-123" : label === "Rose Gold" ? "SKU-RGD-456" : "SKU-WGD-789"}`}
          className="mt-1 w-full rounded-xl border px-3 py-2 focus:ring-4 focus:ring-pink-200 focus:border-[#4f1c51]"
        />
      </div>

      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {files.map((f, i) => (
            <div key={i} className="relative border rounded-xl overflow-hidden bg-white">
              <img src={URL.createObjectURL(f)} alt="" className="w-24 h-24 object-cover" />
              <button
                type="button"
                onClick={() => onFileRemove(id, i)}
                className="absolute top-1 right-1 bg-white/90 text-xs px-1 rounded shadow"
              >
                ✕
              </button>
              <div className="text-[10px] px-1 py-0.5 w-24 truncate">{f.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const Add = ({ token }) => {
  // BASIC FIELDS
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [category, setCategory] = useState("rings");
  const [bestseller, setBestseller] = useState(false);
  const [forHim, setForHim] = useState(false);
  const [forHer, setForHer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skuGold, setSkuGold] = useState("");
  const [skuRose, setSkuRose] = useState("");
  const [skuWhite, setSkuWhite] = useState("");
  const [gstPercent, setGstPercent] = useState(3);
  const [makingChargePerGram, setMakingChargePerGram] = useState("");

  // SPECS
  const [productWeight, setProductWeight] = useState("");
  const [goldWeight, setGoldWeight] = useState("");
  
  // MULTIPLE DIAMOND TYPES (3 rows - first required, others optional)
  const [diamondTypes, setDiamondTypes] = useState([
    {
      carat: "",
      shape: "round",
      numberOfDiamonds: "",
      pricePerDiamond: "",
      placement: "center"
    },
    {
      carat: "",
      shape: "round", 
      numberOfDiamonds: "",
      pricePerDiamond: "",
      placement: "center"
    },
    {
      carat: "",
      shape: "round",
      numberOfDiamonds: "",
      pricePerDiamond: "",
      placement: "center"
    }
  ]);

  // Helper function to update diamond type
  const updateDiamondType = (index, field, value) => {
    setDiamondTypes(prev => prev.map((diamond, i) => 
      i === index ? { ...diamond, [field]: value } : diamond
    ));
  };

  // NEW: color uploads + carat + default
  const [activeColor, setActiveColor] = useState("gold");
  const [defaultColor, setDefaultColor] = useState("gold");
  const [goldFiles, setGoldFiles] = useState([]);
  const [roseFiles, setRoseFiles] = useState([]);
  const [whiteFiles, setWhiteFiles] = useState([]);

  const getSetters = (color) => {
    if (color === "gold") return { files: goldFiles, set: setGoldFiles };
    if (color === "rose-gold") return { files: roseFiles, set: setRoseFiles };
    return { files: whiteFiles, set: setWhiteFiles };
  };

  const handleColorFiles = (color, e) => {
    const { files, set } = getSetters(color);
    const incoming = Array.from(e.target.files || []);
    const remaining = MAX_PER_COLOR - files.length;
    if (remaining <= 0) {
      toast.error(`Max ${MAX_PER_COLOR} images for ${color}`);
      e.target.value = "";
      return;
    }
    const toAdd = incoming.slice(0, remaining);
    if (toAdd.length < incoming.length) {
      toast.warn(`Only ${remaining} more image(s) allowed for ${color}`);
    }
    set((prev) => [...prev, ...toAdd]);
    e.target.value = "";
  };

  const removeFile = (color, idx) => {
    const { set } = getSetters(color);
    set((prev) => prev.filter((_, i) => i !== idx));
  };

  const onsubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const totalCount = goldFiles.length + roseFiles.length + whiteFiles.length;
      if (totalCount === 0) {
        toast.error("Upload at least one image (Gold / Rose Gold / White Gold)");
        return;
      }

      const firstNonEmpty =
        (goldFiles.length ? "gold" :
          (roseFiles.length ? "rose-gold" :
            (whiteFiles.length ? "white-gold" : null)));

      const realDefault =
        (defaultColor === "gold" && goldFiles.length) ||
          (defaultColor === "rose-gold" && roseFiles.length) ||
          (defaultColor === "white-gold" && whiteFiles.length)
          ? defaultColor
          : firstNonEmpty || "gold";

      setLoading(true);
      const fd = new FormData();

      fd.append("name", name);
      fd.append("description", description);
      fd.append("discountPercentage", discountPercentage || 0);
      fd.append("category", category);
      fd.append("bestseller", String(bestseller));
      fd.append("forHim", String(forHim));
      fd.append("forHer", String(forHer));
      fd.append("skuGold", skuGold);
      fd.append("skuRose", skuRose);
      fd.append("skuWhite", skuWhite);
      fd.append("gstPercent", gstPercent || 0);
      fd.append("makingChargePerGram", makingChargePerGram || 0);
      fd.append("defaultColor", realDefault);

      goldFiles.forEach((f) => fd.append("goldImages", f));
      roseFiles.forEach((f) => fd.append("roseImages", f));
      whiteFiles.forEach((f) => fd.append("whiteImages", f));

      fd.append("productWeight", productWeight || 0);
      fd.append("goldWeight", goldWeight || 0);
      
      // Add diamond types data
      fd.append("diamondTypes", JSON.stringify(diamondTypes));

      const { data } = await axios.post(
        `${backendUrl}/product/add`,
        fd,
        { headers: { token, "Content-Type": "multipart/form-data" } }
      );
      

      if (data.success) {
        toast.success(data.message || "Product Added");
        setName(""); setDescription(""); setDiscountPercentage("");
        setCategory("rings"); setBestseller(false); setForHim(false); setForHer(false);
        setGoldFiles([]); setRoseFiles([]); setWhiteFiles([]);
        setActiveColor("gold"); setDefaultColor("gold");
        setProductWeight(""); setGoldWeight(""); 
        // Reset diamond types to initial state
        setDiamondTypes([
          { carat: "", shape: "round", numberOfDiamonds: "", pricePerDiamond: "", placement: "center" },
          { carat: "", shape: "round", numberOfDiamonds: "", pricePerDiamond: "", placement: "center" },
          { carat: "", shape: "round", numberOfDiamonds: "", pricePerDiamond: "", placement: "center" }
        ]);
      } else {
        toast.error(data.message || "Failed to add product");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <div className="bg-white rounded-2xl shadow ring-1 ring-purple-100 p-5">
        <h2 className="text-2xl font-bold text-[#4f1c51] mb-1">Add Jewellery Product</h2>
        <p className="text-sm text-gray-600 mb-5">Upload images per color, pick carats, and set a default.</p>

        <form onSubmit={onsubmitHandler} className="flex flex-col gap-5">

          <section className="grid gap-3">
            {/* =================================================================== */}
            {/* 2. PASSING ALL REQUIRED DATA AND FUNCTIONS AS PROPS */}
            {/* =================================================================== */}
            {COLOR_KEYS.map((c) => {
              const { files } = getSetters(c.id);
              const skuValue = c.id === 'gold' ? skuGold : c.id === 'rose-gold' ? skuRose : skuWhite;
              const onSkuChange = (value) => {
                if (c.id === 'gold') setSkuGold(value);
                else if (c.id === 'rose-gold') setSkuRose(value);
                else setSkuWhite(value);
              };

              return (
                <ColorUploader
                  key={c.id}
                  id={c.id}
                  label={c.label}
                  dot={c.dot}
                  files={files}
                  skuValue={skuValue}
                  activeColor={activeColor}
                  defaultColor={defaultColor}
                  onActiveChange={setActiveColor}
                  onDefaultChange={setDefaultColor}
                  onFilesChange={handleColorFiles}
                  onFileRemove={removeFile}
                  onSkuChange={onSkuChange}
                />
              );
            })}
          </section>

          {/* === BASICS === */}
          <section className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Product name</label>
              <input className="w-full rounded-xl border px-3 py-2.5 focus:ring-4 focus:ring-pink-200 focus:border-[#4f1c51]"
                value={name} onChange={e => setName(e.target.value)} placeholder="Diamond Band Ring" required />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Category</label>
              <select className="w-full rounded-xl border px-3 py-2.5 focus:ring-4 focus:ring-pink-200 focus:border-[#4f1c51]"
                value={category} onChange={e => setCategory(e.target.value)}>
                <option value="rings">Rings</option>
                <option value="earrings">Earrings</option>
                <option value="bracelet">Bracelet</option>
                <option value="necklace">Necklace</option>
                <option value="pendant-set">Pendant Set</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Discount Percentage (%)</label>
              <input type="number" min="0" max="100" className="w-full rounded-xl border px-3 py-2.5 focus:ring-4 focus:ring-pink-200 focus:border-[#4f1c51]"
                value={discountPercentage} onChange={e => setDiscountPercentage(e.target.value)} placeholder="10" />
            </div>
          </section>

          {/* DESCRIPTION */}
          <section>
            <label className="block text-sm text-gray-700 mb-1.5">Product description</label>
            <textarea rows={4} className="w-full rounded-xl border px-3 py-2.5 focus:ring-4 focus:ring-pink-200 focus:border-[#4f1c51]"
              value={description} onChange={e => setDescription(e.target.value)} placeholder="Enhance your elegance…" required />
          </section>

          {/* SPECS */}
          <section>
            <label className="block text-sm text-gray-700 mb-2">Product specs</label>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Product weight (g)</p>
                <input type="number" min="0" step="0.0001" value={productWeight} onChange={e => setProductWeight(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2.5 focus:ring-4 focus:ring-pink-200 focus:border-[#4f1c51]" />
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Gold weight (g)</p>
                <input type="number" min="0" step="0.0001" value={goldWeight} onChange={e => setGoldWeight(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2.5 focus:ring-4 focus:ring-pink-200 focus:border-[#4f1c51]" />
              </div>
            </div>
          </section>

          {/* DIAMOND TYPES (Multiple Rows) */}
          <section>
            <label className="block text-sm text-gray-700 mb-2">Diamond & Gemstone Information</label>
            <div className="space-y-4">
              {diamondTypes.map((diamond, index) => (
                <div key={index} className="rounded-lg border p-4 border-gray-200 bg-gray-50">
                  <h4 className="text-sm font-medium mb-3">
                    Diamond Type {index + 1}
                  </h4>
                  <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Carat (ct)</p>
                      <input 
                        type="number" 
                        min="0" 
                        step="0.0001" 
                        value={diamond.carat} 
                        onChange={e => updateDiamondType(index, 'carat', e.target.value)}
                        className="w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-pink-200 focus:border-[#4f1c51]" 
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Shape</p>
                      <select 
                        value={diamond.shape} 
                        onChange={e => updateDiamondType(index, 'shape', e.target.value)}
                        className="w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-pink-200 focus:border-[#4f1c51]">
                        {SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">No. of Diamonds</p>
                      <input 
                        type="number" 
                        min="0" 
                        value={diamond.numberOfDiamonds} 
                        onChange={e => updateDiamondType(index, 'numberOfDiamonds', e.target.value)}
                        className="w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-pink-200 focus:border-[#4f1c51]" 
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Price per Diamond (₹)</p>
                      <input 
                        type="number" 
                        min="0" 
                        value={diamond.pricePerDiamond} 
                        onChange={e => updateDiamondType(index, 'pricePerDiamond', e.target.value)}
                        className="w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-pink-200 focus:border-[#4f1c51]" 
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Placement</p>
                      <select 
                        value={diamond.placement} 
                        onChange={e => updateDiamondType(index, 'placement', e.target.value)}
                        className="w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-pink-200 focus:border-[#4f1c51]">
                        <option value="center">Center</option>
                        <option value="accent">Accent</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* === PRICING CONTROLS (Admin) === */}
          <section className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">GST (%)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={gstPercent}
                onChange={(e) => setGstPercent(e.target.value)}
                className="w-full rounded-xl border px-3 py-2.5 focus:ring-4 focus:ring-pink-200 focus:border-[#4f1c51]"
                placeholder="3"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-700 mb-1.5">Making Charge per gram (₹/g)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={makingChargePerGram}
                onChange={(e) => setMakingChargePerGram(e.target.value)}
                className="w-full rounded-xl border px-3 py-2.5 focus:ring-4 focus:ring-pink-200 focus:border-[#4f1c51]"
                placeholder="e.g., 700"
              />
              <p className="text-xs text-gray-500 mt-1">
                Used with Net Gold Weight (specs.goldWeight) to compute making charges.
              </p>
            </div>
          </section>


          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={bestseller} onChange={() => setBestseller(p => !p)} />
            <span className="text-gray-700">Add to bestseller</span>
          </label>

          {/* Gender Selection */}
          <section>
            <label className="block text-sm text-gray-700 mb-2">Gifting Categories</label>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  checked={forHim} 
                  onChange={() => setForHim(p => !p)} 
                />
                <span className="text-gray-700">For Him</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  checked={forHer} 
                  onChange={() => setForHer(p => !p)} 
                />
                <span className="text-gray-700">For Her</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select appropriate gifting categories for this product
            </p>
          </section>

          <button type="submit" disabled={loading}
            className="self-start rounded-xl bg-[#CEBB98] text-black px-6 py-2.5 shadow hover:shadow-md disabled:opacity-60">
            {loading ? "Adding…" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;





