import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';
import {
  Search,
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  ChevronDown,
  User,
  Heart,
  Crown,
  Menu,
  X,
  FileText,
} from 'lucide-react';

interface NavbarProps {
  onOpenFavorites: () => void;
  onOpenRequestsHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenFavorites, onOpenRequestsHistory }) => {
  const {
    categories,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    currentUser,
    setIsAdminModalOpen,
    setIsVipModalOpen,
    setIsAuthModalOpen,
    requests,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleCategorySelect = (cat: ProductCategory) => {
    setActiveCategory(cat);
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false);

    // Scroll to catalog section if not already in view
    const catalogElement = document.getElementById('product-catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pendingRequestsCount = requests.filter((r) => r.status === 'New').length;

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80">
      {/* Top Notification Announcement Bar */}
      <div
        id="navbar-announcement"
        className="bg-zinc-900 border-b border-zinc-800 px-4 py-1.5 text-center text-xs font-medium text-zinc-300 flex items-center justify-center gap-2"
      >
        <Flame className="w-3.5 h-3.5 text-red-500" />
        <span className="text-white font-semibold">#1 Wholesale Supplier in America</span>
        <span className="hidden sm:inline text-zinc-600">|</span>
        <span className="hidden sm:inline text-zinc-300">Free US Standard Delivery on All Orders</span>
        <span className="hidden md:inline text-zinc-600">|</span>
        <span className="hidden md:inline text-zinc-400">Guaranteed discreet delivery with live tracking</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory('All');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group cursor-pointer"
              id="brand-logo"
            >
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white text-sm">
                RS
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-white flex items-center">
                  Reseller<span className="text-red-500 font-extrabold ml-1">Supply</span>
                </span>
                <span className="text-[10px] text-zinc-500 -mt-1 font-medium">
                  Direct Wholesale & Bulk
                </span>
              </div>
            </a>

            {/* Desktop Category Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <div className="relative">
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  id="categories-dropdown-btn"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isCategoryDropdownOpen
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Categories</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {isCategoryDropdownOpen && (
                  <div
                    id="categories-dropdown-menu"
                    className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl p-2 z-50"
                    onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                  >
                    <div className="px-3 py-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                      Product Categories
                    </div>
                    <div className="py-1 max-h-80 overflow-y-auto">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => handleCategorySelect(cat)}
                          className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                            activeCategory === cat
                              ? 'bg-red-500/10 text-red-400 font-semibold'
                              : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                          }`}
                        >
                          <span>{cat}</span>
                          {cat === 'Top Sellers' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                              Top 5
                            </span>
                          )}
                          {cat === 'Daily Deals' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-semibold">
                              Deals
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick links */}
              {['Top Sellers', 'Electronics', 'Audio', 'Designer Bags', 'Watches', 'Daily Deals'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat as ProductCategory)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? 'text-red-400 bg-red-500/10 border border-red-500/20 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {cat}
                </button>
              ))}

              <a
                href="#faq-section"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                FAQ
              </a>
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Toggle */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 w-48 sm:w-64">
                  <Search className="w-4 h-4 text-zinc-400 shrink-0 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Rolex, LV, AirPods..."
                    className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-zinc-400 hover:text-white text-xs ml-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  id="search-toggle-btn"
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
                  aria-label="Search catalog"
                  title="Search catalog"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Favorites / Saved */}
            <button
              onClick={onOpenFavorites}
              id="wishlist-btn"
              className="relative p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
              aria-label="View Favorites"
              title="Saved Favorites"
            >
              <Heart className="w-4 h-4" />
              {currentUser.favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                  {currentUser.favorites.length}
                </span>
              )}
            </button>

            {/* Inquiries / Request History */}
            <button
              onClick={onOpenRequestsHistory}
              id="inquiries-history-btn"
              className="relative p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
              aria-label="Inquiry History"
              title="My Inquiries"
            >
              <FileText className="w-4 h-4" />
              {requests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-zinc-700 text-[10px] font-bold text-zinc-200 rounded-full flex items-center justify-center">
                  {requests.length}
                </span>
              )}
            </button>

            {/* User Account / Sign In */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              id="user-auth-btn"
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
              title="Customer Account"
            >
              <User className="w-4 h-4 text-red-500" />
              <span className="hidden md:inline">
                {currentUser.isLoggedIn ? currentUser.name.split(' ')[0] || 'Account' : 'Sign In'}
              </span>
            </button>

            {/* Admin Dashboard Launcher */}
            <button
              onClick={() => setIsAdminModalOpen(true)}
              id="admin-dashboard-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Open Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden sm:inline">Admin</span>
              {pendingRequestsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-drawer-menu"
          className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-4 pt-3 pb-6 space-y-4"
        >
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-2">
            Categories & Wholesale Hub
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20 font-semibold'
                    : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-900 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsVipModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crown className="w-4 h-4" />
              <span>VIP Wholesale Club Benefits</span>
            </button>

            <a
              href="#faq-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-lg bg-zinc-900 text-zinc-300 text-xs font-medium text-center block"
            >
              FAQ & Product Guidelines
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

