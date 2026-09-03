import React from 'react';
import { useStore } from '../context/StoreContext';
import { Clock, Eye, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const RecentlyViewedSection: React.FC = () => {
  const { products, recentlyViewedIds, openProductModal, openRequestModal } = useStore();

  const viewedProducts = recentlyViewedIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  if (viewedProducts.length === 0) return null;

  return (
    <section id="recently-viewed-section" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-900">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-500" />
          <h3 className="text-sm sm:text-base font-bold text-white uppercase font-display tracking-wider">
            Recently Viewed <span className="text-red-500">Products</span>
          </h3>
        </div>
        <span className="text-xs text-neutral-500 font-mono-code">
          {viewedProducts.length} items logged
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {viewedProducts.map((prod) => {
          if (!prod) return null;
          return (
            <div
              key={prod.id}
              onClick={() => openProductModal(prod)}
              className="group cursor-pointer rounded-xl bg-neutral-950 border border-neutral-800 hover:border-red-600/50 p-3 transition-all flex flex-col justify-between hover:shadow-[0_0_15px_rgba(255,30,39,0.2)]"
            >
              <div className="h-24 w-full bg-black/70 rounded-lg flex items-center justify-center p-2 mb-2 overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>

              <div>
                <span className="text-[9px] uppercase font-bold text-neutral-400 block truncate">
                  {prod.category}
                </span>
                <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                  {prod.name}
                </h4>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xs font-black text-red-500 font-mono-code">
                    ${(prod.baseUnitPrice ?? 0).toFixed(2)}
                  </span>
                  <span className="text-[9px] text-neutral-400">1:1 Batch</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
