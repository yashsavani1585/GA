import React, { Suspense, lazy } from "react";

// Lazy load component
const Wishlist = lazy(() => import("../../components/Wishlist/Wishlist"));

const WishlistPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Wishlist />
      </Suspense>
    </div>
  );
};

export default WishlistPage;
