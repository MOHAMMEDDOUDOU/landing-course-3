# دليل إعداد نظام المصادقة المتقدم

## نظرة عامة
تم تطوير نظام مصادقة متقدم يدعم:
- تسجيل الدخول عبر البريد الإلكتروني وكلمة المرور
- تسجيل الدخول عبر Google OAuth
- إدارة الجلسات المحسنة
- حماية أمنية متقدمة

## المتطلبات
- Node.js 18+
- قاعدة بيانات Neon PostgreSQL
- حساب Google Cloud Console (للمصادقة عبر Google)

## إعداد قاعدة البيانات

### 1. تشغيل SQL Scripts
قم بتشغيل الملفات التالية بالترتيب في قاعدة بيانات Neon:

```sql
-- 1. إنشاء الجداول الأساسية
\i scripts/001_create_users_table.sql

-- 2. إنشاء جدول التسجيلات
\i scripts/002_create_course_enrollments_table.sql

-- 3. إنشاء الجداول المحدثة (يحتوي على جميع التحسينات)
\i scripts/003_create_updated_tables.sql
```

### 2. متغيرات البيئة
أضف المتغيرات التالية إلى ملف `.env.local`:

```env
# قاعدة البيانات
DATABASE_URL=your_neon_database_url
NEON_API_KEY=your_neon_api_key

# JWT Secret
JWT_SECRET=your_very_secure_jwt_secret_key_here

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# البيئة
NODE_ENV=production
```

## إعداد Google OAuth

### 1. إنشاء مشروع في Google Cloud Console
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعّل Google+ API

### 2. إنشاء OAuth 2.0 Credentials
1. اذهب إلى "APIs & Services" > "Credentials"
2. انقر على "Create Credentials" > "OAuth 2.0 Client IDs"
3. اختر "Web application"
4. أضف URIs المصرح بها:
   - `http://localhost:3000` (للتنمية)
   - `https://yourdomain.com` (للإنتاج)
5. احفظ Client ID و Client Secret

### 3. إضافة Google Sign-In إلى التطبيق
1. أضف Client ID إلى متغيرات البيئة
2. تأكد من أن Google Sign-In component يعمل بشكل صحيح

## الميزات الجديدة

### 1. إدارة الجلسات المحسنة
- جلسات آمنة مع توكنات UUID
- انتهاء صلاحية تلقائي للجلسات
- تنظيف تلقائي للجلسات المنتهية الصلاحية

### 2. أمان محسن
- تشفير كلمات المرور باستخدام bcrypt
- JWT tokens للجلسات قصيرة المدى
- Session tokens للجلسات طويلة المدى
- حماية من CSRF attacks

### 3. دعم المصادقة المتعددة
- تسجيل الدخول عبر البريد الإلكتروني
- تسجيل الدخول عبر Google
- ربط الحسابات (Google + Email)

### 4. تتبع المستخدمين
- تسجيل آخر وقت تسجيل دخول
- حالة التحقق من البريد الإلكتروني
- حالة نشاط الحساب

## استخدام النظام

### تسجيل الدخول عبر البريد الإلكتروني
```typescript
const { login } = useAuth()
await login(email, password)
```

### تسجيل الدخول عبر Google
```typescript
const { loginWithGoogle } = useAuth()
await loginWithGoogle(googleCredential)
```

### إنشاء حساب جديد
```typescript
const { register } = useAuth()
await register(email, password, name)
```

### تسجيل الخروج
```typescript
const { logout } = useAuth()
await logout()
```

## الصيانة

### تنظيف الجلسات المنتهية الصلاحية
```sql
-- تشغيل هذا الاستعلام دورياً لتنظيف الجلسات
SELECT cleanup_expired_sessions();
```

### مراقبة الأداء
- راقب جدول `user_sessions` لحجم البيانات
- راقب جدول `users` لآخر تسجيل دخول
- راقب الأخطاء في logs

## استكشاف الأخطاء

### مشاكل شائعة
1. **خطأ في قاعدة البيانات**: تأكد من تشغيل SQL scripts
2. **خطأ في Google OAuth**: تحقق من Client ID و Client Secret
3. **خطأ في الجلسات**: تحقق من JWT_SECRET

### Logs مفيدة
```bash
# مراقبة logs التطبيق
npm run dev

# مراقبة logs قاعدة البيانات في Neon Console
```

## الأمان

### أفضل الممارسات
1. استخدم JWT secrets قوية ومعقدة
2. فعّل HTTPS في الإنتاج
3. راقب محاولات تسجيل الدخول الفاشلة
4. نظف الجلسات المنتهية الصلاحية دورياً
5. استخدم rate limiting للـ API endpoints

### اختبار الأمان
1. اختبر انتهاء صلاحية الجلسات
2. اختبر تسجيل الخروج من جميع الأجهزة
3. اختبر حماية CSRF
4. اختبر تشفير كلمات المرور