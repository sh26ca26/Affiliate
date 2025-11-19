# Affiliate SaaS SDK

JavaScript SDK للتكامل مع منصة التسويق بالعمولة.

## التثبيت

### عبر NPM

```bash
npm install @affiliatesaas/sdk
```

### عبر CDN

```html
<script src="https://cdn.affiliatesaas.com/snippet.js"></script>
```

## الاستخدام السريع

### 1. Tracking Snippet (الطريقة الأبسط)

أضف هذا الكود في نهاية `<body>` في موقعك:

```html
<script src="https://cdn.affiliatesaas.com/snippet.js"></script>
<script>
  window.AffiliateTracker.init({
    apiKey: 'your-api-key',
    merchantId: 'your-merchant-id'
  });

  // Track conversion when order is completed
  window.AffiliateTracker.trackConversion('ORDER-123', 99.99, 'USD');
</script>
```

### 2. JavaScript SDK (الطريقة المتقدمة)

```javascript
import AffiliateSDK from '@affiliatesaas/sdk';

// Initialize SDK
const affiliate = new AffiliateSDK({
  apiKey: 'your-api-key',
  merchantId: 'your-merchant-id',
  debug: true
});

// Track conversion
affiliate.trackConversion({
  orderId: 'ORDER-123',
  amount: 99.99,
  currency: 'USD',
  metadata: {
    productId: 'PROD-456',
    category: 'electronics'
  }
});

// Track custom event
affiliate.trackEvent('add_to_cart', {
  productId: 'PROD-456',
  quantity: 2
});

// Get affiliate code
const code = affiliate.getCode();
console.log('Affiliate Code:', code);
```

## الميزات

### تتبع النقرات
يتم تتبع النقرات تلقائياً عند تحميل الصفحة إذا كان هناك كود شريك في الرابط.

```
https://yoursite.com?aff=AFFILIATE-CODE
```

### تتبع التحويلات
تتبع المبيعات والطلبات:

```javascript
affiliate.trackConversion({
  orderId: 'ORDER-123',
  amount: 99.99,
  currency: 'USD'
});
```

### تتبع الأحداث المخصصة
تتبع أحداث مخصصة:

```javascript
affiliate.trackEvent('newsletter_signup', {
  email: 'user@example.com'
});
```

### إنشاء روابط تسويقية
إنشاء روابط تسويقية برمجياً:

```javascript
affiliate.createLink('https://yoursite.com/product/123', {
  title: 'Amazing Product',
  metadata: {
    category: 'electronics'
  }
});
```

## معاملات API

### trackConversion(data)

تتبع تحويل/بيع.

**المعاملات:**
- `orderId` (string, مطلوب): معرف الطلب الفريد
- `amount` (number, مطلوب): قيمة الطلب
- `currency` (string, اختياري): العملة (افتراضي: USD)
- `metadata` (object, اختياري): بيانات إضافية

**مثال:**
```javascript
affiliate.trackConversion({
  orderId: 'ORDER-123',
  amount: 99.99,
  currency: 'USD',
  metadata: { productId: 'PROD-456' }
});
```

### trackEvent(eventName, eventData)

تتبع حدث مخصص.

**المعاملات:**
- `eventName` (string, مطلوب): اسم الحدث
- `eventData` (object, اختياري): بيانات الحدث

**مثال:**
```javascript
affiliate.trackEvent('add_to_cart', {
  productId: 'PROD-456',
  quantity: 2
});
```

### getCode()

الحصول على كود الشريك الحالي.

**المثال:**
```javascript
const code = affiliate.getCode();
console.log('Affiliate Code:', code);
```

### createLink(targetUrl, options)

إنشاء رابط تسويقي جديد.

**المعاملات:**
- `targetUrl` (string, مطلوب): الرابط الهدف
- `options` (object, اختياري):
  - `title` (string): عنوان الرابط
  - `metadata` (object): بيانات إضافية

**مثال:**
```javascript
affiliate.createLink('https://yoursite.com/product/123', {
  title: 'Amazing Product',
  metadata: { category: 'electronics' }
});
```

## أمثلة التكامل

### متجر WooCommerce

```html
<script src="https://cdn.affiliatesaas.com/snippet.js"></script>
<script>
  window.AffiliateTracker.init({
    apiKey: 'your-api-key',
    merchantId: 'your-merchant-id'
  });

  // Track on order completion
  document.addEventListener('DOMContentLoaded', function() {
    const orderTotal = document.querySelector('.order-total');
    const orderId = document.querySelector('.order-id');
    
    if (orderTotal && orderId) {
      window.AffiliateTracker.trackConversion(
        orderId.textContent,
        parseFloat(orderTotal.textContent),
        'USD'
      );
    }
  });
</script>
```

### متجر Shopify

```liquid
<script src="https://cdn.affiliatesaas.com/snippet.js"></script>
<script>
  window.AffiliateTracker.init({
    apiKey: 'your-api-key',
    merchantId: 'your-merchant-id'
  });

  {% if order %}
    window.AffiliateTracker.trackConversion(
      '{{ order.order_number }}',
      {{ order.total_price }},
      '{{ shop.currency }}'
    );
  {% endif %}
</script>
```

### تطبيق React

```jsx
import { useEffect } from 'react';
import AffiliateSDK from '@affiliatesaas/sdk';

function OrderConfirmation({ order }) {
  useEffect(() => {
    const affiliate = new AffiliateSDK({
      apiKey: 'your-api-key',
      merchantId: 'your-merchant-id'
    });

    affiliate.trackConversion({
      orderId: order.id,
      amount: order.total,
      currency: 'USD'
    });
  }, [order]);

  return <div>Thank you for your order!</div>;
}

export default OrderConfirmation;
```

## الخصوصية والأمان

- جميع البيانات مشفرة عبر HTTPS
- لا نجمع بيانات شخصية حساسة
- الامتثال الكامل مع GDPR و CCPA
- يمكن حذف البيانات في أي وقت

## الدعم

للمساعدة والدعم:
- البريد الإلكتروني: support@affiliatesaas.com
- التوثيق: https://docs.affiliatesaas.com
- GitHub Issues: https://github.com/affiliatesaas/sdk

## الترخيص

MIT License

