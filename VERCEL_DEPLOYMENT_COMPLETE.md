# 🚀 دليل النشر الكامل على Vercel - Production Ready

## ✅ ما تم إعداده

### 1. Prisma Configuration ✅
- ✅ `backend/prisma/schema.prisma` - محدث لدعم Postgres (Vercel Postgres)
- ✅ `backend/lib/prisma.js` - يدعم MySQL (via adapter) و Postgres (via DATABASE_URL)
- ✅ `backend/prisma.config.ts` - Prisma v7 configuration

### 2. Migration Endpoints ✅
- ✅ `POST /api/init` - لتشغيل migrations بعد النشر
- ✅ `GET /api/migrations/status` - للتحقق من حالة migrations

### 3. Vercel Configuration ✅
- ✅ `vercel.json` - محدث مع build commands و functions config
- ✅ `api/index.js` - Vercel serverless function wrapper

### 4. Frontend Configuration ✅
- ✅ `src/services/api.ts` - يستخدم `VITE_API_URL` أو `/api` كـ default

---

## 📋 خطوات النشر على Vercel

### الخطوة 1: Provision Database

#### خيار A: Vercel Postgres (موصى به)
1. اذهب إلى: **Vercel Dashboard → Your Project → Storage → Create Database**
2. اختر **Postgres**
3. انسخ **Connection String** (سيظهر كـ `POSTGRES_PRISMA_URL` أو `POSTGRES_URL`)

#### خيار B: Database خارجي (MySQL/Postgres)
- استخدم Railway, PlanetScale, أو أي MySQL/Postgres provider
- انسخ Connection String

---

### الخطوة 2: إضافة Environment Variables في Vercel

اذهب إلى: **Vercel Dashboard → Your Project → Settings → Environment Variables**

#### أضف المتغيرات التالية (Production):

```env
# Database (اختر واحد فقط)

# خيار 1: Vercel Postgres
DATABASE_URL=$POSTGRES_PRISMA_URL
# أو
DATABASE_URL=$POSTGRES_URL

# خيار 2: MySQL خارجي
DATABASE_URL=mysql://user:password@host:port/database
# أو متغيرات منفصلة:
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=smc_dashboard
DB_PORT=3306

# Frontend
VITE_API_URL=/api
VITE_USE_MOCK_API=false

# Optional: Migration Security (لحماية /api/init)
INIT_SECRET=your_secret_key_here
```

**ملاحظات مهمة:**
- ✅ اختر **Production** environment
- ✅ إذا كان Backend و Frontend في نفس المشروع: `VITE_API_URL=/api`
- ✅ إذا كان Backend منفصل: `VITE_API_URL=https://your-backend.vercel.app/api`

---

### الخطوة 3: تحديث Prisma Schema (إذا استخدمت Postgres)

إذا استخدمت **Vercel Postgres**، `schema.prisma` محدث بالفعل.

إذا استخدمت **MySQL**، غيّر في `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "mysql"  // بدلاً من "postgresql"
}
```

---

### الخطوة 4: Build & Deploy

#### من Vercel Dashboard:
1. اربط GitHub repository
2. Vercel سيكتشف `vercel.json` تلقائياً
3. اضغط **Deploy**

#### أو من CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

### الخطوة 5: تشغيل Migrations

بعد النشر، شغّل migrations:

#### خيار A: عبر API Endpoint
```bash
# إذا أضفت INIT_SECRET:
curl -X POST https://your-project.vercel.app/api/init \
  -H "Authorization: Bearer your_secret_key_here"

# أو بدون auth (غير آمن - استخدم فقط للاختبار):
curl -X POST https://your-project.vercel.app/api/init
```

#### خيار B: عبر Vercel CLI
```bash
vercel env pull .env.production
cd backend
npx prisma migrate deploy
```

#### خيار C: Post-Deploy Hook (موصى به)
أضف في `package.json` (root):
```json
{
  "scripts": {
    "vercel-build": "cd backend && npm install && npx prisma generate && cd .. && npm run build",
    "postdeploy": "cd backend && npx prisma migrate deploy"
  }
}
```

---

### الخطوة 6: التحقق من APIs

#### 1. Health Check:
```bash
curl https://your-project.vercel.app/api/health
```

**النتيجة المتوقعة:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-..."
}
```

#### 2. Migration Status:
```bash
curl https://your-project.vercel.app/api/migrations/status
```

#### 3. Test Product Creation:
```bash
curl -X POST https://your-project.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "nameAr": "منتج تجريبي",
    "category_id": 1,
    "status": "active"
  }'
```

**النتيجة المتوقعة:**
```json
{
  "id": 1,
  "name": "Test Product",
  ...
}
```

#### 4. Test Product List:
```bash
curl https://your-project.vercel.app/api/products
```

---

### الخطوة 7: التحقق من Frontend

1. افتح: `https://your-project.vercel.app`
2. افتح **Developer Tools → Network**
3. تأكد من:
   - ✅ Requests تذهب إلى `/api/products`
   - ✅ Status: 200
   - ✅ البيانات تظهر في الصفحة

---

## 🔧 استكشاف الأخطاء

### ❌ Error: P1001 - Can't reach database
**الحل:**
- تحقق من `DATABASE_URL` في Vercel Environment Variables
- تأكد من أن Database متاح من الإنترنت
- للـ Vercel Postgres: تأكد من نسخ `POSTGRES_PRISMA_URL` وليس `POSTGRES_URL`

### ❌ Error: Prisma Client not generated
**الحل:**
- تأكد من أن `buildCommand` في `vercel.json` يحتوي على `npx prisma generate`
- أو أضف `prisma:generate` في `package.json` scripts

### ❌ Error: Migrations failed
**الحل:**
- تحقق من `DATABASE_URL` صحيح
- تأكد من أن Database فارغ أو يحتوي على schema صحيح
- شغّل `npx prisma migrate deploy` يدوياً

### ❌ Frontend: API requests fail
**الحل:**
- تحقق من `VITE_API_URL` في Vercel Environment Variables
- تأكد من أن Backend يعمل: `curl https://your-project.vercel.app/api/health`
- تحقق من CORS في `backend/server.js`

---

## 📝 Checklist قبل النشر

- [ ] Database provisioned (Vercel Postgres أو خارجي)
- [ ] `DATABASE_URL` مضاف في Vercel Environment Variables
- [ ] `VITE_API_URL` مضاف في Vercel Environment Variables
- [ ] `backend/prisma/schema.prisma` محدث (postgresql أو mysql حسب DB)
- [ ] `vercel.json` محدث مع build commands
- [ ] `api/index.js` موجود وصحيح
- [ ] تم Deploy المشروع
- [ ] تم تشغيل migrations (`POST /api/init` أو `prisma migrate deploy`)
- [ ] تم اختبار `/api/health`
- [ ] تم اختبار `POST /api/products`
- [ ] تم اختبار Frontend

---

## 🎯 النتيجة النهائية

بعد اكتمال جميع الخطوات:

1. **Backend:** `https://your-project.vercel.app/api/*`
2. **Frontend:** `https://your-project.vercel.app`
3. **Database:** متصل ويعمل
4. **Migrations:** تم تشغيلها
5. **APIs:** تعمل وتستجيب

---

**الآن المشروع جاهز للإنتاج! 🚀**

