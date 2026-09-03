export type ProductCategory =
  | 'All'
  | 'Top Sellers'
  | 'Electronics'
  | 'Audio'
  | 'Designer Bags'
  | 'Wallets'
  | 'Watches'
  | 'Cologne'
  | 'Clothing'
  | 'Accessories'
  | 'Wholesale Deals'
  | 'Daily Deals';

export interface WholesaleTiers {
  [units: number]: number; // e.g. { 10: 950, 20: 1880, 50: 4550, 100: 9050, 500: 46250 }
}

export interface ProductSpec {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subCategory?: string;
  baseUnitPrice: number; // for 1-unit or base starting price
  wholesaleTiers: WholesaleTiers;
  image: string;
  additionalImages: string[];
  videoUrl?: string;
  videoPoster?: string;
  shortExplanation: string; // e.g. "Popular for bulk orders and competitive volume pricing."
  potentialValue: string; // e.g. "High resale demand and consistent turnover rates in tech and apparel."
  description: string;
  overview?: string;
  importantFeatures?: string[];
  availableOptions?: string[];
  conditionDetails?: string;
  specifications: ProductSpec[];
  isBestSeller?: boolean;
  isNewlyAdded?: boolean;
  rank?: number; // 1 to 5
  stockStatus: 'In Stock' | 'Low Stock' | 'Pre-Order';
  unitsAvailable: number;
  qualityGrade: string; // e.g. "Premium Master Batch Edition"
  authenticityNotice: string; // Verifiable accurate product description
  rating: number;
  reviewCount: number;
  relatedProductIds?: string[];
  // Internal Supplier Attributes (Developer Only)
  supplierName?: string;
  supplierUrl?: string;
  supplierUnitCost?: number;
  supplierShippingCost?: number;
}

export type OrderStatus =
  | 'AWAITING PAYMENT'
  | 'PAYMENT CONFIRMED — PURCHASE NOW'
  | 'SUPPLIER ORDER PLACED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface ShippingAddress {
  street: string;
  apartmentOrSuite?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface OrderFinancials {
  customerPrice: number;
  supplierProductCost: number;
  supplierShippingCost: number;
  paymentProcessingCost: number;
  estimatedProfit: number;
}

export interface StoreOrder {
  orderNumber: string; // e.g. "RS-849201"
  createdAt: string; // ISO
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: ShippingAddress;
  productId: string;
  productName: string;
  productImage: string;
  variant?: string;
  quantity: number;
  customerUnitPrice: number;
  customerTotalPrice: number;
  voucherCodeUsed?: string;
  voucherDiscount?: number;
  customerNotes?: string;
  shippingOption: 'Standard Free (7-24 Days)' | 'Expedited Express (3-5 Days)';
  shippingCost: number;
  status: OrderStatus;
  isTestOrder: boolean;
  estimatedDeliveryWindow: string; // e.g. "September 12 – September 29 (7–24 Days)"
  supplierInfo: {
    supplierName: string;
    supplierProductLink: string;
    supplierUnitCost: number;
    supplierShippingCost: number;
    paymentProcessingCost: number;
    supplierOrderNumber?: string;
    supplierOrderPlacedAt?: string;
  };
  financials: OrderFinancials;
  paymentConfirmation?: {
    confirmedAt: string;
    confirmedBy: string;
    paymentMethod: 'Cash App' | 'Venmo' | 'Zelle' | 'Bank Wire' | 'Manual';
    transactionRef?: string;
    notes?: string;
  };
  fulfillment?: {
    supplierOrderNumber?: string;
    supplierOrderPlacedAt?: string;
    supplierNotes?: string;
  };
  tracking?: {
    carrier: string;
    trackingNumber: string;
    trackingUrl?: string;
    estimatedDeliveryDate: string;
    shippedAt: string;
    shippingNotes?: string;
    deliveredAt?: string;
  };
  emailLogs?: Array<{
    id: string;
    timestamp: string;
    type: 'CUSTOMER_CONFIRMATION' | 'BUSINESS_NEW_ORDER' | 'PAYMENT_INSTRUCTIONS' | 'SHIPPING_NOTIFICATION' | 'ADMIN_REPLY';
    recipient: string;
    subject: string;
    body: string;
  }>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  orderNumber?: string;
  adminAccount: string;
  details: string;
  ipAddress?: string;
}

export interface EmailNotificationLog {
  id: string;
  timestamp: string;
  orderNumber?: string;
  recipient: string;
  subject: string;
  type: string;
  status: 'Dispatched' | 'Delivered' | 'Queued';
  previewText: string;
  htmlBody: string;
}

