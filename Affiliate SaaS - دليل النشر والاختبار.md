# Affiliate SaaS - دليل النشر والاختبار

## 📋 جدول المحتويات

1. [متطلبات النظام](#متطلبات-النظام)
2. [التثبيت المحلي](#التثبيت-المحلي)
3. [الاختبار](#الاختبار)
4. [النشر على الإنتاج](#النشر-على-الإنتاج)
5. [المراقبة والصيانة](#المراقبة-والصيانة)

---

## متطلبات النظام

### الخوادم

- **Node.js:** v18.0.0 أو أحدث
- **npm/pnpm:** v9.0.0 أو أحدث
- **MySQL:** v8.0 أو أحدث
- **Redis:** v6.0 أو أحدث
- **Docker:** v20.0 أو أحدث (اختياري)

### متطلبات البرامج

```bash
# Node.js
node --version  # v18.0.0+

# npm
npm --version   # v9.0.0+

# MySQL
mysql --version # 8.0+

# Redis
redis-cli --version # 6.0+
```

---

## التثبيت المحلي

### 1. استنساخ المشروع

```bash
git clone https://github.com/affiliatesaas/platform.git
cd affiliate_saas
```

### 2. تثبيت المتعلقات

```bash
# تثبيت جميع المتعلقات
pnpm install

# أو استخدام npm
npm install
```

### 3. إعداد متغيرات البيئة

```bash
# نسخ ملف البيئة
cp .env.example .env

# تحرير الملف وإضافة المتغيرات
nano .env
```

**متغيرات البيئة المطلوبة:**

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=affiliate_saas

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d

# API
API_PORT=3000
API_URL=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password

# Payment Gateway
STRIPE_SECRET_KEY=sk_test_xxxxx
PAYPAL_CLIENT_ID=xxxxx
PAYPAL_SECRET=xxxxx

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_S3_BUCKET=affiliate-saas

# Environment
NODE_ENV=development
```

### 4. إعداد قاعدة البيانات

```bash
# تشغيل MySQL
mysql -u root -p

# إنشاء قاعدة البيانات
CREATE DATABASE affiliate_saas;
USE affiliate_saas;

# تشغيل الهجرات
pnpm db:migrate

# إضافة البيانات الأولية (اختياري)
pnpm db:seed
```

### 5. تشغيل التطبيق

```bash
# تشغيل جميع الخدمات
pnpm dev

# أو تشغيل خدمة محددة
pnpm dev:api
pnpm dev:merchant-portal
pnpm dev:affiliate-app
```

**الخدمات المتاحة:**

- **API:** http://localhost:3000
- **Merchant Portal:** http://localhost:3001
- **Affiliate App:** http://localhost:3002 (Expo)

---

## الاختبار

### اختبارات الوحدة

```bash
# تشغيل جميع الاختبارات
pnpm test

# تشغيل اختبارات محددة
pnpm test:api
pnpm test:portal
pnpm test:app

# مع التغطية
pnpm test:coverage
```

### اختبارات التكامل

```bash
# تشغيل اختبارات التكامل
pnpm test:integration

# مع المراقبة
pnpm test:integration:watch
```

### اختبارات E2E

```bash
# تشغيل اختبارات E2E
pnpm test:e2e

# مع واجهة المستخدم
pnpm test:e2e:ui
```

### اختبار الأداء

```bash
# تشغيل اختبارات الأداء
pnpm test:performance

# تحليل الحجم
pnpm analyze
```

### اختبار الأمان

```bash
# فحص الثغرات
pnpm audit

# فحص الأمان
pnpm security:check
```

---

## النشر على الإنتاج

### 1. البناء

```bash
# بناء جميع الخدمات
pnpm build

# أو بناء خدمة محددة
pnpm build:api
pnpm build:portal
pnpm build:app
```

### 2. استخدام Docker

```bash
# بناء صور Docker
docker-compose build

# تشغيل الحاويات
docker-compose up -d

# عرض السجلات
docker-compose logs -f
```

### 3. النشر على السحابة

#### AWS EC2

```bash
# الاتصال بالخادم
ssh -i key.pem ubuntu@your-instance-ip

# استنساخ المشروع
git clone https://github.com/affiliatesaas/platform.git
cd affiliate_saas

# تثبيت المتعلقات
pnpm install

# بناء التطبيق
pnpm build

# تشغيل مع PM2
pm2 start ecosystem.config.js
```

#### Heroku

```bash
# تثبيت Heroku CLI
npm install -g heroku

# تسجيل الدخول
heroku login

# إنشاء تطبيق
heroku create affiliate-saas

# نشر التطبيق
git push heroku main

# عرض السجلات
heroku logs --tail
```

#### Vercel (للـ Frontend)

```bash
# تثبيت Vercel CLI
npm install -g vercel

# نشر التطبيق
vercel
```

### 4. إعداد النطاق

```bash
# تحديث DNS
# أضف سجلات A و CNAME للنطاق الخاص بك

# إعداد SSL
# استخدم Let's Encrypt أو Cloudflare
```

---

## المراقبة والصيانة

### المراقبة

```bash
# مراقبة الخادم
pm2 monit

# عرض السجلات
pm2 logs

# إحصائيات الأداء
pm2 info
```

### النسخ الاحتياطي

```bash
# نسخ احتياطي من قاعدة البيانات
mysqldump -u root -p affiliate_saas > backup.sql

# استعادة النسخة الاحتياطية
mysql -u root -p affiliate_saas < backup.sql

# نسخ احتياطي من Redis
redis-cli BGSAVE
```

### التحديثات

```bash
# تحديث المتعلقات
pnpm update

# تحديث الهجرات
pnpm db:migrate

# إعادة تشغيل الخدمات
pm2 restart all
```

### الصيانة المجدولة

```bash
# تنظيف السجلات القديمة
pnpm maintenance:clean-logs

# تحسين قاعدة البيانات
pnpm maintenance:optimize-db

# حذف الجلسات المنتهية
pnpm maintenance:cleanup-sessions
```

---

## استكشاف الأخطاء

### مشاكل شائعة

#### 1. خطأ الاتصال بقاعدة البيانات

```bash
# تحقق من حالة MySQL
mysql -u root -p -e "SELECT 1"

# تحقق من المتغيرات
echo $DB_HOST
echo $DB_PORT

# أعد تشغيل MySQL
sudo systemctl restart mysql
```

#### 2. خطأ الاتصال بـ Redis

```bash
# تحقق من حالة Redis
redis-cli ping

# أعد تشغيل Redis
sudo systemctl restart redis-server
```

#### 3. خطأ الذاكرة

```bash
# تحقق من استخدام الذاكرة
free -h

# زيادة حد الذاكرة
NODE_OPTIONS="--max-old-space-size=4096" pnpm start
```

#### 4. خطأ الأداء

```bash
# تحليل الأداء
pnpm profile

# تحسين الحجم
pnpm optimize

# مسح الذاكرة المؤقتة
pnpm cache:clear
```

---

## قائمة التحقق قبل النشر

- [ ] تم اختبار جميع الميزات
- [ ] تم تشغيل اختبارات الوحدة
- [ ] تم تشغيل اختبارات التكامل
- [ ] تم فحص الأمان
- [ ] تم تحديث التوثيق
- [ ] تم إنشاء نسخة احتياطية من قاعدة البيانات
- [ ] تم اختبار الأداء
- [ ] تم إعداد المراقبة
- [ ] تم إعداد التنبيهات
- [ ] تم إعداد خطة الاسترجاع

---

## الدعم والمساعدة

للمساعدة:
- 📧 البريد الإلكتروني: support@affiliatesaas.com
- 📚 التوثيق: https://docs.affiliatesaas.com
- 🐛 GitHub Issues: https://github.com/affiliatesaas/platform/issues
- 💬 Slack: https://affiliatesaas.slack.com

