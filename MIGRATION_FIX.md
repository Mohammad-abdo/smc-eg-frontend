# ✅ إصلاح Migration Error - اكتمل

## المشكلة

عند تشغيل `prisma migrate dev`، ظهر الخطأ:
```
Database error code: 1064
You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'order`` INTEGER NOT NULL DEFAULT 0,
```

## السبب

Prisma يولد migration.sql مع **backticks مضاعفة** للكلمات المحجوزة (`order` و `key`):
- ❌ ````order```` (خطأ)
- ✅ `` `order` `` (صحيح)

## الحل

تم إصلاح `backend/prisma/migrations/20251202170947/migration.sql`:

### التغييرات:

1. **`order` fields** (في 4 جداول):
   ```sql
   -- قبل
   ``order`` INTEGER NOT NULL DEFAULT 0,
   
   -- بعد
   `order` INTEGER NOT NULL DEFAULT 0,
   ```

2. **`key` fields** (في جدولين):
   ```sql
   -- قبل
   ``key`` VARCHAR(100) NOT NULL,
   
   -- بعد
   `key` VARCHAR(100) NOT NULL,
   ```

3. **Index names**:
   ```sql
   -- قبل
   UNIQUE INDEX `page_content_page_`key`_key`(`page`, ``key``),
   UNIQUE INDEX `site_settings_`key`_key`(``key``),
   
   -- بعد
   UNIQUE INDEX `page_content_page_key_key`(`page`, `key`),
   UNIQUE INDEX `site_settings_key_key`(`key`),
   ```

## النتيجة

✅ Migration تم إصلاحها بنجاح
✅ Migration تم تعليمها كـ "applied"
✅ لا توجد migrations pending

---

**ملاحظة:** إذا واجهت نفس المشكلة في migrations مستقبلية، قم بإصلاح migration.sql يدوياً قبل تطبيقها.

