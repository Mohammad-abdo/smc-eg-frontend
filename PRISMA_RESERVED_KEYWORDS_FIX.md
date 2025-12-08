# ✅ إصلاح مشكلة Reserved Keywords في Prisma

## المشكلة

عند استخدام `prisma.client.findMany()` مع `orderBy: { order: 'asc' }`، ظهر الخطأ:
```
You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near '``, `clients`.`status`...
```

## السبب

Prisma Client يولد SQL مع **backticks مضاعفة** للكلمات المحجوزة (`order` و `key`) عند استخدام `@map("`order`")` مع backticks داخل الـ string.

## الحل

تم تغيير `@map()` في `schema.prisma` لإزالة backticks من داخل الـ string:

### قبل:
```prisma
order     Int      @default(0) @map("`order`")
key       String   @db.VarChar(100) @map("`key`")
```

### بعد:
```prisma
order     Int      @default(0) @map("order")
key       String   @db.VarChar(100) @map("key")
```

## التغييرات

تم تحديث جميع الحقول في `backend/prisma/schema.prisma`:
- ✅ `ProductCategory.order` - `@map("order")`
- ✅ `Banner.order` - `@map("order")`
- ✅ `Member.order` - `@map("order")`
- ✅ `Client.order` - `@map("order")`
- ✅ `PageContent.key` - `@map("key")`
- ✅ `SiteSetting.key` - `@map("key")`

## النتيجة

✅ Prisma Client تم إعادة توليده
✅ SQL queries تعمل بشكل صحيح
✅ لا مزيد من backticks مضاعفة

---

**ملاحظة:** Prisma يتعامل تلقائياً مع الكلمات المحجوزة في SQL، لذا لا حاجة لـ backticks في `@map()`.

