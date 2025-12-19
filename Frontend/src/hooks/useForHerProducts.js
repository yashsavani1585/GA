import { useEffect, useState } from "react";
import axios from "axios";
import { mapToCardProduct } from "../utils/mapToCardProduct";

export default function useForHerProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl ="https://ga-inx6.onrender.com/api";
  
  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${backendUrl}/product/for-her`);
        if (!ok) return;
        const apiList = Array.isArray(data?.products) ? data.products : [];
        setItems(apiList.map(mapToCardProduct));
      } catch (e) {
        console.error("fetch for-her products failed:", e);
        if (ok) setItems([]);
      } finally {
        ok && setLoading(false);
      }
    })();
    return () => { ok = false; };
  }, [backendUrl]);

  return { items, loading };
}