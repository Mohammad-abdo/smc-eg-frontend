# ⚡ رفع سريع على Vercel - Quick Deploy

## 🚀 خطوات سريعة (5 دقائق)

### 1. ارفع على GitHub (إذا لم تكن رافع)

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### 2. اذهب إلى Vercel

1. افتح [vercel.com](https://vercel.com)
2. اضغط **"Add New"** → **"Project"**
3. اربط GitHub repository
4. اختر المشروع

### 3. إعدادات Build (اتركها افتراضية)

- **Framework:** Vite (سيتم اكتشافه تلقائياً)
- **Root Directory:** (فارغ)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 4. Environment Variables (مهم جداً!)

**اضغط على "Environment Variables" وأضف:**

#### Frontend:
```
VITE_API_URL = /api
VITE_USE_MOCK_API = false
```

#### Backend:
```
DB_HOST = your_mysql_host
DB_USER = your_mysql_user
DB_PASSWORD = your_mysql_password
DB_NAME = smc_dashboard
PORT = 3001
```

**مهم:** اضغط **"Apply to all environments"**

### 5. اضغط "Deploy"

انتظر 3-5 دقائق حتى ينتهي البناء.

### 6. اختبر

بعد الانتهاء:
- افتح الموقع
- اختبر: `https://your-project.vercel.app/api/products`
- يجب أن ترى JSON array

## ✅ جاهز!

الآن الموقع يعمل على Vercel! 🎉

## 🔧 إذا واجهت مشاكل

### Backend لا يعمل:
- تحقق من Environment Variables
- تحقق من Vercel Functions logs
- تأكد من أن قاعدة البيانات متاحة

### Frontend لا يتصل بالـ Backend:
- تحقق من `VITE_API_URL=/api`
- تحقق من `vercel.json` rewrites
- افتح Network tab في Developer Tools

---

**ملاحظة:** تأكد من أن قاعدة البيانات متاحة من الإنترنت قبل الرفع!

