import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Crown, Send, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

export const NewsletterVipSection: React.FC = () => {
  const { subscribeEmail, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const res = subscribeEmail(email.trim(), ['VIP Waitlist', 'Wholesale Drops']);
    if (res.success) {
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section id="newsletter-vip-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl bg-neutral-950 border border-neutral-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-yellow-950/40 text-yellow-400 border border-yellow-500/30 font-mono-code">
            <Crown className="w-3.5 h-3.5" />
            VIP WHOLESALE DISPATCH
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase font-display tracking-tight">
            GET EARLY ACCESS TO <span className="text-red-600">FACTORY RESTOCKS</span> & DAILY DEALS
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Join over 1,400+ authorized boutique buyers and wholesale operators receiving priority container arrival manifests, exclusive flash voucher codes, and bulk allocation drops.
          </p>

          {isSubmitted ? (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 flex items-center justify-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5" />
              <span>You're subscribed! Use promo code "VIPDROP10" for $10 off your first container request.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter business email..."
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 font-sans"
                />
              </div>
              <button
                type="submit"
                id="newsletter-subscribe-btn"
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(229,9,20,0.5)] flex items-center justify-center gap-2 shrink-0"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-neutral-400 font-mono-code">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Zero Spam Policy
            </span>
            <span>•</span>
            <span>1-Click Unsubscribe</span>
            <span>•</span>
            <span>Direct WhatsApp Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};
