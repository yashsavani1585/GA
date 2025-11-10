import React, { Suspense, lazy } from "react";

// Lazy load components



const HeroSection8 = lazy(() =>

  import("../../components/HeroSection8/HeroSection8")
);
const NECKLACEProductionSection = lazy(() =>
  import("../../components/NECKLACEProductionSection/NECKLACEProductionSection")
);

const NECKLACEPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection8 />
        <NECKLACEProductionSection />
      </Suspense>
    </div>
  );
};

export default NECKLACEPage;
