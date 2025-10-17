# نظام المصادقة المتقدم - دليل المطور

## 🚀 الميزات الجديدة

تم تطوير نظام مصادقة متقدم يدعم:

### ✅ تسجيل الدخول المتعدد
- **البريد الإلكتروني وكلمة المرور**: نظام تقليدي آمن
- **Google OAuth**: تسجيل دخول سريع وآمن
- **ربط الحسابات**: إمكانية ربط حساب Google بحساب البريد الإلكتروني

### ✅ إدارة الجلسات المحسنة
- **Session Tokens**: جلسات آمنة مع UUID
- **JWT Tokens**: للجلسات قصيرة المدى
- **انتهاء صلاحية تلقائي**: تنظيف الجلسات المنتهية
- **تسجيل الخروج من جميع الأجهزة**: إمكانية إنهاء جميع الجلسات

### ✅ أمان متقدم
- **تشفير كلمات المرور**: باستخدام bcrypt
- **حماية CSRF**: حماية من هجمات Cross-Site Request Forgery
- **تتبع النشاط**: تسجيل آخر وقت تسجيل دخول
- **التحقق من البريد الإلكتروني**: دعم التحقق من البريد الإلكتروني

## 📁 هيكل الملفات المحدثة

```
├── app/api/auth/
│   ├── google/route.ts          # تسجيل الدخول عبر Google
│   ├── login/route.ts           # تسجيل الدخول بالبريد الإلكتروني
│   ├── logout/route.ts          # تسجيل الخروج
│   ├── me/route.ts              # معلومات المستخدم الحالي
│   └── register/route.ts        # إنشاء حساب جديد
├── components/
│   ├── auth-provider.tsx        # مزود المصادقة
│   ├── google-sign-in.tsx       # مكون تسجيل الدخول عبر Google
│   ├── login-form.tsx           # نموذج تسجيل الدخول
│   └── register-form.tsx        # نموذج التسجيل
├── lib/
│   ├── auth.ts                  # دوال المصادقة
│   └── db.ts                    # دوال قاعدة البيانات
└── scripts/
    ├── 001_create_users_table.sql
    ├── 002_create_course_enrollments_table.sql
    └── 003_create_updated_tables.sql  # الجداول المحدثة
```

## 🛠️ الإعداد السريع

### 1. تثبيت التبعيات
```bash
pnpm install
```

### 2. إعداد متغيرات البيئة
انسخ ملف `.env.example` إلى `.env.local` واملأ القيم:

```env
DATABASE_URL=your_neon_database_url
NEON_API_KEY=your_neon_api_key
JWT_SECRET=your_secure_jwt_secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. إعداد قاعدة البيانات
شغل SQL scripts في قاعدة بيانات Neon:

```sql
-- تشغيل بالترتيب
\i scripts/003_create_updated_tables.sql
```

### 4. إعداد Google OAuth
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد
3. فعّل Google+ API
4. أنشئ OAuth 2.0 credentials
5. أضف URIs المصرح بها

### 5. تشغيل التطبيق
```bash
pnpm dev
```

## 🔧 الاستخدام

### تسجيل الدخول
```typescript
import { useAuth } from '@/components/auth-provider'

function LoginComponent() {
  const { login, loginWithGoogle } = useAuth()

  // تسجيل الدخول بالبريد الإلكتروني
  const handleEmailLogin = async () => {
    try {
      await login(email, password)
      // تم تسجيل الدخول بنجاح
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error.message)
    }
  }

  // تسجيل الدخول عبر Google
  const handleGoogleLogin = async (credential) => {
    try {
      await loginWithGoogle(credential)
      // تم تسجيل الدخول بنجاح
    } catch (error) {
      console.error('خطأ في تسجيل الدخول عبر Google:', error.message)
    }
  }
}
```

### إنشاء حساب جديد
```typescript
const { register } = useAuth()

const handleRegister = async () => {
  try {
    await register(email, password, name)
    // تم إنشاء الحساب بنجاح
  } catch (error) {
    console.error('خطأ في التسجيل:', error.message)
  }
}
```

### تسجيل الخروج
```typescript
const { logout } = useAuth()

const handleLogout = async () => {
  try {
    await logout()
    // تم تسجيل الخروج بنجاح
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error.message)
  }
}
```

## 🗄️ قاعدة البيانات

### الجداول الجديدة

#### `users` - جدول المستخدمين
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- NULL للـ OAuth فقط
  name VARCHAR(255),
  google_id VARCHAR(255) UNIQUE, -- لـ Google OAuth
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `user_sessions` - جدول الجلسات
```sql
CREATE TABLE user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 الأمان

### أفضل الممارسات المطبقة
- ✅ تشفير كلمات المرور باستخدام bcrypt
- ✅ JWT tokens آمنة مع انتهاء صلاحية
- ✅ Session tokens مع UUID عشوائي
- ✅ حماية من CSRF attacks
- ✅ تنظيف تلقائي للجلسات المنتهية
- ✅ تسجيل آخر وقت تسجيل دخول

### نصائح إضافية
- استخدم JWT secrets قوية ومعقدة
- فعّل HTTPS في الإنتاج
- راقب محاولات تسجيل الدخول الفاشلة
- نظف الجلسات المنتهية الصلاحية دورياً

## 🐛 استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. خطأ في قاعدة البيانات
```
Error: relation "users" does not exist
```
**الحل**: شغل SQL scripts من مجلد `/scripts`

#### 2. خطأ في Google OAuth
```
Error: Invalid Google credential
```
**الحل**: تحقق من Client ID و Client Secret

#### 3. خطأ في الجلسات
```
Error: Invalid session token
```
**الحل**: تحقق من JWT_SECRET في متغيرات البيئة

## 📊 المراقبة والصيانة

### تنظيف الجلسات المنتهية
```sql
-- تشغيل دوري لتنظيف الجلسات
SELECT cleanup_expired_sessions();
```

### مراقبة الأداء
- راقب حجم جدول `user_sessions`
- راقب آخر تسجيل دخول في `users.last_login`
- راقب الأخطاء في application logs

## 🚀 النشر

### متطلبات الإنتاج
1. **قاعدة بيانات**: Neon PostgreSQL
2. **متغيرات البيئة**: JWT_SECRET قوي
3. **HTTPS**: مطلوب للمصادقة عبر Google
4. **Domain**: مسجل في Google OAuth

### خطوات النشر
1. إعداد متغيرات البيئة في Vercel/Netlify
2. تشغيل SQL scripts في قاعدة البيانات
3. إضافة domain إلى Google OAuth
4. اختبار جميع وظائف المصادقة

## 📞 الدعم

إذا واجهت أي مشاكل:
1. راجع ملف `AUTHENTICATION_SETUP.md`
2. تحقق من logs التطبيق
3. تأكد من إعداد متغيرات البيئة
4. اختبر اتصال قاعدة البيانات

---

**تم تطوير هذا النظام بواسطة AI Assistant** 🤖