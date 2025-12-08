# دليل نشر Backend على Vercel

## الخيارات المتاحة

### الخيار 1: نشر Backend منفصل (موصى به) ✅

إذا كان لديك Backend منفصل على Railway أو Render أو أي خدمة أخرى:

#### خطوات الإعداد:

1. **نشر Backend على Railway/Render:**
   ```bash
   # على Railway أو Render:
   # 1. اربط GitHub repository
   # 2. اختر مجلد backend/
   # 3. أضف Environment Variables:
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=smc_dashboard
   PORT=3001
   ```

2. **إعداد Frontend على Vercel:**
   - اذهب إلى Vercel Dashboard → Project → Settings → Environment Variables
   - أضف:
     ```
     VITE_API_URL=https://your-backend-url.railway.app/api
     VITE_USE_MOCK_API=false
     ```
   - أو إذا كان على Render:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     VITE_USE_MOCK_API=false
     ```

3. **إعادة نشر Frontend:**
   - Vercel سيعيد البناء تلقائياً بعد إضافة Environment Variables

---

### الخيار 2: نشر Backend على Vercel (Serverless Functions)

⚠️ **ملاحظة**: Vercel Serverless Functions لها قيود:
- لا تدعم اتصالات MySQL الطويلة الأمد
- تحتاج إلى استخدام connection pooling
- قد تحتاج إلى تعديل الكود

#### خطوات الإعداد:

1. **إنشاء API Routes في Vercel:**
   - أنشئ مجلد `api/` في الجذر
   - انسخ `backend/server.js` إلى `api/index.js`
   - عدّل الكود ليعمل كـ Serverless Function

2. **إعداد vercel.json:**
   ```json
   {
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "/api/index.js"
       }
     ]
   }
   ```

3. **إعداد Environment Variables في Vercel:**
   ```
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=smc_dashboard
   VITE_API_URL=/api
   VITE_USE_MOCK_API=false
   ```

---

### الخيار 3: استخدام Supabase/Firebase (بدون Backend منفصل)

إذا كنت تريد تجنب إدارة Backend:

1. **استخدم Supabase:**
   - أنشئ حساب على supabase.com
   - أنشئ الجداول
   - استخدم Supabase Client في Frontend

2. **أو استخدم Firebase:**
   - أنشئ حساب على firebase.google.com
   - استخدم Firestore
   - استخدم Firebase SDK في Frontend

---

## التحقق من أن Backend يعمل

### اختبار محلي:

1. **تشغيل Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **اختبار API:**
   ```bash
   curl http://localhost:3001/api/products
   ```

3. **تشغيل Frontend:**
   ```bash
   npm run dev
   ```

### اختبار في الإنتاج:

1. **اختبار Backend URL:**
   ```bash
   curl https://your-backend-url.com/api/products
   ```

2. **التحقق من Environment Variables في Vercel:**
   - اذهب إلى Vercel Dashboard
   - Project → Settings → Environment Variables
   - تأكد من وجود:
     - `VITE_API_URL` → URL Backend
     - `VITE_USE_MOCK_API` → `false`

---

## استكشاف الأخطاء

### المشكلة: Frontend لا يتصل بالـ Backend

**الحل:**
1. تأكد من أن `VITE_API_URL` صحيح في Vercel Environment Variables
2. تأكد من أن Backend يعمل ويمكن الوصول إليه
3. افتح Console في المتصفح وتحقق من الأخطاء
4. تأكد من أن CORS مفعّل في Backend

### المشكلة: Backend لا يستجيب

**الحل:**
1. تحقق من أن Database متصل
2. تحقق من Environment Variables في Backend
3. تحقق من Logs في Railway/Render/Vercel

### المشكلة: البيانات لا تظهر

**الحل:**
1. تأكد من أن `VITE_USE_MOCK_API=false`
2. امسح كاش المتصفح
3. تحقق من Network tab في DevTools

---

## ملخص الإعداد السريع

### للتنمية المحلية:
```bash
# Backend
cd backend
npm install
# أنشئ .env مع بيانات Database
npm start

# Frontend (في terminal آخر)
npm install
# أنشئ .env مع VITE_API_URL=http://localhost:3001/api
npm run dev
```

### للإنتاج:
1. انشر Backend على Railway/Render
2. أضف Environment Variables في Vercel:
   - `VITE_API_URL=https://your-backend-url.com/api`
   - `VITE_USE_MOCK_API=false`
3. انشر Frontend على Vercel

---

## الملفات المطلوبة

- ✅ `.env.example` - مثال لملف Environment Variables
- ✅ `backend/.env.example` - مثال لملف Backend Environment Variables
- ✅ `vercel.json` - إعدادات Vercel
- ✅ `BACKEND_DEPLOYMENT.md` - هذا الملف

