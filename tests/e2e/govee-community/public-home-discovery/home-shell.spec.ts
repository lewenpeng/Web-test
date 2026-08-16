import { expect, test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('公开首页展示核心社区模块', async ({ page }, testInfo) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle('Govee Community');
  if (testInfo.project.name !== 'mobile') {
    await expect(page.getByText('Clubs', { exact: true }).filter({ visible: true }).first()).toBeVisible();
  }
  await expect(page.getByText('Discover', { exact: true }).filter({ visible: true }).first()).toBeVisible();
  for (const label of ['Default', 'All', 'Questions', 'Posts', 'Videos']) {
    await expect(page.getByText(label, { exact: true }).filter({ visible: true }).first()).toBeVisible();
  }
});
