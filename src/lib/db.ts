import Database from 'better-sqlite3';
import { readFileSync, mkdirSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import type { DbRow } from "./types";

const DB_PATH = process.env.DATABASE_PATH || join(process.cwd(), 'data', 'erp.db');
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  const dir = dirname(DB_PATH);
  try { mkdirSync(dir, { recursive: true }); } catch { /* ignore */ }

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  runMigrations(db);

  return db;
}

function runMigrations(database: Database.Database): void {
  database.exec(`CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT (datetime('now')));`);
  const applied = new Set((database.prepare('SELECT name FROM _migrations').all() as DbRow[]).map((r: DbRow) => String(r.name)));
  const dir = join(process.cwd(),'db','migrations');
  const files = readdirSync(dir).filter((f: string) => f.endsWith('.sql')).sort();
  for (const f of files) {
    if (applied.has(f)) continue;
    const sql = readFileSync(join(dir,f),'utf8');
    database.exec(sql);
    database.prepare('INSERT INTO _migrations (name) VALUES (?)').run(f);
  }
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}