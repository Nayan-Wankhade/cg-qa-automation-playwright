import type { InputIndicatorData } from '../../types/domain.types';

export const generateInputIndicatorData = (
  overrides?: Partial<InputIndicatorData>,
): InputIndicatorData => {
  const ts = Date.now();
  return {
    name:                     `AutoTest-Indicator-${ts}`,
    description:              `AutoTest-Description-${ts}`,
    dataType:                 'Number',
    reportingFrequency:       'Quarterly',
    geographicDisaggregation: ['India'],
    indicatorType:            'Operational',
    dataSource:               `AutoTest-Source-${ts}`,
    methodology:              `AutoTest-Methodology-${ts}`,
    notes:                    `AutoTest-Notes-${ts}`,
    cumulative:               false,
    kpi:                      false,
    ...overrides,
  };
};

export const generateInputIndicatorWithGrouping = (
  overrides?: Partial<InputIndicatorData>,
): InputIndicatorData => {
  const ts = Date.now();
  return generateInputIndicatorData({
    groupings: [
      { name: `AutoTest-Group-${ts}`, values: [`Val-A-${ts}`, `Val-B-${ts}`] },
    ],
    ...overrides,
  });
};

export const generateKpiIndicatorData = (
  overrides?: Partial<InputIndicatorData>,
): InputIndicatorData =>
  generateInputIndicatorData({ kpi: true, ...overrides });
