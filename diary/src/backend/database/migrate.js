import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

function runMigrations() {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const migrationPath = path.join(__dirname, 'migrations.sql');
    const seedPath = path.join(__dirname, 'seed.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    const seed = fs.readFileSync(seedPath, 'utf8');

    db.exec(sql);
    db.exec(seed);

    console.log('Database migrations applied successfully.');
  } catch (error) {
    console.error('Error applying migrations:', error.message);
  }
}

runMigrations();