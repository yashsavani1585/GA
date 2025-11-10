import React, { Suspense, lazy } from "react";

// Lazy load the component
const MoreInformProductPage = lazy(() =>
  import("../../components/MoreInformProductPage/MoreInformProductPage")
);

const MoreInform = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <MoreInformProductPage />
      </Suspense>
    </div>
  );
};

export default MoreInform;
