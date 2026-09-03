import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';
import { Headphones, Watch, Briefcase, Zap, Flame, Sparkles, ArrowRight, Grid } from 'lucide-react';
import { motion } from 'motion/react';

interface CategoryCardInfo {
  name: ProductCategory;
  title: string;
  tagline: string;
  icon: React.ReactNode;
  image: string;
  badge?: string;
}

export const ShopByCategorySection: React.FC = () => {
  const { products, setActiveCategory } = useStore();

  const handleCategoryClick = (category: ProductCategory) => {
    setActiveCategory(category);
    const catalogElement = document.getElementById('product-catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categoryCards: CategoryCardInfo[] = [
    {
      name: 'Top Sellers',
      title: 'Top 5 Best Sellers',
      tagline: 'Highest turnover inventory & verified 1:1 master batches',
      icon: <Flame className="w-5 h-5 text-red-500" />,
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop',
      badge: 'POPULAR #1',
    },
    {
      name: 'Electronics',
      title: 'Tech & Electronics',
      tagline: 'MagSafe battery packs, chargers, styling wands & gadgets',
      icon: <Zap className="w-5 h-5 text-red-500" />,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Audio',
      title: 'Headphones & Audio',
      tagline: 'AirPods Max, ANC earbuds with active transparency & spatial audio',
      icon: <Headphones className="w-5 h-5 text-red-500" />,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
      badge: 'TOP AUDIO',
    },
    {
      name: 'Watches',
      title: 'Luxury Timepieces',
      tagline: 'Submariner, Nautilus, and Royal Oak craftsmanship',
      icon: <Watch className="w-5 h-5 text-red-500" />,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Designer Bags',
      title: 'Leather & Accessories',
      tagline: 'Monogram wallets, luxury shoulder bags & cardholders',
      icon: <Briefcase className="w-5 h-5 text-red-500" />,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Daily Deals',
      title: 'Special Daily Deals',
      tagline: 'Automated 5%-10% discounts rotated on a 24-hour cycle',
      icon: <Sparkles className="w-5 h-5 text-red-500" />,
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop',
      badge: 'LIMITED TIME',
    },
  ];

  return (
    <section id="shop-by-category" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-900 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Grid className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
              Direct Supply Catalog
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-display tracking-tight">
            Shop By <span className="text-red-600">Category</span>
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Filter our inventory by product line to find the exact batch allocations you need.
          </p>
        </div>

        <button
          onClick={() => handleCategoryClick('All')}
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-300 hover:text-white uppercase tracking-wider bg-neutral-900 hover:bg-neutral-800 px-4 py-2 rounded-xl border border-neutral-800 hover:border-red-600/50 transition-all self-start sm:self-auto"
        >
          <span>View All Products</span>
          <ArrowRight className="w-4 h-4 text-red-500" />
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categoryCards.map((card, idx) => {
          const count =
            card.name === 'All'
              ? products.length
              : card.name === 'Top Sellers'
              ? products.filter((p) => p.isBestSeller).length
              : card.name === 'Daily Deals'
              ? 2
              : products.filter((p) => p.category === card.name).length;

          return (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => handleCategoryClick(card.name)}
              className="group cursor-pointer relative overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-red-600/60 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,30,39,0.25)] hover:-translate-y-1"
            >
              {/* Background image preview with dark gradient */}
              <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900/90 border border-neutral-800 group-hover:border-red-600/50 flex items-center justify-center transition-colors shadow-md">
                    {card.icon}
                  </div>

                  {card.badge && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-600/40">
                      {card.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors uppercase font-display">
                  {card.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {card.tagline}
                </p>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between">
                <span className="text-xs font-mono-code text-neutral-400">
                  <strong className="text-white font-bold">{count}</strong> items available
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
