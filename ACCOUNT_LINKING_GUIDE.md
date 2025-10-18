# دليل ربط الحسابات - Account Linking Guide

## 🔗 نظرة عامة

يدعم النظام ربط الحسابات بين طرق المصادقة المختلفة، مما يعني أن المستخدم يمكنه استخدام نفس الإيميل مع:
- تسجيل الدخول عبر Google OAuth
- تسجيل الدخول عبر البريد الإلكتروني وكلمة المرور

## 📋 السيناريوهات المدعومة

### السيناريو 1: Google أولاً، ثم إضافة كلمة مرور
```
1. المستخدم يسجل دخول عبر Google بالإيميل: user@example.com
   → إنشاء حساب جديد مع google_id فقط (بدون password_hash)

2. لاحقاً يحاول التسجيل بنفس الإيميل عبر البريد الإلكتروني
   → النظام يربط كلمة المرور بالحساب الموجود
   → يصبح الحساب يدعم كلا الطريقتين
```

### السيناريو 2: البريد الإلكتروني أولاً، ثم Google
```
1. المستخدم يسجل عبر البريد الإلكتروني: user@example.com
   → إنشاء حساب جديد مع password_hash فقط (بدون google_id)

2. لاحقاً يسجل دخول عبر Google بنفس الإيميل
   → النظام يربط Google ID بالحساب الموجود
   → يصبح الحساب يدعم كلا الطريقتين
```

### السيناريو 3: محاولة تسجيل مكرر
```
1. المستخدم لديه حساب مع كلمة مرور
2. يحاول التسجيل مرة أخرى بنفس الإيميل
   → رسالة خطأ: "البريد الإلكتروني مستخدم بالفعل"
```

## 🔄 آلية العمل التقنية

### 1. في تسجيل الدخول عبر Google (`/api/auth/google`)

```typescript
// البحث عن المستخدم عبر Google ID
let user = await getUserByGoogleId(googleId)

if (!user) {
  // البحث عن المستخدم بالإيميل
  user = await getUserByEmail(email)
  
  if (user) {
    // ربط Google ID بالحساب الموجود
    user = await updateUserGoogleId(user.id, googleId)
  } else {
    // إنشاء حساب جديد
    user = await createUser({
      email,
      name,
      googleId,
      avatarUrl: picture,
    })
  }
}
```

### 2. في التسجيل عبر البريد الإلكتروني (`/api/auth/register`)

```typescript
// البحث عن المستخدم بالإيميل
const existingUser = await getUserByEmail(email)

if (existingUser) {
  // إذا كان الحساب موجود بدون كلمة مرور (Google فقط)
  if (!existingUser.password_hash) {
    // إضافة كلمة المرور للحساب الموجود
    await updateUserPassword(existingUser.id, passwordHash)
    // تسجيل دخول تلقائي
  } else {
    // الحساب موجود مع كلمة مرور، رفض التسجيل
    return error("البريد الإلكتروني مستخدم بالفعل")
  }
} else {
  // إنشاء حساب جديد
  await createUser({ email, passwordHash, name })
}
```

### 3. في تسجيل الدخول عبر البريد الإلكتروني (`/api/auth/login`)

```typescript
const user = await getUserByEmail(email)

if (!user) {
  return error("البريد الإلكتروني أو كلمة المرور غير صحيحة")
}

// إذا كان الحساب مرتبط بـ Google فقط
if (!user.password_hash) {
  return error("هذا الحساب مرتبط بحساب Google فقط. يرجى تسجيل الدخول عبر Google أو إضافة كلمة مرور من صفحة التسجيل")
}

// التحقق من كلمة المرور
const isValid = await verifyPassword(password, user.password_hash)
```

## 🗄️ هيكل قاعدة البيانات

### جدول `users`
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- NULL للحسابات المرتبطة بـ Google فقط
  name VARCHAR(255),
  google_id VARCHAR(255) UNIQUE, -- NULL للحسابات المرتبطة بالبريد الإلكتروني فقط
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### حالات الحساب المختلفة

| الحالة | password_hash | google_id | الوصف |
|--------|---------------|-----------|--------|
| Email Only | ✅ | ❌ | حساب مرتبط بالبريد الإلكتروني فقط |
| Google Only | ❌ | ✅ | حساب مرتبط بـ Google فقط |
| Linked | ✅ | ✅ | حساب مرتبط بكلا الطريقتين |
| Invalid | ❌ | ❌ | حالة غير صحيحة (لا يجب أن تحدث) |

## 🎯 تجربة المستخدم

### للمستخدم الجديد
1. **اختيار طريقة التسجيل**: Google أو البريد الإلكتروني
2. **إنشاء الحساب**: يتم إنشاء حساب بالطريقة المختارة
3. **إضافة طريقة أخرى لاحقاً**: يمكن ربط طريقة أخرى بنفس الإيميل

### للمستخدم الموجود
1. **تسجيل الدخول بالطريقة الأصلية**: يعمل بشكل طبيعي
2. **محاولة تسجيل الدخول بطريقة أخرى**: 
   - إذا كان الحساب مرتبط: يعمل بشكل طبيعي
   - إذا لم يكن مرتبط: رسالة خطأ واضحة

## 🔒 الأمان

### حماية من التضارب
- **إيميل فريد**: كل إيميل يمكن أن يكون مرتبط بحساب واحد فقط
- **Google ID فريد**: كل Google ID يمكن أن يكون مرتبط بحساب واحد فقط
- **ربط آمن**: يتم ربط الحسابات فقط عند التأكد من نفس الإيميل

### رسائل الخطأ الواضحة
- **"البريد الإلكتروني مستخدم بالفعل"**: عند محاولة التسجيل المكرر
- **"هذا الحساب مرتبط بحساب Google فقط"**: عند محاولة تسجيل الدخول بكلمة مرور لحساب Google فقط
- **"البريد الإلكتروني أو كلمة المرور غير صحيحة"**: عند فشل التحقق من البيانات

## 🧪 اختبار النظام

### اختبار ربط الحسابات
1. **إنشاء حساب عبر Google**
2. **محاولة التسجيل بنفس الإيميل عبر البريد الإلكتروني**
3. **التحقق من أن الحساب أصبح يدعم كلا الطريقتين**

### اختبار رسائل الخطأ
1. **محاولة التسجيل المكرر**
2. **محاولة تسجيل الدخول بطريقة خاطئة**
3. **التحقق من وضوح الرسائل**

## 📊 مراقبة النظام

### إحصائيات مفيدة
```sql
-- عدد الحسابات المرتبطة
SELECT 
  COUNT(*) as total_users,
  COUNT(password_hash) as email_linked,
  COUNT(google_id) as google_linked,
  COUNT(CASE WHEN password_hash IS NOT NULL AND google_id IS NOT NULL THEN 1 END) as fully_linked
FROM users;

-- آخر تسجيل دخول لكل نوع
SELECT 
  'Email Login' as login_type,
  COUNT(*) as count
FROM users 
WHERE last_login IS NOT NULL AND password_hash IS NOT NULL
UNION ALL
SELECT 
  'Google Login' as login_type,
  COUNT(*) as count
FROM users 
WHERE last_login IS NOT NULL AND google_id IS NOT NULL;
```

---

هذا النظام يوفر مرونة كاملة للمستخدمين مع الحفاظ على الأمان والوضوح! 🚀