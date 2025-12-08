# إعداد قاعدة البيانات - Database Setup Guide

## الوضع الحالي 🔍

### المشكلة:
- البيانات حالياً محفوظة في `localStorage` (في المتصفح فقط)
- كل مستخدم يرى بيانات مختلفة
- التعديلات لا تظهر على الموقع المرفوع على Vercel
- لا توجد قاعدة بيانات حقيقية مشتركة

### الحلول المتاحة:

---

## ✅ الحل الموصى به: Supabase (مجاني)

### المميزات:
- ✅ مجاني تماماً (حتى 500MB قاعدة بيانات)
- ✅ سهل الإعداد
- ✅ يدعم PostgreSQL (قاعدة بيانات قوية)
- ✅ API تلقائي
- ✅ Authentication مدمج
- ✅ Real-time updates
- ✅ يعمل مع Vercel بدون مشاكل

### خطوات الإعداد:

#### 1. إنشاء حساب على Supabase
- اذهب إلى [supabase.com](https://supabase.com)
- أنشئ حساب جديد (مجاني)
- أنشئ مشروع جديد (New Project)
- اختر اسم المشروع والمنطقة (Region)

#### 2. الحصول على API Keys
- بعد إنشاء المشروع، اذهب إلى Settings → API
- انسخ:
  - `Project URL` (مثل: `https://xxxxx.supabase.co`)
  - `anon public` key

#### 3. إضافة Environment Variables في Vercel
- اذهب إلى Vercel Dashboard → مشروعك → Settings → Environment Variables
- أضف:
  ```
  VITE_SUPABASE_URL=https://xxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  VITE_USE_MOCK_API=false
  ```

#### 4. إنشاء الجداول في Supabase
- اذهب إلى SQL Editor في Supabase
- نفذ هذا الكود:

```sql
-- Products Table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  "nameAr" TEXT,
  category TEXT,
  status TEXT DEFAULT 'active',
  views INTEGER DEFAULT 0,
  description TEXT,
  "descriptionAr" TEXT,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- News Table
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  "titleAr" TEXT,
  date DATE DEFAULT CURRENT_DATE,
  category TEXT,
  views INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  content TEXT,
  "contentAr" TEXT,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'viewer',
  status TEXT DEFAULT 'active',
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
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
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tenders Table
CREATE TABLE tenders (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  "titleAr" TEXT,
  category TEXT,
  deadline DATE,
  description TEXT,
  "descriptionAr" TEXT,
  status TEXT DEFAULT 'active',
  "documentFile" TEXT,
  "documentFileName" TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tender Submissions Table
CREATE TABLE tender_submissions (
  id SERIAL PRIMARY KEY,
  tender_id INTEGER REFERENCES tenders(id) ON DELETE CASCADE,
  "companyName" TEXT NOT NULL,
  "contactName" TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  files JSONB DEFAULT '[]',
  status TEXT DEFAULT 'pending',
  "submittedAt" TIMESTAMP DEFAULT NOW()
);

-- Financial Data Tables
CREATE TABLE financial_revenue (
  id SERIAL PRIMARY KEY,
  year TEXT NOT NULL,
  revenue NUMERIC NOT NULL,
  profit NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE financial_production (
  id SERIAL PRIMARY KEY,
  month TEXT NOT NULL,
  production NUMERIC NOT NULL,
  target NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE financial_export (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  color TEXT DEFAULT '#204393',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Page Content Table
CREATE TABLE page_content (
  id SERIAL PRIMARY KEY,
  page TEXT NOT NULL,
  key TEXT NOT NULL,
  "valueEn" TEXT,
  "valueAr" TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(page, key)
);

-- Site Settings Table
CREATE TABLE site_settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  "valueEn" TEXT,
  "valueAr" TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat Messages Table
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  reply TEXT,
  status TEXT DEFAULT 'pending',
  timestamp TIMESTAMP DEFAULT NOW()
);
```

#### 5. تفعيل Row Level Security (RLS)
- في Supabase، اذهب إلى Authentication → Policies
- لكل جدول، أضف Policy:
  ```sql
  -- Allow all operations for now (يمكنك تقييدها لاحقاً)
  CREATE POLICY "Enable all operations" ON products FOR ALL USING (true);
  ```

---

## 🔄 الحل البديل: MongoDB Atlas (مجاني أيضاً)

### المميزات:
- ✅ مجاني (512MB قاعدة بيانات)
- ✅ NoSQL (مرن)
- ✅ سهل الاستخدام

### خطوات الإعداد:
1. أنشئ حساب على [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. أنشئ Cluster جديد (اختر Free tier)
3. احصل على Connection String
4. أضف في Vercel Environment Variables:
   ```
   VITE_MONGODB_URI=your-connection-string
   VITE_USE_MOCK_API=false
   ```

---

## 📝 ملاحظات مهمة:

1. **بعد إعداد قاعدة البيانات:**
   - يجب تحديث `src/services/api.ts` للاتصال بقاعدة البيانات
   - يجب تحديث `src/services/mockApi.ts` لاستخدام قاعدة البيانات بدلاً من localStorage

2. **البيانات الحالية:**
   - البيانات الموجودة في localStorage لن تنتقل تلقائياً
   - يجب إعادة إدخالها من لوحة التحكم بعد ربط قاعدة البيانات

3. **الأمان:**
   - استخدم Row Level Security (RLS) في Supabase
   - لا تضع API keys في الكود مباشرة
   - استخدم Environment Variables فقط

---

## 🚀 الخطوات التالية:

بعد إعداد قاعدة البيانات، أخبرني وسأقوم بـ:
1. تحديث `api.ts` للاتصال بقاعدة البيانات
2. تحديث `mockApi.ts` لاستخدام قاعدة البيانات
3. إضافة Authentication إذا لزم الأمر
4. اختبار كل شيء

---

## ❓ أسئلة شائعة:

**س: هل Supabase مجاني حقاً؟**
ج: نعم، حتى 500MB قاعدة بيانات و 2GB bandwidth شهرياً مجاناً.

**س: هل يمكنني استخدام قاعدة بيانات موجودة؟**
ج: نعم، يمكنك ربط Supabase بقاعدة بيانات PostgreSQL موجودة.

**س: ماذا عن البيانات الحالية في localStorage؟**
ج: يمكنك تصديرها يدوياً أو كتابة script لنقلها تلقائياً.



