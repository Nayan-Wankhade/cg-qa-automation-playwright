import { test as base }            from '@playwright/test';
import { IndicatorManagementPage } from '@pages/modules/indicator-management/IndicatorManagementPage';

interface CgFixtures {
  indicatorPage: IndicatorManagementPage;
}

export const test = base.extend<CgFixtures>({

  indicatorPage: async ({ page }, use) => {
    await use(new IndicatorManagementPage(page));
  },

});

export { expect } from '@playwright/test';
