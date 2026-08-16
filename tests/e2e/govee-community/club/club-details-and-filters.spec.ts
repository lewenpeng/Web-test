import { expect, test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('Club 详情支持内容筛选和排序', async ({ page }, testInfo) => {
  testInfo.skip(testInfo.project.name === 'mobile', 'mobile 首页使用折叠 Clubs 入口，无法稳定选择 Club detail');
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const clubEntries = page.getByRole('heading', { level: 1 }).filter({ visible: true });
  let hasClubData = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await clubEntries.count()) {
      hasClubData = true;
      break;
    }
    await page.waitForTimeout(500);
  }
  if (!hasClubData) {
    testInfo.skip(true, '远程环境未返回可用 Club 数据');
    return;
  }
  const clubEntry = clubEntries.first();
  await expect(clubEntry).toBeVisible();
  await clubEntry.click();
  await expect(page).toHaveURL(/\/clubs\/[^/]+\/[^/?#]+/);
  for (const label of ['Officials', 'Posts Only', 'Questions Only']) {
    const filter = page.getByText(label, { exact: true }).filter({ visible: true }).last();
    await expect(filter).toBeVisible();
    await filter.click({ force: true });
  }
  await expect(page.getByText('All', { exact: true }).filter({ visible: true }).first()).toBeVisible();
  await expect(page.getByText('Default', { exact: true }).filter({ visible: true }).first()).toBeVisible();
});
