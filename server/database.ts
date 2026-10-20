import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, chmodSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export function openDatabase(path: string) {
  if (path !== ':memory:') mkdirSync(dirname(resolve(path)), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(path);
  if (path !== ':memory:') chmodSync(path, 0o600);
  db.exec(`
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      country TEXT NOT NULL,
      experience TEXT NOT NULL,
      interest TEXT NOT NULL,
      contact_consent_at TEXT NOT NULL,
      utm_source TEXT NOT NULL,
      utm_medium TEXT NOT NULL,
      utm_campaign TEXT NOT NULL,
      delivery_status TEXT NOT NULL DEFAULT 'local'
    );
  `);
  return db;
}
