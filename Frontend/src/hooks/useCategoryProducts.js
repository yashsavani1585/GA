import { useEffect, useState } from "react";
import axios from "axios";
import { mapToCardProduct } from "../utils/mapToCardProduct";

export default function useCategoryProducts(category) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_API_BASE_URL|| "https://ga-inx6.onrender.com/api";
  
  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${backendUrl}/product/category/${encodeURIComponent(category)}`
        );
        if (!ok) return;
        const apiList = Array.isArray(data?.products) ? data.products : [];
        setItems(apiList.map(mapToCardProduct));
      } catch (e) {
        console.error("fetch category failed:", e);
        if (ok) setItems([]);
      } finally {
        ok && setLoading(false);
      }
    })();
    return () => { ok = false; };
  }, [category, backendUrl]);

  return { items, loading };
}
