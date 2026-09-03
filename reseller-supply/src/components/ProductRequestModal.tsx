import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  CheckCircle2,
  Send,
  Mail,
  User,
  Phone,
  Globe,
  Tag,
  MapPin,
  Building,
  Layers,
  Truck,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductRequestModal: React.FC<{ initialQuantity?: number }> = ({
  initialQuantity = 10,
}) => {
  const {
    isRequestModalOpen,
    closeRequestModal,
    selectedProduct,
    submitCustomerOrder,
    validateVoucher,
    currentUser,
    adminConfig,
    spendPromotion,
    showToast,
  } = useStore();

  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [apartmentOrSuite, setApartmentOrSuite] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [shippingOption, setShippingOption] = useState<'Standard Free (7-24 Days)' | 'Expedited Air (3-5 Days)'>('Standard Free (7-24 Days)');
  const [notes, setNotes] = useState('');
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submittedOrder, setSubmittedOrder] = useState<{
    orderNumber: string;
    status: string;
    total: number;
    deliveryWindow: string;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (currentUser.name) setName(currentUser.name);
    if (currentUser.email) setEmail(currentUser.email);
  }, [currentUser]);

  useEffect(() => {
    if (selectedProduct && selectedProduct.variants && selectedProduct.variants.length > 0) {
      setSelectedVariant(selectedProduct.variants[0]);
    } else {
      setSelectedVariant('');
    }
  }, [selectedProduct]);

  if (!isRequestModalOpen || !selectedProduct) return null;

  // Calculate pricing
  const calculateTierPrice = (qty: number) => {
    if (selectedProduct.wholesaleTiers && selectedProduct.wholesaleTiers[qty]) {
      const total = selectedProduct.wholesaleTiers[qty];
      return { unit: total / qty, total };
    }
    const basePrice = selectedProduct.baseUnitPrice ?? 0;
    const total = basePrice * qty;
    return { unit: basePrice, total };
  };

  const { unit: currentUnitPrice, total: subtotal } = calculateTierPrice(quantity);
  const voucherDiscount = appliedVoucher ? appliedVoucher.discount : 0;
  const shippingCost = shippingOption.includes('Expedited') ? 15 : 0;
  const finalTotal = Math.max(0, subtotal - voucherDiscount + shippingCost);

  const isSpendGiftQualified =
    spendPromotion.isActive && finalTotal >= spendPromotion.minSpendAmount;

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError(null);

    if (!voucherInput.trim()) return;

    const result = validateVoucher(voucherInput, subtotal);
    if (result.valid) {
      setAppliedVoucher({ code: voucherInput.trim().toUpperCase(), discount: result.discount });
      showToast('success', 'Voucher Applied', `Promo code applied: $${result.discount} deducted.`);
    } else {
      setAppliedVoucher(null);
      setVoucherError(result.reason || 'Invalid voucher code.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      showToast('error', 'Required Fields', 'Please provide your full contact name and email address.');
      return;
    }

    if (!street.trim() || !city.trim() || !country.trim()) {
      showToast('error', 'Shipping Address', 'Please provide your street address, city, and country.');
      return;
    }

    setIsSubmitting(true);

    const res = await submitCustomerOrder({
      customerName: name.trim(),
      customerEmail: email.trim(),
      customerPhone: phone.trim() || undefined,
      shippingAddress: {
        street: street.trim(),
        apartmentOrSuite: apartmentOrSuite.trim() || undefined,
        city: city.trim(),
        state: state.trim() || undefined,
        postalCode: postalCode.trim() || undefined,
        country: country.trim(),
      },
      productId: selectedProduct.id,
      variant: selectedVariant || undefined,
      quantity,
      voucherCode: appliedVoucher ? appliedVoucher.code : undefined,
      voucherDiscount: appliedVoucher ? appliedVoucher.discount : undefined,
      customerNotes: notes.trim() || undefined,
      shippingOption,
    });

    setIsSubmitting(false);

    if (res.success && res.orderNumber) {
      setSubmittedOrder({
        orderNumber: res.orderNumber,
        status: 'AWAITING PAYMENT',
        total: finalTotal,
        deliveryWindow: res.order?.estimatedDeliveryWindow || '7–24 Business Days',
      });
    }
  };

  const handleCopyOrderNumber = () => {
    if (submittedOrder && navigator.clipboard) {
      navigator.clipboard.writeText(submittedOrder.orderNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      showToast('info', 'Copied', 'Order number copied to clipboard.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          id="product-order-request-modal"
          className="relative w-full max-w-2xl rounded-3xl bg-neutral-950 border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_25px_rgba(229,9,20,0.3)] overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950 z-10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
              <h3 className="font-display text-lg font-black uppercase text-white tracking-wide">
                {submittedOrder ? 'WHOLESALE ORDER REQUEST PLACED' : 'OFFICIAL WHOLESALE ORDER REQUEST'}
              </h3>
            </div>
            <button
              onClick={() => {
                setSubmittedOrder(null);
                closeRequestModal();
              }}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {submittedOrder ? (
              /* Success / Awaiting Payment Screen */
              <div className="flex flex-col items-center text-center py-6 space-y-6">
                <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-600 flex items-center justify-center red-glow">
                  <CheckCircle2 className="w-8 h-8 text-red-500" />
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono-code font-bold uppercase mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    STATUS: AWAITING PAYMENT
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-display mt-1">
                    Your Wholesale Order Has Been Registered
                  </h2>
                  <p className="text-xs text-neutral-300 mt-2 max-w-md mx-auto leading-relaxed">
                    We have created order <strong className="text-white">#{submittedOrder.orderNumber}</strong>. Payment verification instructions will be dispatched to your email.
                  </p>
                </div>

                {/* Reference Code Box */}
                <div className="w-full max-w-md bg-neutral-900/90 border border-neutral-800 p-4 rounded-2xl flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                      Assigned Order Number
                    </span>
                    <span className="text-xl font-mono-code font-black text-white">
                      {submittedOrder.orderNumber}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyOrderNumber}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 border border-neutral-700"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Summary Card */}
                <div className="w-full max-w-md bg-black/60 border border-neutral-900 p-4 rounded-xl text-left space-y-2 font-mono-code text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Product:</span>
                    <span className="text-white font-bold">{selectedProduct.name}</span>
                  </div>
                  {selectedVariant && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Variant:</span>
                      <span className="text-white font-bold">{selectedVariant}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Quantity:</span>
                    <span className="text-white font-bold">{quantity} Units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Est. Delivery Window:</span>
                    <span className="text-emerald-400 font-bold">{submittedOrder.deliveryWindow}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Shipping Address:</span>
                    <span className="text-neutral-300 font-bold">{street}, {city}, {country}</span>
                  </div>
                  {appliedVoucher && (
                    <div className="flex justify-between text-red-400">
                      <span>Voucher ({appliedVoucher.code}):</span>
                      <span>-${appliedVoucher.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-neutral-800 font-bold text-sm">
                    <span className="text-neutral-300">Total Pro-Forma:</span>
                    <span className="text-red-500">${submittedOrder.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Notice Box */}
                <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-2xl text-xs text-neutral-300 text-left w-full max-w-md space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase font-mono-code">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Next Steps: Payment Verification</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    Official payment details (Cash App cashtag and Venmo handle) will be dispatched to <strong className="text-white">{email}</strong>. Once payment is confirmed by our administrators, your supplier batch order will be placed immediately!
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSubmittedOrder(null);
                    closeRequestModal();
                  }}
                  className="w-full max-w-md py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(229,9,20,0.5)]"
                >
                  Return to Storefront
                </button>
              </div>
            ) : (
              /* Order Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Summary */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                  <div className="w-16 h-16 rounded-xl bg-black border border-neutral-800 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-red-500">
                      {selectedProduct.category}
                    </span>
                    <h4 className="text-sm font-bold text-white line-clamp-1">
                      {selectedProduct.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-xs font-mono-code">
                      <span className="text-neutral-400">Unit: ${currentUnitPrice.toFixed(2)}/u</span>
                      <span className="text-neutral-400">•</span>
                      <span className="text-white font-bold">${subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Variant Selector (if available) */}
                {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block mb-2 font-mono-code flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-red-500" />
                      Product Variant / Colorway
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.variants.map((v) => (
                        <button
                          type="button"
                          key={v}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold transition-all border ${
                            selectedVariant === v
                              ? 'bg-red-600 text-white border-red-500 shadow-[0_0_12px_rgba(229,9,20,0.5)]'
                              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Tier Selector */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block mb-2 font-mono-code">
                    Quantity Tier Selection
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {[1, 10, 20, 50, 100, 500].map((qty) => (
                      <button
                        type="button"
                        key={qty}
                        onClick={() => setQuantity(qty)}
                        className={`py-2 rounded-xl text-xs font-mono-code font-bold transition-all border ${
                          quantity === qty
                            ? 'bg-red-600 text-white border-red-500 shadow-[0_0_12px_rgba(229,9,20,0.5)]'
                            : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                        }`}
                      >
                        {qty}u
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-3 font-mono-code flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-red-500" />
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Marcus Turner"
                        className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="buyer@domain.com"
                        className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Complete Shipping Address */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-3 font-mono-code flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    Delivery Address
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="742 Evergreen Terrace"
                        className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                          Apartment / Suite / Unit (Optional)
                        </label>
                        <input
                          type="text"
                          value={apartmentOrSuite}
                          onChange={(e) => setApartmentOrSuite(e.target.value)}
                          placeholder="Apt 4B or Suite 200"
                          className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Austin"
                          className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                          State / Province
                        </label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="TX"
                          className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                          ZIP / Postal Code
                        </label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="78701"
                          className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                          Country *
                        </label>
                        <input
                          type="text"
                          required
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="United States"
                          className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Method Option */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block mb-2 font-mono-code flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-red-500" />
                    Delivery Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setShippingOption('Standard Free (7-24 Days)')}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        shippingOption.includes('Standard')
                          ? 'bg-red-950/30 border-red-600 text-white'
                          : 'bg-neutral-900/60 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-white">Standard Delivery</span>
                        <span className="text-xs font-mono-code text-emerald-400 font-bold">FREE</span>
                      </div>
                      <span className="text-[11px] text-neutral-400 block font-mono-code">7–24 Business Days</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShippingOption('Expedited Air (3-5 Days)')}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        shippingOption.includes('Expedited')
                          ? 'bg-red-950/30 border-red-600 text-white'
                          : 'bg-neutral-900/60 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-white">Priority Air Express</span>
                        <span className="text-xs font-mono-code text-white font-bold">+$15.00</span>
                      </div>
                      <span className="text-[11px] text-neutral-400 block font-mono-code">3–5 Business Days</span>
                    </button>
                  </div>
                </div>

                {/* Special Packaging / Notes */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1 font-mono-code">
                    Special Packaging or Order Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Include matching accessories, custom box packing..."
                    className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 resize-none"
                  />
                </div>

                {/* Promo Code Input */}
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-red-500" />
                    <input
                      type="text"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value)}
                      placeholder="Enter promo code (e.g. SAVE10)"
                      className="flex-1 bg-transparent text-xs text-white placeholder-neutral-500 uppercase font-mono-code focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyVoucher}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white border border-neutral-700"
                    >
                      Apply
                    </button>
                  </div>
                  {voucherError && (
                    <p className="text-[11px] text-red-400 mt-1.5">{voucherError}</p>
                  )}
                  {appliedVoucher && (
                    <p className="text-[11px] text-emerald-400 mt-1.5 font-bold">
                      ✓ Promo {appliedVoucher.code} active: -${appliedVoucher.discount} deducted.
                    </p>
                  )}
                </div>

                {/* Summary & Submit Button */}
                <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono-code">
                      Calculated Order Total
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white font-mono-code">
                        ${finalTotal.toLocaleString()}
                      </span>
                      {voucherDiscount > 0 && (
                        <span className="text-xs text-red-500 font-mono-code">
                          (-${voucherDiscount} voucher applied)
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="submit-order-request-btn"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(229,9,20,0.6)] flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Processing...' : 'Submit Order Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
