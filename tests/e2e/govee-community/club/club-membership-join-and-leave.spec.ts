import { expect, test } from '@playwright/test';

test('登录用户可以加入并退出 Club', async ({ page }, testInfo) => {
  testInfo.skip(testInfo.project.name === 'mobile', 'mobile 首页使用折叠 Clubs 入口，无法稳定选择 Club membership');
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const clubName = '测试圈子置顶';
  const clubEntry = page.getByRole('heading', {
    level: 1,
    name: clubName,
    exact: true,
  }).filter({ visible: true }).first();
  await expect(clubEntry).toBeVisible({ timeout: 15_000 });

  await clubEntry.click();
  await expect(page).toHaveURL(/\/clubs\/[^/]+\/[^/?#]+(?:[/?#]|$)/);

  const join = page.getByRole('button', { name: 'Join', exact: true })
    .filter({ visible: true }).first();
  await expect(join).toBeVisible({ timeout: 10_000 });

  const joinedState = page.getByRole('button', { name: /Joined|Leave/i })
    .filter({ visible: true }).first();
  let joined = false;
  try {
    await join.click();
    joined = true;
    await expect(joinedState).toBeVisible({ timeout: 10_000 });

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(joinedState).toBeVisible({ timeout: 10_000 });
    await joinedState.click();
    const confirm = page.getByRole('button', { name: /confirm|yes|leave/i })
      .filter({ visible: true }).first();
    if (await confirm.isVisible({ timeout: 1_000 }).catch(() => false)) await confirm.click();
    await expect(join).toBeVisible({ timeout: 10_000 });
    joined = false;

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(join).toBeVisible({ timeout: 10_000 });
  } finally {
    if (joined) {
      const leave = page.getByRole('button', { name: /Leave|Joined/i })
        .filter({ visible: true }).first();
      if (await leave.isVisible({ timeout: 1_000 }).catch(() => false)) await leave.click();
      const confirm = page.getByRole('button', { name: /confirm|yes|leave/i })
        .filter({ visible: true }).first();
      if (await confirm.isVisible({ timeout: 1_000 }).catch(() => false)) await confirm.click();
    }
  }
});
