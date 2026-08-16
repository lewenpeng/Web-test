import { test, expect } from '@playwright/test';

test('远程网站首页可以访问', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.ok()).toBeTruthy();
  await expect(page).toHaveURL(/https?:\/\//);
  await expect(page.locator('body')).toBeVisible();
});