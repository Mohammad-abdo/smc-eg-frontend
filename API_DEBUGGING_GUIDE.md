# API Debugging Guide - حل مشاكل الاتصال بالـ Backend

## المشكلة: لا يمكن استقبال البيانات من Backend

### الخطوة 1: التحقق من URL الـ Backend

افتح **Browser Console** (F12) وتحقق من:
1. ما هو `API_BASE_URL` الذي يتم استخدامه؟
2. ما هي الأخطاء في Console؟

**في Console يجب أن ترى:**
```javascript
API Call: {
  method: "GET",
  url: "https://smc-eg-production.up.railway.app/api/products",
  endpoint: "/products",
  apiBaseUrl: "https://smc-eg-production.up.railway.app/api",
  isProd: true,
  envApiUrl: undefined
}
```

### الخطوة 2: التحقق من Environment Variables في Vercel

**في Vercel Dashboard:**
1. اذهب إلى **Project Settings** → **Environment Variables**
2. تأكد من وجود:
   ```
   VITE_API_URL=https://smc-eg-production.up.railway.app/api
   ```
3. إذا لم يكن موجوداً، أضفه وأعد النشر

### الخطوة 3: التحقق من CORS في Backend

**المشكلة الأكثر شيوعاً:** Backend لا يسمح بطلبات من Frontend domain

**الحل:** تأكد من أن Backend على Railway يسمح بـ CORS من Frontend domain:

```javascript
// في backend/server.js
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:5173', // للـ local dev
  ],
  credentials: true
}));
```

### الخطوة 4: اختبار Backend مباشرة

افتح في المتصفح أو استخدم curl:
```
https://smc-eg-production.up.railway.app/api/products
```

**يجب أن ترى:**
- إما JSON response مع البيانات
- أو error message يخبرك بالمشكلة

### الخطوة 5: التحقق من Network Tab

1. افتح **Developer Tools** → **Network Tab**
2. حاول تحميل صفحة تستدعي API
3. ابحث عن request إلى `/api/products` أو Railway URL
4. تحقق من:
   - **Status Code**: يجب أن يكون 200 (أو 401/403 إذا لم تسجل دخول)
   - **Response**: يجب أن يحتوي على البيانات أو error message
   - **CORS Headers**: تحقق من وجود `Access-Control-Allow-Origin`

### الخطوة 6: الأخطاء الشائعة وحلولها

#### Error: "CORS error" أو "Access-Control-Allow-Origin"
**الحل:** 
- تأكد من أن Backend يسمح بـ CORS من Frontend domain
- أضف Frontend URL إلى CORS whitelist في Backend

#### Error: "Failed to fetch" أو "NetworkError"
**الحل:**
- تحقق من أن Backend يعمل على Railway
- تحقق من أن URL صحيح
- تحقق من اتصال الإنترنت

#### Error: "404 Not Found"
**الحل:**
- تحقق من أن Backend route موجود (`/api/products`)
- تحقق من أن Backend يعمل على Railway

#### Error: "401 Unauthorized" أو "403 Forbidden"
**الحل:**
- هذا طبيعي إذا لم تسجل دخول
- سجل دخول أولاً

### الخطوة 7: إضافة VITE_API_URL في Vercel

**في Vercel Dashboard:**
1. Project → Settings → Environment Variables
2. أضف:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://smc-eg-production.up.railway.app/api`
   - **Environment:** Production, Preview, Development
3. أعد النشر

### الخطوة 8: اختبار محلي

**أنشئ ملف `.env.local` في الجذر:**
```env
VITE_API_URL=https://smc-eg-production.up.railway.app/api
```

ثم:
```bash
npm run dev
```

افتح المتصفح وتحقق من Console.

## ملاحظات مهمة

1. **VITE_API_URL** يجب أن يكون **كامل URL** مع `/api` في النهاية
2. **Backend على Railway** يجب أن يكون **قيد التشغيل** و**يمكن الوصول إليه**
3. **CORS** يجب أن يكون مفعّل في Backend
4. بعد تغيير Environment Variables في Vercel، **أعد النشر**

## إذا استمرت المشكلة

1. افتح Browser Console (F12)
2. انسخ **كامل** رسالة الخطأ
3. تحقق من Network Tab → انقر على request → انظر إلى Response
4. تحقق من أن Backend يعمل على Railway


