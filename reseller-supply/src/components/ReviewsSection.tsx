import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductReview } from '../types';
import {
  Star,
  ShieldCheck,
  Camera,
  Plus,
  X,
  MessageSquare,
  ThumbsUp,
  Award,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ReviewsSection: React.FC = () => {
  const { reviews, products, addReview } = useStore();
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  return (
    <section id="reviews-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-900">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 font-mono-code">
            AUTHENTIC BUYER VERIFICATION
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase font-display mt-1">
            CLIENT <span className="text-red-600">REVIEWS & UNBOXINGS</span>
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Real feedback from boutique retailers, secondary market distributors, and volume resellers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWriteModalOpen(true)}
            id="write-review-btn"
            className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(229,9,20,0.4)] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* Review Incentive Banner */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-red-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-700/60 flex items-center justify-center text-red-400 shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase">
              Photo Review Incentive Program
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              Submit an unboxing photo or macro material review to unlock an instant $15 account credit on your next wholesale manifest.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono-code font-bold text-red-400 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/40 shrink-0">
          +$15 CREDIT PROMO
        </span>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => {
          return <ReviewCard key={rev.id} review={rev} />;
        })}
      </div>

      {/* Write Review Modal */}
      {isWriteModalOpen && (
        <WriteReviewModal
          products={products}
          onClose={() => setIsWriteModalOpen(false)}
          onSubmit={addReview}
        />
      )}
    </section>
  );
};

const ReviewCard: React.FC<{ review: ProductReview }> = ({ review }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <div
      id={`review-card-${review.id}`}
      className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800/90 flex flex-col justify-between hover:border-neutral-700 transition-colors"
    >
      <div>
        {/* Rating & Verified Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-700'
                }`}
              />
            ))}
          </div>

          {review.isVerifiedPurchase && (
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/40">
              <ShieldCheck className="w-3 h-3" />
              Verified Buyer
            </span>
          )}
        </div>

        {/* Product Reference */}
        <span className="text-[11px] font-mono-code text-red-400 font-bold block mb-1">
          {review.productName}
        </span>

        {/* Title & Comment */}
        <h4 className="text-sm font-bold text-white mb-2">{review.title}</h4>
        <p className="text-xs text-neutral-300 leading-relaxed">{review.comment}</p>

        {/* Review Photos if any */}
        {review.photos && review.photos.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            {review.photos.map((photo, i) => (
              <div
                key={i}
                onClick={() => setSelectedPhoto(photo)}
                className="w-14 h-14 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden cursor-pointer hover:border-red-500 transition-colors p-1"
              >
                <img src={photo} alt="Customer Review Photo" className="w-full h-full object-cover rounded" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Author & Date */}
      <div className="mt-5 pt-3 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-400">
        <div>
          <span className="font-bold text-neutral-300 block">{review.userName}</span>
          <span className="text-[10px] text-neutral-400">{review.country}</span>
        </div>
        <span className="text-[10px] font-mono-code">{review.createdAt}</span>
      </div>

      {/* Enlarged Photo Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-xl max-h-[85vh] bg-neutral-950 border border-neutral-800 rounded-2xl p-2">
            <img src={selectedPhoto} alt="Review full photo" className="max-h-[80vh] w-auto rounded-xl object-contain" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/80 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const WriteReviewModal: React.FC<{
  products: any[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ products, onClose, onSubmit }) => {
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [userName, setUserName] = useState('');
  const [country, setCountry] = useState('United States');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;

    const prod = products.find((p) => p.id === productId);
    onSubmit({
      productId,
      productName: prod ? prod.name : 'VORTEX Product',
      userName: userName.trim(),
      country,
      rating,
      title: title.trim() || 'Exceptional Quality',
      comment: comment.trim(),
      photos: photoUrl.trim() ? [photoUrl.trim()] : undefined,
      isVerifiedPurchase: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-neutral-950 border border-neutral-800 p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-red-500" />
            <h3 className="font-bold text-white uppercase text-sm">Submit Client Review</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-400 uppercase font-mono-code mb-1">
              Select Product *
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-400 uppercase font-mono-code mb-1">
                Your Name / Business *
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Marcus T. / Apex Imports"
                className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-400 uppercase font-mono-code mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="USA, UK, Australia..."
                className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 uppercase font-mono-code mb-1">
              Overall Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  className="p-1 text-yellow-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${s <= rating ? 'fill-yellow-400' : 'text-neutral-700'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 uppercase font-mono-code mb-1">
              Review Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master level materials, flawless weight & finish"
              className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase font-mono-code mb-1">
              Detailed Experience *
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details on packaging, finish, customer turnover speed..."
              className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-neutral-400 uppercase font-mono-code mb-1">
              Photo URL (Optional - Qualifies for $15 Credit)
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 text-neutral-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(229,9,20,0.5)]"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
