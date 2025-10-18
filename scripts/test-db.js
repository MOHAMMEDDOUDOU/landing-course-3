const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testDatabase() {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ تم الاتصال بقاعدة البيانات');
    
    // اختبار إنشاء مستخدم
    console.log('\n1️⃣ اختبار إنشاء مستخدم...');
    const createUserResult = await client.query(`
      INSERT INTO users (email, password_hash, name, email_verified)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, name, created_at
    `, ['test@example.com', 'hashed_password_123', 'Test User', true]);
    
    console.log('✅ تم إنشاء المستخدم:', createUserResult.rows[0]);
    const userId = createUserResult.rows[0].id;
    
    // اختبار إنشاء جلسة
    console.log('\n2️⃣ اختبار إنشاء جلسة...');
    const sessionToken = 'test_session_token_' + Date.now();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 يوم
    
    const createSessionResult = await client.query(`
      INSERT INTO user_sessions (user_id, session_token, expires_at)
      VALUES ($1, $2, $3)
      RETURNING id, session_token, expires_at
    `, [userId, sessionToken, expiresAt]);
    
    console.log('✅ تم إنشاء الجلسة:', createSessionResult.rows[0]);
    
    // اختبار البحث عن المستخدم
    console.log('\n3️⃣ اختبار البحث عن المستخدم...');
    const findUserResult = await client.query(`
      SELECT u.*, s.session_token, s.expires_at
      FROM users u
      LEFT JOIN user_sessions s ON u.id = s.user_id
      WHERE u.email = $1
    `, ['test@example.com']);
    
    console.log('✅ تم العثور على المستخدم:', findUserResult.rows[0]);
    
    // اختبار Google OAuth (إنشاء مستخدم بـ Google ID)
    console.log('\n4️⃣ اختبار Google OAuth...');
    const createGoogleUserResult = await client.query(`
      INSERT INTO users (email, name, google_id, avatar_url, email_verified)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET
        google_id = EXCLUDED.google_id,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, email, name, google_id
    `, [
      'google@example.com', 
      'Google User', 
      'google_123456789', 
      'https://example.com/avatar.jpg',
      true
    ]);
    
    console.log('✅ تم إنشاء/تحديث مستخدم Google:', createGoogleUserResult.rows[0]);
    
    // اختبار ربط الحسابات (إضافة كلمة مرور لحساب Google)
    console.log('\n5️⃣ اختبار ربط الحسابات...');
    const linkAccountResult = await client.query(`
      UPDATE users 
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE email = $2 AND google_id IS NOT NULL
      RETURNING id, email, name, google_id, password_hash IS NOT NULL as has_password
    `, ['new_hashed_password', 'google@example.com']);
    
    if (linkAccountResult.rows.length > 0) {
      console.log('✅ تم ربط الحساب بنجاح:', linkAccountResult.rows[0]);
    } else {
      console.log('⚠️ لم يتم العثور على حساب Google للربط');
    }
    
    // عرض جميع المستخدمين
    console.log('\n6️⃣ عرض جميع المستخدمين...');
    const allUsersResult = await client.query(`
      SELECT id, email, name, google_id, password_hash IS NOT NULL as has_password, 
             email_verified, created_at
      FROM users 
      ORDER BY created_at DESC
    `);
    
    console.log('📋 جميع المستخدمين:');
    allUsersResult.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} (ID: ${user.id})`);
      console.log(`     - الاسم: ${user.name}`);
      console.log(`     - Google ID: ${user.google_id || 'غير موجود'}`);
      console.log(`     - كلمة مرور: ${user.has_password ? 'موجودة' : 'غير موجودة'}`);
      console.log(`     - محقق: ${user.email_verified ? 'نعم' : 'لا'}`);
      console.log(`     - تاريخ الإنشاء: ${user.created_at}`);
      console.log('');
    });
    
    console.log('🎉 تم اختبار قاعدة البيانات بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في اختبار قاعدة البيانات:', error.message);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

testDatabase();