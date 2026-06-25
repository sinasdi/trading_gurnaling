const db = require('pg');
const fs = require('fs');
const path = require('path');

const migrationSQL = fs.readFileSync(
  path.join(__dirname, 'init.sql'),
  'utf8'
);

const migrate = async () => {
  try {
    const pool = new db.Pool({
      connectionString: process.env.DATABASE_URL
    });

    console.log('🔄 Running migrations...');
    await pool.query(migrationSQL);
    console.log('✅ Migrations completed successfully!');
    
    await pool.end();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  migrate();
}

module.exports = migrate;
