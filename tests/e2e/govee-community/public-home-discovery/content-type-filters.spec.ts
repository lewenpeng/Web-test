import { expect, test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('Discover 内容类型筛选可切换', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const discover = page.getByText('Discover', { exact: true }).filter({ visible: true }).first();
  await expect(discover).toBeVisible();
  for (const label of ['Questions', 'Posts', 'Videos', 'All']) {
    const filter = page.getByText(label, { exact: true }).filter({ visible: true }).first();
    await expect(filter).toBeVisible();
    await filter.click();
    await expect(discover).toBeVisible();
  }
});
