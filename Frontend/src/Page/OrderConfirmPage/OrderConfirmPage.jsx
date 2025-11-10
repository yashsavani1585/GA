import React, { Suspense, lazy } from "react";

// Lazy load component
const OrderConfirm = lazy(() =>
  import("../../components/OrderConfirm/OrderConfirm")
);

const OrderConfirmPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OrderConfirm />
      </Suspense>
    </div>
  );
};

export default OrderConfirmPage;
