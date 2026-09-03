import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory, Product } from '../types';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Heart,
  Eye,
  Send,
  Sparkles,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductCatalog: React.FC = () => {
  const {
    products,
    categories,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    openProductModal,
    openRequestModal,
    currentUser,
    toggleFavorite,
  } = useStore();

  const [sortBy, setSortBy] = useState<'rank' | 'price-asc' | 'price-desc' | 'name'>('rank');
  const [stockOnly, setStockOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (activeCategory === 'Top Sellers') {
          if (!p.isBestSeller && !p.rank) return false;
        } else if (activeCategory === 'Daily Deals' || activeCategory === 'Wholesale Deals') {
          // Show all bulk tier products
          if (Object.keys(p.wholesaleTiers).length === 0) return false;
        } else if (activeCategory !== 'All') {
          if (p.category !== activeCategory) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesCat = p.category.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          if (!matchesName && !matchesCat && !matchesDesc) return false;
        }

        // Stock filter
        if (stockOnly && p.stockStatus !== 'In Stock') {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rank') {
          return (a.rank || 99) - (b.rank || 99);
        }
        if (sortBy === 'price-asc') {
          const aPrice = a.wholesaleTiers[10] ? a.wholesaleTiers[10] / 10 : a.baseUnitPrice;
          const bPrice = b.wholesaleTiers[10] ? b.wholesaleTiers[10] / 10 : b.baseUnitPrice;
          return aPrice - bPrice;
        }
        if (sortBy === 'price-desc') {
          const aPrice = a.wholesaleTiers[10] ? a.wholesaleTiers[10] / 10 : a.baseUnitPrice;
          const bPrice = b.wholesaleTiers[10] ? b.wholesaleTiers[10] / 10 : b.baseUnitPrice;
          return bPrice - aPrice;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [products, activeCategory, searchQuery, sortBy, stockOnly]);

  return (
    <section id="product-catalog" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Category Pills & Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-900 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 font-mono-code">
              INVENTORY ARCHIVE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-display mt-1">
              WHOLESALE <span className="text-red-600">PRODUCT CATALOG</span>
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Showing {filteredProducts.length} verified 1:1 master editions ready for immediate distribution.
            </p>
          </div>

          {/* Filter & Sorting Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input in Catalog */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by keyword..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600/60"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-neutral-900/90 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-red-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="rank" className="bg-neutral-900 text-white">Sort by Rank</option>
                <option value="price-asc" className="bg-neutral-900 text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-neutral-900 text-white">Price: High to Low</option>
                <option value="name" className="bg-neutral-900 text-white">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Horizontal Scroll Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(229,9,20,0.5)] border border-red-500'
                  : 'bg-neutral-900/70 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-neutral-950 border border-neutral-800 p-8">
          <SlidersHorizontal className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white uppercase">No Products Match Your Criteria</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
            Try adjusting your search query or switching categories to explore all available inventory items.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs uppercase"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => {
              const isFav = currentUser.favorites.includes(product.id);
              const tierKeys = product.wholesaleTiers ? Object.keys(product.wholesaleTiers).map(Number) : [];
              const hasTiers = tierKeys.length > 0;
              const starting10UnitPrice = product.wholesaleTiers && product.wholesaleTiers[10]
                ? (product.wholesaleTiers[10] / 10).toFixed(2)
                : ((product.baseUnitPrice ?? 0)).toFixed(2);

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  id={`product-card-${product.id}`}
                  className="group relative rounded-2xl bg-neutral-950 border border-neutral-800/90 hover:border-red-600/70 p-5 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_25px_rgba(229,9,20,0.3)]"
                >
                  {/* Top Badges & Favorite Button */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      {product.rank ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-950/80 text-red-400 border border-red-800/60">
                          #{product.rank} TOP SELLER
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-800">
                          {product.category}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-red-500 border border-neutral-800 transition-colors"
                      title={isFav ? 'Remove from Saved' : 'Save Product'}
                    >
                      <Heart
                        className={`w-4 h-4 ${isFav ? 'text-red-500 fill-red-500' : ''}`}
                      />
                    </button>
                  </div>

                  {/* Product Image */}
                  <div
                    onClick={() => openProductModal(product)}
                    className="relative w-full h-48 rounded-xl bg-black/60 border border-neutral-900 flex items-center justify-center p-4 cursor-pointer overflow-hidden group-hover:border-red-600/40 transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Quality Stamp */}
                    <div className="absolute bottom-2 left-2 pointer-events-none">
                      <span className="text-[9px] font-bold text-neutral-300 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded border border-neutral-800">
                        {product.qualityGrade.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => openProductModal(product)}
                        className="text-base font-bold text-white group-hover:text-red-400 transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                        {product.shortExplanation || product.description}
                      </p>

                      {/* Tier Pills */}
                      {hasTiers && (
                        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-neutral-400 font-mono-code uppercase font-bold">
                            Tiers:
                          </span>
                          {[10, 20, 50, 100, 500].map((qty) => {
                            if (!product.wholesaleTiers[qty]) return null;
                            return (
                              <span
                                key={qty}
                                className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800"
                              >
                                {qty}u
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Price & Actions */}
                    <div className="mt-4 pt-3 border-t border-neutral-900 flex flex-col gap-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-neutral-400">10-Unit Unit Price:</span>
                        <span className="text-lg font-black text-white font-mono-code">
                          ${starting10UnitPrice}
                          <span className="text-xs text-neutral-400 font-normal">/u</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => openProductModal(product)}
                          className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider border border-neutral-700 hover:border-red-500/40 transition-all flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Specs</span>
                        </button>

                        <button
                          onClick={() => openRequestModal(product, 10)}
                          className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(229,9,20,0.35)] hover:shadow-[0_0_20px_rgba(229,9,20,0.6)] flex items-center justify-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Inquire</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};
