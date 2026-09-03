import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import {
  X,
  ShieldCheck,
  Check,
  Zap,
  Play,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Layers,
  Heart,
  Share2,
  Gift,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    isProductModalOpen,
    closeProductModal,
    openRequestModal,
    currentUser,
    toggleFavorite,
    spendPromotion,
  } = useStore();

  if (!isProductModalOpen || !selectedProduct) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          id="product-detail-modal"
          className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-neutral-950 border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(229,9,20,0.25)] overflow-hidden"
        >
          <ProductDetailContent product={selectedProduct} onClose={closeProductModal} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ProductDetailContent: React.FC<{ product: Product; onClose: () => void }> = ({
  product,
  onClose,
}) => {
  const { openRequestModal, currentUser, toggleFavorite, spendPromotion, showToast } = useStore();

  const [activeMedia, setActiveMedia] = useState<'image' | 'video'>('image');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(10);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  const allImages = [product.image, ...(product.additionalImages || [])];
  const isFav = currentUser.favorites.includes(product.id);

  // Quantity options
  const quantityOptions = [1, 10, 20, 50, 100, 500];

  // Pricing calculation
  const calculatePricing = (qty: number) => {
    const basePrice = product.baseUnitPrice ?? 0;
    // Check if exact tier exists
    if (product.wholesaleTiers && product.wholesaleTiers[qty]) {
      const total = product.wholesaleTiers[qty];
      const unit = total / qty;
      const baseEstimate = basePrice * qty;
      const savings = Math.max(0, baseEstimate - total);
      const discountPercent = baseEstimate > 0 ? ((savings / baseEstimate) * 100).toFixed(0) : '0';
      return { unitPrice: unit, totalPrice: total, savings, discountPercent };
    }

    // Interpolate or fallback to base price
    if (qty === 1) {
      return {
        unitPrice: basePrice,
        totalPrice: basePrice,
        savings: 0,
        discountPercent: '0',
      };
    }

    // Default rate
    const total = basePrice * qty;
    return { unitPrice: basePrice, totalPrice: total, savings: 0, discountPercent: '0' };
  };

  const currentPricing = calculatePricing(selectedQuantity);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const isSpendGiftUnlocked =
    spendPromotion.isActive && currentPricing.totalPrice >= spendPromotion.minSpendAmount;

  return (
    <>
      {/* Modal Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/90 z-20">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-red-950/80 text-red-400 border border-red-800">
            {product.qualityGrade}
          </span>
          <span className="text-xs text-neutral-400 font-mono-code hidden sm:inline">
            SKU: {product.id.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(product.id)}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-red-500 border border-neutral-800 transition-colors"
            title="Save to Favorites"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'text-red-500 fill-red-500' : ''}`} />
          </button>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                showToast('info', 'Link Copied', 'Product link copied to clipboard.');
              }
            }}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
            title="Share Product"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            id="close-product-modal-btn"
            className="p-2 rounded-xl bg-neutral-900 hover:bg-red-600/30 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal Body: 3 Columns on Large Screens (Left: Media, Center: Info, Right: Calculator) */}
      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 custom-scrollbar">
        {/* LEFT COLUMN: Media Gallery (5 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Main Visual Frame */}
          <div
            className="relative w-full aspect-square rounded-2xl bg-neutral-900/90 border border-neutral-800 overflow-hidden flex items-center justify-center cursor-crosshair group"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            {activeMedia === 'image' ? (
              <>
                <img
                  src={allImages[activeImageIndex] || product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-2xl transition-opacity duration-200"
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                    transition: isZoomed ? 'none' : 'transform 0.3s ease',
                  }}
                />

                {/* Zoom Guide Badge */}
                <div className="absolute top-3 right-3 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono-code px-2 py-1 rounded bg-black/80 text-neutral-300 border border-neutral-700 flex items-center gap-1 backdrop-blur-sm">
                    <Maximize2 className="w-3 h-3 text-red-500" />
                    {isZoomed ? '2.2x Zoom Active' : 'Hover to Zoom'}
                  </span>
                </div>
              </>
            ) : (
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                <video
                  src={product.videoUrl}
                  poster={product.videoPoster || product.image}
                  autoPlay
                  loop
                  muted={isVideoMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className="absolute bottom-4 right-4 p-2 rounded-xl bg-black/80 text-white border border-neutral-700 hover:bg-red-600 transition-colors"
                >
                  {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Media Switcher Tabs & Thumbnails */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveMedia('image');
                  setActiveImageIndex(i);
                }}
                className={`w-16 h-16 rounded-xl bg-neutral-900 border p-1 shrink-0 overflow-hidden transition-all ${
                  activeMedia === 'image' && activeImageIndex === i
                    ? 'border-red-600 shadow-[0_0_10px_rgba(229,9,20,0.5)]'
                    : 'border-neutral-800 hover:border-neutral-600 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
              </button>
            ))}

            {/* Video Thumbnail Button if videoUrl present */}
            {product.videoUrl && (
              <button
                onClick={() => setActiveMedia('video')}
                className={`w-16 h-16 rounded-xl bg-neutral-900 border p-1 shrink-0 flex flex-col items-center justify-center transition-all ${
                  activeMedia === 'video'
                    ? 'border-red-600 bg-red-950/40 text-red-500 shadow-[0_0_10px_rgba(229,9,20,0.5)]'
                    : 'border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Play className="w-5 h-5 fill-current" />
                <span className="text-[9px] font-bold mt-1 uppercase">Video</span>
              </button>
            )}
          </div>

          {/* Authenticity & Batch Quality Notice */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/90 text-xs">
            <div className="flex items-center gap-1.5 text-neutral-300 font-bold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Authentic Quality & Transparency Disclosure</span>
            </div>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              {product.authenticityNotice ||
                'Every unit undergoes 100% optical inspection and tactile quality control before palletizing.'}
            </p>
          </div>
        </div>

        {/* CENTER COLUMN: Specifications & Description (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono-code font-bold">
              {product.category} {product.subCategory ? `• ${product.subCategory}` : ''}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight mt-1">
              {product.name}
            </h1>

            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center text-yellow-400 text-xs font-bold gap-1">
                <span>★</span>
                <span>{product.rating}</span>
                <span className="text-neutral-400 font-normal">({product.reviewCount} reviews)</span>
              </div>
              <span className="text-neutral-400">•</span>
              <span className="text-xs font-bold text-emerald-400">
                {product.unitsAvailable.toLocaleString()} Units In Ready Stock
              </span>
            </div>
          </div>

          {/* Product Overview */}
          {product.overview && (
            <div className="text-xs text-neutral-200 leading-relaxed bg-neutral-900/60 p-4 rounded-xl border border-neutral-800">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-red-400 mb-1.5 font-display">
                Product Overview
              </h4>
              <p>{product.overview}</p>
            </div>
          )}

          {/* Important Features */}
          {product.importantFeatures && product.importantFeatures.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono-code flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                Key Product Features
              </h4>
              <ul className="grid grid-cols-1 gap-1.5 text-xs text-neutral-300">
                {product.importantFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-neutral-950/70 p-2 rounded-lg border border-neutral-800/80">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Available Options / Variations */}
          {product.availableOptions && product.availableOptions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono-code mb-2">
                Available Variations / Finishes
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.availableOptions.map((opt, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 text-neutral-200 border border-neutral-700 text-xs font-semibold"
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Condition Details & Packaging Quality */}
          {product.conditionDetails && (
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider mb-1">
                Batch Condition & Packaging
              </span>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                {product.conditionDetails}
              </p>
            </div>
          )}

          {/* Description */}
          <div className="text-xs text-neutral-300 leading-relaxed bg-neutral-900/40 p-4 rounded-xl border border-neutral-800/80">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Production Specifications & Build
            </h4>
            <p>{product.description}</p>
          </div>

          {/* Detailed Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono-code">
                Technical Specifications
              </h4>
              <div className="rounded-xl border border-neutral-800 overflow-hidden bg-black/60">
                {product.specifications.map((spec, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center px-3.5 py-2 text-xs ${
                      i !== product.specifications.length - 1 ? 'border-b border-neutral-900' : ''
                    }`}
                  >
                    <span className="text-neutral-400 font-medium">{spec.name}</span>
                    <span className="text-white font-mono-code font-semibold text-right">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wholesale Pricing Matrix Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono-code mb-2">
              Volume Tier Matrix
            </h4>
            <div className="rounded-xl border border-neutral-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/90 text-neutral-400 text-[10px] uppercase font-mono-code">
                  <tr>
                    <th className="p-2.5">Tier (Units)</th>
                    <th className="p-2.5">Batch Total</th>
                    <th className="p-2.5 text-right">Rate / Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 bg-black/40">
                  {Object.entries(product.wholesaleTiers).map(([qtyStr, totalPrice]) => {
                    const q = Number(qtyStr);
                    const totalNum = Number(totalPrice);
                    const isSelected = selectedQuantity === q;
                    const uPrice = (totalNum / q).toFixed(2);

                    return (
                      <tr
                        key={q}
                        onClick={() => setSelectedQuantity(q)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-red-950/40 text-white font-bold'
                            : 'text-neutral-300 hover:bg-neutral-900/60'
                        }`}
                      >
                        <td className="p-2.5 flex items-center gap-1.5">
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                          <span>{q} Units</span>
                        </td>
                        <td className="p-2.5 font-mono-code">${totalNum.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-mono-code text-red-400 font-bold">
                          ${uPrice}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Quantity Selector & Live Order Calculator (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-neutral-900/70 border border-red-900/40 rounded-2xl p-6 shadow-xl relative">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-red-500" />
                  Select Order Quantity
                </label>
                <span className="text-[10px] font-mono-code text-neutral-400">INSTANT TIER PRICING</span>
              </div>

              {/* Large Thumb-Friendly Quantity Buttons: 1, 10, 20, 50, 100, 500 */}
              <div className="grid grid-cols-3 gap-2.5" id="quantity-buttons-grid">
                {quantityOptions.map((qty) => {
                  const isSelected = selectedQuantity === qty;
                  return (
                    <button
                      key={qty}
                      onClick={() => setSelectedQuantity(qty)}
                      id={`qty-btn-${qty}`}
                      className={`py-3.5 px-2 rounded-xl text-center font-mono-code font-black text-sm uppercase transition-all duration-200 border ${
                        isSelected
                          ? 'bg-red-600 text-white border-red-500 shadow-[0_0_20px_rgba(229,9,20,0.6)] scale-[1.03]'
                          : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-red-600/50 hover:text-white'
                      }`}
                    >
                      <span className="block text-base">{qty}</span>
                      <span className="block text-[9px] font-normal tracking-wider opacity-80">
                        {qty === 1 ? 'Sample' : 'Units'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Calculated Pricing Summary Box */}
            <div className="p-4 rounded-xl bg-black/90 border border-neutral-800 space-y-3 font-mono-code">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>Selected Allocation:</span>
                <span className="text-white font-bold">{selectedQuantity} Units</span>
              </div>

              <div className="flex justify-between text-xs text-neutral-400">
                <span>Effective Unit Price:</span>
                <span className="text-emerald-400 font-bold">
                  ${currentPricing.unitPrice.toFixed(2)} / unit
                </span>
              </div>

              {currentPricing.savings > 0 && (
                <div className="flex justify-between text-xs text-red-400 bg-red-950/40 p-2 rounded border border-red-900/50">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    Tier Volume Savings:
                  </span>
                  <span className="font-black">-${currentPricing.savings.toFixed(0)} ({currentPricing.discountPercent}%)</span>
                </div>
              )}

              <div className="pt-3 border-t border-neutral-800 flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-wider text-neutral-300 font-bold font-display">
                  Total Estimate:
                </span>
                <span className="text-2xl font-black text-white">
                  ${currentPricing.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Spend Threshold Promotional Item Progress */}
            {spendPromotion.isActive && (
              <div
                className={`p-3 rounded-xl border text-xs transition-all ${
                  isSpendGiftUnlocked
                    ? 'bg-red-950/40 border-red-600/60 text-white shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                    : 'bg-black/60 border-neutral-800 text-neutral-400'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 font-bold">
                  <Gift className={`w-4 h-4 ${isSpendGiftUnlocked ? 'text-red-400 animate-bounce' : 'text-neutral-500'}`} />
                  <span>
                    {isSpendGiftUnlocked
                      ? 'FREE BONUS GIFT UNLOCKED!'
                      : `Spend $${spendPromotion.minSpendAmount} for Free Gift`}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-tight">
                  {isSpendGiftUnlocked
                    ? `Eligible for "${spendPromotion.freeItemName}" included at zero charge.`
                    : `Add $${Math.max(0, spendPromotion.minSpendAmount - currentPricing.totalPrice).toLocaleString()} more to qualify.`}
                </p>
              </div>
            )}
          </div>

          {/* Big Request Button */}
          <div className="mt-6 pt-4 border-t border-neutral-800">
            <button
              onClick={() => {
                onClose();
                openRequestModal(product, selectedQuantity);
              }}
              id="request-this-product-btn"
              className="w-full py-4 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(229,9,20,0.6)] hover:shadow-[0_0_35px_rgba(229,9,20,0.9)] flex items-center justify-center gap-2 group"
            >
              <span>REQUEST THIS PRODUCT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] text-center text-neutral-400 mt-2">
              No immediate card charge required • Invoice & dispatch details confirmed via email
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
