import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import { waitForGoveeVerificationCode } from './qq-mail';

const authFile = path.resolve('.auth/govee-community.auth-state.json');

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`缺少环境变量 ${name}`);
  }

  return value;
}

test('登录 Govee Community 并保存认证状态', async ({ page }) => {
  test.setTimeout(180_000);

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle('Govee Community');

  const signInButton = page.getByText('Sign in', { exact: true });
  const followingTab = page.getByText('Following', { exact: true });

  await expect(signInButton.or(followingTab)).toBeVisible({ timeout: 20_000 });

  if (await followingTab.isVisible()) {
    await mkdir(path.dirname(authFile), { recursive: true });
    await page.context().storageState({
      path: authFile,
      indexedDB: true,
    });
    return;
  }

  const email = requiredEnvironmentVariable('GOVEE_TEST_EMAIL');
  const password = requiredEnvironmentVariable('GOVEE_TEST_PASSWORD');
  const qqImapAuthCode = requiredEnvironmentVariable('QQ_IMAP_AUTH_CODE');

  await signInButton.click();

  const signInTextboxes = page.getByRole('textbox');
  await signInTextboxes.nth(0).fill(email);
  await signInTextboxes.nth(1).fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();

  const newDevicePrompt = page.getByText(
    /You are logging in to Govee Home on a new device/,
  );

  await expect(newDevicePrompt.or(followingTab)).toBeVisible();

  if (await newDevicePrompt.isVisible()) {
    const verificationRequestedAt = new Date();
    await page.getByRole('button', { name: 'Confirm' }).click();

    const verificationHeading = page.getByRole('heading', {
      name: 'E-mail verification',
    });
    await expect(verificationHeading).toBeVisible();

    const verificationCode = await waitForGoveeVerificationCode({
      email,
      authCode: qqImapAuthCode,
      requestedAfter: verificationRequestedAt,
    });

    const codeInputs = page.getByRole('textbox');
    await expect(codeInputs).toHaveCount(4);
    await codeInputs.first().click();
    await page.keyboard.type(verificationCode, { delay: 100 });

    const confirmButton = page.getByRole('button', { name: 'Confirm' });
    await expect(confirmButton).toBeEnabled();
    await confirmButton.click();
    await expect(verificationHeading).toBeHidden();
  }

  await expect(followingTab).toBeVisible({ timeout: 20_000 });

  await mkdir(path.dirname(authFile), { recursive: true });
  await page.context().storageState({
    path: authFile,
    indexedDB: true,
  });
});
