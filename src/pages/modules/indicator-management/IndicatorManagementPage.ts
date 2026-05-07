import { test, expect } from '@playwright/test';
import { BasePage }     from '@pages/common/BasePage';

export class IndicatorManagementPage extends BasePage {
  // Dynamic per profile -- navigateToModule() builds the route via UI
  protected readonly path = '/console';

  // Semantic ancestor predicate -- used wherever a grouping pill's icon buttons must
  // be located. Finds the nearest ancestor div that contains at least one button,
  // which is the pill row container regardless of how many Mantine wrapper divs exist.
  // Using a descendant predicate (ancestor::div[.//button][1]) instead of a fixed
  // depth count makes this robust against invisible component-library wrapper divs.
  private readonly PILL_ANCESTOR = 'xpath=ancestor::div[.//button][1]';

  // -- Top-nav Profile dropdown -----------------------------------------------------

  private get profileNavItem() {
    return this.page.getByRole('listitem').filter({ hasText: 'Profile' });
  }
  private profileMenuItem(name?: string) {
    const menu = this.page.getByRole('menu', { name: 'Profile' });
    return name
      ? menu.getByRole('menuitem', { name })
      : menu.getByRole('menuitem').first();
  }
  private get editProfileButton() {
    return this.page.getByRole('button', { name: 'Edit Profile' });
  }
  private get indicatorMgmtNavItem() {
    return this.page.locator('div').filter({ hasText: /^Indicator Management$/ });
  }

  // -- Indicator Management table page ----------------------------------------------

  private get addIndicatorButton() {
    return this.page.getByRole('button', { name: 'Add Indicator' });
  }
  private get createAnIndicatorMenuItem() {
    return this.page.getByRole('menuitem', { name: 'Create an Indicator' });
  }

  // -- Step 1 -- Indicator Setup modal ----------------------------------------------

  private get indicatorNameInput() {
    return this.page.getByRole('textbox', { name: 'Indicator Name' });
  }
  private get descriptionInput() {
    return this.page.getByRole('textbox', { name: 'Description' });
  }
  private get inputRadio() {
    return this.page.getByRole('radio', { name: /^Input Add your portfolio/i });
  }
  private get rollUpRadio() {
    return this.page.getByRole('radio', { name: /^Roll-Up Aggregate data/i });
  }
  private get nextButton() {
    return this.page.getByRole('button', { name: 'Next' });
  }

  // -- Step 2 -- Input configuration modal ------------------------------------------

  private get addNewGroupingButton() {
    return this.page.getByRole('button', { name: 'Add a new grouping' });
  }
  private get groupingNameInput() {
    return this.page.getByRole('textbox', { name: 'Grouping Name' });
  }
  private get saveGroupingButton() {
    return this.page.getByRole('button', { name: 'Save Grouping' });
  }
  private get dataTypeDropdown() {
    return this.page.getByRole('textbox', { name: 'Data Type' });
  }
  private get reportingFreqDropdown() {
    return this.page.getByRole('textbox', { name: 'Reporting Frequency' });
  }
  private get geographicDisaggDropdown() {
    return this.page.getByRole('textbox', { name: 'Geographic disaggregation' });
  }
  private get indicatorTypeDropdown() {
    return this.page.getByRole('textbox', { name: 'Indicator Type' });
  }
  private get dataSourceInput() {
    return this.page.getByRole('textbox', { name: 'Data Source' });
  }
  private get methodologyInput() {
    return this.page.getByRole('textbox', { name: 'Methodology' });
  }
  private get notesInput() {
    return this.page.getByRole('textbox', { name: 'Notes' });
  }
  private get cumulativeCheckbox() {
    return this.page.getByRole('checkbox', { name: 'This is a cumulative indicator' });
  }
  private get kpiCheckbox() {
    return this.page.getByRole('checkbox', { name: 'Mark as KPI?' });
  }
  private get saveButton() {
    return this.page.getByRole('button', { name: 'Save' });
  }

