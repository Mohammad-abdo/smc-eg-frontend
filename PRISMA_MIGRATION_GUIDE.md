# دليل الانتقال إلى Prisma

## ما تم إنجازه ✅

1. ✅ تثبيت Prisma و @prisma/client
2. ✅ إنشاء Prisma schema من SQL schema
3. ✅ إنشاء Prisma client helper (`backend/lib/prisma.js`)
4. ✅ إنشاء database helper functions (`backend/lib/db.js`)
5. ✅ تحديث `backend/server.js` لاستخدام Prisma (جزئياً)
6. ✅ تحديث package.json scripts

## ما يحتاج إكمال 🔄

### 1. إعداد DATABASE_URL

في ملف `backend/.env`:
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

مثال:
```env
DATABASE_URL="mysql://root:password@localhost:3306/smc_dashboard"
```

أو استخدام متغيرات منفصلة (للتوافق مع الكود القديم):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=smc_dashboard
DB_PORT=3306
```

### 2. إنشاء Prisma Client

```bash
cd backend
npx prisma generate
```

### 3. تطبيق Schema على قاعدة البيانات

**الخيار 1: استخدام Migrations (موصى به)**
```bash
cd backend
npx prisma migrate dev --name init
```

**الخيار 2: Push مباشر (للتطوير فقط)**
```bash
cd backend
npx prisma db push
```

### 4. تحديث باقي Endpoints

تم تحديث:
- ✅ `GET /api/product-categories`
- ✅ `GET /api/product-categories/:id`
- ✅ `POST /api/product-categories`

يحتاج تحديث:
- ⏳ `PUT /api/product-categories/:id`
- ⏳ `DELETE /api/product-categories/:id`
- ⏳ `GET /api/products`
- ⏳ `GET /api/products/:id`
- ⏳ `POST /api/products`
- ⏳ `PUT /api/products/:id`
- ⏳ `DELETE /api/products/:id`
- ⏳ باقي endpoints (news, users, contacts, etc.)

## الخطوات التالية

### 1. إعداد Environment Variables

```bash
cd backend
cp .env.example .env
# عدّل .env بمعلومات قاعدة البيانات
```

### 2. Generate Prisma Client

```bash
cd backend
npm run prisma:generate
```

### 3. تطبيق Schema

```bash
cd backend
npm run prisma:migrate
```

### 4. اختبار الاتصال

```bash
cd backend
npm run dev
```

افتح: `http://localhost:3001/api/health`

### 5. تحديث باقي Endpoints

استخدم نفس النمط المستخدم في `product-categories`:
- استبدل `query()` بـ `prisma.modelName.findMany()`
- استبدل `queryOne()` بـ `prisma.modelName.findUnique()`
- استبدل `INSERT` بـ `prisma.modelName.create()`
- استبدل `UPDATE` بـ `prisma.modelName.update()`
- استبدل `DELETE` بـ `prisma.modelName.delete()`

## ملاحظات مهمة

1. **Prisma Schema**: موجود في `backend/prisma/schema.prisma`
2. **Database Helper**: موجود في `backend/lib/db.js`
3. **Prisma Client**: موجود في `backend/lib/prisma.js`
4. **Formatting**: استخدم `formatProduct()` و `formatCategory()` للحفاظ على التوافق

## استكشاف الأخطاء

### خطأ: "Prisma Client not generated"
```bash
cd backend
npx prisma generate
```

### خطأ: "Table doesn't exist"
```bash
cd backend
npx prisma migrate dev
```

### خطأ: "DATABASE_URL not found"
- تأكد من وجود `.env` في `backend/`
- تأكد من صحة `DATABASE_URL`

---

**بعد إكمال هذه الخطوات، سيكون الـ backend جاهزاً للاستخدام مع Prisma! 🚀**

