// import React, { useState, useEffect } from 'react'
// import { assets } from '../assets/assets'
// import axios from "axios"
// import { backendUrl } from '../App'
// import { toast } from 'react-toastify'
// import { useSearchParams } from 'react-router-dom'

// const Edit = ({token}) => {
//     const [searchParams] = useSearchParams()
//     const productId = searchParams.get('id')
    
//     const[image1, setImage1] = useState(false)
//     const[image2, setImage2] = useState(false)
//     const[image3, setImage3] = useState(false)
//     const[image4, setImage4] = useState(false)

//     const [name,setName] = useState("");
//     const[description,setDescription]= useState("");
//     const[price,setPrice]= useState("");
//     const[discountPrice,setDiscountPrice]= useState("");
//     const[category,setCategory] = useState("rings");
//     const[bestseller,setBestseller] = useState(false);
//     const [loading, setLoading] = useState(false);

//     // Fetch product data when component mounts
//     useEffect(() => {
//         if (productId) {
//             fetchProductData();
//         }
//     }, [productId]);

//     const fetchProductData = async () => {
//         try {
//             const response = await axios.post(backendUrl + '/api/product/single', {productId});
//             if (response.data.success) {
//                 const product = response.data.product;
//                 setName(product.name);
//                 setDescription(product.description);
//                 setPrice(product.price);
//                 setDiscountPrice(product.discountPrice || '');
//                 setCategory(product.category);
//                 setBestseller(product.bestseller || false);
//             } else {
//                 toast.error('Failed to fetch product data');
//             }
//         } catch (error) {
//             console.log(error);
//             toast.error('Error fetching product data');
//         }
//     };

//     const onsubmitHandler = async(e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             // Use FormData for image uploads
//             const formData = new FormData();

//             formData.append("productId", productId);
//             formData.append("name", name);
//             formData.append("description", description);
//             formData.append("price", price);
//             formData.append("discountPrice", discountPrice || 0);
//             formData.append("category", category);
//             formData.append("bestseller", bestseller);

//             // Append images if selected
//             if (image1) formData.append("image1", image1);
//             if (image2) formData.append("image2", image2);
//             if (image3) formData.append("image3", image3);
//             if (image4) formData.append("image4", image4);

//             console.log("Sending update data with images");

//             const response = await axios.post(backendUrl + "/api/product/update", formData, {
//                 headers: {
//                     token: token,
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
            
//             if (response.data.success) {
//                 toast.success(response.data.message)
//                 // Don't reset form, keep the updated values
//             }
//             else{
//                 toast.error(response.data.message)
//             }
//         } catch (error) {
//             console.log(error);
//             toast.error(error.message)
//         } finally {
//             setLoading(false);
//         }
//     }

//     if (!productId) {
//         return <div className="text-center py-8">No product selected for editing</div>;
//     }

//   return (
//     <div className='w-full'>
//         <h2 className='text-2xl font-semibold mb-6'>Edit Jewellery Product</h2>
//         <form onSubmit={onsubmitHandler} className='flex flex-col w-full items-start gap-3'>
//             <div>
//                 <p className='mb-2'>Update Product Images</p>
//                 <div className='flex gap-2'>
//                 <label htmlFor="image1">
//                         <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
//                         <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id='image1' hidden accept="image/*"/>
//                     </label>
//                     <label htmlFor="image2">
//                         <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
//                         <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id='image2' hidden accept="image/*"/>
//                     </label>
//                     <label htmlFor="image3">
//                         <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
//                         <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id='image3' hidden accept="image/*"/>
//                     </label>
//                     <label htmlFor="image4">
//                         <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
//                         <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id='image4' hidden accept="image/*"/>
//                     </label>
//                 </div>
//                 <p className='text-xs text-gray-500 mt-1'>Upload new images to replace existing ones. Leave empty to keep current images.</p>
//                 </div>
//                 <div className='w-full'>
//                     <p className='mb-2'>Product name</p>
//                     <input onChange={(e)=>setName(e.currentTarget.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required/>
//                 </div>
//                 <div className='w-full'>
//                     <p className='mb-2'>Product description</p>
//                     <textarea onChange={(e)=>setDescription(e.currentTarget.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' required/>
//                 </div>
                
