import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  User,
  Crown,
  FileText,
  Clock,
  CheckCircle,
  Package,
  Mail,
  LogOut,
  Shield,
  Tag,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'account' | 'orders' | 'requests' | 'vip';
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'account',
}) => {
  const {
    currentUser,
    loginUser,
    logoutUser,
    toggleVipMembership,
    requests,
    orders,
    trackCustomerOrder,
    vouchers,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'account' | 'orders' | 'requests' | 'vip'>(defaultTab);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');

  // Order Tracking State
  const [trackOrderNum, setTrackOrderNum] = useState('');
  const [trackEmail, setTrackEmail] = useState(currentUser.email || '');
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [isSearchingTrack, setIsSearchingTrack] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError(null);
    setTrackingResult(null);

    if (!trackOrderNum.trim() || !trackEmail.trim()) {
      setTrackError('Please enter both your Order Number and Email address.');
      return;
    }

    setIsSearchingTrack(true);
    const res = await trackCustomerOrder(trackOrderNum.trim(), trackEmail.trim());
    setIsSearchingTrack(false);

    if (res.success && res.order) {
      setTrackingResult(res.order);
    } else {
      setTrackError(res.error || 'No matching order found. Please verify your order number and email.');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    loginUser(loginEmail.trim(), loginName.trim() || 'Verified Wholesale Buyer');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-sky-950/60 text-sky-400 border-sky-800';
      case 'Contacted':
        return 'bg-amber-950/60 text-amber-400 border-amber-800';
      case 'Processing':
        return 'bg-purple-950/60 text-purple-400 border-purple-800';
      case 'Completed':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-800';
      case 'Cancelled':
      default:
        return 'bg-red-950/60 text-red-400 border-red-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        id="customer-account-modal"
        className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-white uppercase tracking-wider text-base">
              Customer Portal & Wholesale History
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800 bg-neutral-900/50 px-6">
          <button
            onClick={() => setActiveTab('account')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'account'
                ? 'border-red-600 text-red-500'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Account Profile
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-red-600 text-red-500'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Track Orders</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'requests'
                ? 'border-red-600 text-red-500'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <span>Inquiries</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-800 text-[10px] text-neutral-300">
              {requests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('vip')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'vip'
                ? 'border-yellow-500 text-yellow-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>VIP Tier</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {activeTab === 'account' && (
            <div>
              {currentUser.isLoggedIn ? (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono-code uppercase font-bold text-red-500 block">
                        AUTHENTICATED ACCOUNT
                      </span>
                      <h4 className="text-lg font-bold text-white mt-0.5">{currentUser.name}</h4>
                      <p className="text-xs text-neutral-400">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={logoutUser}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-300 border border-neutral-700"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                  {/* Claimed Vouchers on Account */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 font-mono-code">
                      Active Claimed Vouchers
                    </h5>
                    {currentUser.claimedVouchers.length === 0 ? (
                      <p className="text-xs text-neutral-500">
                        No active claimed promotional codes currently stored on this account.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {currentUser.claimedVouchers.map((code) => (
                          <div
                            key={code}
                            className="px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-800 text-red-400 font-mono-code font-bold text-xs flex items-center gap-2"
                          >
                            <Tag className="w-3.5 h-3.5" />
                            <span>{code}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-md mx-auto py-4">
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-bold text-white uppercase">Wholesale Buyer Access</h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Sign in or create your buyer identity to track pro-forma requests, claimed codes, and VIP allocation discounts.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1 font-mono-code">
                      Buyer Name / Company
                    </label>
                    <input
                      type="text"
                      required
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      placeholder="e.g. Apex Imports LLC"
                      className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1 font-mono-code">
                      Business Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="buyer@domain.com"
                      className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(229,9,20,0.5)]"
                  >
                    Enter Wholesale Portal
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Order Tracking Lookup Box */}
              <div className="p-5 bg-neutral-900/80 border border-neutral-800 rounded-2xl space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase font-mono-code">
                    Track Customer Wholesale Order
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Enter your assigned Order Number (e.g. RS-789123) and email address to check payment verification and shipping status.
                  </p>
                </div>

                <form onSubmit={handleTrackSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono-code font-bold uppercase text-neutral-400 block mb-1">
                        Order Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={trackOrderNum}
                        onChange={(e) => setTrackOrderNum(e.target.value)}
                        placeholder="RS-123456"
                        className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-xs text-white font-mono-code uppercase focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono-code font-bold uppercase text-neutral-400 block mb-1">
                        Customer Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={trackEmail}
                        onChange={(e) => setTrackEmail(e.target.value)}
                        placeholder="buyer@domain.com"
                        className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-xs text-white font-mono-code focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  {trackError && (
                    <p className="text-xs text-red-400 font-mono-code">{trackError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSearchingTrack}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider font-mono-code flex items-center gap-2 shadow-[0_0_15px_rgba(229,9,20,0.4)]"
                  >
                    <Package className="w-4 h-4" />
                    <span>{isSearchingTrack ? 'Locating...' : 'Lookup Order Status'}</span>
                  </button>
                </form>
              </div>

              {/* Order Status Display Result */}
              {trackingResult && (
                <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4 font-mono-code text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase block font-bold">Order Number</span>
                      <span className="text-base font-black text-white">{trackingResult.orderNumber}</span>
                    </div>

                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase inline-flex items-center gap-1.5 ${
                          trackingResult.status === 'AWAITING PAYMENT'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : trackingResult.status === 'PAYMENT CONFIRMED — PURCHASE NOW'
                            ? 'bg-red-600 text-white'
                            : trackingResult.status === 'SUPPLIER ORDER PLACED'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            : trackingResult.status === 'SHIPPED'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : trackingResult.status === 'DELIVERED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{trackingResult.status}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-300">
                    <div>
                      <span className="text-neutral-400 block text-[11px]">Product:</span>
                      <strong className="text-white">{trackingResult.productName}</strong> ({trackingResult.quantity} units)
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[11px]">Total:</span>
                      <strong className="text-white">${trackingResult.customerTotalPrice.toFixed(2)}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[11px]">Delivery Window:</span>
                      <span className="text-emerald-400 font-bold">{trackingResult.estimatedDeliveryWindow || '7–24 Business Days'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[11px]">Placed On:</span>
                      <span>{new Date(trackingResult.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {trackingResult.tracking && (
                    <div className="p-3.5 bg-purple-950/20 border border-purple-800/40 rounded-xl space-y-1">
                      <div className="text-purple-300 font-bold text-xs uppercase flex items-center gap-1.5">
                        <Package className="w-4 h-4" />
                        <span>Live Shipment Dispatch Information</span>
                      </div>
                      <p className="text-neutral-300 text-[11px]">
                        Carrier: <strong className="text-white">{trackingResult.tracking.carrier}</strong>
                      </p>
                      <p className="text-neutral-300 text-[11px]">
                        Tracking #: <code className="text-emerald-400 font-bold">{trackingResult.tracking.trackingNumber}</code>
                      </p>
                      {trackingResult.tracking.trackingUrl && (
                        <a
                          href={trackingResult.tracking.trackingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-1 text-red-400 hover:text-red-300 font-bold text-[11px] underline"
                        >
                          View Official Carrier Tracking Page →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono-code">
                  Logged Inquiries & Request History ({requests.length})
                </h4>
              </div>

              {requests.length === 0 ? (
                <div className="text-center py-12 bg-neutral-900/30 rounded-2xl border border-neutral-800">
                  <FileText className="w-10 h-10 text-neutral-700 mx-auto mb-2" />
                  <p className="text-xs text-neutral-400 font-bold uppercase">No Inquiries Submitted Yet</p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    When you submit a "Request This Product" inquiry, you can track response stages here.
                  </p>
                </div>
              ) : (
                requests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono-code font-black text-white text-sm">
                            #{req.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getStatusBadge(
                              req.status
                            )}`}
                          >
                            {req.status}
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-neutral-200 mt-1">{req.productName}</h5>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-mono-code font-black text-white">
                          ${req.totalPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-neutral-400 block font-mono-code">
                          {req.quantity} Units @ ${(req.unitPrice ?? 0).toFixed(2)}/u
                        </span>
                      </div>
                    </div>

                    {req.adminNotes && (
                      <div className="p-2.5 rounded-lg bg-black/60 border border-neutral-800 text-[11px] text-neutral-300">
                        <strong className="text-red-400 font-mono-code">Desk Notes: </strong>
                        {req.adminNotes}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-2 border-t border-neutral-900 font-mono-code">
                      <span>Destination: {req.shippingCountry}</span>
                      <span>Logged: {new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'vip' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-950/30 via-neutral-900 to-yellow-950/20 border border-yellow-500/40 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <h4 className="text-base font-black text-white uppercase">
                      VIP Wholesale Tier
                    </h4>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      currentUser.isVipMember
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/60'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                    }`}
                  >
                    {currentUser.isVipMember ? 'ACTIVE VIP STATUS' : 'STANDARD ACCESS'}
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  VIP members receive early notifications on limited container arrivals, priority factory floor scheduling, zero-fee sample requests, and 5% extra volume margin credits.
                </p>

                <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Monthly VIP Allocation Fee: $0 (Promotional)</span>
                  <button
                    onClick={toggleVipMembership}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                      currentUser.isVipMember
                        ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                        : 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                    }`}
                  >
                    {currentUser.isVipMember ? 'Pause VIP Tier' : 'Activate VIP Tier Free'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
