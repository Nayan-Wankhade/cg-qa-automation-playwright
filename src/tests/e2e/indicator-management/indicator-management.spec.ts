import { test }      from '@fixtures/index';
import { PERSONAS }  from '@constants/personas';
import { TAGS, tcTag } from '@constants/index';
import {
  generateInputIndicatorWithGrouping,
} from '@data/factories/indicator.factory';

// -------------------------------------------------------------------------------
// Indicator Management -- Funder
//
// beforeEach : login as Funder -> navigate to Indicator Management
// afterEach  : delete the indicator created during a PASSING test to keep the
//              app clean; leave it in place on failure for debugging.
//
// Run all tests in this file:   npx playwright test indicator-management
// Run a single TC by ID:        npx playwright test --grep @IM-E2E-001
// Run all Funder tests:         npx playwright test --grep @funder
// -------------------------------------------------------------------------------
test.describe('Indicator Management -- Funder', () => {

  // Tracks the name of the indicator created in each test so afterEach can clean up.
  let createdIndicatorName: string | undefined;

  test.beforeEach(async ({ indicatorPage }) => {
    createdIndicatorName = undefined;
    // Login as Funder -- every test in this describe block uses Funder credentials
    await indicatorPage.login(PERSONAS.funder.email, PERSONAS.funder.password);
    await indicatorPage.navigateToModule();
  });

  test.afterEach(async ({ indicatorPage }, testInfo) => {
    // Delete the created indicator only when the test passed -- leave it on failure
    // so the team can inspect the app state.
    if (testInfo.status === 'passed' && createdIndicatorName) {
      await indicatorPage.deleteIndicator(createdIndicatorName);
    }
    createdIndicatorName = undefined;
  });

  // IM-E2E-001 ------------------------------------------------------------------
  test(
    'IM-E2E-001: Funder creates an Input Indicator with new grouping values',
    { tag: [tcTag('IM-E2E-001'), TAGS.FUNDER, TAGS.INDICATOR_MANAGEMENT, TAGS.REGRESSION] },
    async ({ indicatorPage }) => {
      const data         = generateInputIndicatorWithGrouping({ kpi: true, cumulative: true });
      const { name }     = data;
      createdIndicatorName = name;
      const groupName    = data.groupings![0].name;
      const [valA, valB] = data.groupings![0].values;

      // Step 7 -- Add Indicator button visible
      await indicatorPage.expectAddIndicatorButtonVisible();

      // Step 8 -- Open "Create an Indicator" modal
      await indicatorPage.openCreateIndicatorModal();

      // Steps 10, 12-20 -- modal content validations
      await indicatorPage.expectNextButtonDisabled();
      await indicatorPage.expectConfigurationHeader();
      await indicatorPage.expectInputTileText();
      await indicatorPage.expectRollUpTileText();
      await indicatorPage.expectIndicatorBankInfoText();

      // Steps 9, 21 -- fill name/description, select Input type
      await indicatorPage.fillIndicatorSetup(name, data.description, 'Input');

      // Step 22 -- click Next
      await indicatorPage.clickNext();

      // Step 23 -- name carried through to Step 2
      await indicatorPage.expectStep2NameValue(name);

      // Steps 24-30 -- add grouping with 2 values
      await indicatorPage.addGrouping(groupName, [valA, valB]);

      // Steps 31-38 -- required dropdowns
      await indicatorPage.expectSaveButtonDisabled();
      await indicatorPage.selectDataType(data.dataType);
      await indicatorPage.selectReportingFrequency(data.reportingFrequency);
      await indicatorPage.selectGeographicDisaggregation(data.geographicDisaggregation);
      await indicatorPage.selectIndicatorType(data.indicatorType);

      // Steps 39-43 -- optional fields + checkboxes
      await indicatorPage.fillOptionalFields({
        dataSource:  data.dataSource,
        methodology: data.methodology,
        notes:       data.notes,
        cumulative:  data.cumulative,
        kpi:         data.kpi,
      });

      // Step 44 -- Save
      await indicatorPage.saveIndicator();

      // Steps 45-51 -- post-creation assertions (table row, columns, KPI, info icon,
      //                Last Updated, Edit/Delete buttons)
      await indicatorPage.expectIndicatorCreatedSuccessfully(name, { kpi: true });

      // Step 49 -- open info modal and verify contents
      await indicatorPage.openInfoModal(name);
      await indicatorPage.expectInfoModalContains({
        name,
        type:        data.indicatorType,
        description: data.description,
        dataSource:  data.dataSource,
        methodology: data.methodology,
      });
      await indicatorPage.closeInfoModal();
    },
  );

  // IM-E2E-003 ------------------------------------------------------------------
  test(
    'IM-E2E-003: Funder creates Input Indicator with new grouping, then edits grouping to add a new value',
    { tag: [tcTag('IM-E2E-003'), TAGS.FUNDER, TAGS.INDICATOR_MANAGEMENT, TAGS.REGRESSION] },
    async ({ indicatorPage }) => {
      const data         = generateInputIndicatorWithGrouping({ kpi: true, cumulative: true });
      const { name }     = data;
      createdIndicatorName = name;
      const groupName    = data.groupings![0].name;
      const [valA, valB] = data.groupings![0].values;
      const valC         = `AutoTest-ValC-${Date.now()}`;  // extra value added during grouping edit

      // Steps 7-8 -- open Create an Indicator modal
      await indicatorPage.openCreateIndicatorModal();

      // Steps 9-12 -- fill Indicator Setup: name, description, Input type
      await indicatorPage.fillIndicatorSetup(name, data.description, 'Input');

      // Step 13 -- click Next
      await indicatorPage.clickNext();

      // Step 14 -- name carried through to Step 2
      await indicatorPage.expectStep2NameValue(name);

      // Steps 15-19 -- add new grouping with 2 initial values, save
      await indicatorPage.addGrouping(groupName, [valA, valB]);

      // Steps 20-21 -- pill visible: group name + comma-separated values + 3 action icons
      await indicatorPage.expectGroupingPillVisible(groupName, [valA, valB]);

      // Step 22 -- click pencil icon in pill; Steps 23-24 -- add Val-C; Step 25 -- save
      await indicatorPage.editGroupingAddValues(groupName, [valC]);

      // Step 26 -- pill updated with new value (toast: "Grouping updated successfully")
      await indicatorPage.expectGroupingPillVisible(groupName);

      // Steps 27-28 -- Data Type (mandatory)
      await indicatorPage.expectSaveButtonDisabled();
      await indicatorPage.selectDataType(data.dataType);

      // Steps 29-30 -- Reporting Frequency (mandatory)
      await indicatorPage.selectReportingFrequency(data.reportingFrequency);

      // Steps 31-32 -- Geographic disaggregation (mandatory)
      await indicatorPage.selectGeographicDisaggregation(data.geographicDisaggregation);

      // Steps 33-34 -- Indicator Type (mandatory)
      await indicatorPage.selectIndicatorType(data.indicatorType);

      // Steps 35-39 -- optional fields + cumulative + KPI checkboxes
      await indicatorPage.fillOptionalFields({
        dataSource:  data.dataSource,
        methodology: data.methodology,
        notes:       data.notes,
        cumulative:  data.cumulative,
        kpi:         data.kpi,
      });

      // Step 40 -- save indicator
      await indicatorPage.saveIndicator();

      // Steps 41-47 -- post-creation assertions (table row, columns, KPI, info icon,
      //                Last Updated, Edit/Delete buttons)
      await indicatorPage.expectIndicatorCreatedSuccessfully(name, { kpi: true });

      // Step 45 -- open info modal, verify fields, close
      await indicatorPage.openInfoModal(name);
      await indicatorPage.expectInfoModalContains({
        name,
        type:        data.indicatorType,
        description: data.description,
        dataSource:  data.dataSource,
        methodology: data.methodology,
      });
      await indicatorPage.closeInfoModal();
    },
  );

  // IM-E2E-005 ------------------------------------------------------------------
  test(
    'IM-E2E-005: Funder creates Input Indicator -- adds grouping then deletes it, completes creation without grouping',
    { tag: [tcTag('IM-E2E-005'), TAGS.FUNDER, TAGS.INDICATOR_MANAGEMENT, TAGS.REGRESSION] },
    async ({ indicatorPage }) => {
      // kpi: true, cumulative defaults to false -- grouping will be deleted during the test
      const data         = generateInputIndicatorWithGrouping({ kpi: true });
      const { name }     = data;
      createdIndicatorName = name;
      const groupName    = data.groupings![0].name;
      const [valA, valB] = data.groupings![0].values;

      // Step 4 -- SKIP: alternate way (click portfolio from "Your Portfolio" section)

      // Steps 7-8 -- open Create an Indicator modal
      await indicatorPage.openCreateIndicatorModal();

      // Step 10 -- Next disabled until mandatory Indicator Name is filled
      await indicatorPage.expectNextButtonDisabled();

      // Steps 9, 11-12 -- fill Indicator Setup: name, description, Input type
      await indicatorPage.fillIndicatorSetup(name, data.description, 'Input');

      // Step 13 -- advance to Step 2
      await indicatorPage.clickNext();

      // Step 14 -- Indicator Name carries forward to Step 2
      await indicatorPage.expectStep2NameValue(name);

      // Steps 15-19 -- add new grouping with 2 values and save
      await indicatorPage.addGrouping(groupName, [valA, valB]);

      // Steps 20-21 -- pill visible with group name + comma-separated values + 3 icons
      await indicatorPage.expectGroupingPillVisible(groupName, [valA, valB]);

      // Steps 22-23 -- click Delete (bin) icon in pill, accept browser confirm alert
      await indicatorPage.deleteGrouping(groupName);

      // Step 24 -- toast confirms deletion
      await indicatorPage.expectGroupingDeletedToast();

      // Steps 25-26 -- select Data Type (mandatory -- asterisk present)
      await indicatorPage.selectDataType(data.dataType);
      await indicatorPage.expectMandatoryAsterisk('Data Type');

      // Steps 27-28 -- select Reporting Frequency (mandatory -- asterisk present)
      await indicatorPage.selectReportingFrequency(data.reportingFrequency);
      await indicatorPage.expectMandatoryAsterisk('Reporting Frequency');

      // Steps 29-30 -- select Geographic disaggregation (mandatory -- asterisk present)
      await indicatorPage.selectGeographicDisaggregation(data.geographicDisaggregation);
      await indicatorPage.expectMandatoryAsterisk('Geographic disaggregation');

      // Steps 31-32 -- select Indicator Type (mandatory -- asterisk present)
      await indicatorPage.selectIndicatorType(data.indicatorType);
      await indicatorPage.expectMandatoryAsterisk('Indicator Type');

      // Steps 33-37 -- optional text fields, cumulative (false), KPI (true)
      await indicatorPage.fillOptionalFields({
        dataSource:  data.dataSource,
        methodology: data.methodology,
        notes:       data.notes,
        cumulative:  data.cumulative,
        kpi:         data.kpi,
      });

      // Step 38 -- save indicator (no grouping attached)
      await indicatorPage.saveIndicator();

      // Steps 39-47 -- post-creation assertions (table row, columns, KPI, info icon,
      //                Last Updated, Edit/Delete buttons)
      await indicatorPage.expectIndicatorCreatedSuccessfully(name, { kpi: true });

      // Step 43 -- open info modal, verify read-only fields, close via X icon
      await indicatorPage.openInfoModal(name);
      await indicatorPage.expectInfoModalContains({
        name,
        type:        data.indicatorType,
        description: data.description,
        dataSource:  data.dataSource,
        methodology: data.methodology,
      });
      await indicatorPage.closeInfoModal();
    },
  );

});