  // -- Table row helpers ------------------------------------------------------------

  private indicatorRow(name: string) {
    return this.page.getByRole('row').filter({ hasText: name });
  }
  private editButton(name: string) {
    return this.page.getByRole('button', { name: `Edit indicator ${name}` });
  }
  private deleteButton(name: string) {
    return this.page.getByRole('button', { name: `Delete indicator ${name}` });
  }
  private infoButton(name: string) {
    return this.page.getByRole('button', { name: `More information about ${name}` });
  }

  // -- Navigation -------------------------------------------------------------------

  async navigateToModule(portfolioName?: string): Promise<void> {
    return test.step('Navigate to Indicator Management module', async () => {
      await this.profileNavItem.click();
      await this.profileMenuItem(portfolioName).click();
      await this.editProfileButton.click();
      await this.page.waitForLoadState('networkidle');
      await this.indicatorMgmtNavItem.click();
      await this.page.waitForLoadState('networkidle');
    });
  }

  // -- Create indicator -- Step 1 ---------------------------------------------------

  async openCreateIndicatorModal(): Promise<void> {
    return test.step('Open Create Indicator modal', async () => {
      await this.addIndicatorButton.click();
      await this.createAnIndicatorMenuItem.click();
      await this.expectModalOpen();
    });
  }

  async fillIndicatorSetup(
    name: string,
    description?: string,
    type: 'Input' | 'Roll-Up' = 'Input',
  ): Promise<void> {
    return test.step(`Fill indicator setup: name "${name}", type "${type}"`, async () => {
      await this.indicatorNameInput.fill(name);
      if (description) await this.descriptionInput.fill(description);
      if (type === 'Input') await this.inputRadio.click();
      else                  await this.rollUpRadio.click();
    });
  }

  async clickNext(): Promise<void> {
    return test.step('Click Next to advance to Step 2', async () => {
      await expect(this.nextButton).toBeEnabled();
      await this.nextButton.click();
    });
  }

  // -- Create indicator -- Step 2 ---------------------------------------------------

  async addGrouping(groupName: string, groupValues: string[]): Promise<void> {
    return test.step(`Add grouping "${groupName}" with ${groupValues.length} values`, async () => {
      await this.addNewGroupingButton.click();
      await this.groupingNameInput.fill(groupName);

      const dialog     = this.page.locator('[role="dialog"]');
      const editInputs = dialog.getByRole('textbox', { name: 'Edit Text' });
      await editInputs.first().fill(groupValues[0]);

      for (let i = 1; i < groupValues.length; i++) {
        // Nearest ancestor div that contains buttons -- robust against Mantine wrappers
        const rowContainer = editInputs.nth(i - 1).locator(this.PILL_ANCESTOR);
        const plusBtn      = rowContainer.getByRole('button').first();
        await expect(plusBtn).toBeEnabled({ timeout: 5_000 });
        await plusBtn.click();
        await editInputs.nth(i).fill(groupValues[i]);
      }

      await this.saveGroupingButton.click();
      await expect(dialog.getByText(groupName, { exact: true }).first()).toBeVisible();
    });
  }

  async selectDataType(value: string): Promise<void> {
    return test.step(`Select Data Type: "${value}"`, async () => {
      await this.dataTypeDropdown.click();
      await this.page.getByRole('option', { name: value }).click();
    });
  }

  async selectReportingFrequency(value: string): Promise<void> {
    return test.step(`Select Reporting Frequency: "${value}"`, async () => {
      await this.reportingFreqDropdown.click();
      await this.page.getByRole('option', { name: value }).click();
    });
  }

  async selectGeographicDisaggregation(values: string[]): Promise<void> {
    return test.step(`Select Geographic disaggregation: ${values.join(', ')}`, async () => {
      await this.geographicDisaggDropdown.click();
      for (const v of values) {
        await this.page.getByRole('option', { name: v, exact: true }).click();
      }
      await this.page.keyboard.press('Escape');
    });
  }

