// ============================================
// Shared Types & DTOs for Affiliate SaaS
// ============================================

// Auth DTOs
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: 'merchant' | 'affiliate';
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserDto {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'merchant' | 'affiliate';
  verified: boolean;
  createdAt: Date;
}

// Merchant DTOs
export interface CreateMerchantDto {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  commissionRate: number;
  payoutSchedule: 'instant' | 'weekly' | 'monthly' | 'net30';
}

export interface MerchantDto {
  id: number;
  name: string;
  slug: string;
  apiKey: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  commissionRate: number;
  payoutSchedule: 'instant' | 'weekly' | 'monthly' | 'net30';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Affiliate DTOs
export interface CreateAffiliateDto {
  displayName?: string;
  bio?: string;
  websiteUrl?: string;
}

export interface AffiliateDto {
  id: number;
  userId: number;
  affiliateCode: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  websiteUrl?: string;
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Link DTOs
export interface CreateLinkDto {
  merchantId: number;
  type: 'store' | 'product' | 'offer' | 'custom';
  targetId?: string;
  targetUrl: string;
  title?: string;
  description?: string;
  utmParams?: Record<string, string>;
}

export interface LinkDto {
  id: number;
  merchantId: number;
  affiliateId?: number;
  type: 'store' | 'product' | 'offer' | 'custom';
  slug: string;
  targetUrl: string;
  title?: string;
  description?: string;
  totalClicks: number;
  totalConversions: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Click DTOs
export interface ClickDto {
  id: number;
  linkId: number;
  affiliateId?: number;
  merchantId: number;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  deviceType?: string;
  createdAt: Date;
}

// Conversion DTOs
export interface CreateConversionDto {
  orderId: string;
  linkId?: number;
  affiliateCode?: string;
  amount: number;
  currency: string;
  customerEmail?: string;
}

export interface ConversionDto {
  id: number;
  orderId: string;
  linkId: number;
  affiliateId?: number;
  merchantId: number;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

// Commission DTOs
export interface CommissionDto {
  id: number;
  conversionId: number;
  affiliateId: number;
  merchantId: number;
  amount: number;
  rate: number;
  status: 'unpaid' | 'pending_payout' | 'paid' | 'refunded';
  createdAt: Date;
  paidAt?: Date;
}

// Payout DTOs
export interface CreatePayoutDto {
  amount: number;
  method: string;
  methodDetails: Record<string, any>;
}

export interface PayoutDto {
  id: number;
  affiliateId: number;
  amount: number;
  currency: string;
  method: string;
  status: 'requested' | 'approved' | 'processing' | 'completed' | 'failed' | 'cancelled';
  transactionId?: string;
  failureReason?: string;
  requestedAt: Date;
  processedAt?: Date;
  completedAt?: Date;
}

// Fraud Log DTOs
export interface FraudLogDto {
  id: number;
  merchantId?: number;
  affiliateId?: number;
  linkId?: number;
  conversionId?: number;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'flagged' | 'under_review' | 'resolved' | 'dismissed';
  createdAt: Date;
}

// Analytics DTOs
export interface AnalyticsDto {
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  totalEarnings: number;
  averageOrderValue: number;
  topLinks: LinkDto[];
  topAffiliates: AffiliateDto[];
  recentConversions: ConversionDto[];
}

// Webhook DTOs
export interface ConversionWebhookPayload {
  orderId: string;
  affiliateCode?: string;
  amount: number;
  currency: string;
  customerEmail?: string;
  metadata?: Record<string, any>;
}

// API Response DTOs
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Error Response
export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}

