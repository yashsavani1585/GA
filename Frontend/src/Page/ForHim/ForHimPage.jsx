import React, { Suspense, lazy } from "react";

// Lazy load components
const HeroSection3 = lazy(() =>
  import("../../components/HeroSection3/HeroSection3")
);
const ForHimProductSection = lazy(() =>
  import("../../components/ForHimProductSection/ForHimProductSection")
);

const ForHimPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection3 />
        <ForHimProductSection />
      </Suspense>
    </div>
  );
};

export default ForHimPage;