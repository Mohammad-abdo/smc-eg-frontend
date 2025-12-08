# 🚀 دليل الرفع على Vercel - خطوة بخطوة

## ✅ التحقق قبل الرفع

### 1. تأكد من أن المشروع جاهز:
- [x] `vercel.json` موجود ومحدث
- [x] `package.json` موجود
- [x] `backend/package.json` موجود
- [x] جميع الملفات محفوظة

### 2. تأكد من قاعدة البيانات:
- [ ] قاعدة البيانات MySQL متاحة من الإنترنت
- [ ] لديك بيانات الاتصال (host, user, password, database name)

## 📋 خطوات الرفع

### الطريقة 1: رفع من Vercel Dashboard (موصى به)

#### الخطوة 1: إنشاء مشروع جديد في Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. اضغط على **"Add New"** → **"Project"**
3. اربط GitHub repository الخاص بك
4. اختر المشروع

#### الخطوة 2: إعداد Build Settings

**Root Directory:** اتركه فارغ (الجذر)

**Framework Preset:** Vite

**Build Command:** `npm run build`

**Output Directory:** `dist`

**Install Command:** `npm install`

#### الخطوة 3: إضافة Environment Variables

**في Vercel Dashboard → Settings → Environment Variables:**

##### للـ Frontend:
```
VITE_API_URL=/api
VITE_USE_MOCK_API=false
```

##### للـ Backend (إذا كان على نفس المشروع):
```
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=smc_dashboard
PORT=3001
NODE_ENV=production
```

**مهم:** 
- اضغط على **"Apply to all environments"** (Production, Preview, Development)
- أو اختر **"Production"** فقط

#### الخطوة 4: إعداد Vercel Functions

**في Vercel Dashboard → Settings → Functions:**

- **Runtime:** Node.js 18.x (أو أحدث)
- **Max Duration:** 60s (أو أكثر إذا لزم)

#### الخطوة 5: الرفع

1. اضغط على **"Deploy"**
2. انتظر حتى ينتهي البناء
3. بعد الانتهاء، ستجد رابط المشروع

### الطريقة 2: رفع من Terminal (Vercel CLI)

#### الخطوة 1: تثبيت Vercel CLI

```bash
npm install -g vercel
```

#### الخطوة 2: تسجيل الدخول

```bash
vercel login
```

#### الخطوة 3: رفع المشروع

```bash
# من الجذر
vercel
```

**أثناء الرفع:**
- **Set up and deploy?** → Y
- **Which scope?** → اختر حسابك
- **Link to existing project?** → N (للمرة الأولى)
- **Project name?** → اضغط Enter (استخدم الاسم الافتراضي)
- **Directory?** → اضغط Enter (الجذر)
- **Override settings?** → N

#### الخطوة 4: إضافة Environment Variables

```bash
# Frontend
vercel env add VITE_API_URL production
# أدخل: /api

vercel env add VITE_USE_MOCK_API production
# أدخل: false

# Backend
vercel env add DB_HOST production
# أدخل: your_mysql_host

vercel env add DB_USER production
# أدخل: your_mysql_user

vercel env add DB_PASSWORD production
# أدخل: your_mysql_password

vercel env add DB_NAME production
# أدخل: smc_dashboard

vercel env add PORT production
# أدخل: 3001
```

#### الخطوة 5: رفع Production

```bash
vercel --prod
```

## ⚙️ إعدادات مهمة

### 1. Vercel.json Configuration ✅

الملف `vercel.json` موجود ومحدث:
- ✅ Rewrites: `/api/*` → `/backend/server.js`
- ✅ Headers: Cache-control لمنع caching
- ✅ Functions: Node.js 18.x runtime

### 2. Backend على Vercel

**الخيار 1: Backend كـ Serverless Function (موصى به)**
- Backend يعمل كـ Vercel Serverless Function
- `/api/*` requests تذهب إلى `/backend/server.js`
- يحتاج Environment Variables لقاعدة البيانات

