# إصلاح مشكلة الاتصال بقاعدة البيانات

## المشكلة
```
Error: P1001: Can't reach database server at `localhost:3306`
```

## الحلول

### الحل 1: التحقق من MySQL Service (Windows)

1. اضغط `Win + R`
2. اكتب `services.msc` واضغط Enter
3. ابحث عن "MySQL" في القائمة
4. تأكد من أن Status = "Running"
5. إذا كان "Stopped"، اضغط "Start"

### الحل 2: إنشاء ملف .env

في مجلد `backend/`، أنشئ ملف `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smc_dashboard
DB_PORT=3306
```

**مهم**: استبدل `your_mysql_password` بكلمة مرور MySQL الخاصة بك

### الحل 3: التحقق من الاتصال

```bash
cd backend
npm run check-db
```

هذا سيقوم بـ:
- ✅ التحقق من اتصال MySQL
- ✅ إنشاء قاعدة البيانات إذا لم تكن موجودة
- ✅ اختبار الاتصال

### الحل 4: إنشاء قاعدة البيانات يدوياً

1. افتح MySQL Command Line أو MySQL Workbench
2. سجل دخول:
   ```bash
   mysql -u root -p
   ```
3. أنشئ قاعدة البيانات:
   ```sql
   CREATE DATABASE IF NOT EXISTS smc_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### الحل 5: استخدام قاعدة بيانات سحابية

إذا لم يكن MySQL مثبت محلياً، استخدم:
- **PlanetScale** (مجاني): https://planetscale.com
- **Railway** (مجاني): https://railway.app

ثم أضف معلومات الاتصال في `.env`:
```env
DB_HOST=your-cloud-host
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=your-database
DB_PORT=3306
```

## بعد إصلاح الاتصال

### 1. Generate Prisma Client (إذا لم يتم)
```bash
cd backend
npm run prisma:generate
```

### 2. Run Migrations
```bash
npm run prisma:migrate
```

أو للتطوير:
```bash
npm run prisma:push
```

### 3. تشغيل Backend
```bash
npm run dev
```

## استكشاف الأخطاء

### خطأ: "Access denied"
- تأكد من صحة username و password في `.env`
- تأكد من أن المستخدم لديه صلاحيات

### خطأ: "Can't reach database server"
- تأكد من أن MySQL service يعمل
- تحقق من `DB_HOST` و `DB_PORT` في `.env`
- للاتصال البعيد: تحقق من firewall و IP whitelist

### خطأ: "Unknown database"
- شغّل `npm run check-db` لإنشاء قاعدة البيانات تلقائياً
- أو أنشئها يدوياً من MySQL

---

**بعد إصلاح الاتصال، شغّل `npm run prisma:migrate` مرة أخرى! 🚀**

