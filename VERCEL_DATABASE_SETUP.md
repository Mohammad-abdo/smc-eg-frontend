# إعداد قاعدة البيانات على Vercel

## المشكلة الحالية
```
Failed to save category: Server error: HTTP 500 error. Please check if the backend is running.
```

هذا يعني أن الـ backend يعمل لكن الـ database connection فشل.

## الأسباب المحتملة

### 1. Environment Variables غير موجودة في Vercel
Vercel يحتاج إلى Environment Variables للاتصال بقاعدة البيانات.

### 2. قاعدة البيانات غير متاحة من Vercel
- Vercel Serverless Functions لا يمكنها الاتصال بقاعدة بيانات MySQL محلية
- تحتاج إلى قاعدة بيانات سحابية (Cloud Database)

### 3. قاعدة البيانات غير موجودة أو الجداول غير موجودة
- يجب إنشاء قاعدة البيانات والجداول أولاً

## الحلول

### الحل 1: استخدام قاعدة بيانات سحابية (موصى به)

#### الخيار A: Railway (موصى به - سهل)
1. اذهب إلى [railway.app](https://railway.app)
2. أنشئ حساب جديد (مجاني)
3. أنشئ مشروع جديد → Add MySQL
4. انسخ Connection String
5. في Vercel Dashboard → Settings → Environment Variables:
   ```
   DB_HOST=containers-us-west-xxx.railway.app
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=railway
   DB_PORT=3306
   ```
6. نفذ `backend/schema.sql` في Railway MySQL

#### الخيار B: PlanetScale (موصى به - مجاني)
1. اذهب إلى [planetscale.com](https://planetscale.com)
2. أنشئ حساب جديد (مجاني)
3. أنشئ database جديد
4. في Vercel Dashboard → Settings → Environment Variables:
   ```
   DB_HOST=your-database.psdb.cloud
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   DB_PORT=3306
   ```
5. نفذ `backend/schema.sql` في PlanetScale

#### الخيار C: Supabase (PostgreSQL - مجاني)
1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ حساب جديد (مجاني)
3. أنشئ مشروع جديد
4. في Vercel Dashboard → Settings → Environment Variables:
   ```
   DB_HOST=db.xxxxx.supabase.co
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=postgres
   DB_PORT=5432
   ```
5. **ملاحظة:** Supabase يستخدم PostgreSQL، قد تحتاج إلى تعديل الكود

### الحل 2: إضافة Environment Variables في Vercel

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر المشروع
3. Settings → Environment Variables
4. أضف:
   ```
   DB_HOST=your-database-host
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=your-database-name
   DB_PORT=3306
   ```
5. اضغط "Save"
6. **مهم:** أعد Deploy المشروع

### الحل 3: إنشاء قاعدة البيانات والجداول

1. اتصل بقاعدة البيانات (Railway, PlanetScale, etc.)
2. نفذ محتوى `backend/schema.sql`
3. تأكد من أن جميع الجداول تم إنشاؤها

## التحقق من الحالة

### 1. Health Check Endpoint
بعد الرفع على Vercel، افتح:
```
https://your-site.vercel.app/api/health
```

يجب أن ترى:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-..."
}
```

إذا رأيت:
```json
{
  "status": "error",
  "database": "disconnected",
  "error": "..."
}
```
يعني أن الـ database connection فشل.

### 2. Browser Console
1. افتح Browser Console (F12)
2. حاول حفظ قسم
3. افحص رسالة الخطأ
4. ستجد رسالة أوضح عن سبب المشكلة

## خطوات الإعداد الكاملة

### 1. إنشاء قاعدة بيانات سحابية
- استخدم Railway أو PlanetScale (أسهل)

### 2. إضافة Environment Variables في Vercel
```
DB_HOST=your-host
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=your-database
DB_PORT=3306
```

### 3. إنشاء الجداول
- نفذ `backend/schema.sql` في قاعدة البيانات

### 4. إعادة Deploy
- في Vercel Dashboard → Deployments → Redeploy

### 5. اختبار
- افتح `/api/health` للتحقق من الاتصال
- حاول حفظ قسم من Dashboard

## استكشاف الأخطاء

### خطأ: "Database connection failed"
- ✅ تحقق من Environment Variables في Vercel
- ✅ تحقق من أن قاعدة البيانات متاحة من الإنترنت
- ✅ تحقق من أن الـ IP whitelist يشمل Vercel IPs (إذا لزم الأمر)

### خطأ: "Access denied"
- ✅ تحقق من username و password
- ✅ تحقق من أن المستخدم لديه صلاحيات على قاعدة البيانات

### خطأ: "Unknown database"
- ✅ تحقق من أن قاعدة البيانات موجودة
- ✅ تحقق من `DB_NAME` في Environment Variables

### خطأ: "Table doesn't exist"
- ✅ نفذ `backend/schema.sql` لإنشاء الجداول

---

**بعد تطبيق هذه الخطوات، يجب أن يعمل الحفظ بنجاح! ✅**

