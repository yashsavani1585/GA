import axios from 'axios'
import React, { useEffect, useState, useMemo } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

// ---- shared 60s cache for 14k rate ----
const RATE_TTL_MS = 60_000;
let rateCache = { ts: 0, rate: null, promise: null };

function fetch14kRate() {
  const now = Date.now();
  if (rateCache.rate && now - rateCache.ts < RATE_TTL_MS) {
    return Promise.resolve(rateCache.rate);
  }
  if (rateCache.promise) return rateCache.promise;

  rateCache.promise = axios
    .get(`${backendUrl}/pricing/gold-rate`, { params: { carat: 14 } })
    .then(({ data }) => {
      const r = data?.success ? Number(data.ratePerGram) : null;
      rateCache.rate = r;
      rateCache.ts = Date.now();
      return r ?? 0;
    })
    .catch(() => 0)
    .finally(() => {
      rateCache.promise = null;
    });

  return rateCache.promise;
}

// Price calculation component for each product
const ProductPrice = ({ product, live14k, currency }) => {
const calculatedPrice = useMemo(() => {
  if (!product || !live14k) return null;

  const goldWeight = Number(product?.specs?.goldWeight || 0);
  if (!goldWeight) return null;

  const gstPercent = Number(product?.gstPercent ?? 3);
  const makingPerGram = Number(product?.makingChargePerGram || 0);
  const discountPct = Number(product?.discountPercentage || product?.discount || 0);

  // diamonds: new structure only
  const diamondTypes = Array.isArray(product?.specs?.diamondTypes)
    ? product.specs.diamondTypes
    : [];
  const diamondCost = diamondTypes.reduce((sum, d) => {
    const n = Number(d?.numberOfDiamonds) || 0;
    const pr = Number(d?.pricePerDiamond) || 0;
    return sum + n * pr;
  }, 0);

  const metalCost = live14k * goldWeight;
  const makingCost = makingPerGram * goldWeight;

  const base = makingCost + diamondCost;

  // discount BEFORE GST
  const dp = Math.max(0, Math.min(100, discountPct));
  const discountAmount = Math.round(base * (dp / 100));
  const discounted = base - discountAmount;

  // GST on (metal + making + diamonds)
  const gst = Math.round((metalCost + makingCost + diamondCost) * (gstPercent / 100));
  const final = metalCost + discounted + gst;

  const gstOnBase = Math.round((metalCost + makingCost + diamondCost) * (gstPercent / 100));
  const oldTotal = metalCost + base + gstOnBase;

  return {
    finalTotal: Math.round(final),
    totalBeforeDiscount: Math.round(oldTotal),
  };
}, [live14k, product]);


  if (!calculatedPrice) {
    return <p className="text-sm text-gray-500">No price calc</p>;
  }

  return (
    <>
      <p className="font-semibold text-green-600">{currency}{calculatedPrice.finalTotal.toLocaleString('en-IN')}</p>
      {calculatedPrice.totalBeforeDiscount > calculatedPrice.finalTotal && (
        <p className="text-xs line-through text-gray-500">{currency}{calculatedPrice.totalBeforeDiscount.toLocaleString('en-IN')}</p>
      )}
    </>
  );
};

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [live14k, setLive14k] = useState(null)
  const navigate = useNavigate()

  // Fetch live gold rate
  useEffect(() => {
    let mounted = true;
    fetch14kRate().then((r) => mounted && setLive14k(r || null));
    return () => {
      mounted = false;
    };
  }, []);

  const fetchList = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data } = await axios.get(`${backendUrl}/product/list?admin=true`)
      if (data.success) {
        setList(data.products || [])
      } else {
        setError(data.message || 'Failed to load products')
        toast.error(data.message || 'Failed to load products')
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || err.message || 'Failed to load products')
      toast.error(err.response?.data?.message || err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

const removeProduct = async (id) => {
  try {
    const { data } = await axios.post(
      `${backendUrl}/product/remove`, // only one slash
      { id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      toast.success(data.message || "Deleted");
      // Refresh the list after deletion
      fetchList();
    } else {
      toast.error(data.message || "Delete failed");
    }
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || err.message);
  }
};


// const removeProduct = async (id, token, fetchList, backendUrl) => {
//   try {
//     if (!id) return toast.error("Product ID missing");

//     const { data } = await axios.post(
//       `${backendUrl}/product/remove`,
//       { id },
//       {
//         headers: token
//           ? { Authorization: `Bearer ${token}` }
//           : {}, // token optional
//       }
//     );

//     if (data.success) {
//       toast.success(data.message || "Product deleted successfully");
//       if (typeof fetchList === "function") fetchList(); // refresh list
//     } else {
//       toast.error(data.message || "Delete failed");
//     }
//   } catch (err) {
//     console.error("removeProduct error:", err);
//     toast.error(err.response?.data?.message || err.message || "Something went wrong");
//   }
// };

  const editProduct = (id) => navigate(`/edit?id=${id}`)

  useEffect(() => { 
    fetchList() 
  }, [])

  return (
    <div
      className="w-full"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      <div className="bg-white rounded-2xl shadow ring-1 ring-purple-100 p-5">
        <h2 className="text-2xl font-bold text-[#4f1c51] mb-1">All Jewellery Products</h2>
        <p className="text-sm text-gray-600 mb-4">Manage inventory, pricing, and visibility.</p>

        <div className="hidden md:grid grid-cols-[1.2fr_2fr_1fr_1fr_1fr_1fr] gap-2 items-center px-3 py-2 bg-purple-50/50 rounded-xl text-[#4f1c51] text-sm font-semibold">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Calculated Price</span>
          <span>Discount %</span>
          <span>Actions</span>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CEBB98]"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center text-red-600 p-4">
              {error}
            </div>
          )}

          {/* Products List */}
          {!loading && !error && list.map((item, idx) => (
            <div key={idx}
              className="grid grid-cols-[1fr_2fr] md:grid-cols-[1.2fr_2fr_1fr_1fr_1fr_1fr] gap-2 items-center px-3 py-2 border rounded-xl bg-white hover:shadow-sm transition">
              <img className="w-14 h-14 object-cover rounded-lg border" src={item.image?.[0]} alt="" />
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                <p className="text-xs text-gray-500 truncate">{item.description}</p>
              </div>
              <p className="capitalize text-gray-700">{item.category}</p>
              <div>
                <ProductPrice product={item} live14k={live14k} currency={currency} />
              </div>
              <div>
                {item.discountPercentage > 0 ? (
                  <p className="text-green-700 font-medium">{item.discountPercentage}%</p>
                ) : (
                  <p className="text-gray-400">-</p>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => editProduct(item._id)}
                  className="px-3 py-1.5 rounded-lg bg-[#CEBB98] text-white text-xs shadow hover:shadow-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeProduct(item._id)}
                  className="px-3 py-1.5 rounded-lg bg-pink-600 text-white text-xs shadow hover:shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          
          {/* Empty State */}
          {!loading && !error && list.length === 0 && (
            <div className="text-sm text-gray-500 p-6 text-center">No products found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default List
