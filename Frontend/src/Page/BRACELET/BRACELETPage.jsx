import React, { Suspense, lazy } from "react";

// Lazy load components

const HeroSection9 = lazy(() =>

  import("../../components/HeroSection9/HeroSection9")
);
const BRACELETProductionSection = lazy(() =>
  import("../../components/BRACELETProductionSection/BRACELETProductionSection")
);

const BRACELETPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection9 />
        <BRACELETProductionSection />
      </Suspense>
    </div>
  );
};

export default BRACELETPage;
