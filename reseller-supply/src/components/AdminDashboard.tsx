import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductCategory, DailyDeal, LimitedBulkDeal, Voucher, RequestStatus } from '../types';
import {
  ShieldCheck,
  Package,
  Flame,
  FileText,
  Mail,
  Tag,
  Settings,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  TrendingUp,
  Clock,
  Layers,
  Save,
  Send,
  Sliders,
  DollarSign,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const {
    products,
    categories,
    dailyDeal,
    dailyDeals,
    rotateDailyDeals,
    limitedBulkDeals,
    requests,
    vouchers,
    subscribers,
    campaigns,
    adminConfig,
    addProduct,
    updateProduct,
    deleteProduct,
    updateTop5Rank,
    updateDailyDeal,
    addLimitedBulkDeal,
    updateLimitedBulkDeal,
    deleteLimitedBulkDeal,
    updateRequestStatus,
    deleteRequest,
    addVoucher,
    updateVoucher,
    sendCampaign,
    updateAdminConfig,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'top5' | 'dailyDeal' | 'bulkDeals' | 'requests' | 'marketing' | 'vouchers' | 'settings'
  >('overview');

  // Editing state for products
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // New product form state
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Electronics' as ProductCategory,
    subCategory: '',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    description: '',
    shortExplanation: '',
    potentialValue: '',
    qualityGrade: '1:1 Master Clone Edition',
    baseUnitPrice: 85,
    stockStatus: 'In Stock' as 'In Stock' | 'Limited Stock' | 'Pre-Order',
    unitsAvailable: 250,
    tier10: 550,
    tier20: 1000,
    tier50: 2250,
    tier100: 4000,
    tier500: 17500,
  });

  // Daily Deal form state
  const [dailyDealForm, setDailyDealForm] = useState({
    productId: dailyDeal.productId,
    discountPercent: dailyDeal.discountPercent,
    customHeadline: dailyDeal.customHeadline || '',
    isActive: dailyDeal.isActive,
    endsAt: dailyDeal.endsAt,
  });

  // Email Campaign form state
  const [campaignForm, setCampaignForm] = useState({
    subject: '[VORTEX DROPS] New Master Edition Inventory Allocation Just Arrived',
    type: 'New Products' as 'New Products' | 'Daily Deals' | 'Weekly Deals' | 'Coupon Codes' | 'Limited Offers',
    previewText: 'Exclusive wholesale allocation ready for freight dispatch.',
    content: 'Dear Wholesale Partner,\n\nA new 1:1 master batch has completed factory optical inspection. Check real-time volume tiers and lock in allocation before container depletion.\n\nUse promo code "VIPDROP10" for $10 off your pro-forma request.\n\nBest Regards,\nVORTEX Supply Desk',
  });

  // Admin Config form
  const [notificationEmail, setNotificationEmail] = useState(adminConfig.adminNotificationEmail);
  const [bannerNotice, setBannerNotice] = useState(adminConfig.bannerNotice);
  const [showBannerNotice, setShowBannerNotice] = useState(adminConfig.showBannerNotice);

  if (!isOpen) return null;

  const handleSaveDailyDeal = (e: React.FormEvent) => {
    e.preventDefault();
    updateDailyDeal({
      productId: dailyDealForm.productId,
      discountPercent: Number(dailyDealForm.discountPercent),
      customHeadline: dailyDealForm.customHeadline,
      isActive: dailyDealForm.isActive,
      endsAt: dailyDealForm.endsAt,
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminConfig({
      adminNotificationEmail: notificationEmail.trim(),
      bannerNotice: bannerNotice.trim(),
      showBannerNotice,
    });
  };

  const handleSendCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.subject.trim() || !campaignForm.content.trim()) return;

    sendCampaign({
      subject: campaignForm.subject.trim(),
      type: campaignForm.type,
      previewText: campaignForm.previewText.trim(),
      content: campaignForm.content.trim(),
    });
  };

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    addProduct({
      name: productForm.name.trim(),
      category: productForm.category,
      subCategory: productForm.subCategory.trim() || undefined,
      image: productForm.image.trim(),
      description: productForm.description.trim(),
      shortExplanation: productForm.shortExplanation.trim() || 'Popular for volume reseller margins.',
      potentialValue: productForm.potentialValue.trim() || 'Reliable turnover with premium build quality.',
      qualityGrade: productForm.qualityGrade,
      baseUnitPrice: Number(productForm.baseUnitPrice),
      stockStatus: productForm.stockStatus,
      unitsAvailable: Number(productForm.unitsAvailable),
      wholesaleTiers: {
        10: Number(productForm.tier10),
        20: Number(productForm.tier20),
        50: Number(productForm.tier50),
        100: Number(productForm.tier100),
        500: Number(productForm.tier500),
      },
    });

    setIsAddingProduct(false);
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      category: editingProduct.category,
      description: editingProduct.description,
      shortExplanation: editingProduct.shortExplanation,
      potentialValue: editingProduct.potentialValue,
      baseUnitPrice: Number(editingProduct.baseUnitPrice),
      stockStatus: editingProduct.stockStatus,
      unitsAvailable: Number(editingProduct.unitsAvailable),
      wholesaleTiers: editingProduct.wholesaleTiers,
    });

    setEditingProduct(null);
  };

  // Pipeline metrics
  const totalPipelineRevenue = requests.reduce((sum, r) => sum + r.totalPrice, 0);
  const pendingRequests = requests.filter((r) => r.status === 'New');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        id="admin-dashboard-modal"
        className="relative w-full max-w-6xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-500 border border-red-600/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight">
                VORTEX <span className="text-red-600">COMMAND PORTAL</span>
              </h2>
              <p className="text-[10px] text-neutral-400 font-mono-code -mt-0.5">
                SECURE WHOLESALE & INVENTORY CONTROL DESK
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-900/40 px-6 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'requests', label: `Inquiries (${requests.length})`, icon: FileText },
            { id: 'products', label: `Catalog (${products.length})`, icon: Package },
            { id: 'top5', label: 'Top 5 Rankings', icon: Layers },
            { id: 'dailyDeal', label: 'Daily Deal (5-10%)', icon: Flame },
            { id: 'bulkDeals', label: 'Flash Bulk Offers', icon: Clock },
            { id: 'marketing', label: `Email Blasts (${subscribers.length})`, icon: Mail },
            { id: 'vouchers', label: 'Voucher Rules (Max 3/Day)', icon: Tag },
            { id: 'settings', label: 'System Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-3.5 text-xs font-bold uppercase tracking-wider border-b-2 shrink-0 transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'border-red-600 text-red-500 bg-red-950/20'
                    : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-neutral-950">
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono-code">
                    Active Pipeline Volume
                  </span>
                  <div className="text-2xl font-black text-white font-mono-code mt-1">
                    ${totalPipelineRevenue.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-emerald-400 mt-1 block">
                    {requests.length} submitted wholesale inquiries
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono-code">
                    Pending Action Inquiries
                  </span>
                  <div className="text-2xl font-black text-red-500 font-mono-code mt-1">
                    {pendingRequests.length} New
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    Awaiting pro-forma dispatch
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono-code">
                    Email Subscribers
                  </span>
                  <div className="text-2xl font-black text-white font-mono-code mt-1">
                    {subscribers.length} VIP Buyers
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    Opted-in for container arrival drops
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono-code">
                    Catalog Inventory SKUs
                  </span>
                  <div className="text-2xl font-black text-white font-mono-code mt-1">
                    {products.length} Products
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    All tiers with live calculator
                  </span>
                </div>
              </div>

              {/* Quick Actions & Recent Requests */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Inquiries */}
                <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <h3 className="font-bold text-sm text-white uppercase">Latest Customer Requests</h3>
                    <button
                      onClick={() => setActiveTab('requests')}
                      className="text-xs text-red-500 font-bold hover:underline"
                    >
                      View All ({requests.length})
                    </button>
                  </div>

                  {requests.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-xl bg-black/60 border border-neutral-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono-code font-bold text-white">#{r.id}</span>
                          <span className="text-neutral-300 font-medium">{r.customerName}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400">{r.productName} ({r.quantity}u)</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono-code font-bold text-white block">
                          ${r.totalPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-red-400 uppercase font-bold">
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Daily Deal Preview */}
                <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-red-500" />
                      <h3 className="font-bold text-sm text-white uppercase">Active Daily Deal Status</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('dailyDeal')}
                      className="text-xs text-red-500 font-bold hover:underline"
                    >
                      Configure Deal
                    </button>
                  </div>

                  {dailyDeal.isActive ? (
                    <div className="p-4 rounded-xl bg-black/60 border border-red-900/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          {products.find((p) => p.id === dailyDeal.productId)?.name || 'AirPods Max'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-red-600 text-black text-xs font-black">
                          {dailyDeal.discountPercent}% OFF
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400">
                        {dailyDeal.customHeadline || "Today's volume promotional allocation."}
                      </p>
                      <div className="text-[11px] text-neutral-400 font-mono-code pt-1">
                        Expires: {dailyDeal.endsAt}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400">Daily Deal currently paused.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT REQUESTS & ORDER INQUIRIES */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase">
                    Wholesale Inquiries Management ({requests.length})
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Incoming pro-forma requests routed to {adminConfig.adminNotificationEmail}.
                  </p>
                </div>
              </div>

              {requests.length === 0 ? (
                <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800">
                  <FileText className="w-12 h-12 text-neutral-700 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white uppercase">No Inquiries Found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-mono-code font-black text-white text-base">
                              #{req.id}
                            </span>
                            <span className="text-xs text-neutral-400 font-mono-code">
                              {new Date(req.createdAt).toLocaleString()}
                            </span>
                          </div>

                          <div className="text-sm font-bold text-white">
                            {req.customerName} • <span className="text-red-400 font-normal">{req.customerEmail}</span>
                          </div>

                          {req.customerPhone && (
                            <div className="text-xs text-neutral-400">Phone: {req.customerPhone}</div>
                          )}
                          <div className="text-xs text-neutral-400">Destination: {req.shippingCountry}</div>
                        </div>

                        <div className="text-left md:text-right space-y-1">
                          <span className="text-xl font-mono-code font-black text-white block">
                            ${req.totalPrice.toLocaleString()}
                          </span>
                          <span className="text-xs text-neutral-400 font-mono-code block">
                            {req.quantity} Units @ ${(req.unitPrice ?? 0).toFixed(2)}/u
                          </span>
                          {req.voucherCodeUsed && (
                            <span className="text-[11px] text-red-400 font-mono-code block">
                              Voucher: {req.voucherCodeUsed} (-${req.voucherDiscount})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Product details */}
                      <div className="p-3 rounded-xl bg-black/60 border border-neutral-800 flex items-center justify-between text-xs">
                        <span className="text-neutral-300 font-semibold">{req.productName}</span>
                        <span className="font-mono-code text-neutral-400">PID: {req.productId}</span>
                      </div>

                      {req.customerMessage && (
                        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300">
                          <strong className="text-neutral-400 font-mono-code block mb-1">Customer Note:</strong>
                          {req.customerMessage}
                        </div>
                      )}

                      {/* Status Update Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono-code text-neutral-400 uppercase font-bold">
                            Stage:
                          </span>
                          {(['New', 'Contacted', 'Processing', 'Completed', 'Cancelled'] as RequestStatus[]).map(
                            (st) => (
                              <button
                                key={st}
                                onClick={() => updateRequestStatus(req.id, st)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                  req.status === st
                                    ? 'bg-red-600 text-white'
                                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                                }`}
                              >
                                {st}
                              </button>
                            )
                          )}
                        </div>

                        <button
                          onClick={() => deleteRequest(req.id)}
                          className="text-neutral-500 hover:text-red-500 text-xs p-1"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCT CATALOG CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase">Product Catalog Management</h3>
                  <p className="text-xs text-neutral-400">Add, edit, delete, and adjust wholesale pricing tiers.</p>
                </div>

                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Add Product Modal / Drawer */}
              {isAddingProduct && (
                <form
                  onSubmit={handleCreateProductSubmit}
                  className="p-6 rounded-2xl bg-neutral-900 border border-red-600/50 space-y-4 text-xs"
                >
                  <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                    <h4 className="text-sm font-bold text-white uppercase">Add New Inventory Item</h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="text-neutral-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-400 uppercase font-mono-code mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 uppercase font-mono-code mb-1">
                        Category *
                      </label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                      >
                        {categories
                          .filter((c) => c !== 'All' && c !== 'Top Sellers' && c !== 'Daily Deals')
                          .map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-400 uppercase font-mono-code mb-1">
                        Image URL (High-Res Unsplash/Direct) *
                      </label>
                      <input
                        type="url"
                        required
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 uppercase font-mono-code mb-1">
                        Sample Unit Price ($)
                      </label>
                      <input
                        type="number"
                        value={productForm.baseUnitPrice}
                        onChange={(e) =>
                          setProductForm({ ...productForm, baseUnitPrice: Number(e.target.value) })
                        }
                        className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                      />
                    </div>
                  </div>

                  {/* Pricing Tiers Inputs */}
                  <div className="pt-2">
                    <label className="block text-neutral-300 font-bold uppercase font-mono-code mb-2">
                      Wholesale Batch Pricing Matrix ($ Total for batch)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      <div>
                        <span className="text-[10px] text-neutral-400">10-Unit Total:</span>
                        <input
                          type="number"
                          value={productForm.tier10}
                          onChange={(e) => setProductForm({ ...productForm, tier10: Number(e.target.value) })}
                          className="w-full p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400">20-Unit Total:</span>
                        <input
                          type="number"
                          value={productForm.tier20}
                          onChange={(e) => setProductForm({ ...productForm, tier20: Number(e.target.value) })}
                          className="w-full p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400">50-Unit Total:</span>
                        <input
                          type="number"
                          value={productForm.tier50}
                          onChange={(e) => setProductForm({ ...productForm, tier50: Number(e.target.value) })}
                          className="w-full p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400">100-Unit Total:</span>
                        <input
                          type="number"
                          value={productForm.tier100}
                          onChange={(e) => setProductForm({ ...productForm, tier100: Number(e.target.value) })}
                          className="w-full p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400">500-Unit Total:</span>
                        <input
                          type="number"
                          value={productForm.tier500}
                          onChange={(e) => setProductForm({ ...productForm, tier500: Number(e.target.value) })}
                          className="w-full p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 uppercase font-mono-code mb-1">
                      Full Description & Specifications
                    </label>
                    <textarea
                      rows={2}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Optical grade details, materials, mechanism..."
                      className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold uppercase"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              )}

              {/* Product List Table */}
              <div className="rounded-2xl border border-neutral-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-900 text-neutral-400 uppercase font-mono-code text-[10px]">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Sample Price</th>
                      <th className="p-3">10u Tier</th>
                      <th className="p-3">Rank</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 bg-neutral-950">
                    {products.map((p) => {
                      const tier10 = p.wholesaleTiers[10] ? `$${p.wholesaleTiers[10]}` : 'N/A';
                      return (
                        <tr key={p.id} className="hover:bg-neutral-900/50">
                          <td className="p-3 flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-contain bg-black" />
                            <span className="font-bold text-white">{p.name}</span>
                          </td>
                          <td className="p-3 text-neutral-400">{p.category}</td>
                          <td className="p-3 font-mono-code text-neutral-300">${p.baseUnitPrice}</td>
                          <td className="p-3 font-mono-code text-red-400">{tier10}</td>
                          <td className="p-3 font-mono-code">{p.rank ? `#${p.rank}` : '-'}</td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="text-neutral-400 hover:text-white p-1"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="text-neutral-500 hover:text-red-500 p-1"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Editing Product Dialog */}
              {editingProduct && (
                <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
                  <form
                    onSubmit={handleSaveEditProduct}
                    className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-4 text-xs"
                  >
                    <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                      <h4 className="font-bold text-white uppercase text-sm">Edit {editingProduct.name}</h4>
                      <button onClick={() => setEditingProduct(null)} className="text-neutral-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-neutral-400 uppercase font-mono-code mb-1">Name</label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 uppercase font-mono-code mb-1">Base Price ($)</label>
                        <input
                          type="number"
                          value={editingProduct.baseUnitPrice}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              baseUnitPrice: Number(e.target.value),
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 uppercase font-mono-code mb-1">Stock Status</label>
                        <select
                          value={editingProduct.stockStatus}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              stockStatus: e.target.value as any,
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                        >
                          <option value="In Stock">In Stock</option>
                          <option value="Limited Stock">Limited Stock</option>
                          <option value="Pre-Order">Pre-Order</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold uppercase"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TOP 5 BEST SELLERS RANKING CONFIG */}
          {activeTab === 'top5' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-3">
                <h3 className="text-lg font-bold text-white uppercase">Top 5 Best Sellers Ranking Manager</h3>
                <p className="text-xs text-neutral-400">
                  Assign rank #1 through #5. #1 is Gold-styled with prominent size, #2 is Silver, #3 Bronze, #4 Vibrant Red, #5 Cyan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((rankNum) => {
                  const currentRanked = products.find((p) => p.rank === rankNum);

                  return (
                    <div
                      key={rankNum}
                      className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xl text-red-500 font-mono-code">#{rankNum}</span>
                        <span className="text-[10px] font-mono-code uppercase text-neutral-400">
                          {rankNum === 1 ? 'GOLD' : rankNum === 2 ? 'SILVER' : rankNum === 3 ? 'BRONZE' : rankNum === 4 ? 'VIBRANT' : 'CYAN'}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-white truncate">
                        {currentRanked ? currentRanked.name : 'Unassigned'}
                      </div>

                      <select
                        value={currentRanked?.id || ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            updateTop5Rank(e.target.value, rankNum);
                          }
                        }}
                        className="w-full p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
                      >
                        <option value="">Select product...</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: 2 DAILY DEALS ENGINE (5% Best Seller / 10% Other Items) */}
          {activeTab === 'dailyDeal' && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase">2 Daily Deals System Engine</h3>
                  <p className="text-xs text-neutral-400">
                    Automated rotation rule: <span className="text-red-400 font-bold">Best Sellers = 5% OFF</span>, <span className="text-emerald-400 font-bold">Catalog Items = 10% OFF</span>.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => rotateDailyDeals(true)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-red-600/50 text-red-400 hover:text-white text-xs font-black uppercase tracking-wider flex items-center gap-2"
                >
                  <Flame className="w-3.5 h-3.5 text-red-500" />
                  <span>Cycle & Randomize Now</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dailyDeals.slice(0, 2).map((deal, idx) => {
                  const dealProduct = products.find((p) => p.id === deal.productId);
                  const isBest = dealProduct ? !!(dealProduct.isBestSeller || (dealProduct.rank && dealProduct.rank <= 5)) : false;

                  return (
                    <div
                      key={deal.id || idx}
                      className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono-code font-black text-xs text-red-500 uppercase">
                          SLOT #{idx + 1} DAILY DEAL
                        </span>
                        <span className={`text-[10px] font-bold font-mono-code px-2 py-0.5 rounded ${
                          isBest ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60' : 'bg-red-950/80 text-red-400 border border-red-800/60'
                        }`}>
                          {deal.discountPercent}% OFF ({isBest ? 'Best Seller' : 'Catalog'})
                        </span>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-400 font-mono-code mb-1">
                          Product Assigned
                        </label>
                        <select
                          value={deal.productId}
                          onChange={(e) => {
                            const newProd = products.find((p) => p.id === e.target.value);
                            const newIsBest = newProd ? !!(newProd.isBestSeller || (newProd.rank && newProd.rank <= 5)) : false;
                            updateDailyDeal(deal.slotNumber || idx + 1, {
                              productId: e.target.value,
                              discountPercent: newIsBest ? 5 : 10,
                              isBestSellerDeal: newIsBest,
                            });
                          }}
                          className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.isBestSeller || (p.rank && p.rank <= 5) ? '⭐ Best Seller - 5%' : 'Standard - 10%'})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-400 font-mono-code mb-1">
                          Discount Rate
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[5, 10].map((pct) => (
                            <button
                              type="button"
                              key={pct}
                              onClick={() =>
                                updateDailyDeal(deal.slotNumber || idx + 1, {
                                  discountPercent: pct,
                                })
                              }
                              className={`p-2 rounded-lg font-mono-code font-bold text-xs uppercase border ${
                                deal.discountPercent === pct
                                  ? 'bg-red-600 text-white border-red-500'
                                  : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                              }`}
                            >
                              {pct}% OFF
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-400 font-mono-code mb-1">
                          Custom Headline
                        </label>
                        <input
                          type="text"
                          value={deal.customHeadline || ''}
                          onChange={(e) =>
                            updateDailyDeal(deal.slotNumber || idx + 1, {
                              customHeadline: e.target.value,
                            })
                          }
                          placeholder="Special promotional batch offer..."
                          className="w-full p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: LIMITED BULK DEALS */}
          {activeTab === 'bulkDeals' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase">Limited-Time Bulk Offers</h3>
                  <p className="text-xs text-neutral-400">
                    Flash volume deals with authentic countdown timers and redemption quotas.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {limitedBulkDeals.map((deal) => {
                  const product = products.find((p) => p.id === deal.productId);
                  return (
                    <div key={deal.id} className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-white text-sm">{deal.title}</span>
                        <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 text-[10px] font-bold border border-red-800">
                          Save ${deal.discountAmount}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400">
                        Item: {product?.name || 'Product'} • Required: {deal.requiredQuantity} Units
                      </p>
                      <div className="text-xs text-neutral-400 font-mono-code">
                        Redemptions: {deal.currentRedemptions} / {deal.maxRedemptions} Claimed
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 7: EMAIL MARKETING & CAMPAIGNS */}
          {activeTab === 'marketing' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-3">
                <h3 className="text-lg font-bold text-white uppercase">
                  Email Marketing Engine ({subscribers.length} Opted-In Subscribers)
                </h3>
                <p className="text-xs text-neutral-400">
                  Broadcast wholesale announcements, inventory restocks, daily deals, and coupon drops.
                </p>
              </div>

              <form onSubmit={handleSendCampaignSubmit} className="space-y-4 max-w-2xl text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 uppercase font-mono-code mb-1">
                      Campaign Type
                    </label>
                    <select
                      value={campaignForm.type}
                      onChange={(e) => setCampaignForm({ ...campaignForm, type: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                    >
                      <option value="New Products">New Products Arrival</option>
                      <option value="Daily Deals">Daily Deal Announcement</option>
                      <option value="Weekly Deals">Weekly Wholesale Volume</option>
                      <option value="Coupon Codes">Exclusive Coupon Codes</option>
                      <option value="Limited Offers">Limited-Time Bulk Offer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 uppercase font-mono-code mb-1">
                      Target Audience
                    </label>
                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono-code">
                      All {subscribers.length} Verified Subscribers
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase font-mono-code mb-1">
                    Email Subject Line *
                  </label>
                  <input
                    type="text"
                    required
                    value={campaignForm.subject}
                    onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase font-mono-code mb-1">
                    Email Body Content *
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={campaignForm.content}
                    onChange={(e) => setCampaignForm({ ...campaignForm, content: e.target.value })}
                    className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono-code resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(229,9,20,0.5)] flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch Email Broadcast</span>
                </button>
              </form>

              {/* Sent campaigns log */}
              {campaigns.length > 0 && (
                <div className="pt-4 border-t border-neutral-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-neutral-400 font-mono-code">
                    Dispatched Broadcast History
                  </h4>
                  {campaigns.map((camp) => (
                    <div
                      key={camp.id}
                      className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white block">{camp.subject}</span>
                        <span className="text-[11px] text-neutral-400">{camp.type} • {camp.recipientCount} Recipients</span>
                      </div>
                      <span className="font-mono-code text-[11px] text-neutral-500">
                        {new Date(camp.sentAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: VOUCHERS & PROMOTIONS */}
          {activeTab === 'vouchers' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-3">
                <h3 className="text-lg font-bold text-white uppercase">
                  Voucher Allocation Rules (Strict Max 3/Day Limit)
                </h3>
                <p className="text-xs text-neutral-400">
                  Control daily claim caps, minimum purchase thresholds, and total redemptions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vouchers.map((v) => (
                  <div key={v.code} className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono-code font-black text-white text-base">{v.code}</span>
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 text-xs font-bold border border-red-800">
                        ${v.discountAmount} OFF
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">{v.description}</p>
                    <div className="text-xs text-neutral-300 space-y-1 font-mono-code pt-2 border-t border-neutral-800">
                      <div>Min Purchase Required: ${v.minPurchaseAmount}</div>
                      <div>Daily Limit Cap: {v.maxPerDay} Per 24-Hours</div>
                      <div>Today's Claimed Count: {v.claimedTodayCount} / {v.maxPerDay}</div>
                      <div>Total All-Time Uses: {v.currentUses} / {v.maxUsesTotal}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-xl text-xs">
              <div className="border-b border-neutral-800 pb-3">
                <h3 className="text-lg font-bold text-white uppercase">System Configuration</h3>
                <p className="text-neutral-400">
                  Designate recipient email for all incoming wholesale order inquiries.
                </p>
              </div>

              <div>
                <label className="block font-mono-code uppercase font-bold text-neutral-400 mb-1">
                  Store Owner Notification Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono-code"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  All customer "REQUEST THIS PRODUCT" submissions are automatically queued and dispatched to this address.
                </p>
              </div>

              <div>
                <label className="block font-mono-code uppercase font-bold text-neutral-400 mb-1">
                  Top Announcement Banner Text
                </label>
                <input
                  type="text"
                  value={bannerNotice}
                  onChange={(e) => setBannerNotice(e.target.value)}
                  className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={showBannerNotice}
                    onChange={(e) => setShowBannerNotice(e.target.checked)}
                    className="rounded bg-neutral-900 border-neutral-700 text-red-600"
                  />
                  <span>Show announcement bar at top of website</span>
                </label>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(229,9,20,0.5)] flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save System Settings</span>
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
