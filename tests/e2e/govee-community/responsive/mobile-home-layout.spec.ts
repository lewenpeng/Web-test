import { expect, test } from '@playwright/test';

test.use({
  storageState: { cookies: [], origins: [] },
  viewport: { width: 390, height: 844 },
});

test('移动端首页保持核心内容可用', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Discover', { exact: true }).filter({ visible: true }).first()).toBeVisible();
  await expect(page.getByText('All', { exact: true }).filter({ visible: true }).first()).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight, behavior: 'auto' }));
  await expect(page.getByText('Events', { exact: true }).filter({ visible: true }).first()).toBeVisible();
  await expect(page.getByText('Co-Creations', { exact: true }).filter({ visible: true }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Contact Us', exact: true })).toBeVisible({ timeout: 15_000 });
});