//                 <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

//                 <div>
//                     <p className='mb-2'>Product category</p>
//                     <select onChange={(e) =>setCategory(e.target.value)} value={category} className='w-full px-3 py-2'>
//                         <option value="rings">Rings</option>
//                         <option value="earrings">Earrings</option>
//                         <option value="bracelet">Bracelet</option>
//                         <option value="necklace">Necklace</option>
//                         <option value="pendant-set">Pendant Set</option>
//                     </select>
//                 </div>
//                 <div>
//                     <p className='mb-2'>Product Price (₹)</p>
//                     <input onChange={(e)=>setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='25000' required />
//                 </div>
//                 <div>
//                     <p className='mb-2'>Discount Price (₹)</p>
//                     <input onChange={(e)=>setDiscountPrice(e.target.value)} value={discountPrice} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='20000' />
//                 </div>
//                 </div>

//                     <div className='flex gap-2 mt-2'> 
//                         <input onChange={()=>setBestseller(prev => !prev)} checked={bestseller} type='checkbox' id='bestseller' />
//                         <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
//                     </div>
//                     <button type='submit' disabled={loading} className='w-28 py-3 mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded'>
//                         {loading ? 'Updating...' : 'UPDATE'}
//                     </button>

//         </form>
//     </div>
//   )
// }

// export default Edit








