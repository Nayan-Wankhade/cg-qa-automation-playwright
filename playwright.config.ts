import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

// Fail fast if required env vars are missing -- shows a clear error instead of
// a 30-second "Invalid email or password" timeout deep inside a test.
const GLOBAL_SETUP = './src/fixtures/global.setup.ts';

// Each run gets its own timestamped directory so reports accumulate and are
// never overwritten. Format: YYYY-MM-DD_HH-MM-SS
const runTimestamp = new Date()
  .toISOString()
  .replace('T', '_')
  .replace(/:/g, '-')
  .slice(0, 19);

const runDir = `reports/runs/${runTimestamp}`;

export default defineConfig({

  globalSetup:   GLOBAL_SETUP,
  testDir:       './src/tests',
  testMatch:     '**/*.spec.ts',
  outputDir:     `./${runDir}/attachments`,   // screenshots, videos, traces
  fullyParallel: true,
  retries:       process.env.CI ? 2 : 1,
  workers:       process.env.CI ? 2 : 4,
  timeout:       60_000,

  reporter: [
    ['html',  { outputFolder: `${runDir}/html`,              open: 'on-failure' }],
    ['junit', { outputFile:   `${runDir}/junit/results.xml` }],
    ['list'],
    // JSON reporter — machine-readable, useful for trend dashboards
    ['json',  { outputFile:   `${runDir}/results.json` }],
  ],

  use: {
    baseURL:           process.env.BASE_URL,
    headless:          true,
    screenshot:        'only-on-failure',
    video:             'retain-on-failure',
    trace:             'on-first-retry',
    actionTimeout:     20_000,
    navigationTimeout: 30_000,
  },

  projects: [

    // ── E2E — full browser tests ──────────────────────────────────────────────
    {
      name: 'e2e',
      use:  { ...devices['Desktop Chrome'] },
    },

  ],
});
