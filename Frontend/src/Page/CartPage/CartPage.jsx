import React, { Suspense, lazy } from "react";

// Lazy load Cart component
const Cart = lazy(() => import("../../components/Cart/Cart"));

const CartPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Cart />
      </Suspense>
    </div>
  );
};

export default CartPage;
