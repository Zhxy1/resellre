import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { WeeklyDealPack } from '../types';
import { Package, Sparkles, Bell, Lock, ArrowUpRight, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const WeeklyDealsSection: React.FC = () => {
  const { weeklyPacks, joinWeeklyPackWaitlist } = useStore();
  const [activePackForWaitlist, setActivePackForWaitlist] = useState<WeeklyDealPack | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState(false);

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePackForWaitlist) return;

    const res = joinWeeklyPackWaitlist(activePackForWaitlist.id, emailInput);
    if (res.success) {
      setSubmittedEmail(true);
      setTimeout(() => {
        setSubmittedEmail(false);
        setActivePackForWaitlist(null);
        setEmailInput('');
      }, 2000);
    }
  };

  return (
    <section id="weekly-deal-packs-section" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-neutral-900 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#F59E0B]" />
            <span className="text-xs font-black uppercase tracking-widest text-amber-500 font-mono-code">
              UPCOMING WHOLESALE INITIATIVE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-display mt-1">
            WEEKLY DEAL <span className="text-red-600">PACKS</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Pre-assembled multi-item wholesale bundles engineered for high-margin reselling. Currently in final testing phase.
          </p>
        </div>

        {/* Coming Soon Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-400 text-xs font-black uppercase tracking-wider shadow-lg self-start md:self-auto">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>COMING SOON • PACKS IN DEVELOPMENT</span>
        </div>
      </div>

      {/* Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(weeklyPacks || []).map((pack) => {
          const productList = pack.productNames || [];
          const discountPct = pack.projectedDiscountPercent || 15;
          const totalUnits = (pack.targetQuantityPerSku || 10) * Math.max(1, productList.length);

          return (
            <div
              key={pack.id}
              id={`weekly-pack-card-${pack.id}`}
              className="relative rounded-3xl bg-neutral-950 border border-neutral-900 hover:border-amber-500/50 p-6 flex flex-col justify-between transition-all duration-300 shadow-[0_0_25px_rgba(0,0,0,0.7)] group overflow-hidden"
            >
              {/* Ambient gold glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />

              <div>
                {/* Badge row */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-950/70 border border-amber-500/40 text-amber-400 text-[11px] font-black uppercase font-mono-code">
                    <Package className="w-3.5 h-3.5" />
                    {pack.categoryTag || 'WHOLESALE PACK'}
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-800">
                    {totalUnits} TOTAL UNITS
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-black text-white uppercase font-display tracking-tight group-hover:text-amber-400 transition-colors">
                  {pack.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {pack.description}
                </p>

                {/* Pack Items Preview */}
                <div className="mt-5 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block tracking-wider font-mono-code">
                    PLANNED BUNDLE COMPOSITION:
                  </span>
                  <div className="space-y-1.5">
                    {productList.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs text-neutral-300 bg-black/60 px-3 py-2 rounded-lg border border-neutral-900"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-medium truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Target Discount & Action */}
              <div className="mt-6 pt-5 border-t border-neutral-900">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-500 block font-mono-code">
                      TARGET SAVINGS
                    </span>
                    <span className="text-sm font-black text-emerald-400 font-mono-code">
                      {discountPct}% BUNDLE DISCOUNT
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-amber-500 block font-mono-code">
                      STATUS
                    </span>
                    <span className="text-xs font-bold text-neutral-300">
                      {pack.status || 'Coming Soon'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActivePackForWaitlist(pack)}
                  id={`join-waitlist-pack-${pack.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-amber-950/60 border border-neutral-800 hover:border-amber-500/60 text-neutral-300 hover:text-amber-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400 group-hover/btn:scale-110 transition-transform" />
                  <span>Notify Me When Ready</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Waitlist Modal */}
      {activePackForWaitlist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-neutral-950 border border-amber-500/40 rounded-2xl max-w-md w-full p-6 relative shadow-[0_0_40px_rgba(245,158,11,0.2)]"
          >
            <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs font-black uppercase font-mono-code">
              <Bell className="w-4 h-4" />
              WEEKLY PACK PRIORITY ALLOCATION
            </div>

            <h3 className="text-xl font-black text-white uppercase font-display">
              {activePackForWaitlist.name}
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Weekly deal packs will launch once pack compositions are finalized. Enter your email to receive early batch access.
            </p>

            {submittedEmail ? (
              <div className="mt-5 p-4 rounded-xl bg-amber-950/50 border border-amber-500/50 text-center">
                <CheckCircle2 className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white uppercase">You're On The VIP Waitlist!</h4>
                <p className="text-xs text-neutral-400 mt-1">
                  We will send priority allocation codes as soon as this pack is activated.
                </p>
              </div>
            ) : (
              <form onSubmit={handleJoinWaitlist} className="mt-5 space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1.5 font-mono-code">
                    Your Business / Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vendor@enterprise.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePackForWaitlist(null)}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold uppercase text-neutral-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-black uppercase text-black tracking-wider transition-colors"
                  >
                    Confirm Alert
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
};