  async selectIndicatorType(value: string): Promise<void> {
    return test.step(`Select Indicator Type: "${value}"`, async () => {
      await this.indicatorTypeDropdown.click();
      await this.page.getByRole('option', { name: value }).click();
    });
  }

  async fillOptionalFields(opts: {
    dataSource?:  string;
    methodology?: string;
    notes?:       string;
    cumulative?:  boolean;
    kpi?:         boolean;
  }): Promise<void> {
    return test.step('Fill optional fields: data source, methodology, notes, cumulative, KPI', async () => {
      if (opts.dataSource)  await this.dataSourceInput.fill(opts.dataSource);
      if (opts.methodology) await this.methodologyInput.fill(opts.methodology);
      if (opts.notes)       await this.notesInput.fill(opts.notes);
      if (opts.cumulative)  await this.cumulativeCheckbox.check();
      if (opts.kpi)         await this.kpiCheckbox.check();
    });
  }

  async saveIndicator(): Promise<void> {
    return test.step('Save indicator and verify modal closes', async () => {
      await expect(this.saveButton).toBeEnabled();
      await this.saveButton.click();
      await this.expectModalClosed();
    });
  }

  // -- Full create flow (Input indicator) -------------------------------------------

  async createInputIndicator(data: {
    name:                     string;
    description?:             string;
    groupings?:               Array<{ name: string; values: string[] }>;
    dataType:                 string;
    reportingFrequency:       string;
    geographicDisaggregation: string[];
    indicatorType:            string;
    dataSource?:              string;
    methodology?:             string;
    notes?:                   string;
    cumulative?:              boolean;
    kpi?:                     boolean;
  }): Promise<void> {
    return test.step(`Create Input indicator: "${data.name}"`, async () => {
      await this.openCreateIndicatorModal();
      await this.fillIndicatorSetup(data.name, data.description, 'Input');
      await this.clickNext();
      for (const g of data.groupings ?? []) {
        await this.addGrouping(g.name, g.values);
      }
      await this.selectDataType(data.dataType);
      await this.selectReportingFrequency(data.reportingFrequency);
      await this.selectGeographicDisaggregation(data.geographicDisaggregation);
      await this.selectIndicatorType(data.indicatorType);
      await this.fillOptionalFields({
        dataSource:  data.dataSource,
        methodology: data.methodology,
        notes:       data.notes,
        cumulative:  data.cumulative,
        kpi:         data.kpi,
      });
      await this.saveIndicator();
    });
  }

  // -- Table assertions -------------------------------------------------------------

  async expectIndicatorInTable(name: string): Promise<void> {
    return test.step(`Verify indicator "${name}" appears in the table`, async () => {
      await expect(this.indicatorRow(name)).toBeVisible();
    });
  }

  async expectIndicatorNotInTable(name: string): Promise<void> {
    return test.step(`Verify indicator "${name}" is not in the table`, async () => {
      await expect(this.indicatorRow(name)).not.toBeVisible();
    });
  }

  async expectKpiPillVisible(indicatorName: string): Promise<void> {
    return test.step(`Verify KPI pill is visible for "${indicatorName}"`, async () => {
      await expect(this.indicatorRow(indicatorName).getByText('KPI')).toBeVisible();
    });
  }

  async expectInfoIconVisible(indicatorName: string): Promise<void> {
    return test.step(`Verify info icon is visible for "${indicatorName}"`, async () => {
      await expect(this.infoButton(indicatorName)).toBeVisible();
    });
  }

  async expectTableColumns(): Promise<void> {
    return test.step('Verify all expected table columns are visible', async () => {
      for (const col of ['Indicator Name', 'Type', 'Source', 'Data Type', 'Last Updated', 'Actions']) {
        await expect(this.page.getByRole('columnheader', { name: col, exact: true })).toBeVisible();
      }
    });
  }

