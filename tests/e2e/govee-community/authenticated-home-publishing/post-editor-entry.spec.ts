import { expect, test } from '@playwright/test';

test('登录用户点击 Post 后显示保存的草稿提示', async ({ page }, testInfo) => {
  testInfo.skip(testInfo.project.name === 'mobile', 'mobile 布局不展示桌面 Post editor 入口');
  const homepageApiPaths = [
    '/bff-app/v1/community/portal/official/portal/circles',
    '/bff-app/v1/official/community/banners',
    '/bff-app/v1/operation/community/official/discovery-postings',
  ];
  const homepageReady = page.waitForResponse((response) => {
    const { hostname, pathname } = new URL(response.url());
    return hostname === 'dev-app2.govee.com'
      && homepageApiPaths.includes(pathname)
      && response.ok();
  }, { timeout: 20_000 });
  await page.goto('/', { waitUntil: 'load' });
  await homepageReady;
  await expect(page.getByRole('heading', { level: 1 }).filter({ visible: true }).first())
    .toBeVisible({ timeout: 15_000 });

  const postLabel = page.locator('div[class*="post-btn"] span')
    .filter({ hasText: /^Post$/ })
    .filter({ visible: true }).first();
  await expect(postLabel).toBeVisible({ timeout: 15_000 });
  const postButton = postLabel.locator('..');
  const draftResponse = page.waitForResponse((response) => (
    response.url() === 'https://dev-app2.govee.com/bff-app/v1/official/community/postings-drafts'
      && response.ok()
  ), { timeout: 15_000 });
  await postButton.click();
  await draftResponse;
  await page.waitForTimeout(5_000);

  await expect(page.getByText(
    'We found a saved draft. Would you like to continue editing it?',
    { exact: true },
  ).filter({ visible: true }).first()).toBeVisible();
});
