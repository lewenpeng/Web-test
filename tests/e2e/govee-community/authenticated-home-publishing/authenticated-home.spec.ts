import { expect, test } from '@playwright/test';

test('登录状态可访问账号态首页内容', async ({ page }, testInfo) => {
  testInfo.skip(testInfo.project.name === 'mobile', 'mobile 布局不展示桌面 Following/Post 导航，使用 mobile-home-layout 覆盖');
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveTitle('Govee Community');
  await expect(page.getByText('Post', { exact: true }).filter({ visible: true }).first())
    .toBeVisible({ timeout: 15_000 });
  await expect(page.getByText('Sign in', { exact: true }).filter({ visible: true }).first())
    .toBeHidden();
  await expect(
    page.getByText('Events', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Co-Creations', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
});
