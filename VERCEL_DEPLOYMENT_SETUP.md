# إعداد Vercel Deployment - دليل شامل

## ✅ التحقق من الإعدادات

### 1. Backend Configuration

#### ملف `backend/.env` (يجب إنشاؤه)
```env
PORT=3001
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=smc_dashboard
```

#### ملف `backend/vercel.json` ✅ موجود وصحيح
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### 2. Frontend Configuration

#### ملف `.env` (يجب إنشاؤه في الجذر)
```env
# للـ Production على Vercel:
VITE_API_URL=/api

# أو إذا كان Backend على دومين منفصل:
# VITE_API_URL=https://your-backend.vercel.app/api

# تأكد من استخدام API الحقيقي:
VITE_USE_MOCK_API=false
```

#### ملف `vercel.json` ✅ موجود ومحدث
- ✅ Rewrites للـ API routes
- ✅ Headers لمنع الـ caching
- ✅ Functions configuration

### 3. API Base URL Configuration

#### ملف `src/services/api.ts` ✅ محدث
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? '/api'  // Default: assume backend is on same domain
    : 'http://localhost:3001/api'  // Local development
  );
```

## 🚀 خطوات النشر على Vercel

### الخيار 1: Backend و Frontend على نفس المشروع (موصى به)

#### 1. رفع Backend كـ Vercel Serverless Functions

**في Vercel Dashboard:**
1. اذهب إلى Project Settings
2. اضغط على "Functions"
3. تأكد من أن `api/` folder موجود

**أو استخدم Vercel CLI:**
```bash
# من مجلد backend/
vercel --prod
```

#### 2. رفع Frontend

```bash
# من الجذر
vercel --prod
```

#### 3. إعداد Environment Variables في Vercel

**في Vercel Dashboard → Settings → Environment Variables:**

**للـ Frontend:**
```
VITE_API_URL=/api
VITE_USE_MOCK_API=false
```

**للـ Backend (إذا كان منفصلاً):**
```
PORT=3001
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=smc_dashboard
```

### الخيار 2: Backend منفصل (على Railway/Render/etc)

#### 1. نشر Backend على Railway/Render

**Railway:**
1. اربط GitHub repository
2. اختر `backend/` folder
3. أضف Environment Variables:
   ```
   PORT=3001
   DB_HOST=...
   DB_USER=...
   DB_PASSWORD=...
   DB_NAME=smc_dashboard
   ```

#### 2. تحديث Frontend Environment Variables

**في Vercel Dashboard:**
```
VITE_API_URL=https://your-backend.railway.app/api
VITE_USE_MOCK_API=false
```

## ✅ التحقق من أن كل شيء يعمل

### 1. اختبار Backend محلياً

```bash
cd backend
npm install
# أنشئ ملف .env مع بيانات قاعدة البيانات
npm start
```

**اختبر:**
```bash
curl http://localhost:3001/api/products
```

### 2. اختبار Frontend محلياً

```bash
# من الجذر
npm install
# أنشئ ملف .env مع VITE_API_URL=http://localhost:3001/api
npm run dev
```

### 3. بعد النشر على Vercel

**اختبر Backend:**
```bash
curl https://your-project.vercel.app/api/products
```

**اختبر Frontend:**
- افتح https://your-project.vercel.app
- افتح Developer Tools → Network
- تأكد من أن requests تذهب إلى `/api/products`

## 🔧 استكشاف الأخطاء

### المشكلة: API requests تفشل

**الحل:**
1. تأكد من أن `VITE_API_URL` صحيح في Vercel Environment Variables
2. تأكد من أن Backend منشور ويعمل
3. تحقق من CORS settings في `backend/server.js`

### المشكلة: قاعدة البيانات لا تتصل

**الحل:**
1. تأكد من أن Environment Variables في Vercel صحيحة
2. تأكد من أن قاعدة البيانات تسمح بالاتصالات من Vercel IPs
3. استخدم connection pooling إذا لزم الأمر

### المشكلة: البيانات لا تظهر

**الحل:**
1. تأكد من `VITE_USE_MOCK_API=false`
2. امسح cache المتصفح (Ctrl + Shift + Delete)
3. تحقق من Network tab في Developer Tools

## 📝 ملاحظات مهمة

1. **Backend على Vercel**: 
   - Vercel Serverless Functions تدعم MySQL
   - تأكد من أن قاعدة البيانات متاحة من الإنترنت
   - استخدم connection pooling للـ performance

2. **Environment Variables**:
   - Frontend variables تبدأ بـ `VITE_`
   - Backend variables لا تحتاج prefix
   - أضفها في Vercel Dashboard → Settings → Environment Variables

3. **Database**:
   - استخدم MySQL cloud service (PlanetScale, Railway, etc)
   - أو استخدم VPS مع MySQL
   - تأكد من أن قاعدة البيانات متاحة من الإنترنت

## ✅ Checklist قبل النشر

- [ ] Backend `.env` file موجود مع بيانات قاعدة البيانات
- [ ] Frontend `.env` file موجود مع `VITE_API_URL`
- [ ] `VITE_USE_MOCK_API=false` في production
- [ ] قاعدة البيانات متاحة من الإنترنت
- [ ] Environment Variables مضاف في Vercel
- [ ] Backend يعمل محلياً
- [ ] Frontend يتصل بالـ Backend محلياً
- [ ] تم اختبار جميع الـ API endpoints

## 🎯 النتيجة المتوقعة

بعد النشر:
- ✅ جميع صفحات المنتجات تستخدم `/api/products`
- ✅ البيانات من قاعدة البيانات (ليست mock)
- ✅ التحديثات من Dashboard تظهر فوراً
- ✅ لا توجد بيانات ثابتة أو hardcoded