import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

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
// ColorUploader Component for Edit (append + delete current)
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
  currentImages = [],
  onRemoveExisting,              // NEW
}) => {
  const isDefaultDisabled = files.length === 0 && currentImages.length === 0;

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
          onChange={(e) => onSkuChange(e.target.value)}
          placeholder={`e.g., ${label === "Gold" ? "SKU-GLD-123" : label === "Rose Gold" ? "SKU-RGD-456" : "SKU-WGD-789"}`}
          className="mt-1 w-full rounded-xl border px-3 py-2 focus:ring-4 focus:ring-pink-200 focus:border-[#4f1c51]"
        />
      </div>

      {/* GALLERY: Current + New together */}
      {(currentImages.length > 0 || files.length > 0) && (
        <div className="mt-3">
          <p className="text-xs text-gray-600 mb-2">Images (current + new):</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {/* Current with delete */}
            {currentImages.map((img, i) => (
              <div key={`cur-${i}`} className="relative border rounded-xl overflow-hidden bg-white">
                <img src={img} alt="" className="w-24 h-24 object-cover" />
                <button
                  type="button"
                  onClick={() => onRemoveExisting(id, img)}
                  className="absolute top-1 right-1 bg-white/90 text-xs px-1 rounded shadow"
                  title="Remove this image"
                >
                  ✕
                </button>
                <div className="text-[10px] px-1 py-0.5 w-24 truncate bg-gray-100 text-center">Existing</div>
              </div>
            ))}

            {/* New uploads appended */}
            {files.map((f, i) => (
              <div key={`new-${i}`} className="relative border rounded-xl overflow-hidden bg-white">
                <img src={URL.createObjectURL(f)} alt="" className="w-24 h-24 object-cover" />
                <button
                  type="button"
                  onClick={() => onFileRemove(id, i)}
                  className="absolute top-1 right-1 bg-white/90 text-xs px-1 rounded shadow"
                  title="Remove this upload"
                >
                  ✕
                </button>
                <div className="text-[10px] px-1 py-0.5 w-24 truncate bg-blue-100 text-center">New</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


const Edit = ({ token }) => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');

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
  ]);  // Helper function to update diamond type
  const updateDiamondType = (index, field, value) => {
    setDiamondTypes(prev => prev.map((diamond, i) => 
      i === index ? { ...diamond, [field]: value } : diamond
    ));
  };

  // Helper function to get total diamond cost
  // NEW: color uploads + default
  const [activeColor, setActiveColor] = useState("gold");
  const [defaultColor, setDefaultColor] = useState("gold");
  const [goldFiles, setGoldFiles] = useState([]);
  const [roseFiles, setRoseFiles] = useState([]);
  const [whiteFiles, setWhiteFiles] = useState([]);

  // Current images from database
  const [currentImagesByColor, setCurrentImagesByColor] = useState({
    gold: [],
    "rose-gold": [],
    "white-gold": []
  });

  // Track removals of existing URLs (per color)
const [removedImages, setRemovedImages] = useState({
  gold: [],
  "rose-gold": [],
  "white-gold": []
});

const removeExistingImage = (color, url) => {
  setCurrentImagesByColor(prev => ({
    ...prev,
    [color]: (prev[color] || []).filter(u => u !== url)
  }));
  setRemovedImages(prev => ({
    ...prev,
    [color]: [...(prev[color] || []), url]
  }));
};


  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProduct = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/product/single`, { productId });
      if (!data.success) return toast.error('Failed to fetch product');
      
      const p = data.product;
      setName(p.name || '');
      setDescription(p.description || '');
      setDiscountPercentage(p.discountPercentage ?? '');
      setCategory(p.category || 'rings');
      setBestseller(!!p.bestseller);
      setForHim(!!p.forHim);
      setForHer(!!p.forHer);
      
      // SKUs
      if (p.skuByColor) {
        setSkuGold(p.skuByColor.gold || '');
        setSkuRose(p.skuByColor['rose-gold'] || '');
        setSkuWhite(p.skuByColor['white-gold'] || '');
      }
      
      // Admin fields
      setGstPercent(p.gstPercent ?? 3);
      setMakingChargePerGram(p.makingChargePerGram ?? '');
      
      // Default color
      setDefaultColor(p.defaultColor || 'gold');
      
      // Current images by color
      if (p.imagesByColor) {
        setCurrentImagesByColor({
          gold: p.imagesByColor.gold || [],
          "rose-gold": p.imagesByColor['rose-gold'] || [],
          "white-gold": p.imagesByColor['white-gold'] || []
        });
      }

      // specs
      const s = p.specs || {};
      setProductWeight(s.productWeight ?? '');
      setGoldWeight(s.goldWeight ?? '');
      
      // Load diamond types if available, otherwise keep default 3-row structure
      if (s.diamondTypes && Array.isArray(s.diamondTypes) && s.diamondTypes.length > 0) {
        // Ensure we always have 3 rows - pad with empty if needed
        const loadedTypes = s.diamondTypes.map(dt => ({
          carat: dt.carat || "",
          shape: dt.shape || "round",
          numberOfDiamonds: dt.numberOfDiamonds || "",
          pricePerDiamond: dt.pricePerDiamond || "",
          placement: dt.placement || "center"
        }));
        
        // Pad to 3 rows if less than 3
        while (loadedTypes.length < 3) {
          loadedTypes.push({
            carat: "",
            shape: "round",
            numberOfDiamonds: "",
            pricePerDiamond: "",
            placement: "center"
          });
        }
        
        setDiamondTypes(loadedTypes.slice(0, 3)); // Take only first 3
      }
      // For old products without diamondTypes, keep the default 3-row structure initialized above
    } catch (err) {
      console.error(err);
      toast.error('Error fetching product');
    }
  };

  const getSetters = (color) => {
    if (color === "gold") return { files: goldFiles, set: setGoldFiles };
    if (color === "rose-gold") return { files: roseFiles, set: setRoseFiles };
    return { files: whiteFiles, set: setWhiteFiles };
  };

const handleColorFiles = (color, e) => {
  const { files, set } = getSetters(color);
  const incoming = Array.from(e.target.files || []);

  const currentCount = (currentImagesByColor[color]?.length || 0) + files.length;
  const remaining = MAX_PER_COLOR - currentCount;

  if (remaining <= 0) {
    toast.error(`Max ${MAX_PER_COLOR} images for ${color}`);
    e.target.value = "";
    return;
  }

  const toAdd = incoming.slice(0, remaining);
  if (toAdd.length < incoming.length) {
    toast.warn(`Only ${remaining} more image(s) allowed for ${color}`);
  }
  set(prev => [...prev, ...toAdd]);
  e.target.value = "";
};


  const removeFile = (color, idx) => {
    const { set } = getSetters(color);
    set((prev) => prev.filter((_, i) => i !== idx));
  };

  const onsubmitHandler = async (e) => {
    e.preventDefault();
    if (!productId) return;
    
    try {
      setLoading(true);
      const fd = new FormData();

      fd.append("productId", productId);
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
      fd.append("defaultColor", defaultColor);

      // Only append images if new ones are selected
      goldFiles.forEach((f) => fd.append("goldImages", f));
      roseFiles.forEach((f) => fd.append("roseImages", f));
      whiteFiles.forEach((f) => fd.append("whiteImages", f));
      fd.append("removeImages", JSON.stringify(removedImages));
      fd.append("productWeight", productWeight || 0);
      fd.append("goldWeight", goldWeight || 0);
      
      // Add diamond types
      fd.append("diamondTypes", JSON.stringify(diamondTypes));

      const { data } = await axios.post(
        `${backendUrl}/product/update`,
        fd,
        { headers: { token, "Content-Type": "multipart/form-data" } }
      );
      
      if (data.success) {
        toast.success(data.message || "Product Updated");
        // Reset file uploads but keep form data
        setGoldFiles([]);
        setRoseFiles([]);
        setWhiteFiles([]);
        // Refresh product data
        await fetchProduct();
      } else {
        toast.error(data.message || "Failed to update product");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!productId) {
    return <div className="text-center py-8">No product selected for editing</div>;
  }

  return (
    <div className="w-full" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <div className="bg-white rounded-2xl shadow ring-1 ring-purple-100 p-5">
        <h2 className="text-2xl font-bold text-[#4f1c51] mb-1">Edit Jewellery Product</h2>
        <p className="text-sm text-gray-600 mb-5">Upload new images to replace existing ones per color, update specs, and modify details.</p>

        <form onSubmit={onsubmitHandler} className="flex flex-col gap-5">

          <section className="grid gap-3">
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
                  currentImages={currentImagesByColor[c.id] || []}
                  onRemoveExisting={removeExistingImage}
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
            <div className="grid sm:grid-cols-2 gap-4">
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
            
            {/* MULTIPLE DIAMOND TYPES SECTION */}
            <div className="mt-6">
              <label className="block text-sm text-gray-700 mb-3">Diamond & Gemstone Information</label>              
              {diamondTypes.map((diamond, index) => (
                <div key={index} className="mb-4 p-4 border rounded-xl border-gray-200 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Diamond Type {index + 1} {index === 0 && <span className="text-blue-600">(Required)</span>}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Carat (ct)</p>
                      <input
                        type="number"
                        min="0"
                        step="0.0001"
                        value={diamond.carat}
                        onChange={(e) => updateDiamondType(index, 'carat', e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-pink-200"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Shape</p>
                      <select
                        value={diamond.shape}
                        onChange={(e) => updateDiamondType(index, 'shape', e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-pink-200"
                      >
                        {SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">No. of Diamonds</p>
                      <input
                        type="number"
                        min="0"
                        value={diamond.numberOfDiamonds}
                        onChange={(e) => updateDiamondType(index, 'numberOfDiamonds', e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-pink-200"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Price/Diamond (₹)</p>
                      <input
                        type="number"
                        min="0"
                        value={diamond.pricePerDiamond}
                        onChange={(e) => updateDiamondType(index, 'pricePerDiamond', e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-pink-200"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Placement</p>
                      <select
                        value={diamond.placement}
                        onChange={(e) => updateDiamondType(index, 'placement', e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-pink-200"
                      >
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
            {loading ? "Updating…" : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
