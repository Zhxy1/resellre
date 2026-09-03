import React, { useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { ArrowRight, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

export const Top5Hero: React.FC = () => {
  const { products, openProductModal, openRequestModal } = useStore();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Retrieve products explicitly ranked 1 to 5 or fallback to top 5
  const rankedProducts: Product[] = [];
  for (let r = 1; r <= 5; r++) {
    const found = products.find((p) => p.rank === r);
    if (found) {
      rankedProducts.push(found);
    }
  }

  // If some ranks are missing, backfill from products marked isBestSeller or remaining products
  if (rankedProducts.length < 5) {
    const remaining = products.filter((p) => !rankedProducts.includes(p));
    rankedProducts.push(...remaining.slice(0, 5 - rankedProducts.length));
  }

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getRankBadgeStyle = (rankNumber: number) => {
    switch (rankNumber) {
      case 1:
        return {
          pillClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          numberClass: 'text-amber-400 font-extrabold',
          label: '#1 Best Seller',
          cardBorder: 'border-zinc-800 hover:border-zinc-700 ring-1 ring-amber-500/20',
        };
      case 2:
        return {
          pillClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
          numberClass: 'text-slate-300 font-extrabold',
          label: '#2 Top Ranked',
          cardBorder: 'border-zinc-800 hover:border-zinc-700',
        };
      case 3:
        return {
          pillClass: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
          numberClass: 'text-orange-400 font-extrabold',
          label: '#3 Top Ranked',
          cardBorder: 'border-zinc-800 hover:border-zinc-700',
        };
      case 4:
        return {
          pillClass: 'bg-red-500/15 text-red-300 border-red-500/30',
          numberClass: 'text-red-400 font-extrabold',
          label: '#4 Top Ranked',
          cardBorder: 'border-zinc-800 hover:border-zinc-700',
        };
      case 5:
      default:
        return {
          pillClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
          numberClass: 'text-sky-400 font-extrabold',
          label: '#5 Top Ranked',
          cardBorder: 'border-zinc-800 hover:border-zinc-700',
        };
    }
  };

  return (
    <section
      id="top-5-hero-section"
      className="relative pt-6 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Header section with Top 5 title & Carousel Navigation Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-zinc-900 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
              Verified Best Sellers
            </span>
            <span className="text-xs text-zinc-500 font-medium">Daily High-Velocity Inventory</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            Top 5 <span className="text-red-500">Best Sellers</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Our highest-demand inventory tiers with verified build quality and direct volume pricing.
          </p>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-2 self-start md:self-end">
          <button
            onClick={() => scrollCarousel('left')}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollCarousel('right')}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Lineup on Desktop / Swipeable Carousel on Mobile */}
      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {rankedProducts.map((product, index) => {
          const rank = product.rank || index + 1;
          const style = getRankBadgeStyle(rank);
          const isRankOne = rank === 1;

          // Get lowest bulk price per unit
          const tierKeys = product.wholesaleTiers ? Object.keys(product.wholesaleTiers).map(Number) : [];
          const minBulkUnitPrice =
            tierKeys.length > 0 && product.wholesaleTiers
              ? (product.wholesaleTiers[Math.max(...tierKeys)] / Math.max(...tierKeys)).toFixed(2)
              : ((product.baseUnitPrice ?? 0)).toFixed(2);

          const tier10Price = product.wholesaleTiers && product.wholesaleTiers[10]
            ? (product.wholesaleTiers[10] / 10).toFixed(0)
            : (product.baseUnitPrice ?? 0).toFixed(0);

          return (
            <div
              key={product.id}
              id={`top-seller-card-${rank}`}
              className={`snap-center shrink-0 flex flex-col justify-between rounded-2xl bg-zinc-900/70 border ${
                style.cardBorder
              } transition-all duration-200 group relative ${
                isRankOne
                  ? 'w-[320px] sm:w-[350px] p-6'
                  : 'w-[280px] sm:w-[310px] p-5'
              }`}
            >
              {/* Top Left Ranking Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col">
                  <span className={`text-4xl sm:text-5xl ${style.numberClass}`}>
                    #{rank}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 border w-fit ${style.pillClass}`}
                  >
                    {style.label}
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                    10-Unit Tier
                  </span>
                  <span className="text-lg font-bold text-white">
                    ${tier10Price}<span className="text-xs text-zinc-400 font-normal">/ea</span>
                  </span>
                </div>
              </div>

              {/* Product Image Showcase */}
              <div
                onClick={() => openProductModal(product)}
                className="cursor-pointer relative h-48 sm:h-52 w-full rounded-xl bg-zinc-950/80 border border-zinc-800/80 overflow-hidden flex items-center justify-center p-4 group-hover:border-zinc-700 transition-colors my-2"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                  loading="eager"
                />

                {/* Quality Grade Overlay */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-900/90 text-zinc-300 border border-zinc-800">
                    {product.qualityGrade.split(' ')[0]} Grade
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-zinc-900/90 px-2 py-0.5 rounded border border-emerald-900/40">
                    In Stock
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-medium text-zinc-500 mb-1">
                    {product.category}
                  </div>
                  <h3
                    onClick={() => openProductModal(product)}
                    className="text-base font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {product.name}
                  </h3>

                  {/* Pricing Info */}
                  <div className="mt-2 flex items-baseline justify-between border-y border-zinc-800/80 py-2">
                    <span className="text-xs text-zinc-400">Volume Rate:</span>
                    <span className="text-sm font-bold text-white">
                      From ${minBulkUnitPrice}/unit
                    </span>
                  </div>

                  {/* Explanations */}
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80">
                      <p className="text-zinc-300 leading-relaxed">
                        <strong className="text-red-400 font-medium">Why It Sells: </strong>
                        {product.shortExplanation}
                      </p>
                    </div>

                    <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/50">
                      <p className="text-zinc-400 leading-relaxed text-[11px]">
                        <strong className="text-zinc-300 font-medium">Reseller Margin: </strong>
                        {product.potentialValue}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openProductModal(product)}
                    id={`view-top-${rank}-btn`}
                    className="w-full py-2.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-xs border border-zinc-700 hover:border-zinc-600 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>View Specs</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                  </button>

                  <button
                    onClick={() => openRequestModal(product, 10)}
                    id={`inquire-top-${rank}-btn`}
                    className="w-full py-2.5 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Request Tier</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

