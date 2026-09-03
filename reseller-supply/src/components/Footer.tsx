import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';
import { ShieldCheck, Mail, Lock, Flame, Truck, Instagram, Video, Share2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveCategory, setIsAdminModalOpen, adminConfig, socialLinks } = useStore();

  const handleCatClick = (cat: ProductCategory) => {
    setActiveCategory(cat);
    const catalog = document.getElementById('product-catalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black border-t border-neutral-900 text-neutral-400 text-xs">
      {/* Top Value Propositions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-neutral-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-neutral-900 text-red-500 border border-neutral-800 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-bold uppercase text-xs">#1 In America Right Now</h4>
            <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
              Trusted by 10,000+ resellers nationwide for verified 1:1 master craftsmanship.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-neutral-900 text-red-500 border border-neutral-800 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-bold uppercase text-xs">Free Standard US Shipping</h4>
            <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
              Standard 7-24 day discreet delivery with real-time tracking on every order.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-neutral-900 text-red-500 border border-neutral-800 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-bold uppercase text-xs">Direct Bulk Volume Pricing</h4>
            <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
              Transparent tiered rate matrix up to 500-unit wholesale allocations.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-neutral-900 text-red-500 border border-neutral-800 shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-bold uppercase text-xs">24/7 Dedicated Support</h4>
            <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
              Fast response on custom requests and product inquiries within 2 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-black text-sm shadow-[0_0_15px_rgba(255,30,39,0.7)]">
              RS
            </div>
            <span className="font-display font-black text-lg tracking-tight text-white">
              RESELLER <span className="text-red-500">SUPPLY</span>
            </span>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            #1 trusted vendor in America right now. Direct high-velocity tech, audio, designer goods, and luxury accessories.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <a
              href={socialLinks.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
              title="Instagram"
            >
              <Instagram className="w-4 h-4 text-pink-500" />
            </a>
            <a
              href={socialLinks.tiktokUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
              title="TikTok"
            >
              <Video className="w-4 h-4 text-red-500" />
            </a>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 text-[11px] font-mono-code transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-red-500" />
              <span>Owner Admin Access</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono-code">
            Product Divisions
          </h5>
          <ul className="space-y-2 text-xs">
            {['Top Sellers', 'Electronics', 'Audio', 'Designer Bags', 'Watches', 'Daily Deals'].map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => handleCatClick(cat as ProductCategory)}
                  className="text-neutral-400 hover:text-red-500 transition-colors"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer & Reseller Hub */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono-code">
            Customer Hub
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="#daily-deals-section" className="text-neutral-400 hover:text-red-500 transition-colors">
                Today's Daily Deals
              </a>
            </li>
            <li>
              <a href="#customer-feedback-section" className="text-neutral-400 hover:text-red-500 transition-colors">
                Suggest a Product / Feedback
              </a>
            </li>
            <li>
              <a href="#shipping-and-social-section" className="text-neutral-400 hover:text-red-500 transition-colors">
                Shipping & Delivery Timelines
              </a>
            </li>
            <li>
              <a href="#voucher-promotions-section" className="text-neutral-400 hover:text-red-500 transition-colors">
                Daily Promo Codes
              </a>
            </li>
            <li>
              <a href="#faq-section" className="text-neutral-400 hover:text-red-500 transition-colors">
                FAQ & Batch Quality Specs
              </a>
            </li>
          </ul>
        </div>

        {/* Transparency & Disclosure Notice */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono-code">
            Batch Quality Guarantee
          </h5>
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 text-[11px] leading-relaxed text-neutral-400">
            All catalog items are strictly graded 1:1 master editions manufactured with exact 1:1 dimensioning, materials, and internal firmware. Complete transparency and verified supplier direct pricing.
          </div>
          <div className="text-[11px] text-neutral-500 font-mono-code">
            Direct Inquiries: <span className="text-neutral-300">{adminConfig.adminNotificationEmail}</span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-400">
        <div>
          © {new Date().getFullYear()} Reseller Supply. #1 Trusted Vendor in America. All rights reserved.
        </div>
        <div className="flex items-center gap-4 font-mono-code">
          <span>HIGH-SPEED ENCRYPTED DISPATCH</span>
          <span>•</span>
          <span className="text-red-500">DEEP BLACK / RED THEME</span>
        </div>
      </div>
    </footer>
  );
};

