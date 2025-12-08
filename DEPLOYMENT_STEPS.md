# 🚀 خطوات النشر الكاملة على Vercel

## الخطوة 1: Provision Database

### خيار A: Vercel Postgres (الأسهل)

1. اذهب إلى: **Vercel Dashboard → Your Project → Storage**
2. اضغط **Create Database**
3. اختر **Postgres**
4. اختر Plan (Free tier متاح)
5. انسخ **Connection String** (سيظهر كـ `POSTGRES_PRISMA_URL`)

### خيار B: Database خارجي

- **Railway:** https://railway.app (MySQL/Postgres)
- **PlanetScale:** https://planetscale.com (MySQL)
- **Supabase:** https://supabase.com (Postgres)

انسخ Connection String من provider الخاص بك.

---

## الخطوة 2: إضافة Environment Variables

### في Vercel Dashboard:

1. اذهب إلى: **Your Project → Settings → Environment Variables**
2. أضف المتغيرات التالية:

```env
# Database (اختر واحد فقط)
DATABASE_URL=$POSTGRES_PRISMA_URL  # للـ Vercel Postgres
# أو
DATABASE_URL=mysql://user:pass@host:port/db  # للـ MySQL خارجي
# أو
DATABASE_URL=postgresql://user:pass@host:port/db  # للـ Postgres خارجي

# Frontend
VITE_API_URL=/api
VITE_USE_MOCK_API=false

# Optional: Security
INIT_SECRET=your_secret_key
```

3. تأكد من تحديد **Production** checkbox
4. اضغط **Save**

---

## الخطوة 3: تحديث Prisma Schema (إذا لزم)

### إذا استخدمت Vercel Postgres:
`backend/prisma/schema.prisma` محدث بالفعل (postgresql).

### إذا استخدمت MySQL:
غيّر في `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "mysql"  // بدلاً من "postgresql"
}
```

---

## الخطوة 4: Deploy

### من Vercel Dashboard:
1. اذهب إلى **Deployments**
2. اضغط **Redeploy** على آخر deployment
3. أو اربط GitHub repository و Vercel سينشر تلقائياً

### من CLI:
```bash
vercel --prod
```

---

## الخطوة 5: تشغيل Migrations

بعد النشر، شغّل migrations:

### خيار A: عبر API (موصى به)
```bash
curl -X POST https://your-project.vercel.app/api/init
```

### خيار B: عبر Vercel CLI
```bash
vercel env pull .env.production
cd backend
npx prisma migrate deploy
```

---

## الخطوة 6: التحقق

### 1. Health Check:
```bash
curl https://your-project.vercel.app/api/health
```

**النتيجة:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

### 2. Test Product Creation:
```bash
curl -X POST https://your-project.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "nameAr": "منتج تجريبي",
    "category_id": 1,
    "status": "active"
  }'
```

### 3. Test Frontend:
افتح: `https://your-project.vercel.app`

---

## ✅ Checklist

- [ ] Database provisioned
- [ ] Environment Variables مضاف
- [ ] Prisma schema محدث
- [ ] تم Deploy
- [ ] تم تشغيل migrations
- [ ] `/api/health` يعمل
- [ ] `POST /api/products` يعمل
- [ ] Frontend يعمل

---

**الآن المشروع Live على Vercel! 🎉**

