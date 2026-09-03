import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { DailyDeal, Product } from '../types';
import { Flame, Clock, Tag, ArrowRight, Sparkles, ShieldCheck, Dices, Layers, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const DailyDealSection: React.FC = () => {
  const { dailyDeals, products, rotateDailyDeals, openProductModal, openRequestModal } = useStore();

  const activeDeals = dailyDeals.filter((d) => d.isActive).slice(0, 2);

  return (
    <section id="daily-deal-section" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 border-b border-neutral-900 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_#FF1E27]" />
            <span className="text-xs font-black uppercase tracking-widest text-red-500 font-mono-code">
              DAILY DEALS ENGINE • 2 ACTIVE ALLOCATIONS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-display mt-1">
            TODAY'S <span className="text-red-600">DAILY DEALS</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Automated inventory rotation engine: <span className="text-red-400 font-bold">Best Sellers get 5% OFF</span> and <span className="text-emerald-400 font-bold">Other Catalog Selections get 10% OFF</span>.
          </p>
        </div>

        {/* Action / Randomizer Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => rotateDailyDeals(true)}
            id="randomize-daily-deals-btn"
            title="Trigger automated deal selector to randomly cycle today's 2 deals"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-red-600/60 text-xs font-bold text-neutral-300 hover:text-white transition-all shadow-md group"
          >
            <Dices className="w-4 h-4 text-red-500 group-hover:rotate-180 transition-transform duration-500" />
            <span>Randomize Deals</span>
          </button>
        </div>
      </div>

      {/* 2 Daily Deals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeDeals.map((deal, index) => {
          const product = products.find((p) => p.id === deal.productId) || products[index % products.length];
          if (!product) return null;

          return (
            <DailyDealCard
              key={deal.id || `deal-${index}`}
              deal={deal}
              product={product}
              slotIndex={index + 1}
            />
          );
        })}
      </div>
    </section>
  );
};

interface DailyDealCardProps {
  deal: DailyDeal;
  product: Product;
  slotIndex: number;
}

const DailyDealCard: React.FC<DailyDealCardProps> = ({ deal, product, slotIndex }) => {
  const { openProductModal, openRequestModal } = useStore();

  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 14,
    minutes: 32,
    seconds: 15,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      let targetTime = new Date(deal.endsAt).getTime();

      // If target passed or invalid, default to midnight today
      if (isNaN(targetTime) || targetTime <= now) {
        const midnight = new Date();
        midnight.setHours(23, 59, 59, 999);
        targetTime = midnight.getTime();
      }

      const difference = targetTime - now;

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [deal.endsAt]);

  const isBestSeller = !!(product.isBestSeller || (product.rank && product.rank <= 5));
  // Standard 10-unit tier baseline
  const original10Tier = (product.wholesaleTiers && product.wholesaleTiers[10]) || ((product.baseUnitPrice ?? 0) * 10);
  const originalUnitRate = original10Tier / 10;

  // Rule: Best sellers 5% off, others 10% off
  const discountPercent = deal.discountPercent || (isBestSeller ? 5 : 10);
  const discountDecimal = discountPercent / 100;
  const discounted10Tier = Math.round(original10Tier * (1 - discountDecimal));
  const discountedUnitRate = (discounted10Tier / 10).toFixed(2);
  const savingsAmount = original10Tier - discounted10Tier;

  return (
    <div
      id={`daily-deal-card-slot-${slotIndex}`}
      className="relative rounded-3xl bg-neutral-950 border border-neutral-800 hover:border-red-600/70 p-1 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_35px_rgba(255,30,39,0.25)] overflow-hidden flex flex-col justify-between group"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/5 rounded-full blur-3xl pointer-events-none group-hover:bg-red-600/10 transition-colors" />

      <div className="bg-gradient-to-b from-neutral-900/90 to-neutral-950 rounded-[22px] p-5 sm:p-6 flex flex-col justify-between h-full relative z-10 gap-5">
        {/* Top Badges & Countdown */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-600 text-black font-black text-[11px] uppercase tracking-wider shadow-[0_0_12px_rgba(255,30,39,0.7)]">
                <Flame className="w-3.5 h-3.5 text-black fill-black" />
                DEAL #{slotIndex}
              </span>

              {isBestSeller ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-950/80 border border-amber-600/60 text-amber-400 text-[11px] font-bold font-mono-code">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  BEST SELLER • 5% OFF
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-950/80 border border-red-800/60 text-red-400 text-[11px] font-bold font-mono-code">
                  <Tag className="w-3 h-3 text-red-400" />
                  CATALOG SPOTLIGHT • 10% OFF
                </span>
              )}
            </div>

            {/* Countdown Badge */}
            <div className="flex items-center gap-1 text-[11px] font-mono-code text-neutral-400 bg-black/70 px-2.5 py-1 rounded-lg border border-neutral-800">
              <Clock className="w-3 h-3 text-red-500" />
              <span className="text-white font-bold">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Product Info with Image Preview */}
          <div className="flex items-start gap-4 mt-2">
            <div
              onClick={() => openProductModal(product)}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-black border border-neutral-800 hover:border-red-600/60 p-2 shrink-0 cursor-pointer flex items-center justify-center relative group/img overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover/img:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[9px] font-black uppercase text-white bg-black/80 px-1.5 py-0.5 rounded">
                  Inspect
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase font-bold text-neutral-500 font-mono-code tracking-wider">
                {product.category} {product.subCategory ? `• ${product.subCategory}` : ''}
              </div>
              <h3
                onClick={() => openProductModal(product)}
                className="text-lg sm:text-xl font-black text-white uppercase hover:text-red-500 transition-colors cursor-pointer truncate font-display"
                title={product.name}
              >
                {product.name}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                {deal.customHeadline || product.shortExplanation || product.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  {product.qualityGrade}
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono-code font-bold">
                  <CheckCircle2 className="w-3 h-3" /> {product.unitsAvailable.toLocaleString()} in factory queue
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Box */}
        <div className="p-4 rounded-xl bg-black/60 border border-neutral-800/80 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
              10-Unit Batch Rate
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xs line-through text-neutral-400 font-mono-code">
                ${original10Tier.toLocaleString()}
              </span>
              <span className="text-xl font-black text-white font-mono-code">
                ${discounted10Tier.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-red-400 block tracking-wider">
              Effective Price / Unit
            </span>
            <div className="text-lg font-black text-emerald-400 font-mono-code mt-0.5">
              ${discountedUnitRate}
              <span className="text-xs text-neutral-400 font-normal"> /u</span>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1 text-xs font-black text-red-400 bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-800/60 font-mono-code">
              SAVE ${savingsAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => openRequestModal(product, 10)}
            id={`request-deal-btn-slot-${slotIndex}`}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-black hover:text-white font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,30,39,0.5)] flex items-center justify-center gap-1.5"
          >
            <span>Request {product.wholesaleTiers[10] ? '10-Unit Batch' : 'Batch'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => openProductModal(product)}
            id={`view-specs-deal-btn-slot-${slotIndex}`}
            className="py-2.5 px-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-bold uppercase transition-colors"
          >
            Specs
          </button>
        </div>
      </div>
    </div>
  );
};
