const { Pool } = require('pg');
const fs = require('fs');

// تحميل متغيرات البيئة
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function createTables() {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ تم الاتصال بقاعدة البيانات');
    
    // قراءة ملف SQL
    const sqlContent = fs.readFileSync('scripts/003_create_updated_tables.sql', 'utf8');
    
    // تقسيم SQL إلى statements منفصلة
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 تنفيذ ${statements.length} statement...`);
    
    // تنفيذ كل statement منفصلاً
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await client.query(statement);
          console.log(`✅ Statement ${i + 1} تم تنفيذه بنجاح`);
        } catch (error) {
          console.log(`⚠️ Statement ${i + 1} تخطى (قد يكون موجود بالفعل):`, error.message);
        }
      }
    }
    
    console.log('✅ تم إنشاء الجداول بنجاح');
    
    // فحص الجداول
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'user_sessions')
    `);
    
    console.log('📋 الجداول الموجودة:', tablesResult.rows.map(row => row.table_name));
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء الجداول:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

createTables();