  /**
   * Consolidated post-creation assertion used after every indicator create flow.
   * Covers: table row, all columns, KPI pill (when kpi:true), info icon,
   * Last Updated date, and Edit/Delete action buttons.
   * Info modal content (description, dataSource, methodology) varies per test
   * and must still be verified inline after calling this helper.
   */
  async expectIndicatorCreatedSuccessfully(name: string, opts?: { kpi?: boolean }): Promise<void> {
    return test.step(`Verify indicator "${name}" was created successfully`, async () => {
      await this.expectIndicatorInTable(name);
      await this.expectTableColumns();
      if (opts?.kpi) await this.expectKpiPillVisible(name);
      await this.expectInfoIconVisible(name);
      await this.expectLastUpdatedToday(name);
      await this.expectEditButtonVisible(name);
      await this.expectDeleteButtonVisible(name);
    });
  }

  async expectAddIndicatorButtonVisible(): Promise<void> {
    return test.step('Verify Add Indicator button is visible on the page', async () => {
      await expect(this.addIndicatorButton).toBeVisible();
    });
  }

  async expectNextButtonDisabled(): Promise<void> {
    return test.step('Verify Next button is disabled until required fields are filled', async () => {
      await expect(this.nextButton).toBeDisabled();
    });
  }

  async expectSaveButtonDisabled(): Promise<void> {
    return test.step('Verify Save button is disabled until required fields are filled', async () => {
      await expect(this.saveButton).toBeDisabled();
    });
  }

  async expectConfigurationHeader(): Promise<void> {
    return test.step('Verify configuration header text is displayed', async () => {
      await expect(
        this.page.getByText('How should this indicator be configured?'),
      ).toBeVisible();
    });
  }

  async expectInputTileText(): Promise<void> {
    return test.step('Verify Input indicator tile description text', async () => {
      await expect(this.page.getByText(/Add your portfolio.s operational or financial metrics/i)).toBeVisible();
    });
  }

  async expectRollUpTileText(): Promise<void> {
    return test.step('Verify Roll-Up indicator tile description text', async () => {
      await expect(this.page.getByText(/Aggregate data from your portfolio members/i)).toBeVisible();
    });
  }

  async expectIndicatorBankInfoText(): Promise<void> {
    return test.step('Verify Indicator Bank info text is displayed', async () => {
      await expect(
        this.page.getByText(/Want to add metrics from your organization.*Indicator Bank/i),
      ).toBeVisible();
    });
  }

  /**
   * Asserts that the Indicator Name textbox in the Step 2 modal carries the
   * expected value forward from Step 1.
   */
  async expectStep2NameValue(name: string): Promise<void> {
    return test.step(`Verify indicator name "${name}" carries forward to Step 2`, async () => {
      await expect(
        this.page.locator('[role="dialog"]').getByRole('textbox', { name: 'Indicator Name' }),
      ).toHaveValue(name);
    });
  }

  /**
   * Asserts that a saved grouping pill is visible inside the creation modal.
   * Optionally checks that the comma-separated values string is also shown.
   */
  async expectGroupingPillVisible(groupName: string, values?: string[]): Promise<void> {
    return test.step(`Verify grouping pill "${groupName}" is visible`, async () => {
      const dialog = this.page.locator('[role="dialog"]');
      await expect(dialog.getByText(groupName, { exact: true })).toBeVisible();
      if (values?.length) {
        await expect(dialog.getByText(values.join(', '))).toBeVisible();
      }
    });
  }

  /**
   * Asserts that the Last Updated column for an indicator row shows today's date
   * (formatted as "6 May 2026" by the app).
   */
  async expectLastUpdatedToday(indicatorName: string): Promise<void> {
    return test.step(`Verify Last Updated column shows today's date for "${indicatorName}"`, async () => {
      const today = new Date().toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
      await expect(
        this.indicatorRow(indicatorName)
          .getByText(new RegExp(today.replace(/\s+/g, '\\s+'))),
      ).toBeVisible();
    });
  }

