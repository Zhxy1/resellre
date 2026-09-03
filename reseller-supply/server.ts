import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_EMAIL_LOGS,
  INITIAL_DEVELOPER_SETTINGS,
} from './src/data/initialData';
import {
  StoreOrder,
  OrderStatus,
  Product,
  AuditLogEntry,
  EmailNotificationLog,
  DeveloperSettings,
} from './src/types';

// ==========================================
// SECURE DEVELOPER CREDENTIALS & CRYPTOGRAPHY
// ==========================================

interface DeveloperAccount {
  email: string;
  passwordHash: string;
  salt: string;
  role: 'lead_developer' | 'administrator';
  lastLogin?: string;
}

interface ActiveSession {
  token: string;
  email: string;
  role: 'lead_developer' | 'administrator';
  createdAt: number;
  expiresAt: number;
}

// In-Memory Secure State (Persisted across requests during server lifecycle)
let serverProducts: Product[] = [...INITIAL_PRODUCTS];
let serverOrders: StoreOrder[] = [...INITIAL_ORDERS];
let serverAuditLogs: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];
let serverEmailLogs: EmailNotificationLog[] = [...INITIAL_EMAIL_LOGS];
let serverSettings: DeveloperSettings = { ...INITIAL_DEVELOPER_SETTINGS };

const activeSessions = new Map<string, ActiveSession>();
const loginAttemptTracker = new Map<string, { attempts: number; lockedUntil: number }>();

// Password Hashing Utility using PBKDF2 (10,000 iterations + 32-byte salt)
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(32).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, actualSalt, 10000, 64, 'sha512');
  return {
    hash: derivedKey.toString('hex'),
    salt: actualSalt,
  };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const { hash: computedHash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(hash, 'hex'));
}

// Initialize default developer account
const defaultDevEmail = (process.env.DEVELOPER_EMAIL || 'admin@resellersupply.com').toLowerCase().trim();
const defaultDevPass = process.env.DEVELOPER_INITIAL_PASSWORD || 'DeveloperSupply2026!';
const initialCredentials = hashPassword(defaultDevPass);

let developerAccount: DeveloperAccount = {
  email: defaultDevEmail,
  passwordHash: initialCredentials.hash,
  salt: initialCredentials.salt,
  role: 'lead_developer',
};

// Rate limiting utility (Max 5 failed attempts per 15 minutes)
function checkRateLimit(ip: string): { allowed: boolean; remainingSeconds?: number } {
  const record = loginAttemptTracker.get(ip);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingSeconds };
  }

  if (record.lockedUntil <= now && record.attempts >= 5) {
    loginAttemptTracker.delete(ip);
  }

  return { allowed: true };
}

function recordFailedLogin(ip: string) {
  const now = Date.now();
  const record = loginAttemptTracker.get(ip) || { attempts: 0, lockedUntil: 0 };
  record.attempts += 1;
  if (record.attempts >= 5) {
    record.lockedUntil = now + 15 * 60 * 1000; // 15 min lock
  }
  loginAttemptTracker.set(ip, record);
}

function recordSuccessfulLogin(ip: string) {
  loginAttemptTracker.delete(ip);
}

// Generate Secure Session Token
function createSession(email: string, role: 'lead_developer' | 'administrator'): ActiveSession {
  const token = crypto.randomBytes(48).toString('hex');
  const now = Date.now();
  const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours

  const session: ActiveSession = {
    token,
    email,
    role,
    createdAt: now,
    expiresAt,
  };
  activeSessions.set(token, session);
  return session;
}

// Authentication Middleware for Developer API Endpoints
function requireDeveloperAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or invalid developer authorization token.',
    });
  }

  const token = authHeader.substring(7).trim();
  const session = activeSessions.get(token);

  if (!session) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Session expired or invalid.',
    });
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Developer session has expired. Please log in again.',
    });
  }

  (req as any).developer = session;
  next();
}

// Helper: Calculate 7-24 Business Days Delivery Estimate
function calculateDeliveryWindow(minDays = 7, maxDays = 24): string {
  const start = new Date();
  start.setDate(start.getDate() + minDays);

  const end = new Date();
  end.setDate(end.getDate() + maxDays);

  const formatOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const startStr = start.toLocaleDateString('en-US', formatOptions);
  const endStr = end.toLocaleDateString('en-US', { ...formatOptions, year: 'numeric' });

  return `${startStr} – ${endStr} (${minDays}–${maxDays} Business Days)`;
}