**الخيار 2: Backend منفصل (Railway/Render/etc)**
- رفع Backend على Railway أو Render
- تحديث `VITE_API_URL` في Vercel:
  ```
  VITE_API_URL=https://your-backend.railway.app/api
  ```

### 3. قاعدة البيانات

**خيارات قاعدة البيانات:**
1. **PlanetScale** (موصى به - مجاني)
   - اذهب إلى [planetscale.com](https://planetscale.com)
   - أنشئ database
   - احصل على connection string

2. **Railway MySQL**
   - اذهب إلى [railway.app](https://railway.app)
   - أنشئ MySQL service
   - احصل على connection details

3. **VPS مع MySQL**
   - استخدم VPS (DigitalOcean, AWS, etc)
   - ثبت MySQL
   - تأكد من أن قاعدة البيانات متاحة من الإنترنت

## 🔍 التحقق بعد الرفع

### 1. اختبر Backend

```bash
curl https://your-project.vercel.app/api/products
```

**النتيجة المتوقعة:**
```json
[{ "id": 1, "name": "...", ... }]
```

### 2. اختبر Frontend

1. افتح https://your-project.vercel.app
2. افتح Developer Tools → Network
3. تأكد من أن requests تذهب إلى `/api/products`
4. تأكد من Status: 200

### 3. اختبر Dashboard

1. سجل دخول إلى Dashboard
2. أضف منتج جديد
3. تأكد من ظهوره في Frontend

## 🐛 استكشاف الأخطاء

### خطأ: "Function not found" أو 404

**الحل:**
1. تحقق من `vercel.json` rewrites
2. تأكد من أن `backend/server.js` موجود
3. تحقق من Vercel Functions logs

### خطأ: "Database connection failed"

**الحل:**
1. تحقق من Environment Variables في Vercel
2. تأكد من أن قاعدة البيانات متاحة من الإنترنت
3. تحقق من Vercel Functions logs

### خطأ: "Build failed"

**الحل:**
1. تحقق من Build Logs في Vercel
2. تأكد من أن جميع dependencies مثبتة
3. تحقق من أن `package.json` صحيح

## 📝 Checklist النهائي

### قبل الرفع:
- [x] `vercel.json` موجود ومحدث
- [x] جميع الملفات محفوظة
- [ ] قاعدة البيانات جاهزة ومتاحة
- [ ] لديك بيانات الاتصال بقاعدة البيانات

### أثناء الرفع:
- [ ] رفع المشروع على Vercel
- [ ] إضافة Environment Variables
- [ ] انتظار انتهاء البناء

### بعد الرفع:
- [ ] اختبر Backend (`/api/products`)
- [ ] اختبر Frontend (الموقع يفتح)
- [ ] اختبر Dashboard (إضافة منتج)
- [ ] تأكد من ظهور المنتجات في Frontend

## 🎯 النتيجة المتوقعة

بعد اكتمال الرفع:
- ✅ الموقع يعمل على `https://your-project.vercel.app`
- ✅ Backend يعمل على `/api/*`
- ✅ قاعدة البيانات متصلة
- ✅ Dashboard يعمل
- ✅ Frontend يعرض المنتجات من قاعدة البيانات

## 📞 ملاحظات إضافية

1. **أول رفع قد يستغرق 5-10 دقائق**
2. **Environment Variables:** تأكد من إضافتها قبل الرفع
3. **Database:** تأكد من أن قاعدة البيانات متاحة من الإنترنت
4. **CORS:** `app.use(cors())` موجود في Backend ✅

---

## 🚀 ابدأ الآن!

1. اذهب إلى [vercel.com](https://vercel.com)
2. اضغط على **"Add New"** → **"Project"**
3. اربط GitHub repository
4. أضف Environment Variables
5. اضغط **"Deploy"**

**Good luck! 🎉**

