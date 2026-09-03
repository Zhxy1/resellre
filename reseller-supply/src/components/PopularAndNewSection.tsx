import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { Flame, Sparkles, Tag, ArrowRight, Eye, Heart, Layers, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export const PopularAndNewSection: React.FC = () => {
  const { products, openProductModal, openRequestModal, currentUser, toggleFavorite } = useStore();
  const [filterTab, setFilterTab] = useState<'all' | 'popular' | 'new' | 'affordable'>('all');

  const filteredProducts = products.filter((p) => {
    if (filterTab === 'popular') return p.isBestSeller || (p.rank && p.rank <= 5);
    if (filterTab === 'new') return p.isNewlyAdded;
    if (filterTab === 'affordable') return p.baseUnitPrice <= 45;
    return true;
  });

  return (
    <section id="popular-and-new-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header with Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-900 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-red-600/20 text-red-500 border border-red-600/40">
              <Sparkles className="w-3 h-3" />
              Direct Vendor Catalog
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-display tracking-tight">
            Popular & <span className="text-red-600">Newly Added</span> Products
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Browse high-demand items, fresh factory allocations, and verified 1:1 master batches.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              filterTab === 'all'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => setFilterTab('popular')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              filterTab === 'popular'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Popular</span>
          </button>
          <button
            onClick={() => setFilterTab('new')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              filterTab === 'new'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Newly Added</span>
          </button>
          <button
            onClick={() => setFilterTab('affordable')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              filterTab === 'affordable'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Under $50</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product, idx) => {
          const isFavorite = currentUser.favorites.includes(product.id);
          const tierKeys = product.wholesaleTiers ? Object.keys(product.wholesaleTiers).map(Number) : [];
          const lowestUnitPrice =
            tierKeys.length > 0 && product.wholesaleTiers
              ? (product.wholesaleTiers[Math.max(...tierKeys)] / Math.max(...tierKeys)).toFixed(2)
              : (product.baseUnitPrice ?? 0).toFixed(2);

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: (idx % 4) * 0.05 }}
              className="group flex flex-col justify-between rounded-2xl bg-neutral-950/90 border border-neutral-800 hover:border-red-600/60 p-5 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,30,39,0.25)] relative"
            >
              <div>
                {/* Header with badges and favorite button */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {product.rank && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
                        TOP #{product.rank}
                      </span>
                    )}
                    {product.isNewlyAdded && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        NEW BATCH
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase text-neutral-400">
                      {product.category}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-900 transition-colors"
                    aria-label="Toggle wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorite ? 'fill-red-600 text-red-600' : 'text-neutral-400'
                      }`}
                    />
                  </button>
                </div>

                {/* Product Image */}
                <div
                  onClick={() => openProductModal(product)}
                  className="cursor-pointer relative h-44 w-full rounded-xl bg-black/70 border border-neutral-900 flex items-center justify-center p-3 group-hover:border-red-600/30 transition-colors overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/80 text-neutral-300 border border-neutral-700/50">
                      1:1 Master
                    </span>
                  </div>
                </div>

                {/* Title and Short Explanation */}
                <div className="mt-3">
                  <h3
                    onClick={() => openProductModal(product)}
                    className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {product.shortExplanation}
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="mt-4 pt-3 border-t border-neutral-900 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
                      Sample (1pc)
                    </span>
                    <span className="text-sm font-black text-white font-mono-code">
                      ${(product.baseUnitPrice ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-red-400 block font-bold">
                      Bulk As Low As
                    </span>
                    <span className="text-sm font-black text-red-500 font-mono-code">
                      ${lowestUnitPrice}/ea
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => openProductModal(product)}
                  className="w-full py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider border border-neutral-800 hover:border-red-600/40 transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Specs</span>
                </button>
                <button
                  onClick={() => openRequestModal(product, 10)}
                  className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(255,30,39,0.3)] hover:shadow-[0_0_20px_rgba(255,30,39,0.6)] flex items-center justify-center"
                >
                  <span>Request</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
