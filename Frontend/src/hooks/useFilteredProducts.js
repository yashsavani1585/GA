import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { mapToCardProduct } from "../utils/mapToCardProduct";

export default function useFilteredProducts(category) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  const backendUrl ="https://ga-inx6.onrender.com/api";

  const fetchProducts = useCallback(async (filterParams = {}) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString 
        ? `${backendUrl}/product/category/${encodeURIComponent(category)}/filtered?${queryString}`
        : `${backendUrl}/product/category/${encodeURIComponent(category)}`;

      const { data } = await axios.get(url);
      const apiList = Array.isArray(data?.products) ? data.products : [];
      setItems(apiList.map(mapToCardProduct));
    } catch (e) {
      console.error("fetch filtered products failed:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [category, backendUrl]);

  // Initial fetch
  useEffect(() => {
    fetchProducts(filters);
  }, [fetchProducts, filters]);

  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  return { 
    items, 
    loading, 
    applyFilters,
    currentFilters: filters
  };
}