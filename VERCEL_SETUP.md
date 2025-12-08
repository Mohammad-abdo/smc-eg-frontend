# إعداد Vercel - دليل سريع

## خطوات الإعداد على Vercel

### 1. إعداد Environment Variables في Vercel

اذهب إلى: **Vercel Dashboard → Your Project → Settings → Environment Variables**

أضف المتغيرات التالية:

#### للـ Frontend:
```
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_USE_MOCK_API=false
```

**أو إذا كان Backend على نفس الدومين:**
```
VITE_API_URL=/api
VITE_USE_MOCK_API=false
```

#### للـ Backend (إذا كان على Vercel):
```
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=smc_dashboard
PORT=3001
```

---

### 2. التحقق من الإعدادات

#### Frontend (Vercel):
- ✅ `vercel.json` موجود في الجذر
- ✅ `VITE_API_URL` مضبوط في Environment Variables
- ✅ `VITE_USE_MOCK_API=false`

#### Backend (Railway/Render/Vercel):
- ✅ Database متصل
- ✅ Environment Variables مضبوطة
- ✅ Backend يستجيب على `/api/products`

---

### 3. اختبار الاتصال

بعد النشر، اختبر:

1. **افتح Console في المتصفح:**
   - اضغط F12
   - اذهب إلى Network tab
   - ابحث عن `/api/products`
   - تأكد من أن Status = 200

2. **اختبر API مباشرة:**
   ```bash
   curl https://your-backend-url.com/api/products
   ```

3. **تحقق من Environment Variables:**
   - في Vercel Dashboard
   - Settings → Environment Variables
   - تأكد من القيم الصحيحة

---

### 4. استكشاف الأخطاء

#### المشكلة: "Failed to fetch"
**الحل:**
- تحقق من أن Backend يعمل
- تحقق من CORS في Backend
- تحقق من `VITE_API_URL` في Vercel

#### المشكلة: البيانات لا تظهر
**الحل:**
- تأكد من `VITE_USE_MOCK_API=false`
- امسح كاش المتصفح (Ctrl+Shift+Delete)
- تحقق من Console للأخطاء

#### المشكلة: Backend لا يستجيب
**الحل:**
- تحقق من Database connection
- تحقق من Logs في Railway/Render
- تحقق من Environment Variables في Backend

---

## ملخص سريع

### ✅ ما تم إعداده:

1. ✅ ملف `.env.example` - مثال للـ Environment Variables
2. ✅ ملف `backend/.env.example` - مثال لـ Backend Environment Variables
3. ✅ ملف `BACKEND_DEPLOYMENT.md` - دليل نشر Backend
4. ✅ ملف `VERCEL_SETUP.md` - هذا الملف
5. ✅ تحديث `vercel.json` - إضافة rewrites للـ API
6. ✅ تحديث `src/services/api.ts` - تحسين منطق API_BASE_URL

### 📋 الخطوات التالية:

1. **انشر Backend** على Railway أو Render
2. **أضف Environment Variables** في Vercel:
   - `VITE_API_URL` → URL Backend
   - `VITE_USE_MOCK_API` → `false`
3. **انشر Frontend** على Vercel
4. **اختبر** أن كل شيء يعمل

---

## مثال Environment Variables في Vercel

```
VITE_API_URL=https://smc-backend.railway.app/api
VITE_USE_MOCK_API=false
```

**أو:**

```
VITE_API_URL=/api
VITE_USE_MOCK_API=false
```

---

## التحقق النهائي

بعد النشر، تأكد من:

- [ ] Backend يعمل ويمكن الوصول إليه
- [ ] `VITE_API_URL` مضبوط في Vercel
- [ ] `VITE_USE_MOCK_API=false` في Vercel
- [ ] Frontend يتصل بالـ Backend (تحقق من Network tab)
- [ ] المنتجات تظهر من قاعدة البيانات
- [ ] لا توجد أخطاء في Console

---

## الدعم

إذا واجهت مشاكل:
1. تحقق من Logs في Vercel Dashboard
2. تحقق من Console في المتصفح
3. تحقق من Network tab في DevTools
4. راجع `BACKEND_DEPLOYMENT.md` للمزيد من التفاصيل

