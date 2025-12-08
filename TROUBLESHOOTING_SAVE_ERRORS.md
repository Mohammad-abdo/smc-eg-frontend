# استكشاف أخطاء الحفظ - Troubleshooting Save Errors

## ✅ الإصلاحات المطبقة

### 1. Frontend Error Handling ✅
- ✅ قراءة رسالة الخطأ من Backend response
- ✅ عرض رسالة الخطأ الفعلية في toast notifications
- ✅ تسجيل الأخطاء في Console

### 2. Backend Error Handling ✅
- ✅ إضافة `console.error` لتسجيل جميع الأخطاء
- ✅ إرسال رسائل خطأ واضحة مع details
- ✅ معالجة جميع POST/PUT endpoints

## 🔍 كيفية استكشاف الأخطاء

### الخطوة 1: افتح Developer Tools

1. اضغط `F12` أو `Ctrl + Shift + I`
2. اذهب إلى **Console** tab
3. حاول حفظ منتج/قسم/خبر
4. ابحث عن رسائل الخطأ

### الخطوة 2: تحقق من Network Tab

1. في Developer Tools، اذهب إلى **Network** tab
2. حاول حفظ منتج/قسم/خبر
3. ابحث عن request إلى `/api/products` أو `/api/product-categories` أو `/api/news`
4. اضغط على request → اذهب إلى **Response** tab
5. ستجد رسالة الخطأ الفعلية

### الخطوة 3: تحقق من Backend Logs

**إذا كان Backend يعمل محلياً:**
- افتح terminal حيث يعمل `node server.js`
- ستجد error logs هناك

**إذا كان Backend على Vercel:**
- اذهب إلى Vercel Dashboard
- اضغط على **Functions** → **Logs**
- ستجد error logs هناك

## 🐛 الأخطاء الشائعة وحلولها

### 1. "Failed to save: Connection lost to database"

**السبب:** قاعدة البيانات غير متصلة

**الحل:**
1. تحقق من `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=smc_dashboard
   ```

2. تأكد من أن MySQL يعمل:
   ```bash
   # Windows
   net start MySQL80
   
   # أو تحقق من Services
   ```

3. اختبر الاتصال:
   ```bash
   cd backend
   node -e "require('./database').testConnection()"
   ```

### 2. "Failed to save: Field 'name' cannot be null"

**السبب:** حقل مطلوب غير مملوء

**الحل:**
- تأكد من ملء جميع الحقول المطلوبة (Name, NameAr, Slug)
- تحقق من validation في Dashboard

### 3. "Failed to save: Duplicate entry for key 'slug'"

**السبب:** Slug مكرر (يجب أن يكون unique)

**الحل:**
- استخدم slug مختلف
- أو احذف/عدل المنتج/القسم الموجود بنفس slug

### 4. "Failed to save: API Error: 500"

**السبب:** خطأ في Backend (تحقق من logs)

**الحل:**
1. افتح Backend logs
2. ابحث عن error message
3. حل المشكلة حسب الخطأ

### 5. "Failed to save: Network Error" أو "Failed to fetch"

**السبب:** Backend غير متاح أو CORS issue

**الحل:**
1. تأكد من أن Backend يعمل:
   ```bash
   cd backend
   npm start
   ```

2. تحقق من `VITE_API_URL` في `.env`:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

3. تحقق من CORS في `backend/server.js`:
   ```javascript
   app.use(cors()); // يجب أن يكون موجود
   ```

## 📋 Checklist للتحقق

### Backend:
- [ ] Backend يعمل (`node server.js` بدون أخطاء)
- [ ] قاعدة البيانات متصلة (✅ MySQL Database connected)
- [ ] `.env` file موجود في `backend/` مع بيانات صحيحة
- [ ] جميع الجداول موجودة في قاعدة البيانات

### Frontend:
- [ ] `.env` file موجود في الجذر مع `VITE_API_URL`
- [ ] `VITE_USE_MOCK_API=false`
- [ ] Backend يعمل على `http://localhost:3001`

### Network:
- [ ] لا توجد CORS errors في Console
- [ ] API requests تذهب إلى Backend الصحيح
- [ ] Response status ليس 404 أو 500

## 🔧 خطوات التشخيص السريع

### 1. اختبر Backend مباشرة:

```bash
# Test GET
curl http://localhost:3001/api/products

# Test POST
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","nameAr":"اختبار","category":"Mining","status":"active"}'
```

### 2. تحقق من Console في المتصفح:

- افتح Developer Tools → Console
- ابحث عن أي errors
- ابحث عن "Error saving" messages

### 3. تحقق من Network Tab:

- افتح Developer Tools → Network
- حاول حفظ منتج
- اضغط على request → Response
- اقرأ رسالة الخطأ

## ✅ بعد الإصلاحات

الآن عند حدوث خطأ:
- ✅ رسالة خطأ واضحة في Dashboard
- ✅ تفاصيل الخطأ في Console
- ✅ تسجيل الأخطاء في Backend
- ✅ سهولة استكشاف الأخطاء

## 📝 ملاحظات

1. **رسائل الخطأ الآن واضحة:**
   - بدلاً من "Failed to save"
   - ستجد "Failed to save: [سبب الخطأ الفعلي]"

2. **Console Logging:**
   - جميع الأخطاء تُسجل في Console
   - Backend errors تُسجل في terminal/logs

3. **Error Details:**
   - في development mode، ستجد error stack trace
   - في production mode، فقط error message

## 🎯 الخطوات التالية

1. **اختبر الحفظ:**
   - حاول حفظ منتج/قسم/خبر
   - إذا ظهر خطأ، اقرأ الرسالة

2. **تحقق من Console:**
   - افتح Developer Tools → Console
   - ابحث عن error details

3. **حل المشكلة:**
   - حسب رسالة الخطأ، حل المشكلة
   - مثال: إذا كان "Field 'name' cannot be null" → املأ حقل Name

