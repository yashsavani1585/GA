// export const getToken = () => localStorage.getItem("token") || null;

// export const parseJwt = (t) => {
//   try {
//     const base64 = t.split(".")[1];
//     return JSON.parse(atob(base64.replace(/-/g, "+").replace(/_/g, "/")));
//   } catch { return null; }
// };

// export const getUserIdFromToken = () => {
//   const t = getToken();
//   if (!t) return localStorage.getItem("userId") || null;
//   const p = parseJwt(t);
//   return p?.userId || p?.id || p?._id || localStorage.getItem("userId") || null;
// };

// export const isAuthenticated = () => !!getToken();

// /** clear only auth info; don't wipe guest cart */
// export const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("user");     
//      localStorage.removeItem("cartLocal");     // if you stored profile
//     localStorage.removeItem("wlLocal");  // if you stored wishlist
//     // let other parts of the app know auth changed (same tab + other tabs)
//     window.dispatchEvent(new Event("auth-change"));
// };

// utils/auth.js

/** ─────────────────────────────
 * TOKEN MANAGEMENT
 *──────────────────────────────*/
// src/utils/auth.js

/** ─────────────────────────────
 * TOKEN MANAGEMENT
 *──────────────────────────────*/
export const getToken = () => localStorage.getItem("token") || null;

export const setToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  }
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

/** ─────────────────────────────
 * JWT PARSING
 *──────────────────────────────*/
export const parseJwt = (token) => {
  try {
    if (!token) return null;
    const base64 = token.split(".")[1];
    const decoded = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (err) {
    console.error("❌ Error decoding JWT:", err);
    return null;
  }
};

/** ─────────────────────────────
 * USER INFO
 *──────────────────────────────*/
export const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return localStorage.getItem("userId") || null;

  const payload = parseJwt(token);
  return (
    payload?.userId ||
    payload?.id ||
    payload?._id ||
    localStorage.getItem("userId") ||
    null
  );
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  return parseJwt(token);
};

/** ─────────────────────────────
 * AUTH STATUS
 *──────────────────────────────*/
export const isAuthenticated = () => !!getToken();

/** ─────────────────────────────
 * LOGOUT
 *──────────────────────────────*/
export const logout = () => {
  // ✅ Clear only auth related info
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("user");
  localStorage.removeItem("cartLocal"); // optional
  localStorage.removeItem("wlLocal");   // optional

  // Notify app + other tabs about logout
  window.dispatchEvent(new Event("auth-change"));
};