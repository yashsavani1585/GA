// import { createContext, useContext, useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { getUserIdFromToken, isAuthenticated } from "../utils/auth";

// const CartCtx = createContext();
// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
// const SNAP_KEY = "cartLocal";
// const WL_KEY = "wlLocal";
// const makeKey = (id, color) => `${id}:${color || "-"}`;

// const loadWLSnap = () => {
//   try { return JSON.parse(localStorage.getItem(WL_KEY) || "[]"); }
//   catch { return []; }
// };
// const saveWLSnap = (arr) => {
//   try { localStorage.setItem(WL_KEY, JSON.stringify(arr)); } catch {}
// };

// const loadSnap = () => {
//   try { return JSON.parse(localStorage.getItem(SNAP_KEY) || "[]"); }
//   catch { return []; }
// };
// const saveSnap = (list) => {
//   try { localStorage.setItem(SNAP_KEY, JSON.stringify(list)); }
//   catch {}
// };

// export const CartProvider = ({ children }) => {
//   // items shape: [{ key, product, qty, color }]
//   const [items, setItems] = useState([]);
//   const [count, setCount] = useState(0);

//   // wishlist as array of keys `${id}:${color}`
//   const [wishlist, setWishlist] = useState(() => loadWLSnap());
//   const [wishCount, setWishCount] = useState(0);

//   const [hydrated, setHydrated] = useState(false); // prevents first-render wipe

//   const recalc = useCallback((list) => {
//     setCount(list.reduce((a, it) => a + Number(it.qty || 0), 0));
//   }, []);

//   const recalcWish = useCallback((list) => {
//     setWishCount(Array.isArray(list) ? list.length : 0);
//   }, []);

//   const clear = useCallback(() => {
//     setItems([]);
//     setCount(0);
//     localStorage.removeItem(SNAP_KEY);
//   }, []);

//   const clearWishlist = useCallback(() => {
//     setWishlist([]);
//     setWishCount(0);
//     localStorage.removeItem(WL_KEY);
//   }, []);

//   // ---- load/merge cart ----
//   const refresh = useCallback(async () => {
//     const snap = loadSnap();

//     // Guest: use snapshot
//     if (!isAuthenticated()) {
//       setItems(snap);
//       recalc(snap);
//       return;
//     }

//     // Authed: get server cart
//     try {
//       const userId = getUserIdFromToken();
//       const { data } = await axios.post(`${API}/cart/get`, { userId });
//       const map = data?.cartData || {};
//       const ids = Object.keys(map);

//       // If server empty but guest snapshot exists -> merge once
//       if (ids.length === 0 && snap.length > 0) {
//         await Promise.all(
//           snap.map((row) =>
//             axios.post(`${API}/cart/add`, {
//               userId,
//               itemId: row.product?._id || row.key.split(":")[0],
//               quantity: row.qty || 1,
//             })
//           )
//         );
//         setItems(snap);
//         recalc(snap);
//         saveSnap(snap);
//         return;
//       }

//       // Server has items -> show server; mirror into snapshot
//       const details = await Promise.all(
//         ids.map(async (id) => {
//           try {
//             const r = await axios.post(`${API}/product/single`, { productId: id });
//             return { key: id, product: r?.data?.product || { _id: id }, qty: map[id], color: null };
//           } catch {
//             return { key: id, product: { _id: id }, qty: map[id], color: null };
//           }
//         })
//       );

//       setItems(details);
//       recalc(details);
//       saveSnap(details);
//     } catch {
//       // Server failed -> fall back to snapshot
//       setItems(snap);
//       recalc(snap);
//     }
//   }, [recalc]);

//   // Hydrate quickly from snapshots, then load authoritative cart
//   useEffect(() => {
//     const snap = loadSnap();
//     if (snap.length) { setItems(snap); recalc(snap); }

//     const wsnap = loadWLSnap();
//     if (wsnap.length) { setWishlist(wsnap); setWishCount(wsnap.length); }

//     setHydrated(true);
//     refresh();
//   }, [refresh, recalc]);

//   // Keep wishCount + persistence in sync with wishlist
//   useEffect(() => {
//     if (!hydrated) return;
//     recalcWish(wishlist);
//     saveWLSnap(wishlist);
//   }, [wishlist, hydrated, recalcWish]);

//   // react to auth changes / other tabs
//   useEffect(() => {
//     const onAuth = () => refresh();
//     window.addEventListener("auth-change", onAuth);
//     window.addEventListener("storage", onAuth);
//     return () => {
//       window.removeEventListener("auth-change", onAuth);
//       window.removeEventListener("storage", onAuth);
//     };
//   }, [refresh]);

