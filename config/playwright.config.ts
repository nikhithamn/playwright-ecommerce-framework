import { defineConfig, devices } from '@playwright/test';
import { Config } from './env.config';

export default defineConfig({
  testDir: '../tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { open: 'never', outputFolder: '../playwright-report' }],
    ['list'],
    ['json', { outputFile: '../test-results/results.json' }],
  ],
  outputDir: '../test-results',

  use: {
    baseURL: Config.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: Config.timeouts.actionTimeout,
    navigationTimeout: Config.timeouts.navigationTimeout,
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },

  expect: {
    timeout: Config.timeouts.expectTimeout,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
