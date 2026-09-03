import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { ToastContainer } from './components/ToastContainer';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { Top5Hero } from './components/Top5Hero';
import { ShopByCategorySection } from './components/ShopByCategorySection';
import { DailyDealSection } from './components/DailyDealSection';
import { WeeklyDealsSection } from './components/WeeklyDealsSection';
import { PopularAndNewSection } from './components/PopularAndNewSection';
import { LimitedBulkDealsSection } from './components/LimitedBulkDealsSection';
import { ProductCatalog } from './components/ProductCatalog';
import { CustomerFeedbackSection } from './components/CustomerFeedbackSection';
import { ShippingAndSocialSection } from './components/ShippingAndSocialSection';
import { RecentlyViewedSection } from './components/RecentlyViewedSection';
import { MediaShowcaseSection } from './components/MediaShowcaseSection';
import { VoucherPromotionSection } from './components/VoucherPromotionSection';
import { FAQSection } from './components/FAQSection';
import { NewsletterVipSection } from './components/NewsletterVipSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductRequestModal } from './components/ProductRequestModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { AdminDashboard } from './components/AdminDashboard';
import { DeveloperDashboard } from './components/DeveloperDashboard';

const MainLayout: React.FC = () => {
  const {
    isVipModalOpen,
    setIsVipModalOpen,
    isAdminModalOpen,
    setIsAdminModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
  } = useStore();

  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [accountDefaultTab, setAccountDefaultTab] = useState<'account' | 'requests' | 'vip'>('account');

  const handleOpenFavorites = () => {
    setIsFavoritesOpen(true);
  };

  const handleOpenRequestsHistory = () => {
    setAccountDefaultTab('requests');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-red-600 selection:text-white flex flex-col">
      {/* Real-time Toast Notifications */}
      <ToastContainer />

      {/* Primary Sticky Navbar */}
      <Navbar
        onOpenFavorites={handleOpenFavorites}
        onOpenRequestsHistory={handleOpenRequestsHistory}
      />

      {/* Main Homepage Sections */}
      <main className="flex-1 space-y-4">
        {/* Section 1: Premium Hero Section */}
        <HeroSection />

        {/* Section 2: Top 5 Best Sellers */}
        <Top5Hero />

        {/* Section 3: Shop by Category */}
        <ShopByCategorySection />

        {/* Section 4: Today's Daily Deals (5% Best Seller / 10% Other Items with Real-Time Countdown) */}
        <DailyDealSection />

        {/* Section 4.5: Weekly Deals (Packs - Coming Soon) */}
        <WeeklyDealsSection />

        {/* Section 5: Popular and Newly Added Products */}
        <PopularAndNewSection />

        {/* Section 6: Wholesale & Bulk Pricing Allocations */}
        <LimitedBulkDealsSection />

        {/* Section 7: Full Searchable & Filterable Catalog */}
        <ProductCatalog />

        {/* Section 8: Customer Feedback & Product Suggestion Hub */}
        <CustomerFeedbackSection />

        {/* Section 9: Shipping Options & Social Media Channels */}
        <ShippingAndSocialSection />

        {/* Section 10: Recently Viewed Products */}
        <RecentlyViewedSection />

        {/* Section 11: 360° Master Inspection Lab Showcase */}
        <MediaShowcaseSection />

        {/* Section 12: Daily Vouchers & Promo Codes */}
        <VoucherPromotionSection />

        {/* Section 13: FAQ Section */}
        <FAQSection />

        {/* Section 14: Newsletter Signup */}
        <NewsletterVipSection />
      </main>

      {/* Dark Luxury Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <ProductDetailModal />
      <ProductRequestModal />
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />
      <CustomerAccountModal
        isOpen={isAuthModalOpen || isVipModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setIsVipModalOpen(false);
        }}
        defaultTab={isVipModalOpen ? 'vip' : accountDefaultTab}
      />
      <AdminDashboard
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const isDeveloperRoute =
    currentPath === '/developer' ||
    currentPath.startsWith('/developer/') ||
    (typeof window !== 'undefined' && (window.location.hash === '#/developer' || window.location.hash.includes('developer')));

  return (
    <StoreProvider>
      {isDeveloperRoute ? (
        <div className="min-h-screen bg-black text-neutral-200">
          <ToastContainer />
          <DeveloperDashboard />
        </div>
      ) : (
        <MainLayout />
      )}
    </StoreProvider>
  );
}

export default App;
