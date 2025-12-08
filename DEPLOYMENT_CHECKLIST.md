# ✅ قائمة التحقق من النشر - Deployment Checklist

## 📋 قبل النشر

### 1. Backend Configuration ✅

- [x] ملف `backend/server.js` موجود ويعمل
- [x] ملف `backend/vercel.json` موجود وصحيح
- [x] ملف `backend/database.js` يستخدم Environment Variables
- [ ] ملف `backend/.env` موجود مع بيانات قاعدة البيانات (أنشئه محلياً)
- [ ] قاعدة البيانات MySQL متاحة من الإنترنت

**ملف `backend/.env` المطلوب:**
```env
PORT=3001
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=smc_dashboard
```

### 2. Frontend Configuration ✅

- [x] ملف `vercel.json` موجود ومحدث
- [x] ملف `src/services/api.ts` يستخدم Environment Variables
- [x] `VITE_USE_MOCK_API=false` (الافتراضي)
- [ ] ملف `.env` موجود مع `VITE_API_URL` (أنشئه محلياً)

**ملف `.env` المطلوب (للـ local dev):**
```env
VITE_API_URL=http://localhost:3001/api
VITE_USE_MOCK_API=false
```

### 3. API Configuration ✅

- [x] `API_BASE_URL` في `src/services/api.ts`:
  - Local: `http://localhost:3001/api`
  - Production: `/api` (default) أو من `VITE_API_URL`
- [x] جميع الصفحات تستخدم `useProducts()` hook
- [x] لا توجد بيانات hardcoded

## 🚀 خطوات النشر على Vercel

### الخطوة 1: إعداد Backend على Vercel

#### خيار A: Backend كـ Vercel Serverless Function (موصى به)

1. **في Vercel Dashboard:**
   - اذهب إلى Project Settings
   - اضغط على "Functions"
   - تأكد من أن `backend/server.js` موجود

2. **أضف Environment Variables في Vercel:**
   ```
   DB_HOST=your_mysql_host
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=smc_dashboard
   PORT=3001
   ```

3. **تأكد من `vercel.json` في الجذر:**
   ```json
   {
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "/backend/server.js"
       }
     ]
   }
   ```

#### خيار B: Backend منفصل (Railway/Render/etc)

1. **نشر Backend على Railway:**
   - اربط GitHub repository
   - اختر `backend/` folder
   - أضف Environment Variables

2. **الحصول على Backend URL:**
   - مثال: `https://smc-backend.railway.app`

### الخطوة 2: إعداد Frontend على Vercel

1. **أضف Environment Variables في Vercel:**

   **إذا كان Backend على نفس الدومين:**
   ```
   VITE_API_URL=/api
   VITE_USE_MOCK_API=false
   ```

   **إذا كان Backend منفصل:**
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_USE_MOCK_API=false
   ```

2. **رفع المشروع:**
   ```bash
   vercel --prod
   ```

## ✅ التحقق بعد النشر

### 1. اختبار Backend

```bash
# إذا كان على نفس الدومين:
curl https://your-project.vercel.app/api/products

# إذا كان منفصل:
curl https://your-backend.railway.app/api/products
```

**النتيجة المتوقعة:**
```json
[{ "id": 1, "name": "...", ... }]
```

### 2. اختبار Frontend

1. افتح https://your-project.vercel.app
2. افتح Developer Tools → Network tab
3. ابحث عن requests إلى `/api/products`
4. تأكد من أن:
   - ✅ Status: 200
   - ✅ Response: JSON array of products
   - ✅ لا توجد أخطاء CORS

### 3. اختبار Dashboard

1. سجل دخول إلى Dashboard
2. أضف منتج جديد
3. افتح صفحة المنتجات في Frontend
4. تأكد من ظهور المنتج الجديد فوراً

## 🔧 استكشاف الأخطاء

### ❌ المشكلة: API requests تفشل (404)

**السبب:** Backend غير منشور أو URL خاطئ

**الحل:**
1. تأكد من أن Backend منشور على Vercel/Railway
2. تحقق من `VITE_API_URL` في Vercel Environment Variables
3. تأكد من أن `vercel.json` rewrites صحيحة

### ❌ المشكلة: CORS Error

**السبب:** Backend لا يسمح بطلبات من Frontend domain

**الحل:**
- تأكد من أن `backend/server.js` يحتوي على:
  ```javascript
  app.use(cors()); // يسمح بجميع origins
  ```

### ❌ المشكلة: Database Connection Failed

**السبب:** Environment Variables غير صحيحة أو قاعدة البيانات غير متاحة

**الحل:**
1. تحقق من Environment Variables في Vercel
2. تأكد من أن قاعدة البيانات تسمح بالاتصالات من Vercel IPs
3. استخدم MySQL cloud service (PlanetScale, Railway, etc)

### ❌ المشكلة: البيانات لا تظهر

**السبب:** `VITE_USE_MOCK_API=true` أو cache

**الحل:**
1. تأكد من `VITE_USE_MOCK_API=false` في Vercel
2. امسح cache المتصفح
3. Hard refresh (Ctrl + F5)

## 📝 ملاحظات مهمة

1. **Environment Variables في Vercel:**
   - Frontend variables تبدأ بـ `VITE_`
   - Backend variables لا تحتاج prefix
   - أضفها في Settings → Environment Variables

2. **Database:**
   - استخدم MySQL cloud service للـ production
   - تأكد من أن قاعدة البيانات متاحة من الإنترنت
   - استخدم connection pooling

3. **Caching:**
   - تم إضافة headers لمنع caching في `vercel.json`
   - تم إضافة cache-busting في API calls

## ✅ النتيجة النهائية

بعد اكتمال النشر:
- ✅ Backend يعمل على Vercel/Railway
- ✅ Frontend يتصل بالـ Backend بنجاح
- ✅ جميع صفحات المنتجات تستخدم `/api/products`
- ✅ البيانات من قاعدة البيانات (ليست mock)
- ✅ التحديثات من Dashboard تظهر فوراً
- ✅ لا توجد بيانات hardcoded

## 🎯 Checklist النهائي

- [ ] Backend منشور ويعمل
- [ ] Environment Variables مضاف في Vercel
- [ ] Frontend منشور ويعمل
- [ ] API requests تعمل (200 OK)
- [ ] المنتجات تظهر من قاعدة البيانات
- [ ] Dashboard يعمل ويضيف منتجات
- [ ] التحديثات تظهر فوراً على Frontend

