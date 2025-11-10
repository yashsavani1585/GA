import React, { Suspense, lazy } from "react";

// Lazy load components
const HeroSection5 = lazy(() =>
  import("../../components/HeroSection5/HeroSection5")
);
const JewelryShowcase = lazy(() =>
  import("../../components/JewelryShowcase/JewelryShowcase")
);

const LatestCollection = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection5 />
        <JewelryShowcase />
      </Suspense>
    </div>
  );
};

export default LatestCollection;
