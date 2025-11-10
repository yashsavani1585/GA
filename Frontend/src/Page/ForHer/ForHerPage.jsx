import React, { Suspense, lazy } from "react";

// Lazy load components
const HeroSection3 = lazy(() =>
  import("../../components/HeroSection3/HeroSection3")
);
const ForHerProductSection = lazy(() =>
  import("../../components/ForHerProductSection/ForHerProductSection")
);

const ForHerPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection3 />
        <ForHerProductSection />
      </Suspense>
    </div>
  );
};

export default ForHerPage;