import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.route(
    /https:\/\/(www\.googletagmanager\.com|.*google-analytics\.com|connect\.facebook\.net)\//,
    (route) => route.fulfill({ contentType: 'application/javascript', body: '' }),
  );
});

async function gaEvents(page: Page) {
  return page.evaluate(() =>
    (window.dataLayer || [])
      .filter((entry) => {
        return (
          entry && typeof entry === 'object' && (entry as Record<number, unknown>)[0] === 'event'
        );
      })
      .map((entry) => {
        const args = entry as { 1: string; 2: Record<string, unknown> };
        return { name: args[1], params: args[2] };
      }),
  );
}

test('page views include the landing path, referrer and campaign without duplicating preference changes', async ({
  page,
}) => {
  await page.goto(
    '/?utm_source=youtube&utm_medium=organic&utm_campaign=academy&name=PrivateName#join',
    {
      referer: 'https://www.youtube.com/watch?v=private-query',
    },
  );
  await page.getByRole('button', { name: 'نوافق على التحليلات', exact: true }).click();
  const views = (await gaEvents(page)).filter((event) => event.name === 'page_view');
  expect(views).toHaveLength(1);
  expect(views[0].params.page_path).toBe('/');
  expect(views[0].params.page_referrer).toBe('https://www.youtube.com/watch');
  expect(views[0].params.page_location).toBe(
    'http://127.0.0.1:4174/?utm_source=youtube&utm_medium=organic&utm_campaign=academy',
  );
  expect(views[0].params.send_to).toBe('G-02NN6XJBCT');
  expect(views[0].params.page_title).toContain('Ecomlik Academy');
  await page.getByRole('button', { name: 'إعدادات الخصوصية', exact: true }).click();
  await page.getByRole('button', { name: 'نوافق على التحليلات', exact: true }).click();
  expect((await gaEvents(page)).filter((event) => event.name === 'page_view')).toHaveLength(1);
  await expect(page.locator('#ecomlik-ga')).toHaveCount(1);
});

test('registration navigation preserves campaigns and tracks a lead only after an accepted request', async ({
  page,
}) => {
  await page.goto(
    '/?utm_source=youtube&utm_medium=organic&utm_campaign=academy&phone=PrivatePhone',
  );
  await page.getByRole('button', { name: 'نوافق على التحليلات', exact: true }).click();
  await expect(page.locator('.nav-cta')).toHaveAttribute(
    'href',
    '/order?utm_source=youtube&utm_medium=organic&utm_campaign=academy',
  );
  await page.locator('.nav-cta').click();
  await expect(page).toHaveURL(/\/order\?utm_source=youtube/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'طلب التسجيل فـ Ecomlik Academy',
  );
  await expect(page).toHaveTitle('طلب التسجيل | Ecomlik Academy');
  await expect(page.locator('.hero')).toHaveCount(0);
  const pageView = (await gaEvents(page)).find((event) => event.name === 'page_view');
  expect(pageView?.params.page_path).toBe('/order');
  let attempts = 0;
  let submitted: URLSearchParams | undefined;
  await page.route('http://127.0.0.1:4174/', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }
    attempts++;
    submitted = new URLSearchParams(route.request().postData()!);
    await route.fulfill({
      status: attempts === 1 ? 503 : 200,
      contentType: 'text/html',
      body: attempts === 1 ? 'Unavailable' : 'Accepted',
    });
  });
  await page.locator('#name').fill('Private Learner');
  await page.locator('#phone').fill('0600000001');
  await page.locator('.lead-form [name=consent]').check();
  await page.getByRole('button', { name: 'نرسل طلب التسجيل', exact: true }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  expect((await gaEvents(page)).filter((event) => event.name === 'generate_lead')).toHaveLength(0);
  await page.getByRole('button', { name: 'نرسل طلب التسجيل', exact: true }).click();
  await expect(page.locator('.form-success')).toBeVisible();
  expect(submitted!.get('page_path')).toBe('/order');
  expect(submitted!.get('utm_source')).toBe('youtube');
  const leads = (await gaEvents(page)).filter((event) => event.name === 'generate_lead');
  expect(leads).toHaveLength(1);
  expect(leads[0].params.form_id).toBe('ecomlik-academy');
  expect(leads[0].params.send_to).toBe('G-02NN6XJBCT');
  const eventData = JSON.stringify(await gaEvents(page));
  expect(eventData).not.toContain('Private Learner');
  expect(eventData).not.toContain('0600000001');
  expect(eventData).not.toContain('PrivatePhone');
  expect(
    await page.getByRole('link', { name: 'نرسل رسالتي على واتساب' }).getAttribute('href'),
  ).toContain('wa.me/212650291012');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('direct registration works without analytics consent and exposes the deployed configuration', async ({
  page,
  request,
}) => {
  const build = await (await request.get('/deployment.json')).json();
  expect(build.release).toBe('forms-error-recovery-v3');
  expect(build.leadProvider).toBe('netlify_forms');
  expect(build.defaultGaMeasurementId).toBe('G-02NN6XJBCT');
  await page.goto('/order');
  await page.getByRole('button', { name: 'غير الضروري', exact: true }).click();
  await page.route('http://127.0.0.1:4174/', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: 'Accepted' }),
  );
  await page.locator('#name').fill('Test Learner');
  await page.locator('#phone').fill('0600000001');
  await page.locator('.lead-form [name=consent]').check();
  await page.getByRole('button', { name: 'نرسل طلب التسجيل', exact: true }).click();
  await expect(page.locator('.form-success')).toBeVisible();
  await expect(page.locator('#ecomlik-ga')).toHaveCount(0);
  expect(await gaEvents(page)).toEqual([]);
});

