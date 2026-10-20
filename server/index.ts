import 'dotenv/config';
import express from 'express';
import { resolve } from 'node:path';
import { createApp } from './app.ts';
import { openDatabase } from './database.ts';
import { business } from '../src/content.ts';

const production = process.env.NODE_ENV === 'production';
if (production && !process.env.PUBLIC_ORIGIN)
  throw new Error(
    'Set PUBLIC_ORIGIN to the HTTPS origin used by visitors before starting production.',
  );
const db = openDatabase(process.env.DATABASE_PATH || './data/ecomlik.sqlite');
const app = createApp({
  db,
  publicOrigin: process.env.PUBLIC_ORIGIN,
  whatsappNumber: process.env.WHATSAPP_NUMBER || business.whatsappNumber,
  gaId: process.env.GA_MEASUREMENT_ID || business.gaId,
  metaPixelId: process.env.META_PIXEL_ID,
  webhookUrl: process.env.LEAD_WEBHOOK_URL,
  webhookToken: process.env.LEAD_WEBHOOK_TOKEN,
});

if (!production) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true, hmr: { port: Number(process.env.PORT || 3000) + 20_000 } },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(resolve('dist'), { maxAge: '1h', index: false }));
  app.get('/{*path}', (_req, res) => res.sendFile(resolve('dist/index.html')));
}

const server = app.listen(Number(process.env.PORT || 3000), process.env.HOST || '0.0.0.0', () => {
  console.log(
    `Ecomlik listening on port ${process.env.PORT || 3000} (${production ? 'production' : 'development'})`,
  );
});
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () =>
    server.close(() => {
      db.close();
      process.exit(0);
    }),
  );
