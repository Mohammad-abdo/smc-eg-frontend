# إصلاح مشكلة "Failed to save" / "Unknown error"

## المشكلة
عند محاولة حفظ أي قسم أو منتج أو خبر من Dashboard، يظهر خطأ:
- "Failed to save category: Unknown error"
- "Failed to save product: Unknown error"

## الأسباب المحتملة

### 1. الـ Backend غير متاح على Vercel
**السبب:** Vercel Serverless Functions قد لا تعمل بشكل صحيح، أو الـ database connection فشل.

**الحل:**
1. تحقق من Vercel Dashboard → Deployments → Functions
2. افحص الـ logs للأخطاء
3. تأكد من أن Environment Variables موجودة:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`

### 2. مشكلة في الاتصال بالـ Database
**السبب:** الـ database غير متاح أو الـ credentials خاطئة.

**الحل:**
1. تحقق من أن الـ database متاح من Vercel
2. تأكد من أن الـ IP whitelist يشمل Vercel IPs
3. تحقق من الـ credentials في Vercel Environment Variables

### 3. مشكلة في CORS
**السبب:** الـ backend لا يسمح بالطلبات من الـ frontend domain.

**الحل:**
- الـ backend يستخدم `app.use(cors())` - يجب أن يعمل
- تحقق من أن الـ frontend و backend على نفس domain (Vercel)

### 4. مشكلة في API URL
**السبب:** `VITE_API_URL` غير صحيح أو غير موجود.

**الحل:**
1. في Vercel Dashboard → Settings → Environment Variables
2. أضف/تحقق من:
   ```
   VITE_API_URL=/api
   ```
   (إذا كان الـ backend على نفس domain)
   
   أو:
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   ```
   (إذا كان الـ backend منفصل)

## التحسينات المطبقة ✅

### 1. تحسين معالجة الأخطاء في `api.ts`
- ✅ رسائل خطأ أوضح وأكثر تفصيلاً
- ✅ تمييز بين Network errors و Server errors
- ✅ رسائل خطأ صديقة للمستخدم
- ✅ Logging أفضل للأخطاء

### 2. تحسين معالجة الأخطاء في Dashboard
- ✅ عرض رسائل الخطأ الفعلية من الـ API
- ✅ Logging مفصل في Console
- ✅ إزالة "Unknown error" واستبداله برسائل واضحة

### 3. تحسين Logging في Backend
- ✅ Logging مفصل لكل request
- ✅ Logging للأخطاء مع تفاصيل كاملة
- ✅ Logging للـ database operations

## خطوات التشخيص

### 1. افتح Browser Console
1. اضغط `F12` في المتصفح
2. اذهب إلى Console tab
3. حاول حفظ قسم أو منتج
4. افحص الأخطاء في Console

### 2. افحص Network Tab
1. اضغط `F12` في المتصفح
2. اذهب إلى Network tab
3. حاول حفظ قسم أو منتج
4. افحص الـ request إلى `/api/product-categories` أو `/api/products`
5. تحقق من:
   - Status code (200 = نجاح، 400/500 = خطأ)
   - Response body (يحتوي على رسالة الخطأ)

### 3. افحص Vercel Logs
1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر المشروع
3. اذهب إلى Deployments → آخر deployment → Functions
4. افحص الـ logs للأخطاء

## الحلول السريعة

### الحل 1: التحقق من Environment Variables
```bash
# في Vercel Dashboard → Settings → Environment Variables
# تأكد من وجود:
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
VITE_API_URL=/api
```

### الحل 2: إعادة Deploy
1. في Vercel Dashboard
2. اذهب إلى Deployments
3. اضغط "Redeploy" على آخر deployment

### الحل 3: التحقق من Database Connection
1. تأكد من أن الـ database متاح
2. تحقق من أن الـ IP whitelist يشمل Vercel IPs
3. اختبر الاتصال يدوياً

## بعد التطبيق

بعد تطبيق هذه التحسينات:
1. ✅ رسائل الخطأ ستكون أوضح وأكثر تفصيلاً
2. ✅ Console logs ستساعد في التشخيص
3. ✅ Network tab سيظهر تفاصيل الـ request/response

## الخطوات التالية

1. **ارفع التغييرات على GitHub:**
   ```bash
   git push
   ```

2. **راقب Vercel Deployment:**
   - انتظر حتى يكتمل الـ build
   - افحص الـ logs للأخطاء

3. **اختبر الحفظ مرة أخرى:**
   - حاول حفظ قسم جديد
   - افحص Console للأخطاء
   - افحص Network tab للـ response

4. **إذا استمرت المشكلة:**
   - افتح Browser Console
   - انسخ رسالة الخطأ الكاملة
   - أرسلها للمطور

---

**ملاحظة:** إذا كان الـ backend لا يعمل على Vercel (مشكلة في Serverless Functions أو Database)، قد تحتاج إلى:
- استخدام قاعدة بيانات خارجية (مثل Supabase, Railway, Render)
- أو استخدام Mock API للتطوير (`VITE_USE_MOCK_API=true`)