//   // ---- wishlist helpers ----
//   const wishHas = useCallback((productId, color = null) => {
//     return wishlist.includes(makeKey(productId, color));
//   }, [wishlist]);

//   const wishAdd = useCallback((productId, color = null) => {
//     if (!isAuthenticated()) return false;
//     const k = makeKey(productId, color);
//     setWishlist(prev => (prev.includes(k) ? prev : [...prev, k]));
//     return true;
//   }, []);

//   const wishRemove = useCallback((productId, color = null) => {
//     if (!isAuthenticated()) return false;
//     const k = makeKey(productId, color);
//     setWishlist(prev => prev.filter(x => x !== k));
//     return true;
//   }, []);

//   const wishToggle = useCallback((productId, color = null) => {
//     if (!isAuthenticated()) return false;
//     const k = makeKey(productId, color);
//     setWishlist(prev => (prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]));
//     return true;
//   }, []);

//   // ---- cart mutations ----
//   const mergeOne = (pid, qty, color, productObj) => {
//     setItems((prev) => {
//       const k = `${pid}:${color || "-"}`;
//       const i = prev.findIndex((x) => x.key === k);
//       let next;
//       if (i > -1) {
//         next = [...prev];
//         next[i] = { ...next[i], qty: Number(next[i].qty || 0) + Number(qty || 1) };
//       } else {
//         const row = { key: k, product: productObj || { _id: pid }, qty: qty || 1, color: color || null };
//         next = [...prev, row];
//       }
//       recalc(next);
//       if (hydrated) saveSnap(next);
//       return next;
//     });
//   };

//   const add = async (productId, qty = 1, color = null) => {
//     if (!isAuthenticated()) return false;
//     await axios.post(`${API}/cart/add`, {
//       userId: getUserIdFromToken(),
//       itemId: productId,
//       quantity: qty,
//     });
//     try {
//       const { data } = await axios.post(`${API}/product/single`, { productId });
//       mergeOne(productId, qty, color, data?.product);
//     } catch {
//       mergeOne(productId, qty, color, { _id: productId });
//     }
//     return true;
//   };

//   const update = async (key, qty) => {
//     if (!isAuthenticated()) return false;
//     const productId = key.split(":")[0];
//     await axios.post(`${API}/cart/update`, {
//       userId: getUserIdFromToken(),
//       itemId: productId,
//       quantity: qty,
//     });
//     setItems((prev) => {
//       const next = prev.map((x) => (x.key === key ? { ...x, qty } : x));
//       recalc(next);
//       if (hydrated) saveSnap(next);
//       return next;
//     });
//     return true;
//   };

//   const remove = async (key) => {
//     if (!isAuthenticated()) return false;
//     const productId = key.split(":")[0];
//     await axios.post(`${API}/cart/update`, {
//       userId: getUserIdFromToken(),
//       itemId: productId,
//       quantity: 0,
//     });
//     setItems((prev) => {
//       const next = prev.filter((x) => x.key !== key);
//       recalc(next);
//       if (hydrated) saveSnap(next);
//       return next;
//     });
//     return true;
//   };

//   const moveToWishlist = async (key) => {
//     if (!isAuthenticated()) return false;
//     const [productId, colorPart] = key.split(":");
//     const color = colorPart && colorPart !== "-" ? colorPart : null;
//     wishAdd(productId, color);   // add to wishlist
//     await remove(key);           // then remove from cart
//     return true;
//   };

//   return (
//     <CartCtx.Provider
//       value={{
//         // cart
//         items, count, add, update, remove, moveToWishlist, refresh, clear,
//         // wishlist
//         wishlist, wishCount, wishHas, wishAdd, wishRemove, wishToggle, clearWishlist,
//       }}
//     >
//       {children}
//     </CartCtx.Provider>
//   );
// };

// export const useCart = () => useContext(CartCtx);




// context/cartContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { isAuthenticated, getUserIdFromToken } from "../utils/auth";

const CartCtx = createContext();
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
const makeKey = (id, color) => `${id}:${color ?? "-"}`;

// Normalize FE <-> BE color key
const normColorKey = (c) => {
  const k = String(c || "").trim().toLowerCase();
  if (!k || k === "-" || k === "null" || k === "undefined") return "-";
  if (k === "rosegold" || k === "rose-gold" || k === "rose") return "rose-gold";
  if (k === "whitegold" || k === "white-gold" || k === "white") return "white-gold";
  if (k === "yellow" || k === "gold") return "gold";
  return k;
};

// token header helper (adjust if you store token elsewhere)
// Returns Axios config with Authorization header if token exists
 const authHeader = () => {
  const token = localStorage.getItem("token"); // get token from localStorage
  if (!token) return {}; // no token, return empty config
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // optional, but recommended
    },
  };
};

