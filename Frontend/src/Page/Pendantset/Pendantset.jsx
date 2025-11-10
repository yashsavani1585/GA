import React, { Suspense, lazy } from "react";

// Lazy load components



const HeroSection7 = lazy(() =>

  import("../../components/HeroSection7/HeroSection7")
);
const PendantsetProductionSection = lazy(() =>
  import("../../components/PendantsetProductionSection/PendantsetProductionSection")
);

const Pendantset = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection7 />
        <PendantsetProductionSection />
      </Suspense>
    </div>
  );
};

export default Pendantset;
