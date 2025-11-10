import { useEffect, useState } from "react";
import axios from "axios";
import { mapToCardProduct } from "../utils/mapToCardProduct";

export default function useForHimProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
  
  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${backendUrl}/product/for-him`);
        if (!ok) return;
        const apiList = Array.isArray(data?.products) ? data.products : [];
        setItems(apiList.map(mapToCardProduct));
      } catch (e) {
        console.error("fetch for-him products failed:", e);
        if (ok) setItems([]);
      } finally {
        ok && setLoading(false);
      }
    })();
    return () => { ok = false; };
  }, [backendUrl]);

  return { items, loading };
}