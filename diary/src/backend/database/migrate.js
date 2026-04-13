
const fs = require('fs');
const path = require('path');
const db = require('./db');

function runMigrations() {
  try {
    const migrationPath = path.join(__dirname, 'migrations.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    db.exec(sql);

    console.log('Database migrations applied successfully.');
  } catch (error) {
    console.error('Error applying migrations:', error.message);
  }
}

runMigrations();