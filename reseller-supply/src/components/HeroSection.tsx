import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';
import {
  Search,
  ShieldCheck,
  Truck,
  Flame,
  ArrowRight,
  TrendingUp,
  PackageCheck,
  CheckCircle2,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { searchQuery, setSearchQuery, setActiveCategory } = useStore();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const catalogElement = document.getElementById('product-catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickCategories: { label: string; cat: ProductCategory }[] = [
    { label: 'Top 5 Best Sellers', cat: 'Top Sellers' },
    { label: 'Audio & AirPods', cat: 'Audio' },
    { label: 'Luxury Timepieces', cat: 'Watches' },
    { label: 'Designer Leather', cat: 'Designer Bags' },
    { label: 'Electronics', cat: 'Electronics' },
    { label: 'Daily Deals', cat: 'Daily Deals' },
  ];

  return (
    <section className="relative pt-6 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>#1 Trusted Wholesale Supplier in America</span>
        </div>

        {/* Hero Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
          Direct Reseller Supply.{' '}
          <span className="text-red-500 font-extrabold">Zero Middlemen.</span>
        </h1>

        {/* Subtitle / Value Proposition */}
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          High-velocity tech, audio, and luxury accessories with verified build quality,
          transparent volume price tiers, and guaranteed discreet US delivery with live tracking.
        </p>

        {/* Prominent Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-2xl mx-auto relative"
        >
          <div className="relative flex items-center rounded-xl bg-zinc-900 border border-zinc-800 focus-within:border-red-500/80 focus-within:ring-1 focus-within:ring-red-500/50 transition-all p-1.5 shadow-lg">
            <Search className="w-5 h-5 text-zinc-400 ml-3 shrink-0" />
            <input
              type="text"
              id="hero-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, or categories (e.g., AirPods Max, Submariner, LV)..."
              className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              id="hero-search-btn"
              className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Category Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="text-xs text-zinc-500 font-medium mr-1">
            Popular:
          </span>
          {quickCategories.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActiveCategory(item.cat);
                const elem = document.getElementById('product-catalog');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-medium transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 4 Core Trust Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-zinc-900">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-left">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">#1 in America</div>
              <div className="text-[11px] text-zinc-400">10,000+ happy buyers</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-left">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Free US Shipping</div>
              <div className="text-[11px] text-zinc-400">Standard 7–24 day delivery</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-left">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Verified Quality</div>
              <div className="text-[11px] text-zinc-400">Direct factory inspection</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-left">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Daily Deals</div>
              <div className="text-[11px] text-zinc-400">Up to 10% off allocations</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

