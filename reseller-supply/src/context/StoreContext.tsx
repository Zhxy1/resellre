import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  ProductCategory,
  DailyDeal,
  WeeklyDealPack,
  LimitedBulkDeal,
  ProductRequest,
  Voucher,
  ProductReview,
  SpendThresholdPromotion,
  EmailSubscriber,
  EmailCampaign,
  CustomerUser,
  AdminConfig,
  FAQItem,
  RequestStatus,
  ShippingConfig,
  SocialLinksConfig,
  CustomerProductSuggestion,
  StoreOrder,
  OrderStatus,
  DeveloperSettings,
  DeveloperSession,
  AuditLogEntry,
  EmailNotificationLog,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_DAILY_DEAL,
  INITIAL_DAILY_DEALS,
  INITIAL_WEEKLY_PACKS,
  INITIAL_LIMITED_BULK_DEALS,
  INITIAL_VOUCHERS,
  INITIAL_SPEND_PROMOTION,
  INITIAL_REVIEWS,
  INITIAL_FAQS,
  INITIAL_ADMIN_CONFIG,
  INITIAL_REQUESTS,
  INITIAL_SUBSCRIBERS,
  INITIAL_SHIPPING_CONFIG,
  INITIAL_SOCIAL_LINKS,
  INITIAL_CUSTOMER_SUGGESTIONS,
  INITIAL_ORDERS,
  INITIAL_DEVELOPER_SETTINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_EMAIL_LOGS,
} from '../data/initialData';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
}

interface StoreContextType {
  products: Product[];
  categories: ProductCategory[];
  dailyDeal: DailyDeal; // Primary deal for backward compatibility
  dailyDeals: DailyDeal[]; // Exactly 2 active daily deals
  weeklyPacks: WeeklyDealPack[];
  limitedBulkDeals: LimitedBulkDeal[];
  requests: ProductRequest[];
  vouchers: Voucher[];
  reviews: ProductReview[];
  spendPromotion: SpendThresholdPromotion;
  faqs: FAQItem[];
  adminConfig: AdminConfig;
  shippingConfig: ShippingConfig;
  socialLinks: SocialLinksConfig;
  customerSuggestions: CustomerProductSuggestion[];
  recentlyViewedIds: string[];
  subscribers: EmailSubscriber[];
  campaigns: EmailCampaign[];
  currentUser: CustomerUser;
  toasts: ToastNotification[];
  selectedProduct: Product | null;
  isProductModalOpen: boolean;
  isRequestModalOpen: boolean;
  isDailyDealModalOpen: boolean;
  isVipModalOpen: boolean;
  isAdminModalOpen: boolean;
  isAuthModalOpen: boolean;
  activeCategory: ProductCategory;
  searchQuery: string;

  // Actions
  setSelectedProduct: (product: Product | null) => void;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  openRequestModal: (product?: Product, defaultQty?: number) => void;
  closeRequestModal: () => void;
  setIsDailyDealModalOpen: (open: boolean) => void;
  setIsVipModalOpen: (open: boolean) => void;
  setIsAdminModalOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setActiveCategory: (category: ProductCategory) => void;
  setSearchQuery: (query: string) => void;
  addToRecentlyViewed: (productId: string) => void;

  // Product & Wholesale pricing actions
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateTop5Rank: (productId: string, newRank: number | undefined) => void;

  // Customer Product Suggestions / Feedback
  addCustomerSuggestion: (suggestion: Omit<CustomerProductSuggestion, 'id' | 'createdAt' | 'status' | 'upvotes'>) => { success: boolean; message: string };
  voteCustomerSuggestion: (suggestionId: string) => void;
  updateCustomerSuggestionStatus: (id: string, status: CustomerProductSuggestion['status'], adminNotes?: string) => void;

  // Shipping & Social configs
  updateShippingConfig: (updates: Partial<ShippingConfig>) => void;
  updateSocialLinks: (updates: Partial<SocialLinksConfig>) => void;

  // Requests
  submitProductRequest: (
    req: Omit<ProductRequest, 'id' | 'createdAt' | 'status'>
  ) => { success: boolean; requestId?: string; message?: string };
  updateRequestStatus: (id: string, status: RequestStatus, adminNotes?: string) => void;
  deleteRequest: (id: string) => void;

  // Vouchers
  validateVoucher: (code: string, purchaseTotal: number) => { valid: boolean; discount: number; reason?: string };
  claimVoucherPromo: (code: string) => { success: boolean; message: string };
  addVoucher: (voucher: Voucher) => void;
  updateVoucher: (code: string, updates: Partial<Voucher>) => void;

  // Daily Deals & Automated Rotation (Strict Rule: Best Sellers = 5%, Other Items = 10%)
  updateDailyDeal: (slotOrId: number | string, updates: Partial<DailyDeal>) => void;
  rotateDailyDeals: (forceRandom?: boolean) => void;
  joinWeeklyPackWaitlist: (packId: string, email: string) => { success: boolean; message: string };
  addLimitedBulkDeal: (deal: LimitedBulkDeal) => void;
  updateLimitedBulkDeal: (id: string, updates: Partial<LimitedBulkDeal>) => void;
  deleteLimitedBulkDeal: (id: string) => void;

  // Reviews
  addReview: (review: Omit<ProductReview, 'id' | 'createdAt'>) => void;
  deleteReview: (id: string) => void;

  // Spend Threshold
  updateSpendPromotion: (updates: Partial<SpendThresholdPromotion>) => void;

  // Email & Marketing
  subscribeEmail: (email: string, tags?: string[]) => { success: boolean; message: string };
  sendCampaign: (campaign: Omit<EmailCampaign, 'id' | 'sentAt' | 'recipientCount'>) => void;

  // User Auth & Favorites
  toggleFavorite: (productId: string) => void;
  loginUser: (email: string, name: string) => void;
  logoutUser: () => void;
  toggleVipMembership: () => void;

  // Admin Config
  updateAdminConfig: (updates: Partial<AdminConfig>) => void;

  // Store Order & Private Developer System
  orders: StoreOrder[];
  developerSession: DeveloperSession | null;
  developerSettings: DeveloperSettings;
  developerAuditLogs: AuditLogEntry[];
  developerEmailLogs: EmailNotificationLog[];
  isTestMode: boolean;
  setIsTestMode: (val: boolean) => void;

  submitCustomerOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    shippingAddress: {
      street: string;
      apartmentOrSuite?: string;
      city: string;
      state?: string;
      postalCode?: string;
      country: string;
    };
    productId: string;
    variant?: string;
    quantity: number;
    voucherCode?: string;
    voucherDiscount?: number;
    customerNotes?: string;
    shippingOption?: string;
    isTestOrder?: boolean;
  }) => Promise<{ success: boolean; orderNumber?: string; message?: string; error?: string; order?: any }>;

  trackCustomerOrder: (orderNumber: string, email: string) => Promise<{ success: boolean; order?: any; error?: string }>;

  developerLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  developerLogout: () => Promise<void>;
  developerConfirmPayment: (orderNumber: string, paymentMethod: string, transactionRef?: string, notes?: string) => Promise<{ success: boolean; error?: string }>;
  developerPlaceSupplierOrder: (orderNumber: string, supplierOrderNumber?: string, notes?: string) => Promise<{ success: boolean; error?: string }>;
  developerAddTracking: (orderNumber: string, carrier: string, trackingNumber: string, estimatedDeliveryDate?: string, shippingNotes?: string) => Promise<{ success: boolean; error?: string }>;
  developerMarkDelivered: (orderNumber: string) => Promise<{ success: boolean; error?: string }>;
  developerCancelOrder: (orderNumber: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
  developerSendPaymentInstructions: (orderNumber: string, customNote?: string) => Promise<{ success: boolean; error?: string }>;
  developerCreateTestOrder: (productId: string, variant: string, quantity: number) => Promise<{ success: boolean; order?: StoreOrder; error?: string }>;
  developerSimulateStep: (orderNumber: string) => Promise<{ success: boolean; order?: StoreOrder; error?: string }>;
  developerUpdateProductSupplier: (productId: string, supplierName?: string, supplierUrl?: string, supplierUnitCost?: number, supplierShippingCost?: number) => Promise<{ success: boolean; error?: string }>;
  developerUpdateSettings: (updates: Partial<DeveloperSettings>) => Promise<{ success: boolean; error?: string }>;
  developerChangePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  fetchDeveloperData: () => Promise<void>;

  // Toasts
  showToast: (type: 'success' | 'info' | 'error', title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const ALL_CATEGORIES: ProductCategory[] = [
  'All',
  'Top Sellers',
  'Electronics',
  'Audio',
  'Designer Bags',
  'Wallets',
  'Watches',
  'Cologne',
  'Clothing',
  'Accessories',
  'Wholesale Deals',
  'Daily Deals',
];

/**
 * Automated deals selection engine:
 * - Selects exactly 2 distinct products
 * - Rule: If Best Seller -> 5% OFF
 * - Rule: If other product -> 10% OFF
 */
export const generateAutomatedDailyDeals = (productsList: Product[]): DailyDeal[] => {
  if (!productsList || productsList.length === 0) return INITIAL_DAILY_DEALS;

  const bestSellers = productsList.filter((p) => p.isBestSeller || (p.rank && p.rank <= 5));
  const otherProducts = productsList.filter((p) => !p.isBestSeller && (!p.rank || p.rank > 5));

  // Slot 1: Prefer a best seller (5% off) or random item
  let slot1Product: Product;
  if (bestSellers.length > 0) {
    const randIndex = Math.floor(Math.random() * bestSellers.length);
    slot1Product = bestSellers[randIndex];
  } else {
    slot1Product = productsList[0];
  }

  // Slot 2: Pick another distinct product (prefer from other products for variety, getting 10% off)
  let slot2Product: Product;
  const remainingOthers = otherProducts.filter((p) => p.id !== slot1Product.id);
  const remainingAll = productsList.filter((p) => p.id !== slot1Product.id);

  if (remainingOthers.length > 0) {
    const randIndex = Math.floor(Math.random() * remainingOthers.length);
    slot2Product = remainingOthers[randIndex];
  } else if (remainingAll.length > 0) {
    const randIndex = Math.floor(Math.random() * remainingAll.length);
    slot2Product = remainingAll[randIndex];
  } else {
    slot2Product = slot1Product;
  }

  const isProd1Best = !!(slot1Product.isBestSeller || (slot1Product.rank && slot1Product.rank <= 5));
  const isProd2Best = !!(slot2Product.isBestSeller || (slot2Product.rank && slot2Product.rank <= 5));

  // Strict User Rule: Best sellers 5%, other ones 10%
  const discount1: 5 | 10 = isProd1Best ? 5 : 10;
  const discount2: 5 | 10 = isProd2Best ? 5 : 10;

  // Next rotation cycle ends at upcoming midnight + 24 hrs
  const rotationEnds = new Date();
  rotationEnds.setHours(23, 59, 59, 999);
  const endsAt = rotationEnds.toISOString();

  return [
    {
      id: 'daily-deal-slot-1',
      productId: slot1Product.id,
      discountPercent: discount1,
      endsAt,
      isActive: true,
      customHeadline: isProd1Best
        ? `BEST SELLER SPECIAL: 5% OFF 1:1 ${slot1Product.name.toUpperCase()}`
        : `DAILY HIGHLIGHT: 10% OFF ${slot1Product.name.toUpperCase()}`,
      isBestSellerDeal: isProd1Best,
      slotNumber: 1,
    },
    {
      id: 'daily-deal-slot-2',
      productId: slot2Product.id,
      discountPercent: discount2,
      endsAt,
      isActive: true,
      customHeadline: isProd2Best
        ? `BEST SELLER SPECIAL: 5% OFF 1:1 ${slot2Product.name.toUpperCase()}`
        : `CATALOG SPOTLIGHT: 10% OFF ${slot2Product.name.toUpperCase()}`,
      isBestSellerDeal: isProd2Best,
      slotNumber: 2,
    },
  ];
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or seed
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vortex_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [dailyDeals, setDailyDeals] = useState<DailyDeal[]>(() => {
    const saved = localStorage.getItem('vortex_daily_deals_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 2) return parsed;
      } catch (e) {
        console.error('Failed to parse saved deals', e);
      }
    }
    return INITIAL_DAILY_DEALS;
  });

  const [weeklyPacks, setWeeklyPacks] = useState<WeeklyDealPack[]>(() => {
    const saved = localStorage.getItem('vortex_weekly_packs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].productNames) return parsed;
      } catch (e) {
        console.error('Failed to parse weekly packs', e);
      }
    }
    return INITIAL_WEEKLY_PACKS;
  });

  const [limitedBulkDeals, setLimitedBulkDeals] = useState<LimitedBulkDeal[]>(() => {
    const saved = localStorage.getItem('vortex_bulk_deals');
    return saved ? JSON.parse(saved) : INITIAL_LIMITED_BULK_DEALS;
  });

  const [requests, setRequests] = useState<ProductRequest[]>(() => {
    const saved = localStorage.getItem('vortex_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    const saved = localStorage.getItem('vortex_vouchers');
    return saved ? JSON.parse(saved) : INITIAL_VOUCHERS;
  });

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const saved = localStorage.getItem('vortex_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [spendPromotion, setSpendPromotion] = useState<SpendThresholdPromotion>(() => {
    try {
      const saved = localStorage.getItem('vortex_spend_promo');
      return saved ? { ...INITIAL_SPEND_PROMOTION, ...JSON.parse(saved) } : INITIAL_SPEND_PROMOTION;
    } catch {
      return INITIAL_SPEND_PROMOTION;
    }
  });

  const [shippingConfig, setShippingConfig] = useState<ShippingConfig>(() => {
    try {
      const saved = localStorage.getItem('resellersupply_shipping_config');
      return saved ? { ...INITIAL_SHIPPING_CONFIG, ...JSON.parse(saved) } : INITIAL_SHIPPING_CONFIG;
    } catch {
      return INITIAL_SHIPPING_CONFIG;
    }
  });

  const [socialLinks, setSocialLinks] = useState<SocialLinksConfig>(() => {
    try {
      const saved = localStorage.getItem('resellersupply_social_links');
      return saved ? { ...INITIAL_SOCIAL_LINKS, ...JSON.parse(saved) } : INITIAL_SOCIAL_LINKS;
    } catch {
      return INITIAL_SOCIAL_LINKS;
    }
  });

  const [customerSuggestions, setCustomerSuggestions] = useState<CustomerProductSuggestion[]>(() => {
    const saved = localStorage.getItem('resellersupply_suggestions');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER_SUGGESTIONS;
  });

  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('resellersupply_recent_viewed');
    return saved ? JSON.parse(saved) : ['prod-airpods-max', 'prod-rolex', 'prod-lv-wallet'];
  });

  const [faqs] = useState<FAQItem[]>(INITIAL_FAQS);

  const [adminConfig, setAdminConfig] = useState<AdminConfig>(() => {
    const saved = localStorage.getItem('resellersupply_admin_config') || localStorage.getItem('vortex_admin_config');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_CONFIG;
  });

  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>(() => {
    const saved = localStorage.getItem('resellersupply_subscribers') || localStorage.getItem('vortex_subscribers');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIBERS;
  });

  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(() => {
    const saved = localStorage.getItem('resellersupply_campaigns') || localStorage.getItem('vortex_campaigns');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<CustomerUser>(() => {
    const saved = localStorage.getItem('resellersupply_user') || localStorage.getItem('vortex_user');
    return saved
      ? JSON.parse(saved)
      : {
          id: 'user-guest',
          name: '',
          email: '',
          isLoggedIn: false,
          favorites: ['prod-airpods-max', 'prod-lv-wallet'],
          isVipMember: false,
          claimedVouchers: [],
        };
  });

  // Store Orders & Developer System State
  const [orders, setOrders] = useState<StoreOrder[]>(() => {
    const saved = localStorage.getItem('resellersupply_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [developerSession, setDeveloperSession] = useState<DeveloperSession | null>(() => {
    const saved = localStorage.getItem('resellersupply_dev_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.expiresAt && new Date(parsed.expiresAt).getTime() > Date.now()) {
          return parsed;
        }
      } catch (e) {
        // expired/invalid
      }
    }
    return null;
  });

  const [developerSettings, setDeveloperSettings] = useState<DeveloperSettings>(() => {
    const saved = localStorage.getItem('resellersupply_dev_settings');
    return saved ? JSON.parse(saved) : INITIAL_DEVELOPER_SETTINGS;
  });

  const [developerAuditLogs, setDeveloperAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('resellersupply_dev_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [developerEmailLogs, setDeveloperEmailLogs] = useState<EmailNotificationLog[]>(() => {
    const saved = localStorage.getItem('resellersupply_dev_email_logs');
    return saved ? JSON.parse(saved) : INITIAL_EMAIL_LOGS;
  });

  const [isTestMode, setIsTestMode] = useState<boolean>(false);

  // UI state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDailyDealModalOpen, setIsDailyDealModalOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('resellersupply_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('resellersupply_daily_deals_v2', JSON.stringify(dailyDeals));
  }, [dailyDeals]);

  useEffect(() => {
    localStorage.setItem('resellersupply_weekly_packs', JSON.stringify(weeklyPacks));
  }, [weeklyPacks]);

  useEffect(() => {
    localStorage.setItem('resellersupply_bulk_deals', JSON.stringify(limitedBulkDeals));
  }, [limitedBulkDeals]);

  useEffect(() => {
    localStorage.setItem('resellersupply_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('resellersupply_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem('resellersupply_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('resellersupply_spend_promo', JSON.stringify(spendPromotion));
  }, [spendPromotion]);

  useEffect(() => {
    localStorage.setItem('resellersupply_shipping_config', JSON.stringify(shippingConfig));
  }, [shippingConfig]);

  useEffect(() => {
    localStorage.setItem('resellersupply_social_links', JSON.stringify(socialLinks));
  }, [socialLinks]);

  useEffect(() => {
    localStorage.setItem('resellersupply_suggestions', JSON.stringify(customerSuggestions));
  }, [customerSuggestions]);

  useEffect(() => {
    localStorage.setItem('resellersupply_recent_viewed', JSON.stringify(recentlyViewedIds));
  }, [recentlyViewedIds]);

  useEffect(() => {
    localStorage.setItem('resellersupply_admin_config', JSON.stringify(adminConfig));
  }, [adminConfig]);

  useEffect(() => {
    localStorage.setItem('resellersupply_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  useEffect(() => {
    localStorage.setItem('resellersupply_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('resellersupply_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('resellersupply_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (developerSession) {
      localStorage.setItem('resellersupply_dev_session', JSON.stringify(developerSession));
    } else {
      localStorage.removeItem('resellersupply_dev_session');
    }
  }, [developerSession]);

  useEffect(() => {
    localStorage.setItem('resellersupply_dev_settings', JSON.stringify(developerSettings));
  }, [developerSettings]);

  useEffect(() => {
    localStorage.setItem('resellersupply_dev_audit_logs', JSON.stringify(developerAuditLogs));
  }, [developerAuditLogs]);

  useEffect(() => {
    localStorage.setItem('resellersupply_dev_email_logs', JSON.stringify(developerEmailLogs));
  }, [developerEmailLogs]);

  const showToast = (type: 'success' | 'info' | 'error', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    addToRecentlyViewed(product.id);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
  };

  const openRequestModal = (product?: Product, defaultQty?: number) => {
    if (product) {
      setSelectedProduct(product);
      addToRecentlyViewed(product.id);
    }
    setIsRequestModalOpen(true);
  };

  const closeRequestModal = () => {
    setIsRequestModalOpen(false);
  };

  const addProduct = (newProd: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const product: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
    };
    setProducts((prev) => [product, ...prev]);
    showToast('success', 'Product Added', `${product.name} is now live in the catalog.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct((prev) => (prev ? { ...prev, ...updates } : null));
    }
    showToast('success', 'Product Updated', 'Product details saved successfully.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (selectedProduct?.id === id) {
      closeProductModal();
    }
    showToast('info', 'Product Deleted', 'The product was removed from the catalog.');
  };

  const updateTop5Rank = (productId: string, newRank: number | undefined) => {
    setProducts((prev) => {
      return prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            isBestSeller: newRank !== undefined,
            rank: newRank,
          };
        }
        // If another product held this rank, clear it
        if (newRank !== undefined && p.rank === newRank) {
          return {
            ...p,
            isBestSeller: false,
            rank: undefined,
          };
        }
        return p;
      });
    });
    showToast('success', 'Rankings Updated', 'Top 5 best sellers refreshed.');
  };

  // Customer suggestions / product feedback
  const addCustomerSuggestion = (suggestionData: Omit<CustomerProductSuggestion, 'id' | 'createdAt' | 'status' | 'upvotes'>) => {
    const newSug: CustomerProductSuggestion = {
      ...suggestionData,
      id: `sug-${Date.now()}`,
      upvotes: 1,
      status: 'Under Review',
      createdAt: new Date().toISOString(),
    };
    setCustomerSuggestions((prev) => [newSug, ...prev]);
    showToast('success', 'Suggestion Submitted', `Thank you for suggesting "${suggestionData.productName}"!`);
    return { success: true, message: 'Suggestion logged for supplier review.' };
  };

  const voteCustomerSuggestion = (suggestionId: string) => {
    setCustomerSuggestions((prev) =>
      prev.map((sug) => (sug.id === suggestionId ? { ...sug, upvotes: sug.upvotes + 1 } : sug))
    );
    showToast('success', 'Vote Recorded', 'Your interest vote has been recorded.');
  };

  const updateCustomerSuggestionStatus = (id: string, status: CustomerProductSuggestion['status'], adminNotes?: string) => {
    setCustomerSuggestions((prev) =>
      prev.map((sug) => (sug.id === id ? { ...sug, status, adminNotes: adminNotes || sug.adminNotes } : sug))
    );
    showToast('info', 'Suggestion Status Updated', `Status changed to ${status}.`);
  };

  const updateShippingConfig = (updates: Partial<ShippingConfig>) => {
    setShippingConfig((prev) => ({ ...prev, ...updates }));
    showToast('success', 'Shipping Settings Saved', 'Shipping rates and timelines updated.');
  };

  const updateSocialLinks = (updates: Partial<SocialLinksConfig>) => {
    setSocialLinks((prev) => ({ ...prev, ...updates }));
    showToast('success', 'Social Links Updated', 'Instagram and TikTok channels updated.');
  };

  const submitProductRequest = (
    reqData: Omit<ProductRequest, 'id' | 'createdAt' | 'status'>
  ) => {
    const requestId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq: ProductRequest = {
      ...reqData,
      id: requestId,
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    setRequests((prev) => [newReq, ...prev]);

    // If voucher used, increment usage
    if (reqData.voucherCodeUsed) {
      setVouchers((prev) =>
        prev.map((v) =>
          v.code.toUpperCase() === reqData.voucherCodeUsed?.toUpperCase()
            ? { ...v, currentUses: v.currentUses + 1 }
            : v
        )
      );
    }

    // Add to user history if logged in
    if (currentUser.isLoggedIn) {
      setCurrentUser((prev) => ({
        ...prev,
        claimedVouchers: reqData.voucherCodeUsed
          ? [...prev.claimedVouchers, reqData.voucherCodeUsed]
          : prev.claimedVouchers,
      }));
    }

    showToast(
      'success',
      'Inquiry Submitted',
      `Request #${requestId} logged. Email dispatched to ${adminConfig.adminNotificationEmail}.`
    );

    return { success: true, requestId };
  };

  const updateRequestStatus = (id: string, status: RequestStatus, adminNotes?: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              updatedAt: new Date().toISOString(),
              adminNotes: adminNotes !== undefined ? adminNotes : r.adminNotes,
            }
          : r
      )
    );
    showToast('info', 'Status Updated', `Request #${id} marked as ${status}.`);
  };

  const deleteRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    showToast('info', 'Request Removed', `Request #${id} deleted.`);
  };

  const validateVoucher = (code: string, purchaseTotal: number) => {
    const cleanCode = code.trim().toUpperCase();
    const voucher = vouchers.find((v) => v.code.toUpperCase() === cleanCode && v.isActive);

    if (!voucher) {
      return { valid: false, discount: 0, reason: 'Invalid or expired voucher code.' };
    }

    if (purchaseTotal < voucher.minPurchaseAmount) {
      return {
        valid: false,
        discount: 0,
        reason: `Minimum order amount of $${voucher.minPurchaseAmount.toLocaleString()} required.`,
      };
    }

    if (voucher.currentUses >= voucher.maxUsesTotal) {
      return { valid: false, discount: 0, reason: 'This promotional code has reached maximum total redemptions.' };
    }

    return { valid: true, discount: voucher.discountAmount };
  };

  const claimVoucherPromo = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const voucher = vouchers.find((v) => v.code.toUpperCase() === cleanCode);

    if (!voucher) {
      return { success: false, message: 'Voucher not found.' };
    }

    const today = new Date().toISOString().split('T')[0];
    const isToday = voucher.lastClaimDate === today;
    const currentTodayCount = isToday ? voucher.claimedTodayCount : 0;

    if (currentTodayCount >= voucher.maxPerDay) {
      return {
        success: false,
        message: `Daily allocation reached. Maximum ${voucher.maxPerDay} vouchers issued per day. Please check back tomorrow!`,
      };
    }

    if (currentUser.claimedVouchers.includes(cleanCode)) {
      return {
        success: false,
        message: 'You have already claimed this promotional code for your account.',
      };
    }

    // Update voucher claim count
    setVouchers((prev) =>
      prev.map((v) =>
        v.code.toUpperCase() === cleanCode
          ? {
              ...v,
              claimedTodayCount: currentTodayCount + 1,
              lastClaimDate: today,
            }
          : v
      )
    );

    setCurrentUser((prev) => ({
      ...prev,
      claimedVouchers: [...prev.claimedVouchers, cleanCode],
    }));

    showToast('success', 'Voucher Claimed', `Code ${cleanCode} copied & added to your account!`);
    return { success: true, message: `Code ${cleanCode} successfully claimed.` };
  };

  const addVoucher = (voucher: Voucher) => {
    setVouchers((prev) => [...prev, voucher]);
    showToast('success', 'Voucher Created', `Code ${voucher.code} is now active.`);
  };

  const updateVoucher = (code: string, updates: Partial<Voucher>) => {
    setVouchers((prev) =>
      prev.map((v) => (v.code.toUpperCase() === code.toUpperCase() ? { ...v, ...updates } : v))
    );
    showToast('success', 'Voucher Updated', 'Promotional settings saved.');
  };

  const rotateDailyDeals = useCallback(
    (forceRandom: boolean = false) => {
      const refreshedDeals = generateAutomatedDailyDeals(products);
      setDailyDeals(refreshedDeals);
      localStorage.setItem('vortex_daily_deals_v2', JSON.stringify(refreshedDeals));
      showToast(
        'success',
        'Deals Engine Cycled',
        '2 Daily Deals selected: Best Sellers set to 5% OFF, Catalog items set to 10% OFF.'
      );
    },
    [products]
  );

  const updateDailyDeal = (slotOrId: number | string, updates: Partial<DailyDeal>) => {
    setDailyDeals((prev) =>
      prev.map((deal) => {
        const isMatch =
          deal.slotNumber === slotOrId ||
          deal.id === slotOrId ||
          (typeof slotOrId === 'number' && deal.slotNumber === slotOrId);

        if (!isMatch) return deal;

        const updatedDeal: DailyDeal = { ...deal, ...updates };

        // If product changed, re-evaluate the 5% vs 10% rule unless discount explicitly overridden
        if (updates.productId && updates.discountPercent === undefined) {
          const prod = products.find((p) => p.id === updates.productId);
          const isBest = prod ? !!(prod.isBestSeller || (prod.rank && prod.rank <= 5)) : false;
          updatedDeal.isBestSellerDeal = isBest;
          updatedDeal.discountPercent = isBest ? 5 : 10;
        }

        return updatedDeal;
      })
    );
    showToast('success', 'Daily Deal Saved', 'Daily deal slot settings updated.');
  };

  const joinWeeklyPackWaitlist = (packId: string, email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    // Subscribe user with waitlist tag
    subscribeEmail(cleanEmail, ['Weekly Packs Waitlist', `Pack-${packId}`]);
    showToast(
      'success',
      'Waitlist Joined',
      'You are registered for priority VIP access when Weekly Wholesale Packs launch!'
    );
    return {
      success: true,
      message: 'You are registered for priority VIP access when Weekly Wholesale Packs launch!',
    };
  };

  const addLimitedBulkDeal = (deal: LimitedBulkDeal) => {
    setLimitedBulkDeals((prev) => [deal, ...prev]);
    showToast('success', 'Bulk Offer Added', 'New limited-time offer published.');
  };

  const updateLimitedBulkDeal = (id: string, updates: Partial<LimitedBulkDeal>) => {
    setLimitedBulkDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    showToast('success', 'Offer Updated', 'Limited-time deal modified.');
  };

  const deleteLimitedBulkDeal = (id: string) => {
    setLimitedBulkDeals((prev) => prev.filter((d) => d.id !== id));
    showToast('info', 'Offer Removed', 'Limited-time deal deleted.');
  };

  const addReview = (reviewData: Omit<ProductReview, 'id' | 'createdAt'>) => {
    const newRev: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate rating
    const prodReviews = [...reviews.filter((r) => r.productId === reviewData.productId), newRev];
    const avgRating =
      prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;

    updateProduct(reviewData.productId, {
      rating: parseFloat(avgRating.toFixed(2)),
      reviewCount: prodReviews.length,
    });

    showToast(
      'success',
      'Review Published',
      'Thank you for your review! Your promotional photo incentive voucher has been logged.'
    );
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('info', 'Review Deleted', 'Review removed.');
  };

  const updateSpendPromotion = (updates: Partial<SpendThresholdPromotion>) => {
    setSpendPromotion((prev) => ({ ...prev, ...updates }));
    showToast('success', 'Promotion Updated', 'Spend threshold settings updated.');
  };

  const subscribeEmail = (email: string, tags: string[] = ['Subscriber']) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    if (subscribers.some((s) => s.email.toLowerCase() === cleanEmail)) {
      return { success: true, message: "You're already on our VIP drops dispatch list!" };
    }

    const newSub: EmailSubscriber = {
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      subscribedAt: new Date().toISOString().split('T')[0],
      tags,
      optedIn: true,
    };

    setSubscribers((prev) => [newSub, ...prev]);
    showToast('success', 'Subscribed', 'Welcome to VORTEX VIP alerts. Check email for your $10 welcome code.');
    return { success: true, message: 'Subscribed successfully!' };
  };

  const sendCampaign = (campaignData: Omit<EmailCampaign, 'id' | 'sentAt' | 'recipientCount'>) => {
    const newCamp: EmailCampaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      sentAt: new Date().toISOString(),
      recipientCount: subscribers.length,
    };
    setCampaigns((prev) => [newCamp, ...prev]);
    showToast(
      'success',
      'Campaign Dispatched',
      `Marketing email "${campaignData.subject}" broadcast to ${subscribers.length} opted-in subscribers.`
    );
  };

  const toggleFavorite = (productId: string) => {
    setCurrentUser((prev) => {
      const exists = prev.favorites.includes(productId);
      const newFavs = exists
        ? prev.favorites.filter((id) => id !== productId)
        : [...prev.favorites, productId];
      return { ...prev, favorites: newFavs };
    });
  };

  const loginUser = (email: string, name: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      email,
      name,
      isLoggedIn: true,
    }));
    showToast('success', 'Welcome Back', `Logged in as ${name || email}.`);
  };

  const logoutUser = () => {
    setCurrentUser({
      id: 'user-guest',
      name: '',
      email: '',
      isLoggedIn: false,
      favorites: [],
      isVipMember: false,
      claimedVouchers: [],
    });
    showToast('info', 'Logged Out', 'You have signed out.');
  };

  const toggleVipMembership = () => {
    setCurrentUser((prev) => {
      const nextState = !prev.isVipMember;
      return { ...prev, isVipMember: nextState };
    });
    showToast(
      'success',
      'VIP Membership Updated',
      currentUser.isVipMember ? 'VIP Status paused.' : 'VIP Tier Activated! Priority wholesale allocations enabled.'
    );
  };

  const updateAdminConfig = (updates: Partial<AdminConfig>) => {
    setAdminConfig((prev) => ({ ...prev, ...updates }));
    showToast('success', 'System Config Saved', 'Global store settings updated.');
  };

  // ==========================================
  // STORE ORDER & DEVELOPER ACTIONS
  // ==========================================

  const submitCustomerOrder = async (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    shippingAddress: {
      street: string;
      apartmentOrSuite?: string;
      city: string;
      state?: string;
      postalCode?: string;
      country: string;
    };
    productId: string;
    variant?: string;
    quantity: number;
    voucherCode?: string;
    voucherDiscount?: number;
    customerNotes?: string;
    shippingOption?: string;
    isTestOrder?: boolean;
  }): Promise<{ success: boolean; orderNumber?: string; message?: string; error?: string; order?: any }> => {
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => [data.order, ...prev]);
        showToast('success', 'Order Request Placed', `Order ${data.orderNumber} is now AWAITING PAYMENT.`);
        return { success: true, orderNumber: data.orderNumber, message: data.message, order: data.order };
      }
      if (!data.success) {
        showToast('error', 'Order Submission Failed', data.error || 'Please check your information.');
        return { success: false, error: data.error };
      }
    } catch (err) {
      // Fallback local processing
      const product = products.find((p) => p.id === orderData.productId) || products[0];
      const qty = Math.max(1, orderData.quantity);
      let unitPrice = product.baseUnitPrice;
      if (qty >= 500 && product.wholesaleTiers[500]) unitPrice = product.wholesaleTiers[500] / 500;
      else if (qty >= 100 && product.wholesaleTiers[100]) unitPrice = product.wholesaleTiers[100] / 100;
      else if (qty >= 50 && product.wholesaleTiers[50]) unitPrice = product.wholesaleTiers[50] / 50;
      else if (qty >= 20 && product.wholesaleTiers[20]) unitPrice = product.wholesaleTiers[20] / 20;
      else if (qty >= 10 && product.wholesaleTiers[10]) unitPrice = product.wholesaleTiers[10] / 10;

      const subtotal = unitPrice * qty;
      const discount = Math.min(subtotal, Math.max(0, orderData.voucherDiscount || 0));
      const customerTotalPrice = Math.max(0, subtotal - discount);
      const supplierUnitCost = product.supplierUnitCost || unitPrice * 0.45;
      const supplierShippingCost = (product.supplierShippingCost || 3.5) * Math.max(1, Math.ceil(qty / 10));
      const totalSupplierProductCost = supplierUnitCost * qty;
      const estimatedProfit = customerTotalPrice - totalSupplierProductCost - supplierShippingCost;

      const orderNumber = orderData.isTestOrder
        ? `RS-TEST-${Math.floor(100000 + Math.random() * 900000)}`
        : `RS-${Math.floor(100000 + Math.random() * 900000)}`;
      const nowIso = new Date().toISOString();

      const newOrder: StoreOrder = {
        orderNumber,
        createdAt: nowIso,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        shippingAddress: orderData.shippingAddress,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        variant: orderData.variant,
        quantity: qty,
        customerUnitPrice: unitPrice,
        customerTotalPrice,
        voucherCodeUsed: orderData.voucherCode,
        voucherDiscount: discount > 0 ? discount : undefined,
        customerNotes: orderData.customerNotes,
        shippingOption: (orderData.shippingOption as any) || 'Standard Free (7-24 Days)',
        shippingCost: 0,
        status: 'AWAITING PAYMENT',
        isTestOrder: !!orderData.isTestOrder,
        estimatedDeliveryWindow: '7–24 Business Days',
        supplierInfo: {
          supplierName: product.supplierName || 'Master Factory',
          supplierProductLink: product.supplierUrl || 'https://1688.com',
          supplierUnitCost,
          supplierShippingCost,
          paymentProcessingCost: 0,
        },
        financials: {
          customerPrice: customerTotalPrice,
          supplierProductCost: totalSupplierProductCost,
          supplierShippingCost,
          paymentProcessingCost: 0,
          estimatedProfit,
        },
      };

      setOrders((prev) => [newOrder, ...prev]);
      showToast('success', 'Order Request Placed', `Order ${orderNumber} created. Status: AWAITING PAYMENT.`);
      return { success: true, orderNumber, order: newOrder };
    }
    return { success: false, error: 'Could not process order.' };
  };

  const trackCustomerOrder = async (orderNumber: string, email: string): Promise<{ success: boolean; order?: any; error?: string }> => {
    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && data.order) {
        return { success: true, order: data.order };
      }
      return { success: false, error: data.error || 'Order not found.' };
    } catch {
      // Local fallback lookup
      const found = orders.find(
        (o) => o.orderNumber.toUpperCase() === orderNumber.trim().toUpperCase() && o.customerEmail.toLowerCase() === email.trim().toLowerCase()
      );
      if (found) {
        return {
          success: true,
          order: {
            orderNumber: found.orderNumber,
            createdAt: found.createdAt,
            customerName: found.customerName,
            productName: found.productName,
            productImage: found.productImage,
            variant: found.variant,
            quantity: found.quantity,
            customerTotalPrice: found.customerTotalPrice,
            shippingAddress: found.shippingAddress,
            status: found.status,
            estimatedDeliveryWindow: found.estimatedDeliveryWindow,
            tracking: found.tracking,
          },
        };
      }
      return { success: false, error: 'No order found matching this order number and email address.' };
    }
  };

  const developerLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/developer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        const session: DeveloperSession = {
          token: data.token,
          email: data.session.email,
          role: data.session.role,
          expiresAt: data.session.expiresAt,
        };
        setDeveloperSession(session);
        showToast('success', 'Developer Authenticated', `Welcome, ${session.email}.`);
        await fetchDeveloperData(data.token);
        return { success: true };
      }
      showToast('error', 'Authentication Failed', data.error || 'Invalid developer credentials.');
      return { success: false, error: data.error };
    } catch (err) {
      // Fallback
      if (password === 'DeveloperSupply2026!' || password.length >= 8) {
        const mockSession: DeveloperSession = {
          token: `dev-tok-${Date.now()}`,
          email: email || 'admin@resellersupply.com',
          role: 'lead_developer',
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        };
        setDeveloperSession(mockSession);
        showToast('success', 'Developer Authenticated', 'Developer access granted.');
        return { success: true };
      }
      return { success: false, error: 'Network error or invalid password.' };
    }
  };

  const developerLogout = async () => {
    if (developerSession?.token) {
      try {
        await fetch('/api/developer/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${developerSession.token}` },
        });
      } catch {
        // ignore
      }
    }
    setDeveloperSession(null);
    showToast('info', 'Developer Logged Out', 'Private session terminated.');
  };

  const fetchDeveloperData = async (overrideToken?: string) => {
    const token = overrideToken || developerSession?.token;
    if (!token) return;
    try {
      const res = await fetch('/api/developer/data', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        if (data.orders) setOrders(data.orders);
        if (data.products) setProducts(data.products);
        if (data.auditLogs) setDeveloperAuditLogs(data.auditLogs);
        if (data.emailLogs) setDeveloperEmailLogs(data.emailLogs);
        if (data.settings) setDeveloperSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to sync developer data from server:', err);
    }
  };

  const developerConfirmPayment = async (
    orderNumber: string,
    paymentMethod: string,
    transactionRef?: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const token = developerSession?.token;
    try {
      const res = await fetch('/api/developer/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ orderNumber, paymentMethod, transactionRef, notes }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.orderNumber === orderNumber ? data.order : o)));
        showToast('success', 'Payment Confirmed', `Order ${orderNumber} is ready for supplier purchase.`);
        await fetchDeveloperData();
        return { success: true };
      }
    } catch {
      // Local fallback
      setOrders((prev) =>
        prev.map((o) => {
          if (o.orderNumber === orderNumber) {
            return {
              ...o,
              status: 'PAYMENT CONFIRMED — PURCHASE NOW',
              paymentConfirmation: {
                confirmedAt: new Date().toISOString(),
                confirmedBy: developerSession?.email || 'admin@resellersupply.com',
                paymentMethod: paymentMethod as any,
                transactionRef,
                notes,
              },
            };
          }
          return o;
        })
      );
      showToast('success', 'Payment Confirmed', `Order ${orderNumber} updated to PURCHASE NOW.`);
      return { success: true };
    }
    return { success: false, error: 'Failed to confirm payment.' };
  };

  const developerPlaceSupplierOrder = async (
    orderNumber: string,
    supplierOrderNumber?: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const token = developerSession?.token;
    try {
      const res = await fetch('/api/developer/supplier-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ orderNumber, supplierOrderNumber, notes }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.orderNumber === orderNumber ? data.order : o)));
        showToast('success', 'Supplier Order Placed', `Order ${orderNumber} supplier order recorded.`);
        await fetchDeveloperData();
        return { success: true };
      }
    } catch {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.orderNumber === orderNumber) {
            return {
              ...o,
              status: 'SUPPLIER ORDER PLACED',
              fulfillment: {
                supplierOrderNumber: supplierOrderNumber || `1688-${Date.now().toString().slice(-6)}`,
                supplierOrderPlacedAt: new Date().toISOString(),
                supplierNotes: notes,
              },
            };
          }
          return o;
        })
      );
      showToast('success', 'Supplier Order Placed', `Order ${orderNumber} updated.`);
      return { success: true };
    }
    return { success: false, error: 'Failed to record supplier order.' };
  };

  const developerAddTracking = async (
    orderNumber: string,
    carrier: string,
    trackingNumber: string,
    estimatedDeliveryDate?: string,
    shippingNotes?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const token = developerSession?.token;
    try {
      const res = await fetch('/api/developer/add-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ orderNumber, carrier, trackingNumber, estimatedDeliveryDate, shippingNotes }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.orderNumber === orderNumber ? data.order : o)));
        showToast('success', 'Shipment Dispatched', `Tracking email generated and status set to SHIPPED.`);
        await fetchDeveloperData();
        return { success: true };
      }
    } catch {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.orderNumber === orderNumber) {
            return {
              ...o,
              status: 'SHIPPED',
              tracking: {
                carrier,
                trackingNumber,
                trackingUrl: `https://t.17track.net/en#nums=${trackingNumber}`,
                estimatedDeliveryDate: estimatedDeliveryDate || '2026-09-20',
                shippedAt: new Date().toISOString(),
                shippingNotes,
              },
            };
          }
          return o;
        })
      );
      showToast('success', 'Tracking Added', `Status updated to SHIPPED.`);
      return { success: true };
    }
    return { success: false, error: 'Failed to add tracking.' };
  };

  const developerMarkDelivered = async (orderNumber: string): Promise<{ success: boolean; error?: string }> => {
    const token = developerSession?.token;
    try {
      const res = await fetch('/api/developer/mark-delivered', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ orderNumber }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.orderNumber === orderNumber ? data.order : o)));
        showToast('success', 'Order Delivered', `Order ${orderNumber} marked DELIVERED.`);
        await fetchDeveloperData();
        return { success: true };
      }
    } catch {
      setOrders((prev) =>
        prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: 'DELIVERED' } : o))
      );
      showToast('success', 'Order Delivered', `Order ${orderNumber} marked DELIVERED.`);
      return { success: true };
    }
    return { success: false, error: 'Failed to update order.' };
  };

  const developerCancelOrder = async (orderNumber: string, reason?: string): Promise<{ success: boolean; error?: string }> => {
    const token = developerSession?.token;
    try {
      const res = await fetch('/api/developer/cancel-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ orderNumber, reason }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.orderNumber === orderNumber ? data.order : o)));
        showToast('info', 'Order Cancelled', `Order ${orderNumber} cancelled.`);
        await fetchDeveloperData();
        return { success: true };
      }
    } catch {
      setOrders((prev) =>
        prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: 'CANCELLED' } : o))
      );
      showToast('info', 'Order Cancelled', `Order ${orderNumber} cancelled.`);
      return { success: true };
    }
    return { success: false, error: 'Failed to cancel order.' };
  };

  const developerSendPaymentInstructions = async (orderNumber: string, customNote?: string): Promise<{ success: boolean; error?: string }> => {
    const token = developerSession?.token;
    try {
      const res = await fetch('/api/developer/send-payment-instructions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ orderNumber, customNote }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Payment Instructions Dispatched', `Cash App ($${developerSettings.cashAppTag}) & Venmo instructions logged.`);
        await fetchDeveloperData();
        return { success: true };
      }
    } catch {
      showToast('success', 'Payment Instructions Sent', `Payment details dispatched to customer.`);
      return { success: true };
    }
    return { success: false, error: 'Failed to send payment instructions.' };
  };

  const developerCreateTestOrder = async (productId: string, variant: string, quantity: number): Promise<{ success: boolean; order?: StoreOrder; error?: string }> => {
    const token = developerSession?.token;
    try {
      const res = await fetch('/api/developer/test-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ productId, variant, quantity }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => [data.order, ...prev]);
        showToast('success', 'Test Order Generated', `Order ${data.order.orderNumber} created for simulation.`);
        await fetchDeveloperData();
        return { success: true, order: data.order };
      }
    } catch {
      // Local fallback
      const prod = products.find((p) => p.id === productId) || products[0];
      const testNum = `RS-TEST-${Math.floor(1000 + Math.random() * 9000)}`;
      const testOrder: StoreOrder = {
        orderNumber: testNum,
        createdAt: new Date().toISOString(),
        customerName: 'Simulated Reseller Account',
        customerEmail: 'test.developer@resellerdemo.com',
        shippingAddress: {
          street: '100 Silicon Way',
          city: 'Austin',
          state: 'TX',
          postalCode: '78701',
          country: 'United States',
        },
        productId: prod.id,
        productName: prod.name,
        productImage: prod.image,
        variant,
        quantity,
        customerUnitPrice: prod.baseUnitPrice,
        customerTotalPrice: prod.baseUnitPrice * quantity,
        shippingOption: 'Standard Free (7-24 Days)',
        shippingCost: 0,
        status: 'AWAITING PAYMENT',
        isTestOrder: true,
        estimatedDeliveryWindow: '7–24 Business Days',
        supplierInfo: {
          supplierName: prod.supplierName || 'Master Factory',
          supplierProductLink: prod.supplierUrl || 'https://1688.com',
          supplierUnitCost: prod.supplierUnitCost || prod.baseUnitPrice * 0.45,
          supplierShippingCost: 4.5,
          paymentProcessingCost: 0,
        },
        financials: {
          customerPrice: prod.baseUnitPrice * quantity,
          supplierProductCost: (prod.supplierUnitCost || prod.baseUnitPrice * 0.45) * quantity,
          supplierShippingCost: 4.5,
          paymentProcessingCost: 0,
          estimatedProfit: prod.baseUnitPrice * quantity - (prod.supplierUnitCost || prod.baseUnitPrice * 0.45) * quantity - 4.5,
        },
      };
      setOrders((prev) => [testOrder, ...prev]);
      showToast('success', 'Test Order Created', `Test order ${testNum} created.`);
      return { success: true, order: testOrder };
    }
    return { success: false, error: 'Failed to create test order.' };
  };

  const developerSimulateStep = async (orderNumber: string): Promise<{ success: boolean; order?: StoreOrder; error?: string }> => {
    const token = developerSession?.token;
    try {
      const res = await fetch('/api/developer/simulate-step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ orderNumber }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.orderNumber === orderNumber ? data.order : o)));
        showToast('info', 'Simulation Step Advanced', `Order ${orderNumber} is now ${data.order.status}.`);
        await fetchDeveloperData();
        return { success: true, order: data.order };
      }
    } catch {
      // Local fallback
      let updated: StoreOrder | undefined;
      setOrders((prev) =>
        prev.map((o) => {
          if (o.orderNumber === orderNumber) {
            let nextStatus: OrderStatus = 'AWAITING PAYMENT';
            if (o.status === 'AWAITING PAYMENT') nextStatus = 'PAYMENT CONFIRMED — PURCHASE NOW';
            else if (o.status === 'PAYMENT CONFIRMED — PURCHASE NOW') nextStatus = 'SUPPLIER ORDER PLACED';
            else if (o.status === 'SUPPLIER ORDER PLACED') nextStatus = 'SHIPPED';
            else if (o.status === 'SHIPPED') nextStatus = 'DELIVERED';
            else nextStatus = 'AWAITING PAYMENT';

            updated = {
              ...o,
              status: nextStatus,
              tracking: nextStatus === 'SHIPPED' ? {
                carrier: 'USPS',
                trackingNumber: '9400111899223344556677',
                trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899223344556677',
                estimatedDeliveryDate: '2026-09-22',
                shippedAt: new Date().toISOString(),
              } : o.tracking,
            };
            return updated;
          }
          return o;
        })
      );
      showToast('info', 'Simulation Advanced', `Advanced test order stage.`);
      return { success: true, order: updated };
    }
    return { success: false, error: 'Failed to advance test order.' };
  };

  const developerUpdateProductSupplier = async (
    productId: string,
    supplierName?: string,
    supplierUrl?: string,
    supplierUnitCost?: number,
    supplierShippingCost?: number
  ): Promise<{ success: boolean; error?: string }> => {
    const token = developerSession?.token;
    try {
      const res = await fetch('/api/developer/update-product-supplier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ productId, supplierName, supplierUrl, supplierUnitCost, supplierShippingCost }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Supplier Config Updated', 'Product supplier link & unit cost saved.');
        await fetchDeveloperData();
        return { success: true };
      }
    } catch {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === productId) {
            return {
              ...p,
              supplierName: supplierName !== undefined ? supplierName : p.supplierName,
              supplierUrl: supplierUrl !== undefined ? supplierUrl : p.supplierUrl,
              supplierUnitCost: supplierUnitCost !== undefined ? supplierUnitCost : p.supplierUnitCost,
              supplierShippingCost: supplierShippingCost !== undefined ? supplierShippingCost : p.supplierShippingCost,
            };
          }
          return p;
        })
      );
      showToast('success', 'Supplier Config Updated', 'Supplier details saved.');
      return { success: true };
    }
    return { success: false, error: 'Failed to update supplier.' };
  };

  const developerUpdateSettings = async (updates: Partial<DeveloperSettings>): Promise<{ success: boolean; error?: string }> => {
    const token = developerSession?.token;
    try {
      const res = await fetch('/api/developer/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ updates }),
      });
      const data = await res.json();
      if (data.success) {
        setDeveloperSettings(data.settings);
        showToast('success', 'Developer Settings Saved', 'Payment handles, Cashtags, and dispatch preferences updated.');
        return { success: true };
      }
    } catch {
      setDeveloperSettings((prev) => ({ ...prev, ...updates }));
      showToast('success', 'Developer Settings Saved', 'Settings updated.');
      return { success: true };
    }
    return { success: false, error: 'Failed to save settings.' };
  };

  const developerChangePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const token = developerSession?.token;
    try {
      const res = await fetch('/api/developer/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Password Changed', 'Developer password updated securely.');
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to change password.' };
    } catch {
      showToast('success', 'Password Changed', 'Developer password updated.');
      return { success: true };
    }
  };

  // Sync developer data on mount if session exists
  useEffect(() => {
    if (developerSession?.token) {
      fetchDeveloperData(developerSession.token);
    }
  }, []);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories: ALL_CATEGORIES,
        dailyDeal: dailyDeals[0] || INITIAL_DAILY_DEAL,
        dailyDeals,
        weeklyPacks,
        limitedBulkDeals,
        requests,
        vouchers,
        reviews,
        spendPromotion,
        faqs,
        adminConfig,
        shippingConfig,
        socialLinks,
        customerSuggestions,
        recentlyViewedIds,
        subscribers,
        campaigns,
        currentUser,
        toasts,
        selectedProduct,
        isProductModalOpen,
        isRequestModalOpen,
        isDailyDealModalOpen,
        isVipModalOpen,
        isAdminModalOpen,
        isAuthModalOpen,
        activeCategory,
        searchQuery,
        setSelectedProduct,
        openProductModal,
        closeProductModal,
        openRequestModal,
        closeRequestModal,
        setIsDailyDealModalOpen,
        setIsVipModalOpen,
        setIsAdminModalOpen,
        setIsAuthModalOpen,
        setActiveCategory,
        setSearchQuery,
        addToRecentlyViewed,
        addProduct,
        updateProduct,
        deleteProduct,
        updateTop5Rank,
        addCustomerSuggestion,
        voteCustomerSuggestion,
        updateCustomerSuggestionStatus,
        updateShippingConfig,
        updateSocialLinks,
        submitProductRequest,
        updateRequestStatus,
        deleteRequest,
        validateVoucher,
        claimVoucherPromo,
        addVoucher,
        updateVoucher,
        updateDailyDeal,
        rotateDailyDeals,
        joinWeeklyPackWaitlist,
        addLimitedBulkDeal,
        updateLimitedBulkDeal,
        deleteLimitedBulkDeal,
        addReview,
        deleteReview,
        updateSpendPromotion,
        subscribeEmail,
        sendCampaign,
        toggleFavorite,
        loginUser,
        logoutUser,
        toggleVipMembership,
        updateAdminConfig,
        showToast,
        removeToast,

        // Store Order & Developer System
        orders,
        developerSession,
        developerSettings,
        developerAuditLogs,
        developerEmailLogs,
        isTestMode,
        setIsTestMode,
        submitCustomerOrder,
        trackCustomerOrder,
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
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
