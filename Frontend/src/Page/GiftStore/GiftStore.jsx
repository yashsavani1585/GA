import React, { Suspense, lazy } from "react";

// Lazy imports (split into separate chunks)
const HeroSection2 = lazy(() => import("../../components/HeroSection2/HeroSection2"));
const GiftingGuide = lazy(() => import("../../components/GiftingGuide/GiftingGuide"));
const MostGifted = lazy(() => import("../../components/MostGifted/MostGifted"));
const EverglowCollection = lazy(() => import("../../components/EverglowCollection/EverglowCollection"));

// Simple fallback (you can replace with spinner, skeletons, shimmer, etc.)
const LoadingFallback = () => (
  <div className="text-center py-8 text-gray-500">Loading...</div>
);

const GiftStore = () => {
  return (
    <div>
      <Suspense fallback={<LoadingFallback />}>
        <HeroSection2 />
      </Suspense>

      <div className="mt-12 sm:mt-20">
        <Suspense fallback={<LoadingFallback />}>
          <GiftingGuide />
        </Suspense>
      </div>


      <Suspense fallback={<LoadingFallback />}>
        <MostGifted />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <EverglowCollection />
      </Suspense>
    </div>
  );
};

export default GiftStore;