  /** Asserts the Edit (pencil) button is visible in the Actions column. */
  async expectEditButtonVisible(indicatorName: string): Promise<void> {
    return test.step(`Verify Edit button is visible in Actions column for "${indicatorName}"`, async () => {
      await expect(this.editButton(indicatorName)).toBeVisible();
    });
  }

  /** Asserts the Delete (bin) button is visible in the Actions column. */
  async expectDeleteButtonVisible(indicatorName: string): Promise<void> {
    return test.step(`Verify Delete button is visible in Actions column for "${indicatorName}"`, async () => {
      await expect(this.deleteButton(indicatorName)).toBeVisible();
    });
  }

  // -- Info modal -------------------------------------------------------------------

  async openInfoModal(indicatorName: string): Promise<void> {
    return test.step(`Open info modal for "${indicatorName}"`, async () => {
      await this.infoButton(indicatorName).click();
      await expect(this.page.locator('[role="dialog"]')).toBeVisible();
    });
  }

  async expectInfoModalContains(opts: {
    name:         string;
    type?:        string;
    description?: string;
    dataSource?:  string;
    methodology?: string;
  }): Promise<void> {
    return test.step('Verify info modal contains correct indicator details', async () => {
      const modal = this.page.locator('[role="dialog"]');
      await expect(modal.getByText(opts.name)).toBeVisible();
      if (opts.type)        await expect(modal.getByText(opts.type)).toBeVisible();
      if (opts.description) await expect(modal.getByText(opts.description)).toBeVisible();
      if (opts.dataSource)  await expect(modal.getByText(opts.dataSource)).toBeVisible();
      if (opts.methodology) await expect(modal.getByText(opts.methodology)).toBeVisible();
    });
  }

  async closeInfoModal(): Promise<void> {
    return test.step('Close info modal', async () => {
      await this.page.locator('[role="dialog"]').getByRole('button').first().click();
      await expect(this.page.locator('[role="dialog"]')).not.toBeVisible();
    });
  }

  // -- Grouping pill helpers --------------------------------------------------------

  /**
   * Pencil/edit icon in the saved grouping pill -- no accessible name.
   * Strategy: find the groupName <p> element -> walk up to the nearest ancestor
   * div that contains buttons (= the pill row, regardless of Mantine wrapper depth)
   * -> first button is the pencil/edit icon.
   *
   * Using ancestor::div[.//button][1] (descendant predicate) instead of a fixed
   * depth count makes this robust against invisible Mantine wrapper divs.
   */
  private groupingPillEditButton(groupName: string) {
    return this.page.locator('[role="dialog"]')
      .locator('p', { hasText: groupName })
      .locator(this.PILL_ANCESTOR)
      .getByRole('button')
      .first();
  }

  /**
   * Delete (bin) icon in the saved grouping pill -- no accessible name.
   * Pill button order: index 0 = pencil (edit), index 1 = bin (delete), index 2 = cross (deselect).
   * Uses same ancestor predicate as groupingPillEditButton for Mantine wrapper resilience.
   */
  private groupingPillDeleteButton(groupName: string) {
    return this.page.locator('[role="dialog"]')
      .locator('p', { hasText: groupName })
      .locator(this.PILL_ANCESTOR)
      .getByRole('button')
      .nth(1);
  }

