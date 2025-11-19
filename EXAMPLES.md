# Affiliate SDK - أمثلة التكامل

## 1. متجر إلكتروني بسيط (HTML)

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Store</title>
</head>
<body>
    <!-- Your store content -->
    
    <!-- Add Affiliate Tracker -->
    <script src="https://cdn.affiliatesaas.com/snippet.js"></script>
    <script>
        // Initialize tracker
        window.AffiliateTracker.init({
            apiKey: 'pk_live_xxxxxxxxxxxxx',
            merchantId: 'merchant_123'
        });

        // Track conversion on order completion
        function completeOrder(orderId, total) {
            window.AffiliateTracker.trackConversion(orderId, total, 'USD');
            // Redirect to thank you page
            window.location.href = '/thank-you';
        }
    </script>
</body>
</html>
```

## 2. متجر WooCommerce

```php
<?php
// Add to functions.php

add_action('woocommerce_thankyou', 'track_affiliate_conversion');

function track_affiliate_conversion($order_id) {
    $order = wc_get_order($order_id);
    $total = $order->get_total();
    ?>
    <script src="https://cdn.affiliatesaas.com/snippet.js"></script>
    <script>
        window.AffiliateTracker.init({
            apiKey: '<?php echo get_option('affiliate_api_key'); ?>',
            merchantId: '<?php echo get_option('affiliate_merchant_id'); ?>'
        });
        
        window.AffiliateTracker.trackConversion(
            '<?php echo $order_id; ?>',
            <?php echo $total; ?>,
            '<?php echo get_woocommerce_currency(); ?>'
        );
    </script>
    <?php
}
?>
```

## 3. متجر Shopify (Liquid)

```liquid
{% if order %}
<script src="https://cdn.affiliatesaas.com/snippet.js"></script>
<script>
  window.AffiliateTracker.init({
    apiKey: '{{ shop.metafields.affiliate.api_key }}',
    merchantId: '{{ shop.metafields.affiliate.merchant_id }}'
  });

  window.AffiliateTracker.trackConversion(
    '{{ order.order_number }}',
    {{ order.total_price }},
    '{{ shop.currency }}'
  );
</script>
{% endif %}
```

## 4. تطبيق React

```jsx
import React, { useEffect } from 'react';
import AffiliateSDK from '@affiliatesaas/sdk';

function OrderConfirmation({ order }) {
  useEffect(() => {
    // Initialize SDK
    const affiliate = new AffiliateSDK({
      apiKey: process.env.REACT_APP_AFFILIATE_API_KEY,
      merchantId: process.env.REACT_APP_MERCHANT_ID,
      debug: true
    });

    // Track conversion
    affiliate.trackConversion({
      orderId: order.id,
      amount: order.total,
      currency: 'USD',
      metadata: {
        items: order.items.length,
        source: 'react-app'
      }
    });

    // Track custom event
    affiliate.trackEvent('order_completed', {
      orderId: order.id,
      timestamp: new Date().toISOString()
    });
  }, [order]);

  return (
    <div className="order-confirmation">
      <h1>شكراً لطلبك!</h1>
      <p>رقم الطلب: {order.id}</p>
      <p>المبلغ: ${order.total}</p>
    </div>
  );
}

export default OrderConfirmation;
```

## 5. تطبيق Vue.js

```vue
<template>
  <div class="order-confirmation">
    <h1>شكراً لطلبك!</h1>
    <p>رقم الطلب: {{ order.id }}</p>
    <p>المبلغ: ${{ order.total }}</p>
  </div>
</template>

<script>
import AffiliateSDK from '@affiliatesaas/sdk';

export default {
  name: 'OrderConfirmation',
  props: {
    order: Object
  },
  mounted() {
    const affiliate = new AffiliateSDK({
      apiKey: process.env.VUE_APP_AFFILIATE_API_KEY,
      merchantId: process.env.VUE_APP_MERCHANT_ID
    });

    affiliate.trackConversion({
      orderId: this.order.id,
      amount: this.order.total,
      currency: 'USD'
    });
  }
}
</script>
```

## 6. تطبيق Next.js

```jsx
// pages/order-confirmation.js
import { useEffect } from 'react';
import AffiliateSDK from '@affiliatesaas/sdk';