export interface DeveloperSettings {
  businessEmail: string;
  cashAppTag: string;
  venmoHandle: string;
  paymentInstructions: string;
  defaultSupplierShippingCost: number;
  defaultPaymentProcessingPercent: number;
  minEstimatedDeliveryDays: number;
  maxEstimatedDeliveryDays: number;
  ipWhitelistEnabled: boolean;
  whitelistedIps: string[];
}

export interface DeveloperSession {
  token: string;
  email: string;
  role: 'lead_developer' | 'administrator';
  expiresAt: string;
}

export interface CustomerProductSuggestion {
  id: string;
  productName: string;
  category: string;
  brandOrStyle?: string;
  targetPrice?: number;
  notes?: string;
  additionalDetails?: string;
  customerName?: string;
  customerEmail?: string;
  upvotes: number;
  votes?: number;
  status: 'Under Review' | 'Sourcing In Progress' | 'Added to Catalog' | 'Sourcing from Factory';
  createdAt: string;
  adminNotes?: string;
}

export interface ShippingConfig {
  freeShippingEligible: boolean;
  freeShippingMinimum: number; // 0 for always free standard
  standardShippingPrice: number; // $0.00
  standardDeliveryDays: string; // "7-24 Business Days"
  expeditedShippingPrice: number; // $10 - $20 e.g. $15.00
  expeditedDeliveryDays: string; // "3-5 Business Days"
  availableRegions: string[];
}

export interface SocialLinksConfig {
  instagramHandle: string;
  instagramUrl: string;
  tiktokHandle: string;
  tiktokUrl: string;
  communityFollowers: string;
}

export interface DailyDeal {
  id: string;
  productId: string;
  discountPercent: 5 | 10; // strictly 5% for best sellers, 10% for other products
  endsAt: string; // ISO string or timestamp
  isActive: boolean;
  customHeadline?: string;
  isBestSellerDeal?: boolean; // true if best seller (5% off), false if catalog standard (10% off)
  slotNumber: 1 | 2; // Exactly 2 daily deals active
}

export interface WeeklyDealPack {
  id: string;
  name: string;
  categoryTag: string;
  productIds: string[];
  productNames: string[];
  targetQuantityPerSku: number;
  estimatedRetailValue: number;
  estimatedBundlePrice: number;
  projectedDiscountPercent: number;
  image: string;
  description: string;
  status: 'Coming Soon' | 'In Factory Curation' | 'Pricing Review';
  estimatedLaunchText: string;
}

export interface LimitedBulkDeal {
  id: string;
  title: string;
  productId: string;
  requiredQuantity: number;
  discountAmount: number; // e.g. $20 off
  startTime: string;
  endTime: string;
  maxRedemptions: number;
  currentRedemptions: number;
  isActive: boolean;
  tagline: string;
}

export type RequestStatus = 'New' | 'Contacted' | 'Processing' | 'Completed' | 'Cancelled';

export interface ProductRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  voucherCodeUsed?: string;
  voucherDiscount?: number;
  customerMessage?: string;
  shippingCountry?: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt?: string;
  adminNotes?: string;
}

export interface Voucher {
  code: string;
  discountAmount: number; // in USD e.g. $10
  minPurchaseAmount: number;
  expirationDate: string;
  maxUsesTotal: number;
  currentUses: number;
  maxPerDay: number; // Default 3
  claimedTodayCount: number;
  lastClaimDate: string; // YYYY-MM-DD
  isActive: boolean;
  description: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  rating: number; // 1-5
  reviewText: string;
  photoUrl?: string;
  createdAt: string;
  verifiedBuyer: boolean;
  honestIncentiveReceived: boolean;
}

export interface SpendThresholdPromotion {
  id: string;
  minSpendAmount: number;
  freeItemName: string;
  freeItemImage: string;
  description: string;
  inventoryAvailable: number;
  startDate: string;
  endDate: string;
  maxRedemptions: number;
  currentRedemptions: number;
  isActive: boolean;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  tags: string[];
  optedIn: boolean;
}

export interface EmailCampaign {
  id: string;
  subject: string;
  templateType: 'New Products' | 'Daily Deals' | 'Weekly Deals' | 'Coupon Codes' | 'Limited-Time Offers';
  headline: string;
  body: string;
  ctaText: string;
  ctaLink: string;
  sentAt: string;
  recipientCount: number;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
  favorites: string[]; // product IDs
  isVipMember: boolean;
  claimedVouchers: string[];
}

export interface AdminConfig {
  adminNotificationEmail: string;
  allowDiscountStacking: boolean;
  enableSubscriptionSystem: boolean;
  allowReviewPhotoIncentive: boolean;
  bannerNotice: string;
  showBannerNotice: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Ordering' | 'Wholesale' | 'Shipping';
}
