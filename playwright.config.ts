import 'dotenv/config';
import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

const targets = {
  runoob: {
    baseURL: 'https://www.runoob.com/',
  },
  'govee-community': {
    baseURL: 'https://dev-community.govee.com/',
  },
} as const;

const targetName = process.env.TARGET ?? 'runoob';
const target = targets[targetName as keyof typeof targets];

if (!target) {
  throw new Error(
    `未知的 TARGET：${targetName}。可选值：${Object.keys(targets).join(', ')}`,
  );
}

const baseURL = process.env.BASE_URL ?? target.baseURL;
const goveeAuthFile = '.auth/govee-community.auth-state.json';
const requiresGoveeAuthentication = targetName === 'govee-community';
const hasReusableGoveeAuthentication =
  requiresGoveeAuthentication && existsSync(goveeAuthFile);

const browsers = [
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
];

export default defineConfig({
  testDir: `./tests/e2e/${targetName}`,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: requiresGoveeAuthentication
    ? 1
    : process.env.CI
      ? 2
      : undefined,

  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  reporter: [
    ['list'],
    ['html', {
      outputFolder: `playwright-report/${targetName}`,
      open: 'never',
    }],
    ['junit', {
      outputFile: `test-results/${targetName}/junit.xml`,
    }],
  ],

  outputDir: `test-results/${targetName}/artifacts`,

  use: {
    baseURL,
    navigationTimeout: 20_000,
    actionTimeout: 10_000,

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    ...(requiresGoveeAuthentication
      ? [{
          name: 'auth-setup',
          testMatch: /auth\.setup\.ts/,
          use: {
            ...devices['Desktop Chrome'],
            ...(hasReusableGoveeAuthentication
              ? { storageState: goveeAuthFile }
              : {}),
          },
        }]
      : []),
    ...browsers.map((browser) => ({
      name: browser.name,
      testIgnore: requiresGoveeAuthentication
        ? /auth\.setup\.ts/
        : undefined,
      dependencies: requiresGoveeAuthentication ? ['auth-setup'] : [],
      use: {
        ...browser.use,
        ...(requiresGoveeAuthentication
          ? { storageState: goveeAuthFile }
          : {}),
      },
    })),
  ],
});
