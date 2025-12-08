# ✅ تحديث Prisma إلى v7 - مكتمل

## ما تم إنجازه ✅

### 1. تحديث Prisma Schema ✅
- ✅ حذف `url` من `prisma/schema.prisma`
- ✅ إضافة تعليق يوضح أن URL في `prisma.config.ts`

### 2. إنشاء prisma.config.ts ✅
- ✅ ملف `backend/prisma.config.ts` موجود
- ✅ يستخدم CommonJS (`require` بدلاً من `import`)
- ✅ يستدعي `lib/env.js` لضمان وجود DATABASE_URL
- ✅ يستخدم `env('DATABASE_URL')` من prisma/config

### 3. تثبيت Adapter ✅
- ✅ تثبيت `@prisma/adapter-mariadb@^7.0.1`
- ✅ تحديث `backend/lib/prisma.js` لاستخدام adapter

### 4. تحديث Prisma Client ✅
- ✅ `backend/lib/prisma.js` يستخدم `PrismaMariaDb` adapter
- ✅ يبني adapter من environment variables (DB_HOST, DB_USER, etc.)
- ✅ يدعم كلاً من DATABASE_URL والمتغيرات المنفصلة
- ✅ Connection pooling مع `connectionLimit: 10`

## البنية الجديدة

### backend/prisma/schema.prisma
```prisma
datasource db {
  provider = "mysql"
  // url is now configured in prisma.config.ts
}
```

### backend/prisma.config.ts
```javascript
require('dotenv').config();
const { defineConfig, env } = require('prisma/config');

// Ensure DATABASE_URL is set
const { getDatabaseUrl } = require('./lib/env');
getDatabaseUrl();

module.exports = defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
```

### backend/lib/prisma.js
```javascript
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smc_dashboard',
  port: Number(process.env.DB_PORT || 3306),
  connectionLimit: 10,
});

const prisma = new PrismaClient({ adapter });
```

## الخطوات التالية

### 1. Generate Prisma Client

```bash
cd backend
npm run prisma:generate
```

### 2. Run Migrations

```bash
cd backend
npm run prisma:migrate
```

أو للتطوير (push مباشر):
```bash
npm run prisma:push
```

### 3. تشغيل Backend

```bash
cd backend
npm run dev
```

### 4. اختبار API

افتح: `http://localhost:3001/api/health`

يجب أن ترى:
```json
{
  "status": "ok",
  "database": "connected"
}
```

## ملاحظات مهمة

1. **Prisma v7**: يستخدم adapter pattern بدلاً من connection string مباشر
2. **DATABASE_URL**: لا يزال مطلوباً في `prisma.config.ts` لكن يتم بناؤه تلقائياً من متغيرات منفصلة
3. **Adapter**: `@prisma/adapter-mariadb` متوافق مع MySQL
4. **Environment Variables**: يدعم كلاً من:
   - `DATABASE_URL` (مباشر)
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` (منفصلة)

## استكشاف الأخطاء

### خطأ: "Adapter not found"
```bash
cd backend
npm install @prisma/adapter-mariadb
```

### خطأ: "DATABASE_URL not found"
- تأكد من وجود `.env` في `backend/`
- أو أضف Environment Variables في Vercel
- `lib/env.js` سيبني DATABASE_URL تلقائياً من متغيرات منفصلة

### خطأ: "Prisma Client not generated"
```bash
cd backend
npm run prisma:generate
```

### خطأ: "Table doesn't exist"
```bash
cd backend
npm run prisma:migrate
# أو
npm run prisma:push
```

---

**الآن Prisma v7 جاهز للاستخدام! 🚀**

