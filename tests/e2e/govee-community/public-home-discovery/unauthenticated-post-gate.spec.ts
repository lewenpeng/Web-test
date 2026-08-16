import { expect, test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('未登录用户点击 Post 时显示登录门禁', async ({ page }, testInfo) => {
  testInfo.skip(testInfo.project.name === 'mobile', 'mobile 布局隐藏桌面 Post 入口，移动端布局另行覆盖');
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const postButton = page.locator('div[class*="post-btn"]');
  if (await postButton.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await postButton.click();
  } else {
    await page.getByText('Post', { exact: true }).filter({ visible: true }).first().click();
  }
  const signInHeading = page.getByText('SIGN IN', { exact: true }).filter({ visible: true }).first();
  await expect(signInHeading).toBeVisible();
  await expect(page.getByRole('textbox').first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Apple|Google/i }).first()).toBeVisible();
  await page.getByRole('img', { name: 'close' }).click();
  await expect(signInHeading).toBeHidden();
});
