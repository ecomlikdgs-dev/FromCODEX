import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route(
    /https:\/\/(www\.googletagmanager\.com|.*google-analytics\.com|connect\.facebook\.net)\//,
    (route) => route.fulfill({ contentType: 'application/javascript', body: '' }),
  );
});

test('Netlify build declares the form and initializes public settings without a Node API', async ({
  page,
}) => {
  const apiRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).pathname.startsWith('/api/')) apiRequests.push(request.url());
  });
  await page.goto('/');
  const declaration = page.locator('form[hidden][name="ecomlik-academy"]');
  await expect(declaration).toHaveAttribute('data-netlify', 'true');
  await expect(declaration).toHaveAttribute('netlify-honeypot', 'website');
  await expect(page.locator('.lead-form')).toHaveAttribute('name', 'ecomlik-academy');
  await page.getByRole('button', { name: 'نوافق على التحليلات', exact: true }).click();
  await expect(page.locator('#ecomlik-ga')).toHaveAttribute(
    'src',
    'https://www.googletagmanager.com/gtag/js?id=G-02NN6XJBCT',
  );
  expect(apiRequests).toEqual([]);
});

test('Netlify AJAX contract includes normalized contact data, consent and attribution before the WhatsApp handoff', async ({
  page,
}) => {
  await page.goto('/?utm_source=youtube&utm_medium=organic&utm_campaign=academy');
  await page.getByRole('button', { name: 'غير الضروري', exact: true }).click();
  const declaredFields = await page
    .locator('form[hidden] input')
    .evaluateAll((inputs) => inputs.map((input) => (input as HTMLInputElement).name));
  let received: URLSearchParams | undefined;
  await page.route('http://127.0.0.1:4174/', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }
    expect(route.request().headers()['content-type']).toBe('application/x-www-form-urlencoded');
    received = new URLSearchParams(route.request().postData()!);
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<p>Form accepted</p>' });
  });
  await page.locator('#name').fill('Test Learner');
  await page.locator('#phone').fill('0600000001');
  await page.locator('.lead-form [name=consent]').check();
  await page.getByRole('button', { name: 'نرسل طلب التسجيل', exact: true }).click();
  await expect(page.locator('.form-success')).toBeVisible();
  expect(received).toBeDefined();
  const fields = received!;
  for (const key of fields.keys()) expect(declaredFields).toContain(key);
  expect(fields.get('form-name')).toBe('ecomlik-academy');
  expect(fields.get('name')).toBe('Test Learner');
  expect(fields.get('phone')).toBe('+212600000001');
  expect(fields.get('consent')).toBe('true');
  expect(fields.get('website')).toBe('');
  expect(fields.get('course')).toBe('Ecomlik Academy');
  expect(fields.get('price_mad')).toBe('4700');
  expect(fields.get('price_usd')).toBe('470');
  expect(fields.get('utm_source')).toBe('youtube');
  expect(fields.get('utm_medium')).toBe('organic');
  expect(fields.get('utm_campaign')).toBe('academy');
  expect(fields.get('submission_id')).toMatch(/^[\da-f-]{36}$/);
  expect(Number.isNaN(Date.parse(fields.get('contact_consent_at')!))).toBe(false);
  const href = await page
    .getByRole('link', { name: 'نرسل رسالتي على واتساب' })
    .getAttribute('href');
  const whatsapp = new URL(href!);
  expect(whatsapp.pathname).toBe('/212650291012');
  expect(whatsapp.searchParams.get('text')).toContain('Test Learner');
  expect(whatsapp.searchParams.get('text')).toContain('Ecomlik Academy');
});

test('failed Netlify submission preserves the form and only a successful retry shows confirmation', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'غير الضروري', exact: true }).click();
  let attempts = 0;
  await page.route('http://127.0.0.1:4174/', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }
    attempts++;
    await route.fulfill({
      status: attempts === 1 ? 503 : 200,
      contentType: 'text/html',
      body: attempts === 1 ? 'Unavailable' : 'Accepted',
    });
  });
  await page.locator('#name').fill('Test Learner');
  await page.locator('#phone').fill('123');
  await page.locator('.lead-form [name=consent]').check();
  await page.getByRole('button', { name: 'نرسل طلب التسجيل', exact: true }).click();
  await expect(page.locator('#phone-error')).toBeVisible();
  expect(attempts).toBe(0);
  await page.locator('#phone').fill('0600000001');
  await page.getByRole('button', { name: 'نرسل طلب التسجيل', exact: true }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.locator('.form-success')).toHaveCount(0);
  await expect(page.locator('#name')).toHaveValue('Test Learner');
  await expect(page.locator('#phone')).toHaveValue('0600000001');
  await page.getByRole('button', { name: 'نرسل طلب التسجيل', exact: true }).click();
  await expect(page.locator('.form-success')).toBeVisible();
  expect(attempts).toBe(2);
});
