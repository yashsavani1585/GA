import { useEffect } from "react";

export default function OAuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (error) {
      alert(decodeURIComponent(error));
      window.location.replace("/auth"); // back to login
      return;
    }

    if (token) {
      localStorage.setItem("token", token);
       window.dispatchEvent(new Event("auth:login"));
      window.location.replace("/"); // or /dashboard
    } else {
      window.location.replace("/auth");
    }
  }, []);

  return <div style={{ padding: 24 }}>Signing you in…</div>;
}