import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';
import {
  MessageSquarePlus,
  ThumbsUp,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Star,
  ShieldCheck,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';

export const CustomerFeedbackSection: React.FC = () => {
  const {
    customerSuggestions,
    addCustomerSuggestion,
    voteCustomerSuggestion,
    reviews,
    addReview,
    currentUser,
  } = useStore();

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Electronics');
  const [targetPrice, setTargetPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [customerName, setCustomerName] = useState(currentUser.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser.email || '');
  const [activeTab, setActiveTab] = useState<'suggestions' | 'reviews'>('suggestions');

  // Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewItem, setReviewItem] = useState('AirPods Max Space Gray (1:1 Master Batch)');
  const [reviewText, setReviewText] = useState('');
  const [reviewImage, setReviewImage] = useState('');

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;

    addCustomerSuggestion({
      productName: productName.trim(),
      category,
      targetPrice: targetPrice ? Number(targetPrice) : undefined,
      notes: notes.trim() || undefined,
      customerName: customerName.trim() || 'Anonymous Reseller',
      customerEmail: customerEmail.trim() || undefined,
    });

    setProductName('');
    setTargetPrice('');
    setNotes('');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;

    addReview({
      authorName: reviewName.trim(),
      verifiedBuyer: true,
      purchasedItem: reviewItem,
      rating: reviewRating,
      reviewText: reviewText.trim(),
      location: reviewLocation.trim() || 'United States',
      imageUrl: reviewImage.trim() || undefined,
      voucherClaimed: false,
    });

    setReviewName('');
    setReviewLocation('');
    setReviewText('');
    setReviewImage('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Added to Catalog':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Sourcing In Progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'Under Review':
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <section id="customer-feedback-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-900 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-red-600/20 text-red-500 border border-red-600/40">
              <MessageSquarePlus className="w-3 h-3" />
              Community & Sourcing Hub
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-display tracking-tight">
            Customer Feedback & <span className="text-red-600">Product Requests</span>
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Tell us what products you want us to source next. Upvote community requests to prioritize factory production.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'suggestions'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Product Sourcing ({customerSuggestions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Verified Reviews ({reviews.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'suggestions' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sourcing Suggestion Form */}
          <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase font-display">
                  Suggest a Product to Source
                </h3>
                <p className="text-xs text-neutral-400">
                  Our direct factory agents review new requests weekly.
                </p>
              </div>
            </div>

            <form onSubmit={handleSuggestionSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Product Name / Model *
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Dyson Supersonic Nural, Goyard Belvedere PM"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-600 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-600 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Audio">Audio</option>
                    <option value="Watches">Watches</option>
                    <option value="Designer Bags">Designer Bags</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Target Unit Price ($)
                  </label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="e.g. 45"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-600 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Notes / Quality Requirements
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specific colorways, packaging requirements, batch serials..."
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-600 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Name / Handle"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-600 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Email for Updates
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="reseller@example.com"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-600 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,30,39,0.4)] flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Product Proposal</span>
              </button>
            </form>
          </div>

          {/* Sourcing Wishlist & Upvoting List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Community Requested Items ({customerSuggestions.length})
              </span>
              <span className="text-[11px] text-neutral-500 font-mono-code">
                Click "I Want This" to vote
              </span>
            </div>

            <div className="space-y-3">
              {customerSuggestions.map((sug) => (
                <div
                  key={sug.id}
                  className="bg-neutral-950 border border-neutral-800 hover:border-red-600/40 rounded-2xl p-4 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                        {sug.productName}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${getStatusBadge(
                          sug.status
                        )}`}
                      >
                        {sug.status}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono-code">
                        {sug.category}
                      </span>
                    </div>

                    {sug.notes && (
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {sug.notes}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-mono-code pt-1">
                      <span>Suggested by {sug.customerName}</span>
                      {sug.targetPrice && (
                        <span>• Target: <strong className="text-white">${sug.targetPrice}</strong></span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => voteCustomerSuggestion(sug.id)}
                    className="shrink-0 self-start sm:self-center px-4 py-2 rounded-xl bg-neutral-900 hover:bg-red-600/20 text-neutral-200 hover:text-red-400 border border-neutral-800 hover:border-red-600/50 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-red-500" />
                    <span>I Want This ({sug.upvotes})</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Verified Reviews & Unboxing Incentive */
        <div className="space-y-8">
          {/* Review incentive banner */}
          <div className="bg-gradient-to-r from-red-950/40 via-neutral-950 to-neutral-950 border border-red-600/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-600/50 flex items-center justify-center text-red-500 shrink-0">
                <Star className="w-6 h-6 fill-red-500" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white uppercase font-display">
                  Post a Photo Review & Get a $10 Voucher Code
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                  Share your unboxing photos or batch impressions to automatically receive a instant $10 off discount code.
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <span className="inline-block px-3 py-1.5 rounded-xl bg-red-600 text-white font-mono-code font-black text-xs uppercase tracking-wider shadow-red-glow">
                PROMO CODE: REVIEW10
              </span>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-red-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-red-500" />
                      ))}
                    </div>
                    {rev.verifiedBuyer && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Order
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
                    "{rev.reviewText}"
                  </p>

                  {rev.imageUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden h-32 w-full bg-black border border-neutral-900">
                      <img
                        src={rev.imageUrl}
                        alt="Unboxing photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-400 font-mono-code">
                  <div>
                    <strong className="text-white block">{rev.authorName}</strong>
                    <span className="text-[11px] text-neutral-500">{rev.location}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 max-w-[140px] truncate text-right">
                    {rev.purchasedItem}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Review Mini Form */}
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white uppercase font-display mb-3">
              Leave Your Customer Review
            </h4>
            <form onSubmit={handleReviewSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="Your Name (e.g. Alex M.)"
                className="bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              />
              <input
                type="text"
                value={reviewLocation}
                onChange={(e) => setReviewLocation(e.target.value)}
                placeholder="Location (e.g. Los Angeles, CA)"
                className="bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              />
              <input
                type="text"
                value={reviewItem}
                onChange={(e) => setReviewItem(e.target.value)}
                placeholder="Product Purchased"
                className="bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              />
              <div className="md:col-span-3">
                <textarea
                  rows={2}
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Your review and feedback on the batch quality and shipping..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-600 resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="url"
                  value={reviewImage}
                  onChange={(e) => setReviewImage(e.target.value)}
                  placeholder="Optional unboxing image URL (e.g. https://...)"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <button
                type="submit"
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Submit Verified Review
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
