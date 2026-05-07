export type ResultStatus    = 'draft' | 'active' | 'archived';
export type IndicatorType   = 'quantitative' | 'qualitative';
export type IndicatorStatus = 'active' | 'inactive' | 'draft';
export type MeasurementUnit = 'number' | 'percentage' | 'currency' | 'text';

// Real app types (discovered via live execution 2026-05-06)
export type IndicatorConfigType  = 'Input' | 'Roll-Up';
export type IndicatorDataType    = 'Number' | 'Percent' | 'Currency' | 'Num/Den';
export type ReportingFrequency   = 'Monthly' | 'Quarterly' | 'Biannually' | 'Yearly';
export type IndicatorCategory    = 'Financial' | 'Operational' | 'Depth' | 'Reach';

export interface GroupingData {
  name:   string;
  values: string[];
}

export interface InputIndicatorData {
  name:                     string;
  description?:             string;
  groupings?:               GroupingData[];
  dataType:                 IndicatorDataType;
  reportingFrequency:       ReportingFrequency;
  geographicDisaggregation: string[];
  indicatorType:            IndicatorCategory;
  dataSource?:              string;
  methodology?:             string;
  notes?:                   string;
  cumulative?:              boolean;
  kpi?:                     boolean;
}

export interface ResultPayload {
  name:         string;
  value:        number;
  period:       string;
  indicatorId:  string;
  notes?:       string;
  status?:      ResultStatus;
}

export interface IndicatorPayload {
  name:          string;
  code:          string;
  description?:  string;
  type:          IndicatorType;
  unit:          MeasurementUnit;
  baseline?:     number;
  target?:       number;
  status?:       IndicatorStatus;
}

export interface ApiError {
  message:    string;
  statusCode: number;
  errors?:    Record<string, string[]>;
}
