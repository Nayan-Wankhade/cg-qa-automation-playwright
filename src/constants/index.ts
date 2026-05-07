export const ROUTES = {
  LOGIN:      '/authenticate?mode=login',
  DASHBOARD:  '/console',
  // Add one entry per module as they are discovered:
  INDICATORS: (profileId: string) => `/console/${profileId}/indicator-management`,
  // RESULTS: (profileId: string) => `/console/${profileId}/results-management`,
} as const;

/**
 * Static persona / smoke / regression tags.
 *
 * For per-test TC ID tags use tcTag() instead:
 *   { tag: [tcTag('IM-E2E-003'), TAGS.FUNDER] }
 *
 * Run a single TC:          npx playwright test --grep @IM-E2E-003
 * Run all funder tests:     npx playwright test --grep @funder
 * Run smoke suite:          npx playwright test --grep @smoke
 * Run by module:            npx playwright test --grep @indicator-management
 */
export const TAGS = {
  FUNDER:               '@funder',
  IMPLEMENTER:          '@implementer',
  BOTH:                 '@both',
  SMOKE:                '@smoke',
  REGRESSION:           '@regression',
  INDICATOR_MANAGEMENT: '@indicator-management',
} as const;

/**
 * Converts a TC ID into a Playwright tag string.
 * tcTag('IM-E2E-003') -> '@IM-E2E-003'
 *
 * Usage in a test:
 *   test('IM-E2E-003: scenario', { tag: [tcTag('IM-E2E-003'), TAGS.FUNDER, TAGS.SMOKE] }, ...)
 */
export const tcTag = (tcId: string): string => `@${tcId}`;

export const MESSAGES = {
  INDICATOR: {
    CREATED:          'Indicator Created Successful',
    UPDATED:          'Indicator updated successfully',
    DELETED:          'Indicator deleted successfully',
    GROUPING_CREATED: 'Grouping created successfully',
  },
  AUTH: {
    LOGIN_FAILED: 'Invalid email or password',
  },
} as const;

export const TIMEOUTS = {
  SHORT:    5_000,
  DEFAULT: 10_000,
  LONG:    30_000,
} as const;
