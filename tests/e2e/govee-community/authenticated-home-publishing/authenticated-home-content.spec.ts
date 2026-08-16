import { expect, test } from '@playwright/test';

test('登录后首页可访问 Following、Events 和 Co-Creations', async ({ page }, testInfo) => {
  testInfo.skip(testInfo.project.name === 'mobile', 'mobile 布局不展示桌面 Following/Post 导航，使用 mobile-home-layout 覆盖');
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle('Govee Community');
  await expect(page.getByText('Post', { exact: true }).filter({ visible: true }).first()).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText('Sign in', { exact: true }).filter({ visible: true }).first()).toBeHidden();
  for (const label of ['Events', 'Co-Creations']) {
    const tab = page.getByText(label, { exact: true }).filter({ visible: true }).first();
    await expect(tab).toBeVisible({ timeout: 15_000 });
    await tab.click();
    await expect(page.getByText(label, { exact: true }).filter({ visible: true }).first()).toBeVisible();
    await expect(page.getByText(/Sign In|Log in/i).filter({ visible: true }).first())
      .toBeHidden({ timeout: 2_000 });
  }
});
