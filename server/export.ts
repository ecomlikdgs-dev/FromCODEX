import 'dotenv/config';
import { openDatabase } from './database.ts';

const db = openDatabase(process.env.DATABASE_PATH || './data/ecomlik.sqlite');
const columns = [
  'id',
  'created_at',
  'name',
  'phone',
  'country',
  'experience',
  'interest',
  'contact_consent_at',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'delivery_status',
];
const quote = (value: unknown) => {
  let text = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};
process.stdout.write('\uFEFF' + columns.join(',') + '\n');
for (const row of db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all())
  process.stdout.write(columns.map((c) => quote(row[c])).join(',') + '\n');
db.close();
