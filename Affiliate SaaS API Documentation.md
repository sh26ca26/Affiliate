# Affiliate SaaS API Documentation

## نظرة عامة

منصة التسويق بالعمولة (Affiliate SaaS) توفر API شامل لإدارة التجار والشركاء والروابط والتحويلات والمدفوعات.

**Base URL:** `https://api.affiliatesaas.com/v1`

**Authentication:** Bearer Token (JWT)

---

## جدول المحتويات

1. [المصادقة](#المصادقة)
2. [المستخدمين](#المستخدمين)
3. [التجار](#التجار)
4. [الشركاء](#الشركاء)
5. [الروابط](#الروابط)
6. [النقرات](#النقرات)
7. [التحويلات](#التحويلات)
8. [العمولات](#العمولات)
9. [المدفوعات](#المدفوعات)
10. [الإحصائيات](#الإحصائيات)
11. [الإدارة](#الإدارة)

---

## المصادقة

### تسجيل المستخدم

```
POST /auth/register
Content-Type: application/json

{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "secure_password",
  "role": "affiliate" // or "merchant" or "admin"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "role": "affiliate",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### تسجيل الدخول

```
POST /auth/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "secure_password"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "role": "affiliate",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### تحديث التوكن

```
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### التحقق من المستخدم

```
POST /auth/verify
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "role": "affiliate",
  "isActive": 1
}
```

---

## المستخدمين

### الحصول على بيانات المستخدم الحالي

```
GET /users/me
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "role": "affiliate",
  "createdAt": "2024-01-15T10:30:00Z",
  "isActive": 1
}
```

### الحصول على بيانات مستخدم بواسطة ID

```
GET /users/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "role": "affiliate",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

## التجار

### الحصول على قائمة التجار

```
GET /merchants
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "name": "متجري الإلكتروني",
      "email": "merchant@example.com",
      "website": "https://example.com",
      "commissionRate": 10,
      "isActive": 1,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### الحصول على بيانات تاجر

```
GET /merchants/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "متجري الإلكتروني",
  "email": "merchant@example.com",
  "website": "https://example.com",
  "commissionRate": 10,
  "apiKey": "pk_live_xxxxx",
  "isActive": 1,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### إنشاء تاجر جديد

```
POST /merchants
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "متجري الإلكتروني",
  "email": "merchant@example.com",
  "website": "https://example.com",
  "commissionRate": 10
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "متجري الإلكتروني",
  "email": "merchant@example.com",
  "website": "https://example.com",
  "commissionRate": 10,
  "apiKey": "pk_live_xxxxx",
  "isActive": 1
}
```

---

## الشركاء

### الحصول على بيانات الشريك الحالي

```
GET /affiliates/me
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "affiliateCode": "AFF-ABC123",
  "displayName": "أحمد محمد",
  "bio": "متخصص في التسويق الرقمي",
  "website": "https://mysite.com",
  "totalEarnings": 1350.75,
  "totalConversions": 45,
  "isActive": 1,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### تحديث بيانات الشريك

```
PUT /affiliates/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "displayName": "أحمد محمد",
  "bio": "متخصص في التسويق الرقمي",
  "website": "https://mysite.com"
}
```

**Response (200):**
```json
{
  "id": 1,
  "affiliateCode": "AFF-ABC123",
  "displayName": "أحمد محمد",
  "bio": "متخصص في التسويق الرقمي",
  "website": "https://mysite.com",
  "totalEarnings": 1350.75,
  "totalConversions": 45,
  "isActive": 1
}
```

### الحصول على قائمة أفضل الشركاء

```
GET /affiliates/top
Authorization: Bearer {token}
?limit=10&period=month
```

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "displayName": "أحمد محمد",
      "totalEarnings": 5000,
      "totalConversions": 150,
      "rank": 1
    }
  ]
}
```

---

## الروابط

### الحصول على قائمة الروابط

```
GET /links
Authorization: Bearer {token}
?merchantId=1&affiliateId=1&limit=10&page=1
```

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "title": "منتج رائع",
      "slug": "abc123",
      "url": "https://aff.example.com/link/abc123",
      "merchantId": 1,
      "affiliateId": 1,
      "clicks": 150,
      "conversions": 12,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### الحصول على رابط بواسطة ID

```
GET /links/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "منتج رائع",
  "slug": "abc123",
  "url": "https://aff.example.com/link/abc123",
  "merchantId": 1,
  "affiliateId": 1,
  "clicks": 150,
  "conversions": 12,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### إنشاء رابط جديد

```
POST /links
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "منتج رائع",
  "targetUrl": "https://example.com/product/123",
  "merchantId": 1
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "منتج رائع",
  "slug": "abc123",
  "url": "https://aff.example.com/link/abc123",
  "merchantId": 1,
  "affiliateId": 1,
  "clicks": 0,
  "conversions": 0,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### تحديث رابط

```
PUT /links/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "منتج رائع جداً"
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "منتج رائع جداً",
  "slug": "abc123",
  "url": "https://aff.example.com/link/abc123",
  "merchantId": 1,
  "affiliateId": 1,
  "clicks": 150,
  "conversions": 12
}
```

### حذف رابط

```
DELETE /links/:id
Authorization: Bearer {token}
```

**Response (204):** No Content

---

## النقرات

### تسجيل نقرة

```
POST /clicks
Content-Type: application/json

{
  "linkId": 1,
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1"
}
```

**Response (201):**
```json
{
  "id": 1,
  "linkId": 1,
  "sessionId": "sess-123",
  "createdAt": "2024-01-20T15:30:00Z"
}
```

### الحصول على إحصائيات النقرات

```
GET /links/:id/clicks
Authorization: Bearer {token}
?startDate=2024-01-01&endDate=2024-01-31
```

**Response (200):**
```json
{
  "total": 150,
  "byDay": [
    { "date": "2024-01-20", "count": 15 },
    { "date": "2024-01-21", "count": 20 }
  ],
  "bySource": [
    { "source": "google", "count": 50 },
    { "source": "facebook", "count": 40 }
  ]
}
```

---

## التحويلات

### تسجيل تحويل

```
POST /conversions
Content-Type: application/json
X-API-Key: {merchantApiKey}

{
  "orderId": "ORD-123",
  "amount": 99.99,
  "currency": "USD",
  "affiliateCode": "AFF-ABC123",
  "metadata": {
    "productId": "PROD-456",
    "category": "electronics"
  }
}
```

**Response (201):**
```json
{
  "id": 1,
  "orderId": "ORD-123",
  "amount": 99.99,
  "currency": "USD",
  "affiliateCode": "AFF-ABC123",
  "status": "pending",
  "createdAt": "2024-01-20T15:30:00Z"
}
```

### الحصول على التحويلات

```
GET /conversions
Authorization: Bearer {token}
?merchantId=1&affiliateId=1&status=approved&limit=10
```

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "orderId": "ORD-123",
      "amount": 99.99,
      "currency": "USD",
      "affiliateCode": "AFF-ABC123",
      "status": "approved",
      "createdAt": "2024-01-20T15:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### الموافقة على تحويل

```
PUT /conversions/:id/approve
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "orderId": "ORD-123",
  "amount": 99.99,
  "status": "approved",
  "approvedAt": "2024-01-20T16:00:00Z"
}
```

### رفض تحويل

```
PUT /conversions/:id/reject
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Suspicious activity detected"
}
```

**Response (200):**
```json
{
  "id": 1,
  "orderId": "ORD-123",
  "amount": 99.99,
  "status": "rejected",
  "rejectionReason": "Suspicious activity detected"
}
```

### استرجاع تحويل

```
PUT /conversions/:id/refund
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "orderId": "ORD-123",
  "amount": 99.99,
  "status": "refunded",
  "refundedAt": "2024-01-20T16:00:00Z"
}
```

---

## العمولات

### الحصول على العمولات

```
GET /commissions
Authorization: Bearer {token}
?affiliateId=1&merchantId=1&limit=10
```

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "affiliateId": 1,
      "amount": 9.99,
      "conversionId": 1,
      "status": "pending",
      "createdAt": "2024-01-20T15:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### الحصول على إحصائيات العمولات

```
GET /commissions/affiliate/:id/stats
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "totalEarnings": 1350.75,
  "pendingEarnings": 250.50,
  "paidEarnings": 1100.25,
  "totalConversions": 45,
  "averageCommission": 30.02
}
```

---

## المدفوعات

### طلب سحب جديد

```
POST /payouts
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 500.00,
  "method": "bank_transfer",
  "bankDetails": {
    "accountHolder": "أحمد محمد",
    "accountNumber": "1234567890",
    "bankCode": "SWIFT123"
  }
}
```

**Response (201):**
```json
{
  "id": 1,
  "affiliateId": 1,
  "amount": 500.00,
  "method": "bank_transfer",
  "status": "pending",
  "requestedAt": "2024-01-20T15:30:00Z"
}
```

### الحصول على المدفوعات

```
GET /payouts
Authorization: Bearer {token}
?affiliateId=1&status=completed&limit=10
```

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "affiliateId": 1,
      "amount": 500.00,
      "method": "bank_transfer",
      "status": "completed",
      "requestedAt": "2024-01-20T15:30:00Z",
      "processedAt": "2024-01-22T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### الموافقة على دفع

```
POST /payouts/:id/approve
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "affiliateId": 1,
  "amount": 500.00,
  "status": "approved",
  "approvedAt": "2024-01-20T16:00:00Z"
}
```

### معالجة دفع

```
POST /payouts/:id/process
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "affiliateId": 1,
  "amount": 500.00,
  "status": "processing",
  "processedAt": "2024-01-20T16:00:00Z"
}
```

---

## الإحصائيات

### إحصائيات لوحة تحكم التاجر

```
GET /analytics/merchant/:id/dashboard
Authorization: Bearer {token}
?period=month
```

**Response (200):**
```json
{
  "totalClicks": 1250,
  "totalConversions": 45,
  "conversionRate": 3.6,
  "totalRevenue": 4495.55,
  "averageOrderValue": 99.90,
  "topLinks": [
    {
      "id": 1,
      "title": "منتج رائع",
      "clicks": 150,
      "conversions": 12
    }
  ]
}
```

### إحصائيات لوحة تحكم الشريك

```
GET /analytics/affiliate/:id/dashboard
Authorization: Bearer {token}
?period=month
```

**Response (200):**
```json
{
  "totalClicks": 1250,
  "totalConversions": 45,
  "conversionRate": 3.6,
  "totalEarnings": 1350.75,
  "averageCommission": 30.02,
  "topLinks": [
    {
      "id": 1,
      "title": "منتج رائع",
      "clicks": 150,
      "conversions": 12
    }
  ]
}
```

---

## الإدارة

### إحصائيات النظام

```
GET /admin/stats
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "totalUsers": 150,
  "totalMerchants": 25,
  "totalAffiliates": 125,
  "totalConversions": 5000,
  "totalCommissions": 50000.00,
  "totalPayouts": 40000.00,
  "pendingPayouts": 10000.00,
  "fraudCases": 15
}
```

### إدارة المستخدمين

```
GET /admin/users
Authorization: Bearer {token}
?role=affiliate&limit=10
```

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "role": "affiliate",
      "isActive": 1,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 125
}
```

### تعليق حساب مستخدم

```
POST /admin/users/:id/suspend
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "أحمد محمد",
  "isActive": 0
}
```

### تفعيل حساب مستخدم

```
POST /admin/users/:id/activate
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "أحمد محمد",
  "isActive": 1
}
```

---

## رموز الأخطاء

| الكود | الرسالة | الوصف |
|------|--------|-------|
| 200 | OK | نجاح العملية |
| 201 | Created | تم إنشاء المورد |
| 204 | No Content | تم حذف المورد |
| 400 | Bad Request | طلب غير صحيح |
| 401 | Unauthorized | غير مصرح (بدون توكن) |
| 403 | Forbidden | ممنوع (بدون صلاحيات) |
| 404 | Not Found | المورد غير موجود |
| 409 | Conflict | تضارب (مثل بريد موجود) |
| 429 | Too Many Requests | عدد طلبات كثير جداً |
| 500 | Internal Server Error | خطأ في الخادم |

---

## معدلات التحديد (Rate Limiting)

- **الحد الأقصى:** 1000 طلب / ساعة
- **الحد الأقصى للمصادقة:** 10 محاولات / 15 دقيقة
- **رؤوس الاستجابة:**
  - `X-RateLimit-Limit`: الحد الأقصى للطلبات
  - `X-RateLimit-Remaining`: الطلبات المتبقية
  - `X-RateLimit-Reset`: وقت إعادة تعيين الحد

---

## أمثلة cURL

### تسجيل الدخول

```bash
curl -X POST https://api.affiliatesaas.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com",
    "password": "secure_password"
  }'
```

### إنشاء رابط جديد

```bash
curl -X POST https://api.affiliatesaas.com/v1/links \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "منتج رائع",
    "targetUrl": "https://example.com/product/123",
    "merchantId": 1
  }'
```

### تسجيل تحويل

```bash
curl -X POST https://api.affiliatesaas.com/v1/conversions \
  -H "X-API-Key: {merchantApiKey}" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD-123",
    "amount": 99.99,
    "currency": "USD",
    "affiliateCode": "AFF-ABC123"
  }'
```

---

## الدعم

للمساعدة والدعم:
- 📧 البريد الإلكتروني: support@affiliatesaas.com
- 📚 التوثيق الكاملة: https://docs.affiliatesaas.com
- 🐛 GitHub Issues: https://github.com/affiliatesaas/api/issues