export const CartProvider = ({ children }) => {
  // items: [{ key, product, qty, color }]
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);

  // wishlist: array of 'productId:colorKey'
  const [wishlist, setWishlist] = useState([]);
  const [wishCount, setWishCount] = useState(0);

  const recalc = useCallback((list) => {
    setCount(list.reduce((a, it) => a + Number(it.qty || 0), 0));
  }, []);
  const recalcWish = useCallback((arr) => setWishCount(Array.isArray(arr) ? arr.length : 0), []);

  const clear = useCallback(() => {
    setItems([]);
    setCount(0);
  }, []);
  const clearWishlist = useCallback(() => {
    setWishlist([]);
    setWishCount(0);
  }, []);

  // Fetch a product document for a given productId
  const fetchProductDoc = useCallback(async (productId) => {
    try {
      const r = await axios.post(`${API}/product/single`, { productId });
      return r?.data?.product || { _id: productId };
    } catch {
      return { _id: productId };
    }
  }, []);

  // Convert server cartData (nested map) to UI list
  const flattenServerCart = useCallback(async (cartData) => {
    const entries = [];
    const ids = Object.keys(cartData || {});
    // prefetch all product docs in parallel
    const productDocs = await Promise.all(ids.map((id) => fetchProductDoc(id)));
    const docMap = {};
    ids.forEach((id, idx) => (docMap[id] = productDocs[idx]));

    ids.forEach((pid) => {
      const byColor = cartData[pid] || {};
      Object.keys(byColor).forEach((ckey) => {
        const cartItem = byColor[ckey];
        
        // Handle both old format (number) and new format (object)
        let qty, ringSize, goldCarat, sku, pricing;
        
        if (typeof cartItem === 'number') {
          // Old format - just quantity
          qty = Number(cartItem || 0);
          ringSize = null;
          goldCarat = null;
          sku = null;
          pricing = null;
        } else if (cartItem && typeof cartItem === 'object') {
          // New format - object with additional fields
          qty = Number(cartItem.quantity || 0);
          ringSize = cartItem.ringSize || null;
          goldCarat = cartItem.goldCarat || null;
          sku = cartItem.sku || null;
          // Handle pricing - it's already an object, no need to parse
          pricing = cartItem.pricing || null;
        } else {
          qty = 0;
        }
        
        if (qty <= 0) return;
        const color = ckey === "-" ? null : ckey;
        entries.push({
          key: makeKey(pid, color),
          product: docMap[pid] || { _id: pid },
          qty,
          color,
          ringSize,
          goldCarat,
          sku,
          pricing
        });
      });
    });
    return entries;
  }, [fetchProductDoc]);

  // Load cart + wishlist from server
  const refresh = useCallback(async () => {
    if (!isAuthenticated()) {
      clear();
      clearWishlist();
      return;
    }
    try {
      const [{ data: cartRes }, { data: wlRes }] = await Promise.all([
        axios.post(`${API}/cart/get`, { userId: getUserIdFromToken() }, authHeader()),
        axios.post(`${API}/wishlist/get`, { userId: getUserIdFromToken() }, authHeader()),
      ]);
      const list = await flattenServerCart(cartRes?.cartData || {});
      setItems(list);
      recalc(list);

      const wl = wlRes?.wishlist || [];
      setWishlist(wl);
      recalcWish(wl);
    } catch (err) {
      console.error(err);
      // On failure, keep whatever is in memory (no local snapshot fallback)
    }
  }, [API, clear, clearWishlist, flattenServerCart, recalc, recalcWish]);

  // hydrate on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  // react to auth changes across app
  useEffect(() => {
    const onAuth = () => refresh();
    window.addEventListener("auth-change", onAuth);
    return () => window.removeEventListener("auth-change", onAuth);
  }, [refresh]);

  // ---- wishlist helpers (server-first) ----
  const wishHas = useCallback(
    (productId, color = null) => wishlist.includes(makeKey(productId, normColorKey(color))),
    [wishlist]
  );

  const wishAdd = useCallback(async (productId, color = null) => {
    if (!isAuthenticated()) return false;
    const c = normColorKey(color);
    try {
      await axios.post(`${API}/wishlist/add`, { userId: getUserIdFromToken(), itemId: productId, color: c }, authHeader());
      const key = makeKey(productId, c);
      setWishlist((prev) => (prev.includes(key) ? prev : [...prev, key]));
      setWishCount((n) => n + (wishlist.includes(key) ? 0 : 1));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [API, wishlist]);

  const wishRemove = useCallback(async (productId, color = null) => {
    if (!isAuthenticated()) return false;
    const c = normColorKey(color);
    try {
      await axios.post(`${API}/wishlist/remove`, { userId: getUserIdFromToken(), itemId: productId, color: c }, authHeader());
      const key = makeKey(productId, c);
      setWishlist((prev) => prev.filter((x) => x !== key));
      setWishCount((n) => Math.max(0, n - 1));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [API]);

  const wishToggle = useCallback(async (productId, color = null) => {
    if (wishHas(productId, color)) {
      return wishRemove(productId, color);
    }
    return wishAdd(productId, color);
  }, [wishHas, wishRemove, wishAdd]);

  // ---- cart mutations (server-first) ----
  const mergeOneLocal = useCallback((pid, qty, color, productObj) => {
    const key = makeKey(pid, normColorKey(color) === "-" ? null : normColorKey(color));
    setItems((prev) => {
      const i = prev.findIndex((x) => x.key === key);
      let next;
      if (i > -1) {
        next = [...prev];
        const existingItem = next[i];
        next[i] = { 
          ...existingItem, 
          qty: Number(existingItem.qty || 0) + Number(qty || 1)
        };
      } else {
        next = [...prev, { 
          key, 
          product: productObj || { _id: pid }, 
          qty: qty || 1, 
          color: color || null
        }];
      }
      recalc(next);
      return next;
    });
  }, [recalc]);

  const add = useCallback(async (productId, qty = 1, color = null, extraData = {}) => {
    if (!isAuthenticated()) return false;
    const c = normColorKey(color);
    
    // Extract additional fields for database storage
    const { ringSize, goldCarat, sku, pricing } = extraData;
    
    try {
      await axios.post(`${API}/cart/add`, {
        userId: getUserIdFromToken(),
        itemId: productId,
        color: c,
        quantity: qty,
        // Store additional fields in database
        ringSize: ringSize || null,
        goldCarat: goldCarat || null,
        sku: sku || null,
        // Store pricing information from MoreInfo2
        pricing: pricing ? JSON.stringify(pricing) : null
      }, authHeader());

      // fetch product doc once for UI merge
      const doc = await fetchProductDoc(productId);
      mergeOneLocal(productId, qty, color, doc);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [fetchProductDoc, mergeOneLocal]);

  const update = useCallback(async (key, qty, extraData = {}) => {
    if (!isAuthenticated()) return false;
    const [productId, colorPart] = String(key).split(":");
    const color = colorPart && colorPart !== "-" ? colorPart : null;
    const c = normColorKey(color);

    // Extract additional fields for database storage
    const { ringSize, goldCarat, sku, pricing } = extraData;

    try {
      await axios.post(`${API}/cart/update`, {
        userId: getUserIdFromToken(),
        itemId: productId,
        color: c,
        quantity: Number(qty),
        // Include additional fields if provided
        ...(ringSize !== undefined && { ringSize }),
        ...(goldCarat !== undefined && { goldCarat }),
        ...(sku !== undefined && { sku }),
        ...(pricing !== undefined && { pricing: JSON.stringify(pricing) })
      }, authHeader());

      setItems((prev) => {
        const next = prev.map((x) => (x.key === key ? { 
          ...x, 
          qty: Number(qty),
          // Update additional fields if provided
          ...(ringSize !== undefined && { ringSize }),
          ...(goldCarat !== undefined && { goldCarat }),
          ...(sku !== undefined && { sku }),
          ...(pricing !== undefined && { pricing })
        } : x));
        // remove if 0
        const filtered = next.filter((x) => Number(x.qty) > 0);
        recalc(filtered);
        return filtered;
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [recalc]);

  const remove = useCallback(async (key) => {
    if (!isAuthenticated()) return false;
    const [productId, colorPart] = String(key).split(":");
    const color = colorPart && colorPart !== "-" ? colorPart : null;
    const c = normColorKey(color);

    try {
      await axios.post(`${API}/cart/update`, {
        userId: getUserIdFromToken(),
        itemId: productId,
        color: c,
        quantity: 0
      }, authHeader());

      setItems((prev) => {
        const next = prev.filter((x) => x.key !== key);
        recalc(next);
        return next;
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [API, recalc]);

  const moveToWishlist = useCallback(async (key) => {
    if (!isAuthenticated()) return false;
    const [productId, colorPart] = String(key).split(":");
    const color = colorPart && colorPart !== "-" ? colorPart : null;
    const ok = await wishAdd(productId, color);
    if (!ok) return false;
    await remove(key);
    return true;
  }, [wishAdd, remove]);

  return (
    <CartCtx.Provider
      value={{
        // cart
        items, count, add, update, remove, moveToWishlist, refresh, clear,
        // wishlist
        wishlist, wishCount, wishHas, wishAdd, wishRemove, wishToggle, clearWishlist,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
};

export const useCart = () => useContext(CartCtx);