  /**
   * Edit an existing grouping pill and append new values to it.
   * Steps 22-25 of IM-E2E-003:
   *   1. Click the pencil icon in the pill (scoped by groupName)
   *   2. For each new value: click "+" on the last filled row, fill the new row
   *   3. Click Save Grouping and wait for the inline form to close
   */
  async editGroupingAddValues(groupName: string, newValues: string[]): Promise<void> {
    return test.step(`Edit grouping "${groupName}" and add ${newValues.length} new value(s)`, async () => {
      // Open edit view via pencil icon
      await this.groupingPillEditButton(groupName).click();

      const dialog     = this.page.locator('[role="dialog"]');
      const editInputs = dialog.getByRole('textbox', { name: 'Edit Text' });

      // Count how many value rows already exist before adding new ones
      const existingCount = await editInputs.count();

      for (let i = 0; i < newValues.length; i++) {
        // Click "+" on the last filled row to append a blank row
        const lastFilledIdx = existingCount + i - 1;
        const rowContainer  = editInputs.nth(lastFilledIdx).locator(this.PILL_ANCESTOR);
        const plusBtn       = rowContainer.getByRole('button').first();
        await expect(plusBtn).toBeEnabled({ timeout: 5_000 });
        await plusBtn.click();

        // Fill the newly appeared blank row
        await editInputs.nth(existingCount + i).fill(newValues[i]);
      }

      // Save; wait for the inline edit form to close
      await dialog.getByRole('button', { name: 'Save Grouping' }).click();
      await expect(dialog.getByRole('button', { name: 'Save Grouping' }))
        .not.toBeVisible({ timeout: 5_000 });
    });
  }

  /**
   * Deletes a saved grouping pill by clicking its bin icon and accepting the
   * native browser confirm dialog. Waits for the pill to disappear.
   * IM-E2E-005 steps 22-23: click Delete icon -> click OK in browser alert.
   */
  async deleteGrouping(groupName: string): Promise<void> {
    return test.step(`Delete grouping "${groupName}" and accept confirmation dialog`, async () => {
      // Register handler before the click -- dialog fires synchronously on click.
      this.page.once('dialog', dialog => dialog.accept());
      await this.groupingPillDeleteButton(groupName).click();
      await expect(
        this.page.locator('[role="dialog"]').locator('p', { hasText: groupName }),
      ).not.toBeVisible({ timeout: 10_000 });
    });
  }

  async expectGroupingDeletedToast(): Promise<void> {
    return test.step('Verify "Grouping deleted successfully" toast is shown', async () => {
      await this.expectSuccessToast('Grouping deleted successfully');
    });
  }

  /**
   * Asserts that a required-field label is visible with its mandatory asterisk
   * inside the creation modal. Live execution confirmed that Mantine renders
   * required field labels as generic div elements (NOT <label> HTML tags) with
   * text content "Field Name *" (e.g. "Data Type *", "Reporting Frequency *").
   * getByText with a anchored regex matches the element regardless of its tag.
   */
  async expectMandatoryAsterisk(fieldLabel: string): Promise<void> {
    return test.step(`Verify mandatory asterisk is shown on "${fieldLabel}" field`, async () => {
      const dialog = this.page.locator('[role="dialog"]');
      await expect(
        dialog.getByText(new RegExp(`^${fieldLabel}\\s*\\*$`)),
      ).toBeVisible();
    });
  }

  // -- Edit / Delete ----------------------------------------------------------------

  async editIndicator(name: string): Promise<void> {
    return test.step(`Open Edit modal for indicator "${name}"`, async () => {
      await this.editButton(name).click();
      await this.expectModalOpen();
    });
  }

  /**
   * Full delete flow: click the Delete button, accept the browser confirm dialog,
   * then wait for the indicator row to disappear from the table.
   * Used by afterEach cleanup to remove test data after a passing test.
   */
  async deleteIndicator(name: string): Promise<void> {
    return test.step(`Delete indicator "${name}" and confirm via dialog`, async () => {
      // Register dialog handler before the click -- confirm fires synchronously.
      this.page.once('dialog', dialog => dialog.accept());
      await this.deleteButton(name).click();
      await this.expectIndicatorNotInTable(name);
    });
  }
}
