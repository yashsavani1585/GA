import React, { Suspense, lazy } from "react";

// Lazy load components
const HeroSection4 = lazy(() =>
  import("../../components/HeroSection4/HeroSection4")
);
const PersonalizedJewelryForm = lazy(() =>
  import("../../components/PersonalizedJewelryForm/PersonalizedJewelryForm")
);
const PersonalizedImage = lazy(() =>
  import("../../components/PersonalizedImage/PersonalizedImage")
);

const PersonalizedJewelry = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection4 />
        <PersonalizedJewelryForm />
        <PersonalizedImage />
      </Suspense>
    </div>
  );
};

export default PersonalizedJewelry;
