import { expect, test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('搜索打开热门搜索并显示结果状态', async ({ page }, testInfo) => {
  testInfo.skip(testInfo.project.name === 'mobile', 'mobile 布局隐藏桌面搜索编辑器，移动端导航另行覆盖');
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  // The search control is a contenteditable editor whose placeholder is exposed as data-placeholder.
  const search = page.locator('#search-input');
  if (!(await search.isVisible({ timeout: 3_000 }).catch(() => false))) {
    const searchIcon = page.locator('[class*="search-icon"]').filter({ visible: true }).first();
    await expect(searchIcon).toBeVisible({ timeout: 10_000 });
    await searchIcon.click();
  }
  await expect(search).toBeVisible({ timeout: 15_000 });
  await search.click();
  await expect(page.getByText('Trending Searches', { exact: true }).filter({ visible: true }).first()).toBeVisible();
  const query = page.locator('#search-input');
  await expect(query).toBeVisible();
  await query.fill('light');
  await query.press('Enter');
  await expect(page.getByText(/light|No results|empty/i).filter({ visible: true }).first()).toBeVisible();
});
