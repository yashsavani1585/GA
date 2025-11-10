
import React, { Suspense, lazy } from "react";
import DimondCategorySection from "../../components/DimondCategorySection/DimondCategorySection";
import PromiseSection from "../../components/Promise/Promise";
import CertifiedText from "../../components/CertifiedText/CertifiedText";

// 🔹 Lazy-loaded components
const HeroSection = lazy(() => import("../../components/HeroSection/HeroSection"));
const CategorySection = lazy(() => import("../../components/CategorySection/CategorySection"));
const GiftingGuide = lazy(() => import("../../components/GiftingGuide/GiftingGuide"));
const NewInStore = lazy(() => import("../../components/NewInStore/NewInStore"));
const LatestOffers = lazy(() => import("../../components/LatestOffers/LatestOffers"));
const TestimonialSection = lazy(() => import("../../components/Testimonials/Testimonials"));
const EverglowPromise = lazy(() => import("../../components/EverglowPromise/EverglowPromise"));
const CollectionSection = lazy(() => import("../../components/CollectionSection/CollectionSection"));
const Newsletter = lazy(() => import("../../components/NewsletterSection/NewsletterSection"));

// 🔹 Fallback Loader
const Loader = () => (
  <div className="w-full text-center py-10 text-gray-500">Loading...</div>
);

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden"> {/* Prevent horizontal scroll */}
      <Suspense fallback={<Loader />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<Loader />}>
        <CategorySection />
      </Suspense>

      <Suspense fallback={<Loader />}>
        <DimondCategorySection />
      </Suspense>

      <Suspense fallback={<Loader />}>
        <GiftingGuide />
      </Suspense>

      <Suspense fallback={<Loader />}>
        <NewInStore />
      </Suspense>

      <Suspense fallback={<Loader />}>
        <PromiseSection />
      </Suspense>

            <Suspense fallback={<Loader />}>
        <CertifiedText />
      </Suspense>

      <div className="mt-5">
      <Suspense fallback={<Loader />}>
        <LatestOffers />
      </Suspense>
      </div>

      <Suspense fallback={<Loader />}>
        <TestimonialSection />
      </Suspense>

      <div className="mb-10">
        <Suspense fallback={<Loader />}>
          <EverglowPromise />
        </Suspense>
      </div>





      <div className="hidden md:block">
        <Suspense fallback={<Loader />}>
          <CollectionSection />
        </Suspense>
      </div>


      <Suspense fallback={<Loader />}>
        <Newsletter />
      </Suspense>
    </div>
  );
};

export default Home;
