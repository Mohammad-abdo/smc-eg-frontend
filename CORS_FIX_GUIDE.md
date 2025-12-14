# CORS Fix Guide - حل مشكلة CORS

## المشكلة
```
Access to fetch at 'https://smc-eg.com/api/tenders' from origin 'https://smc-frontend-weld.vercel.app' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## الحل: إعداد CORS في Backend

يجب إضافة CORS headers في Backend للسماح بطلبات من Frontend domain.

### الخطوة 1: تحديث Backend CORS Configuration

في ملف Backend (عادة `server.js` أو `app.js`)، تأكد من وجود CORS middleware:

```javascript
const cors = require('cors');

// إعداد CORS للسماح بطلبات من Frontend
app.use(cors({
  origin: [
    'https://smc-frontend-weld.vercel.app',  // Frontend على Vercel (Production)
    'http://localhost:8080',                  // للـ local development (Vite default)
    'http://localhost:5173',                  // للـ local development (Vite alternative)
    'http://localhost:3000',                  // للـ local development (alternative)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'X-Request-ID', 
    'X-Session-ID',
    'Cache-Control',
    'Pragma',
  ],
}));
```

### الخطوة 2: إذا كنت تستخدم Express

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// CORS middleware - يجب أن يكون قبل جميع routes
app.use(cors({
  origin: function (origin, callback) {
    // قائمة بالـ origins المسموح بها
    const allowedOrigins = [
      'https://smc-frontend-weld.vercel.app',  // Production frontend
      'http://localhost:8080',                 // Local development (Vite default)
      'http://localhost:5173',                 // Local development (Vite alternative)
      'http://localhost:3000',                // Local development (alternative)
    ];
    
    // السماح بطلبات بدون origin (مثل Postman أو mobile apps)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Request-ID',
    'X-Session-ID',
    'Cache-Control',
    'Pragma',
  ],
}));

// أو بشكل أبسط - السماح لجميع الـ origins (للتطوير فقط)
// app.use(cors({
//   origin: '*',
//   credentials: false,
// }));
```

### الخطوة 3: معالجة Preflight Requests

تأكد من أن Backend يرد على OPTIONS requests بشكل صحيح:

```javascript
// Handle preflight requests
app.options('*', cors()); // Enable preflight for all routes

// أو بشكل أكثر تحديداً
app.options('/api/*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.sendStatus(200);
});
```

### الخطوة 4: إذا كان Backend على Railway

1. تأكد من أن Backend يعمل ويستمع على المنفذ الصحيح
2. تحقق من Environment Variables في Railway
3. أعد نشر Backend بعد تحديث CORS settings

### الخطوة 5: اختبار CORS

بعد تحديث Backend، اختبر من المتصفح:

```javascript
// افتح Browser Console على Frontend
fetch('https://smc-eg.com/api/tenders', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

أو استخدم curl:

```bash
curl -H "Origin: https://smc-frontend-weld.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://smc-eg.com/api/tenders \
     -v
```

يجب أن ترى في Response:
```
Access-Control-Allow-Origin: https://smc-frontend-weld.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## ملاحظات مهمة

1. **CORS هو Backend Configuration** - لا يمكن حله من Frontend فقط
2. **Preflight Requests** - المتصفح يرسل OPTIONS request أولاً قبل GET/POST
3. **Credentials** - إذا كنت تستخدم cookies أو authentication tokens، تأكد من `credentials: true`
4. **Wildcard Origin** - `origin: '*'` لا يعمل مع `credentials: true`

## إذا استمرت المشكلة

1. تحقق من أن Backend يعمل: افتح `https://smc-eg.com/api/tenders` مباشرة في المتصفح
2. تحقق من Network Tab في Browser DevTools - انظر إلى OPTIONS request
3. تحقق من Backend logs - يجب أن ترى OPTIONS request
4. تأكد من أن CORS middleware موجود قبل جميع routes

## مثال كامل لـ Backend Configuration

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'https://smc-frontend-weld.vercel.app',  // Production frontend
    'http://localhost:8080',                 // Local development (Vite default)
    'http://localhost:5173',                 // Local development (Vite alternative)
    'http://localhost:3000',                // Local development (alternative)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Request-ID',
    'X-Session-ID',
    'Cache-Control',
    'Pragma',
  ],
  exposedHeaders: ['Content-Length', 'X-Request-ID'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Handle preflight for all routes
app.options('*', cors(corsOptions));

// Your routes here
app.get('/api/tenders', (req, res) => {
  // Your code
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

