// backend/config/metalsClient.js
// import axios from "axios";

// const metalsAxios = axios.create({
//   baseURL: process.env.METALS_API_URL, // e.g. https://gold.g.apised.com/v1/latest
//   timeout: 8000,
// });

// metalsAxios.interceptors.request.use((config) => {
//   config.headers["x-api-key"] = process.env.METALS_API_KEY;
//   return config;
// });

// export default metalsAxios;

// config/metalsClient.js
// import axios from "axios";

// const metalsAxios = axios.create({
//   baseURL: process.env.METALS_API_URL, // e.g. https://gold.g.apised.com/v1/latest
//   headers: {
//     "x-access-token": process.env.METALS_API_KEY, // ✅ Required by API
//     "Content-Type": "application/json",
//   },
//   timeout: 10000, // 10s timeout
// });

// export default metalsAxios;

import axios from "axios";

if (!process.env.METALS_API_URL || !process.env.METALS_API_KEY) {
  throw new Error("❌ METALS_API_URL or METALS_API_KEY missing in .env");
}

const metalsAxios = axios.create({
  baseURL: process.env.METALS_API_URL,
  timeout: 8000,
});

// Automatically attach x-api-key
metalsAxios.interceptors.request.use((config) => {
  config.headers["x-api-key"] = process.env.METALS_API_KEY;
  config.headers["Accept"] = "application/json";
  return config;
});

export default metalsAxios;
