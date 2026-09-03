import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { StoreOrder, OrderStatus, Product } from '../types';
import {
  Lock,
  Key,
  ShieldCheck,
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  Send,
  Eye,
  Sliders,
  Settings,
  Mail,
  FileText,
  Plus,
  Play,
  RotateCcw,
  ArrowRight,
  User,
  MapPin,
  Tag,
  ShieldAlert,
  ChevronRight,
  Edit,
  Save,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DeveloperDashboard: React.FC = () => {
  const {
    developerSession,
    developerSettings,
    developerAuditLogs,
    developerEmailLogs,
    orders,
    products,
    developerLogin,
    developerLogout,
    developerConfirmPayment,
    developerPlaceSupplierOrder,
    developerAddTracking,
    developerMarkDelivered,
    developerCancelOrder,
    developerSendPaymentInstructions,
    developerCreateTestOrder,
    developerSimulateStep,
    developerUpdateProductSupplier,
    developerUpdateSettings,
    developerChangePassword,
    fetchDeveloperData,
    showToast,
  } = useStore();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    'orders' | 'suppliers' | 'test_mode' | 'settings' | 'audit_logs' | 'security'
  >('orders');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Orders filters and search
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'REAL' | 'TEST'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null);

  // Modals for actions
  const [paymentModalOrder, setPaymentModalOrder] = useState<StoreOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Cash App' | 'Venmo' | 'Zelle' | 'Bank Transfer' | 'Crypto' | 'Cash' | 'Other'>('Cash App');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  const [supplierModalOrder, setSupplierModalOrder] = useState<StoreOrder | null>(null);
  const [supplierOrderNumber, setSupplierOrderNumber] = useState('');
  const [supplierNotes, setSupplierNotes] = useState('');

  const [trackingModalOrder, setTrackingModalOrder] = useState<StoreOrder | null>(null);
  const [carrier, setCarrier] = useState('USPS');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
  const [shippingNotes, setShippingNotes] = useState('');

  // Supplier editing modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editSupplierName, setEditSupplierName] = useState('');
  const [editSupplierUrl, setEditSupplierUrl] = useState('');
  const [editSupplierUnitCost, setEditSupplierUnitCost] = useState<number>(0);
  const [editSupplierShippingCost, setEditSupplierShippingCost] = useState<number>(0);

  // Settings form
  const [settingsCashApp, setSettingsCashApp] = useState(developerSettings.cashAppTag);
  const [settingsVenmo, setSettingsVenmo] = useState(developerSettings.venmoHandle);
  const [settingsZelle, setSettingsZelle] = useState(developerSettings.zelleContact);
  const [settingsNotifyEmail, setSettingsNotifyEmail] = useState(developerSettings.businessNotificationEmail);
  const [settingsAutoEmail, setSettingsAutoEmail] = useState(developerSettings.autoSendEmails);

  // Security password change form
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Test order creator form
  const [testProdId, setTestProdId] = useState(products[0]?.id || '');
  const [testVariant, setTestVariant] = useState('');
  const [testQty, setTestQty] = useState(10);

  // Clipboard copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      showToast('info', 'Copied to Clipboard', text);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    const res = await developerLogin(loginEmail.trim(), loginPassword);
    setIsLoggingIn(false);

    if (!res.success) {
      setLoginError(res.error || 'Invalid developer credentials.');
    }
  };

  // Sync settings when loaded
  useEffect(() => {
    setSettingsCashApp(developerSettings.cashAppTag);
    setSettingsVenmo(developerSettings.venmoHandle);
    setSettingsZelle(developerSettings.zelleContact);
    setSettingsNotifyEmail(developerSettings.businessNotificationEmail);
    setSettingsAutoEmail(developerSettings.autoSendEmails);
  }, [developerSettings]);

  // If not authenticated, render the high-security Login Portal
  if (!developerSession) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-red-600 selection:text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md bg-black border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(229,9,20,0.15)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center mx-auto mb-4 text-red-500">
              <Lock className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-red-500 block mb-1">
              Restricted Area • Private Portal
            </span>
            <h1 className="text-2xl font-black font-display uppercase tracking-tight text-white">
              Developer & Order System
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Authenticate with your developer credentials to manage store orders, supplier fulfillment, and inventory.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                Developer Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@resellersupply.com"
                className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 font-mono-code"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                Developer Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 font-mono-code"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-xs font-mono-code flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(229,9,20,0.4)] flex items-center justify-center gap-2 font-mono-code cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Hash...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Unlock Developer Console</span>
                </>
              )}
            </button>

            {/* Quick Fill Default Credentials */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setLoginEmail('admin@resellersupply.com');
                  setLoginPassword('DeveloperSupply2026!');
                  setLoginError(null);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white text-[11px] font-mono-code transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🔑 Auto-Fill Initial Credentials</span>
                <code className="text-[10px] text-neutral-400 font-bold bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">admin@resellersupply.com</code>
              </button>
            </div>
          </form>

          {/* Security Banner */}
          <div className="mt-8 pt-4 border-t border-neutral-900 text-center text-[10px] font-mono-code text-neutral-400 flex items-center justify-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-neutral-400" />
            <span>PBKDF2 10,000 Rounds Hashing • Encrypted Session Token</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'ALL' && order.status !== statusFilter) return false;
    if (typeFilter === 'REAL' && order.isTestOrder) return false;
    if (typeFilter === 'TEST' && !order.isTestOrder) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchCust = order.customerName.toLowerCase().includes(q);
      const matchEmail = order.customerEmail.toLowerCase().includes(q);
      const matchProd = order.productName.toLowerCase().includes(q);
      const matchTrack = order.tracking?.trackingNumber?.toLowerCase().includes(q);
      if (!matchNum && !matchCust && !matchEmail && !matchProd && !matchTrack) return false;
    }
    return true;
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.customerTotalPrice || 0), 0);
  const totalEstimatedProfit = orders.reduce((acc, o) => acc + (o.financials?.estimatedProfit || 0), 0);
  const awaitingPaymentCount = orders.filter((o) => o.status === 'AWAITING PAYMENT').length;
  const purchaseNowCount = orders.filter((o) => o.status === 'PAYMENT CONFIRMED — PURCHASE NOW').length;
  const supplierPlacedCount = orders.filter((o) => o.status === 'SUPPLIER ORDER PLACED').length;
  const shippedCount = orders.filter((o) => o.status === 'SHIPPED').length;

  return (
    <div className="min-h-screen bg-black text-neutral-200 font-sans selection:bg-red-600 selection:text-white flex flex-col">
      {/* Top Developer Bar */}
      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-red-950/40 border border-red-700/50 px-3 py-1 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-mono-code font-black uppercase text-red-400 tracking-wider">
                PRIVATE DEVELOPER CONSOLE
              </span>
            </div>
            <span className="hidden sm:inline text-xs font-mono-code text-neutral-400">
              Session: <strong className="text-white">{developerSession.email}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchDeveloperData();
                showToast('info', 'Synchronized', 'Refreshed all order and inventory data.');
              }}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-mono-code border border-neutral-800 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sync Data</span>
            </button>

            <button
              onClick={developerLogout}
              className="px-3 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/80 text-red-300 hover:text-white text-xs font-mono-code border border-red-800 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Developer Container */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex-1 space-y-6">
        {/* KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl">
            <div className="flex justify-between items-center text-neutral-400 text-xs font-mono-code mb-1">
              <span>Orders Total</span>
              <Package className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-xl font-mono-code font-black text-white">{orders.length}</div>
            <span className="text-[10px] text-neutral-400 font-mono-code">
              {orders.filter((o) => !o.isTestOrder).length} real / {orders.filter((o) => o.isTestOrder).length} test
            </span>
          </div>

          <div className="bg-neutral-950 border border-amber-900/40 p-4 rounded-2xl">
            <div className="flex justify-between items-center text-amber-400 text-xs font-mono-code mb-1">
              <span>Awaiting Pay</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-mono-code font-black text-amber-400">{awaitingPaymentCount}</div>
            <span className="text-[10px] text-neutral-400 font-mono-code">Pending verification</span>
          </div>

          <div className="bg-neutral-950 border border-red-900/60 p-4 rounded-2xl relative overflow-hidden">
            <div className="flex justify-between items-center text-red-400 text-xs font-mono-code mb-1">
              <span>Purchase Now</span>
              <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />
            </div>
            <div className="text-xl font-mono-code font-black text-red-500">{purchaseNowCount}</div>
            <span className="text-[10px] text-red-400 font-mono-code font-bold">Action Needed!</span>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl">
            <div className="flex justify-between items-center text-blue-400 text-xs font-mono-code mb-1">
              <span>Supplier Placed</span>
              <Truck className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-mono-code font-black text-blue-400">{supplierPlacedCount}</div>
            <span className="text-[10px] text-neutral-400 font-mono-code">Awaiting Tracking</span>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl">
            <div className="flex justify-between items-center text-emerald-400 text-xs font-mono-code mb-1">
              <span>In Transit</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl font-mono-code font-black text-emerald-400">{shippedCount}</div>
            <span className="text-[10px] text-neutral-400 font-mono-code">Active shipments</span>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl">
            <div className="flex justify-between items-center text-emerald-400 text-xs font-mono-code mb-1">
              <span>Est. Net Profit</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl font-mono-code font-black text-emerald-400">
              ${totalEstimatedProfit.toFixed(2)}
            </div>
            <span className="text-[10px] text-neutral-400 font-mono-code">Gross: ${totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-3">
          {[
            { id: 'orders', label: 'Order Workflow & Fulfillment', icon: Package, count: orders.length },
            { id: 'suppliers', label: 'Supplier & Cost Manager', icon: Sliders, count: products.length },
            { id: 'test_mode', label: 'Test Mode & Simulator', icon: Play },
            { id: 'settings', label: 'Payment Handles & Dispatch', icon: Settings },
            { id: 'audit_logs', label: 'Audit & Dispatch Logs', icon: FileText, count: developerEmailLogs.length },
            { id: 'security', label: 'Developer Credentials', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono-code font-bold transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(229,9,20,0.4)]'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                      isActive ? 'bg-black/40 text-white' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ORDERS MANAGEMENT & FULFILLMENT WORKFLOW */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filters Bar */}
            <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Order #, Customer, Email, Tracking..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 font-mono-code"
                />
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono-code text-white focus:outline-none focus:border-red-600"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="AWAITING PAYMENT">Awaiting Payment</option>
                  <option value="PAYMENT CONFIRMED — PURCHASE NOW">Payment Confirmed (Purchase Now)</option>
                  <option value="SUPPLIER ORDER PLACED">Supplier Order Placed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono-code text-white focus:outline-none focus:border-red-600"
                >
                  <option value="ALL">All Orders (Real & Test)</option>
                  <option value="REAL">Real Orders Only</option>
                  <option value="TEST">Test Orders Only</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center bg-neutral-950 border border-neutral-800 rounded-3xl">
                  <Package className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-white uppercase font-display">No Orders Found</h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                    No orders match your selected filters. Create a test order or change filter options.
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const isPurchaseNow = order.status === 'PAYMENT CONFIRMED — PURCHASE NOW';
                  const isAwaitingPay = order.status === 'AWAITING PAYMENT';
                  const isSupplierPlaced = order.status === 'SUPPLIER ORDER PLACED';
                  const isShipped = order.status === 'SHIPPED';
                  const isDelivered = order.status === 'DELIVERED';

                  const formattedShipping = `${order.customerName}\n${order.shippingAddress.street}${
                    order.shippingAddress.apartmentOrSuite ? ` ${order.shippingAddress.apartmentOrSuite}` : ''
                  }\n${order.shippingAddress.city}, ${order.shippingAddress.state || ''} ${
                    order.shippingAddress.postalCode || ''
                  }\n${order.shippingAddress.country}${
                    order.customerPhone ? `\nTel: ${order.customerPhone}` : ''
                  }`;

                  return (
                    <div
                      key={order.orderNumber}
                      className={`bg-neutral-950 border rounded-2xl p-5 transition-all space-y-4 ${
                        isPurchaseNow
                          ? 'border-red-600 shadow-[0_0_20px_rgba(229,9,20,0.25)] ring-1 ring-red-600'
                          : isAwaitingPay
                          ? 'border-amber-700/60'
                          : 'border-neutral-800'
                      }`}
                    >
                      {/* Top Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-900 pb-3">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono-code font-black text-white text-sm">
                            #{order.orderNumber}
                          </span>

                          {order.isTestOrder && (
                            <span className="px-2 py-0.5 rounded bg-red-950 border border-red-700 text-red-400 font-mono-code text-[10px] font-bold">
                              TEST ORDER
                            </span>
                          )}

                          {/* Status Pill */}
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-mono-code font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                              isPurchaseNow
                                ? 'bg-red-600 text-white animate-pulse'
                                : isAwaitingPay
                                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                                : isSupplierPlaced
                                ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400'
                                : isShipped
                                ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                                : isDelivered
                                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                                : 'bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {isPurchaseNow && <AlertTriangle className="w-3.5 h-3.5" />}
                            {isAwaitingPay && <Clock className="w-3.5 h-3.5" />}
                            {isSupplierPlaced && <Truck className="w-3.5 h-3.5" />}
                            {isShipped && <Truck className="w-3.5 h-3.5" />}
                            {isDelivered && <CheckCircle2 className="w-3.5 h-3.5" />}
                            <span>{order.status}</span>
                          </span>

                          <span className="text-[11px] font-mono-code text-neutral-400">
                            {new Date(order.createdAt).toLocaleDateString()} at{' '}
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Financial Snapshot */}
                        <div className="flex items-center gap-3 font-mono-code text-xs">
                          <div className="text-right">
                            <span className="text-[10px] text-neutral-400 block uppercase font-bold">Customer Total</span>
                            <span className="text-white font-black">${order.customerTotalPrice.toFixed(2)}</span>
                          </div>
                          <div className="text-right pl-3 border-l border-neutral-800">
                            <span className="text-[10px] text-emerald-400 block uppercase font-bold">Est. Profit</span>
                            <span className="text-emerald-400 font-black">
                              +${(order.financials?.estimatedProfit || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono-code">
                        {/* Column 1: Product & Quantity */}
                        <div className="p-3 bg-neutral-900/60 border border-neutral-900 rounded-xl space-y-2">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase block">Product Details</span>
                          <div className="flex items-center gap-3">
                            <img
                              src={order.productImage}
                              alt={order.productName}
                              className="w-12 h-12 rounded-lg bg-black border border-neutral-800 object-contain p-1 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white line-clamp-1">{order.productName}</div>
                              {order.variant && (
                                <div className="text-neutral-400 text-[11px]">Variant: <strong className="text-neutral-200">{order.variant}</strong></div>
                              )}
                              <div className="text-neutral-400 text-[11px]">
                                Qty: <strong className="text-white">{order.quantity} units</strong> @ ${order.customerUnitPrice.toFixed(2)}/u
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Customer & Shipping Address */}
                        <div className="p-3 bg-neutral-900/60 border border-neutral-900 rounded-xl space-y-1.5 relative">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase block">Delivery Address</span>
                            <button
                              onClick={() => handleCopy(formattedShipping, `ship-${order.orderNumber}`)}
                              className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 font-bold"
                            >
                              {copiedId === `ship-${order.orderNumber}` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>Copy Address</span>
                            </button>
                          </div>
                          <div className="text-white font-bold">{order.customerName}</div>
                          <div className="text-neutral-400 text-[11px]">{order.customerEmail}</div>
                          <div className="text-neutral-300 text-[11px] whitespace-pre-line leading-relaxed mt-1">
                            {order.shippingAddress.street}
                            {order.shippingAddress.apartmentOrSuite ? `, ${order.shippingAddress.apartmentOrSuite}` : ''}
                            <br />
                            {order.shippingAddress.city}, {order.shippingAddress.state || ''} {order.shippingAddress.postalCode || ''}
                            <br />
                            {order.shippingAddress.country}
                          </div>
                        </div>

                        {/* Column 3: Supplier Info & Tracking */}
                        <div className="p-3 bg-neutral-900/60 border border-neutral-900 rounded-xl space-y-1.5">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase block">Supplier & Fulfillment</span>
                          <div>
                            <span className="text-neutral-400">Supplier: </span>
                            <span className="text-white font-bold">{order.supplierInfo?.supplierName || 'Master Factory'}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400">Supplier Unit Cost: </span>
                            <span className="text-neutral-200 font-bold">${(order.supplierInfo?.supplierUnitCost || 0).toFixed(2)}/u</span>
                          </div>
                          {order.supplierInfo?.supplierProductLink && (
                            <div className="pt-1">
                              <a
                                href={order.supplierInfo.supplierProductLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-red-400 hover:text-red-300 text-[11px] font-bold border border-neutral-700"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Open 1688 / Factory Listing</span>
                              </a>
                            </div>
                          )}

                          {order.tracking && (
                            <div className="pt-2 border-t border-neutral-800 text-[11px]">
                              <span className="text-neutral-400 block">Tracking:</span>
                              <span className="text-emerald-400 font-bold">{order.tracking.carrier}: {order.tracking.trackingNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* WORKFLOW ACTION BAR */}
                      <div className="pt-2 border-t border-neutral-900 flex flex-wrap items-center justify-between gap-3">
                        {/* Status Specific Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* 1. If Awaiting Payment */}
                          {isAwaitingPay && (
                            <>
                              <button
                                onClick={() => {
                                  setPaymentModalOrder(order);
                                  setPaymentNotes('');
                                  setTransactionRef('');
                                }}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono-code font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Confirm Payment Received</span>
                              </button>

                              <button
                                onClick={() => developerSendPaymentInstructions(order.orderNumber)}
                                className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-mono-code font-bold border border-neutral-800 flex items-center gap-1.5"
                              >
                                <Send className="w-3.5 h-3.5 text-amber-500" />
                                <span>Send Payment Details Email</span>
                              </button>
                            </>
                          )}

                          {/* 2. If Payment Confirmed (Purchase Now) */}
                          {isPurchaseNow && (
                            <>
                              <button
                                onClick={() => {
                                  setSupplierModalOrder(order);
                                  setSupplierOrderNumber('');
                                  setSupplierNotes('');
                                }}
                                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-mono-code font-black flex items-center gap-1.5 shadow-[0_0_20px_rgba(229,9,20,0.6)] animate-pulse"
                              >
                                <Truck className="w-4 h-4" />
                                <span>Mark Supplier Order Placed</span>
                              </button>

                              {order.supplierInfo?.supplierProductLink && (
                                <a
                                  href={order.supplierInfo.supplierProductLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-red-400 text-xs font-mono-code font-bold border border-neutral-800 flex items-center gap-1.5"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>Buy on 1688 / Factory</span>
                                </a>
                              )}
                            </>
                          )}

                          {/* 3. If Supplier Order Placed */}
                          {isSupplierPlaced && (
                            <button
                              onClick={() => {
                                setTrackingModalOrder(order);
                                setTrackingNumber('');
                                setEstimatedDeliveryDate('');
                                setShippingNotes('');
                              }}
                              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono-code font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Add Shipping Tracking Number</span>
                            </button>
                          )}

                          {/* 4. If Shipped */}
                          {isShipped && (
                            <button
                              onClick={() => developerMarkDelivered(order.orderNumber)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono-code font-bold flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Order Delivered</span>
                            </button>
                          )}

                          {/* Simulation Button for Test Orders */}
                          {order.isTestOrder && (
                            <button
                              onClick={() => developerSimulateStep(order.orderNumber)}
                              className="px-3 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 text-xs font-mono-code font-bold border border-amber-800 flex items-center gap-1.5"
                            >
                              <Play className="w-3.5 h-3.5 text-amber-400" />
                              <span>Simulate Next Stage</span>
                            </button>
                          )}
                        </div>

                        {/* Secondary Options */}
                        <div className="flex items-center gap-2">
                          {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                            <button
                              onClick={() => {
                                if (confirm(`Cancel order ${order.orderNumber}?`)) {
                                  developerCancelOrder(order.orderNumber, 'Developer cancelled.');
                                }
                              }}
                              className="px-2.5 py-1.5 text-neutral-400 hover:text-red-400 text-xs font-mono-code hover:underline"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SUPPLIER MANAGEMENT */}
        {activeTab === 'suppliers' && (
          <div className="space-y-4">
            <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-3xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <div>
                  <h2 className="text-lg font-black uppercase text-white font-display">
                    Private Supplier & Factory Cost Manager
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Configure direct supplier URLs (1688, Taobao, Factory) and landed costs. These private links and costs are strictly hidden from customers.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => {
                  const unitCost = product.supplierUnitCost || product.baseUnitPrice * 0.45;
                  const shippingCost = product.supplierShippingCost || 3.5;
                  const estimatedUnitProfit = product.baseUnitPrice - unitCost - (shippingCost / 10);
                  const marginPct = ((estimatedUnitProfit / product.baseUnitPrice) * 100).toFixed(0);

                  return (
                    <div
                      key={product.id}
                      className="bg-black border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 object-contain p-1 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono-code uppercase font-bold text-red-500">
                              {product.category}
                            </span>
                            <h4 className="text-xs font-bold text-white line-clamp-1">{product.name}</h4>
                            <span className="text-xs font-mono-code text-neutral-400">
                              Selling: <strong className="text-white">${product.baseUnitPrice.toFixed(2)}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="p-3 bg-neutral-900/60 rounded-xl text-xs font-mono-code space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Supplier:</span>
                            <span className="text-white font-bold">{product.supplierName || 'Master Direct'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Supplier Unit Cost:</span>
                            <span className="text-amber-400 font-bold">${unitCost.toFixed(2)}/u</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Est. Freight / Unit:</span>
                            <span className="text-neutral-300">${(shippingCost / 10).toFixed(2)}/u</span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-neutral-800 font-bold">
                            <span className="text-neutral-400">Profit Margin:</span>
                            <span className="text-emerald-400">
                              ${estimatedUnitProfit.toFixed(2)} ({marginPct}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-neutral-900">
                        {product.supplierUrl && (
                          <a
                            href={product.supplierUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-mono-code font-bold border border-neutral-800 flex items-center justify-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-red-500" />
                            <span>1688 Link</span>
                          </a>
                        )}

                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setEditSupplierName(product.supplierName || 'Shenzhen Master Factory');
                            setEditSupplierUrl(product.supplierUrl || 'https://1688.com');
                            setEditSupplierUnitCost(product.supplierUnitCost || product.baseUnitPrice * 0.45);
                            setEditSupplierShippingCost(product.supplierShippingCost || 3.5);
                          }}
                          className="px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-mono-code font-bold border border-red-800 flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TEST MODE & WORKFLOW SIMULATOR */}
        {activeTab === 'test_mode' && (
          <div className="space-y-6">
            <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-3xl space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono-code font-bold uppercase mb-2">
                  <Play className="w-3.5 h-3.5" />
                  PIPELINE SIMULATOR
                </div>
                <h2 className="text-xl font-black uppercase text-white font-display">
                  Test Orders & Stage Automation
                </h2>
                <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
                  Generate mock customer orders and advance them through the complete lifecycle to verify notification emails, tracking URLs, and supplier profit calculation.
                </p>
              </div>

              {/* Creator Card */}
              <div className="bg-black border border-neutral-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase font-mono-code flex items-center gap-2">
                  <Plus className="w-4 h-4 text-red-500" />
                  <span>Create New Test Order</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-mono-code font-bold uppercase text-neutral-400 block mb-1">
                      Select Product
                    </label>
                    <select
                      value={testProdId}
                      onChange={(e) => {
                        setTestProdId(e.target.value);
                        const p = products.find((prod) => prod.id === e.target.value);
                        if (p?.variants?.length) setTestVariant(p.variants[0]);
                        else setTestVariant('');
                      }}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white font-mono-code focus:outline-none focus:border-red-600"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (${p.baseUnitPrice})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono-code font-bold uppercase text-neutral-400 block mb-1">
                      Variant (Optional)
                    </label>
                    <input
                      type="text"
                      value={testVariant}
                      onChange={(e) => setTestVariant(e.target.value)}
                      placeholder="e.g. Space Black, Titanium"
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white font-mono-code focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono-code font-bold uppercase text-neutral-400 block mb-1">
                      Quantity (Units)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={testQty}
                      onChange={(e) => setTestQty(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white font-mono-code focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <button
                  onClick={async () => {
                    const res = await developerCreateTestOrder(testProdId, testVariant, testQty);
                    if (res.success) {
                      setActiveTab('orders');
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider font-mono-code shadow-[0_0_20px_rgba(229,9,20,0.4)] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Generate Test Order (AWAITING PAYMENT)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS & PAYMENT HANDLES */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-3xl space-y-6">
              <div>
                <h2 className="text-lg font-black uppercase text-white font-display">
                  Payment Accounts & Dispatch Settings
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Configure the handles and emails sent in automated customer payment instruction emails.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  developerUpdateSettings({
                    cashAppTag: settingsCashApp.trim().replace('$', ''),
                    venmoHandle: settingsVenmo.trim().replace('@', ''),
                    zelleContact: settingsZelle.trim(),
                    businessNotificationEmail: settingsNotifyEmail.trim(),
                    autoSendEmails: settingsAutoEmail,
                  });
                }}
                className="space-y-4 max-w-xl"
              >
                <div>
                  <label className="text-[11px] font-mono-code font-bold uppercase text-neutral-400 block mb-1">
                    Cash App $Cashtag
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-mono-code">$</span>
                    <input
                      type="text"
                      value={settingsCashApp}
                      onChange={(e) => setSettingsCashApp(e.target.value)}
                      placeholder="ResellerSupplyVIP"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white font-mono-code focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono-code font-bold uppercase text-neutral-400 block mb-1">
                    Venmo @Handle
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-mono-code">@</span>
                    <input
                      type="text"
                      value={settingsVenmo}
                      onChange={(e) => setSettingsVenmo(e.target.value)}
                      placeholder="ResellerSupply-Wholesale"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white font-mono-code focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono-code font-bold uppercase text-neutral-400 block mb-1">
                    Zelle Email / Phone
                  </label>
                  <input
                    type="text"
                    value={settingsZelle}
                    onChange={(e) => setSettingsZelle(e.target.value)}
                    placeholder="payments@resellersupply.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white font-mono-code focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono-code font-bold uppercase text-neutral-400 block mb-1">
                    Business Notification Email (Admin Alerts)
                  </label>
                  <input
                    type="email"
                    value={settingsNotifyEmail}
                    onChange={(e) => setSettingsNotifyEmail(e.target.value)}
                    placeholder="admin@resellersupply.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white font-mono-code focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsAutoEmail}
                      onChange={(e) => setSettingsAutoEmail(e.target.checked)}
                      className="w-4 h-4 accent-red-600 rounded"
                    />
                    <span className="text-xs font-mono-code text-neutral-300">
                      Auto-dispatch customer notification emails upon order creation and tracking updates
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider font-mono-code shadow-[0_0_15px_rgba(229,9,20,0.4)] flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT & DISPATCH LOGS */}
        {activeTab === 'audit_logs' && (
          <div className="space-y-4">
            <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-3xl space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-black uppercase text-white font-display">
                    Audit Trail & Automated Email Payloads
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Verified chronological log of all order changes, payments received, and email dispatches.
                  </p>
                </div>
              </div>

              {/* Email Notifications Dispatched */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono-code font-bold uppercase text-red-500">
                  Email Dispatch Queue ({developerEmailLogs.length})
                </h3>
                {developerEmailLogs.map((emailLog) => (
                  <div
                    key={emailLog.id}
                    className="p-4 rounded-2xl bg-black border border-neutral-800 text-xs font-mono-code space-y-2"
                  >
                    <div className="flex justify-between items-center text-neutral-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-white font-bold">{emailLog.type}</span>
                        <span className="text-neutral-400">→ {emailLog.to}</span>
                      </div>
                      <span>{new Date(emailLog.sentAt).toLocaleString()}</span>
                    </div>
                    <div className="text-red-400 font-bold">{emailLog.subject}</div>
                    <div className="p-3 bg-neutral-900/60 rounded-xl text-neutral-300 whitespace-pre-line text-[11px] leading-relaxed border border-neutral-900">
                      {emailLog.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SECURITY & PASSWORD CHANGE */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-3xl space-y-6 max-w-xl">
              <div>
                <h2 className="text-lg font-black uppercase text-white font-display">
                  Developer Password Security
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Change the master developer password. Hashed securely with PBKDF2 (10,000 iterations).
                </p>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (newPass !== confirmPass) {
                    showToast('error', 'Mismatch', 'New passwords do not match.');
                    return;
                  }
                  if (newPass.length < 8) {
                    showToast('error', 'Too Short', 'Password must be at least 8 characters.');
                    return;
                  }
                  const res = await developerChangePassword(currentPass, newPass);
                  if (res.success) {
                    setCurrentPass('');
                    setNewPass('');
                    setConfirmPass('');
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-[11px] font-mono-code font-bold uppercase text-neutral-400 block mb-1">
                    Current Developer Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white font-mono-code focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono-code font-bold uppercase text-neutral-400 block mb-1">
                    New Developer Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white font-mono-code focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono-code font-bold uppercase text-neutral-400 block mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white font-mono-code focus:outline-none focus:border-red-600"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider font-mono-code shadow-[0_0_15px_rgba(229,9,20,0.4)] flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>Update Developer Password</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* CONFIRM PAYMENT MODAL */}
      {paymentModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl font-mono-code">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase">
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm Payment Received</span>
              </div>
              <button onClick={() => setPaymentModalOrder(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-neutral-300">
              Confirming payment for order <strong className="text-white">#{paymentModalOrder.orderNumber}</strong> ($
              {paymentModalOrder.customerTotalPrice.toFixed(2)}) from <strong className="text-white">{paymentModalOrder.customerName}</strong>.
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                  Payment Method Received
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Cash App">Cash App ($Cashtag)</option>
                  <option value="Venmo">Venmo</option>
                  <option value="Zelle">Zelle</option>
                  <option value="Bank Transfer">Bank Transfer / Wire</option>
                  <option value="Crypto">Cryptocurrency (BTC / USDT)</option>
                  <option value="Cash">Cash (Local In-Person)</option>
                  <option value="Other">Other Verified Method</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                  Transaction Reference / Cash App ID (Optional)
                </label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. #CASHTAG-998823"
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                  Admin Verification Notes
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Verified in Cash App activity feed"
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-[11px] text-emerald-300">
              ⚡ Status will immediately change to <strong>PAYMENT CONFIRMED — PURCHASE NOW</strong>, prompting direct factory order placement.
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setPaymentModalOrder(null)}
                className="flex-1 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await developerConfirmPayment(
                    paymentModalOrder.orderNumber,
                    paymentMethod,
                    transactionRef,
                    paymentNotes
                  );
                  setPaymentModalOrder(null);
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              >
                Confirm & Set "PURCHASE NOW"
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MARK SUPPLIER ORDER PLACED MODAL */}
      {supplierModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl font-mono-code">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-red-500 font-bold text-sm uppercase">
                <Truck className="w-5 h-5" />
                <span>Record Supplier Batch Order</span>
              </div>
              <button onClick={() => setSupplierModalOrder(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-neutral-300">
              Recording supplier order for <strong className="text-white">{supplierModalOrder.productName}</strong> ({supplierModalOrder.quantity} units).
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                  Supplier Order # / 1688 Confirmation ID
                </label>
                <input
                  type="text"
                  value={supplierOrderNumber}
                  onChange={(e) => setSupplierOrderNumber(e.target.value)}
                  placeholder="e.g. 1688-293849102"
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                  Supplier Fulfillment Notes
                </label>
                <input
                  type="text"
                  value={supplierNotes}
                  onChange={(e) => setSupplierNotes(e.target.value)}
                  placeholder="Air cargo batch dispatched from Shenzhen warehouse"
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSupplierModalOrder(null)}
                className="flex-1 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await developerPlaceSupplierOrder(
                    supplierModalOrder.orderNumber,
                    supplierOrderNumber,
                    supplierNotes
                  );
                  setSupplierModalOrder(null);
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-[0_0_15px_rgba(229,9,20,0.4)]"
              >
                Save & Set "SUPPLIER ORDER PLACED"
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD TRACKING NUMBER MODAL */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl font-mono-code">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase">
                <Truck className="w-5 h-5" />
                <span>Add Tracking & Dispatch Shipment Email</span>
              </div>
              <button onClick={() => setTrackingModalOrder(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-neutral-300">
              Customer <strong className="text-white">{trackingModalOrder.customerEmail}</strong> will automatically receive a branded tracking dispatch email.
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                  Shipping Carrier
                </label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="USPS">USPS Priority Mail</option>
                  <option value="FedEx">FedEx Express</option>
                  <option value="UPS">UPS Worldwide</option>
                  <option value="DHL Express">DHL Express</option>
                  <option value="YunExpress">YunExpress Direct</option>
                  <option value="4PX">4PX Express</option>
                  <option value="China Post EMS">China Post EMS</option>
                  <option value="Royal Mail">Royal Mail</option>
                  <option value="Canada Post">Canada Post</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                  Tracking Number *
                </label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. 9400111899223344556677 or YUN88992211"
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                  Estimated Delivery Date
                </label>
                <input
                  type="date"
                  value={estimatedDeliveryDate}
                  onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                  Carrier Notes (Optional)
                </label>
                <input
                  type="text"
                  value={shippingNotes}
                  onChange={(e) => setShippingNotes(e.target.value)}
                  placeholder="Direct customs clearance with signature verification"
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="flex-1 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!trackingNumber.trim()) {
                    showToast('error', 'Tracking Required', 'Please enter a tracking number.');
                    return;
                  }
                  await developerAddTracking(
                    trackingModalOrder.orderNumber,
                    carrier,
                    trackingNumber.trim(),
                    estimatedDeliveryDate || '2026-09-25',
                    shippingNotes
                  );
                  setTrackingModalOrder(null);
                }}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                Dispatch Tracking & Email Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT SUPPLIER MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl font-mono-code">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm uppercase">
                <Sliders className="w-5 h-5 text-red-500" />
                <span>Configure Supplier Details</span>
              </div>
              <button onClick={() => setEditingProduct(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-neutral-300 font-bold">{editingProduct.name}</div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                  Supplier Name / Factory Title
                </label>
                <input
                  type="text"
                  value={editSupplierName}
                  onChange={(e) => setEditSupplierName(e.target.value)}
                  placeholder="e.g. Shenzhen Audio Technology Co."
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                  Private Supplier URL (1688 / Taobao / Factory)
                </label>
                <input
                  type="url"
                  value={editSupplierUrl}
                  onChange={(e) => setEditSupplierUrl(e.target.value)}
                  placeholder="https://detail.1688.com/offer/..."
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                    Supplier Unit Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editSupplierUnitCost}
                    onChange={(e) => setEditSupplierUnitCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                    Landed Shipping Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editSupplierShippingCost}
                    onChange={(e) => setEditSupplierShippingCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await developerUpdateProductSupplier(
                    editingProduct.id,
                    editSupplierName,
                    editSupplierUrl,
                    editSupplierUnitCost,
                    editSupplierShippingCost
                  );
                  setEditingProduct(null);
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-[0_0_15px_rgba(229,9,20,0.4)]"
              >
                Save Supplier Config
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
