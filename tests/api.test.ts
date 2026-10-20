import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import { createApp } from '../server/app.ts';
import { openDatabase } from '../server/database.ts';

async function fixture(run: (base: string, db: ReturnType<typeof openDatabase>) => Promise<void>) {
  const db = openDatabase(':memory:');
  const app = createApp({
    db,
    publicOrigin: 'https://ecomlik.example',
    whatsappNumber: '212650291012',
    gaId: 'G-02NN6XJBCT',
  });
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('No test listener');
  try {
    await run(`http://127.0.0.1:${address.port}`, db);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((e) => (e ? reject(e) : resolve())));
    db.close();
  }
}
const validLead = () => ({
  submissionId: randomUUID(),
  name: 'Test Learner',
  phone: '+212600000001',
  country: 'MA',
  experience: 'beginner',
  interest: 'create',
  consent: true,
  website: '',
  attribution: { source: 'youtube', medium: 'organic', campaign: 'test' },
});
const post = (base: string, body: unknown, origin = 'https://ecomlik.example') =>
  fetch(`${base}/api/leads`, {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

test('a valid enquiry is saved with consent and attribution; retries are idempotent', async () =>
  fixture(async (base, db) => {
    const lead = validLead();
    const first = await post(base, lead);
    assert.equal(first.status, 201);
    assert.equal((await first.json()).id, lead.submissionId);
    const saved = db.prepare('SELECT * FROM leads WHERE id = ?').get(lead.submissionId)!;
    assert.equal(saved.name, lead.name);
    assert.equal(saved.phone, lead.phone);
    assert.equal(saved.utm_source, 'youtube');
    assert.ok(saved.contact_consent_at);
    const second = await post(base, lead);
    assert.equal(second.status, 200);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM leads').get()!.count, 1);
  }));

test('invalid numbers, absent consent, unknown countries and honeypots are rejected', async () =>
  fixture(async (base, db) => {
    for (const changes of [
      { phone: '123' },
      { consent: false },
      { country: 'UNKNOWN' },
      { website: 'bot.example' },
      { name: '<script>alert(1)</script>' },
    ]) {
      const response = await post(base, { ...validLead(), ...changes });
      assert.equal(response.status, 400);
    }
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM leads').get()!.count, 0);
  }));

test('cross-origin requests cannot create leads', async () =>
  fixture(async (base, db) => {
    assert.equal((await post(base, validLead(), 'https://another.example')).status, 403);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM leads').get()!.count, 0);
  }));

test('the ninth distinct submission per minute is rate limited', async () =>
  fixture(async (base, db) => {
    for (let i = 0; i < 8; i++) assert.equal((await post(base, validLead())).status, 201);
    const response = await post(base, validLead());
    assert.equal(response.status, 429);
    assert.equal(response.headers.get('retry-after'), '60');
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM leads').get()!.count, 8);
  }));

test('health and public settings work; there is no public lead-list endpoint', async () =>
  fixture(async (base) => {
    assert.deepEqual(await (await fetch(`${base}/api/health`)).json(), { status: 'ok' });
    assert.deepEqual(await (await fetch(`${base}/api/config`)).json(), {
      whatsappNumber: '212650291012',
      gaId: 'G-02NN6XJBCT',
      metaPixelId: '',
    });
    assert.equal((await fetch(`${base}/api/leads`)).status, 404);
  }));

test('storage failure returns a failure, never a false success', async () =>
  fixture(async (base, db) => {
    db.exec('DROP TABLE leads');
    const response = await post(base, validLead());
    assert.equal(response.status, 503);
    assert.equal((await response.json()).error, 'storage_unavailable');
  }));