export default function OrderConfirmation({ order }) {
  useEffect(() => {
    const affiliate = new AffiliateSDK({
      apiKey: process.env.NEXT_PUBLIC_AFFILIATE_API_KEY,
      merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID
    });

    affiliate.trackConversion({
      orderId: order.id,
      amount: order.total,
      currency: 'USD'
    });
  }, [order]);

  return (
    <div>
      <h1>شكراً لطلبك!</h1>
      <p>رقم الطلب: {order.id}</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { orderId } = context.query;
  const order = await fetchOrder(orderId);
  return { props: { order } };
}
```

## 7. تطبيق Angular

```typescript
// order-confirmation.component.ts
import { Component, OnInit } from '@angular/core';
import AffiliateSDK from '@affiliatesaas/sdk';

@Component({
  selector: 'app-order-confirmation',
  template: `
    <div>
      <h1>شكراً لطلبك!</h1>
      <p>رقم الطلب: {{ order.id }}</p>
      <p>المبلغ: ${{ order.total }}</p>
    </div>
  `
})
export class OrderConfirmationComponent implements OnInit {
  order: any;

  constructor() {}

  ngOnInit() {
    const affiliate = new AffiliateSDK({
      apiKey: 'your-api-key',
      merchantId: 'your-merchant-id'
    });

    affiliate.trackConversion({
      orderId: this.order.id,
      amount: this.order.total,
      currency: 'USD'
    });
  }
}
```

## 8. تطبيق Node.js/Express

```javascript
// routes/orders.js
const express = require('express');
const AffiliateSDK = require('@affiliatesaas/sdk');

const router = express.Router();

router.post('/complete', async (req, res) => {
  const { orderId, total, currency } = req.body;

  const affiliate = new AffiliateSDK({
    apiKey: process.env.AFFILIATE_API_KEY,
    merchantId: process.env.AFFILIATE_MERCHANT_ID
  });

  try {
    await affiliate.trackConversion({
      orderId,
      amount: total,
      currency: currency || 'USD'
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

## 9. تتبع أحداث مخصصة

```javascript
const affiliate = new AffiliateSDK({
  apiKey: 'your-api-key',
  merchantId: 'your-merchant-id'
});

// Track newsletter signup
affiliate.trackEvent('newsletter_signup', {
  email: 'user@example.com',
  source: 'homepage'
});

// Track product view
affiliate.trackEvent('product_view', {
  productId: 'PROD-123',
  productName: 'Amazing Product',
  price: 99.99
});

// Track add to cart
affiliate.trackEvent('add_to_cart', {
  productId: 'PROD-123',
  quantity: 2,
  price: 99.99
});

// Track wishlist add
affiliate.trackEvent('wishlist_add', {
  productId: 'PROD-123'
});
```

## 10. الحصول على كود الشريك

```javascript
const affiliate = new AffiliateSDK({
  apiKey: 'your-api-key',
  merchantId: 'your-merchant-id'
});

// Get affiliate code
const code = affiliate.getCode();

if (code) {
  console.log('Affiliate Code:', code);
  // Use code to customize user experience
  document.body.classList.add(`affiliate-${code}`);
}
```

## متغيرات البيئة

### React

```
REACT_APP_AFFILIATE_API_KEY=pk_live_xxxxx
REACT_APP_MERCHANT_ID=merchant_xxxxx
```

### Next.js

```
NEXT_PUBLIC_AFFILIATE_API_KEY=pk_live_xxxxx
NEXT_PUBLIC_MERCHANT_ID=merchant_xxxxx
```

### Vue.js

```
VUE_APP_AFFILIATE_API_KEY=pk_live_xxxxx
VUE_APP_MERCHANT_ID=merchant_xxxxx
```

### Node.js

```
AFFILIATE_API_KEY=pk_live_xxxxx
AFFILIATE_MERCHANT_ID=merchant_xxxxx
```

## الاختبار والتطوير

### استخدام API Key للاختبار

```javascript
const affiliate = new AffiliateSDK({
  apiKey: 'pk_test_xxxxx', // Use test key
  merchantId: 'merchant_test_xxxxx',
  apiUrl: 'https://api-test.affiliatesaas.com/v1',
  debug: true // Enable debug logging
});
```

### تتبع الأحداث في وحدة التحكم

```javascript
// Enable debug mode
const affiliate = new AffiliateSDK({
  apiKey: 'your-api-key',
  merchantId: 'your-merchant-id',
  debug: true // Will log all events to console
});

// All events will be logged:
// [Affiliate SDK] Initialized with config: {...}
// [Affiliate SDK] Page view tracked for affiliate: AFFILIATE-CODE
// [Affiliate SDK] Tracking conversion: {...}
```

## الدعم

للمساعدة:
- 📧 البريد الإلكتروني: support@affiliatesaas.com
- 📚 التوثيق: https://docs.affiliatesaas.com
- 🐛 GitHub Issues: https://github.com/affiliatesaas/sdk/issues

