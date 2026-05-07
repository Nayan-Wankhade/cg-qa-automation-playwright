import { type Page, type Response, test, expect } from '@playwright/test';
import { ROUTES, TIMEOUTS }                        from '@constants/index';

export abstract class BasePage {
  protected readonly page: Page;
  protected abstract readonly path: string;

  constructor(page: Page) {
    this.page = page;
  }

  // -- Auth -------------------------------------------------------------------------

  async login(email: string, password: string): Promise<void> {
    return test.step('Login to the application', async () => {
      await this.page.goto(ROUTES.LOGIN);
      await this.page.getByRole('textbox', { name: 'Work Email' }).fill(email);
      await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
      await this.page.getByRole('button', { name: /login/i }).click();
      await this.page.waitForURL(
        url => !url.toString().includes('/authenticate'),
        { timeout: 30_000 },
      );
      await this.page.waitForLoadState('networkidle');
    });
  }

  // -- Navigation -------------------------------------------------------------------

  async navigateTo(): Promise<void> {
    return test.step('Navigate to module page', async () => {
      await this.page.goto(this.path);
      await this.page.waitForLoadState('networkidle');
    });
  }

  async waitForPageReady(): Promise<void> {
    return test.step('Wait for page to be ready', async () => {
      await this.page.waitForLoadState('networkidle');
    });
  }

  // -- Toasts -----------------------------------------------------------------------

  // Private helper -- shared two-layer defence for all toast assertions:
  //   Layer 1 -- :not(#redwood-announcer) excludes the Redwood.js screen-reader
  //              announcer injected into every page. It always has role="alert"
  //              and is always empty, so .first() without this guard resolves to it.
  //   Layer 2 -- .filter({ hasText: /\S/ }) skips ANY element with blank text,
  //              making this robust against future empty ARIA live regions whose
  //              IDs are not yet known.
  private async expectToast(
    locatorString: string,
    stepLabel:     string,
    message?:      string,
  ): Promise<void> {
    return test.step(stepLabel, async () => {
      const toast = this.page
        .locator(locatorString)
        .filter({ hasText: /\S/ })
        .first();
      await expect(toast).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
      if (message) await expect(toast).toContainText(message);
    });
  }

  async expectSuccessToast(message?: string): Promise<void> {
    return this.expectToast(
      '[role="alert"]:not(#redwood-announcer), [data-testid="toast-success"]',
      message ? `Verify success toast: "${message}"` : 'Verify success toast is visible',
      message,
    );
  }

  async expectErrorToast(message?: string): Promise<void> {
    return this.expectToast(
      '[data-testid="toast-error"], [role="alert"]:not(#redwood-announcer)',
      message ? `Verify error toast: "${message}"` : 'Verify error toast is visible',
      message,
    );
  }

  // -- Field errors -----------------------------------------------------------------

  async expectFieldError(testId: string, message?: string): Promise<void> {
    return test.step(
      message ? `Verify field error on "${testId}": "${message}"` : `Verify field error on "${testId}"`,
      async () => {
        const error = this.page.getByTestId(`${testId}-error`);
        await expect(error).toBeVisible({ timeout: TIMEOUTS.SHORT });
        if (message) await expect(error).toContainText(message);
      },
    );
  }

  // -- Modal ------------------------------------------------------------------------

  async expectModalOpen(title?: string): Promise<void> {
    return test.step(
      title ? `Verify modal is open: "${title}"` : 'Verify modal is open',
      async () => {
        const modal = this.page.locator('[role="dialog"]');
        await expect(modal).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
        if (title) await expect(modal).toContainText(title);
      },
    );
  }

  async expectModalClosed(): Promise<void> {
    return test.step('Verify modal is closed', async () => {
      await expect(this.page.locator('[role="dialog"]')).not.toBeVisible();
    });
  }

  // -- Table ------------------------------------------------------------------------

  async expectRowInTable(text: string): Promise<void> {
    return test.step(`Verify row "${text}" is visible in table`, async () => {
      await expect(
        this.page.getByRole('row').filter({ hasText: text }),
      ).toBeVisible({ timeout: TIMEOUTS.DEFAULT });
    });
  }

  async expectRowNotInTable(text: string): Promise<void> {
    return test.step(`Verify row "${text}" is not visible in table`, async () => {
      await expect(
        this.page.getByRole('row').filter({ hasText: text }),
      ).not.toBeVisible();
    });
  }

  async clickRowAction(rowText: string, action: string): Promise<void> {
    return test.step(`Click "${action}" action on row "${rowText}"`, async () => {
      const row = this.page.getByRole('row').filter({ hasText: rowText });
      await row.getByRole('button', { name: action }).click();
    });
  }

  // -- Loading ----------------------------------------------------------------------

  async waitForLoadingToFinish(): Promise<void> {
    return test.step('Wait for loading spinner to finish', async () => {
      const spinner = this.page.locator('[data-testid="loading-spinner"]');
      try {
        await expect(spinner).toBeVisible({ timeout: 2_000 });
        await expect(spinner).not.toBeVisible({ timeout: TIMEOUTS.LONG });
      } catch {
        // spinner never appeared -- fine
      }
    });
  }

  // -- Network ----------------------------------------------------------------------

  async waitForApiResponse(urlPattern: string | RegExp): Promise<Response> {
    return test.step('Wait for API response', async () => {
      return this.page.waitForResponse(
        (r) =>
          (typeof urlPattern === 'string'
            ? r.url().includes(urlPattern)
            : urlPattern.test(r.url())) && r.status() < 400,
        { timeout: TIMEOUTS.LONG },
      );
    });
  }
}
