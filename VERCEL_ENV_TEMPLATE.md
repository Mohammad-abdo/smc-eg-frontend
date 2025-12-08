# 🔐 Vercel Environment Variables Template

## إضافة Environment Variables في Vercel

اذهب إلى: **Vercel Dashboard → Your Project → Settings → Environment Variables**

---

## 📋 المتغيرات المطلوبة

### 1. Database Configuration

#### خيار A: Vercel Postgres (موصى به)
```env
DATABASE_URL=$POSTGRES_PRISMA_URL
```
**ملاحظة:** Vercel يضيف `POSTGRES_PRISMA_URL` تلقائياً عند إنشاء Postgres database.

#### خيار B: MySQL خارجي
```env
DATABASE_URL=mysql://user:password@host:port/database
```
**أو متغيرات منفصلة:**
```env
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=smc_dashboard
DB_PORT=3306
```

#### خيار C: Postgres خارجي
```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

---

### 2. Frontend Configuration

```env
VITE_API_URL=/api
VITE_USE_MOCK_API=false
```

**ملاحظة:** إذا كان Backend على دومين منفصل:
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

---

### 3. Optional: Migration Security

```env
INIT_SECRET=your_random_secret_key_here
```

**استخدام:** لحماية `/api/init` endpoint من الوصول غير المصرح به.

---

## ✅ Checklist

- [ ] `DATABASE_URL` مضاف (Production)
- [ ] `VITE_API_URL` مضاف (Production)
- [ ] `VITE_USE_MOCK_API=false` (Production)
- [ ] `INIT_SECRET` مضاف (اختياري - Production)

---

## 🔍 التحقق من القيم

بعد إضافة المتغيرات:
1. اذهب إلى **Settings → Environment Variables**
2. تأكد من أن جميع المتغيرات موجودة
3. تأكد من أن **Production** checkbox محدد

---

## 📝 مثال كامل

```env
# Database (Vercel Postgres)
DATABASE_URL=$POSTGRES_PRISMA_URL

# Frontend
VITE_API_URL=/api
VITE_USE_MOCK_API=false

# Security (Optional)
INIT_SECRET=my_super_secret_key_12345
```

---

**بعد إضافة المتغيرات، قم بإعادة Deploy المشروع!**

