import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PricingProvider } from "./context/pricingContext";

import TopBar from "./components/TopBar/TopBar";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/header";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";

// Pages
import Home from "./Page/Home/Home";
import YourProfile from "./components/YourProfile/YourProfile";
import MyOrder from "./components/MyOrder/MyOrder";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import Contact from "./components/Contact/Contact";
import TermsAndConditions from "./components/TermsAndConditions/TermsAndConditions";
import GiftStore from "./Page/GiftStore/GiftStore";
import PersonalizedJewelry from "./Page/PersonalizedJewelry/PersonalizedJewelry";
import LatestCollection from "./Page/LatestCollection/LatestCollection";
import AuthPage from "./Page/AuthPage/AuthPage";
import MoreInform from "./Page/MoreInform/MoreInform";
import RingPage from "./Page/Ring/RingPage";
import CartPage from "./Page/CartPage/CartPage";
import OrderConfirmPage from "./Page/OrderConfirmPage/OrderConfirmPage";
import EARRINGSPage from "./Page/EARRINGS/EARRINGSPage";
import BRACELETPage from "./Page/BRACELET/BRACELETPage";
import NECKLACEPage from "./Page/NECKLACE/NECKLACEPage";
import Pendantset from "./Page/Pendantset/Pendantset";
import WishlistPage from "./Page/WishlistPage/WishlistPage";
import MoreInfo2 from "./components/MoreInfo2/MoreInfo2";
import OAuthCallback from "./Page/OAuthCallback";
import ForHimPage from "./Page/ForHim/ForHimPage";
import ForHerPage from "./Page/ForHer/ForHerPage";
import ShippingPolicy from "./components/ShippingPolicy/ShippingPolicy";
import InquiryFormPage from "./Page/InquiryFormPage/InquiryFormPage";
import ExchangeBuyBackPolicy from "./components/ExchangeBuyBackPolicy/ExchangeBuyBackPolicy";
import RingGuide from "./components/RingGuide/RingGuide";
import AutionPage from "./Page/AutionPage/AutionPage";
import AuctionItem from "./components/AuctionItem/AuctionItem";
import Blog from "./components/Blog/Blog";
import AboutUs from "./components/AboutUs/AboutUs";
import AboutLabDiamonds from "./components/AboutLabDiamonds/AboutLabDiamonds";
import FAQs from "./components/FAQs/FAQs";
import Checkout from "./Page/Checkout";
import PaymentSuccess from "./Page/PaymentSuccess";
import MockPayment from "./Page/MockPayment";
import CertificateCard from "./Page/CertificateCard";

const App = () => {

  const phoneNumber = "919909288061"; // Use full number with country code if needed (e.g., 917265077755 for India)
  const defaultText = encodeURIComponent("Hello! I want to know more about your products.");

  const handleWhatsAppClick = () => {
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${defaultText}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };


  return (
    <PricingProvider>
      <Router>
        <ScrollToTop />
        <div className="relative min-h-screen flex flex-col">
          {/* Common Components */}
          <TopBar />
          <Header />
          <Toaster position="top-center" reverseOrder={false} />

          {/* Page Routes */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<YourProfile />} />
              <Route path="/MyOrder" element={<MyOrder />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/giftstore" element={<GiftStore />} />
              <Route path="/personalized" element={<PersonalizedJewelry />} />
              <Route path="/collections" element={<LatestCollection />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/moreInform" element={<MoreInform />} />
              <Route path="/rings" element={<RingPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orderConfirmation" element={<OrderConfirmPage />} />
              <Route path="/earrings" element={<EARRINGSPage />} />
              <Route path="/bracelet" element={<BRACELETPage />} />
              <Route path="/necklace" element={<NECKLACEPage />} />
              <Route path="/pendantset" element={<Pendantset />} />
              <Route path="/Wishlist" element={<WishlistPage />} />
              <Route path="/moreinfo2" element={<MoreInfo2 />} />
              <Route path="/inquiry" element={<InquiryFormPage />} />
              <Route path="/oauth/callback" element={<OAuthCallback />} />
              <Route path="/for-him" element={<ForHimPage />} />
              <Route path="/for-her" element={<ForHerPage />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route
                path="/exchange-policy"
                element={<ExchangeBuyBackPolicy />}
              />
              <Route path="/Ring-Guide" element={<RingGuide />} />
              <Route path="/auction" element={<AutionPage />} />
              <Route path="/auction/:id" element={<AuctionItem />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/lab-diamonds" element={<AboutLabDiamonds />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/checkout" element={<Checkout/>} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/mock-payment" element={<MockPayment/>} />
              <Route path="/certificate" element={<CertificateCard />} />


            </Routes>
          </main>

          <Footer />

          {/* ✅ Floating WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            aria-label="Chat on WhatsApp"
            className="
              fixed
              bottom-6 md:bottom-8
              right-5 md:right-6
              flex items-center justify-center
              w-10 h-10 md:w-14 md:h-14
              rounded-full
              bg-green-500 text-white
              shadow-xl
              hover:bg-green-600
              active:scale-95
              transition-transform duration-200
              focus:outline-none focus:ring-2 focus:ring-green-400
              z-50
            "
          >
            <FaWhatsapp className="w-4 h-4 md:w-7 md:h-7" />
          </button>
        </div>
      </Router>
    </PricingProvider>
  );
};

export default App;
