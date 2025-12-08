# إعداد Backend على Vercel - دليل سريع

## ✅ الإعدادات الحالية

### 1. Backend Configuration ✅

- ✅ `backend/server.js` - Express server جاهز
- ✅ `backend/vercel.json` - Vercel configuration موجود
- ✅ `backend/database.js` - MySQL connection pool جاهز
- ✅ `backend/package.json` - Dependencies محددة

### 2. Frontend Configuration ✅

- ✅ `vercel.json` - Rewrites للـ `/api/*` إلى `/backend/server.js`
- ✅ `src/services/api.ts` - يستخدم `VITE_API_URL` أو `/api` كـ default

## 🚀 خطوات النشر

### الخطوة 1: إعداد Environment Variables في Vercel

**في Vercel Dashboard → Settings → Environment Variables:**

#### للـ Backend:
```
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=smc_dashboard
PORT=3001
```

#### للـ Frontend:
```
VITE_API_URL=/api
VITE_USE_MOCK_API=false
```

### الخطوة 2: رفع المشروع

```bash
# من الجذر
vercel --prod
```

### الخطوة 3: التحقق

**اختبر Backend:**
```bash
curl https://your-project.vercel.app/api/products
```

**النتيجة المتوقعة:**
```json
[{ "id": 1, "name": "...", ... }]
```

## 📝 ملاحظات

1. **Vercel Rewrites:**
   - `/api/*` → `/backend/server.js`
   - هذا يجعل Backend يعمل كـ Serverless Function

2. **Database:**
   - تأكد من أن قاعدة البيانات متاحة من الإنترنت
   - استخدم MySQL cloud service (PlanetScale, Railway, etc)

3. **CORS:**
   - `app.use(cors())` في `backend/server.js` يسمح بجميع origins
   - هذا آمن لأن Backend محمي بـ authentication

## ✅ النتيجة

بعد النشر:
- ✅ Backend يعمل على `https://your-project.vercel.app/api/*`
- ✅ Frontend يتصل بالـ Backend بنجاح
- ✅ جميع API endpoints تعمل
- ✅ قاعدة البيانات متصلة