test('the registration page has no detected WCAG A/AA violations', async ({ page }) => {
  await page.goto('/order');
  await page.getByRole('button', { name: 'غير الضروري', exact: true }).click();
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual(
    [],
  );
});

test('a missing Netlify form shows an honest WhatsApp recovery path without counting a saved lead', async ({
  page,
  context,
}) => {
  await page.goto('/order');
  await page.getByRole('button', { name: 'نوافق على التحليلات', exact: true }).click();
  await page.route('http://127.0.0.1:4174/', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }
    await route.fulfill({ status: 404, contentType: 'text/html', body: '<h1>Page not found</h1>' });
  });
  await page.locator('#name').fill('Test Learner');
  await page.locator('#phone').fill('0600000001');
  await page.locator('.lead-form [name=consent]').check();
  await page.getByRole('button', { name: 'نرسل طلب التسجيل', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('خدمة التسجيل ما متوفراش دابا');
  await expect(page.getByRole('alert')).toContainText('ما تأكّدناش من حفظ الطلب');
  await expect(page.locator('.form-success')).toHaveCount(0);
  await expect(page.locator('#name')).toHaveValue('Test Learner');
  const recovery = page.getByRole('link', { name: 'نرسل نفس المعلومات فواتساب' });
  const destination = new URL((await recovery.getAttribute('href'))!);
  expect(destination.hostname).toBe('wa.me');
  expect(destination.pathname).toBe('/212650291012');
  expect(destination.searchParams.get('text')).toContain('Test Learner');
  expect(destination.searchParams.get('text')).toContain('+212600000001');
  // Intercept the popup: this test never contacts WhatsApp or sends a message.
  await context.route('https://wa.me/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: 'Intercepted test link' }),
  );
  const popup = context.waitForEvent('page');
  await recovery.click();
  await (await popup).close();
  const events = await gaEvents(page);
  expect(
    events.filter((event) => ['generate_lead', 'lead_submit_success'].includes(event.name)),
  ).toHaveLength(0);
  expect(events.find((event) => event.name === 'whatsapp_click')?.params.location).toBe(
    'form_error',
  );
  const data = JSON.stringify(events);
  expect(data).not.toContain('Test Learner');
  expect(data).not.toContain('0600000001');
});
