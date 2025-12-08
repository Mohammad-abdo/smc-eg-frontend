# 🚀 Quick Start - Prisma Backend

## الخطوات السريعة

### 1. إعداد قاعدة البيانات

```bash
cd backend
npm run setup
```

هذا سيقوم بـ:
- ✅ إنشاء/تحديث `.env` مع DATABASE_URL
- ✅ Generate Prisma Client
- ✅ Run migrations أو push schema

### 2. تشغيل Backend

```bash
cd backend
npm run dev
```

### 3. اختبار API

افتح: `http://localhost:3001/api/health`

يجب أن ترى:
```json
{
  "status": "ok",
  "database": "connected"
}
```

## ✅ ما تم إنجازه

- ✅ جميع endpoints محدثة لاستخدام Prisma
- ✅ DATABASE_URL يتم إنشاؤه تلقائياً
- ✅ Frontend مربوط مع Backend
- ✅ Scripts تلقائية للإعداد

## 📝 ملاحظات

- Backend موجود في `backend/`
- Frontend موجود في `src/`
- API calls تذهب إلى `/api/*` → `backend/server.js`

---

**جاهز للاستخدام! 🎉**

