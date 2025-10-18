const fetch = require('node-fetch');

// اختبار API endpoints
async function testAuth() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 بدء اختبار نظام المصادقة...\n');
  
  // اختبار 1: إنشاء حساب جديد
  console.log('1️⃣ اختبار إنشاء حساب جديد...');
  try {
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('✅ تسجيل:', registerData);
    
    if (registerData.success) {
      console.log('🎉 تم إنشاء الحساب بنجاح!');
      
      // اختبار 2: تسجيل الدخول
      console.log('\n2️⃣ اختبار تسجيل الدخول...');
      const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('✅ تسجيل الدخول:', loginData);
      
      if (loginData.success) {
        console.log('🎉 تم تسجيل الدخول بنجاح!');
        
        // اختبار 3: الحصول على معلومات المستخدم
        console.log('\n3️⃣ اختبار الحصول على معلومات المستخدم...');
        const meResponse = await fetch(`${baseUrl}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Cookie': registerResponse.headers.get('set-cookie') || ''
          }
        });
        
        const meData = await meResponse.json();
        console.log('✅ معلومات المستخدم:', meData);
        
        if (meData.user) {
          console.log('🎉 تم الحصول على معلومات المستخدم بنجاح!');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
  
  // اختبار 4: Google OAuth (فحص التكوين فقط)
  console.log('\n4️⃣ فحص تكوين Google OAuth...');
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (googleClientId && googleClientId !== 'your_google_client_id_here') {
    console.log('✅ Google Client ID مُعرّف:', googleClientId.substring(0, 20) + '...');
  } else {
    console.log('❌ Google Client ID غير مُعرّف بشكل صحيح');
  }
}

// تشغيل الاختبار
testAuth();