// Helper: Carrier Tracking URL Generator
function getCarrierTrackingUrl(carrier: string, trackingNumber: string): string {
  const cleanTracking = trackingNumber.trim();
  const normalized = carrier.toLowerCase();

  if (normalized.includes('usps')) {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(cleanTracking)}`;
  }
  if (normalized.includes('ups')) {
    return `https://www.ups.com/track?tracknum=${encodeURIComponent(cleanTracking)}`;
  }
  if (normalized.includes('fedex')) {
    return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(cleanTracking)}`;
  }
  if (normalized.includes('dhl')) {
    return `https://www.dhl.com/en/express/tracking.html?AWB=${encodeURIComponent(cleanTracking)}`;
  }
  return `https://t.17track.net/en#nums=${encodeURIComponent(cleanTracking)}`;
}

// ==========================================
// EXPRESS SERVER SETUP
// ==========================================

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with limit
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Basic API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ==========================================
  // PUBLIC ORDER SYSTEM ENDPOINTS
  // ==========================================

  /**
   * POST /api/orders/create
   * Public endpoint for customer wholesale order requests
   * Securely calculates internal supplier profit server-side and assigns "AWAITING PAYMENT"
   */
  app.post('/api/orders/create', (req, res) => {
    try {
      const {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        productId,
        variant,
        quantity,
        voucherCode,
        voucherDiscount = 0,
        customerNotes,
        shippingOption = 'Standard Free (7-24 Days)',
        isTestOrder = false,
      } = req.body;

      if (!customerName || !customerEmail || !shippingAddress || !productId || !quantity) {
        return res.status(400).json({
          success: false,
          error: 'Missing required order fields (Customer Name, Email, Address, Product, Quantity).',
        });
      }

      if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.country) {
        return res.status(400).json({
          success: false,
          error: 'Please provide complete shipping details (Street Address, City, Country).',
        });
      }

      const product = serverProducts.find((p) => p.id === productId);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Selected product not found in catalog.' });
      }

      const qty = Math.max(1, parseInt(quantity, 10) || 1);

      // Calculate wholesale unit price
      let unitPrice = product.baseUnitPrice;
      if (qty >= 500 && product.wholesaleTiers[500]) unitPrice = product.wholesaleTiers[500] / 500;
      else if (qty >= 100 && product.wholesaleTiers[100]) unitPrice = product.wholesaleTiers[100] / 100;
      else if (qty >= 50 && product.wholesaleTiers[50]) unitPrice = product.wholesaleTiers[50] / 50;
      else if (qty >= 20 && product.wholesaleTiers[20]) unitPrice = product.wholesaleTiers[20] / 20;
      else if (qty >= 10 && product.wholesaleTiers[10]) unitPrice = product.wholesaleTiers[10] / 10;

      const subtotal = unitPrice * qty;
      const discount = Math.min(subtotal, Math.max(0, Number(voucherDiscount) || 0));
      const shippingCost = shippingOption.includes('Expedited') ? 15 : 0;
      const customerTotalPrice = Math.max(0, subtotal - discount + shippingCost);

      // Internal Server-Side Supplier Calculations (Hidden from customer)
      const supplierUnitCost = product.supplierUnitCost || unitPrice * 0.45;
      const supplierShippingCost = (product.supplierShippingCost || 3.5) * Math.max(1, Math.ceil(qty / 10));
      const totalSupplierProductCost = supplierUnitCost * qty;
      const paymentProcessingCost = (customerTotalPrice * (serverSettings.defaultPaymentProcessingPercent || 0)) / 100;
      const estimatedProfit = customerTotalPrice - totalSupplierProductCost - supplierShippingCost - paymentProcessingCost;

      // Generate Unique Order Number
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const orderNumber = isTestOrder ? `RS-TEST-${randomSuffix}` : `RS-${randomSuffix}`;
      const nowIso = new Date().toISOString();
      const estimatedDeliveryWindow = calculateDeliveryWindow(
        serverSettings.minEstimatedDeliveryDays || 7,
        serverSettings.maxEstimatedDeliveryDays || 24
      );

      const newOrder: StoreOrder = {
        orderNumber,
        createdAt: nowIso,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone ? customerPhone.trim() : undefined,
        shippingAddress: {
          street: shippingAddress.street.trim(),
          apartmentOrSuite: shippingAddress.apartmentOrSuite ? shippingAddress.apartmentOrSuite.trim() : undefined,
          city: shippingAddress.city.trim(),
          state: shippingAddress.state ? shippingAddress.state.trim() : '',
          postalCode: shippingAddress.postalCode ? shippingAddress.postalCode.trim() : '',
          country: shippingAddress.country.trim(),
        },
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        variant: variant || undefined,
        quantity: qty,
        customerUnitPrice: unitPrice,
        customerTotalPrice,
        voucherCodeUsed: voucherCode || undefined,
        voucherDiscount: discount > 0 ? discount : undefined,
        customerNotes: customerNotes ? customerNotes.trim() : undefined,
        shippingOption: shippingOption as any,
        shippingCost,
        status: 'AWAITING PAYMENT',
        isTestOrder,
        estimatedDeliveryWindow,
        supplierInfo: {
          supplierName: product.supplierName || 'Verified Master Manufacturer',
          supplierProductLink: product.supplierUrl || 'https://1688.com',
          supplierUnitCost,
          supplierShippingCost,
          paymentProcessingCost,
        },
        financials: {
          customerPrice: customerTotalPrice,
          supplierProductCost: totalSupplierProductCost,
          supplierShippingCost,
          paymentProcessingCost,
          estimatedProfit,
        },
        emailLogs: [],
      };

      // 1. Log Business Alert Email Payload
      const businessEmailPayload: EmailNotificationLog = {
        id: `elog-${Date.now()}-biz`,
        timestamp: nowIso,
        orderNumber,
        recipient: serverSettings.businessEmail,
        subject: `[NEW WHOLESALE ORDER] ${orderNumber} - ${product.name} (${qty} units)`,
        type: 'BUSINESS_ALERT',
        status: 'Dispatched',
        previewText: `Customer: ${customerName} | Total: $${customerTotalPrice.toFixed(2)} | Est Profit: $${estimatedProfit.toFixed(2)}`,
        htmlBody: `
<h3>[NEW WHOLESALE ORDER] ${orderNumber}</h3>
<p><strong>ORDER NUMBER:</strong> ${orderNumber}</p>
<p><strong>CUSTOMER NAME:</strong> ${customerName}</p>
<p><strong>CUSTOMER EMAIL:</strong> ${customerEmail}</p>
<p><strong>SHIPPING ADDRESS:</strong> ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state || ''} ${shippingAddress.postalCode || ''}, ${shippingAddress.country}</p>
<p><strong>PRODUCT:</strong> ${product.name} (${product.id})</p>
<p><strong>VARIANT:</strong> ${variant || 'Standard'}</p>
<p><strong>QUANTITY:</strong> ${qty} units</p>
<p><strong>CUSTOMER PRICE:</strong> $${customerTotalPrice.toFixed(2)}</p>
<p><strong>SUPPLIER PRODUCT COST:</strong> $${totalSupplierProductCost.toFixed(2)} ($${supplierUnitCost.toFixed(2)}/unit)</p>
<p><strong>ESTIMATED PROFIT:</strong> $${estimatedProfit.toFixed(2)}</p>
<p><strong>SUPPLIER LINK:</strong> <a href="${product.supplierUrl || '#'}">${product.supplierName || 'Supplier Link'}</a></p>
<p><strong>STATUS:</strong> AWAITING PAYMENT</p>
        `,
      };

      // 2. Log Customer Received Email Payload (Awaiting Payment Instructions)
      const customerEmailPayload: EmailNotificationLog = {
        id: `elog-${Date.now()}-cust`,
        timestamp: nowIso,
        orderNumber,
        recipient: customerEmail,
        subject: `Order Request Received: ${orderNumber} [Awaiting Payment Instructions]`,
        type: 'CUSTOMER_CONFIRMATION',
        status: 'Dispatched',
        previewText: `Your order request ${orderNumber} has been received. Official payment instructions will be sent shortly.`,
        htmlBody: `
<h3>Thank you for your order request with Reseller Supply!</h3>
<p>Your order request <strong>${orderNumber}</strong> has been received by our wholesale dispatch team.</p>
<p><strong>Product:</strong> ${product.name} (${variant || 'Standard'}) x ${qty} units</p>
<p><strong>Pro-Forma Total:</strong> $${customerTotalPrice.toFixed(2)}</p>
<p><strong>Delivery Window:</strong> ${estimatedDeliveryWindow}</p>
<p><strong>Current Status:</strong> AWAITING PAYMENT</p>
<hr/>
<p><em>Please note: Payment instructions will be dispatched to this email address. Once verified via Cash App or Venmo, your tracking number will be queued immediately.</em></p>
        `,
      };

      serverEmailLogs.unshift(businessEmailPayload, customerEmailPayload);
      newOrder.emailLogs = [
        {
          id: businessEmailPayload.id,
          timestamp: nowIso,
          type: 'BUSINESS_NEW_ORDER',
          recipient: serverSettings.businessEmail,
          subject: businessEmailPayload.subject,
          body: businessEmailPayload.previewText,
        },
        {
          id: customerEmailPayload.id,
          timestamp: nowIso,
          type: 'CUSTOMER_CONFIRMATION',
          recipient: customerEmail,
          subject: customerEmailPayload.subject,
          body: customerEmailPayload.previewText,
        },
      ];

      // Add to server orders list
      serverOrders.unshift(newOrder);

      // Audit Log
      serverAuditLogs.unshift({
        id: `audit-${Date.now()}`,
        timestamp: nowIso,
        action: 'ORDER_SUBMITTED',
        orderNumber,
        adminAccount: 'system',
        details: `Customer ${customerName} submitted order request for ${qty}x ${product.name}. Status: AWAITING PAYMENT.`,
        ipAddress: req.ip || '127.0.0.1',
      });

      // Customer-safe response (Hides internal costs and supplier links)
      return res.status(201).json({
        success: true,
        orderNumber,
        message: 'Order request received successfully. Awaiting payment instructions.',
        order: {
          orderNumber: newOrder.orderNumber,
          createdAt: newOrder.createdAt,
          customerName: newOrder.customerName,
          customerEmail: newOrder.customerEmail,
          productName: newOrder.productName,
          productImage: newOrder.productImage,
          variant: newOrder.variant,
          quantity: newOrder.quantity,
          customerTotalPrice: newOrder.customerTotalPrice,
          shippingAddress: newOrder.shippingAddress,
          status: newOrder.status,
          estimatedDeliveryWindow: newOrder.estimatedDeliveryWindow,
        },
      });
    } catch (err: any) {
      console.error('Order creation error:', err);
      return res.status(500).json({ success: false, error: 'Internal server error while processing order request.' });
    }
  });

  /**
   * GET /api/orders/track
   * Public endpoint allowing customers to look up order status with Order # + Email
   */
  app.get('/api/orders/track', (req, res) => {
    try {
      const orderNumber = (req.query.orderNumber as string || '').trim().toUpperCase();
      const email = (req.query.email as string || '').trim().toLowerCase();

      if (!orderNumber || !email) {
        return res.status(400).json({
          success: false,
          error: 'Please provide both your Order Number and Customer Email to track your order.',
        });
      }

      const order = serverOrders.find(
        (o) => o.orderNumber.toUpperCase() === orderNumber && o.customerEmail.toLowerCase() === email
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'No order found matching this Order Number and Email address. Please double-check your receipt.',
        });
      }

      // Return ONLY customer-safe data
      return res.json({
        success: true,
        order: {
          orderNumber: order.orderNumber,
          createdAt: order.createdAt,
          customerName: order.customerName,
          productName: order.productName,
          productImage: order.productImage,
          variant: order.variant,
          quantity: order.quantity,
          customerTotalPrice: order.customerTotalPrice,
          shippingAddress: order.shippingAddress,
          status: order.status,
          estimatedDeliveryWindow: order.estimatedDeliveryWindow,
          tracking: order.tracking
            ? {
                carrier: order.tracking.carrier,
                trackingNumber: order.tracking.trackingNumber,
                trackingUrl: order.tracking.trackingUrl,
                estimatedDeliveryDate: order.tracking.estimatedDeliveryDate,
                shippedAt: order.tracking.shippedAt,
                shippingNotes: order.tracking.shippingNotes,
                deliveredAt: order.tracking.deliveredAt,
              }
            : undefined,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'Failed to look up order tracking.' });
    }
  });

  // ==========================================
  // PRIVATE DEVELOPER AUTHENTICATION ENDPOINTS
  // ==========================================

  /**
   * POST /api/developer/login
   * Authenticates developer with email & password with brute-force protection
   */
  app.post('/api/developer/login', (req, res) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const rateCheck = checkRateLimit(clientIp);

    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: `Too many failed login attempts. Developer portal access temporarily locked for ${rateCheck.remainingSeconds} seconds.`,
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Developer email and password are required.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (
      normalizedEmail !== developerAccount.email ||
      !verifyPassword(password, developerAccount.passwordHash, developerAccount.salt)
    ) {
      recordFailedLogin(clientIp);
      serverAuditLogs.unshift({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'FAILED_LOGIN_ATTEMPT',
        adminAccount: normalizedEmail,
        details: `Failed developer login attempt from IP ${clientIp}.`,
        ipAddress: clientIp,
      });

      return res.status(401).json({
        success: false,
        error: 'Invalid developer credentials. Access denied.',
      });
    }

    // Success!
    recordSuccessfulLogin(clientIp);
    const session = createSession(developerAccount.email, developerAccount.role);
    developerAccount.lastLogin = new Date().toISOString();

    serverAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'DEVELOPER_LOGIN_SUCCESS',
      adminAccount: developerAccount.email,
      details: `Developer logged in securely from IP ${clientIp}. Session token issued.`,
      ipAddress: clientIp,
    });

    return res.json({
      success: true,
      token: session.token,
      session: {
        email: session.email,
        role: session.role,
        expiresAt: new Date(session.expiresAt).toISOString(),
      },
    });
  });

  /**
   * POST /api/developer/logout
   */
  app.post('/api/developer/logout', requireDeveloperAuth, (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      activeSessions.delete(token);
    }
    return res.json({ success: true, message: 'Developer session logged out successfully.' });
  });

  /**
   * GET /api/developer/session
   * Validates active session
   */
  app.get('/api/developer/session', requireDeveloperAuth, (req, res) => {
    const dev = (req as any).developer as ActiveSession;
    return res.json({
      success: true,
      session: {
        email: dev.email,
        role: dev.role,
        expiresAt: new Date(dev.expiresAt).toISOString(),
      },
    });
  });

  /**
   * POST /api/developer/change-password
   * Updates developer password with salt + PBKDF2 hash
   */
  app.post('/api/developer/change-password', requireDeveloperAuth, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Current password and new password are required.' });
    }

    if (!verifyPassword(currentPassword, developerAccount.passwordHash, developerAccount.salt)) {
      return res.status(400).json({ success: false, error: 'Current password verification failed.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'New password must be at least 8 characters long.' });
    }

    const { hash, salt } = hashPassword(newPassword);
    developerAccount.passwordHash = hash;
    developerAccount.salt = salt;

    serverAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'PASSWORD_CHANGED',
      adminAccount: developerAccount.email,
      details: 'Developer master password updated securely.',
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.json({ success: true, message: 'Developer password updated successfully.' });
  });

  // ==========================================
  // PROTECTED DEVELOPER DASHBOARD ENDPOINTS
  // ==========================================

  /**
   * GET /api/developer/data
   * Returns complete developer state: orders, products, financials, email logs, audit logs, settings
   */
  app.get('/api/developer/data', requireDeveloperAuth, (req, res) => {
    // Financial aggregations
    let totalRevenue = 0;
    let totalSupplierCost = 0;
    let totalSupplierShipping = 0;
    let totalEstimatedProfit = 0;

    serverOrders.forEach((o) => {
      if (o.status !== 'CANCELLED') {
        totalRevenue += o.financials.customerPrice;
        totalSupplierCost += o.financials.supplierProductCost;
        totalSupplierShipping += o.financials.supplierShippingCost;
        totalEstimatedProfit += o.financials.estimatedProfit;
      }
    });

    const netMarginPercent = totalRevenue > 0 ? (totalEstimatedProfit / totalRevenue) * 100 : 0;

    return res.json({
      success: true,
      orders: serverOrders,
      products: serverProducts,
      auditLogs: serverAuditLogs,
      emailLogs: serverEmailLogs,
      settings: serverSettings,
      financials: {
        totalRevenue,
        totalSupplierCost,
        totalSupplierShipping,
        totalEstimatedProfit,
        netMarginPercent,
        totalOrdersCount: serverOrders.length,
        awaitingPaymentCount: serverOrders.filter((o) => o.status === 'AWAITING PAYMENT').length,
        purchaseNowCount: serverOrders.filter((o) => o.status === 'PAYMENT CONFIRMED — PURCHASE NOW').length,
        supplierPlacedCount: serverOrders.filter((o) => o.status === 'SUPPLIER ORDER PLACED').length,
        shippedCount: serverOrders.filter((o) => o.status === 'SHIPPED').length,
        deliveredCount: serverOrders.filter((o) => o.status === 'DELIVERED').length,
      },
    });
  });

  /**
   * POST /api/developer/confirm-payment
   * Administrator confirms payment received via Cash App, Venmo, Zelle, etc.
   * Sets status to "PAYMENT CONFIRMED — PURCHASE NOW"
   */
  app.post('/api/developer/confirm-payment', requireDeveloperAuth, (req, res) => {
    const dev = (req as any).developer as ActiveSession;
    const { orderNumber, paymentMethod = 'Cash App', transactionRef, notes } = req.body;

    const order = serverOrders.find((o) => o.orderNumber === orderNumber);
    if (!order) {
      return res.status(404).json({ success: false, error: `Order ${orderNumber} not found.` });
    }

    const nowIso = new Date().toISOString();
    order.status = 'PAYMENT CONFIRMED — PURCHASE NOW';
    order.paymentConfirmation = {
      confirmedAt: nowIso,
      confirmedBy: dev.email,
      paymentMethod,
      transactionRef,
      notes,
    };

    // Audit log
    serverAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: nowIso,
      action: 'PAYMENT_CONFIRMED',
      orderNumber,
      adminAccount: dev.email,
      details: `Payment confirmed via ${paymentMethod} (${transactionRef || 'No Ref'}). Status set to PAYMENT CONFIRMED — PURCHASE NOW.`,
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.json({ success: true, order });
  });

  /**
   * POST /api/developer/supplier-order
   * Marks supplier order placed with PO/Order #
   * Sets status to "SUPPLIER ORDER PLACED"
   */
  app.post('/api/developer/supplier-order', requireDeveloperAuth, (req, res) => {
    const dev = (req as any).developer as ActiveSession;
    const { orderNumber, supplierOrderNumber, notes } = req.body;

    const order = serverOrders.find((o) => o.orderNumber === orderNumber);
    if (!order) {
      return res.status(404).json({ success: false, error: `Order ${orderNumber} not found.` });
    }

    const nowIso = new Date().toISOString();
    order.status = 'SUPPLIER ORDER PLACED';
    order.fulfillment = {
      supplierOrderNumber: supplierOrderNumber || `SUP-${Date.now().toString().slice(-6)}`,
      supplierOrderPlacedAt: nowIso,
      supplierNotes: notes,
    };
    if (order.supplierInfo) {
      order.supplierInfo.supplierOrderNumber = order.fulfillment.supplierOrderNumber;
      order.supplierInfo.supplierOrderPlacedAt = nowIso;
    }

    // Audit log
    serverAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: nowIso,
      action: 'SUPPLIER_ORDER_PLACED',
      orderNumber,
      adminAccount: dev.email,
      details: `Supplier order placed. Supplier PO: ${order.fulfillment.supplierOrderNumber}.`,
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.json({ success: true, order });
  });

  /**
   * POST /api/developer/add-tracking
   * Adds carrier, tracking number, and dispatches customer shipping email
   * Sets status to "SHIPPED"
   */
  app.post('/api/developer/add-tracking', requireDeveloperAuth, (req, res) => {
    const dev = (req as any).developer as ActiveSession;
    const { orderNumber, carrier = 'USPS', trackingNumber, estimatedDeliveryDate, shippingNotes } = req.body;

    if (!trackingNumber) {
      return res.status(400).json({ success: false, error: 'Tracking number is required.' });
    }

    const order = serverOrders.find((o) => o.orderNumber === orderNumber);
    if (!order) {
      return res.status(404).json({ success: false, error: `Order ${orderNumber} not found.` });
    }

    const nowIso = new Date().toISOString();
    const trackingUrl = getCarrierTrackingUrl(carrier, trackingNumber);

    order.status = 'SHIPPED';
    order.tracking = {
      carrier,
      trackingNumber: trackingNumber.trim(),
      trackingUrl,
      estimatedDeliveryDate: estimatedDeliveryDate || new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      shippedAt: nowIso,
      shippingNotes,
    };

    // Automated Shipping Confirmation Email Payload to Customer
    const shippingEmailPayload: EmailNotificationLog = {
      id: `elog-${Date.now()}-ship`,
      timestamp: nowIso,
      orderNumber,
      recipient: order.customerEmail,
      subject: `Your Order ${orderNumber} Has Shipped! [Tracking: ${trackingNumber}]`,
      type: 'SHIPPING_NOTIFICATION',
      status: 'Dispatched',
      previewText: `Carrier: ${carrier} | Tracking Number: ${trackingNumber} | Estimated Delivery: ${order.tracking.estimatedDeliveryDate}`,
      htmlBody: `
<h3>Your Wholesale Package Is On Its Way!</h3>
<p>Hello ${order.customerName},</p>
<p>Your order <strong>${orderNumber}</strong> (${order.productName} x ${order.quantity}) has been dispatched via <strong>${carrier}</strong>.</p>
<p><strong>Tracking Number:</strong> <a href="${trackingUrl}">${trackingNumber}</a></p>
<p><strong>Estimated Delivery:</strong> ${order.tracking.estimatedDeliveryDate}</p>
<p>Track your shipment directly at: <a href="${trackingUrl}">${trackingUrl}</a></p>
      `,
    };

    serverEmailLogs.unshift(shippingEmailPayload);
    order.emailLogs = order.emailLogs || [];
    order.emailLogs.unshift({
      id: shippingEmailPayload.id,
      timestamp: nowIso,
      type: 'SHIPPING_NOTIFICATION',
      recipient: order.customerEmail,
      subject: shippingEmailPayload.subject,
      body: shippingEmailPayload.previewText,
    });

    // Audit log
    serverAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: nowIso,
      action: 'SHIPPING_TRACKING_DISPATCHED',
      orderNumber,
      adminAccount: dev.email,
      details: `Added ${carrier} tracking ${trackingNumber}. Shipping email dispatched to ${order.customerEmail}. Status: SHIPPED.`,
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.json({ success: true, order });
  });

  /**
   * POST /api/developer/mark-delivered
   * Sets status to "DELIVERED"
   */
  app.post('/api/developer/mark-delivered', requireDeveloperAuth, (req, res) => {
    const dev = (req as any).developer as ActiveSession;
    const { orderNumber } = req.body;

    const order = serverOrders.find((o) => o.orderNumber === orderNumber);
    if (!order) {
      return res.status(404).json({ success: false, error: `Order ${orderNumber} not found.` });
    }

    const nowIso = new Date().toISOString();
    order.status = 'DELIVERED';
    if (order.tracking) {
      order.tracking.deliveredAt = nowIso;
    }

    serverAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: nowIso,
      action: 'ORDER_DELIVERED',
      orderNumber,
      adminAccount: dev.email,
      details: `Order marked as successfully DELIVERED.`,
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.json({ success: true, order });
  });

  /**
   * POST /api/developer/cancel-order
   */
  app.post('/api/developer/cancel-order', requireDeveloperAuth, (req, res) => {
    const dev = (req as any).developer as ActiveSession;
    const { orderNumber, reason } = req.body;

    const order = serverOrders.find((o) => o.orderNumber === orderNumber);
    if (!order) {
      return res.status(404).json({ success: false, error: `Order ${orderNumber} not found.` });
    }

    order.status = 'CANCELLED';

    serverAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'ORDER_CANCELLED',
      orderNumber,
      adminAccount: dev.email,
      details: `Order cancelled. Reason: ${reason || 'Customer request / Inventory adjustment'}.`,
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.json({ success: true, order });
  });

  /**
   * POST /api/developer/send-payment-instructions
   * Sends/logs payment instructions (Cash App / Venmo) to customer
   */
  app.post('/api/developer/send-payment-instructions', requireDeveloperAuth, (req, res) => {
    const dev = (req as any).developer as ActiveSession;
    const { orderNumber, customNote } = req.body;

    const order = serverOrders.find((o) => o.orderNumber === orderNumber);
    if (!order) {
      return res.status(404).json({ success: false, error: `Order ${orderNumber} not found.` });
    }

    const nowIso = new Date().toISOString();
    const instructions = `${serverSettings.paymentInstructions}\n\n${customNote ? `Admin Note: ${customNote}\n\n` : ''}Order Number: ${order.orderNumber}\nAmount Due: $${order.customerTotalPrice.toFixed(2)}`;

    const emailLog: EmailNotificationLog = {
      id: `elog-${Date.now()}-payinst`,
      timestamp: nowIso,
      orderNumber,
      recipient: order.customerEmail,
      subject: `Payment Instructions for Order ${orderNumber} [Total: $${order.customerTotalPrice.toFixed(2)}]`,
      type: 'PAYMENT_INSTRUCTIONS',
      status: 'Dispatched',
      previewText: `Cash App Tag: ${serverSettings.cashAppTag} | Venmo: ${serverSettings.venmoHandle} | Amount: $${order.customerTotalPrice.toFixed(2)}`,
      htmlBody: `
<pre style="font-family: monospace; white-space: pre-wrap;">${instructions}</pre>
      `,
    };

    serverEmailLogs.unshift(emailLog);
    order.emailLogs = order.emailLogs || [];
    order.emailLogs.unshift({
      id: emailLog.id,
      timestamp: nowIso,
      type: 'PAYMENT_INSTRUCTIONS',
      recipient: order.customerEmail,
      subject: emailLog.subject,
      body: emailLog.previewText,
    });

    serverAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: nowIso,
      action: 'PAYMENT_INSTRUCTIONS_SENT',
      orderNumber,
      adminAccount: dev.email,
      details: `Payment instructions dispatched to ${order.customerEmail}.`,
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.json({ success: true, message: 'Payment instructions dispatched successfully.' });
  });

  /**
   * POST /api/developer/test-order
   * Generates a fully-formed test order for testing the fulfillment workflow
   */
  app.post('/api/developer/test-order', requireDeveloperAuth, (req, res) => {
    const dev = (req as any).developer as ActiveSession;
    const { productId = 'prod-airpods-max', variant = 'Space Gray', quantity = 10 } = req.body;

    const product = serverProducts.find((p) => p.id === productId) || serverProducts[0];
    const qty = Math.max(1, parseInt(quantity, 10) || 10);
    const unitPrice = product.wholesaleTiers[10] ? product.wholesaleTiers[10] / 10 : product.baseUnitPrice;
    const totalPrice = unitPrice * qty;
    const supplierUnitCost = product.supplierUnitCost || 45;
    const supplierShippingCost = (product.supplierShippingCost || 4.5) * Math.max(1, Math.ceil(qty / 10));
    const totalSupplierCost = supplierUnitCost * qty;
    const estimatedProfit = totalPrice - totalSupplierCost - supplierShippingCost;

    const testOrderNumber = `RS-TEST-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    const testOrder: StoreOrder = {
      orderNumber: testOrderNumber,
      createdAt: nowIso,
      customerName: 'Simulated Test Reseller',
      customerEmail: 'test.buyer@resellerdemo.com',
      customerPhone: '+1 (555) 019-2834',
      shippingAddress: {
        street: '100 Innovation Way',
        apartmentOrSuite: 'Suite 500',
        city: 'Dallas',
        state: 'TX',
        postalCode: '75001',
        country: 'United States',
      },
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      variant,
      quantity: qty,
      customerUnitPrice: unitPrice,
      customerTotalPrice: totalPrice,
      shippingOption: 'Standard Free (7-24 Days)',
      shippingCost: 0,
      status: 'AWAITING PAYMENT',
      isTestOrder: true,
      estimatedDeliveryWindow: calculateDeliveryWindow(7, 24),
      supplierInfo: {
        supplierName: product.supplierName || 'Verified Factory Lab',
        supplierProductLink: product.supplierUrl || 'https://1688.com',
        supplierUnitCost,
        supplierShippingCost,
        paymentProcessingCost: 0,
      },
      financials: {
        customerPrice: totalPrice,
        supplierProductCost: totalSupplierCost,
        supplierShippingCost,
        paymentProcessingCost: 0,
        estimatedProfit,
      },
    };

    serverOrders.unshift(testOrder);

    serverAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: nowIso,
      action: 'TEST_ORDER_CREATED',
      orderNumber: testOrderNumber,
      adminAccount: dev.email,
      details: `Generated test order ${testOrderNumber} for workflow simulation.`,
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.json({ success: true, order: testOrder });
  });

  /**
   * POST /api/developer/simulate-step
   * Automatically advances a test order through the lifecycle
   */
  app.post('/api/developer/simulate-step', requireDeveloperAuth, (req, res) => {
    const dev = (req as any).developer as ActiveSession;
    const { orderNumber } = req.body;

    const order = serverOrders.find((o) => o.orderNumber === orderNumber);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Test order not found.' });
    }

    const nowIso = new Date().toISOString();

    if (order.status === 'AWAITING PAYMENT') {
      order.status = 'PAYMENT CONFIRMED — PURCHASE NOW';
      order.paymentConfirmation = {
        confirmedAt: nowIso,
        confirmedBy: dev.email,
        paymentMethod: 'Cash App',
        transactionRef: `SIM-CAS-${Date.now().toString().slice(-4)}`,
        notes: 'Simulated payment auto-confirmation.',
      };
    } else if (order.status === 'PAYMENT CONFIRMED — PURCHASE NOW') {
      order.status = 'SUPPLIER ORDER PLACED';
      order.fulfillment = {
        supplierOrderNumber: `1688-SIM-${Date.now().toString().slice(-6)}`,
        supplierOrderPlacedAt: nowIso,
        supplierNotes: 'Simulated factory order dispatch.',
      };
      if (order.supplierInfo) {
        order.supplierInfo.supplierOrderNumber = order.fulfillment.supplierOrderNumber;
        order.supplierInfo.supplierOrderPlacedAt = nowIso;
      }
    } else if (order.status === 'SUPPLIER ORDER PLACED') {
      order.status = 'SHIPPED';
      const simTracking = `9400111899${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      order.tracking = {
        carrier: 'USPS',
        trackingNumber: simTracking,
        trackingUrl: getCarrierTrackingUrl('USPS', simTracking),
        estimatedDeliveryDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
        shippedAt: nowIso,
        shippingNotes: 'Simulated air freight tracking.',
      };
    } else if (order.status === 'SHIPPED') {
      order.status = 'DELIVERED';
      if (order.tracking) {
        order.tracking.deliveredAt = nowIso;
      }
    }

    serverAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: nowIso,
      action: 'TEST_ORDER_STEP_ADVANCED',
      orderNumber: order.orderNumber,
      adminAccount: dev.email,
      details: `Advanced test order status to ${order.status}.`,
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.json({ success: true, order });
  });

  /**
   * POST /api/developer/update-product-supplier
   * Updates product supplier link and cost
   */
  app.post('/api/developer/update-product-supplier', requireDeveloperAuth, (req, res) => {
    const dev = (req as any).developer as ActiveSession;
    const { productId, supplierName, supplierUrl, supplierUnitCost, supplierShippingCost } = req.body;

    const product = serverProducts.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    if (supplierName !== undefined) product.supplierName = supplierName;
    if (supplierUrl !== undefined) product.supplierUrl = supplierUrl;
    if (supplierUnitCost !== undefined) product.supplierUnitCost = Number(supplierUnitCost) || 0;
    if (supplierShippingCost !== undefined) product.supplierShippingCost = Number(supplierShippingCost) || 0;

    serverAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'PRODUCT_SUPPLIER_UPDATED',
      adminAccount: dev.email,
      details: `Updated supplier configuration for ${product.name} (Unit Cost: $${product.supplierUnitCost}).`,
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.json({ success: true, product });
  });

  /**
   * POST /api/developer/settings
   * Updates developer settings
   */
  app.post('/api/developer/settings', requireDeveloperAuth, (req, res) => {
    const dev = (req as any).developer as ActiveSession;
    const { updates } = req.body;

    if (updates && typeof updates === 'object') {
      serverSettings = { ...serverSettings, ...updates };
    }

    serverAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'SETTINGS_UPDATED',
      adminAccount: dev.email,
      details: 'Developer settings & payment tags updated.',
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.json({ success: true, settings: serverSettings });
  });

  // ==========================================
  // VITE & FRONTEND SPA MIDDLEWARE
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Reseller Supply Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
});
