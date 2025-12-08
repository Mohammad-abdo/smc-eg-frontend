# 📝 Prisma Commands - دليل الأوامر

## ⚠️ مهم: جميع أوامر Prisma يجب تشغيلها من مجلد `backend/`

### من الجذر (Root):
استخدم npm scripts المضافة في `package.json`:

```bash
# Migration Development
npm run prisma:migrate

# Migration Deploy (Production)
npm run prisma:migrate:deploy

# Reset Database (⚠️ يحذف جميع البيانات)
npm run prisma:migrate:reset

# Generate Prisma Client
npm run prisma:generate

# Prisma Studio
npm run prisma:studio
```

### من مجلد `backend/`:
```bash
cd backend

# Migration Development
npm run prisma:migrate
# أو
npx prisma migrate dev

# Migration Deploy (Production)
npm run prisma:migrate:deploy
# أو
npx prisma migrate deploy

# Reset Database (⚠️ يحذف جميع البيانات)
npx prisma migrate reset --force

# Generate Prisma Client
npm run prisma:generate
# أو
npx prisma generate

# Prisma Studio
npm run prisma:studio
# أو
npx prisma studio
```

---

## 🔧 الأوامر الأساسية

### 1. Migration Development
```bash
cd backend
npx prisma migrate dev
```
- ينشئ migration جديدة
- يطبقها على قاعدة البيانات
- يولد Prisma Client تلقائياً

### 2. Migration Deploy (Production)
```bash
cd backend
npx prisma migrate deploy
```
- يطبق migrations المعلقة فقط
- لا ينشئ migrations جديدة
- آمن للاستخدام في Production

### 3. Reset Database
```bash
cd backend
npx prisma migrate reset --force
```
- ⚠️ **يحذف جميع البيانات**
- يحذف جميع الجداول
- يعيد تطبيق جميع migrations من البداية
- يولد Prisma Client

### 4. Generate Prisma Client
```bash
cd backend
npx prisma generate
```
- يولد Prisma Client من schema
- يجب تشغيله بعد أي تغيير في `schema.prisma`

### 5. Prisma Studio
```bash
cd backend
npx prisma studio
```
- يفتح واجهة رسومية لإدارة قاعدة البيانات
- متاح على `http://localhost:5555`

---

## 📁 هيكل الملفات

```
backend/
├── prisma/
│   ├── schema.prisma          # Prisma Schema
│   ├── migrations/            # Migration Files
│   │   └── 20251202170947/
│   │       └── migration.sql
│   └── migration_lock.toml    # Migration Lock
├── prisma.config.ts           # Prisma v7 Config
└── package.json               # Backend Dependencies
```

---

## ⚠️ ملاحظات مهمة

1. **جميع أوامر Prisma يجب تشغيلها من `backend/`**
   - لأن `schema.prisma` موجود في `backend/prisma/schema.prisma`
   - لأن `prisma.config.ts` موجود في `backend/`

2. **Migration Reset يحذف جميع البيانات**
   - استخدم `--force` في non-interactive environment
   - لا تستخدمه في Production!

3. **بعد أي تغيير في `schema.prisma`:**
   ```bash
   cd backend
   npx prisma migrate dev
   ```

4. **في Production (Vercel):**
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

---

## 🚀 سير العمل (Workflow)

### التطوير المحلي:
```bash
# 1. عدّل schema.prisma
# 2. أنشئ migration
cd backend
npx prisma migrate dev --name your_migration_name

# 3. اختبر التغييرات
npm run dev
```

### Production (Vercel):
```bash
# 1. بعد Deploy، شغّل migrations
curl -X POST https://your-project.vercel.app/api/init

# أو من Vercel CLI
cd backend
npx prisma migrate deploy
```

---

**الآن يمكنك استخدام `npm run prisma:*` من الجذر! 🎉**

