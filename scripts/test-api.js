const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

// اختبار API endpoints
async function testAPI() {
  console.log('🧪 بدء اختبار API المصادقة...\n');
  
  // اختبار 1: إنشاء حساب جديد
  console.log('1️⃣ اختبار إنشاء حساب جديد...');
  try {
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'api-test@example.com',
        password: 'password123',
        name: 'API Test User'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('📤 طلب التسجيل:', {
      status: registerResponse.status,
      data: registerData
    });
    
    if (registerData.success) {
      console.log('✅ تم إنشاء الحساب بنجاح!');
      
      // اختبار 2: تسجيل الدخول
      console.log('\n2️⃣ اختبار تسجيل الدخول...');
      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'api-test@example.com',
          password: 'password123'
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('📤 طلب تسجيل الدخول:', {
        status: loginResponse.status,
        data: loginData
      });
      
      if (loginData.success) {
        console.log('✅ تم تسجيل الدخول بنجاح!');
        
        // اختبار 3: الحصول على معلومات المستخدم
        console.log('\n3️⃣ اختبار الحصول على معلومات المستخدم...');
        const meResponse = await fetch('http://localhost:3000/api/auth/me', {
          method: 'GET',
          headers: {
            'Cookie': registerResponse.headers.get('set-cookie') || ''
          }
        });
        
        const meData = await meResponse.json();
        console.log('📤 طلب معلومات المستخدم:', {
          status: meResponse.status,
          data: meData
        });
        
        if (meData.user) {
          console.log('✅ تم الحصول على معلومات المستخدم بنجاح!');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ خطأ في اختبار API:', error.message);
    console.log('\n💡 تأكد من أن الخادم يعمل على http://localhost:3000');
  }
  
  // اختبار 4: Google OAuth (فحص التكوين فقط)
  console.log('\n4️⃣ فحص تكوين Google OAuth...');
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (googleClientId && googleClientId !== 'your_google_client_id_here') {
    console.log('✅ Google Client ID مُعرّف:', googleClientId.substring(0, 20) + '...');
    console.log('✅ Google OAuth جاهز للاستخدام');
  } else {
    console.log('❌ Google Client ID غير مُعرّف بشكل صحيح');
  }
  
  // اختبار 5: فحص قاعدة البيانات
  console.log('\n5️⃣ فحص قاعدة البيانات...');
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT COUNT(*) as user_count FROM users
    `);
    console.log('✅ عدد المستخدمين في قاعدة البيانات:', result.rows[0].user_count);
    
    const sessionsResult = await client.query(`
      SELECT COUNT(*) as session_count FROM user_sessions
    `);
    console.log('✅ عدد الجلسات في قاعدة البيانات:', sessionsResult.rows[0].session_count);
    
    client.release();
    await pool.end();
  } catch (error) {
    console.error('❌ خطأ في فحص قاعدة البيانات:', error.message);
  }
}

// تشغيل الاختبار
testAPI();