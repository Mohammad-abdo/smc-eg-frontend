# 🌱 Database Seed Script - دليل استخدام

## ✅ ما تم إنجازه

تم إنشاء seed script شامل لملء قاعدة البيانات ببيانات أولية:

### الملف: `backend/prisma/seed.js`

## 📊 البيانات المضافة

### 1. Product Categories (3)
- Industrial Products (المنتجات الصناعية)
- Mining Products (منتجات التعدين)
- Construction Products (منتجات البناء)

### 2. Products (3)
- Heavy Duty Excavator (حفار ثقيل)
- Industrial Conveyor Belt (سير ناقل صناعي)
- Cement Mixer Truck (شاحنة خلاطة أسمنت)

### 3. News Articles (2)
- New Product Launch (إطلاق منتج جديد)
- Industry Conference 2024 (مؤتمر الصناعة 2024)

### 4. Banners (2)
- Welcome to SMC
- Quality Products

### 5. Users (3)
- Admin User (admin@smc.com)
- Editor User (editor@smc.com)
- Viewer User (viewer@smc.com)

### 6. Board Members (3)
- John Doe (CEO)
- Jane Smith (CTO)
- Ahmed Ali (CFO)

### 7. Clients (3)
- ABC Corporation
- XYZ Industries
- Global Mining Co.

### 8. Financial Data
- Revenue: 4 records (2021-2024)
- Production: 4 months
- Export: 4 regions

### 9. Site Settings (4)
- company_name
- company_email
- company_phone
- company_address

### 10. Page Content (4)
- About page (title, description)
- Contact page (title, description)

---

## 🚀 كيفية الاستخدام

### من مجلد `backend/`:
```bash
cd backend
npm run seed
```

### من الجذر:
```bash
npm run prisma:seed
```

---

## ⚠️ ملاحظات مهمة

### 1. حذف البيانات الموجودة
الـ seed script **يحذف جميع البيانات الموجودة** قبل إضافة البيانات الجديدة. إذا كنت تريد الاحتفاظ بالبيانات الموجودة، علّق على هذا الجزء:

```javascript
// Clear existing data
await prisma.tenderSubmission.deleteMany();
// ... إلخ
```

### 2. Reserved Keywords
الـ seed script يستخدم `$queryRaw` للجداول التي تحتوي على `order` field لتجنب مشكلة Prisma MariaDB adapter:
- `product_categories`
- `banners`
- `members`
- `clients`

### 3. JSON Fields
الـ products تحتوي على `specificationsTable` كـ JSON، تم stringify قبل الإدراج.

---

## 📝 التخصيص

يمكنك تعديل `backend/prisma/seed.js` لإضافة:
- منتجات أكثر
- أخبار أكثر
- مستخدمين أكثر
- أي بيانات أخرى

---

## ✅ النتيجة

بعد تشغيل `npm run seed`:

```
✅ Database seed completed successfully!

📊 Summary:
   - 3 categories
   - 3 products
   - 2 news articles
   - 2 banners
   - 3 users
   - 3 board members
   - 3 clients
   - 4 revenue records
   - 4 site settings
   - 4 page content items
```

---

**الآن قاعدة البيانات مليئة ببيانات أولية جاهزة للاستخدام! 🎉**

