import { expect, test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('Support 页面展示分类并支持进入详情', async ({ page }) => {
  await page.goto('/support', { waitUntil: 'domcontentloaded' });
  for (const label of ['Setup Guides', 'Troubleshooting', 'Tech Specs', 'Video Guide', 'Rapid Replacement']) {
    await expect(page.getByText(label, { exact: true }).filter({ visible: true }).first()).toBeVisible();
  }
  await expect(page.getByText(/Alexa|Google Assistant|Siri/i).filter({ visible: true }).first()).toBeVisible();
  await expect(page.getByText(/support@|contact/i).filter({ visible: true }).first()).toBeVisible();
  const setup = page.getByRole('link', { name: 'Setup Guides', exact: true });
  await expect(setup).toHaveAttribute('href', '/support/faqs/section/35-setup-guides');
  await page.goto('/support/faqs/section/35-setup-guides', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/support\/faqs\/section\/35-setup-guides/);
  await page.goBack();
  await expect(page.getByText('Setup Guides', { exact: true }).filter({ visible: true }).first()).toBeVisible();
});
