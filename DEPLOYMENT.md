# دليل النشر - Deployment Guide

## المشكلة الحالية
البيانات محفوظة في `localStorage` فقط، لذلك لا تظهر التعديلات على الموقع المرفوع على Vercel.

## الحل: استخدام Vercel Serverless Functions

تم إنشاء API endpoints في مجلد `api/` لاستخدامها مع Vercel.

⚠️ **مهم جداً**: Vercel Serverless Functions لا تدعم كتابة ملفات على القرص في Production. البيانات ستُفقد عند إعادة تشغيل الـ functions.

## الحل الموصى به: استخدام Supabase (مجاني)

### خطوات الإعداد:

1. **إنشاء حساب على Supabase**:
   - اذهب إلى [supabase.com](https://supabase.com)
   - أنشئ مشروع جديد

2. **إنشاء الجداول**:
```sql
-- Products Table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  "nameAr" TEXT,
  category TEXT,
  status TEXT,
  views INTEGER DEFAULT 0,
  description TEXT,
  "descriptionAr" TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- News Table
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  "titleAr" TEXT,
  date DATE,
  category TEXT,
  views INTEGER DEFAULT 0,
  status TEXT,
  content TEXT,
  "contentAr" TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT,
  status TEXT,
  permissions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contacts Table
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Complaints Table
CREATE TABLE complaints (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  subject TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Banners Table
CREATE TABLE banners (
  id SERIAL PRIMARY KEY,
  image TEXT,
  title TEXT,
  "titleAr" TEXT,
  subtitle TEXT,
  "subtitleAr" TEXT,
  description TEXT,
  "descriptionAr" TEXT,
  "order" INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. **إضافة Environment Variables في Vercel**:
   - `VITE_SUPABASE_URL=your-project-url`
   - `VITE_SUPABASE_ANON_KEY=your-anon-key`
   - `VITE_USE_MOCK_API=false`

## أو: استخدام الحل الحالي (للتجربة فقط)

### خطوات النشر:

1. **رفع الكود على GitHub**:
```bash
git add .
git commit -m "Add API endpoints"
git push
```

2. **ربط المشروع على Vercel**:
   - اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
   - اضغط "Add New Project"
   - اختر المشروع من GitHub

3. **إعداد Environment Variables**:
   - في Vercel Dashboard → Settings → Environment Variables
   - أضف: `VITE_USE_MOCK_API=false`

4. **بعد النشر**:
   - افتح Dashboard: `https://your-site.vercel.app/dashboard`
   - سجل دخول: `admin@smc-eg.com` / `admin123`
   - ⚠️ **تحذير**: البيانات قد تُفقد لأن Vercel Serverless Functions لا تحفظ البيانات بشكل دائم

## الحل الأفضل: Supabase

استخدم Supabase للحصول على:
- ✅ قاعدة بيانات دائمة
- ✅ API تلقائي
- ✅ مجاني حتى 500MB
- ✅ Real-time updates

## استكشاف الأخطاء

### التعديلات لا تظهر:
1. تأكد أن `VITE_USE_MOCK_API=false` في Production
2. تحقق من Console في المتصفح
3. تأكد أن API endpoints تعمل

### البيانات تُفقد:
- هذا طبيعي مع Vercel Serverless Functions بدون database
- استخدم Supabase للحل الدائم
