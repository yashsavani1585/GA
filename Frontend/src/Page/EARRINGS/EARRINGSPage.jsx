import React, { Suspense, lazy } from "react";

// Lazy load components

const HeroSection6 = lazy(() =>

  import("../../components/HeroSection6/HeroSection6")
);
const EARRINGSProductionSection = lazy(() =>
  import("../../components/EARRINGSProductionSection/EARRINGSProductionSection")
);

const EARRINGSPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection6 />
        <EARRINGSProductionSection />
      </Suspense>
    </div>
  );
};

export default EARRINGSPage;
