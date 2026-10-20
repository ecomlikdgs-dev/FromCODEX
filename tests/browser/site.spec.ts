import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  // Never send synthetic test visits to the owner's actual analytics property.
  await page.route(
    /https:\/\/(www\.googletagmanager\.com|.*google-analytics\.com|connect\.facebook\.net)\//,
    (route) => route.fulfill({ contentType: 'application/javascript', body: '' }),
  );
  await page.goto('/?utm_source=browser-test');
});

test('brand, all nine confirmed topics, filters, price switch and FAQ work', async ({ page }) => {
  await page.getByRole('button', { name: 'غير الضروري', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('.brand img')).toBeVisible();
  await expect(page.locator('.curriculum-card')).toHaveCount(9);
  await page.getByRole('button', { name: 'مساعدة AI', exact: true }).click();
  await expect(page.locator('.curriculum-card')).toHaveCount(1);
  await expect(page.locator('.curriculum-card')).toContainText('استعمل AI');
  await page.getByRole('button', { name: 'المسار كامل', exact: true }).click();
  await expect(page.locator('.curriculum-card')).toHaveCount(9);
  await page.getByRole('button', { name: 'كتب وأدلّة', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'كل الأفكار', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(3);
  await page.getByRole('button', { name: 'دولار', exact: true }).click();
  await expect(page.locator('.offer-price>strong')).toHaveText('470دولار');
  await page.getByRole('button', { name: 'درهم', exact: true }).click();
  await expect(page.locator('.offer-price>strong')).toHaveText('4,700درهم');
  await page.getByText('واش الأرباح مضمونة؟', { exact: true }).click();
  await expect(page.locator('details[open]')).toContainText('لا.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('enquiry validates phone, persists and prepares the correct WhatsApp handoff', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'غير الضروري', exact: true }).click();
  await page.locator('#name').fill('Test Learner');
  await page.locator('#phone').fill('123');
  await page.locator('.lead-form [name=consent]').check();
  await page.getByRole('button', { name: 'نحفظ الطلب ونكمل فواتساب', exact: true }).click();
  await expect(page.locator('#phone-error')).toBeVisible();
  await page.locator('#phone').fill('0600000001');
  await page.getByRole('button', { name: 'نحفظ الطلب ونكمل فواتساب', exact: true }).click();
  await expect(page.locator('.form-success')).toBeVisible();
  const handoff = page.getByRole('link', { name: 'نرسل رسالتي على واتساب' });
  const url = new URL((await handoff.getAttribute('href'))!);
  expect(url.hostname).toBe('wa.me');
  expect(url.pathname).toBe('/212650291012');
  expect(url.searchParams.get('text')).toContain('Test Learner');
  expect(url.searchParams.get('text')).toContain('+212600000001');
  expect(url.searchParams.get('text')).toContain('Ecomlik Academy');
});

test('network failure preserves entered information and allows retry', async ({ page }) => {
  await page.getByRole('button', { name: 'غير الضروري', exact: true }).click();
  await page.route('**/api/leads', (route) => route.abort());
  await page.locator('#name').fill('Test Learner');
  await page.locator('#phone').fill('+33600000001');
  await page.locator('.lead-form [name=consent]').check();
  await page.getByRole('button', { name: 'نحفظ الطلب ونكمل فواتساب', exact: true }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.locator('#name')).toHaveValue('Test Learner');
  await expect(page.locator('#phone')).toHaveValue('+33600000001');
  await page.unroute('**/api/leads');
  await page.getByRole('button', { name: 'نحفظ الطلب ونكمل فواتساب', exact: true }).click();
  await expect(page.locator('.form-success')).toBeVisible();
});

test('analytics is opt-in and does not include form field contents; legal dialog closes with Escape', async ({
  page,
}) => {
  await expect(page.locator('#ecomlik-ga')).toHaveCount(0);
  await page.getByRole('button', { name: 'نوافق على التحليلات', exact: true }).click();
  await expect(page.locator('#ecomlik-ga')).toHaveAttribute(
    'src',
    'https://www.googletagmanager.com/gtag/js?id=G-02NN6XJBCT',
  );
  await page.locator('#name').fill('Private Test Name');
  await page.locator('#phone').fill('0600000001');
  await page.locator('#phone').blur();
  const events = await page.evaluate(() => JSON.stringify(window.dataLayer));
  expect(events).toContain('lead_field_completed');
  expect(events).not.toContain('Private Test Name');
  expect(events).not.toContain('0600000001');
  await page.getByRole('button', { name: 'سياسة الخصوصية', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('mobile navigation works and the page remains within narrow viewports', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'Mobile navigation only.');
  await page.getByRole('button', { name: 'غير الضروري', exact: true }).click();
  await page.getByRole('button', { name: 'فتح القائمة', exact: true }).click();
  await expect(page.locator('#main-nav')).toBeVisible();
  await page.locator('#main-nav').getByRole('link', { name: 'شنو غادي تتعلّم' }).click();
  await expect(page.locator('#main-nav')).not.toBeVisible();
  for (const width of [320, 360, 390, 600, 768]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `Overflow at ${width}px`,
    ).toBe(true);
  }
});

test('the visible page has no detected WCAG A/AA accessibility violations', async ({ page }) => {
  await page.getByRole('button', { name: 'غير الضروري', exact: true }).click();
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual(
    [],
  );
});
