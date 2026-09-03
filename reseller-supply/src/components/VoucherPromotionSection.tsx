import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Tag, Sparkles, Copy, Check, ShieldCheck, Gift, Clock, AlertTriangle } from 'lucide-react';

export const VoucherPromotionSection: React.FC = () => {
  const { vouchers, claimVoucherPromo, spendPromotion, showToast } = useStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeVouchers = vouchers.filter((v) => v.isActive);

  const handleClaim = (code: string) => {
    const res = claimVoucherPromo(code);
    if (res.success) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code);
      }
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 3000);
    } else {
      showToast('error', 'Daily Limit Reached', res.message);
    }
  };

  return (
    <section id="voucher-promotions-section" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Voucher System (Max 3/day enforcement) */}
        <div className="lg:col-span-7 rounded-2xl bg-neutral-950 border border-neutral-800 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-950/80 text-red-500 border border-red-800/60 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                DAILY VOUCHER ALLOCATION
              </span>
              <span className="text-[11px] text-neutral-400 font-mono-code">
                STRICT 3 VOUCHERS / DAY SYSTEM
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-display">
              RECEIVE <span className="text-red-600">$10 OFF</span> YOUR NEXT BULK ORDER
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
              To reward active wholesale buyers while preserving factory margin ceilings, our system releases only 3 automated $10 vouchers every 24 hours.
            </p>
          </div>

          {/* Vouchers List */}
          <div className="mt-6 space-y-4">
            {activeVouchers.map((v) => {
              const remainingToday = Math.max(0, v.maxPerDay - v.claimedTodayCount);
              const isClaimedToday = remainingToday <= 0;

              return (
                <div
                  key={v.code}
                  className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-black border border-red-600/30 flex items-center justify-center font-mono-code font-black text-red-500 text-lg shrink-0">
                      ${v.discountAmount}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono-code font-black text-white tracking-widest text-base">
                          {v.code}
                        </span>
                        <span className="text-[10px] font-bold text-neutral-400">
                          (Min Spend: ${v.minPurchaseAmount})
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">{v.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-[10px] font-mono-code uppercase text-neutral-400 block">
                        Today's Remaining:
                      </span>
                      <span
                        className={`text-xs font-mono-code font-bold ${
                          isClaimedToday ? 'text-red-500' : 'text-emerald-400'
                        }`}
                      >
                        {remainingToday} of {v.maxPerDay} left
                      </span>
                    </div>

                    <button
                      onClick={() => handleClaim(v.code)}
                      disabled={isClaimedToday}
                      id={`claim-voucher-${v.code}-btn`}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                        isClaimedToday
                          ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
                          : copiedCode === v.code
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(229,9,20,0.4)]'
                      }`}
                    >
                      {copiedCode === v.code ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Code Copied!</span>
                        </>
                      ) : isClaimedToday ? (
                        <span>Daily Limit Hit</span>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Claim & Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 cols: Spend Threshold Promotion ($500+ Gift) */}
        <div className="lg:col-span-5 rounded-2xl bg-neutral-950 border border-neutral-800 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-yellow-950/40 text-yellow-400 border border-yellow-500/30 mb-2">
              <Gift className="w-3 h-3" />
              TIER SPEND PROMOTION
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white uppercase font-display">
              SPEND <span className="text-red-600">${spendPromotion.minSpendAmount}+</span> & RECEIVE A FREE GIFT
            </h3>

            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Every wholesale request meeting or exceeding ${spendPromotion.minSpendAmount} automatically includes a complimentary factory inspection and master presentation kit.
            </p>
          </div>

          <div className="my-6 p-4 rounded-xl bg-black/70 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white uppercase">
                  {spendPromotion.freeItemName}
                </h5>
                <p className="text-[11px] text-neutral-400">
                  Value: ${spendPromotion.freeItemValue} • Automatically appended to manifest
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-400 font-mono-code">
            <span>Status: <strong className="text-emerald-400">Active</strong></span>
            <span>Threshold: ${spendPromotion.minSpendAmount} Total</span>
          </div>
        </div>
      </div>
    </section>
  );
};
