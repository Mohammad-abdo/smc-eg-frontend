# 🚀 إجبار Vercel على الرفع - Force Deployment

## المشكلة
الـ commit الجديد لا يظهر على Vercel تلقائياً.

## الحل السريع (3 خطوات)

### 1. تأكد من أن الملفات في Git

```bash
# تحقق من الملفات المهمة
git ls-files vercel.json
git ls-files api/index.js
git ls-files backend/server.js

# إذا لم تكن موجودة، أضفها
git add vercel.json api/index.js backend/server.js
git commit -m "Add Vercel deployment files"
git push
```

### 2. في Vercel Dashboard

**الطريقة 1: Redeploy يدوياً**
1. اذهب إلى [vercel.com/dashboard](https://vercel.com/dashboard)
2. اختر المشروع
3. اضغط **"Redeploy"** بجانب آخر deployment
4. أو اذهب إلى **Deployments** → اضغط **"..."** → **"Redeploy"**

**الطريقة 2: إعادة ربط Git**
1. Settings → Git
2. اضغط **"Disconnect"**
3. ثم **"Connect Git Repository"**
4. اختر نفس Repository

### 3. استخدام Vercel CLI (الأسرع)

```bash
# تثبيت Vercel CLI
npm install -g vercel

# تسجيل الدخول
vercel login

# رفع مباشر (يتجاوز Git)
vercel --prod
```

## ✅ التحقق

بعد الرفع:
1. افتح الموقع
2. اختبر: `https://your-project.vercel.app/api/products`
3. يجب أن ترى التغييرات

---

**ملاحظة:** إذا استمرت المشكلة، جرب إعادة ربط Repository في Vercel.

