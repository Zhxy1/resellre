import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Truck,
  Zap,
  ShieldCheck,
  Instagram,
  Video,
  Share2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Package,
} from 'lucide-react';

export const ShippingAndSocialSection: React.FC = () => {
  const { shippingConfig, socialLinks, showToast } = useStore();

  const handleShareWebsite = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('success', 'Link Copied', 'Vendor website link copied to your clipboard!');
    }
  };

  return (
    <section id="shipping-and-social-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 2-Column Grid: Shipping Options + Social Media Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Shipping & Delivery Infrastructure */}
        <div className="lg:col-span-7 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-red-600/20 text-red-500 border border-red-600/40">
                <Truck className="w-3 h-3" />
                US Delivery Network
              </span>
            </div>
            <h2 className="text-2xl font-black text-white uppercase font-display tracking-tight">
              Fast, Discreet <span className="text-red-600">Shipping Options</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Every parcel is double-boxed in 100% unmarked discreet packaging with guaranteed live tracking.
            </p>

            {/* 2 Shipping Option Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {/* Standard Free Shipping */}
              <div className="rounded-xl bg-neutral-900/90 border border-neutral-800 p-4 space-y-2.5 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase font-display flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-red-500" />
                    Standard Delivery
                  </span>
                  <span className="text-xs font-black text-emerald-400 font-mono-code px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-900/60">
                    FREE
                  </span>
                </div>
                <div className="text-xs text-neutral-300 font-mono-code">
                  ⏱ {shippingConfig.standardDeliveryDays}
                </div>
                <ul className="text-[11px] text-neutral-400 space-y-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-red-500" /> Full USPS / UPS live tracking
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-red-500" /> Unmarked outer packaging
                  </li>
                </ul>
              </div>

              {/* Expedited Shipping */}
              <div className="rounded-xl bg-neutral-900/90 border border-red-600/40 p-4 space-y-2.5 relative shadow-[0_0_15px_rgba(255,30,39,0.15)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase font-display flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-red-500" />
                    Expedited Priority
                  </span>
                  <span className="text-xs font-black text-red-400 font-mono-code px-2 py-0.5 rounded bg-red-950/60 border border-red-900/60">
                    ${(shippingConfig?.expeditedShippingPrice ?? 14.99).toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-neutral-300 font-mono-code">
                  ⏱ {shippingConfig?.expeditedDeliveryDays || '1-2 Business Days'}
                </div>
                <ul className="text-[11px] text-neutral-400 space-y-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-red-500" /> Priority queue dispatch
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-red-500" /> Air courier express
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Guarantee Footer */}
          <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/50 border border-emerald-900/50 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-xs text-neutral-300">
              <strong>100% Delivery Guarantee:</strong> If any parcel is lost or stalled in transit, we automatically reship a replacement batch immediately.
            </p>
          </div>
        </div>

        {/* Right Column: Social Media Channels (Instagram & TikTok) */}
        <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-red-600/20 text-red-500 border border-red-600/40">
                <Share2 className="w-3 h-3" />
                Live Social Channels
              </span>
            </div>
            <h2 className="text-2xl font-black text-white uppercase font-display tracking-tight">
              Follow Us on <span className="text-red-600">Social Media</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Watch live batch unboxings, factory inspections, and sudden flash drop alerts.
            </p>

            {/* Social Links */}
            <div className="space-y-3 mt-6">
              {/* Instagram */}
              <a
                href={socialLinks.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-red-600/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                      Instagram Official
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono-code">
                      {socialLinks.instagramHandle}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </a>

              {/* TikTok */}
              <a
                href={socialLinks.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-red-600/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black border border-neutral-700 flex items-center justify-center text-white shadow-md">
                    <Video className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                      TikTok Drops & Unboxings
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono-code">
                      {socialLinks.tiktokHandle}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Share Button */}
          <div className="mt-6 pt-4 border-t border-neutral-900">
            <button
              onClick={handleShareWebsite}
              className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-bold text-xs uppercase tracking-wider border border-neutral-800 hover:border-red-600/40 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5 text-red-500" />
              <span>Copy & Share Reseller Supply Link</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
