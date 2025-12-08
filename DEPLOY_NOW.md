# 🚀 ارفع الآن على Vercel - خطوات سريعة

## ✅ كل شيء جاهز!

### الملفات المعدة:
- ✅ `vercel.json` - إعدادات Vercel
- ✅ `backend/server.js` - Backend جاهز
- ✅ `api/index.js` - Wrapper للـ Vercel Functions
- ✅ جميع الملفات محفوظة

## 📋 خطوات الرفع (3 دقائق)

### 1. ارفع على GitHub

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

### 3. Build Settings (اتركها افتراضية)

- ✅ Framework: Vite (تلقائي)
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`

### 4. Environment Variables (مهم!)

**اضغط "Environment Variables" وأضف:**

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

**مهم:** اختر **"Apply to all environments"**

### 5. اضغط "Deploy"

انتظر 3-5 دقائق.

### 6. اختبر

بعد الانتهاء:
- افتح الموقع
- اختبر: `https://your-project.vercel.app/api/products`
- يجب أن ترى JSON

## ✅ جاهز!

الموقع الآن يعمل على Vercel! 🎉

---

**ملاحظة:** تأكد من أن قاعدة البيانات متاحة من الإنترنت!

