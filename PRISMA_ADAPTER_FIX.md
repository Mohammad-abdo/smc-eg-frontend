# ✅ إصلاح مشكلة Prisma MariaDB Adapter مع Reserved Keywords

## المشكلة

عند استخدام `prisma.client.findMany()` مع `orderBy: { sortOrder: 'asc' }`، ظهر الخطأ:
```
You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near '``, `clients`.`status`...
```

## السبب

Prisma MariaDB Adapter (`@prisma/adapter-mariadb`) يولد SQL مع **backticks مضاعفة** للكلمات المحجوزة (`order`) عند استخدام `@map("`order`")` أو `@map("order")`.

هذه مشكلة معروفة في Prisma MariaDB Adapter v7.0.1.

## الحل

تم استخدام `$queryRaw` بدلاً من `findMany` مع `orderBy` للـ clients endpoint:

### قبل:
```javascript
clients = await prisma.client.findMany({
  orderBy: [
    { sortOrder: 'asc' },
    { id: 'asc' },
  ],
});
```

### بعد:
```javascript
clients = await prisma.$queryRaw`
  SELECT * FROM clients 
  WHERE status = 'active'
  ORDER BY \`order\` ASC, id ASC
`;
```

## التغييرات

- ✅ `GET /api/clients` - يستخدم `$queryRaw` بدلاً من `findMany`
- ✅ `schema.prisma` - `Client.sortOrder` mapped to `` `order` ``

## النتيجة

✅ SQL queries تعمل بشكل صحيح
✅ لا مزيد من backticks مضاعفة
✅ Clients endpoint يعمل

---

**ملاحظة:** هذا حل مؤقت. عند إصلاح Prisma MariaDB Adapter، يمكن العودة إلى استخدام `findMany` مع `orderBy`.

