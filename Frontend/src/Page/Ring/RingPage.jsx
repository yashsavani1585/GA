import React, { Suspense, lazy } from "react";

// Lazy load components
const HeroSection3 = lazy(() =>
  import("../../components/HeroSection3/HeroSection3")
);
const RingProductSection = lazy(() =>
  import("../../components/RingProductSection/RingProductSection")
);

const RingPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection3 />
        <RingProductSection />
      </Suspense>
    </div>
  );
};

export default RingPage;
