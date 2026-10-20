import express from 'express';
import { z } from 'zod';
import type { DatabaseSync } from 'node:sqlite';
import { createHash } from 'node:crypto';

const leadSchema = z.object({
  submissionId: z.uuid(),
  name: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[\p{L}\p{M}\s.'’-]+$/u),
  phone: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{7,14}$/),
  country: z.enum(['MA', 'FR', 'ES', 'BE', 'NL', 'DE', 'GB', 'CA', 'US', 'OTHER']),
  experience: z.enum(['beginner', 'exploring', 'started']),
  interest: z.enum(['create', 'resell', 'unsure']),
  consent: z.literal(true),
  website: z.string().max(300).default(''),
  attribution: z
    .object({
      source: z.string().max(120),
      medium: z.string().max(120),
      campaign: z.string().max(120),
    })
    .default({ source: '', medium: '', campaign: '' }),
});

export interface AppOptions {
  db: DatabaseSync;
  publicOrigin?: string;
  whatsappNumber?: string;
  gaId?: string;
  metaPixelId?: string;
  webhookUrl?: string;
  webhookToken?: string;
}

export function createApp(options: AppOptions) {
  const app = express();
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    });
    next();
  });
  app.use('/api', (_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  app.use(express.json({ limit: '10kb' }));
  const limits = new Map<string, { count: number; expires: number }>();

  app.get('/api/health', (_req, res) => {
    options.db.prepare('SELECT 1').get();
    res.json({ status: 'ok' });
  });

  app.get('/api/config', (_req, res) =>
    res.json({
      whatsappNumber: /^\d{8,15}$/.test(options.whatsappNumber ?? '') ? options.whatsappNumber : '',
      gaId: /^G-[A-Z0-9]+$/.test(options.gaId ?? '') ? options.gaId : '',
      metaPixelId: /^\d+$/.test(options.metaPixelId ?? '') ? options.metaPixelId : '',
    }),
  );

  app.post('/api/leads', async (req, res) => {
    const expectedOrigin = options.publicOrigin || `${req.protocol}://${req.get('host')}`;
    if (req.get('origin') !== expectedOrigin) {
      res.status(403).json({ error: 'origin_not_allowed' });
      return;
    }
    const result = leadSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'invalid_fields' });
      return;
    }
    if (result.data.website) {
      res.status(400).json({ error: 'invalid_submission' });
      return;
    }

    // Retry a successful submission safely, without creating or delivering a second lead.
    try {
      if (options.db.prepare('SELECT id FROM leads WHERE id = ?').get(result.data.submissionId)) {
        res.json({ success: true, id: result.data.submissionId });
        return;
      }
    } catch {
      console.error('Lead storage unavailable; submission was not acknowledged.');
      res.status(503).json({ error: 'storage_unavailable' });
      return;
    }
    const now = Date.now();
    for (const [key, value] of limits) if (value.expires <= now) limits.delete(key);
    const key = createHash('sha256')
      .update(req.ip || 'unknown')
      .digest('hex');
    const limit = limits.get(key) || { count: 0, expires: now + 60_000 };
    if (limit.count >= 8) {
      res.set('Retry-After', '60').status(429).json({ error: 'rate_limited' });
      return;
    }
    limit.count++;
    limits.set(key, limit);

    const lead = result.data;
    const timestamp = new Date().toISOString();
    try {
      options.db
        .prepare(
          `INSERT INTO leads
        (id, created_at, name, phone, country, experience, interest, contact_consent_at, utm_source, utm_medium, utm_campaign)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          lead.submissionId,
          timestamp,
          lead.name,
          lead.phone,
          lead.country,
          lead.experience,
          lead.interest,
          timestamp,
          lead.attribution.source,
          lead.attribution.medium,
          lead.attribution.campaign,
        );
    } catch {
      console.error('Lead storage failed; submission was not acknowledged.');
      res.status(503).json({ error: 'storage_unavailable' });
      return;
    }

    if (options.webhookUrl) {
      try {
        const url = new URL(options.webhookUrl);
        if (url.protocol !== 'https:') throw new Error('HTTPS is required');
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(options.webhookToken ? { Authorization: `Bearer ${options.webhookToken}` } : {}),
          },
          body: JSON.stringify({
            id: lead.submissionId,
            createdAt: timestamp,
            name: lead.name,
            phone: lead.phone,
            country: lead.country,
            experience: lead.experience,
            interest: lead.interest,
            contactConsentAt: timestamp,
            attribution: lead.attribution,
          }),
          signal: AbortSignal.timeout(4000),
          redirect: 'error',
        });
        if (!response.ok) throw new Error('Delivery failed');
        options.db
          .prepare("UPDATE leads SET delivery_status = 'delivered' WHERE id = ?")
          .run(lead.submissionId);
      } catch {
        options.db
          .prepare("UPDATE leads SET delivery_status = 'pending' WHERE id = ?")
          .run(lead.submissionId);
        console.error('CRM delivery pending; lead remains saved in the local database.');
      }
    }
    res.status(201).json({ success: true, id: lead.submissionId });
  });

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'not_found' });
  });
  app.use(
    (
      err: { status?: number },
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      res.status(err.status === 413 ? 413 : 400).json({ error: 'invalid_request' });
    },
  );
  return app;
}
