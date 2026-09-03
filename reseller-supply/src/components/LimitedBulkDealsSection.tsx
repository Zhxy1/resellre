import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { LimitedBulkDeal, Product } from '../types';
import { Zap, Clock, ShieldAlert, CheckCircle, ArrowRight, Sparkles, Layers } from 'lucide-react';

export const LimitedBulkDealsSection: React.FC = () => {
  const { limitedBulkDeals, products, openRequestModal, openProductModal } = useStore();

  const activeDeals = limitedBulkDeals.filter((d) => d.isActive);

  if (activeDeals.length === 0) return null;

  return (
    <section id="limited-bulk-deals-section" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2 border-b border-neutral-900 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 font-mono-code">
              FLASH BULK ALLOCATIONS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-display mt-1">
            LIMITED-TIME <span className="text-red-600">BULK DEALS</span>
          </h2>
        </div>
        <p className="text-xs text-neutral-400 font-mono-code">
          STRICT REDEMPTION LIMITS • REAL-TIME ALLOCATION COUNTER
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeDeals.map((deal) => {
          const product = products.find((p) => p.id === deal.productId);
          if (!product) return null;

          return <BulkDealCard key={deal.id} deal={deal} product={product} />;
        })}
      </div>
    </section>
  );
};

const BulkDealCard: React.FC<{ deal: LimitedBulkDeal; product: Product }> = ({ deal, product }) => {
  const { openRequestModal, openProductModal } = useStore();
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const end = new Date(deal.endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
        setIsExpired(false);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [deal.endTime]);

  const redemptionsLeft = Math.max(0, deal.maxRedemptions - deal.currentRedemptions);
  const isSoldOut = redemptionsLeft <= 0;

  // Base tier calculation for required quantity
  const standardTierPrice = (product.wholesaleTiers && product.wholesaleTiers[deal.requiredQuantity]) || ((product.baseUnitPrice ?? 0) * deal.requiredQuantity);
  const promoTotal = Math.max(0, standardTierPrice - deal.discountAmount);
  const promoUnit = (promoTotal / deal.requiredQuantity).toFixed(2);

  return (
    <div
      id={`bulk-deal-card-${deal.id}`}
      className="relative rounded-2xl bg-gradient-to-b from-neutral-900/90 to-neutral-950 border border-neutral-800 hover:border-red-600/60 p-6 transition-all duration-300 shadow-xl flex flex-col justify-between group"
    >
      {/* Top badges */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-950/80 border border-red-800 text-red-400 text-xs font-black uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 fill-red-400 text-red-400" />
          <span>{deal.title}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono-code bg-black/60 px-2.5 py-1 rounded-md border border-neutral-800">
          <Clock className="w-3.5 h-3.5 text-red-500" />
          <span>
            {isExpired
              ? 'EXPIRED'
              : `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center gap-4 my-2">
        <div
          onClick={() => openProductModal(product)}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-black/60 border border-neutral-800 p-2 shrink-0 flex items-center justify-center cursor-pointer group-hover:border-red-600/40"
        >
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain filter drop-shadow-md"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            onClick={() => openProductModal(product)}
            className="text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2">
            {deal.tagline || `BUY ${deal.requiredQuantity} UNITS NOW AND SAVE $${deal.discountAmount}`}
          </p>

          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-xl font-black text-white font-mono-code">
              ${promoTotal.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-400 line-through font-mono-code">
              ${standardTierPrice.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-red-500 bg-red-950/60 px-2 py-0.5 rounded border border-red-700/40 font-mono-code">
              -${deal.discountAmount} OFF
            </span>
          </div>
        </div>
      </div>

      {/* Redemptions Progress Tracker */}
      <div className="my-4 bg-black/70 p-3 rounded-xl border border-neutral-800/80">
        <div className="flex items-center justify-between text-xs font-mono-code mb-1.5">
          <span className="text-neutral-400">BATCH ALLOCATION:</span>
          <span className="font-bold text-red-400">
            {isSoldOut ? 'ALLOCATION FILLED' : `${deal.currentRedemptions}/${deal.maxRedemptions} CLAIMED`}
          </span>
        </div>
        <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800">
          <div
            className="bg-gradient-to-r from-red-700 to-red-500 h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, (deal.currentRedemptions / deal.maxRedemptions) * 100)}%`,
            }}
          />
        </div>
        <div className="flex justify-between items-center mt-1 text-[10px] text-neutral-400 font-mono-code">
          <span>Required Qty: {deal.requiredQuantity} Units</span>
          <span>{redemptionsLeft} Redemptions Left</span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => openRequestModal(product, deal.requiredQuantity)}
        disabled={isExpired || isSoldOut}
        id={`claim-bulk-deal-${deal.id}-btn`}
        className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
          isExpired || isSoldOut
            ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(229,9,20,0.4)] hover:shadow-[0_0_25px_rgba(229,9,20,0.7)]'
        }`}
      >
        <span>
          {isExpired
            ? 'Offer Expired'
            : isSoldOut
            ? 'Batch Allocation Filled'
            : `Lock In ${deal.requiredQuantity}-Unit Rate`}
        </span>
        {!isExpired && !isSoldOut && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );
};
