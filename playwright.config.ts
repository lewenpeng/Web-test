import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL;

if (!baseURL) {
  throw new Error(
    '缺少 BASE_URL，例如：$env:BASE_URL="https://test.example.com"',
  );
}

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,

  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  reporter: [
    ['list'],
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never',
    }],
    ['junit', {
      outputFile: 'test-results/junit.xml',
    }],
  ],

  outputDir: 'test-results/artifacts',

  use: {
    baseURL,
    navigationTimeout: 20_000,
    actionTimeout: 10_000,

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: devices['Desktop Chrome'],
    },
    {
      name: 'firefox',
      use: devices['Desktop Firefox'],
    },
    {
      name: 'webkit',
      use: devices['Desktop Safari'],
    },
    {
      name: 'mobile',
      use: devices['iPhone 15'],
    },
  ],
});