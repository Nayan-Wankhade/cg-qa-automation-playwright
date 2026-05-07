# Rule: Indicator Edit Restrictions (With vs Without Results)

**Applies to:** `flows/edit-indicator.md`

## What the rule says

Editing an indicator's fields depends on whether results have been added.

### Without results — all fields editable

| Field | Editable? |
|---|---|
| Indicator Name | ✅ |
| Description | ✅ |
| Grouping (add values) | ✅ |
| Grouping (delete values) | ✅ |
| Grouping (delete whole group) | ✅ |
| Grouping (cancel selection) | ✅ |
| Data Type | ✅ |
| Reporting Frequency | ✅ |
| Geographic Disaggregation (add) | ✅ |
| Indicator Type | ✅ |
| Data Source | ✅ |
| Methodology | ✅ |
| Notes | ✅ |
| Cumulative flag | ✅ |
| KPI flag | ✅ |

### With results — restricted fields

| Field | Editable? |
|---|---|
| Indicator Name | ✅ |
| Description | ✅ |
| Grouping (add values) | ✅ |
| Grouping (delete values) | ❌ |
| Grouping (delete whole group) | ❌ |
| Grouping (cancel selection) | ❌ |
| Data Type | ❌ |
| Reporting Frequency | ❌ |
| Geographic Disaggregation (add new) | ✅ |
| Geographic Disaggregation (deselect existing) | ❌ |
| Indicator Type | ❌ |
| Data Source | ✅ |
| Methodology | ✅ |
| Notes | ✅ |
| Cumulative flag | ✅ |
| KPI flag | ✅ |

## "HAS RESULTS" indicator

When editing an indicator with results, grouping cards display a
"HAS RESULTS" note to indicate why modifications are restricted.

## Roll-Up indicator edit restrictions

- Indicator Name: editable after creation
- Grouping: NOT editable after creation
- Selected indicators for Summation: can add or delete after creation
- Roll-Up indicator can be deleted

## Notes

- Same restrictions apply to Funder and Implementer (verified via test cases).
- Delete is always available regardless of results.
